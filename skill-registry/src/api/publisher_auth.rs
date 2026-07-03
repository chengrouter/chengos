//! Publisher authentication endpoints: assertion preview, authorize
//! confirmation, grant-code exchange, and token management.
//!
//! The Registry never sees ChengFlow credentials — only signed identity
//! assertions and its own tokens. Plaintext tokens appear exactly once, in
//! the exchange/create responses.

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::api::middleware::RequireAuth;
use crate::api::ApiState;
use crate::domain::publisher::PublisherType;
use crate::error::{RegistryError, Result};
use crate::services::publisher_auth_service::{PublisherChoice, SignedAssertion};

#[derive(Deserialize)]
pub struct PreviewBody {
    pub assertion: SignedAssertion,
}

/// `POST /api/v1/auth/preview` — consent screen data for the browser flow.
pub async fn preview(
    State(state): State<ApiState>,
    Json(body): Json<PreviewBody>,
) -> Result<Json<serde_json::Value>> {
    let preview = state.auth.preview_authorize(&body.assertion).await?;
    Ok(Json(serde_json::json!({
        "subject": preview.subject,
        "issuer": preview.issuer_label,
        "display_name": preview.display_name,
        "publishers": preview.publishers.iter().map(|(publisher, role)| serde_json::json!({
            "handle": publisher.handle,
            "display_name": publisher.display_name,
            "role": role.as_str(),
        })).collect::<Vec<_>>(),
        "return_uri": preview.return_uri,
        "state": preview.state,
    })))
}

#[derive(Deserialize)]
pub struct AuthorizeBody {
    pub assertion: SignedAssertion,
    pub scopes: Vec<String>,
    /// Exactly one of `publisher` (existing handle) or `new_publisher`.
    #[serde(default)]
    pub publisher: Option<String>,
    #[serde(default)]
    pub new_publisher: Option<NewPublisherBody>,
}

#[derive(Deserialize)]
pub struct NewPublisherBody {
    pub handle: String,
    pub display_name: String,
    #[serde(default)]
    pub organization: bool,
}

/// `POST /api/v1/auth/authorize` — the user confirmed; mint a one-time code.
pub async fn authorize(
    State(state): State<ApiState>,
    Json(body): Json<AuthorizeBody>,
) -> Result<Json<serde_json::Value>> {
    let choice = match (body.publisher, body.new_publisher) {
        (Some(handle), None) => PublisherChoice::Existing { handle },
        (None, Some(new)) => PublisherChoice::New {
            handle: new.handle,
            display_name: new.display_name,
            publisher_type: if new.organization {
                PublisherType::Organization
            } else {
                PublisherType::Personal
            },
        },
        _ => {
            return Err(RegistryError::validation(
                "INVALID_CHOICE",
                "provide exactly one of `publisher` or `new_publisher`",
            ))
        }
    };
    let issued = state
        .auth
        .confirm_authorize(&body.assertion, choice, body.scopes)
        .await?;
    Ok(Json(serde_json::json!({
        "code": issued.code,
        "return_uri": issued.return_uri,
        "state": issued.state,
        "publisher": issued.publisher.handle,
    })))
}

#[derive(Deserialize)]
pub struct ExchangeBody {
    pub code: String,
}

#[derive(Serialize)]
pub struct TokenIssuedDto {
    pub token: String,
    pub token_id: Uuid,
    pub kind: String,
    pub scopes: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<chrono::DateTime<chrono::Utc>>,
    pub publisher: String,
}

/// `POST /api/v1/auth/exchange` — server-to-server code -> grant token.
pub async fn exchange(
    State(state): State<ApiState>,
    Json(body): Json<ExchangeBody>,
) -> Result<Json<TokenIssuedDto>> {
    let issued = state.auth.exchange_grant_code(&body.code).await?;
    Ok(Json(TokenIssuedDto {
        token: issued.token,
        token_id: issued.token_id,
        kind: issued.kind.as_str().to_string(),
        scopes: issued.scopes,
        expires_at: issued.expires_at,
        publisher: issued.publisher.handle,
    }))
}

/// `GET /api/v1/tokens`
pub async fn list_tokens(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
) -> Result<Json<serde_json::Value>> {
    let tokens = state.auth.list_tokens(&auth).await?;
    Ok(Json(serde_json::json!({
        "tokens": tokens.iter().map(|token| serde_json::json!({
            "id": token.id,
            "kind": token.kind.as_str(),
            "label": token.label,
            "scopes": token.scopes,
            "created_at": token.created_at,
            "expires_at": token.expires_at,
            "revoked_at": token.revoked_at,
            "last_used_at": token.last_used_at,
        })).collect::<Vec<_>>(),
    })))
}

#[derive(Deserialize)]
pub struct CreateTokenBody {
    pub label: String,
    pub scopes: Vec<String>,
    #[serde(default)]
    pub expires_in_secs: Option<u64>,
}

/// `POST /api/v1/tokens` — mint an API token (CI publishing).
pub async fn create_token(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Json(body): Json<CreateTokenBody>,
) -> Result<(StatusCode, Json<TokenIssuedDto>)> {
    let issued = state
        .auth
        .create_api_token(&auth, body.label, body.scopes, body.expires_in_secs)
        .await?;
    Ok((
        StatusCode::CREATED,
        Json(TokenIssuedDto {
            token: issued.token,
            token_id: issued.token_id,
            kind: issued.kind.as_str().to_string(),
            scopes: issued.scopes,
            expires_at: issued.expires_at,
            publisher: issued.publisher.handle,
        }),
    ))
}

/// `DELETE /api/v1/tokens/{token_id}`
pub async fn revoke_token(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path(token_id): Path<Uuid>,
) -> Result<StatusCode> {
    state.auth.revoke_token(&auth, token_id).await?;
    Ok(StatusCode::NO_CONTENT)
}
