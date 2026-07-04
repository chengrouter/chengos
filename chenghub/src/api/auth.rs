//! Browser OAuth login, session, identity, and token management routes.

use axum::extract::{Path, Query, State};
use axum::response::{IntoResponse, Redirect, Response};
use axum::Json;
use axum_extra::extract::CookieJar;
use serde::Deserialize;
use uuid::Uuid;

use crate::api::dto::{
    CreateTokenRequest, IdentityDto, MeResponse, RefreshRequest, TokenDto, UserDto,
};
use crate::api::middleware::{MaybeUser, RequireSessionUser, RequireUser};
use crate::api::ApiState;
use crate::domain::identity::AuthProvider;
use crate::error::{codes, HubError, Result};
use crate::security::cookies::{clear_session_cookie, session_cookie};

fn parse_provider(raw: &str) -> Result<AuthProvider> {
    AuthProvider::parse(raw).ok_or_else(|| {
        HubError::validation(codes::INVALID_PARAM, format!("unknown provider {raw:?}"))
    })
}

#[derive(Deserialize)]
pub struct StartQuery {
    #[serde(default)]
    pub return_to: Option<String>,
    /// `link=true` binds the identity to the logged-in user instead of
    /// switching accounts.
    #[serde(default)]
    pub link: bool,
}

/// GET /api/v1/auth/:provider/start — redirect to the provider.
pub async fn start(
    State(state): State<ApiState>,
    Path(provider): Path<String>,
    Query(query): Query<StartQuery>,
    MaybeUser(user): MaybeUser,
) -> Result<Redirect> {
    let provider = parse_provider(&provider)?;
    let link_user_id = if query.link {
        Some(
            user.as_ref()
                .ok_or_else(|| HubError::unauthorized("log in before linking an identity"))?
                .user
                .id,
        )
    } else {
        None
    };
    let url = state
        .identity
        .start_login(provider, query.return_to.as_deref(), link_user_id)
        .await?;
    Ok(Redirect::temporary(&url))
}

#[derive(Deserialize)]
pub struct CallbackQuery {
    #[serde(default)]
    pub code: Option<String>,
    #[serde(default)]
    pub state: Option<String>,
    /// Provider-reported denial (e.g. user cancelled).
    #[serde(default)]
    pub error: Option<String>,
}

/// GET /api/v1/auth/:provider/callback — complete login, set the session
/// cookie, redirect back into the app.
pub async fn callback(
    State(state): State<ApiState>,
    Path(provider): Path<String>,
    Query(query): Query<CallbackQuery>,
    jar: CookieJar,
    MaybeUser(current): MaybeUser,
) -> Result<Response> {
    let provider = parse_provider(&provider)?;
    if query.error.is_some() {
        // User cancelled at the provider; nothing to validate.
        return Ok(Redirect::temporary("/?chenghub_login=cancelled").into_response());
    }
    let (code, oauth_state) = match (&query.code, &query.state) {
        (Some(code), Some(oauth_state)) => (code.clone(), oauth_state.clone()),
        _ => {
            return Err(HubError::validation(
                codes::INVALID_PARAM,
                "missing code or state parameter",
            ))
        }
    };

    let outcome = state
        .identity
        .complete_login(provider, &oauth_state, &code, current.map(|c| c.user.id))
        .await;

    match outcome {
        Ok(outcome) => {
            let mut jar = jar;
            if let Some(raw_session) = outcome.session_token {
                jar = jar.add(session_cookie(&state.config.cookies, raw_session));
            }
            let target = format!(
                "{}{}chenghub_login={}",
                outcome.return_to,
                if outcome.return_to.contains('?') { "&" } else { "?" },
                if outcome.linked { "linked" } else { "ok" }
            );
            Ok((jar, Redirect::temporary(&target)).into_response())
        }
        Err(err) => {
            tracing::warn!(provider = provider.as_str(), error = %err, "login callback failed");
            Ok(Redirect::temporary("/?chenghub_login=error").into_response())
        }
    }
}

/// POST /api/v1/auth/logout — revoke the browser session and clear the
/// cookie.
pub async fn logout(State(state): State<ApiState>, jar: CookieJar) -> Result<Response> {
    if let Some(cookie) = jar.get(&state.config.cookies.name) {
        state.identity.logout(cookie.value()).await?;
    }
    let jar = jar.add(clear_session_cookie(&state.config.cookies));
    Ok((jar, Json(serde_json::json!({ "ok": true }))).into_response())
}

/// GET /api/v1/auth/me — works with both session cookies and bearer tokens.
pub async fn me(State(state): State<ApiState>, MaybeUser(user): MaybeUser) -> Json<MeResponse> {
    let providers = state
        .identity
        .enabled_providers()
        .iter()
        .map(|p| p.as_str().to_string())
        .collect();
    match user {
        Some(ctx) => Json(MeResponse {
            authenticated: true,
            user: Some(UserDto::from_user(&ctx.user, &ctx.roles)),
            providers,
        }),
        None => Json(MeResponse { authenticated: false, user: None, providers }),
    }
}

/// GET /api/v1/auth/identities
pub async fn list_identities(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
) -> Result<Json<Vec<IdentityDto>>> {
    let identities = state.identity.list_identities(ctx.user.id).await?;
    Ok(Json(identities.into_iter().map(IdentityDto::from).collect()))
}

/// DELETE /api/v1/auth/identities/:id — cookie-only (account security).
pub async fn unlink_identity(
    State(state): State<ApiState>,
    RequireSessionUser(ctx): RequireSessionUser,
    Path(identity_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.identity.unlink_identity(ctx.user.id, identity_id).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// POST /api/v1/auth/tokens/refresh — rotate a refresh token.
pub async fn refresh_tokens(
    State(state): State<ApiState>,
    Json(request): Json<RefreshRequest>,
) -> Result<Json<crate::domain::identity::TokenPair>> {
    Ok(Json(state.identity.refresh(&request.refresh_token).await?))
}

/// GET /api/v1/auth/tokens
pub async fn list_tokens(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
) -> Result<Json<Vec<TokenDto>>> {
    let tokens = state.identity.list_tokens(ctx.user.id).await?;
    Ok(Json(tokens.into_iter().map(TokenDto::from).collect()))
}

/// POST /api/v1/auth/tokens — mint a personal token pair (cookie-only: a
/// bearer token must not mint further tokens).
pub async fn create_token(
    State(state): State<ApiState>,
    RequireSessionUser(ctx): RequireSessionUser,
    Json(request): Json<CreateTokenRequest>,
) -> Result<Json<crate::domain::identity::TokenPair>> {
    ctx.ensure_can_write()?;
    let label: String = request.label.chars().take(80).collect();
    let pair = state
        .identity
        .issue_token_pair(ctx.user.id, &label, &["community".to_string()])
        .await?;
    Ok(Json(pair))
}

/// DELETE /api/v1/auth/tokens/:id
pub async fn revoke_token(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(token_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.identity.revoke_token(ctx.user.id, token_id).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}
