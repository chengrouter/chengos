//! Release scanning: re-validate the stored artifact, run secret + content
//! scans, persist an append-only report, and advance the release state.
//!
//! Policy outcomes (from `ModerationConfig`):
//! * findings at/above `quarantine_at_severity` -> `quarantined`
//! * any findings                               -> `needs_review`
//! * clean + `auto_approve_clean_scans`         -> `approved`
//! * clean otherwise                            -> `needs_review`
//!
//! An errored scan writes an `error` report and moves the release back to
//! `uploaded` so a retry re-runs it — a release never advances on an errored
//! scan, and never skips scanning.

use std::sync::Arc;

use chrono::Utc;
use uuid::Uuid;

use crate::config::ModerationConfig;
use crate::domain::artifact::Digest;
use crate::domain::moderation::AuditActorType;
use crate::domain::release::{Release, ReleaseStatus};
use crate::domain::scan::{ScanConclusion, ScanReport, Severity};
use crate::error::{RegistryError, Result};
use crate::ports::repositories::{ArtifactRepo, NewAuditEvent, ReleaseRepo, ScanRepo, SkillRepo};
use crate::security::policy_version::{active_policy_version, scanner_version, SCANNER_NAME};
use crate::security::{content_scan, secret_scan};
use crate::services::artifact_service::ArtifactService;
use crate::telemetry::metrics::SharedMetrics;

pub struct ScanService {
    releases: Arc<dyn ReleaseRepo>,
    artifacts: Arc<dyn ArtifactRepo>,
    skills: Arc<dyn SkillRepo>,
    scans: Arc<dyn ScanRepo>,
    artifact_service: Arc<ArtifactService>,
    moderation: ModerationConfig,
    metrics: SharedMetrics,
}

/// What a completed scan did with the release.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScanOutcome {
    Approved,
    NeedsReview,
    Quarantined,
    /// Scanner error: report written, release returned to `uploaded`.
    Errored,
}

impl ScanService {
    pub fn new(
        releases: Arc<dyn ReleaseRepo>,
        artifacts: Arc<dyn ArtifactRepo>,
        skills: Arc<dyn SkillRepo>,
        scans: Arc<dyn ScanRepo>,
        artifact_service: Arc<ArtifactService>,
        moderation: ModerationConfig,
        metrics: SharedMetrics,
    ) -> Self {
        Self { releases, artifacts, skills, scans, artifact_service, moderation, metrics }
    }

    /// Scan a freshly uploaded release (`uploaded -> scanning -> outcome`).
    /// `expected_digest` comes from the job payload and is cross-checked
    /// against the bound artifact — the payload never picks the artifact.
    pub async fn scan_release(&self, release_id: Uuid, expected_digest: Option<&str>) -> Result<ScanOutcome> {
        let release = self
            .releases
            .get(release_id)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;

        // Reclaim a crashed scan (scanning -> uploaded is legal) before
        // starting; a release already past scanning is a duplicate delivery.
        let release = match release.status {
            ReleaseStatus::Uploaded => {
                self.releases
                    .transition(
                        release.id,
                        &[ReleaseStatus::Uploaded],
                        ReleaseStatus::Scanning,
                        None,
                        self.audit("release.scan_start", release.id),
                    )
                    .await?
            }
            ReleaseStatus::Scanning => release,
            _ => {
                tracing::info!(release_id = %release.id, status = release.status.as_str(),
                    "scan skipped: release already progressed (duplicate delivery)");
                return Ok(match release.status {
                    ReleaseStatus::Quarantined => ScanOutcome::Quarantined,
                    ReleaseStatus::Approved | ReleaseStatus::Published | ReleaseStatus::Yanked => {
                        ScanOutcome::Approved
                    }
                    _ => ScanOutcome::NeedsReview,
                });
            }
        };

        match self.run_scan(&release, expected_digest).await {
            Ok((report, outcome)) => {
                self.persist_and_transition(&release, report, outcome).await?;
                Ok(outcome)
            }
            Err(err) => {
                // Best effort: record the error, put the release back so a
                // retry can rescan. If even that fails, the job retry +
                // scanning-lease reclaim recover it.
                self.record_error(&release, &err).await;
                Err(err)
            }
        }
    }

