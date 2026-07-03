//! Publisher authentication domain: external identities, ChengFlow identity
//! assertions, grant codes, and tokens.
//!
//! The Registry has no passwords. A ChengFlow instance signs a short-lived
//! Identity Assertion with its instance key; the Registry establishes the
//! identity as `provider_key_fingerprint + subject`. The issuer string is a
//! display label only until stronger OIDC/domain verification exists.

use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::publisher::PublisherId;

pub type IdentityId = Uuid;
pub type TokenId = Uuid;

/// A linked external identity (one ChengFlow user seen from one instance key).
#[derive(Debug, Clone)]
pub struct ExternalIdentity {
    pub id: IdentityId,
    /// SHA-256 fingerprint (lowercase hex) of the ChengFlow instance's
    /// Ed25519 public key. Primary identity component.
    pub provider_key_fingerprint: String,
    /// Stable subject within that instance (ChengFlow user id).
    pub subject: String,
    /// Display/source label only (e.g. "https://flow.acme.com"). NOT verified.
    pub issuer_label: String,
    pub display_name: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_seen_at: DateTime<Utc>,
}

/// Pending re-link created when a known subject shows up signed by a new
/// instance key. It gains publisher control only after confirmation by an
/// existing valid grant, admin recovery, or a rotation assertion signed by
/// the old key.
#[derive(Debug, Clone)]
pub struct PendingIdentityLink {
    pub id: Uuid,
    pub existing_identity_id: IdentityId,
    pub new_key_fingerprint: String,
    pub new_issuer_label: String,
    pub created_at: DateTime<Utc>,
    pub confirmed_at: Option<DateTime<Utc>>,
}

/// Parsed identity assertion payload (signature verification happens in the
/// auth service against the embedded public key).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentityAssertion {
    /// Base64 Ed25519 public key of the ChengFlow instance.
    pub public_key: String,
    /// ChengFlow user id (stable subject).
    pub subject: String,
    /// Display label for the instance (URL-ish). Unverified.
    pub issuer: String,
    /// Must equal this registry's public URL.
    pub audience: String,
    /// Where the browser is sent back after authorization.
    pub return_uri: String,
    /// Opaque CSRF state from ChengFlow, echoed back.
    pub state: String,
    /// Unique assertion id for replay protection.
    pub jti: String,
    /// Unix seconds.
    pub issued_at: i64,
    /// Unix seconds.
    pub expires_at: i64,
    /// Optional display name for first-time linking UX.
    #[serde(default)]
    pub display_name: Option<String>,
    /// Optional rotation proof: an assertion signed by the OLD key vouching
    /// for the new key fingerprint.
    #[serde(default)]
    pub rotation_of_fingerprint: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TokenKind {
    /// Issued through the browser grant flow; held by a ChengFlow server.
    Grant,
    /// Manually created API token (CI publishing).
    Api,
}

impl TokenKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Grant => "grant",
            Self::Api => "api",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "grant" => Some(Self::Grant),
            "api" => Some(Self::Api),
            _ => None,
        }
    }
}

/// Token scopes. Publishing needs `publish`; token management needs `tokens`.
pub mod scopes {
    pub const PUBLISH: &str = "publish";
    pub const YANK: &str = "yank";
    pub const TOKENS: &str = "tokens";
    pub const ALL: &[&str] = &[PUBLISH, YANK, TOKENS];
}

/// A stored token. Only the HMAC hash is persisted; plaintext is shown once.
#[derive(Debug, Clone)]
pub struct PublisherToken {
    pub id: TokenId,
    pub identity_id: IdentityId,
    pub publisher_id: PublisherId,
    pub kind: TokenKind,
    pub label: String,
    /// HMAC-SHA256(token_hmac_secret, token) as lowercase hex.
    pub token_hash: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub last_used_at: Option<DateTime<Utc>>,
}

impl PublisherToken {
    pub fn is_active(&self, now: DateTime<Utc>) -> bool {
        self.revoked_at.is_none() && self.expires_at.map(|e| e > now).unwrap_or(true)
    }
    pub fn has_scope(&self, scope: &str) -> bool {
        self.scopes.iter().any(|s| s == scope)
    }
}

/// One-time grant code issued after a successful authorize step; exchanged
/// server-to-server for a grant token.
#[derive(Debug, Clone)]
pub struct GrantCode {
    pub id: Uuid,
    pub identity_id: IdentityId,
    pub publisher_id: PublisherId,
    /// HMAC hash of the one-time code.
    pub code_hash: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub consumed_at: Option<DateTime<Utc>>,
}

impl GrantCode {
    pub fn is_exchangeable(&self, now: DateTime<Utc>) -> bool {
        self.consumed_at.is_none() && self.expires_at > now
    }
}

pub fn validate_assertion_times(
    assertion: &IdentityAssertion,
    now: DateTime<Utc>,
    max_age: Duration,
) -> Result<(), String> {
    let issued = DateTime::<Utc>::from_timestamp(assertion.issued_at, 0)
        .ok_or_else(|| "invalid issued_at".to_string())?;
    let expires = DateTime::<Utc>::from_timestamp(assertion.expires_at, 0)
        .ok_or_else(|| "invalid expires_at".to_string())?;
    // small clock-skew allowance
    let skew = Duration::seconds(30);
    if issued > now + skew {
        return Err("assertion issued in the future".into());
    }
    if expires <= now {
        return Err("assertion expired".into());
    }
    if expires - issued > max_age + skew {
        return Err("assertion validity window too long".into());
    }
    if now - issued > max_age + skew {
        return Err("assertion too old".into());
    }
    Ok(())
}

pub fn validate_scopes(requested: &[String]) -> Result<(), String> {
    if requested.is_empty() {
        return Err("at least one scope required".into());
    }
    for scope in requested {
        if !scopes::ALL.contains(&scope.as_str()) {
            return Err(format!("unknown scope {scope:?}"));
        }
    }
    Ok(())
}
