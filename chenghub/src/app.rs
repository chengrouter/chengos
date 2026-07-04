//! Application assembly: `serve`, `migrate`, and `admin` entry points.
//!
//! `serve` wires ports to adapters exactly once. Redis failures at startup
//! (or `redis.enabled = false`) swap in local fallbacks — rate limits fail
//! open and OAuth state moves to an in-process store (single-instance only).
//!
//! Graceful shutdown order: mark unready (load balancer drains) -> stop
//! HTTP accept + drain in-flight requests -> cancel the cleanup loop.

use std::net::SocketAddr;
use std::sync::Arc;

use tokio_util::sync::CancellationToken;

use crate::api::health::HealthState;
use crate::api::{router, ApiState};
use crate::config::AppConfig;
use crate::domain::moderation::{AuditActorType, NewAuditEvent};
use crate::domain::roles::Role;
use crate::error::HubError;
use crate::ports::identity_repository::{IdentityCleanup, UserRepo};
use crate::ports::rate_limit::{NoopRateLimiter, RateLimiter};
use crate::security::oauth_state::{MemoryStateStore, OAuthStateStore};
use crate::security::token::TokenHasher;
use crate::services::abuse_service::AbuseService;
use crate::services::admin_service::AdminService;
use crate::services::comment_service::CommentService;
use crate::services::device_flow_service::DeviceFlowService;
use crate::services::identity_service::IdentityService;
use crate::services::moderation_service::ModerationService;
use crate::services::oauth::ProviderRegistry;
use crate::services::post_service::PostService;
use crate::services::reaction_service::ReactionService;
use crate::services::requirement_service::RequirementService;
use crate::services::search_service::SearchService;
use crate::services::workflow_share_service::WorkflowShareService;
use crate::storage::postgres::{connect, migrator, verify_migrations, PgRepos};
use crate::storage::redis::{
    oauth_state::RedisStateStore, rate_limit::RedisRateLimiter, RedisHandle,
};
use crate::telemetry::metrics::Metrics;

pub enum AdminCmd {
    CreateUser { username: String, display_name: Option<String> },
    GrantRole { username: String, role: String },
    RevokeRole { username: String, role: String },
    ShowConfig,
}

/// Apply pending migrations. The only command that mutates schema.
pub async fn migrate(config: AppConfig) -> anyhow::Result<()> {
    let pool = connect(&config.database).await?;
    migrator().run(&pool).await?;
    println!("migrations applied");
    Ok(())
}

/// Operational admin commands.
pub async fn admin(config: AppConfig, cmd: AdminCmd) -> anyhow::Result<()> {
    if let AdminCmd::ShowConfig = cmd {
        println!("{}", config.redacted_debug());
        return Ok(());
    }

    let pool = connect(&config.database).await?;
    let repos = PgRepos::new(pool);

    fn cli_audit(action: &str, subject_id: String, details: serde_json::Value) -> NewAuditEvent {
        NewAuditEvent {
            actor_type: AuditActorType::Cli,
            actor: "cli".to_string(),
            action: action.to_string(),
            subject_type: "user".to_string(),
            subject_id,
            details,
            request_id: None,
        }
    }

    match cmd {
        AdminCmd::CreateUser { username, display_name } => {
            let display = display_name.unwrap_or_else(|| username.clone());
            let user = repos.create(&username, &display).await?;
            println!("user created: {} ({})", user.username, user.id);
        }
        AdminCmd::GrantRole { username, role } => {
            let role = Role::parse(&role)
                .ok_or_else(|| anyhow::anyhow!("unknown role {role:?} (user|moderator|operator|admin)"))?;
            let user = repos
                .get_by_username(&username)
                .await?
                .ok_or_else(|| anyhow::anyhow!("user {username:?} not found"))?;
            let granted = repos
                .grant_role(
                    user.id,
                    role,
                    None,
                    cli_audit(
                        "role.grant",
                        user.id.to_string(),
                        serde_json::json!({ "role": role.as_str() }),
                    ),
                )
                .await?;
            println!(
                "{}",
                if granted { "role granted" } else { "role was already granted" }
            );
        }
        AdminCmd::RevokeRole { username, role } => {
            let role = Role::parse(&role)
                .ok_or_else(|| anyhow::anyhow!("unknown role {role:?} (user|moderator|operator|admin)"))?;
            let user = repos
                .get_by_username(&username)
                .await?
                .ok_or_else(|| anyhow::anyhow!("user {username:?} not found"))?;
            let revoked = repos
                .revoke_role(
                    user.id,
                    role,
                    cli_audit(
                        "role.revoke",
                        user.id.to_string(),
                        serde_json::json!({ "role": role.as_str() }),
                    ),
                )
                .await?;
            println!(
                "{}",
                if revoked { "role revoked" } else { "user did not hold that role" }
            );
        }
        AdminCmd::ShowConfig => unreachable!("handled above"),
    }
    Ok(())
}

