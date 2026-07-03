//! Moderation and administration: review queue, release state moderation,
//! skill visibility, publisher bans, abuse reports.
//!
//! Ordinary moderation never physically deletes published artifacts — it
//! changes visibility state and records an append-only [`ModerationAction`]
//! plus an audit event. The actor is the deployment admin (authenticated by
//! the admin token at the API layer); `actor` here is a display label only.

use std::sync::Arc;

use chrono::Utc;
use uuid::Uuid;

use crate::domain::moderation::{
    AbuseReport, AuditActorType, AuditEvent, ModerationAction, ModerationActionKind, ReportStatus,
    REPORT_REASONS,
};
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::release::{Release, ReleaseStatus};
use crate::domain::skill::SkillVisibility;
use crate::error::{RegistryError, Result};
use crate::ports::job_queue::{JobOutbox, JobType, NewJob, RescanReleasePayload};
use crate::ports::repositories::{
    ModerationRepo, NewAuditEvent, PublisherRepo, ReleaseRepo, SkillRepo,
};
use crate::services::catalog_service::CatalogService;

pub struct ModerationService {
    releases: Arc<dyn ReleaseRepo>,
    skills: Arc<dyn SkillRepo>,
    publishers: Arc<dyn PublisherRepo>,
    moderation: Arc<dyn ModerationRepo>,
    audits: Arc<dyn crate::ports::repositories::AuditRepo>,
    jobs: Arc<dyn JobOutbox>,
    catalog: Arc<CatalogService>,
}

impl ModerationService {
    pub fn new(
        releases: Arc<dyn ReleaseRepo>,
        skills: Arc<dyn SkillRepo>,
        publishers: Arc<dyn PublisherRepo>,
        moderation: Arc<dyn ModerationRepo>,
        audits: Arc<dyn crate::ports::repositories::AuditRepo>,
        jobs: Arc<dyn JobOutbox>,
        catalog: Arc<CatalogService>,
    ) -> Self {
        Self { releases, skills, publishers, moderation, audits, jobs, catalog }
    }

    // -----------------------------------------------------------------------
    // Review queue + release moderation
    // -----------------------------------------------------------------------

    pub async fn review_queue(&self, statuses: &[ReleaseStatus], page: PageRequest) -> Result<Page<Release>> {
        self.releases.list_by_status(statuses, page).await
    }

    pub async fn approve_release(&self, actor: &str, release_id: Uuid, reason: &str) -> Result<Release> {
        let release = self
            .transition(actor, release_id, &[ReleaseStatus::NeedsReview], ReleaseStatus::Approved, reason)
            .await?;
        self.record(actor, ModerationActionKind::ApproveRelease, &release, reason).await?;
        Ok(release)
    }

    pub async fn reject_release(&self, actor: &str, release_id: Uuid, reason: &str) -> Result<Release> {
        require_reason(reason)?;
        let release = self
            .transition(actor, release_id, &[ReleaseStatus::NeedsReview], ReleaseStatus::Rejected, reason)
            .await?;
        self.record(actor, ModerationActionKind::RejectRelease, &release, reason).await?;
        Ok(release)
    }

    /// Emergency stop: block downloads entirely, from any post-upload state.
    pub async fn quarantine_release(&self, actor: &str, release_id: Uuid, reason: &str) -> Result<Release> {
        require_reason(reason)?;
        let release = self
            .transition(
                actor,
                release_id,
                &[
                    ReleaseStatus::Scanning,
                    ReleaseStatus::NeedsReview,
                    ReleaseStatus::Approved,
                    ReleaseStatus::Published,
                    ReleaseStatus::Yanked,
                ],
                ReleaseStatus::Quarantined,
                reason,
            )
            .await?;
        self.record(actor, ModerationActionKind::QuarantineRelease, &release, reason).await?;
        self.invalidate(&release).await;
        Ok(release)
    }

    /// Restore a quarantined release to `published` or back into review.
    pub async fn restore_release(
        &self,
        actor: &str,
        release_id: Uuid,
        to_published: bool,
        reason: &str,
    ) -> Result<Release> {
        require_reason(reason)?;
        let to = if to_published { ReleaseStatus::Published } else { ReleaseStatus::NeedsReview };
        let release = self
            .transition(
                actor,
                release_id,
                &[ReleaseStatus::Quarantined, ReleaseStatus::Rejected],
                to,
                reason,
            )
            .await?;
        self.record(actor, ModerationActionKind::RestoreRelease, &release, reason).await?;
        self.invalidate(&release).await;
        Ok(release)
    }

