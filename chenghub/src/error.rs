//! Stable error codes and problem+json-style HTTP responses.
//!
//! Every API failure maps to a stable machine-readable `code`. Codes are
//! frozen once shipped; new failure modes get new codes. Responses carry
//! safe details only — never SQL, provider payloads, or secrets.

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

/// Stable validation / state error codes shared with the ChengFlow proxy
/// and UI. Frozen once shipped.
pub mod codes {
    // Request shape
    pub const INVALID_PARAM: &str = "INVALID_PARAM";
    pub const INVALID_CURSOR: &str = "INVALID_CURSOR";
    pub const TITLE_TOO_LONG: &str = "TITLE_TOO_LONG";
    pub const BODY_TOO_LARGE: &str = "BODY_TOO_LARGE";
    pub const TOO_MANY_TAGS: &str = "TOO_MANY_TAGS";
    pub const TAG_INVALID: &str = "TAG_INVALID";

    // Identity / OAuth
    pub const OAUTH_STATE_INVALID: &str = "OAUTH_STATE_INVALID";
    pub const OAUTH_PROVIDER_ERROR: &str = "OAUTH_PROVIDER_ERROR";
    pub const PROVIDER_DISABLED: &str = "PROVIDER_DISABLED";
    pub const LAST_IDENTITY: &str = "LAST_IDENTITY";

    // Device flow (RFC 8628 wire codes, lowercase by spec)
    pub const AUTHORIZATION_PENDING: &str = "authorization_pending";
    pub const SLOW_DOWN: &str = "slow_down";
    pub const EXPIRED_TOKEN: &str = "expired_token";
    pub const ACCESS_DENIED: &str = "access_denied";
    pub const INVALID_GRANT: &str = "invalid_grant";

    // Community state
    pub const NOT_REQUIREMENT: &str = "NOT_REQUIREMENT";
    pub const INVALID_STATUS_TRANSITION: &str = "INVALID_STATUS_TRANSITION";
    pub const DUPLICATE_TARGET_REQUIRED: &str = "DUPLICATE_TARGET_REQUIRED";
    pub const MERGE_TARGET_INVALID: &str = "MERGE_TARGET_INVALID";
    pub const POST_LOCKED: &str = "POST_LOCKED";
    pub const ALREADY_SUPPORTED: &str = "ALREADY_SUPPORTED";
    pub const SUPPORT_NOT_REMOVABLE: &str = "SUPPORT_NOT_REMOVABLE";
    pub const USER_BANNED: &str = "USER_BANNED";
    pub const REPORT_ALREADY_RESOLVED: &str = "REPORT_ALREADY_RESOLVED";

    // Workflow sharing
    pub const SHARE_UNSANITIZED: &str = "SHARE_UNSANITIZED";
    pub const SHARE_SECRET_DETECTED: &str = "SHARE_SECRET_DETECTED";
    pub const SHARE_PAYLOAD_INVALID: &str = "SHARE_PAYLOAD_INVALID";
}