/// Run the HTTP API and (unless disabled) the cleanup loop.
pub async fn serve(config: AppConfig) -> anyhow::Result<()> {
    let config = Arc::new(config);
    let metrics = Metrics::new();

    // --- PostgreSQL (required) ---------------------------------------------
    let pool = connect(&config.database).await?;
    if config.database.require_migrations_applied {
        verify_migrations(&pool).await.map_err(|e| match e {
            HubError::MigrationMismatch(msg) => {
                anyhow::anyhow!("{msg} — run `chenghub migrate` first")
            }
            other => anyhow::anyhow!(other),
        })?;
    }

    // --- Redis (optional accelerator) ----------------------------------------
    let redis = if config.redis.enabled {
        match RedisHandle::connect(&config.redis, metrics.clone()).await {
            Ok(handle) => Some(handle),
            Err(err) => {
                tracing::warn!(error = %err, "redis unavailable at startup; running degraded (no rate limits, in-process oauth state)");
                None
            }
        }
    } else {
        None
    };
    let rate_limiter: Arc<dyn RateLimiter> = match &redis {
        Some(handle) => Arc::new(RedisRateLimiter::new(handle.clone())),
        None => Arc::new(NoopRateLimiter),
    };
    let state_store: Arc<dyn OAuthStateStore> = match &redis {
        Some(handle) => Arc::new(RedisStateStore::new(handle.clone())),
        None => Arc::new(MemoryStateStore::default()),
    };

    // --- Repositories + services ---------------------------------------------
    let repos = Arc::new(PgRepos::new(pool.clone()));
    let hasher = TokenHasher::new(config.tokens.hmac_secret.expose());
    let providers = ProviderRegistry::from_config(&config.oauth)?;
    if providers.enabled().is_empty() {
        tracing::warn!("no OAuth providers configured; browser login is unavailable (set CHENGHUB_GITHUB_* / CHENGHUB_WECHAT_*)");
    }

    let identity = Arc::new(IdentityService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        providers,
        state_store,
        hasher.clone(),
        config.oauth.clone(),
        config.cookies.clone(),
        config.tokens.clone(),
        config.admin.clone(),
        config.server.public_url.clone(),
        metrics.clone(),
    ));
    let device_flow = Arc::new(DeviceFlowService::new(
        repos.clone(),
        identity.clone(),
        hasher,
        config.device.clone(),
        config.server.public_url.clone(),
        metrics.clone(),
    ));
    let posts = Arc::new(PostService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        config.limits.clone(),
        metrics.clone(),
    ));
    let comments = Arc::new(CommentService::new(
        repos.clone(),
        repos.clone(),
        config.limits.clone(),
        metrics.clone(),
    ));
    let reactions = Arc::new(ReactionService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        metrics.clone(),
    ));
    let requirements = Arc::new(RequirementService::new(repos.clone(), metrics.clone()));
    let search = Arc::new(SearchService::new(repos.clone()));
    let moderation = Arc::new(ModerationService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        metrics.clone(),
    ));
    let admin_service = Arc::new(AdminService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
    ));
    let shares = Arc::new(WorkflowShareService::new(repos.clone(), config.limits.clone()));
    let abuse = Arc::new(AbuseService::new(
        rate_limiter.clone(),
        config.rate_limit.clone(),
        metrics.clone(),
    ));

    let health = Arc::new(HealthState::new(pool.clone(), redis.is_some()));

    // --- HTTP router ----------------------------------------------------------
    let state = ApiState {
        config: config.clone(),
        metrics: metrics.clone(),
        identity,
        device_flow,
        posts,
        comments,
        reactions,
        requirements,
        search,
        moderation,
        admin: admin_service,
        shares,
        abuse,
        rate_limiter,
        health: health.clone(),
    };
    let router = router::build(state);

    // --- Background cleanup -----------------------------------------------
    let shutdown = CancellationToken::new();
    let mut worker_handles = Vec::new();
    if config.jobs.run_jobs {
        let cleanup: Arc<dyn IdentityCleanup> = repos.clone();
        worker_handles.push(tokio::spawn(crate::jobs::cleanup_loop(
            cleanup,
            config.jobs.cleanup_interval_secs,
            shutdown.clone(),
        )));
    }

    // --- Serve ----------------------------------------------------------------
    let listener = tokio::net::TcpListener::bind(&config.server.listen).await?;
    tracing::info!(
        listen = %config.server.listen,
        public_url = %config.server.public_url,
        redis = redis.is_some(),
        "chenghub serving"
    );

    let graceful_health = health.clone();
    axum::serve(
        listener,
        router.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(async move {
        wait_for_signal().await;
        tracing::info!("shutdown signal received; draining");
        graceful_health.begin_shutdown();
    })
    .await?;

    shutdown.cancel();
    let drain_budget = std::time::Duration::from_secs(config.server.shutdown_timeout_secs.max(1));
    if tokio::time::timeout(drain_budget, async {
        for handle in worker_handles {
            handle.await.ok();
        }
    })
    .await
    .is_err()
    {
        tracing::warn!("worker drain timed out");
    }
    tracing::info!("shutdown complete");
    Ok(())
}

async fn wait_for_signal() {
    let ctrl_c = tokio::signal::ctrl_c();
    #[cfg(unix)]
    {
        let mut sigterm =
            tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
                .expect("install SIGTERM handler");
        tokio::select! {
            _ = ctrl_c => {}
            _ = sigterm.recv() => {}
        }
    }
    #[cfg(not(unix))]
    {
        ctrl_c.await.ok();
    }
}