    /// Re-scan an already-visible release under the current policy (policy
    /// updates, moderation request). Does not change state on clean results;
    /// findings demote per policy.
    pub async fn rescan_release(&self, release_id: Uuid) -> Result<ScanOutcome> {
        let release = self
            .releases
            .get(release_id)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;
        if !matches!(
            release.status,
            ReleaseStatus::Published | ReleaseStatus::Yanked | ReleaseStatus::Approved | ReleaseStatus::NeedsReview
        ) {
            return Err(RegistryError::invalid_state(
                "RELEASE_STATE",
                format!("cannot rescan a release in state {}", release.status.as_str()),
            ));
        }

        let (report, _) = self.run_scan(&release, None).await?;
        let max_severity = report.max_severity();
        let conclusion = report.conclusion;
        self.count_findings(&report);
        self.scans.insert_report(&report).await?;

        if conclusion == ScanConclusion::Findings {
            if let Some(max) = max_severity {
                if max >= self.quarantine_threshold() {
                    self.releases
                        .transition(
                            release.id,
                            &[release.status],
                            ReleaseStatus::Quarantined,
                            Some("rescan found findings at quarantine severity"),
                            self.audit("release.rescan_quarantine", release.id),
                        )
                        .await?;
                    return Ok(ScanOutcome::Quarantined);
                }
            }
            return Ok(ScanOutcome::NeedsReview);
        }
        Ok(ScanOutcome::Approved)
    }

    // -----------------------------------------------------------------------