    /// Queue a rescan of a release under the current policy.
    pub async fn request_rescan(&self, actor: &str, release_id: Uuid, reason: &str) -> Result<Uuid> {
        let release = self
            .releases
            .get(release_id)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;
        let job_id = self
            .jobs
            .enqueue(
                NewJob::now(
                    JobType::RescanRelease,
                    serde_json::to_value(RescanReleasePayload {
                        release_id: release.id,
                        reason: reason.to_string(),
                    })
                    .expect("payload serializes"),
                )
                .with_idempotency(format!("rescan:{}:{}", release.id, Utc::now().date_naive())),
            )
            .await?;
        self.audits
            .append(self.audit(actor, "release.rescan_requested", "release", release.id.to_string()))
            .await?;
        Ok(job_id)
    }

    // -----------------------------------------------------------------------
    // Skill visibility + publisher bans
    // -----------------------------------------------------------------------

    pub async fn set_skill_hidden(&self, actor: &str, skill_id: Uuid, hidden: bool, reason: &str) -> Result<()> {
        require_reason(reason)?;
        let skill = self.skills.get(skill_id).await?.ok_or(RegistryError::NotFound("skill"))?;
        let visibility = if hidden { SkillVisibility::Hidden } else { SkillVisibility::Public };
        let kind = if hidden { ModerationActionKind::HideSkill } else { ModerationActionKind::UnhideSkill };
        let changed = self
            .skills
            .set_visibility(
                skill.id,
                visibility,
                self.audit(actor, "skill.set_visibility", "skill", skill.id.to_string()),
            )
            .await?;
        if !changed {
            return Err(RegistryError::NotFound("skill"));
        }
        self.moderation
            .record_action(
                &ModerationAction {
                    id: Uuid::new_v4(),
                    kind,
                    actor: actor.to_string(),
                    skill_id: Some(skill.id),
                    release_id: None,
                    publisher_id: Some(skill.publisher_id),
                    report_id: None,
                    reason: reason.to_string(),
                    created_at: Utc::now(),
                },
                self.audit(actor, "moderation.action", "skill", skill.id.to_string()),
            )
            .await?;
        self.catalog.invalidate_after_change("", &skill.slug).await;
        Ok(())
    }

