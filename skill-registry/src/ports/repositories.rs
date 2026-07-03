//! Repository traits — the persistence boundary.
//!
//! Composite operations that must be atomic (publish flows, moderation flows)
//! are single trait methods so implementations run them in one PostgreSQL
//! transaction; services never see transaction handles.

use std::collections::HashMap;

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::domain::artifact::{Artifact, ArtifactFileEntry, Digest, SafetySummary, ScriptDeclaration};
use crate::domain::moderation::{AbuseReport, AuditEvent, ModerationAction, ReportStatus};
use crate::domain::pagination::{Page, PageRequest, SortOrder};
use crate::domain::publisher::{MemberRole, Publisher, PublisherId, PublisherType};
use crate::domain::publisher_auth::{ExternalIdentity, GrantCode, IdentityId, PublisherToken, TokenId};
use crate::domain::release::{Release, ReleaseId, ReleaseStatus};
use crate::domain::scan::{ScanReport, ScanReportId};
use crate::domain::skill::{Skill, SkillId, SkillVisibility};
use crate::error::Result;
use crate::ports::job_queue::NewJob;

// ---------------------------------------------------------------------------
// Write models
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
pub struct NewPublisher {
    pub handle: String,
    pub display_name: String,
    pub publisher_type: PublisherType,
}

#[derive(Debug, Clone)]
pub struct NewSkill {
    pub publisher_id: PublisherId,
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    pub license: Option<String>,
}

#[derive(Debug, Clone)]
pub struct SkillMetadataUpdate {
    pub name: Option<String>,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub categories: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub license: Option<Option<String>>,
}

#[derive(Debug, Clone)]
pub struct NewRelease {
    pub skill_id: SkillId,
    pub version: String,
    pub changelog: Option<String>,
    pub created_by_identity: IdentityId,
}

/// Artifact record created after a validated upload.
#[derive(Debug, Clone)]
pub struct NewArtifactRecord {
    pub digest: Digest,
    pub storage_key: String,
    pub media_type: String,
    pub size_bytes: i64,
    pub expanded_bytes: i64,
    pub file_count: i32,
    pub files: Vec<ArtifactFileEntry>,
    pub scripts: Vec<ScriptDeclaration>,
    pub safety: SafetySummary,
    pub minimum_chengos_version: String,
    pub maximum_chengos_version: Option<String>,
}

#[derive(Debug, Clone)]
pub struct NewAuditEvent {
    pub actor_type: crate::domain::moderation::AuditActorType,
    pub actor: String,
    pub action: String,
    pub subject_type: String,
    pub subject_id: String,
    pub details: serde_json::Value,
    pub request_id: Option<String>,
}

// ---------------------------------------------------------------------------
// Read models
// ---------------------------------------------------------------------------

/// Catalog list row: skill + owner + latest published release facts.
#[derive(Debug, Clone)]
pub struct SkillListRow {
    pub skill: Skill,
    pub publisher_handle: String,
    pub publisher_display_name: String,
    pub publisher_verified: bool,
    pub latest_version: Option<String>,
    pub latest_release_at: Option<DateTime<Utc>>,
    pub downloads_total: i64,
}

/// Resolution result for `publisher/slug` including alias redirects.
#[derive(Debug, Clone)]
pub struct ResolvedSkill {
    pub skill: Skill,
    pub publisher: Publisher,
    /// True when the request used an alias; responses must expose the
    /// canonical slug explicitly.
    pub via_alias: bool,
}

#[derive(Debug, Clone, Default)]
pub struct SkillListFilter {
    /// Full-text / prefix query.
    pub query: Option<String>,
    pub category: Option<String>,
    pub tag: Option<String>,
    pub publisher_handle: Option<String>,
    /// Public listing hides non-published skills; moderation views widen this.
    pub include_unlisted: bool,
}

// ---------------------------------------------------------------------------
// Traits
// ---------------------------------------------------------------------------

#[async_trait]
pub trait PublisherRepo: Send + Sync {
    async fn get(&self, id: PublisherId) -> Result<Option<Publisher>>;
    async fn get_by_handle(&self, handle: &str) -> Result<Option<Publisher>>;
    /// Create the publisher and its owning member in one transaction.
    async fn create_with_owner(
        &self,
        publisher: NewPublisher,
        owner_identity: IdentityId,
        audit: NewAuditEvent,
    ) -> Result<Publisher>;
    async fn member_role(&self, publisher_id: PublisherId, identity_id: IdentityId) -> Result<Option<MemberRole>>;
    async fn list_for_identity(&self, identity_id: IdentityId) -> Result<Vec<(Publisher, MemberRole)>>;
    async fn set_banned(&self, publisher_id: PublisherId, banned: bool, audit: NewAuditEvent) -> Result<bool>;
}

