//! Comment domain. V1 comments are single-level, ordered by creation time,
//! with soft deletion and moderation hiding.

use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::domain::identity::UserId;
use crate::domain::post::{PostId, ViewerContext};

pub type CommentId = Uuid;

#[derive(Debug, Clone)]
pub struct Comment {
    pub id: CommentId,
    pub post_id: PostId,
    pub author_id: UserId,
    pub body_md: String,
    pub like_count: i32,
    pub hidden_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Comment {
    pub fn is_hidden(&self) -> bool {
        self.hidden_at.is_some()
    }
    pub fn is_deleted(&self) -> bool {
        self.deleted_at.is_some()
    }

    /// Deleted comments render as tombstones; hidden comments are visible
    /// to staff and (marked) to the author.
    pub fn visible_to(&self, viewer: &ViewerContext) -> bool {
        if self.is_deleted() {
            return false;
        }
        if self.is_hidden() {
            return viewer.is_staff || viewer.user_id == Some(self.author_id);
        }
        true
    }
}
