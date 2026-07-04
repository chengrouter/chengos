//! Cross-cutting request concerns: client identity, auth extractors, rate
//! limiting middleware, and request metrics.
//!
//! Auth precedence: `Authorization: Bearer` first (device-flow clients),
//! then the browser session cookie. The two are separate credential
//! namespaces (prefix-tagged), so misrouting one as the other cannot match.

use std::net::SocketAddr;
use std::time::Instant;

use axum::extract::{ConnectInfo, FromRequestParts, Request, State};
use axum::http::header::AUTHORIZATION;
use axum::http::request::Parts;
use axum::middleware::Next;
use axum::response::Response;
use axum_extra::extract::CookieJar;

use crate::api::ApiState;
use crate::error::{HubError, Result};
use crate::services::identity_service::AuthContext;

/// Client key for rate limiting. Behind the reverse proxy,
/// `X-Forwarded-For`'s first hop is the client (the proxy examples in
/// `deploy/` overwrite inbound values so it can't be spoofed through the
/// proxy). Direct connections use the peer address.
pub fn client_key(headers: &axum::http::HeaderMap, peer: Option<SocketAddr>) -> String {
    if let Some(forwarded) = headers
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

fn bearer_token(parts: &Parts) -> Option<&str> {
    parts
        .headers
        .get(AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .map(str::trim)
        .filter(|v| !v.is_empty())
}

async fn authenticate(parts: &mut Parts, state: &ApiState) -> Result<Option<AuthContext>> {
    if let Some(token) = bearer_token(parts) {
        // An explicitly presented bearer token must be valid; a stale token
        // silently downgrading to anonymous would confuse clients.
        return match state.identity.authenticate_bearer(token).await? {
            Some(ctx) => Ok(Some(ctx)),
            None => Err(HubError::unauthorized("invalid or expired access token")),
        };
    }
    let jar = CookieJar::from_headers(&parts.headers);
    if let Some(cookie) = jar.get(&state.config.cookies.name) {
        return state.identity.authenticate_session(cookie.value()).await;
    }
    Ok(None)
}

/// Extractor: optional principal for anonymous-readable routes.
pub struct MaybeUser(pub Option<AuthContext>);

#[axum::async_trait]
impl FromRequestParts<ApiState> for MaybeUser {
    type Rejection = HubError;

    async fn from_request_parts(parts: &mut Parts, state: &ApiState) -> Result<Self> {
        Ok(Self(authenticate(parts, state).await?))
    }
}

/// Extractor: required principal for write routes.
pub struct RequireUser(pub AuthContext);

#[axum::async_trait]
impl FromRequestParts<ApiState> for RequireUser {
    type Rejection = HubError;

    async fn from_request_parts(parts: &mut Parts, state: &ApiState) -> Result<Self> {
        authenticate(parts, state)
            .await?
            .map(Self)
            .ok_or_else(|| HubError::unauthorized("authentication required"))
    }
}

/// Extractor: browser-session principal only. Device approval and token
/// management must come from a logged-in browser, never a bearer token
/// (a stolen token must not be able to mint more tokens).
pub struct RequireSessionUser(pub AuthContext);

#[axum::async_trait]
impl FromRequestParts<ApiState> for RequireSessionUser {
    type Rejection = HubError;

    async fn from_request_parts(parts: &mut Parts, state: &ApiState) -> Result<Self> {
        let jar = CookieJar::from_headers(&parts.headers);
        let Some(cookie) = jar.get(&state.config.cookies.name) else {
            return Err(HubError::unauthorized("browser login required"));
        };
        state
            .identity
            .authenticate_session(cookie.value())
            .await?
            .map(Self)
            .ok_or_else(|| HubError::unauthorized("browser login required"))
    }
}

/// Per-IP rate limit middleware for anonymous/public reads.
pub async fn read_rate_limit(
    State(state): State<ApiState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    request: Request,
    next: Next,
) -> Result<Response> {
    let key = client_key(request.headers(), Some(peer));
    state.abuse.check_read(&key).await?;
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
    state.abuse.check_auth(&key).await?;
    Ok(next.run(request).await)
}

/// Request metrics, applied to the whole router.
pub async fn observe(State(state): State<ApiState>, request: Request, next: Next) -> Response {
    let method = request.method().as_str().to_string();
    // Route template (not the raw path) to bound label cardinality.
    let route = request
        .extensions()
        .get::<axum::extract::MatchedPath>()
        .map(|p| p.as_str().to_string())
        .unwrap_or_else(|| "unmatched".to_string());
    let start = Instant::now();

    let response = next.run(request).await;

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