    /// Load, re-validate, and scan the bound artifact. Pure with respect to
    /// release state; the caller persists the report and transitions.
    async fn run_scan(
        &self,
        release: &Release,
        expected_digest: Option<&str>,
    ) -> Result<(ScanReport, ScanOutcome)> {
        let artifact_id = release
            .artifact_id
            .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("release in scan without artifact")))?;
        let artifact = self
            .artifacts
            .get(artifact_id)
            .await?
            .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("bound artifact record missing")))?;
        if let Some(expected) = expected_digest {
            if expected != artifact.digest.as_str() {
                return Err(RegistryError::Internal(anyhow::anyhow!(
                    "scan payload digest does not match bound artifact"
                )));
            }
        }
        let skill = self
            .skills
            .get(release.skill_id)
            .await?
            .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("release without skill")))?;

        let started_at = Utc::now();
        let digest = Digest::parse(artifact.digest.as_str())
            .map_err(|e| RegistryError::Internal(anyhow::anyhow!("stored digest invalid: {e}")))?;
        let (package, _safety, entries) = self
            .artifact_service
            .load_stored_package(&artifact.storage_key, &digest, &skill.slug, &release.version)
            .await?;

        // Content scan over declared surfaces + script bodies.
        let script_bodies: Vec<(String, String)> = entries
            .iter()
            .filter(|e| e.path.starts_with("scripts/"))
            .filter_map(|e| {
                std::str::from_utf8(&e.data).ok().map(|s| (e.path.clone(), s.to_string()))
            })
            .collect();
        let mut findings = content_scan::scan_package(&package, &script_bodies).findings;

        // Secret scan over every text file in the package.
        let text_files: Vec<(String, Vec<u8>)> =
            entries.iter().map(|e| (e.path.clone(), e.data.clone())).collect();
        findings.extend(secret_scan::scan_package(&text_files));

        let conclusion = if findings.is_empty() {
            ScanConclusion::Clean
        } else {
            ScanConclusion::Findings
        };
        let report = ScanReport {
            id: Uuid::new_v4(),
            release_id: release.id,
            artifact_id,
            scanner_name: SCANNER_NAME.to_string(),
            scanner_version: scanner_version().to_string(),
            policy_version: active_policy_version(),
            conclusion,
            started_at,
            finished_at: Utc::now(),
            findings,
        };

        let outcome = match conclusion {
            ScanConclusion::Clean if self.moderation.auto_approve_clean_scans => ScanOutcome::Approved,
            ScanConclusion::Clean => ScanOutcome::NeedsReview,
            ScanConclusion::Findings => {
                let max = report.max_severity().unwrap_or(Severity::Low);
                if max >= self.quarantine_threshold() {
                    ScanOutcome::Quarantined
                } else {
                    ScanOutcome::NeedsReview
                }
            }
            ScanConclusion::Error => ScanOutcome::Errored,
        };
        Ok((report, outcome))
    }

    async fn persist_and_transition(
        &self,
        release: &Release,
        report: ScanReport,
        outcome: ScanOutcome,
    ) -> Result<()> {
        self.count_findings(&report);
        self.scans.insert_report(&report).await?;
        let (to, action) = match outcome {
            ScanOutcome::Approved => (ReleaseStatus::Approved, "release.scan_approved"),
            ScanOutcome::NeedsReview => (ReleaseStatus::NeedsReview, "release.scan_needs_review"),
            ScanOutcome::Quarantined => (ReleaseStatus::Quarantined, "release.scan_quarantined"),
            ScanOutcome::Errored => (ReleaseStatus::Uploaded, "release.scan_errored"),
        };
        self.releases
            .transition(
                release.id,
                &[ReleaseStatus::Scanning],
                to,
                Some(&format!("scan {}", report.conclusion.as_str())),
                self.audit(action, release.id),
            )
            .await?;
        Ok(())
    }

    /// Record a scanner failure: `error` report + release back to `uploaded`.
    async fn record_error(&self, release: &Release, err: &RegistryError) {
        if let Some(artifact_id) = release.artifact_id {
            let now = Utc::now();
            let report = ScanReport {
                id: Uuid::new_v4(),
                release_id: release.id,
                artifact_id,
                scanner_name: SCANNER_NAME.to_string(),
                scanner_version: scanner_version().to_string(),
                policy_version: active_policy_version(),
                conclusion: ScanConclusion::Error,
                started_at: now,
                finished_at: now,
                findings: vec![],
            };
            if let Err(persist_err) = self.scans.insert_report(&report).await {
                tracing::error!(release_id = %release.id, error = %persist_err, "failed to persist error scan report");
            }
        }
        tracing::warn!(release_id = %release.id, error = %err, "scan errored; returning release to uploaded");
        if let Err(transition_err) = self
            .releases
            .transition(
                release.id,
                &[ReleaseStatus::Scanning],
                ReleaseStatus::Uploaded,
                Some("scan errored"),
                self.audit("release.scan_errored", release.id),
            )
            .await
        {
            tracing::error!(release_id = %release.id, error = %transition_err, "failed to return release to uploaded");
        }
    }

    fn quarantine_threshold(&self) -> Severity {
        Severity::parse(&self.moderation.quarantine_at_severity).unwrap_or(Severity::Critical)
    }

    fn count_findings(&self, report: &ScanReport) {
        for finding in &report.findings {
            self.metrics
                .scan_findings_total
                .with_label_values(&[finding.kind.as_str(), finding.severity.as_str()])
                .inc();
        }
    }

    fn audit(&self, action: &str, release_id: Uuid) -> NewAuditEvent {
        NewAuditEvent {
            actor_type: AuditActorType::System,
            actor: "scanner".to_string(),
            action: action.to_string(),
            subject_type: "release".to_string(),
            subject_id: release_id.to_string(),
            details: serde_json::json!({ "policy_version": active_policy_version() }),
            request_id: None,
        }
    }
}
