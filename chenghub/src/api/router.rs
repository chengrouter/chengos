//! Router assembly: routes, per-group rate limits, body limits, timeouts,
//! CORS, and observability layers.

use std::time::Duration;

use axum::extract::DefaultBodyLimit;
use axum::http::{HeaderValue, Method};
use axum::middleware::from_fn_with_state;
use axum::routing::{delete, get, patch, post, put};
use axum::Router;
use tower_http::cors::CorsLayer;
use tower_http::timeout::TimeoutLayer;

use crate::api::{
    admin, auth, comments, device, health, middleware, posts, reactions, reports,
    workflow_shares, ApiState,
};

pub fn build(state: ApiState) -> Router {
    let request_timeout =
        TimeoutLayer::new(Duration::from_secs(state.config.server.request_timeout_secs));

    // Anonymous-readable community reads: per-IP rate limit.
    let reads = Router::new()
        .route("/posts", get(posts::list))
        .route("/posts/search", get(posts::search))
        .route("/posts/similar", get(posts::similar))
        .route("/posts/:id", get(posts::detail))
        .route("/posts/:id/comments", get(comments::list))
        .route("/workflow-shares/:id", get(workflow_shares::detail))
        .route("/workflow-shares/:id/payload", get(workflow_shares::payload))
        .layer(from_fn_with_state(state.clone(), middleware::read_rate_limit));

    // Authenticated community writes. Per-user limits are enforced inline
    // by the abuse service (buckets per action type).
    let writes = Router::new()
        .route("/posts", post(posts::create))
        .route("/posts/:id", put(posts::update).delete(posts::delete))
        .route("/posts/:id/status", patch(posts::set_status))
        .route("/posts/:id/comments", post(comments::create))
        .route("/comments/:id", put(comments::update).delete(comments::delete))
        .route("/posts/:id/support", post(reactions::support))
        .route("/posts/:id/like", post(reactions::like))
        .route("/posts/:id/star", post(reactions::star))
        .route("/comments/:id/like", post(reactions::comment_like))
        .route("/posts/:id/report", post(reports::report_post))
        .route("/comments/:id/report", post(reports::report_comment))
        .route("/me/reactions", get(reactions::my_reactions))
        .route("/me/reports", get(reports::my_reports))
        .route("/workflow-shares", post(workflow_shares::create));

    // Auth: browser login + tokens, stricter per-IP limit.
    let auth_routes = Router::new()
        .route("/auth/:provider/start", get(auth::start))
        .route("/auth/:provider/callback", get(auth::callback))
        .route("/auth/logout", post(auth::logout))
        .route("/auth/me", get(auth::me))
        .route("/auth/identities", get(auth::list_identities))
        .route("/auth/identities/:id", delete(auth::unlink_identity))
        .route("/auth/tokens/refresh", post(auth::refresh_tokens))
        .route("/auth/tokens", get(auth::list_tokens).post(auth::create_token))
        .route("/auth/tokens/:id", delete(auth::revoke_token))
        .route("/auth/device/code", post(device::device_code))
        .route("/auth/device/token", post(device::device_token))
        .route("/auth/device/info", get(device::device_info))
        .route("/auth/device/authorize", post(device::device_authorize))
        .route("/auth/device/deny", post(device::device_deny))
        .layer(from_fn_with_state(state.clone(), middleware::auth_rate_limit));

    // Admin board. Role checks happen in the services per handler.
    let admin_routes = Router::new()
        .route("/admin/dashboard", get(admin::dashboard))
        .route("/admin/requirements", get(admin::requirements))
        .route("/admin/posts/:id/status", patch(admin::set_status))
        .route("/admin/posts/:id/merge", post(admin::merge))
        .route("/admin/posts/:id/hide", post(admin::hide_post))
        .route("/admin/posts/:id/restore", post(admin::restore_post))
        .route("/admin/comments/:id/hide", post(admin::hide_comment))
        .route("/admin/comments/:id/restore", post(admin::restore_comment))
        .route("/admin/reports", get(admin::list_reports))
        .route("/admin/reports/:id/resolve", post(admin::resolve_report))
        .route("/admin/users", get(admin::list_users))
        .route("/admin/users/:id/ban", post(admin::ban_user))
        .route("/admin/users/:id/unban", post(admin::unban_user))
        .route("/admin/users/:id/roles", post(admin::grant_role))
        .route("/admin/users/:id/roles/:role", delete(admin::revoke_role))
        .route("/admin/audit-events", get(admin::audit_events));

    let api_v1 = Router::new()
        .merge(reads)
        .merge(writes)
        .merge(auth_routes)
        .merge(admin_routes)
        .layer(request_timeout);

    let mut router = Router::new()
        .nest("/api/v1", api_v1)
        .route("/device", get(device::device_page))
        .route("/healthz", get(health::healthz))
        .route("/readyz", get(health::readyz))
        .route("/metrics", get(health::metrics))
        .layer(DefaultBodyLimit::max(state.config.server.max_json_body_bytes))
        .layer(from_fn_with_state(state.clone(), middleware::observe));

    if let Some(cors) = cors_layer(&state) {
        router = router.layer(cors);
    }

    router.with_state(state)
}

/// Exact-origin CORS for browser flows. No configured origins = no CORS
/// headers at all (proxy/same-origin deployment). Credentials are allowed
/// because the browser session rides on a cookie.
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
            .allow_methods([
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::PATCH,
                Method::DELETE,
            ])
            .allow_headers([
                axum::http::header::CONTENT_TYPE,
                axum::http::header::AUTHORIZATION,
            ])
            .allow_credentials(true)
            .max_age(Duration::from_secs(600)),
    )
}
