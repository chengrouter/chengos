//! Post service: validation, creation, editing, visibility, and detail
//! assembly.

use std::sync::Arc;

use crate::config::ContentLimitsConfig;
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::post::{
    Post, PostFilter, PostId, PostSort, PostStatusTransition, PostType, ViewerContext,
};
use crate::domain::reaction::PostReactionState;
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::{
    NewPost, PostRecord, PostRepo, PostUpdate, ReactionRepo, WorkflowShareRepo,
};
use crate::services::identity_service::AuthContext;
use crate::telemetry::metrics::SharedMetrics;

/// Assembled detail view: everything the detail page needs in one response.
pub struct PostDetail {
    pub record: PostRecord,
    pub viewer_state: Option<PostReactionState>,
    /// Requirement-only status history; empty for other post types.
    pub status_history: Vec<PostStatusTransition>,
    /// Duplicate banner target (id + title) when this post was merged.
    pub duplicate_of: Option<(PostId, String)>,
}

pub struct PostService {
    posts: Arc<dyn PostRepo>,
    reactions: Arc<dyn ReactionRepo>,
    shares: Arc<dyn WorkflowShareRepo>,
    limits: ContentLimitsConfig,
    metrics: SharedMetrics,
}

impl PostService {
    pub fn new(
        posts: Arc<dyn PostRepo>,
        reactions: Arc<dyn ReactionRepo>,
        shares: Arc<dyn WorkflowShareRepo>,
        limits: ContentLimitsConfig,
        metrics: SharedMetrics,
    ) -> Self {
        Self { posts, reactions, shares, limits, metrics }
    }

    /// Validate and normalize title/body/tags; shared by create and update.
    fn validate_content(
        &self,
        title: &str,
        body_md: &str,
        tags: &[String],
    ) -> Result<(String, Vec<String>)> {
        let title = title.trim().to_string();
        if title.is_empty() {
            return Err(HubError::validation(codes::INVALID_PARAM, "title is required"));
        }
        if title.chars().count() > self.limits.max_title_chars {
            return Err(HubError::validation(
                codes::TITLE_TOO_LONG,
                format!("title exceeds {} characters", self.limits.max_title_chars),
            ));
        }
        if body_md.len() > self.limits.max_post_body_bytes {
            return Err(HubError::validation(
                codes::BODY_TOO_LARGE,
                format!("body exceeds {} bytes", self.limits.max_post_body_bytes),
            ));
        }
        if tags.len() > self.limits.max_tags {
            return Err(HubError::validation(
                codes::TOO_MANY_TAGS,
                format!("at most {} tags", self.limits.max_tags),
            ));
        }
        let mut normalized: Vec<String> = Vec::with_capacity(tags.len());
        for tag in tags {
            let tag = tag.trim().to_lowercase();
            if tag.is_empty() {
                continue;
            }
            if tag.chars().count() > self.limits.max_tag_chars {
                return Err(HubError::validation(
                    codes::TAG_INVALID,
                    format!("tag exceeds {} characters", self.limits.max_tag_chars),
                ));
            }
            if !normalized.contains(&tag) {
                normalized.push(tag);
            }
        }
        Ok((title, normalized))
    }

    pub async fn create(
        &self,
        ctx: &AuthContext,
        post_type: PostType,
        title: &str,
        body_md: &str,
        tags: &[String],
        workflow_share_id: Option<uuid::Uuid>,
    ) -> Result<Post> {
        ctx.ensure_can_write()?;
        let (title, tags) = self.validate_content(title, body_md, tags)?;

        // Workflow share attachments: workflow posts only, and the share
        // must exist and belong to the author.
        let workflow_share_id = match (post_type, workflow_share_id) {
            (PostType::Workflow, Some(share_id)) => {
                let share = self
                    .shares
                    .get(share_id)
                    .await?
                    .ok_or(HubError::NotFound("workflow share"))?;
                if share.owner_id != ctx.user.id {
                    return Err(HubError::forbidden("workflow share belongs to another user"));
                }
                Some(share_id)
            }
            (PostType::Workflow, None) => None,
            (_, Some(_)) => {
                return Err(HubError::validation(
                    codes::INVALID_PARAM,
                    "only workflow posts can attach a workflow share",
                ))
            }
            (_, None) => None,
        };

        let post = self
            .posts
            .create(NewPost {
                author_id: ctx.user.id,
                post_type,
                title,
                body_md: body_md.to_string(),
                tags,
                workflow_share_id,
            })
            .await?;
        self.metrics
            .posts_created_total
            .with_label_values(&[post_type.as_str()])
            .inc();
        Ok(post)
    }

