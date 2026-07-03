//! Router assembly: routes, per-group rate limits, body limits, timeouts,
//! CORS, and observability layers.

use std::time::Duration;

use axum::extract::DefaultBodyLimit;
use axum::http::{HeaderValue, Method};
use axum::middleware::from_fn_with_state;
use axum::routing::{delete, get, post, put};
use axum::Router;
use tower_http::cors::CorsLayer;
use tower_http::timeout::TimeoutLayer;

use crate::api::{
    admin, capabilities, health, middleware, moderation, public, publish, publisher_auth, ApiState,
};

pub fn build(state: ApiState) -> Router {
    let request_timeout = TimeoutLayer::new(Duration::from_secs(state.config.server.request_timeout_secs));
    let upload_timeout = TimeoutLayer::new(Duration::from_secs(state.config.artifacts.upload_timeout_secs));

    // Public catalog reads: per-IP rate limit + standard timeout.
    let catalog = Router::new()
        .route("/skills", get(public::list_skills))
        .route("/skills/:publisher/:slug", get(public::skill_detail))
        .route("/skills/:publisher/:slug/versions", get(public::versions))
        .route(
            "/skills/:publisher/:slug/releases/:version",
            get(public::release_detail),
        )
        .route("/categories", get(public::categories))
        .route("/publishers/:handle", get(public::publisher))
        .route("/capabilities", get(capabilities::capabilities))
        .layer(request_timeout.clone())
        .layer(from_fn_with_state(state.clone(), middleware::public_rate_limit));

    // Download: rate-limited inline (own bucket); no request timeout — the
    // stream may legitimately outlive it on slow links.
    let download = Router::new().route(
        "/skills/:publisher/:slug/releases/:version/download",
        get(public::download),
    );

    // Abuse reports: per-IP daily limit enforced inline.
    let reports = Router::new()
        .route("/reports", post(public::file_report))
        .layer(request_timeout.clone());

    // Auth: stricter per-IP limit.
    let auth_routes = Router::new()
        .route("/auth/preview", post(publisher_auth::preview))
        .route("/auth/authorize", post(publisher_auth::authorize))
        .route("/auth/exchange", post(publisher_auth::exchange))
        .layer(request_timeout.clone())
        .layer(from_fn_with_state(state.clone(), middleware::auth_rate_limit));

    let tokens = Router::new()
        .route(
            "/tokens",
            get(publisher_auth::list_tokens).post(publisher_auth::create_token),
        )
        .route("/tokens/:token_id", delete(publisher_auth::revoke_token))
        .layer(request_timeout.clone());

    // Publishing. The artifact route carries its own (large) body limit and
    // the long upload timeout; everything else is JSON-sized.
    let artifact_body_limit = state.config.artifacts.max_archive_bytes as usize + 64 * 1024;
    let publish_routes = Router::new()
        .route("/publish/skills/:slug", put(publish::upsert_skill))
        .route("/publish/skills/:slug/releases", post(publish::start_release))
        .route(
            "/publish/skills/:slug/releases/:version",
            get(publish::release_status),
        )
        .merge(
            Router::new()
                .route(
                    "/publish/skills/:slug/releases/:version/artifact",
                    put(publish::upload_artifact),
                )
                .layer(DefaultBodyLimit::max(artifact_body_limit))
                .layer(upload_timeout),
        )
        .route(
            "/publish/skills/:slug/releases/:version/publish",
            post(publish::publish_release),
        )
        .route(
            "/publish/skills/:slug/releases/:version/yank",
            post(publish::yank_release),
        )
        .route(
            "/publish/skills/:slug/releases/:version/unyank",
            post(publish::unyank_release),
        );

    // Admin: moderation + operations. Auth enforced by the RequireAdmin
    // extractor on every handler.
    let admin_routes = Router::new()
        .route("/admin/queue", get(moderation::review_queue))
        .route("/admin/releases/:release_id/approve", post(moderation::approve_release))
        .route("/admin/releases/:release_id/reject", post(moderation::reject_release))
        .route(
            "/admin/releases/:release_id/quarantine",
            post(moderation::quarantine_release),
        )
        .route("/admin/releases/:release_id/restore", post(moderation::restore_release))
        .route("/admin/releases/:release_id/rescan", post(moderation::rescan_release))
        .route("/admin/skills/:skill_id/visibility", post(moderation::set_skill_visibility))
        .route(
            "/admin/publishers/:publisher_id/ban",
            post(moderation::set_publisher_banned),
        )
        .route("/admin/reports", get(moderation::list_reports))
        .route("/admin/reports/:report_id/close", post(moderation::close_report))
        .route("/admin/audit", get(moderation::audit_trail))
        .route("/admin/jobs/dead-letters", get(admin::dead_letters))
        .route("/admin/jobs/:job_id/requeue", post(admin::requeue_job))
        .layer(request_timeout.clone());

    let api_v1 = Router::new()
        .merge(catalog)
        .merge(download)
        .merge(reports)
        .merge(auth_routes)
        .merge(tokens)
        .merge(publish_routes)
        .merge(admin_routes);

    let mut router = Router::new()
        .nest("/api/v1", api_v1)
        .route("/health/live", get(health::live))
        .route("/health/ready", get(health::ready))
        .route("/metrics", get(admin::metrics))
        // JSON-sized default body limit; the artifact route overrides it.
        .layer(DefaultBodyLimit::max(state.config.server.max_json_body_bytes))
        .layer(from_fn_with_state(state.clone(), middleware::observe));

    if let Some(cors) = cors_layer(&state) {
        router = router.layer(cors);
    }

    router.with_state(state)
}

/// Exact-origin CORS for browser flows. No configured origins = no CORS
/// headers at all (proxy/same-origin deployment).
fn cors_layer(state: &ApiState) -> Option<CorsLayer> {
    let origins = &state.config.server.cors_allowed_origins;
    if origins.is_empty() {
        return None;
    }
    let parsed: Vec<HeaderValue> = origins
        .iter()
        .filter_map(|origin| origin.parse::<HeaderValue>().ok())
        .collect();
    Some(
        CorsLayer::new()
            .allow_origin(parsed)
            .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
            .allow_headers([
                axum::http::header::CONTENT_TYPE,
                axum::http::header::AUTHORIZATION,
            ])
            .max_age(Duration::from_secs(600)),
    )
}
