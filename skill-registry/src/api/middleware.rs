//! Cross-cutting request concerns: client identity, rate limiting, metrics,
//! and the admin/publisher authentication extractors.

use std::net::SocketAddr;
use std::time::Instant;

use axum::extract::{ConnectInfo, FromRequestParts, Request, State};
use axum::http::header::{HeaderValue, AUTHORIZATION};
use axum::http::request::Parts;
use axum::middleware::Next;
use axum::response::Response;
use constant_time_eq::constant_time_eq;

use crate::api::versioning::API_VERSION_HEADER;
use crate::api::ApiState;
use crate::error::{RegistryError, Result};
use crate::services::publisher_auth_service::AuthContext;

/// Client key for rate limiting / download bucketing. Behind the reverse
/// proxy, `X-Forwarded-For`'s first hop is the client (the proxy config in
/// `deploy/nginx.conf.example` overwrites inbound values, so it can't be
/// spoofed through the proxy). Direct connections use the peer address.
pub fn client_key(parts_headers: &axum::http::HeaderMap, peer: Option<SocketAddr>) -> String {
    if let Some(forwarded) = parts_headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.split(',').next())
        .map(str::trim)
        .filter(|v| !v.is_empty())
    {
        return forwarded.to_string();
    }
    peer.map(|p| p.ip().to_string()).unwrap_or_else(|| "unknown".into())
}

/// Rate-limit check helper used inline by handlers with special buckets.
pub async fn check_rate(state: &ApiState, bucket: String, limit: u32, window_secs: u64) -> Result<()> {
    let decision = state.rate_limiter.check(&bucket, limit, window_secs).await;
    if decision.allowed {
        Ok(())
    } else {
        Err(RegistryError::RateLimited { retry_after_secs: decision.retry_after_secs })
    }
}

/// Per-IP rate limit middleware for public catalog reads.
pub async fn public_rate_limit(
    State(state): State<ApiState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    request: Request,
    next: Next,
) -> Result<Response> {
    let key = client_key(request.headers(), Some(peer));
    check_rate(
        &state,
        format!("pub:{key}"),
        state.config.rate_limit.public_per_ip_per_min,
        60,
    )
    .await?;
    Ok(next.run(request).await)
}

/// Per-IP rate limit middleware for auth endpoints (stricter).
pub async fn auth_rate_limit(
    State(state): State<ApiState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    request: Request,
    next: Next,
) -> Result<Response> {
    let key = client_key(request.headers(), Some(peer));
    check_rate(
        &state,
        format!("auth:{key}"),
        state.config.rate_limit.auth_per_ip_per_min,
        60,
    )
    .await?;
    Ok(next.run(request).await)
}

/// Request metrics + API version header, applied to the whole router.
pub async fn observe(State(state): State<ApiState>, request: Request, next: Next) -> Response {
    let method = request.method().as_str().to_string();
    // Route template (not the raw path) to bound label cardinality.
    let route = request
        .extensions()
        .get::<axum::extract::MatchedPath>()
        .map(|p| p.as_str().to_string())
        .unwrap_or_else(|| "unmatched".to_string());
    let start = Instant::now();

    let mut response = next.run(request).await;

    let status = response.status();
    state
        .metrics
        .http_requests_total
        .with_label_values(&[&route, &method, status_class(status)])
        .inc();
    state
        .metrics
        .http_request_duration_seconds
        .with_label_values(&[&route, &method])
        .observe(start.elapsed().as_secs_f64());
    if status.is_server_error() {
        state.metrics.http_errors_total.with_label_values(&[&route]).inc();
    }
    response
        .headers_mut()
        .insert(API_VERSION_HEADER, HeaderValue::from_static(crate::api::versioning::API_VERSION));
    response
}

fn status_class(status: axum::http::StatusCode) -> &'static str {
    match status.as_u16() {
        100..=199 => "1xx",
        200..=299 => "2xx",
        300..=399 => "3xx",
        400..=499 => "4xx",
        _ => "5xx",
    }
}

/// Extractor: authenticated publisher context from `Authorization: Bearer`.
pub struct RequireAuth(pub AuthContext);

#[axum::async_trait]
impl FromRequestParts<ApiState> for RequireAuth {
    type Rejection = RegistryError;

    async fn from_request_parts(parts: &mut Parts, state: &ApiState) -> Result<Self> {
        let bearer = bearer_token(parts)?;
        let context = state.auth.authenticate(bearer).await?;
        Ok(Self(context))
    }
}

/// Extractor: deployment admin via `Authorization: Bearer <admin token>`.
/// Admin APIs are disabled entirely when no admin token is configured.
pub struct RequireAdmin {
    /// Audit label for the acting admin.
    pub actor: String,
}

#[axum::async_trait]
impl FromRequestParts<ApiState> for RequireAdmin {
    type Rejection = RegistryError;

    async fn from_request_parts(parts: &mut Parts, state: &ApiState) -> Result<Self> {
        let configured = state.config.auth.admin_token.expose();
        if configured.len() < 16 {
            // Unset or too weak to accept: admin surface is off.
            return Err(RegistryError::NotFound("resource"));
        }
        let presented = bearer_token(parts)?;
        if !constant_time_eq(presented.as_bytes(), configured.as_bytes()) {
            return Err(RegistryError::unauthorized("invalid admin token"));
        }
        Ok(Self { actor: "admin".to_string() })
    }
}

fn bearer_token(parts: &Parts) -> Result<&str> {
    parts
        .headers
        .get(AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .map(str::trim)
        .filter(|v| !v.is_empty())
        .ok_or_else(|| RegistryError::unauthorized("missing Authorization: Bearer token"))
}
