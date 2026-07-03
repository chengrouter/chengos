//! Application assembly: `serve`, `migrate`, and `admin` entry points.
//!
//! `serve` wires ports to adapters exactly once. Redis failures at startup
//! (or `redis.enabled = false`) swap in noop accelerators — the registry
//! serves fully from PostgreSQL, just slower and without rate limiting.
//!
//! Graceful shutdown order: mark unready (load balancer drains) -> stop HTTP
//! accept + drain in-flight requests -> cancel background loops -> wait for
//! running jobs within the lease budget (anything unfinished is reclaimed by
//! lease expiry later).

use std::net::SocketAddr;
use std::sync::Arc;

use tokio_util::sync::CancellationToken;
use uuid::Uuid;

use crate::api::health::HealthState;
use crate::api::{router, ApiState};
use crate::config::AppConfig;
use crate::domain::moderation::AuditActorType;
use crate::domain::release::ReleaseStatus;
use crate::error::RegistryError;
use crate::jobs::runner::{periodic_enqueuer, JobRunner};
use crate::jobs::{outbox_dispatcher::OutboxDispatcher, JobContext};
use crate::ports::cache::{Cache, NoopCache};
use crate::ports::counters::{DownloadCounters, NoopCounters};
use crate::ports::job_queue::{JobDelivery, JobOutbox};
use crate::ports::rate_limit::{NoopRateLimiter, RateLimiter};
use crate::ports::repositories::{NewAuditEvent, ReleaseRepo, TokenRepo};
use crate::services::artifact_service::ArtifactService;
use crate::services::catalog_service::CatalogService;
use crate::services::download_service::DownloadService;
use crate::services::moderation_service::ModerationService;
use crate::services::publish_service::PublishService;
use crate::services::publisher_auth_service::PublisherAuthService;
use crate::services::scan_service::ScanService;
use crate::storage::filesystem::artifact_store::FilesystemArtifactStore;
use crate::storage::postgres::job_outbox::OutboxJobSource;
use crate::storage::postgres::outbox::PgJobOutbox;
use crate::storage::postgres::repositories::PgRepos;
use crate::storage::postgres::{connect, migrator, verify_migrations};
use crate::storage::redis::idempotency::IdempotencyStore;
use crate::storage::redis::{
    cache::RedisCache, counters::RedisCounters, jobs::RedisJobDelivery,
    rate_limit::RedisRateLimiter, RedisHandle,
};
use crate::telemetry::metrics::Metrics;

pub enum AdminCmd {
    DeadLetters { limit: i64 },
    RequeueJob { job_id: String },
    QuarantineRelease { release_id: String, reason: String },
    RevokeToken { token_id: String },
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
    let outbox = PgJobOutbox::new(
        pool.clone(),
        config.jobs.max_attempts,
        config.jobs.retry_backoff_secs,
    );
    let repos = PgRepos::new(pool);

    match cmd {
        AdminCmd::DeadLetters { limit } => {
            let jobs = outbox.dead_letters(limit.clamp(1, 500)).await?;
            for job in jobs {
                println!(
                    "{}\t{}\tattempts={}/{}\t{}",
                    job.id,
                    job.job_type.as_str(),
                    job.attempts,
                    job.max_attempts,
                    job.dead_letter_reason.or(job.last_error).unwrap_or_default()
                );
            }
        }
        AdminCmd::RequeueJob { job_id } => {
            let job_id: Uuid = job_id.parse()?;
            if outbox.requeue_dead_letter(job_id).await? {
                println!("job {job_id} requeued");
            } else {
                anyhow::bail!("job {job_id} is not a dead letter");
            }
        }
        AdminCmd::QuarantineRelease { release_id, reason } => {
            let release_id: Uuid = release_id.parse()?;
            let release = repos
                .transition(
                    release_id,
                    &[
                        ReleaseStatus::Scanning,
                        ReleaseStatus::NeedsReview,
                        ReleaseStatus::Approved,
                        ReleaseStatus::Published,
                        ReleaseStatus::Yanked,
                    ],
                    ReleaseStatus::Quarantined,
                    Some(&reason),
                    cli_audit("release.quarantine", "release", release_id.to_string()),
                )
                .await?;
            println!("release {} quarantined ({})", release.id, release.version);
        }
        AdminCmd::RevokeToken { token_id } => {
            let token_id: Uuid = token_id.parse()?;
            if repos
                .revoke(token_id, cli_audit("token.revoke", "token", token_id.to_string()))
                .await?
            {
                println!("token {token_id} revoked");
            } else {
                anyhow::bail!("token {token_id} not found or already revoked");
            }
        }
        AdminCmd::ShowConfig => unreachable!("handled above"),
    }
    Ok(())
}

fn cli_audit(action: &str, subject_type: &str, subject_id: String) -> NewAuditEvent {
    NewAuditEvent {
        actor_type: AuditActorType::Admin,
        actor: "cli".to_string(),
        action: action.to_string(),
        subject_type: subject_type.to_string(),
        subject_id,
        details: serde_json::json!({ "via": "admin-cli" }),
        request_id: None,
    }
}

