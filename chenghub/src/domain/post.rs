//! Post domain: types, requirement status machine, filters, and sorting.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::identity::UserId;

pub type PostId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PostType {
    Requirement,
    Experience,
    Workflow,
    Discussion,
}

impl PostType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Requirement => "requirement",
            Self::Experience => "experience",
            Self::Workflow => "workflow",
            Self::Discussion => "discussion",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "requirement" => Self::Requirement,
            "experience" => Self::Experience,
            "workflow" => Self::Workflow,
            "discussion" => Self::Discussion,
            _ => return None,
        })
    }
}

/// Requirement lifecycle. Meaningful only for `PostType::Requirement`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RequirementStatus {
    New,
    Triaged,
    Planned,
    InProgress,
    Done,
    Rejected,
    Duplicate,
}

impl RequirementStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::New => "new",
            Self::Triaged => "triaged",
            Self::Planned => "planned",
            Self::InProgress => "in_progress",
            Self::Done => "done",
            Self::Rejected => "rejected",
            Self::Duplicate => "duplicate",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "new" => Self::New,
            "triaged" => Self::Triaged,
            "planned" => Self::Planned,
            "in_progress" => Self::InProgress,
            "done" => Self::Done,
            "rejected" => Self::Rejected,
            "duplicate" => Self::Duplicate,
            _ => return None,
        })
    }

    /// Open statuses appear in the triage/pending queues.
    pub fn is_open(&self) -> bool {
        matches!(self, Self::New | Self::Triaged | Self::Planned | Self::InProgress)
    }

    /// Allowed operator transitions. Terminal states may be reopened to
    /// `triaged` (mistakes happen); everything else moves forward freely
    /// between open states or into a terminal state.
    pub fn can_transition_to(&self, next: RequirementStatus) -> bool {
        if *self == next {
            return false;
        }
        match self {
            s if s.is_open() => true,
            // Terminal states: allow explicit reopen to triaged only,
            // except duplicate which may also be re-marked done/rejected
            // after its target resolves.
            Self::Done | Self::Rejected => next == Self::Triaged,
            Self::Duplicate => matches!(next, Self::Triaged | Self::Done | Self::Rejected),
            _ => false,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PostSort {
    Hot,
    Newest,
    Active,
    Pending,
    Resolved,
}

impl PostSort {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Hot => "hot",
            Self::Newest => "newest",
            Self::Active => "active",
            Self::Pending => "pending",
            Self::Resolved => "resolved",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "hot" => Self::Hot,
            "newest" => Self::Newest,
            "active" => Self::Active,
            "pending" => Self::Pending,
            "resolved" => Self::Resolved,
            _ => return None,
        })
    }
}

/// List filter assembled by the API layer.
#[derive(Debug, Clone, Default)]
pub struct PostFilter {
    pub post_type: Option<PostType>,
    pub status: Option<RequirementStatus>,
    pub tag: Option<String>,
    pub author: Option<UserId>,
    /// Include hidden posts (staff view) or the viewer's own hidden posts.
    pub viewer: ViewerContext,
}

/// Who is looking, for visibility rules.
#[derive(Debug, Clone, Default)]
pub struct ViewerContext {
    pub user_id: Option<UserId>,
    pub is_staff: bool,
}

#[derive(Debug, Clone)]
pub struct Post {
    pub id: PostId,
    pub author_id: UserId,
    pub post_type: PostType,
    pub title: String,
    pub body_md: String,
    pub tags: Vec<String>,
    pub status: Option<RequirementStatus>,
    pub duplicate_of_post_id: Option<PostId>,
    pub workflow_share_id: Option<Uuid>,
    pub support_count: i32,
    pub like_count: i32,
    pub star_count: i32,
    pub comments_count: i32,
    pub hidden_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub locked_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_activity_at: DateTime<Utc>,
}

impl Post {
    pub fn is_hidden(&self) -> bool {
        self.hidden_at.is_some()
    }
    pub fn is_deleted(&self) -> bool {
        self.deleted_at.is_some()
    }
    pub fn is_locked(&self) -> bool {
        self.locked_at.is_some()
    }

    /// Visibility rule: deleted posts are gone for everyone but staff;
    /// hidden posts are visible to staff and (marked) to the author.
    pub fn visible_to(&self, viewer: &ViewerContext) -> bool {
        if self.is_deleted() {
            return viewer.is_staff;
        }
        if self.is_hidden() {
            return viewer.is_staff || viewer.user_id == Some(self.author_id);
        }
        true
    }
}

/// One row of requirement status history.
#[derive(Debug, Clone, Serialize)]
pub struct PostStatusTransition {
    pub id: Uuid,
    pub post_id: PostId,
    pub from_status: Option<RequirementStatus>,
    pub to_status: RequirementStatus,
    pub changed_by: Option<UserId>,
    pub note: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[cfg(test)]
mod tests {
    use super::RequirementStatus as S;

    #[test]
    fn transitions() {
        assert!(S::New.can_transition_to(S::Triaged));
        assert!(S::New.can_transition_to(S::Rejected));
        assert!(S::InProgress.can_transition_to(S::Done));
        assert!(!S::Done.can_transition_to(S::Planned));
        assert!(S::Done.can_transition_to(S::Triaged));
        assert!(S::Duplicate.can_transition_to(S::Triaged));
        assert!(!S::New.can_transition_to(S::New));
    }
}
