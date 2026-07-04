//! Repository traits for the community module: posts, comments, reactions,
//! search, reports, moderation, workflow shares, and admin dashboard reads.

use std::collections::{HashMap, HashSet};

use async_trait::async_trait;
use serde::Serialize;
use uuid::Uuid;

use crate::domain::comment::{Comment, CommentId};
use crate::domain::identity::UserId;
use crate::domain::moderation::{
    NewAuditEvent, Report, ReportId, ReportReason, ReportStatus, ReportSubjectType, UserBan,
};
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::post::{
    Post, PostFilter, PostId, PostSort, PostStatusTransition, RequirementStatus, ViewerContext,
};
use crate::domain::reaction::{PostReaction, PostReactionState, ToggleOutcome};
use crate::domain::workflow_share::{
    NewWorkflowShare, RequiredVariable, SafetyFinding, WorkflowShare, WorkflowShareId,
};
use crate::error::Result;

/// Author fields joined into list/detail reads for rendering.
#[derive(Debug, Clone, Serialize)]
pub struct AuthorRef {
    pub id: UserId,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Clone)]
pub struct PostRecord {
    pub post: Post,
    pub author: AuthorRef,
}

#[derive(Debug, Clone)]
pub struct CommentRecord {
    pub comment: Comment,
    pub author: AuthorRef,
}

#[derive(Debug, Clone)]
pub struct NewPost {
    pub author_id: UserId,
    pub post_type: crate::domain::post::PostType,
    pub title: String,
    pub body_md: String,
    pub tags: Vec<String>,
    pub workflow_share_id: Option<WorkflowShareId>,
}

