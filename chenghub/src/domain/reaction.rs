//! Reactions. Support is one-way (add once, never remove through public
//! APIs); like and star toggle. Comments support like only.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PostReaction {
    Support,
    Like,
    Star,
}

impl PostReaction {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Support => "support",
            Self::Like => "like",
            Self::Star => "star",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "support" => Self::Support,
            "like" => Self::Like,
            "star" => Self::Star,
            _ => return None,
        })
    }
    /// Support cannot be withdrawn; like/star toggle.
    pub fn is_toggle(&self) -> bool {
        !matches!(self, Self::Support)
    }
}

/// The viewer's reaction state on a post, for efficient UI rendering.
#[derive(Debug, Clone, Copy, Default, Serialize)]
pub struct PostReactionState {
    pub supported: bool,
    pub liked: bool,
    pub starred: bool,
}

/// Result of a toggle: the new state after the call.
#[derive(Debug, Clone, Copy, Serialize)]
pub struct ToggleOutcome {
    pub active: bool,
    pub count: i32,
}
