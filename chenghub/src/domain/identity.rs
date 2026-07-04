//! Identity domain: users, external identities, sessions, tokens, and
//! device authorizations.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub type UserId = Uuid;
pub type IdentityId = Uuid;
pub type SessionId = Uuid;
pub type TokenId = Uuid;
pub type DeviceAuthId = Uuid;

/// Supported external login providers. Adding QQ (or any other provider)
/// extends this enum and supplies an adapter; the identity model is
/// provider-agnostic beyond the `(provider, provider_subject)` key.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AuthProvider {
    Github,
    Wechat,
    Qq,
}

impl AuthProvider {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Github => "github",
            Self::Wechat => "wechat",
            Self::Qq => "qq",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "github" => Self::Github,
            "wechat" => Self::Wechat,
            "qq" => Self::Qq,
            _ => return None,
        })
    }
}

/// Token scopes. V1 issues `community` for device-flow tokens.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AuthScope {
    Community,
}

impl AuthScope {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Community => "community",
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct ChengHubUser {
    pub id: UserId,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    pub banned_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl ChengHubUser {
    pub fn is_banned(&self) -> bool {
        self.banned_at.is_some()
    }
}

/// A provider-normalized profile, produced by OAuth adapters.
#[derive(Debug, Clone)]
pub struct ExternalUserProfile {
    pub provider: AuthProvider,
    /// Stable subject: GitHub id, WeChat unionid (openid fallback), QQ openid.
    pub subject: String,
    pub username_hint: Option<String>,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    /// Normalized extra fields worth keeping (never raw tokens).
    pub profile: serde_json::Value,
}

#[derive(Debug, Clone, Serialize)]
pub struct ExternalIdentity {
    pub id: IdentityId,
    pub user_id: UserId,
    pub provider: AuthProvider,
    pub provider_subject: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_login_at: DateTime<Utc>,
}

#[derive(Debug, Clone)]
pub struct UserSession {
    pub id: SessionId,
    pub user_id: UserId,
    pub created_at: DateTime<Utc>,
    pub last_seen_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AccessToken {
    pub id: TokenId,
    pub user_id: UserId,
    pub label: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub last_used_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone)]
pub struct RefreshToken {
    pub id: TokenId,
    pub user_id: UserId,
    pub access_token_id: Option<TokenId>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub rotated_to: Option<TokenId>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DeviceAuthStatus {
    Pending,
    Approved,
    Denied,
    Expired,
    /// Approved and the token was handed out; the device code is dead.
    Consumed,
}

impl DeviceAuthStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Pending => "pending",
            Self::Approved => "approved",
            Self::Denied => "denied",
            Self::Expired => "expired",
            Self::Consumed => "consumed",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "pending" => Self::Pending,
            "approved" => Self::Approved,
            "denied" => Self::Denied,
            "expired" => Self::Expired,
            "consumed" => Self::Consumed,
            _ => return None,
        })
    }
}

#[derive(Debug, Clone)]
pub struct DeviceAuthorization {
    pub id: DeviceAuthId,
    pub user_code: String,
    pub client_name: String,
    pub scopes: Vec<String>,
    pub status: DeviceAuthStatus,
    pub user_id: Option<UserId>,
    pub interval_secs: i32,
    pub last_polled_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
}

impl DeviceAuthorization {
    pub fn is_expired(&self, now: DateTime<Utc>) -> bool {
        now >= self.expires_at
    }
}

/// Issued token pair returned to device-flow clients and refresh calls.
#[derive(Debug, Clone, Serialize)]
pub struct TokenPair {
    pub access_token: String,
    pub token_type: &'static str,
    pub expires_in: i64,
    pub refresh_token: String,
    pub scope: String,
}
