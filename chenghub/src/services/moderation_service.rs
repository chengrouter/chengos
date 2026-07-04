//! Moderation: reports, hide/restore, bans, and report resolution.

use std::sync::Arc;

use uuid::Uuid;

use crate::domain::identity::UserId;
use crate::domain::moderation::{
    AuditActorType, NewAuditEvent, Report, ReportId, ReportReason, ReportStatus,
    ReportSubjectType, UserBan,
};
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::post::PostId;
use crate::error::{HubError, Result};
use crate::ports::community_repository::{BanRepo, CommentRepo, PostRepo, ReportRepo};
use crate::ports::identity_repository::UserRepo;
use crate::services::identity_service::AuthContext;
use crate::telemetry::metrics::SharedMetrics;

const MAX_REPORT_DETAIL_BYTES: usize = 2048;

pub struct ModerationService {
    reports: Arc<dyn ReportRepo>,
    bans: Arc<dyn BanRepo>,
    posts: Arc<dyn PostRepo>,
    comments: Arc<dyn CommentRepo>,
    users: Arc<dyn UserRepo>,
    metrics: SharedMetrics,
}

impl ModerationService {
    pub fn new(
        reports: Arc<dyn ReportRepo>,
        bans: Arc<dyn BanRepo>,
        posts: Arc<dyn PostRepo>,
        comments: Arc<dyn CommentRepo>,
        users: Arc<dyn UserRepo>,
        metrics: SharedMetrics,
    ) -> Self {
        Self { reports, bans, posts, comments, users, metrics }
    }

    fn ensure_moderator(ctx: &AuthContext) -> Result<()> {
        if !ctx.roles.is_moderator() {
            return Err(HubError::forbidden("moderator role required"));
        }
        Ok(())
    }

    // --- Reports -------------------------------------------------------------

    pub async fn file_report(
        &self,
        ctx: &AuthContext,
        subject_type: ReportSubjectType,
        subject_id: Uuid,
        reason: ReportReason,
        detail: &str,
    ) -> Result<Report> {
        ctx.ensure_can_write()?;
        let detail: String = detail.chars().take(MAX_REPORT_DETAIL_BYTES).collect();

        // The subject must exist (and be a real post/comment) so moderators
        // never chase dangling reports.
        match subject_type {
            ReportSubjectType::Post => {
                self.posts.get(subject_id).await?.ok_or(HubError::NotFound("post"))?;
            }
            ReportSubjectType::Comment => {
                self.comments.get(subject_id).await?.ok_or(HubError::NotFound("comment"))?;
            }
        }
        let report = self
            .reports
            .create(ctx.user.id, subject_type, subject_id, reason, &detail)
            .await?;
        self.metrics.reports_total.inc();
        Ok(report)
    }

    pub async fn my_reports(&self, ctx: &AuthContext) -> Result<Vec<Report>> {
        self.reports.list_for_reporter(ctx.user.id).await
    }

    pub async fn list_reports(
        &self,
        ctx: &AuthContext,
        status: Option<ReportStatus>,
        page: PageRequest,
    ) -> Result<Page<Report>> {
        Self::ensure_moderator(ctx)?;
        self.reports.list(status, page).await
    }

    pub async fn resolve_report(
        &self,
        ctx: &AuthContext,
        report_id: ReportId,
        dismiss: bool,
        note: Option<&str>,
    ) -> Result<Report> {
        Self::ensure_moderator(ctx)?;
        let status = if dismiss { ReportStatus::Dismissed } else { ReportStatus::Resolved };
        let report = self
            .reports
            .resolve(
                report_id,
                ctx.user.id,
                status,
                note,
                NewAuditEvent {
                    actor_type: AuditActorType::Moderator,
                    actor: ctx.user.username.clone(),
                    action: "report.resolve".into(),
                    subject_type: "report".into(),
                    subject_id: report_id.to_string(),
                    details: serde_json::json!({ "status": status.as_str(), "note": note }),
                    request_id: None,
                },
            )
            .await?;
        self.metrics
            .moderation_actions_total
            .with_label_values(&["report.resolve"])
            .inc();
        Ok(report)
    }

    // --- Hide / restore posts --------------------------------------------------

    pub async fn set_post_hidden(
        &self,
        ctx: &AuthContext,
        post_id: PostId,
        hidden: bool,
        reason: &str,
    ) -> Result<()> {
        Self::ensure_moderator(ctx)?;
        let changed = self
            .posts
            .set_hidden(
                post_id,
                hidden,
                ctx.user.id,
                reason,
                NewAuditEvent {
                    actor_type: AuditActorType::Moderator,
                    actor: ctx.user.username.clone(),
                    action: if hidden { "post.hide" } else { "post.restore" }.into(),
                    subject_type: "post".into(),
                    subject_id: post_id.to_string(),
                    details: serde_json::json!({ "reason": reason }),
                    request_id: None,
                },
            )
            .await?;
        if !changed {
            return Err(HubError::NotFound("post"));
        }
        self.metrics
            .moderation_actions_total
            .with_label_values(&[if hidden { "post.hide" } else { "post.restore" }])
            .inc();
        Ok(())
    }

    // --- Bans ------------------------------------------------------------------

    pub async fn ban_user(
        &self,
        ctx: &AuthContext,
        user_id: UserId,
        reason: &str,
        expires_at: Option<chrono::DateTime<chrono::Utc>>,
    ) -> Result<UserBan> {
        Self::ensure_moderator(ctx)?;
        if user_id == ctx.user.id {
            return Err(HubError::validation(
                crate::error::codes::INVALID_PARAM,
                "cannot ban yourself",
            ));
        }
        let target = self.users.get(user_id).await?.ok_or(HubError::NotFound("user"))?;
        // Staff cannot be banned by non-admins.
        let target_roles = self.users.roles(user_id).await?;
        if target_roles.is_staff() && !ctx.roles.is_admin() {
            return Err(HubError::forbidden("only admins can ban staff accounts"));
        }
        let ban = self
            .bans
            .ban(
                user_id,
                ctx.user.id,
                reason,
                expires_at,
                NewAuditEvent {
                    actor_type: AuditActorType::Moderator,
                    actor: ctx.user.username.clone(),
                    action: "user.ban".into(),
                    subject_type: "user".into(),
                    subject_id: user_id.to_string(),
                    details: serde_json::json!({
                        "username": target.username,
                        "reason": reason,
                        "expires_at": expires_at,
                    }),
                    request_id: None,
                },
            )
            .await?;
        self.metrics.moderation_actions_total.with_label_values(&["user.ban"]).inc();
        Ok(ban)
    }

    pub async fn unban_user(&self, ctx: &AuthContext, user_id: UserId) -> Result<()> {
        Self::ensure_moderator(ctx)?;
        let lifted = self
            .bans
            .unban(
                user_id,
                ctx.user.id,
                NewAuditEvent {
                    actor_type: AuditActorType::Moderator,
                    actor: ctx.user.username.clone(),
                    action: "user.unban".into(),
                    subject_type: "user".into(),
                    subject_id: user_id.to_string(),
                    details: serde_json::json!({}),
                    request_id: None,
                },
            )
            .await?;
        if !lifted {
            return Err(HubError::NotFound("active ban"));
        }
        self.metrics.moderation_actions_total.with_label_values(&["user.unban"]).inc();
        Ok(())
    }

    pub async fn active_bans(&self, ctx: &AuthContext) -> Result<Vec<UserBan>> {
        Self::ensure_moderator(ctx)?;
        self.bans.list_active().await
    }
}
