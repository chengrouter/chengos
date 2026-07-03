//! Publishing orchestration: skill metadata, release sessions, artifact
//! upload binding, publish/yank lifecycle.
//!
//! Every operation authenticates through [`AuthContext`] and authorizes
//! against the token's publisher — a token can never touch another
//! publisher's skills. State changes go through the repository composite
//! operations so audit rows and the scan-job outbox commit atomically with
//! the change.

use std::sync::Arc;

use chrono::Utc;

use crate::domain::artifact::Digest;
use crate::domain::moderation::AuditActorType;
use crate::domain::publisher_auth::scopes;
use crate::domain::release::{validate_version, Release, ReleaseStatus};
use crate::domain::skill::{validate_slug, Skill};
use crate::error::{RegistryError, Result};
use crate::ports::artifact_store::ByteStream;
use crate::ports::job_queue::{JobType, NewJob, ScanArtifactPayload};
use crate::ports::repositories::{
    NewArtifactRecord, NewAuditEvent, NewRelease, NewSkill, ReleaseRepo, SkillMetadataUpdate,
    SkillRepo,
};
use crate::services::artifact_service::ArtifactService;
use crate::services::catalog_service::CatalogService;
use crate::services::publisher_auth_service::AuthContext;

/// Metadata accepted from the publisher for create/update.
#[derive(Debug, Clone)]
pub struct SkillMetadataInput {
    pub name: String,
    pub summary: String,
    pub description: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    pub license: Option<String>,
}

pub struct PublishService {
    skills: Arc<dyn SkillRepo>,
    releases: Arc<dyn ReleaseRepo>,
    artifacts: Arc<ArtifactService>,
    catalog: Arc<CatalogService>,
}

impl PublishService {
    pub fn new(
        skills: Arc<dyn SkillRepo>,
        releases: Arc<dyn ReleaseRepo>,
        artifacts: Arc<ArtifactService>,
        catalog: Arc<CatalogService>,
    ) -> Self {
        Self { skills, releases, artifacts, catalog }
    }

    /// Create the skill on first publish or update its metadata. The slug is
    /// the immutable identity; everything else is editable.
    pub async fn upsert_skill(
        &self,
        auth: &AuthContext,
        slug: &str,
        input: SkillMetadataInput,
    ) -> Result<Skill> {
        auth.require_scope(scopes::PUBLISH)?;
        validate_slug(slug).map_err(|m| RegistryError::validation("PKG_INVALID_SLUG", m))?;
        validate_metadata(&input)?;

        match self.owned_skill(auth, slug).await {
            Ok(existing) => {
                let updated = self
                    .skills
                    .update_metadata(
                        existing.id,
                        SkillMetadataUpdate {
                            name: Some(input.name),
                            summary: Some(input.summary),
                            description: Some(input.description),
                            categories: Some(input.categories),
                            tags: Some(input.tags),
                            license: Some(input.license),
                        },
                        self.audit(auth, "skill.update_metadata", "skill", existing.id.to_string()),
                    )
                    .await?;
                self.invalidate(auth, slug).await;
                Ok(updated)
            }
            Err(RegistryError::NotFound(_)) => {
                let created = self
                    .skills
                    .create(
                        NewSkill {
                            publisher_id: auth.publisher.id,
                            slug: slug.to_string(),
                            name: input.name,
                            summary: input.summary,
                            description: input.description,
                            categories: input.categories,
                            tags: input.tags,
                            license: input.license,
                        },
                        self.audit(auth, "skill.create", "skill", slug),
                    )
                    .await?;
                self.invalidate(auth, slug).await;
                Ok(created)
            }
            Err(other) => Err(other),
        }
    }

    /// Open a release session (`pending_upload`). Exactly one winner per
    /// `(skill, version)`; the version is immutable from here on.
    pub async fn start_release(
        &self,
        auth: &AuthContext,
        slug: &str,
        version: &str,
        changelog: Option<String>,
    ) -> Result<Release> {
        auth.require_scope(scopes::PUBLISH)?;
        let semver = validate_version(version)
            .map_err(|m| RegistryError::validation("PKG_INVALID_SEMVER", m))?;
        let _ = semver;
        if let Some(changelog) = &changelog {
            if changelog.chars().count() > 20_000 {
                return Err(RegistryError::validation(
                    "CHANGELOG_TOO_LONG",
                    "changelog must be at most 20000 characters",
                ));
            }
        }
        let skill = self.owned_skill(auth, slug).await?;
        self.releases
            .create_pending(
                NewRelease {
                    skill_id: skill.id,
                    version: version.to_string(),
                    changelog,
                    created_by_identity: auth.identity.id,
                },
                self.audit(auth, "release.create_pending", "release", format!("{slug}@{version}")),
            )
            .await
    }

