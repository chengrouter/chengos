//! Requirement lifecycle: operator status transitions, history, and
//! duplicate merge coordination.

use std::sync::Arc;

use crate::domain::moderation::{AuditActorType, NewAuditEvent};
use crate::domain::post::{Post, PostId, PostType, RequirementStatus};
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::{MergeOutcome, PostRepo};
use crate::services::identity_service::AuthContext;
use crate::telemetry::metrics::SharedMetrics;

pub struct RequirementService {
    posts: Arc<dyn PostRepo>,
    metrics: SharedMetrics,
}

impl RequirementService {
    pub fn new(posts: Arc<dyn PostRepo>, metrics: SharedMetrics) -> Self {
        Self { posts, metrics }
    }

    fn ensure_operator(ctx: &AuthContext) -> Result<()> {
        if !ctx.roles.is_operator() {
            return Err(HubError::forbidden("operator role required"));
        }
        Ok(())
    }

    /// Change a requirement's status. `duplicate` must go through
    /// [`Self::merge`] so support copying happens transactionally.
    pub async fn set_status(
        &self,
        ctx: &AuthContext,
        post_id: PostId,
        to: RequirementStatus,
        note: Option<&str>,
    ) -> Result<Post> {
        Self::ensure_operator(ctx)?;
        ctx.ensure_can_write()?;
        if to == RequirementStatus::Duplicate {
            return Err(HubError::validation(
                codes::DUPLICATE_TARGET_REQUIRED,
                "use the merge endpoint to mark duplicates",
            ));
        }

        let post = self.posts.get(post_id).await?.ok_or(HubError::NotFound("post"))?;
        if post.post_type != PostType::Requirement {
            return Err(HubError::invalid_state(
                codes::NOT_REQUIREMENT,
                "status applies to requirement posts only",
            ));
        }
        let from = post.status.ok_or_else(|| {
            HubError::Internal(anyhow::anyhow!("requirement post without status"))
        })?;
        if !from.can_transition_to(to) {
            return Err(HubError::invalid_state(
                codes::INVALID_STATUS_TRANSITION,
                format!("cannot move from {} to {}", from.as_str(), to.as_str()),
            ));
        }

        let updated = self
            .posts
            .set_status(
                post_id,
                from,
                to,
                None,
                ctx.user.id,
                note,
                NewAuditEvent {
                    actor_type: AuditActorType::Operator,
                    actor: ctx.user.username.clone(),
                    action: "requirement.status".into(),
                    subject_type: "post".into(),
                    subject_id: post_id.to_string(),
                    details: serde_json::json!({
                        "from": from.as_str(),
                        "to": to.as_str(),
                        "note": note,
                    }),
                    request_id: None,
                },
            )
            .await?;
        self.metrics
            .moderation_actions_total
            .with_label_values(&["requirement.status"])
            .inc();
        Ok(updated)
    }

    /// Merge `source` into `target` as a duplicate.
    pub async fn merge(
        &self,
        ctx: &AuthContext,
        source_id: PostId,
        target_id: PostId,
        note: Option<&str>,
    ) -> Result<MergeOutcome> {
        Self::ensure_operator(ctx)?;
        ctx.ensure_can_write()?;
        if source_id == target_id {
            return Err(HubError::validation(
                codes::MERGE_TARGET_INVALID,
                "a post cannot duplicate itself",
            ));
        }

        // Pre-validate outside the lock for good error messages; the repo
        // re-checks the invariants inside the transaction.
        let source = self.posts.get(source_id).await?.ok_or(HubError::NotFound("post"))?;
        if source.post_type != PostType::Requirement {
            return Err(HubError::invalid_state(
                codes::NOT_REQUIREMENT,
                "only requirements can be merged as duplicates",
            ));
        }
        if source.status == Some(RequirementStatus::Duplicate) {
            return Err(HubError::invalid_state(
                codes::INVALID_STATUS_TRANSITION,
                "post is already marked duplicate",
            ));
        }
        let target = self.posts.get(target_id).await?.ok_or(HubError::NotFound("post"))?;
        if target.is_deleted() || target.status == Some(RequirementStatus::Duplicate) {
            return Err(HubError::invalid_state(
                codes::MERGE_TARGET_INVALID,
                "merge target must be a live, non-duplicate post",
            ));
        }

        let outcome = self
            .posts
            .merge_duplicate(
                source_id,
                target_id,
                ctx.user.id,
                note,
                NewAuditEvent {
                    actor_type: AuditActorType::Operator,
                    actor: ctx.user.username.clone(),
                    action: "requirement.merge_duplicate".into(),
                    subject_type: "post".into(),
                    subject_id: source_id.to_string(),
                    details: serde_json::json!({
                        "target_post_id": target_id,
                        "note": note,
                    }),
                    request_id: None,
                },
            )
            .await?;
        self.metrics
            .moderation_actions_total
            .with_label_values(&["requirement.merge"])
            .inc();
        Ok(outcome)
    }
}
