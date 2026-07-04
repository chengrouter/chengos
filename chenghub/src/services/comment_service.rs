//! Comment service: create/list/edit/delete plus moderation hide/restore.

use std::sync::Arc;

use crate::config::ContentLimitsConfig;
use crate::domain::comment::{Comment, CommentId};
use crate::domain::moderation::{AuditActorType, NewAuditEvent};
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::post::{PostId, ViewerContext};
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::{CommentRecord, CommentRepo, PostRepo};
use crate::services::identity_service::AuthContext;
use crate::services::post_service::viewer_of;
use crate::telemetry::metrics::SharedMetrics;

pub struct CommentService {
    comments: Arc<dyn CommentRepo>,
    posts: Arc<dyn PostRepo>,
    limits: ContentLimitsConfig,
    metrics: SharedMetrics,
}

impl CommentService {
    pub fn new(
        comments: Arc<dyn CommentRepo>,
        posts: Arc<dyn PostRepo>,
        limits: ContentLimitsConfig,
        metrics: SharedMetrics,
    ) -> Self {
        Self { comments, posts, limits, metrics }
    }

    fn validate_body(&self, body_md: &str) -> Result<()> {
        if body_md.trim().is_empty() {
            return Err(HubError::validation(codes::INVALID_PARAM, "comment body is required"));
        }
        if body_md.len() > self.limits.max_comment_body_bytes {
            return Err(HubError::validation(
                codes::BODY_TOO_LARGE,
                format!("comment exceeds {} bytes", self.limits.max_comment_body_bytes),
            ));
        }
        Ok(())
    }

    pub async fn create(&self, ctx: &AuthContext, post_id: PostId, body_md: &str) -> Result<Comment> {
        ctx.ensure_can_write()?;
        self.validate_body(body_md)?;
        let viewer = viewer_of(ctx);
        let post = self.posts.get(post_id).await?.ok_or(HubError::NotFound("post"))?;
        if !post.visible_to(&viewer) {
            return Err(HubError::NotFound("post"));
        }
        if post.is_locked() && !ctx.roles.is_staff() {
            return Err(HubError::invalid_state(codes::POST_LOCKED, "post is locked"));
        }
        let comment = self.comments.create(post_id, ctx.user.id, body_md).await?;
        self.metrics.comments_created_total.inc();
        Ok(comment)
    }

    pub async fn list(
        &self,
        post_id: PostId,
        viewer: &ViewerContext,
        page: PageRequest,
    ) -> Result<Page<CommentRecord>> {
        let post = self.posts.get(post_id).await?.ok_or(HubError::NotFound("post"))?;
        if !post.visible_to(viewer) {
            return Err(HubError::NotFound("post"));
        }
        self.comments.list_for_post(post_id, viewer, page).await
    }

    pub async fn update(&self, ctx: &AuthContext, id: CommentId, body_md: &str) -> Result<Comment> {
        ctx.ensure_can_write()?;
        self.validate_body(body_md)?;
        let comment = self.comments.get(id).await?.ok_or(HubError::NotFound("comment"))?;
        if comment.is_deleted() {
            return Err(HubError::NotFound("comment"));
        }
        if comment.author_id != ctx.user.id && !ctx.roles.is_admin() {
            return Err(HubError::forbidden("only the author can edit this comment"));
        }
        self.comments.update_body(id, body_md).await
    }

    pub async fn delete(&self, ctx: &AuthContext, id: CommentId) -> Result<()> {
        ctx.ensure_can_write()?;
        let comment = self.comments.get(id).await?.ok_or(HubError::NotFound("comment"))?;
        let allowed =
            comment.author_id == ctx.user.id || ctx.roles.is_admin() || ctx.roles.is_moderator();
        if !allowed {
            return Err(HubError::forbidden(
                "only the author or a moderator can delete this comment",
            ));
        }
        if !self.comments.soft_delete(id).await? {
            return Err(HubError::NotFound("comment"));
        }
        Ok(())
    }

    /// Moderator hide/restore with audit.
    pub async fn set_hidden(
        &self,
        ctx: &AuthContext,
        id: CommentId,
        hidden: bool,
        reason: &str,
    ) -> Result<()> {
        if !ctx.roles.is_moderator() {
            return Err(HubError::forbidden("moderator role required"));
        }
        let changed = self
            .comments
            .set_hidden(
                id,
                hidden,
                ctx.user.id,
                reason,
                NewAuditEvent {
                    actor_type: AuditActorType::Moderator,
                    actor: ctx.user.username.clone(),
                    action: if hidden { "comment.hide" } else { "comment.restore" }.into(),
                    subject_type: "comment".into(),
                    subject_id: id.to_string(),
                    details: serde_json::json!({ "reason": reason }),
                    request_id: None,
                },
            )
            .await?;
        if !changed {
            return Err(HubError::NotFound("comment"));
        }
        self.metrics
            .moderation_actions_total
            .with_label_values(&[if hidden { "comment.hide" } else { "comment.restore" }])
            .inc();
        Ok(())
    }
}
