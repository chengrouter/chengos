//! User roles and the privilege lattice.
//!
//! * `user` — implicit baseline; never stored in `user_roles`.
//! * `moderator` — content moderation: reports, hide/restore, bans.
//! * `operator` — requirement triage: status changes, duplicate merge.
//! * `admin` — all privileged operations, including role management.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Role {
    User,
    Moderator,
    Operator,
    Admin,
}

impl Role {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::User => "user",
            Self::Moderator => "moderator",
            Self::Operator => "operator",
            Self::Admin => "admin",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "user" => Self::User,
            "moderator" => Self::Moderator,
            "operator" => Self::Operator,
            "admin" => Self::Admin,
            _ => return None,
        })
    }
}

/// The role set attached to an authenticated principal.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct RoleSet(pub Vec<Role>);

impl RoleSet {
    pub fn has(&self, role: Role) -> bool {
        role == Role::User || self.0.contains(&role) || self.0.contains(&Role::Admin)
    }
    pub fn is_moderator(&self) -> bool {
        self.has(Role::Moderator)
    }
    pub fn is_operator(&self) -> bool {
        self.has(Role::Operator)
    }
    pub fn is_admin(&self) -> bool {
        self.0.contains(&Role::Admin)
    }
    /// Moderator, operator, or admin: may see hidden content.
    pub fn is_staff(&self) -> bool {
        self.is_moderator() || self.is_operator()
    }
}