    /// Upload the artifact for a pending release: spool + digest check +
    /// Package v1 validation + CAS persist, then bind and enqueue the scan in
    /// one transaction. The uploaded slug/version must equal the release's.
    pub async fn upload_artifact(
        &self,
        auth: &AuthContext,
        slug: &str,
        version: &str,
        declared_digest: Option<&Digest>,
        body: ByteStream,
        request_id: Option<String>,
    ) -> Result<(Release, crate::domain::artifact::Artifact)> {
        auth.require_scope(scopes::PUBLISH)?;
        let skill = self.owned_skill(auth, slug).await?;
        let release = self
            .releases
            .get_by_version(skill.id, version)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;
        if release.status != ReleaseStatus::PendingUpload {
            return Err(RegistryError::invalid_state(
                "RELEASE_STATE",
                format!(
                    "release is {}; the artifact can only be uploaded once",
                    release.status.as_str()
                ),
            ));
        }

        let outcome = self
            .artifacts
            .ingest_upload(body, declared_digest, &skill.slug, version)
            .await?;

        let scan_job = NewJob::now(
            JobType::ScanArtifact,
            serde_json::to_value(ScanArtifactPayload {
                release_id: release.id,
                digest: outcome.stored.digest.as_str().to_string(),
                publisher_handle: auth.publisher.handle.clone(),
                slug: skill.slug.clone(),
                version: version.to_string(),
            })
            .expect("payload serializes"),
        )
        .with_idempotency(format!("scan:{}", release.id))
        .with_trace(request_id.clone());

        let mut audit = self.audit(auth, "release.upload_artifact", "release", release.id.to_string());
        audit.details = serde_json::json!({
            "digest": outcome.stored.digest.as_str(),
            "size_bytes": outcome.stored.size_bytes,
            "deduplicated": outcome.stored.deduplicated,
        });
        audit.request_id = request_id;

        self.releases
            .bind_artifact_and_enqueue_scan(
                release.id,
                NewArtifactRecord {
                    digest: outcome.stored.digest.clone(),
                    storage_key: outcome.stored.storage_key.clone(),
                    media_type: outcome.media_type.to_string(),
                    size_bytes: outcome.stored.size_bytes as i64,
                    expanded_bytes: outcome.package.expanded_bytes as i64,
                    file_count: outcome.package.file_count as i32,
                    files: outcome.package.files.clone(),
                    scripts: outcome.package.scripts.clone(),
                    safety: outcome.safety,
                    minimum_chengos_version: outcome.package.minimum_chengos_version.clone(),
                    maximum_chengos_version: outcome.package.maximum_chengos_version.clone(),
                },
                scan_job,
                audit,
            )
            .await
    }

    /// Make an approved release publicly visible.
    pub async fn publish(&self, auth: &AuthContext, slug: &str, version: &str) -> Result<Release> {
        auth.require_scope(scopes::PUBLISH)?;
        let release = self
            .transition_owned(
                auth,
                slug,
                version,
                &[ReleaseStatus::Approved],
                ReleaseStatus::Published,
                None,
                "release.publish",
            )
            .await?;
        self.invalidate(auth, slug).await;
        Ok(release)
    }

    /// Hide a published release from listings/latest (still pinnable).
    pub async fn yank(
        &self,
        auth: &AuthContext,
        slug: &str,
        version: &str,
        reason: String,
    ) -> Result<Release> {
        auth.require_scope(scopes::YANK)?;
        let reason = reason.trim().to_string();
        if reason.is_empty() || reason.chars().count() > 500 {
            return Err(RegistryError::validation(
                "INVALID_YANK_REASON",
                "yank reason must be 1..=500 characters",
            ));
        }
        let release = self
            .transition_owned(
                auth,
                slug,
                version,
                &[ReleaseStatus::Published],
                ReleaseStatus::Yanked,
                Some(&reason),
                "release.yank",
            )
            .await?;
        self.invalidate(auth, slug).await;
        Ok(release)
    }