#[derive(Debug, Clone)]
pub struct PostUpdate {
    pub title: String,
    pub body_md: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SimilarPost {
    pub id: PostId,
    pub title: String,
    pub post_type: String,
    pub status: Option<String>,
    pub support_count: i32,
    pub similarity: f32,
}

#[derive(Debug, Clone, Serialize)]
pub struct MergeOutcome {
    pub source_id: PostId,
    pub target_id: PostId,
    /// Supports copied to the target (users who had not already supported it).
    pub supports_copied: i64,
    pub target_support_count: i32,
}

#[async_trait]
pub trait PostRepo: Send + Sync {
    /// Insert the post (requirements start at status `new` with a status
    /// event) and its tags in one transaction.
    async fn create(&self, post: NewPost) -> Result<Post>;
    async fn get(&self, id: PostId) -> Result<Option<Post>>;
    async fn get_record(&self, id: PostId) -> Result<Option<PostRecord>>;
    async fn update_content(&self, id: PostId, update: PostUpdate) -> Result<Post>;
    async fn soft_delete(&self, id: PostId) -> Result<bool>;
    async fn list(
        &self,
        filter: &PostFilter,
        sort: PostSort,
        page: PageRequest,
    ) -> Result<Page<PostRecord>>;
    /// Transactional status change: update, append history, write audit.
    async fn set_status(
        &self,
        id: PostId,
        from: RequirementStatus,
        to: RequirementStatus,
        duplicate_of: Option<PostId>,
        changed_by: UserId,
        note: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<Post>;
    /// Transactional duplicate merge per the product rules: mark source
    /// duplicate, copy supports without double counting, recount target,
    /// append history on both, write audit.
    async fn merge_duplicate(
        &self,
        source_id: PostId,
        target_id: PostId,
        actor: UserId,
        note: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<MergeOutcome>;
    async fn status_history(&self, post_id: PostId) -> Result<Vec<PostStatusTransition>>;
    async fn set_hidden(
        &self,
        id: PostId,
        hidden: bool,
        actor: UserId,
        reason: &str,
        audit: NewAuditEvent,
    ) -> Result<bool>;
    async fn touch_activity(&self, id: PostId) -> Result<()>;
}

#[async_trait]
pub trait CommentRepo: Send + Sync {
    async fn create(&self, post_id: PostId, author_id: UserId, body_md: &str) -> Result<Comment>;
    async fn get(&self, id: CommentId) -> Result<Option<Comment>>;
    /// Creation-time ascending with cursor pagination; visibility filtering
    /// per the viewer happens in SQL.
    async fn list_for_post(
        &self,
        post_id: PostId,
        viewer: &ViewerContext,
        page: PageRequest,
    ) -> Result<Page<CommentRecord>>;
    async fn update_body(&self, id: CommentId, body_md: &str) -> Result<Comment>;
    async fn soft_delete(&self, id: CommentId) -> Result<bool>;
    async fn set_hidden(
        &self,
        id: CommentId,
        hidden: bool,
        actor: UserId,
        reason: &str,
        audit: NewAuditEvent,
    ) -> Result<bool>;
}

#[async_trait]
pub trait ReactionRepo: Send + Sync {
    /// Insert a support row. `false` when the user already supported the
    /// post (idempotent, not an error). Never removable through this port.
    async fn add_support(&self, user_id: UserId, post_id: PostId) -> Result<bool>;
    /// Toggle like/star; returns the new state and count.
    async fn toggle_post_reaction(
        &self,
        user_id: UserId,
        post_id: PostId,
        reaction: PostReaction,
    ) -> Result<ToggleOutcome>;
    async fn toggle_comment_like(&self, user_id: UserId, comment_id: CommentId) -> Result<ToggleOutcome>;
    async fn post_state(&self, user_id: UserId, post_id: PostId) -> Result<PostReactionState>;
    async fn post_states(
        &self,
        user_id: UserId,
        post_ids: &[PostId],
    ) -> Result<HashMap<PostId, PostReactionState>>;
    async fn liked_comments(
        &self,
        user_id: UserId,
        comment_ids: &[CommentId],
    ) -> Result<HashSet<CommentId>>;
    /// All post ids the user reacted to, grouped by reaction type
    /// (`/me/reactions` for client-side state priming).
    async fn user_reactions(&self, user_id: UserId) -> Result<HashMap<String, Vec<PostId>>>;
}

#[async_trait]
pub trait SearchRepo: Send + Sync {
    /// Full-text (simple config) OR trigram/ILIKE fallback — the SQL handles
    /// both English and CJK queries. Only publicly visible posts.
    async fn search(&self, query: &str, page: PageRequest) -> Result<Page<PostRecord>>;
    /// Trigram similar-title lookup for anti-duplication hints.
    async fn similar_titles(&self, title: &str, limit: u32) -> Result<Vec<SimilarPost>>;
}

#[async_trait]
pub trait ReportRepo: Send + Sync {
    async fn create(
        &self,
        reporter_id: UserId,
        subject_type: ReportSubjectType,
        subject_id: Uuid,
        reason: ReportReason,
        detail: &str,
    ) -> Result<Report>;
    async fn list(&self, status: Option<ReportStatus>, page: PageRequest) -> Result<Page<Report>>;
    async fn list_for_reporter(&self, reporter_id: UserId) -> Result<Vec<Report>>;
    async fn resolve(
        &self,
        id: ReportId,
        resolver: UserId,
        status: ReportStatus,
        note: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<Report>;
}

#[async_trait]
pub trait BanRepo: Send + Sync {
    /// Ban transactionally: insert ban row, stamp `chenghub_users.banned_at`,
    /// write audit.
    async fn ban(
        &self,
        user_id: UserId,
        actor: UserId,
        reason: &str,
        expires_at: Option<chrono::DateTime<chrono::Utc>>,
        audit: NewAuditEvent,
    ) -> Result<UserBan>;
    async fn unban(&self, user_id: UserId, actor: UserId, audit: NewAuditEvent) -> Result<bool>;
    async fn list_active(&self) -> Result<Vec<UserBan>>;
}

#[async_trait]
pub trait AuditRepo: Send + Sync {
    async fn write(&self, event: NewAuditEvent) -> Result<()>;
    /// Newest first; `before_id` pages backwards through the stream.
    async fn list(
        &self,
        before_id: Option<i64>,
        limit: u32,
    ) -> Result<Vec<crate::domain::moderation::AuditEvent>>;
}

#[async_trait]
pub trait WorkflowShareRepo: Send + Sync {
    async fn create(&self, owner_id: UserId, share: &NewWorkflowShare) -> Result<WorkflowShare>;
    async fn get(&self, id: WorkflowShareId) -> Result<Option<WorkflowShare>>;
    async fn variables(&self, id: WorkflowShareId) -> Result<Vec<RequiredVariable>>;
    async fn findings(&self, id: WorkflowShareId) -> Result<Vec<SafetyFinding>>;
    async fn set_hidden(&self, id: WorkflowShareId, hidden: bool) -> Result<bool>;
}

/// Aggregate numbers for the admin dashboard, computed in SQL.
#[derive(Debug, Clone, Serialize)]
pub struct DashboardStats {
    pub posts_by_type: HashMap<String, i64>,
    pub requirements_by_status: HashMap<String, i64>,
    pub open_reports: i64,
    pub hidden_posts: i64,
    pub hidden_comments: i64,
    pub banned_users: i64,
    pub users_total: i64,
}

#[async_trait]
pub trait AdminDashboardRepo: Send + Sync {
    async fn stats(&self) -> Result<DashboardStats>;
    /// Top supported open requirements.
    async fn top_open_requirements(&self, limit: u32) -> Result<Vec<PostRecord>>;
    /// Most recently active requirements.
    async fn recently_active_requirements(&self, limit: u32) -> Result<Vec<PostRecord>>;
    /// Hidden content queue (posts + comments), newest first.
    async fn hidden_posts(&self, limit: u32) -> Result<Vec<PostRecord>>;
    async fn hidden_comments(&self, limit: u32) -> Result<Vec<CommentRecord>>;
}
