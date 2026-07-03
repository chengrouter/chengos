//! Publisher accounts and membership.
//!
//! A publisher is the public owner of skills (`publisher/slug`). Publishers
//! are controlled by linked external identities (see [`super::publisher_auth`]),
//! never by Registry-local passwords.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub type PublisherId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PublisherType {
    Personal,
    Organization,
}

impl PublisherType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Personal => "personal",
            Self::Organization => "organization",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "personal" => Some(Self::Personal),
            "organization" => Some(Self::Organization),
            _ => None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Publisher {
    pub id: PublisherId,
    /// Stable public handle (`^[a-z0-9][a-z0-9-]{1,38}$`). Immutable after
    /// creation in MVP: skills are addressed as `handle/slug`.
    pub handle: String,
    pub display_name: String,
    pub publisher_type: PublisherType,
    pub verified: bool,
    pub banned_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Publisher {
    pub fn is_banned(&self) -> bool {
        self.banned_at.is_some()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MemberRole {
    /// Full control including member and token management.
    Owner,
    /// May publish releases and yank own versions.
    Maintainer,
}

impl MemberRole {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Owner => "owner",
            Self::Maintainer => "maintainer",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "owner" => Some(Self::Owner),
            "maintainer" => Some(Self::Maintainer),
            _ => None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct PublisherMember {
    pub publisher_id: PublisherId,
    pub identity_id: Uuid,
    pub role: MemberRole,
    pub added_at: DateTime<Utc>,
}

pub const HANDLE_MAX_LEN: usize = 39;
pub const RESERVED_HANDLES: &[&str] = &[
    "admin", "administrator", "api", "auth", "chengos", "chengflow", "internal", "moderation",
    "official", "publisher", "registry", "root", "security", "skill", "skills", "support",
    "system", "www",
];

/// Stable handle rule shared with the package spec: lowercase alphanumeric
/// plus `-`, must start alphanumeric, no trailing `-`, 2..=39 chars, not
/// reserved.
pub fn validate_handle(handle: &str) -> Result<(), String> {
    if handle.len() < 2 || handle.len() > HANDLE_MAX_LEN {
        return Err(format!("handle must be 2..={HANDLE_MAX_LEN} characters"));
    }
    let bytes = handle.as_bytes();
    if !bytes[0].is_ascii_lowercase() && !bytes[0].is_ascii_digit() {
        return Err("handle must start with a lowercase letter or digit".into());
    }
    if bytes[bytes.len() - 1] == b'-' {
        return Err("handle must not end with '-'".into());
    }
    if !bytes
        .iter()
        .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || *b == b'-')
    {
        return Err("handle may contain only [a-z0-9-]".into());
    }
    if RESERVED_HANDLES.contains(&handle) {
        return Err("handle is reserved".into());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn handle_rules() {
        assert!(validate_handle("acme").is_ok());
        assert!(validate_handle("a1-b2").is_ok());
        assert!(validate_handle("A").is_err());
        assert!(validate_handle("-x").is_err());
        assert!(validate_handle("x-").is_err());
        assert!(validate_handle("admin").is_err());
        assert!(validate_handle(&"a".repeat(40)).is_err());
    }
}