#[derive(Debug, thiserror::Error)]
pub enum HubError {
    /// Request-shape problems: bad params, bad cursor, bad body.
    #[error("{message}")]
    Validation { code: &'static str, message: String },

    #[error("{0} not found")]
    NotFound(&'static str),

    /// Uniqueness conflicts (duplicate reaction, username, idempotency).
    #[error("{message}")]
    Conflict { code: &'static str, message: String },

    /// Domain state-machine violations (bad status transition, merge into
    /// duplicate, device code already consumed).
    #[error("{message}")]
    InvalidState { code: &'static str, message: String },

    #[error("authentication required")]
    Unauthorized { message: String },

    #[error("{message}")]
    Forbidden { code: &'static str, message: String },

    /// Device-flow polling outcomes carry RFC 8628 wire codes and always
    /// render as 400 with `{"error": <code>}` per spec.
    #[error("device flow: {code}")]
    DeviceFlow { code: &'static str },

    #[error("rate limit exceeded")]
    RateLimited { retry_after_secs: u64 },

    #[error("payload too large")]
    PayloadTooLarge { limit_bytes: u64 },

    /// Database schema does not match the binary's expected migrations.
    #[error("database migration mismatch: {0}")]
    MigrationMismatch(String),

    /// ChengHub is up but a required dependency is not.
    #[error("service unavailable: {0}")]
    Unavailable(String),

    /// Anything unexpected. Internal detail is logged, never returned.
    #[error("internal error")]
    Internal(#[from] anyhow::Error),
}

impl HubError {
    pub fn validation(code: &'static str, message: impl Into<String>) -> Self {
        Self::Validation { code, message: message.into() }
    }
    pub fn conflict(code: &'static str, message: impl Into<String>) -> Self {
        Self::Conflict { code, message: message.into() }
    }
    pub fn invalid_state(code: &'static str, message: impl Into<String>) -> Self {
        Self::InvalidState { code, message: message.into() }
    }
    pub fn unauthorized(message: impl Into<String>) -> Self {
        Self::Unauthorized { message: message.into() }
    }
    pub fn forbidden(message: impl Into<String>) -> Self {
        Self::Forbidden { code: "FORBIDDEN", message: message.into() }
    }
    pub fn banned() -> Self {
        Self::Forbidden { code: codes::USER_BANNED, message: "account is banned".into() }
    }
    pub fn device(code: &'static str) -> Self {
        Self::DeviceFlow { code }
    }

    pub fn status(&self) -> StatusCode {
        match self {
            Self::Validation { .. } => StatusCode::UNPROCESSABLE_ENTITY,
            Self::NotFound(_) => StatusCode::NOT_FOUND,
            Self::Conflict { .. } | Self::InvalidState { .. } => StatusCode::CONFLICT,
            Self::Unauthorized { .. } => StatusCode::UNAUTHORIZED,
            Self::Forbidden { .. } => StatusCode::FORBIDDEN,
            Self::DeviceFlow { .. } => StatusCode::BAD_REQUEST,
            Self::RateLimited { .. } => StatusCode::TOO_MANY_REQUESTS,
            Self::PayloadTooLarge { .. } => StatusCode::PAYLOAD_TOO_LARGE,
            Self::MigrationMismatch(_) | Self::Unavailable(_) => StatusCode::SERVICE_UNAVAILABLE,
            Self::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn code(&self) -> &str {
        match self {
            Self::Validation { code, .. } => code,
            Self::NotFound(_) => "NOT_FOUND",
            Self::Conflict { code, .. } => code,
            Self::InvalidState { code, .. } => code,
            Self::Unauthorized { .. } => "UNAUTHORIZED",
            Self::Forbidden { code, .. } => code,
            Self::DeviceFlow { code } => code,
            Self::RateLimited { .. } => "RATE_LIMITED",
            Self::PayloadTooLarge { .. } => "PAYLOAD_TOO_LARGE",
            Self::MigrationMismatch(_) => "MIGRATION_MISMATCH",
            Self::Unavailable(_) => "SERVICE_UNAVAILABLE",
            Self::Internal(_) => "INTERNAL",
        }
    }

    /// Map low-level sqlx failures onto stable categories.
    pub fn from_sqlx(err: sqlx::Error) -> Self {
        match &err {
            sqlx::Error::RowNotFound => Self::NotFound("resource"),
            sqlx::Error::Database(db) if db.is_unique_violation() => Self::Conflict {
                code: "UNIQUE_CONFLICT",
                message: "a conflicting record already exists".into(),
            },
            _ => Self::Internal(anyhow::Error::new(err)),
        }
    }
}

impl From<sqlx::Error> for HubError {
    fn from(err: sqlx::Error) -> Self {
        Self::from_sqlx(err)
    }
}

/// problem+json-style body. `code` is the stable contract; `title` is
/// human-readable and may change.
#[derive(Debug, Serialize)]
pub struct ProblemBody {
    pub code: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retry_after_secs: Option<u64>,
}

impl IntoResponse for HubError {
    fn into_response(self) -> Response {
        let status = self.status();
        if status == StatusCode::INTERNAL_SERVER_ERROR {
            tracing::error!(error = ?self, "internal error");
        }

        // RFC 8628 requires `{"error": "<code>"}` on the token endpoint.
        if let Self::DeviceFlow { code } = self {
            return (status, Json(serde_json::json!({ "error": code }))).into_response();
        }

        let (detail, retry_after) = match &self {
            Self::RateLimited { retry_after_secs } => {
                (Some("rate limit exceeded".to_string()), Some(*retry_after_secs))
            }
            Self::Internal(_) => (None, None),
            other => (Some(other.to_string()), None),
        };
        let body = ProblemBody {
            code: self.code().to_string(),
            title: status.canonical_reason().unwrap_or("error").to_string(),
            detail,
            retry_after_secs: retry_after,
        };
        let mut response = (status, Json(body)).into_response();
        if let Self::RateLimited { retry_after_secs } = self {
            if let Ok(v) = retry_after_secs.to_string().parse() {
                response.headers_mut().insert(axum::http::header::RETRY_AFTER, v);
            }
        }
        response
    }
}

pub type Result<T, E = HubError> = std::result::Result<T, E>;