/// Run the HTTP API and (unless disabled) the background workers.
pub async fn serve(config: AppConfig) -> anyhow::Result<()> {
    let config = Arc::new(config);
    let metrics = Metrics::new();

    // --- PostgreSQL (required) ---------------------------------------------
    let pool = connect(&config.database).await?;
    if config.database.require_migrations_applied {
        verify_migrations(&pool).await.map_err(|e| match e {
            RegistryError::MigrationMismatch(msg) => {
                anyhow::anyhow!("{msg} — run `skill-registry migrate` first")
            }
            other => anyhow::anyhow!(other),
        })?;
    }

    // --- Artifact storage (required) ----------------------------------------
    let store = Arc::new(
        FilesystemArtifactStore::new(
            &config.artifacts.root,
            &config.artifacts.work_dir,
            config.artifact_file_mode(),
        )
        .await?,
    );
    let spool_dir = config.artifacts.root.join(&config.artifacts.work_dir);

    // --- Redis (optional accelerator) ----------------------------------------
    let redis = if config.redis.enabled {
        match RedisHandle::connect(&config.redis, metrics.clone()).await {
            Ok(handle) => Some(handle),
            Err(err) => {
                tracing::warn!(error = %err, "redis unavailable at startup; running degraded (no cache/rate limits/counters)");
                None
            }
        }
    } else {
        None
    };
    let cache: Arc<dyn Cache> = match &redis {
        Some(handle) => Arc::new(RedisCache::new(handle.clone())),
        None => Arc::new(NoopCache),
    };
    let counters: Arc<dyn DownloadCounters> = match &redis {
        Some(handle) => Arc::new(RedisCounters::new(handle.clone(), config.counters.window_secs)),
        None => Arc::new(NoopCounters),
    };
    let rate_limiter: Arc<dyn RateLimiter> = match &redis {
        Some(handle) => Arc::new(RedisRateLimiter::new(handle.clone())),
        None => Arc::new(NoopRateLimiter),
    };
    let idempotency = redis.as_ref().map(|h| Arc::new(IdempotencyStore::new(h.clone())));
    let job_delivery: Option<Arc<dyn JobDelivery>> = match &redis {
        Some(handle) => Some(Arc::new(RedisJobDelivery::new(handle.clone()).await)),
        None => None,
    };

    // --- Repositories + services ---------------------------------------------
    let repos = Arc::new(PgRepos::new(pool.clone()));
    let outbox: Arc<dyn JobOutbox> = Arc::new(PgJobOutbox::new(
        pool.clone(),
        config.jobs.max_attempts,
        config.jobs.retry_backoff_secs,
    ));

    let artifact_service = Arc::new(
        ArtifactService::new(
            store.clone(),
            spool_dir,
            config.artifacts.clone(),
            metrics.clone(),
        )
        .await?,
    );
    let catalog = Arc::new(CatalogService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        cache.clone(),
        config.cache.clone(),
        metrics.clone(),
    ));
    let downloads = Arc::new(DownloadService::new(
        catalog.clone(),
        repos.clone(),
        repos.clone(),
        store.clone(),
        counters.clone(),
        config.counters.clone(),
        config.server.clone(),
        metrics.clone(),
    ));
    let auth = Arc::new(PublisherAuthService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        cache.clone(),
        config.auth.clone(),
        &config.server.public_url,
    ));
    let publish = Arc::new(PublishService::new(
        repos.clone(),
        repos.clone(),
        artifact_service.clone(),
        catalog.clone(),
    ));
    let scan_service = Arc::new(ScanService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        artifact_service.clone(),
        config.moderation.clone(),
        metrics.clone(),
    ));
    let moderation = Arc::new(ModerationService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        outbox.clone(),
        catalog.clone(),
    ));

    let health = Arc::new(HealthState::new(
        pool.clone(),
        config.artifacts.root.clone(),
        redis.is_some(),
    ));

    // --- HTTP router ----------------------------------------------------------
    let state = ApiState {
        config: config.clone(),
        metrics: metrics.clone(),
        catalog,
        downloads,
        auth,
        publish,
        moderation,
        jobs: outbox.clone(),
        rate_limiter,
        idempotency,
        health: health.clone(),
    };
    let router = router::build(state);

    // --- Background workers -----------------------------------------------
    let shutdown = CancellationToken::new();
    let mut worker_handles = Vec::new();
    if config.jobs.run_jobs {
        let worker_name = format!("worker-{}", Uuid::new_v4());
        let source = OutboxJobSource::new(
            outbox.clone(),
            job_delivery.clone(),
            worker_name,
            config.jobs.lease_secs,
            config.jobs.outbox_poll_interval_secs,
        );
        let ctx = JobContext {
            scan_service,
            counters: counters.clone(),
            download_stats: repos.clone(),
            artifact_repo: repos.clone(),
            artifact_store: store.clone(),
            artifact_config: config.artifacts.clone(),
            jobs_config: config.jobs.clone(),
            metrics: metrics.clone(),
        };
        let runner = JobRunner::new(source, outbox.clone(), ctx, config.jobs.clone());
        worker_handles.push(tokio::spawn(runner.run(shutdown.clone())));

        let dispatcher = OutboxDispatcher::new(
            outbox.clone(),
            job_delivery,
            config.jobs.outbox_poll_interval_secs,
            metrics.clone(),
        );
        worker_handles.push(tokio::spawn(dispatcher.run(shutdown.clone())));
        worker_handles.push(tokio::spawn(periodic_enqueuer(
            outbox.clone(),
            config.jobs.clone(),
            shutdown.clone(),
        )));
    }

    // --- Serve ----------------------------------------------------------------
    let listener = tokio::net::TcpListener::bind(&config.server.listen).await?;
    tracing::info!(
        listen = %config.server.listen,
        public_url = %config.server.public_url,
        jobs = config.jobs.run_jobs,
        redis = redis.is_some(),
        "skill-registry serving"
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

    // HTTP fully drained; now stop background loops and wait for them.
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
        tracing::warn!("worker drain timed out; leases will recover any unfinished jobs");
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