    /// Load a post applying visibility; `NotFound` covers both missing and
    /// not-visible (no existence oracle for hidden content).
    pub async fn get_visible(&self, id: PostId, viewer: &ViewerContext) -> Result<Post> {
        let post = self.posts.get(id).await?.ok_or(HubError::NotFound("post"))?;
        if !post.visible_to(viewer) {
            return Err(HubError::NotFound("post"));
        }
        Ok(post)
    }

    pub async fn detail(&self, id: PostId, viewer: &ViewerContext) -> Result<PostDetail> {
        let record = self.posts.get_record(id).await?.ok_or(HubError::NotFound("post"))?;
        if !record.post.visible_to(viewer) {
            return Err(HubError::NotFound("post"));
        }
        let viewer_state = match viewer.user_id {
            Some(user_id) => Some(self.reactions.post_state(user_id, id).await?),
            None => None,
        };
        let status_history = if record.post.post_type == PostType::Requirement {
            self.posts.status_history(id).await?
        } else {
            Vec::new()
        };
        let duplicate_of = match record.post.duplicate_of_post_id {
            Some(target_id) => self
                .posts
                .get(target_id)
                .await?
                .map(|target| (target_id, target.title)),
            None => None,
        };
        Ok(PostDetail { record, viewer_state, status_history, duplicate_of })
    }

    pub async fn list(
        &self,
        filter: &PostFilter,
        sort: PostSort,
        page: PageRequest,
    ) -> Result<Page<PostRecord>> {
        self.posts.list(filter, sort, page).await
    }

    pub async fn update(
        &self,
        ctx: &AuthContext,
        id: PostId,
        title: &str,
        body_md: &str,
        tags: &[String],
    ) -> Result<Post> {
        ctx.ensure_can_write()?;
        let viewer = viewer_of(ctx);
        let post = self.get_visible(id, &viewer).await?;
        if post.author_id != ctx.user.id && !ctx.roles.is_admin() {
            return Err(HubError::forbidden("only the author can edit this post"));
        }
        if post.is_locked() && !ctx.roles.is_admin() {
            return Err(HubError::invalid_state(codes::POST_LOCKED, "post is locked"));
        }
        let (title, tags) = self.validate_content(title, body_md, tags)?;
        self.posts
            .update_content(id, PostUpdate { title, body_md: body_md.to_string(), tags })
            .await
    }

    pub async fn delete(&self, ctx: &AuthContext, id: PostId) -> Result<()> {
        ctx.ensure_can_write()?;
        let viewer = viewer_of(ctx);
        let post = self.get_visible(id, &viewer).await?;
        let allowed =
            post.author_id == ctx.user.id || ctx.roles.is_admin() || ctx.roles.is_moderator();
        if !allowed {
            return Err(HubError::forbidden("only the author or a moderator can delete this post"));
        }
        if !self.posts.soft_delete(id).await? {
            return Err(HubError::NotFound("post"));
        }
        Ok(())
    }

    /// Batch viewer reaction states for a list page.
    pub async fn viewer_states(
        &self,
        viewer: &ViewerContext,
        records: &[PostRecord],
    ) -> Result<std::collections::HashMap<PostId, PostReactionState>> {
        match viewer.user_id {
            None => Ok(Default::default()),
            Some(user_id) => {
                let ids: Vec<PostId> = records.iter().map(|r| r.post.id).collect();
                self.reactions.post_states(user_id, &ids).await
            }
        }
    }
}

/// Build a `ViewerContext` from an optional auth context.
pub fn viewer_of(ctx: &AuthContext) -> ViewerContext {
    ViewerContext { user_id: Some(ctx.user.id), is_staff: ctx.roles.is_staff() }
}

pub fn viewer_of_opt(ctx: Option<&AuthContext>) -> ViewerContext {
    match ctx {
        Some(ctx) => viewer_of(ctx),
        None => ViewerContext::default(),
    }
}
