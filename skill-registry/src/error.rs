//! Stable error codes and problem+json-style HTTP responses.
//!
//! Every API failure maps to a stable machine-readable `code`. Codes are
//! frozen once shipped; new failure modes get new codes. Responses carry the
//! request id and safe details only — never SQL, paths, or secrets.

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

/// Package validation error codes shared with `skill-package-spec` §9.
pub mod codes {
    pub const PKG_MISSING_REQUIRED_FILE: &str = "PKG_MISSING_REQUIRED_FILE";
    pub const PKG_UNKNOWN_ROOT_ENTRY: &str = "PKG_UNKNOWN_ROOT_ENTRY";
    pub const PKG_ABSOLUTE_PATH: &str = "PKG_ABSOLUTE_PATH";
    pub const PKG_PATH_TRAVERSAL: &str = "PKG_PATH_TRAVERSAL";
    pub const PKG_PATH_TOO_LONG: &str = "PKG_PATH_TOO_LONG";
    pub const PKG_DUPLICATE_PATH: &str = "PKG_DUPLICATE_PATH";
    pub const PKG_SYMLINK_FORBIDDEN: &str = "PKG_SYMLINK_FORBIDDEN";
    pub const PKG_HARDLINK_FORBIDDEN: &str = "PKG_HARDLINK_FORBIDDEN";
    pub const PKG_SPECIAL_FILE_FORBIDDEN: &str = "PKG_SPECIAL_FILE_FORBIDDEN";
    pub const PKG_NESTED_ARCHIVE: &str = "PKG_NESTED_ARCHIVE";
    pub const PKG_TOO_MANY_FILES: &str = "PKG_TOO_MANY_FILES";
    pub const PKG_FILE_TOO_LARGE: &str = "PKG_FILE_TOO_LARGE";
    pub const PKG_EXPANDED_TOO_LARGE: &str = "PKG_EXPANDED_TOO_LARGE";
    pub const PKG_COMPRESSION_RATIO: &str = "PKG_COMPRESSION_RATIO";
    pub const PKG_INVALID_UTF8: &str = "PKG_INVALID_UTF8";
    pub const PKG_INVALID_YAML: &str = "PKG_INVALID_YAML";
    pub const PKG_INVALID_JSON: &str = "PKG_INVALID_JSON";
    pub const PKG_MANIFEST_INVALID: &str = "PKG_MANIFEST_INVALID";
    pub const PKG_MANIFEST_MISMATCH: &str = "PKG_MANIFEST_MISMATCH";
    pub const PKG_SLUG_MISMATCH: &str = "PKG_SLUG_MISMATCH";
    pub const PKG_VERSION_MISMATCH: &str = "PKG_VERSION_MISMATCH";
    pub const PKG_INVALID_SEMVER: &str = "PKG_INVALID_SEMVER";
    pub const PKG_INVALID_SLUG: &str = "PKG_INVALID_SLUG";
    pub const PKG_UNDECLARED_SCRIPT: &str = "PKG_UNDECLARED_SCRIPT";
    pub const PKG_SCRIPT_DECLARATION_INVALID: &str = "PKG_SCRIPT_DECLARATION_INVALID";
    pub const PKG_BINARY_FORBIDDEN: &str = "PKG_BINARY_FORBIDDEN";
    pub const PKG_BYTECODE_FORBIDDEN: &str = "PKG_BYTECODE_FORBIDDEN";
    pub const PKG_DEPENDENCIES_UNSUPPORTED: &str = "PKG_DEPENDENCIES_UNSUPPORTED";
    pub const PKG_DIGEST_MISMATCH: &str = "PKG_DIGEST_MISMATCH";
    pub const PKG_FORBIDDEN_CONTENT: &str = "PKG_FORBIDDEN_CONTENT";
}