#[async_trait]
pub trait IdentityRepo: Send + Sync {
    async fn get(&self, id: IdentityId) -> Result<Option<ExternalIdentity>>;
    async fn find(&self, provider_key_fingerprint: &str, subject: &str) -> Result<Option<ExternalIdentity>>;
    /// Find-or-create by `(fingerprint, subject)`, updating `last_seen_at`.
    async fn get_or_create(
        &self,
        provider_key_fingerprint: &str,
        subject: &str,
        issuer_label: &str,
        display_name: Option<&str>,
    ) -> Result<ExternalIdentity>;
    /// Identities sharing a subject under different keys (rotation detection).
    async fn find_by_subject(&self, subject: &str) -> Result<Vec<ExternalIdentity>>;
    /// Record a pending key-rotation link (new key claiming an existing
    /// identity). Returns the pending link id.
    async fn create_pending_link(
        &self,
        existing_identity_id: IdentityId,
        new_key_fingerprint: &str,
        new_issuer_label: &str,
    ) -> Result<Uuid>;
    /// Confirm a pending link: moves the identity to the new fingerprint and
    /// audits the rotation.
    async fn confirm_pending_link(&self, pending_link_id: Uuid, audit: NewAuditEvent) -> Result<bool>;
}

#[async_trait]
pub trait TokenRepo: Send + Sync {
    async fn create(&self, token: &PublisherToken, audit: NewAuditEvent) -> Result<()>;
    /// Lookup by HMAC hash; returns only active (unrevoked, unexpired) tokens.
    async fn find_active_by_hash(&self, token_hash: &str) -> Result<Option<PublisherToken>>;
    async fn list_for_identity(&self, identity_id: IdentityId) -> Result<Vec<PublisherToken>>;
    async fn revoke(&self, token_id: TokenId, audit: NewAuditEvent) -> Result<bool>;
    async fn touch_last_used(&self, token_id: TokenId) -> Result<()>;

    async fn create_grant_code(&self, code: &GrantCode) -> Result<()>;
    /// Atomically consume a one-time grant code (single winner under races).
    async fn consume_grant_code(&self, code_hash: &str) -> Result<Option<GrantCode>>;
}

#[async_trait]
pub trait SkillRepo: Send + Sync {
    async fn get(&self, id: SkillId) -> Result<Option<Skill>>;
    /// Resolve `publisher_handle/slug`, following slug aliases.
    async fn resolve(&self, publisher_handle: &str, slug: &str) -> Result<Option<ResolvedSkill>>;
    async fn create(&self, skill: NewSkill, audit: NewAuditEvent) -> Result<Skill>;
    async fn update_metadata(&self, id: SkillId, update: SkillMetadataUpdate, audit: NewAuditEvent) -> Result<Skill>;
    async fn set_visibility(&self, id: SkillId, visibility: SkillVisibility, audit: NewAuditEvent) -> Result<bool>;
    /// Rename slug, recording the old slug as an alias, atomically.
    async fn rename_slug(&self, id: SkillId, new_slug: &str, audit: NewAuditEvent) -> Result<Skill>;
    async fn list(&self, filter: SkillListFilter, order: SortOrder, page: PageRequest) -> Result<Page<SkillListRow>>;
    /// Category name -> public skill count.
    async fn categories(&self) -> Result<Vec<(String, i64)>>;
}

#[async_trait]
pub trait ReleaseRepo: Send + Sync {
    async fn get(&self, id: ReleaseId) -> Result<Option<Release>>;
    async fn get_by_version(&self, skill_id: SkillId, version: &str) -> Result<Option<Release>>;
    async fn list_for_skill(&self, skill_id: SkillId, public_only: bool) -> Result<Vec<Release>>;
    async fn latest_published(&self, skill_id: SkillId) -> Result<Option<Release>>;

    /// Create a `pending_upload` release session. Exactly one winner for a
    /// concurrent `(skill_id, version)` — the loser gets a Conflict.
    async fn create_pending(&self, release: NewRelease, audit: NewAuditEvent) -> Result<Release>;

