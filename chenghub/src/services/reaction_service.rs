//! Reaction service. Support is one-way; like/star (and comment like)
//! toggle. Reads return the viewer's state for efficient UI rendering.

use std::collections::HashMap;
use std::sync::Arc;

use crate::domain::comment::CommentId;
use crate::domain::post::{PostId, ViewerContext};
use crate::domain::reaction::{PostReaction, PostReactionState, ToggleOutcome};
use crate::error::{HubError, Result};
use crate::ports::community_repository::{CommentRepo, PostRepo, ReactionRepo};
use crate::services::identity_service::AuthContext;
use crate::services::post_service::viewer_of;
use crate::telemetry::metrics::SharedMetrics;

pub struct ReactionService {
    reactions: Arc<dyn ReactionRepo>,
    posts: Arc<dyn PostRepo>,
    comments: Arc<dyn CommentRepo>,
    metrics: SharedMetrics,
}

impl ReactionService {
    pub fn new(
        reactions: Arc<dyn ReactionRepo>,
        posts: Arc<dyn PostRepo>,
        comments: Arc<dyn CommentRepo>,
        metrics: SharedMetrics,
    ) -> Self {
        Self { reactions, posts, comments, metrics }
    }

    async fn ensure_post_visible(&self, ctx: &AuthContext, post_id: PostId) -> Result<()> {
        let viewer = viewer_of(ctx);
        let post = self.posts.get(post_id).await?.ok_or(HubError::NotFound("post"))?;
        if !post.visible_to(&viewer) {
            return Err(HubError::NotFound("post"));
        }
        Ok(())
    }

    /// "I need this too": add support once; idempotent (repeat calls return
    /// the current state, never an error, and never remove the support).
    pub async fn support(&self, ctx: &AuthContext, post_id: PostId) -> Result<PostReactionState> {
        ctx.ensure_can_write()?;
        self.ensure_post_visible(ctx, post_id).await?;
        let added = self.reactions.add_support(ctx.user.id, post_id).await?;
        if added {
            self.metrics
                .reactions_total
                .with_label_values(&["support", "add"])
                .inc();
        }
        self.reactions.post_state(ctx.user.id, post_id).await
    }

    pub async fn toggle(
        &self,
        ctx: &AuthContext,
        post_id: PostId,
        reaction: PostReaction,
    ) -> Result<ToggleOutcome> {
        ctx.ensure_can_write()?;
        if !reaction.is_toggle() {
            // Defensive: the router never routes support here.
            return Err(HubError::invalid_state(
                crate::error::codes::SUPPORT_NOT_REMOVABLE,
                "support cannot be toggled",
            ));
        }
        self.ensure_post_visible(ctx, post_id).await?;
        let outcome = self.reactions.toggle_post_reaction(ctx.user.id, post_id, reaction).await?;
        self.metrics
            .reactions_total
            .with_label_values(&[reaction.as_str(), if outcome.active { "add" } else { "remove" }])
            .inc();
        Ok(outcome)
    }

    pub async fn toggle_comment_like(
        &self,
        ctx: &AuthContext,
        comment_id: CommentId,
    ) -> Result<ToggleOutcome> {
        ctx.ensure_can_write()?;
        let viewer = viewer_of(ctx);
        let comment = self
            .comments
            .get(comment_id)
            .await?
            .ok_or(HubError::NotFound("comment"))?;
        if !comment.visible_to(&viewer) {
            return Err(HubError::NotFound("comment"));
        }
        let outcome = self.reactions.toggle_comment_like(ctx.user.id, comment_id).await?;
        self.metrics
            .reactions_total
            .with_label_values(&["comment_like", if outcome.active { "add" } else { "remove" }])
            .inc();
        Ok(outcome)
    }

    /// Which of `comment_ids` the user has liked (list rendering).
    pub async fn liked_lookup(
        &self,
        user_id: crate::domain::identity::UserId,
        comment_ids: &[CommentId],
    ) -> Result<std::collections::HashSet<CommentId>> {
        self.reactions.liked_comments(user_id, comment_ids).await
    }

    /// `/me/reactions`: post ids grouped by reaction type.
    pub async fn my_reactions(&self, ctx: &AuthContext) -> Result<HashMap<String, Vec<PostId>>> {
        self.reactions.user_reactions(ctx.user.id).await
    }

    pub async fn state_for(
        &self,
        viewer: &ViewerContext,
        post_id: PostId,
    ) -> Result<Option<PostReactionState>> {
        match viewer.user_id {
            Some(user_id) => Ok(Some(self.reactions.post_state(user_id, post_id).await?)),
            None => Ok(None),
        }
    }
}
