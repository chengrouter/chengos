//! SQLx row models and explicit conversions to domain types.
//!
//! API DTOs never reuse these; the flow is row -> domain -> DTO.

use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

use crate::domain::artifact::{Artifact, ArtifactFileEntry, Digest, FileKind};
use crate::domain::moderation::{AbuseReport, AuditEvent, AuditActorType, ReportStatus};
use crate::domain::publisher::{Publisher, PublisherType};
use crate::domain::publisher_auth::{ExternalIdentity, GrantCode, PublisherToken, TokenKind};
use crate::domain::release::{Release, ReleaseStatus};
use crate::domain::skill::{Skill, SkillVisibility};
use crate::error::{RegistryError, Result};
use crate::ports::job_queue::{JobStatus, JobType, OutboxJob};

fn bad_row(what: &str, value: &str) -> RegistryError {
    RegistryError::Internal(anyhow::anyhow!("corrupt row: invalid {what} {value:?}"))
}

#[derive(Debug, FromRow)]
pub struct PublisherRow {
    pub id: Uuid,
    pub handle: String,
    pub display_name: String,
    pub publisher_type: String,
    pub verified: bool,
    pub banned_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl PublisherRow {
    pub fn into_domain(self) -> Result<Publisher> {
        Ok(Publisher {
            publisher_type: PublisherType::parse(&self.publisher_type)
                .ok_or_else(|| bad_row("publisher_type", &self.publisher_type))?,
            id: self.id,
            handle: self.handle,
            display_name: self.display_name,
            verified: self.verified,
            banned_at: self.banned_at,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}

#[derive(Debug, FromRow)]
pub struct IdentityRow {
    pub id: Uuid,
    pub provider_key_fingerprint: String,
    pub subject: String,
    pub issuer_label: String,
    pub display_name: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_seen_at: DateTime<Utc>,
}

impl IdentityRow {
    pub fn into_domain(self) -> ExternalIdentity {
        ExternalIdentity {
            id: self.id,
            provider_key_fingerprint: self.provider_key_fingerprint,
            subject: self.subject,
            issuer_label: self.issuer_label,
            display_name: self.display_name,
            created_at: self.created_at,
            last_seen_at: self.last_seen_at,
        }
    }
}

#[derive(Debug, FromRow)]
pub struct TokenRow {
    pub id: Uuid,
    pub identity_id: Uuid,
    pub publisher_id: Uuid,
    pub kind: String,
    pub label: String,
    pub token_hash: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub last_used_at: Option<DateTime<Utc>>,
}

impl TokenRow {
    pub fn into_domain(self) -> Result<PublisherToken> {
        Ok(PublisherToken {
            kind: TokenKind::parse(&self.kind).ok_or_else(|| bad_row("token kind", &self.kind))?,
            id: self.id,
            identity_id: self.identity_id,
            publisher_id: self.publisher_id,
            label: self.label,
            token_hash: self.token_hash,
            scopes: self.scopes,
            created_at: self.created_at,
            expires_at: self.expires_at,
            revoked_at: self.revoked_at,
            last_used_at: self.last_used_at,
        })
    }
}

#[derive(Debug, FromRow)]
pub struct GrantCodeRow {
    pub id: Uuid,
    pub identity_id: Uuid,
    pub publisher_id: Uuid,
    pub code_hash: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub consumed_at: Option<DateTime<Utc>>,
}

impl GrantCodeRow {
    pub fn into_domain(self) -> GrantCode {
        GrantCode {
            id: self.id,
            identity_id: self.identity_id,
            publisher_id: self.publisher_id,
            code_hash: self.code_hash,
            scopes: self.scopes,
            created_at: self.created_at,
            expires_at: self.expires_at,
            consumed_at: self.consumed_at,
        }
    }
}

#[derive(Debug, FromRow)]
pub struct SkillRow {
    pub id: Uuid,
    pub publisher_id: Uuid,
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    pub license: Option<String>,
    pub visibility: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl SkillRow {
    pub fn into_domain(self) -> Result<Skill> {
        Ok(Skill {
            visibility: SkillVisibility::parse(&self.visibility)
                .ok_or_else(|| bad_row("visibility", &self.visibility))?,
            id: self.id,
            publisher_id: self.publisher_id,
            slug: self.slug,
            name: self.name,
            summary: self.summary,
            description: self.description,
            categories: self.categories,
            tags: self.tags,
            license: self.license,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}

/// skills joined with publishers + denormalized aggregates, for list pages.
#[derive(Debug, FromRow)]
pub struct SkillListJoinRow {
    pub id: Uuid,
    pub publisher_id: Uuid,
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    pub license: Option<String>,
    pub visibility: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub publisher_handle: String,
    pub publisher_display_name: String,
    pub publisher_verified: bool,
    pub latest_version: Option<String>,
    pub latest_release_at: Option<DateTime<Utc>>,
    pub downloads_total: i64,
}

#[derive(Debug, FromRow)]
pub struct ReleaseRow {
    pub id: Uuid,
    pub skill_id: Uuid,
    pub version: String,
    pub status: String,
    pub changelog: Option<String>,
    pub min_chengos_version: String,
    pub max_chengos_version: Option<String>,
    pub artifact_id: Option<Uuid>,
    pub created_by_identity: Uuid,
    pub published_at: Option<DateTime<Utc>>,
    pub yanked_at: Option<DateTime<Utc>>,
    pub yank_reason: Option<String>,
    pub quarantined_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl ReleaseRow {
    pub fn into_domain(self) -> Result<Release> {
        Ok(Release {
            status: ReleaseStatus::parse(&self.status)
                .ok_or_else(|| bad_row("release status", &self.status))?,
            id: self.id,
            skill_id: self.skill_id,
            version: self.version,
            changelog: self.changelog,
            minimum_chengos_version: self.min_chengos_version,
            maximum_chengos_version: self.max_chengos_version,
            artifact_id: self.artifact_id,
            created_by_identity: self.created_by_identity,
            published_at: self.published_at,
            yanked_at: self.yanked_at,
            yank_reason: self.yank_reason,
            quarantined_at: self.quarantined_at,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}

#[derive(Debug, FromRow)]
pub struct ArtifactRow {
    pub id: Uuid,
    pub sha256: String,
    pub storage_key: String,
    pub media_type: String,
    pub size_bytes: i64,
    pub expanded_bytes: i64,
    pub file_count: i32,
    pub created_at: DateTime<Utc>,
}

impl ArtifactRow {
    pub fn into_domain(self) -> Result<Artifact> {
        Ok(Artifact {
            digest: Digest::parse(&self.sha256).map_err(|_| bad_row("sha256", &self.sha256))?,
            id: self.id,
            storage_key: self.storage_key,
            media_type: self.media_type,
            size_bytes: self.size_bytes,
            expanded_bytes: self.expanded_bytes,
            file_count: self.file_count,
            created_at: self.created_at,
        })
    }
}

#[derive(Debug, FromRow)]
pub struct ArtifactFileRow {
    pub path: String,
    pub size_bytes: i64,
    pub sha256: String,
    pub kind: String,
}

impl ArtifactFileRow {
    pub fn into_domain(self) -> Result<ArtifactFileEntry> {
        Ok(ArtifactFileEntry {
            kind: FileKind::parse(&self.kind).ok_or_else(|| bad_row("file kind", &self.kind))?,
            path: self.path,
            size: self.size_bytes.max(0) as u64,
            sha256: self.sha256,
        })
    }
}

#[derive(Debug, FromRow)]
pub struct ReportRow {
    pub id: Uuid,
    pub skill_id: Uuid,
    pub release_id: Option<Uuid>,
    pub reason: String,
    pub details: String,
    pub contact: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
}

impl ReportRow {
    pub fn into_domain(self) -> Result<AbuseReport> {
        Ok(AbuseReport {
            status: ReportStatus::parse(&self.status).ok_or_else(|| bad_row("report status", &self.status))?,
            id: self.id,
            skill_id: self.skill_id,
            release_id: self.release_id,
            reason: self.reason,
            details: self.details,
            contact: self.contact,
            created_at: self.created_at,
            resolved_at: self.resolved_at,
        })
    }
}

#[derive(Debug, FromRow)]
pub struct AuditEventRow {
    pub id: Uuid,
    pub actor_type: String,
    pub actor: String,
    pub action: String,
    pub subject_type: String,
    pub subject_id: String,
    pub details: serde_json::Value,
    pub request_id: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl AuditEventRow {
    pub fn into_domain(self) -> AuditEvent {
        let actor_type = match self.actor_type.as_str() {
            "identity" => AuditActorType::Identity,
            "admin" => AuditActorType::Admin,
            "system" => AuditActorType::System,
            _ => AuditActorType::Anonymous,
        };
        AuditEvent {
            id: self.id,
            actor_type,
            actor: self.actor,
            action: self.action,
            subject_type: self.subject_type,
            subject_id: self.subject_id,
            details: self.details,
            request_id: self.request_id,
            created_at: self.created_at,
        }
    }
}

#[derive(Debug, FromRow)]
pub struct OutboxJobRow {
    pub id: Uuid,
    pub job_type: String,
    pub schema_version: i32,
    pub payload: serde_json::Value,
    pub status: String,
    pub trace_id: Option<String>,
    pub idempotency_key: Option<String>,
    pub attempts: i32,
    pub max_attempts: i32,
    pub run_at: DateTime<Utc>,
    pub lease_owner: Option<String>,
    pub lease_expires_at: Option<DateTime<Utc>>,
    pub last_error: Option<String>,
    pub dead_letter_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl OutboxJobRow {
    pub fn into_domain(self) -> Result<OutboxJob> {
        Ok(OutboxJob {
            job_type: JobType::parse(&self.job_type).ok_or_else(|| bad_row("job_type", &self.job_type))?,
            status: JobStatus::parse(&self.status).ok_or_else(|| bad_row("job status", &self.status))?,
            id: self.id,
            schema_version: self.schema_version,
            payload: self.payload,
            trace_id: self.trace_id,
            idempotency_key: self.idempotency_key,
            attempts: self.attempts,
            max_attempts: self.max_attempts,
            run_at: self.run_at,
            lease_owner: self.lease_owner,
            lease_expires_at: self.lease_expires_at,
            last_error: self.last_error,
            dead_letter_reason: self.dead_letter_reason,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