    /// Restore a yanked release to published.
    pub async fn unyank(&self, auth: &AuthContext, slug: &str, version: &str) -> Result<Release> {
        auth.require_scope(scopes::YANK)?;
        let release = self
            .transition_owned(
                auth,
                slug,
                version,
                &[ReleaseStatus::Yanked],
                ReleaseStatus::Published,
                None,
                "release.unyank",
            )
            .await?;
        self.invalidate(auth, slug).await;
        Ok(release)
    }

    /// The publisher's own view of a release (any status).
    pub async fn release_status(&self, auth: &AuthContext, slug: &str, version: &str) -> Result<Release> {
        let skill = self.owned_skill(auth, slug).await?;
        self.releases
            .get_by_version(skill.id, version)
            .await?
            .ok_or(RegistryError::NotFound("release"))
    }

    /// Expired pending-upload sessions are abandoned by the cleanup job; this
    /// exposes the cutoff policy in one place.
    pub fn stale_pending_cutoff(upload_timeout_secs: u64) -> chrono::DateTime<Utc> {
        Utc::now() - chrono::Duration::seconds(upload_timeout_secs.max(60) as i64 * 4)
    }

    // -----------------------------------------------------------------------

    async fn owned_skill(&self, auth: &AuthContext, slug: &str) -> Result<Skill> {
        let resolved = self
            .skills
            .resolve(&auth.publisher.handle, slug)
            .await?
            .ok_or(RegistryError::NotFound("skill"))?;
        if resolved.skill.publisher_id != auth.publisher.id {
            // Alias resolution may cross publishers; ownership is by id.
            return Err(RegistryError::NotFound("skill"));
        }
        Ok(resolved.skill)
    }

    async fn transition_owned(
        &self,
        auth: &AuthContext,
        slug: &str,
        version: &str,
        expected_from: &[ReleaseStatus],
        to: ReleaseStatus,
        reason: Option<&str>,
        action: &str,
    ) -> Result<Release> {
        let skill = self.owned_skill(auth, slug).await?;
        let release = self
            .releases
            .get_by_version(skill.id, version)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;
        self.releases
            .transition(
                release.id,
                expected_from,
                to,
                reason,
                self.audit(auth, action, "release", release.id.to_string()),
            )
            .await
    }

    async fn invalidate(&self, auth: &AuthContext, slug: &str) {
        self.catalog
            .invalidate_after_change(&auth.publisher.handle, slug)
            .await;
    }

    fn audit(
        &self,
        auth: &AuthContext,
        action: &str,
        subject_type: &str,
        subject_id: impl Into<String>,
    ) -> NewAuditEvent {
        NewAuditEvent {
            actor_type: AuditActorType::Identity,
            actor: auth.actor(),
            action: action.to_string(),
            subject_type: subject_type.to_string(),
            subject_id: subject_id.into(),
            details: serde_json::json!({}),
            request_id: None,
        }
    }
}

fn validate_metadata(input: &SkillMetadataInput) -> Result<()> {
    fn len_check(field: &str, value: &str, max: usize) -> Result<()> {
        if value.trim().is_empty() {
            return Err(RegistryError::validation("INVALID_METADATA", format!("{field} must not be empty")));
        }
        if value.chars().count() > max {
            return Err(RegistryError::validation(
                "INVALID_METADATA",
                format!("{field} must be at most {max} characters"),
            ));
        }
        Ok(())
    }
    len_check("name", &input.name, 80)?;
    len_check("summary", &input.summary, 200)?;
    if input.description.chars().count() > 50_000 {
        return Err(RegistryError::validation(
            "INVALID_METADATA",
            "description must be at most 50000 characters",
        ));
    }
    if input.categories.len() > 5 || input.tags.len() > 10 {
        return Err(RegistryError::validation(
            "INVALID_METADATA",
            "at most 5 categories and 10 tags",
        ));
    }
    for value in input.categories.iter().chain(input.tags.iter()) {
        if value.is_empty()
            || value.len() > 40
            || !value
                .bytes()
                .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')
        {
            return Err(RegistryError::validation(
                "INVALID_METADATA",
                format!("category/tag {value:?} must match [a-z0-9-]{{1,40}}"),
            ));
        }
    }
    if let Some(license) = &input.license {
        if license.is_empty() || license.len() > 64 {
            return Err(RegistryError::validation(
                "INVALID_METADATA",
                "license must be 1..=64 characters (SPDX identifier)",
            ));
        }
    }
    Ok(())
}