#[derive(Debug, thiserror::Error)]
pub enum RegistryError {
    /// Request-shape problems: bad params, bad cursor, bad body.
    #[error("{message}")]
    Validation { code: &'static str, message: String },

    /// Package v1 validation failures. `errors` holds all collected codes.
    #[error("package validation failed")]
    PackageInvalid { errors: Vec<PackageError> },

    #[error("{0} not found")]
    NotFound(&'static str),

    /// Uniqueness conflicts (duplicate version, handle, slug, idempotency).
    #[error("{message}")]
    Conflict { code: &'static str, message: String },

    /// Domain state-machine violations (e.g. publish from a scanned-rejected
    /// release, complete on an expired session).
    #[error("{message}")]
    InvalidState { code: &'static str, message: String },

    #[error("authentication required")]
    Unauthorized { message: String },

    #[error("forbidden")]
    Forbidden { message: String },

    #[error("rate limit exceeded")]
    RateLimited { retry_after_secs: u64 },

    #[error("payload too large")]
    PayloadTooLarge { limit_bytes: u64 },

    /// Storage volume full — stable code so operators can alert on it.
    #[error("artifact storage full")]
    StorageFull,

    /// Database schema does not match the binary's expected migrations.
    #[error("database migration mismatch: {0}")]
    MigrationMismatch(String),

    /// Registry is up but a required dependency is not.
    #[error("service unavailable: {0}")]
    Unavailable(String),

    /// Anything unexpected. Internal detail is logged, never returned.
    #[error("internal error")]
    Internal(#[from] anyhow::Error),
}

#[derive(Debug, Clone, Serialize)]
pub struct PackageError {
    pub code: String,
    pub message: String,
    /// Offending archive path when applicable.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
}

impl PackageError {
    pub fn new(code: &str, message: impl Into<String>) -> Self {
        Self { code: code.to_string(), message: message.into(), path: None }
    }
    pub fn at(code: &str, message: impl Into<String>, path: impl Into<String>) -> Self {
        Self { code: code.to_string(), message: message.into(), path: Some(path.into()) }
    }
}

impl RegistryError {
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
        Self::Forbidden { message: message.into() }
    }

    pub fn status(&self) -> StatusCode {
        match self {
            Self::Validation { .. } | Self::PackageInvalid { .. } => StatusCode::UNPROCESSABLE_ENTITY,
            Self::NotFound(_) => StatusCode::NOT_FOUND,
            Self::Conflict { .. } => StatusCode::CONFLICT,
            Self::InvalidState { .. } => StatusCode::CONFLICT,
            Self::Unauthorized { .. } => StatusCode::UNAUTHORIZED,
            Self::Forbidden { .. } => StatusCode::FORBIDDEN,
            Self::RateLimited { .. } => StatusCode::TOO_MANY_REQUESTS,
            Self::PayloadTooLarge { .. } => StatusCode::PAYLOAD_TOO_LARGE,
            Self::StorageFull => StatusCode::INSUFFICIENT_STORAGE,
            Self::MigrationMismatch(_) | Self::Unavailable(_) => StatusCode::SERVICE_UNAVAILABLE,
            Self::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn code(&self) -> &str {
        match self {
            Self::Validation { code, .. } => code,
            Self::PackageInvalid { .. } => "PACKAGE_INVALID",
            Self::NotFound(_) => "NOT_FOUND",
            Self::Conflict { code, .. } => code,
            Self::InvalidState { code, .. } => code,
            Self::Unauthorized { .. } => "UNAUTHORIZED",
            Self::Forbidden { .. } => "FORBIDDEN",
            Self::RateLimited { .. } => "RATE_LIMITED",
            Self::PayloadTooLarge { .. } => "PAYLOAD_TOO_LARGE",
            Self::StorageFull => "STORAGE_FULL",
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

impl From<sqlx::Error> for RegistryError {
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
    #[serde(skip_serializing_if = "Vec::is_empty", default)]
    pub errors: Vec<PackageError>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retry_after_secs: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,
}

impl IntoResponse for RegistryError {
    fn into_response(self) -> Response {
        let status = self.status();
        if status == StatusCode::INTERNAL_SERVER_ERROR {
            tracing::error!(error = ?self, "internal error");
        }
        let (detail, errors, retry_after) = match &self {
            Self::PackageInvalid { errors } => (None, errors.clone(), None),
            Self::RateLimited { retry_after_secs } => (
                Some("rate limit exceeded".to_string()),
                vec![],
                Some(*retry_after_secs),
            ),
            Self::Internal(_) => (None, vec![], None),
            other => (Some(other.to_string()), vec![], None),
        };
        let body = ProblemBody {
            code: self.code().to_string(),
            title: status.canonical_reason().unwrap_or("error").to_string(),
            detail,
            errors,
            retry_after_secs: retry_after,
            // Filled by the request-id response layer when present.
            request_id: None,
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

pub type Result<T, E = RegistryError> = std::result::Result<T, E>;