    /// The publish-critical transaction: insert (or reuse by digest) the
    /// artifact record with its file manifest, bind it to the release, move
    /// the release to `uploaded`, write the audit event, and commit the scan
    /// job outbox row — all or nothing. A committed release can therefore
    /// never lose its scan job.
    async fn bind_artifact_and_enqueue_scan(
        &self,
        release_id: ReleaseId,
        artifact: NewArtifactRecord,
        scan_job: NewJob,
        audit: NewAuditEvent,
    ) -> Result<(Release, Artifact)>;

    /// Guarded state transition: succeeds only when the current status is in
    /// `expected_from` and the transition is legal per the domain table.
    /// Writes the audit event in the same transaction.
    async fn transition(
        &self,
        release_id: ReleaseId,
        expected_from: &[ReleaseStatus],
        to: ReleaseStatus,
        reason: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<Release>;

    /// Moderation queue: releases in the given statuses, oldest first.
    async fn list_by_status(&self, statuses: &[ReleaseStatus], page: PageRequest) -> Result<Page<Release>>;

    /// Expired `pending_upload` sessions (cleanup candidates).
    async fn stale_pending(&self, older_than: DateTime<Utc>, limit: i64) -> Result<Vec<Release>>;
}

#[async_trait]
pub trait ArtifactRepo: Send + Sync {
    async fn get(&self, id: Uuid) -> Result<Option<Artifact>>;
    async fn get_by_digest(&self, digest: &Digest) -> Result<Option<Artifact>>;
    async fn files(&self, artifact_id: Uuid) -> Result<Vec<ArtifactFileEntry>>;
    async fn scripts(&self, artifact_id: Uuid) -> Result<Vec<ScriptDeclaration>>;
    async fn safety_summary(&self, artifact_id: Uuid) -> Result<Option<SafetySummary>>;
    /// Digests with no release references, created before `older_than`.
    async fn unreferenced(&self, older_than: DateTime<Utc>, limit: i64) -> Result<Vec<Artifact>>;
    /// Delete a (verified unreferenced) artifact row.
    async fn delete(&self, id: Uuid) -> Result<bool>;
    /// Totals for metrics.
    async fn stats(&self) -> Result<(i64, i64)>;
}

#[async_trait]
pub trait ScanRepo: Send + Sync {
    /// Append a report with findings (historical reports are never replaced).
    async fn insert_report(&self, report: &ScanReport) -> Result<ScanReportId>;
    async fn latest_for_release(&self, release_id: ReleaseId) -> Result<Option<ScanReport>>;
    async fn list_for_release(&self, release_id: ReleaseId) -> Result<Vec<ScanReport>>;
    /// Published/approved releases whose newest report predates the policy.
    async fn releases_behind_policy(&self, policy_version: &str, limit: i64) -> Result<Vec<ReleaseId>>;
}

#[async_trait]
pub trait ModerationRepo: Send + Sync {
    async fn create_report(&self, report: &AbuseReport) -> Result<Uuid>;
    async fn get_report(&self, id: Uuid) -> Result<Option<AbuseReport>>;
    async fn list_reports(&self, status: Option<ReportStatus>, page: PageRequest) -> Result<Page<AbuseReport>>;
    async fn set_report_status(&self, id: Uuid, status: ReportStatus, audit: NewAuditEvent) -> Result<bool>;
    async fn record_action(&self, action: &ModerationAction, audit: NewAuditEvent) -> Result<()>;
}

#[async_trait]
pub trait AuditRepo: Send + Sync {
    async fn append(&self, event: NewAuditEvent) -> Result<()>;
    async fn list_for_subject(&self, subject_type: &str, subject_id: &str, limit: i64) -> Result<Vec<AuditEvent>>;
}

#[async_trait]
pub trait DownloadStatsRepo: Send + Sync {
    /// Idempotent daily aggregate upsert keyed by `(release_id, day, batch_id)`.
    async fn add_daily_counts(
        &self,
        day: chrono::NaiveDate,
        batch_id: &str,
        counts: &[(ReleaseId, i64)],
    ) -> Result<()>;
    async fn totals_for_skills(&self, skill_ids: &[SkillId]) -> Result<HashMap<SkillId, i64>>;
    async fn total_for_release(&self, release_id: ReleaseId) -> Result<i64>;
}