    pub async fn set_publisher_banned(
        &self,
        actor: &str,
        publisher_id: Uuid,
        banned: bool,
        reason: &str,
    ) -> Result<()> {
        require_reason(reason)?;
        let changed = self
            .publishers
            .set_banned(
                publisher_id,
                banned,
                self.audit(actor, "publisher.set_banned", "publisher", publisher_id.to_string()),
            )
            .await?;
        if !changed {
            return Err(RegistryError::NotFound("publisher"));
        }
        let kind = if banned { ModerationActionKind::BanPublisher } else { ModerationActionKind::UnbanPublisher };
        self.moderation
            .record_action(
                &ModerationAction {
                    id: Uuid::new_v4(),
                    kind,
                    actor: actor.to_string(),
                    skill_id: None,
                    release_id: None,
                    publisher_id: Some(publisher_id),
                    report_id: None,
                    reason: reason.to_string(),
                    created_at: Utc::now(),
                },
                self.audit(actor, "moderation.action", "publisher", publisher_id.to_string()),
            )
            .await?;
        self.catalog.invalidate_after_change("", "").await;
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Abuse reports
    // -----------------------------------------------------------------------

    /// Public, unauthenticated report intake (rate-limited at the API layer).
    pub async fn file_report(
        &self,
        publisher: &str,
        slug: &str,
        version: Option<&str>,
        reason: &str,
        details: &str,
        contact: Option<String>,
    ) -> Result<Uuid> {
        if !REPORT_REASONS.contains(&reason) {
            return Err(RegistryError::validation(
                "INVALID_REPORT_REASON",
                format!("reason must be one of {REPORT_REASONS:?}"),
            ));
        }
        let details = details.trim();
        if details.is_empty() || details.chars().count() > 5000 {
            return Err(RegistryError::validation(
                "INVALID_REPORT",
                "details must be 1..=5000 characters",
            ));
        }
        let resolved = self.catalog.resolve_public(publisher, slug).await?;
        let release_id = match version {
            Some(version) => Some(
                self.releases
                    .get_by_version(resolved.skill.id, version)
                    .await?
                    .ok_or(RegistryError::NotFound("release"))?
                    .id,
            ),
            None => None,
        };
        let report = AbuseReport {
            id: Uuid::new_v4(),
            skill_id: resolved.skill.id,
            release_id,
            reason: reason.to_string(),
            details: details.to_string(),
            contact,
            status: ReportStatus::Open,
            created_at: Utc::now(),
            resolved_at: None,
        };
        self.moderation.create_report(&report).await
    }

    pub async fn list_reports(&self, status: Option<ReportStatus>, page: PageRequest) -> Result<Page<AbuseReport>> {
        self.moderation.list_reports(status, page).await
    }

    pub async fn close_report(
        &self,
        actor: &str,
        report_id: Uuid,
        dismiss: bool,
        reason: &str,
    ) -> Result<()> {
        let report = self
            .moderation
            .get_report(report_id)
            .await?
            .ok_or(RegistryError::NotFound("report"))?;
        if report.status != ReportStatus::Open {
            return Err(RegistryError::invalid_state("REPORT_CLOSED", "report is already closed"));
        }
        let (status, kind) = if dismiss {
            (ReportStatus::Dismissed, ModerationActionKind::DismissReport)
        } else {
            (ReportStatus::Resolved, ModerationActionKind::ResolveReport)
        };
        self.moderation
            .set_report_status(
                report_id,
                status,
                self.audit(actor, "report.close", "report", report_id.to_string()),
            )
            .await?;
        self.moderation
            .record_action(
                &ModerationAction {
                    id: Uuid::new_v4(),
                    kind,
                    actor: actor.to_string(),
                    skill_id: Some(report.skill_id),
                    release_id: report.release_id,
                    publisher_id: None,
                    report_id: Some(report_id),
                    reason: reason.to_string(),
                    created_at: Utc::now(),
                },
                self.audit(actor, "moderation.action", "report", report_id.to_string()),
            )
            .await?;
        Ok(())
    }

    pub async fn audit_trail(&self, subject_type: &str, subject_id: &str, limit: i64) -> Result<Vec<AuditEvent>> {
        self.audits.list_for_subject(subject_type, subject_id, limit.clamp(1, 500)).await
    }

    // -----------------------------------------------------------------------

    async fn transition(
        &self,
        actor: &str,
        release_id: Uuid,
        expected_from: &[ReleaseStatus],
        to: ReleaseStatus,
        reason: &str,
    ) -> Result<Release> {
        self.releases
            .transition(
                release_id,
                expected_from,
                to,
                Some(reason),
                self.audit(actor, "release.moderate", "release", release_id.to_string()),
            )
            .await
    }

    async fn record(
        &self,
        actor: &str,
        kind: ModerationActionKind,
        release: &Release,
        reason: &str,
    ) -> Result<()> {
        self.moderation
            .record_action(
                &ModerationAction {
                    id: Uuid::new_v4(),
                    kind,
                    actor: actor.to_string(),
                    skill_id: Some(release.skill_id),
                    release_id: Some(release.id),
                    publisher_id: None,
                    report_id: None,
                    reason: reason.to_string(),
                    created_at: Utc::now(),
                },
                self.audit(actor, "moderation.action", "release", release.id.to_string()),
            )
            .await
    }

    async fn invalidate(&self, _release: &Release) {
        // Release visibility changed; drop all public caches.
        self.catalog.invalidate_after_change("", "").await;
    }

    fn audit(
        &self,
        actor: &str,
        action: &str,
        subject_type: &str,
        subject_id: impl Into<String>,
    ) -> NewAuditEvent {
        NewAuditEvent {
            actor_type: AuditActorType::Admin,
            actor: actor.to_string(),
            action: action.to_string(),
            subject_type: subject_type.to_string(),
            subject_id: subject_id.into(),
            details: serde_json::json!({}),
            request_id: None,
        }
    }
}

fn require_reason(reason: &str) -> Result<()> {
    let reason = reason.trim();
    if reason.is_empty() || reason.chars().count() > 500 {
        return Err(RegistryError::validation(
            "INVALID_REASON",
            "a reason of 1..=500 characters is required",
        ));
    }
    Ok(())
}
