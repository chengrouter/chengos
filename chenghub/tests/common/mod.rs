//! Shared integration-test harness.
//!
//! Tests run only when `CHENGHUB_TEST_DATABASE_URL` points at a scratch
//! database; otherwise every test returns early (green skip). Tests never
//! truncate — each creates uniquely-named users/posts so the suite can run
//! in parallel against one database.

use std::sync::Arc;

use chenghub::config::{
    AdminConfig, ContentLimitsConfig, CookieConfig, DeviceFlowConfig, OAuthConfig, TokenConfig,
};
use chenghub::domain::identity::{AuthProvider, ChengHubUser, ExternalUserProfile};
use chenghub::ports::rate_limit::NoopRateLimiter;
use chenghub::security::oauth_state::MemoryStateStore;
use chenghub::security::token::TokenHasher;
use chenghub::services::comment_service::CommentService;
use chenghub::services::device_flow_service::DeviceFlowService;
use chenghub::services::identity_service::{AuthContext, AuthVia, IdentityService};
use chenghub::services::moderation_service::ModerationService;
use chenghub::services::oauth::ProviderRegistry;
use chenghub::services::post_service::PostService;
use chenghub::services::reaction_service::ReactionService;
use chenghub::services::requirement_service::RequirementService;
use chenghub::services::search_service::SearchService;
use chenghub::services::workflow_share_service::WorkflowShareService;
use chenghub::storage::postgres::PgRepos;
use chenghub::telemetry::metrics::Metrics;
use sqlx::postgres::PgPoolOptions;
use uuid::Uuid;

pub struct TestApp {
    pub repos: Arc<PgRepos>,
    pub identity: Arc<IdentityService>,
    pub device_flow: Arc<DeviceFlowService>,
    pub posts: Arc<PostService>,
    pub comments: Arc<CommentService>,
    pub reactions: Arc<ReactionService>,
    pub requirements: Arc<RequirementService>,
    pub search: Arc<SearchService>,
    pub moderation: Arc<ModerationService>,
    pub shares: Arc<WorkflowShareService>,
}

/// Connect + migrate, or `None` when the env var is unset (skip).
pub async fn test_app() -> Option<TestApp> {
    test_app_with_device_interval(0).await
}

pub async fn test_app_with_device_interval(interval_secs: u64) -> Option<TestApp> {
    let url = std::env::var("CHENGHUB_TEST_DATABASE_URL").ok()?;
    let pool = PgPoolOptions::new()
        .max_connections(4)
        .connect(&url)
        .await
        .expect("connect test database");
    chenghub::storage::postgres::migrator()
        .run(&pool)
        .await
        .expect("apply migrations");

    let repos = Arc::new(PgRepos::new(pool));
    let metrics = Metrics::new();
    let hasher = TokenHasher::new("test-secret-test-secret-test-secret-00");
    let limits = ContentLimitsConfig::default();

    let identity = Arc::new(IdentityService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        repos.clone(),
        ProviderRegistry::default(),
        Arc::new(MemoryStateStore::default()),
        hasher.clone(),
        OAuthConfig::default(),
        CookieConfig::default(),
        TokenConfig::default(),
        AdminConfig::default(),
        "http://test.local".into(),
        metrics.clone(),
    ));
    let device_flow = Arc::new(DeviceFlowService::new(
        repos.clone(),
        identity.clone(),
        hasher,
        DeviceFlowConfig { interval_secs, ..DeviceFlowConfig::default() },
        "http://test.local".into(),
        metrics.clone(),
    ));
    let posts = Arc::new(PostService::new(
        repos.clone(),
        repos.clone(),
        repos.clone(),
        limits.clone(),
        metrics.clone(),
    ));
    let comments = Arc::new(CommentService::new(
        repos.clone(),
        repos.clone(),
        limits.clone(),
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
    let shares = Arc::new(WorkflowShareService::new(repos.clone(), limits));

    // Silence unused warnings for tests that use a subset.
    let _ = Arc::strong_count(&repos);
    Some(TestApp {
        repos,
        identity,
        device_flow,
        posts,
        comments,
        reactions,
        requirements,
        search,
        moderation,
        shares,
    })
}

/// A provider profile with a unique subject.
pub fn unique_profile(provider: AuthProvider) -> ExternalUserProfile {
    let tag = Uuid::new_v4().simple().to_string();
    ExternalUserProfile {
        provider,
        subject: format!("sub-{tag}"),
        username_hint: Some(format!("u{}", &tag[..12])),
        display_name: Some("Test User".into()),
        avatar_url: None,
        email: Some(format!("{}@example.com", &tag[..8])),
        profile: serde_json::json!({}),
    }
}

/// Create a fresh user via the identity repo and return an auth context
/// with the given roles granted.
pub async fn user_with_roles(
    app: &TestApp,
    roles: &[chenghub::domain::roles::Role],
) -> AuthContext {
    use chenghub::domain::moderation::{AuditActorType, NewAuditEvent};
    use chenghub::ports::identity_repository::{IdentityRepo, UserRepo};

    let profile = unique_profile(AuthProvider::Github);
    let username = format!("t-{}", Uuid::new_v4().simple());
    let (user, _identity) = app
        .repos
        .create_user_with_identity(&username[..20], &profile)
        .await
        .expect("create user");
    for role in roles {
        app.repos
            .grant_role(
                user.id,
                *role,
                None,
                NewAuditEvent {
                    actor_type: AuditActorType::System,
                    actor: "test".into(),
                    action: "role.grant".into(),
                    subject_type: "user".into(),
                    subject_id: user.id.to_string(),
                    details: serde_json::json!({}),
                    request_id: None,
                },
            )
            .await
            .expect("grant role");
    }
    context_for(app, user).await
}

pub async fn context_for(app: &TestApp, user: ChengHubUser) -> AuthContext {
    use chenghub::ports::identity_repository::UserRepo;
    let roles = app.repos.roles(user.id).await.expect("roles");
    AuthContext { user, roles, via: AuthVia::Session }
}

pub async fn plain_user(app: &TestApp) -> AuthContext {
    user_with_roles(app, &[]).await
}

/// Skip helper: `let Some(app) = require_db!() else { return };`
#[macro_export]
macro_rules! require_app {
    () => {
        match common::test_app().await {
            Some(app) => app,
            None => {
                eprintln!("CHENGHUB_TEST_DATABASE_URL not set; skipping integration test");
                return;
            }
        }
    };
}
