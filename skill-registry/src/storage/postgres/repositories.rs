//! PostgreSQL implementations of the repository ports.
//!
//! Composite operations (publish, moderation) run in explicit transactions;
//! every state change writes its audit event in the same transaction.
//! Uniqueness races (same version published twice, same handle claimed
//! twice) are resolved by database constraints — exactly one winner.

use std::collections::HashMap;

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::{PgExecutor, PgPool, Postgres, QueryBuilder, Row};
use uuid::Uuid;

use crate::domain::artifact::{Artifact, ArtifactFileEntry, Digest, SafetySummary, ScriptDeclaration};
use crate::domain::moderation::{AbuseReport, AuditEvent, ModerationAction, ReportStatus};
use crate::domain::pagination::{Cursor, Page, PageRequest, SortOrder};
use crate::domain::publisher::{MemberRole, Publisher, PublisherId};
use crate::domain::publisher_auth::{ExternalIdentity, GrantCode, IdentityId, PublisherToken, TokenId};
use crate::domain::release::{Release, ReleaseId, ReleaseStatus};
use crate::domain::scan::{FindingKind, ScanConclusion, ScanFinding, ScanReport, ScanReportId, Severity};
use crate::domain::skill::{Skill, SkillId, SkillVisibility};
use crate::error::{RegistryError, Result};
use crate::ports::job_queue::NewJob;
use crate::ports::repositories::*;

use super::models::*;

const SKILL_COLUMNS: &str = "id, publisher_id, slug, name, summary, description, categories, tags, license, visibility, created_at, updated_at";
const RELEASE_COLUMNS: &str = "id, skill_id, version, status, changelog, min_chengos_version, max_chengos_version, artifact_id, created_by_identity, published_at, yanked_at, yank_reason, quarantined_at, created_at, updated_at";
const ARTIFACT_COLUMNS: &str = "id, sha256, storage_key, media_type, size_bytes, expanded_bytes, file_count, created_at";
const TOKEN_COLUMNS: &str = "id, identity_id, publisher_id, kind, label, token_hash, scopes, created_at, expires_at, revoked_at, last_used_at";

#[derive(Clone)]
pub struct PgRepos {
    pool: PgPool,
}

impl PgRepos {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub fn pool(&self) -> &PgPool {
        &self.pool
    }
}

/// Insert an audit event using any executor (pool or open transaction).
pub async fn insert_audit<'e, E: PgExecutor<'e>>(exec: E, event: &NewAuditEvent) -> Result<()> {
    sqlx::query(
        "INSERT INTO audit_events (actor_type, actor, action, subject_type, subject_id, details, request_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)",
    )
    .bind(event.actor_type.as_str())
    .bind(&event.actor)
    .bind(&event.action)
    .bind(&event.subject_type)
    .bind(&event.subject_id)
    .bind(&event.details)
    .bind(&event.request_id)
    .execute(exec)
    .await?;
    Ok(())
}

/// Insert an outbox job using any executor. Duplicate idempotency keys are
/// silently ignored (the work is already queued).
pub async fn insert_outbox_job<'e, E: PgExecutor<'e>>(exec: E, job: &NewJob, max_attempts: i32) -> Result<Option<Uuid>> {
    let row = sqlx::query(
        "INSERT INTO job_outbox (job_type, schema_version, payload, trace_id, idempotency_key, run_at, max_attempts)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (idempotency_key) DO NOTHING
         RETURNING id",
    )
    .bind(job.job_type.as_str())
    .bind(job.schema_version)
    .bind(&job.payload)
    .bind(&job.trace_id)
    .bind(&job.idempotency_key)
    .bind(job.run_at)
    .bind(max_attempts)
    .fetch_optional(exec)
    .await?;
    Ok(row.map(|r| r.get::<Uuid, _>("id")))
}

/// Recompute a skill's denormalized latest-release columns inside a txn.
async fn refresh_skill_latest(exec: &mut sqlx::PgConnection, skill_id: SkillId) -> Result<()> {
    // published_at ordering approximates "latest"; semver refinement happens
    // at the service layer when listing versions.
    sqlx::query(
        "UPDATE skills s SET
            latest_version = r.version,
            latest_release_at = r.published_at,
            updated_at = now()
         FROM (
            SELECT version, published_at FROM skill_releases
            WHERE skill_id = $1 AND status = 'published'
            ORDER BY published_at DESC LIMIT 1
         ) r
         WHERE s.id = $1",
    )
    .bind(skill_id)
    .execute(&mut *exec)
    .await?;
    sqlx::query(
        "UPDATE skills s SET latest_version = NULL, latest_release_at = NULL, updated_at = now()
         WHERE s.id = $1 AND NOT EXISTS (
            SELECT 1 FROM skill_releases WHERE skill_id = $1 AND status = 'published')",
    )
    .bind(skill_id)
    .execute(&mut *exec)
    .await?;
    Ok(())
}

// ---------------------------------------------------------------------------
// PublisherRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl PublisherRepo for PgRepos {
    async fn get(&self, id: PublisherId) -> Result<Option<Publisher>> {
        let row: Option<PublisherRow> =
            sqlx::query_as("SELECT * FROM publishers WHERE id = $1")
                .bind(id)
                .fetch_optional(&self.pool)
                .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn get_by_handle(&self, handle: &str) -> Result<Option<Publisher>> {
        let row: Option<PublisherRow> =
            sqlx::query_as("SELECT * FROM publishers WHERE handle = $1")
                .bind(handle)
                .fetch_optional(&self.pool)
                .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn create_with_owner(
        &self,
        publisher: NewPublisher,
        owner_identity: IdentityId,
        audit: NewAuditEvent,
    ) -> Result<Publisher> {
        let mut tx = self.pool.begin().await?;
        let row: Option<PublisherRow> = sqlx::query_as(
            "INSERT INTO publishers (handle, display_name, publisher_type)
             VALUES ($1, $2, $3)
             ON CONFLICT (handle) DO NOTHING
             RETURNING *",
        )
        .bind(&publisher.handle)
        .bind(&publisher.display_name)
        .bind(publisher.publisher_type.as_str())
        .fetch_optional(&mut *tx)
        .await?;
        let row = row.ok_or_else(|| {
            RegistryError::conflict("HANDLE_TAKEN", format!("handle {:?} is taken", publisher.handle))
        })?;
        sqlx::query(
            "INSERT INTO publisher_members (publisher_id, identity_id, role) VALUES ($1, $2, 'owner')",
        )
        .bind(row.id)
        .bind(owner_identity)
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn member_role(&self, publisher_id: PublisherId, identity_id: IdentityId) -> Result<Option<MemberRole>> {
        let role: Option<(String,)> = sqlx::query_as(
            "SELECT role FROM publisher_members WHERE publisher_id = $1 AND identity_id = $2",
        )
        .bind(publisher_id)
        .bind(identity_id)
        .fetch_optional(&self.pool)
        .await?;
        Ok(role.and_then(|(r,)| MemberRole::parse(&r)))
    }

    async fn list_for_identity(&self, identity_id: IdentityId) -> Result<Vec<(Publisher, MemberRole)>> {
        let rows: Vec<(PublisherRow, String)> = sqlx::query(
            "SELECT p.*, m.role FROM publishers p
             JOIN publisher_members m ON m.publisher_id = p.id
             WHERE m.identity_id = $1
             ORDER BY p.handle",
        )
        .bind(identity_id)
        .fetch_all(&self.pool)
        .await?
        .into_iter()
        .map(|row| {
            let role: String = row.get("role");
            let publisher = PublisherRow {
                id: row.get("id"),
                handle: row.get("handle"),
                display_name: row.get("display_name"),
                publisher_type: row.get("publisher_type"),
                verified: row.get("verified"),
                banned_at: row.get("banned_at"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            (publisher, role)
        })
        .collect();

        let mut out = Vec::with_capacity(rows.len());
        for (publisher, role) in rows {
            let role = MemberRole::parse(&role)
                .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("corrupt member role {role:?}")))?;
            out.push((publisher.into_domain()?, role));
        }
        Ok(out)
    }

    async fn set_banned(&self, publisher_id: PublisherId, banned: bool, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool.begin().await?;
        let result = sqlx::query(
            "UPDATE publishers SET banned_at = CASE WHEN $2 THEN now() ELSE NULL END, updated_at = now()
             WHERE id = $1",
        )
        .bind(publisher_id)
        .bind(banned)
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(result.rows_affected() > 0)
    }
}

// ---------------------------------------------------------------------------
// IdentityRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl IdentityRepo for PgRepos {
    async fn get(&self, id: IdentityId) -> Result<Option<ExternalIdentity>> {
        let row: Option<IdentityRow> =
            sqlx::query_as("SELECT * FROM external_identities WHERE id = $1")
                .bind(id)
                .fetch_optional(&self.pool)
                .await?;
        Ok(row.map(|r| r.into_domain()))
    }

    async fn find(&self, provider_key_fingerprint: &str, subject: &str) -> Result<Option<ExternalIdentity>> {
        let row: Option<IdentityRow> = sqlx::query_as(
            "SELECT * FROM external_identities WHERE provider_key_fingerprint = $1 AND subject = $2",
        )
        .bind(provider_key_fingerprint)
        .bind(subject)
        .fetch_optional(&self.pool)
        .await?;
        Ok(row.map(|r| r.into_domain()))
    }

    async fn get_or_create(
        &self,
        provider_key_fingerprint: &str,
        subject: &str,
        issuer_label: &str,
        display_name: Option<&str>,
    ) -> Result<ExternalIdentity> {
        let row: IdentityRow = sqlx::query_as(
            "INSERT INTO external_identities (provider_key_fingerprint, subject, issuer_label, display_name)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (provider_key_fingerprint, subject)
             DO UPDATE SET last_seen_at = now(),
                           issuer_label = EXCLUDED.issuer_label,
                           display_name = COALESCE(EXCLUDED.display_name, external_identities.display_name)
             RETURNING *",
        )
        .bind(provider_key_fingerprint)
        .bind(subject)
        .bind(issuer_label)
        .bind(display_name)
        .fetch_one(&self.pool)
        .await?;
        Ok(row.into_domain())
    }

    async fn find_by_subject(&self, subject: &str) -> Result<Vec<ExternalIdentity>> {
        let rows: Vec<IdentityRow> =
            sqlx::query_as("SELECT * FROM external_identities WHERE subject = $1")
                .bind(subject)
                .fetch_all(&self.pool)
                .await?;
        Ok(rows.into_iter().map(|r| r.into_domain()).collect())
    }

    async fn create_pending_link(
        &self,
        existing_identity_id: IdentityId,
        new_key_fingerprint: &str,
        new_issuer_label: &str,
    ) -> Result<Uuid> {
        let row = sqlx::query(
            "INSERT INTO pending_identity_links (existing_identity_id, new_key_fingerprint, new_issuer_label)
             VALUES ($1, $2, $3)
             ON CONFLICT (existing_identity_id, new_key_fingerprint)
             DO UPDATE SET new_issuer_label = EXCLUDED.new_issuer_label
             RETURNING id",
        )
        .bind(existing_identity_id)
        .bind(new_key_fingerprint)
        .bind(new_issuer_label)
        .fetch_one(&self.pool)
        .await?;
        Ok(row.get::<Uuid, _>("id"))
    }

    async fn confirm_pending_link(&self, pending_link_id: Uuid, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool.begin().await?;
        let link = sqlx::query(
            "UPDATE pending_identity_links SET confirmed_at = now()
             WHERE id = $1 AND confirmed_at IS NULL
             RETURNING existing_identity_id, new_key_fingerprint",
        )
        .bind(pending_link_id)
        .fetch_optional(&mut *tx)
        .await?;
        let Some(link) = link else {
            tx.rollback().await.ok();
            return Ok(false);
        };
        let identity_id: Uuid = link.get("existing_identity_id");
        let new_fingerprint: String = link.get("new_key_fingerprint");
        sqlx::query(
            "UPDATE external_identities SET provider_key_fingerprint = $2, last_seen_at = now()
             WHERE id = $1",
        )
        .bind(identity_id)
        .bind(&new_fingerprint)
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(true)
    }
}

// ---------------------------------------------------------------------------
// TokenRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl TokenRepo for PgRepos {
    async fn create(&self, token: &PublisherToken, audit: NewAuditEvent) -> Result<()> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            "INSERT INTO api_tokens (id, identity_id, publisher_id, kind, label, token_hash, scopes, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        )
        .bind(token.id)
        .bind(token.identity_id)
        .bind(token.publisher_id)
        .bind(token.kind.as_str())
        .bind(&token.label)
        .bind(&token.token_hash)
        .bind(&token.scopes)
        .bind(token.expires_at)
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(())
    }

    async fn find_active_by_hash(&self, token_hash: &str) -> Result<Option<PublisherToken>> {
        let row: Option<TokenRow> = sqlx::query_as(
            &format!(
                "SELECT {TOKEN_COLUMNS} FROM api_tokens
                 WHERE token_hash = $1 AND revoked_at IS NULL
                   AND (expires_at IS NULL OR expires_at > now())"
            ),
        )
        .bind(token_hash)
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn list_for_identity(&self, identity_id: IdentityId) -> Result<Vec<PublisherToken>> {
        let rows: Vec<TokenRow> = sqlx::query_as(
            &format!(
                "SELECT {TOKEN_COLUMNS} FROM api_tokens WHERE identity_id = $1 ORDER BY created_at DESC"
            ),
        )
        .bind(identity_id)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn revoke(&self, token_id: TokenId, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool.begin().await?;
        let result = sqlx::query(
            "UPDATE api_tokens SET revoked_at = now() WHERE id = $1 AND revoked_at IS NULL",
        )
        .bind(token_id)
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(result.rows_affected() > 0)
    }

    async fn touch_last_used(&self, token_id: TokenId) -> Result<()> {
        sqlx::query("UPDATE api_tokens SET last_used_at = now() WHERE id = $1")
            .bind(token_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    async fn create_grant_code(&self, code: &GrantCode) -> Result<()> {
        sqlx::query(
            "INSERT INTO publisher_grants (id, identity_id, publisher_id, code_hash, scopes, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6)",
        )
        .bind(code.id)
        .bind(code.identity_id)
        .bind(code.publisher_id)
        .bind(&code.code_hash)
        .bind(&code.scopes)
        .bind(code.expires_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn consume_grant_code(&self, code_hash: &str) -> Result<Option<GrantCode>> {
        // Atomic one-time consumption: exactly one winner.
        let row: Option<GrantCodeRow> = sqlx::query_as(
            "UPDATE publisher_grants SET consumed_at = now()
             WHERE code_hash = $1 AND consumed_at IS NULL AND expires_at > now()
             RETURNING *",
        )
        .bind(code_hash)
        .fetch_optional(&self.pool)
        .await?;
        Ok(row.map(|r| r.into_domain()))
    }
}

// ---------------------------------------------------------------------------
// SkillRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl SkillRepo for PgRepos {
    async fn get(&self, id: SkillId) -> Result<Option<Skill>> {
        let row: Option<SkillRow> = sqlx::query_as(
            &format!("SELECT {SKILL_COLUMNS} FROM skills WHERE id = $1"),
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn resolve(&self, publisher_handle: &str, slug: &str) -> Result<Option<ResolvedSkill>> {
        // Canonical slug first.
        let row: Option<SkillRow> = sqlx::query_as(
            &format!(
                "SELECT s.{cols} FROM skills s
                 JOIN publishers p ON p.id = s.publisher_id
                 WHERE p.handle = $1 AND s.slug = $2",
                cols = SKILL_COLUMNS.replace(", ", ", s.")
            ),
        )
        .bind(publisher_handle)
        .bind(slug)
        .fetch_optional(&self.pool)
        .await?;

        let (skill_row, via_alias) = match row {
            Some(row) => (row, false),
            None => {
                let row: Option<SkillRow> = sqlx::query_as(
                    &format!(
                        "SELECT s.{cols} FROM skills s
                         JOIN publishers p ON p.id = s.publisher_id
                         JOIN skill_aliases a ON a.skill_id = s.id
                         WHERE p.handle = $1 AND a.old_slug = $2",
                        cols = SKILL_COLUMNS.replace(", ", ", s.")
                    ),
                )
                .bind(publisher_handle)
                .bind(slug)
                .fetch_optional(&self.pool)
                .await?;
                match row {
                    Some(row) => (row, true),
                    None => return Ok(None),
                }
            }
        };

        let publisher = PublisherRepo::get(self, skill_row.publisher_id)
            .await?
            .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("skill without publisher")))?;
        Ok(Some(ResolvedSkill {
            skill: skill_row.into_domain()?,
            publisher,
            via_alias,
        }))
    }

    async fn create(&self, skill: NewSkill, audit: NewAuditEvent) -> Result<Skill> {
        let mut tx = self.pool.begin().await?;
        let row: Option<SkillRow> = sqlx::query_as(
            &format!(
                "INSERT INTO skills (publisher_id, slug, name, summary, description, categories, tags, license)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (publisher_id, slug) DO NOTHING
                 RETURNING {SKILL_COLUMNS}"
            ),
        )
        .bind(skill.publisher_id)
        .bind(&skill.slug)
        .bind(&skill.name)
        .bind(&skill.summary)
        .bind(&skill.description)
        .bind(&skill.categories)
        .bind(&skill.tags)
        .bind(&skill.license)
        .fetch_optional(&mut *tx)
        .await?;
        let row = row.ok_or_else(|| {
            RegistryError::conflict("SLUG_TAKEN", format!("slug {:?} already exists for this publisher", skill.slug))
        })?;
        // A new slug must not shadow an alias of another skill.
        let alias_conflict: Option<(Uuid,)> = sqlx::query_as(
            "SELECT skill_id FROM skill_aliases WHERE publisher_id = $1 AND old_slug = $2",
        )
        .bind(skill.publisher_id)
        .bind(&skill.slug)
        .fetch_optional(&mut *tx)
        .await?;
        if alias_conflict.is_some() {
            tx.rollback().await.ok();
            return Err(RegistryError::conflict(
                "SLUG_TAKEN",
                format!("slug {:?} is reserved by a previous rename", skill.slug),
            ));
        }
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn update_metadata(&self, id: SkillId, update: SkillMetadataUpdate, audit: NewAuditEvent) -> Result<Skill> {
        let mut tx = self.pool.begin().await?;
        let row: Option<SkillRow> = sqlx::query_as(
            &format!(
                "UPDATE skills SET
                    name = COALESCE($2, name),
                    summary = COALESCE($3, summary),
                    description = COALESCE($4, description),
                    categories = COALESCE($5, categories),
                    tags = COALESCE($6, tags),
                    license = CASE WHEN $7 THEN $8 ELSE license END,
                    updated_at = now()
                 WHERE id = $1
                 RETURNING {SKILL_COLUMNS}"
            ),
        )
        .bind(id)
        .bind(&update.name)
        .bind(&update.summary)
        .bind(&update.description)
        .bind(&update.categories)
        .bind(&update.tags)
        .bind(update.license.is_some())
        .bind(update.license.clone().flatten())
        .fetch_optional(&mut *tx)
        .await?;
        let row = row.ok_or(RegistryError::NotFound("skill"))?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn set_visibility(&self, id: SkillId, visibility: SkillVisibility, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool.begin().await?;
        let result = sqlx::query("UPDATE skills SET visibility = $2, updated_at = now() WHERE id = $1")
            .bind(id)
            .bind(visibility.as_str())
            .execute(&mut *tx)
            .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(result.rows_affected() > 0)
    }

    async fn rename_slug(&self, id: SkillId, new_slug: &str, audit: NewAuditEvent) -> Result<Skill> {
        let mut tx = self.pool.begin().await?;
        let old: Option<(Uuid, String)> = sqlx::query_as(
            "SELECT publisher_id, slug FROM skills WHERE id = $1 FOR UPDATE",
        )
        .bind(id)
        .fetch_optional(&mut *tx)
        .await?;
        let (publisher_id, old_slug) = old.ok_or(RegistryError::NotFound("skill"))?;
        if old_slug == new_slug {
            return Err(RegistryError::validation("VALIDATION_ERROR", "slug unchanged"));
        }
        let row: Option<SkillRow> = sqlx::query_as(
            &format!(
                "UPDATE skills SET slug = $2, updated_at = now() WHERE id = $1 RETURNING {SKILL_COLUMNS}"
            ),
        )
        .bind(id)
        .bind(new_slug)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| match &e {
            sqlx::Error::Database(db) if db.is_unique_violation() => {
                RegistryError::conflict("SLUG_TAKEN", format!("slug {new_slug:?} already exists"))
            }
            _ => RegistryError::from_sqlx(e),
        })?;
        let row = row.ok_or(RegistryError::NotFound("skill"))?;
        sqlx::query(
            "INSERT INTO skill_aliases (publisher_id, old_slug, skill_id) VALUES ($1, $2, $3)
             ON CONFLICT (publisher_id, old_slug) DO UPDATE SET skill_id = EXCLUDED.skill_id",
        )
        .bind(publisher_id)
        .bind(&old_slug)
        .bind(id)
        .execute(&mut *tx)
        .await?;
        // The new canonical slug stops being an alias if it ever was one.
        sqlx::query("DELETE FROM skill_aliases WHERE publisher_id = $1 AND old_slug = $2")
            .bind(publisher_id)
            .bind(new_slug)
            .execute(&mut *tx)
            .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn list(&self, filter: SkillListFilter, order: SortOrder, page: PageRequest) -> Result<Page<SkillListRow>> {
        let mut qb: QueryBuilder<Postgres> = QueryBuilder::new(
            "SELECT s.id, s.publisher_id, s.slug, s.name, s.summary, s.description,
                    s.categories, s.tags, s.license, s.visibility, s.created_at, s.updated_at,
                    p.handle AS publisher_handle, p.display_name AS publisher_display_name,
                    p.verified AS publisher_verified,
                    s.latest_version, s.latest_release_at, s.downloads_total
             FROM skills s JOIN publishers p ON p.id = s.publisher_id
             WHERE p.banned_at IS NULL AND s.latest_version IS NOT NULL ",
        );

        if filter.include_unlisted {
            qb.push(" AND s.visibility IN ('public','unlisted') ");
        } else {
            qb.push(" AND s.visibility = 'public' ");
        }
        if let Some(query) = filter.query.as_deref().filter(|q| !q.trim().is_empty()) {
            let trimmed = query.trim().to_string();
            qb.push(" AND (s.search_tsv @@ plainto_tsquery('simple', ")
                .push_bind(trimmed.clone())
                .push(") OR s.slug ILIKE ")
                .push_bind(format!("%{}%", trimmed.replace('%', "\\%").replace('_', "\\_")))
                .push(" OR s.name ILIKE ")
                .push_bind(format!("%{}%", trimmed.replace('%', "\\%").replace('_', "\\_")))
                .push(") ");
        }
        if let Some(category) = filter.category.as_deref() {
            qb.push(" AND ").push_bind(category.to_string()).push(" = ANY(s.categories) ");
        }
        if let Some(tag) = filter.tag.as_deref() {
            qb.push(" AND ").push_bind(tag.to_string()).push(" = ANY(s.tags) ");
        }
        if let Some(handle) = filter.publisher_handle.as_deref() {
            qb.push(" AND p.handle = ").push_bind(handle.to_string());
        }

        // Cursor condition + deterministic ordering (sort key, id).
        match order {
            SortOrder::RecentlyUpdated | SortOrder::Relevance => {
                if let Some(cursor) = &page.cursor {
                    let ts = parse_cursor_timestamp(&cursor.k)?;
                    qb.push(" AND (s.updated_at, s.id) < (")
                        .push_bind(ts)
                        .push(", ")
                        .push_bind(cursor.id)
                        .push(") ");
                }
                qb.push(" ORDER BY s.updated_at DESC, s.id DESC ");
            }
            SortOrder::Newest => {
                if let Some(cursor) = &page.cursor {
                    let ts = parse_cursor_timestamp(&cursor.k)?;
                    qb.push(" AND (s.created_at, s.id) < (")
                        .push_bind(ts)
                        .push(", ")
                        .push_bind(cursor.id)
                        .push(") ");
                }
                qb.push(" ORDER BY s.created_at DESC, s.id DESC ");
            }
            SortOrder::Downloads => {
                if let Some(cursor) = &page.cursor {
                    let count: i64 = cursor
                        .k
                        .parse()
                        .map_err(|_| RegistryError::validation("INVALID_CURSOR", "bad cursor key"))?;
                    qb.push(" AND (s.downloads_total, s.id) < (")
                        .push_bind(count)
                        .push(", ")
                        .push_bind(cursor.id)
                        .push(") ");
                }
                qb.push(" ORDER BY s.downloads_total DESC, s.id DESC ");
            }
            SortOrder::Name => {
                if let Some(cursor) = &page.cursor {
                    qb.push(" AND (s.slug, s.id) > (")
                        .push_bind(cursor.k.clone())
                        .push(", ")
                        .push_bind(cursor.id)
                        .push(") ");
                }
                qb.push(" ORDER BY s.slug ASC, s.id ASC ");
            }
        }
        qb.push(" LIMIT ").push_bind(page.limit as i64 + 1);

        let rows: Vec<SkillListJoinRow> = qb.build_query_as().fetch_all(&self.pool).await?;
        let has_more = rows.len() > page.limit as usize;

        let mut items = Vec::with_capacity(rows.len().min(page.limit as usize));
        for row in rows.into_iter().take(page.limit as usize) {
            let skill = SkillRow {
                id: row.id,
                publisher_id: row.publisher_id,
                slug: row.slug,
                name: row.name,
                summary: row.summary,
                description: row.description,
                categories: row.categories,
                tags: row.tags,
                license: row.license,
                visibility: row.visibility,
                created_at: row.created_at,
                updated_at: row.updated_at,
            }
            .into_domain()?;
            items.push(SkillListRow {
                publisher_handle: row.publisher_handle,
                publisher_display_name: row.publisher_display_name,
                publisher_verified: row.publisher_verified,
                latest_version: row.latest_version,
                latest_release_at: row.latest_release_at,
                downloads_total: row.downloads_total,
                skill,
            });
        }

        let next_cursor = if has_more {
            items.last().map(|last| {
                let k = match order {
                    SortOrder::RecentlyUpdated | SortOrder::Relevance => {
                        last.skill.updated_at.timestamp_micros().to_string()
                    }
                    SortOrder::Newest => last.skill.created_at.timestamp_micros().to_string(),
                    SortOrder::Downloads => last.downloads_total.to_string(),
                    SortOrder::Name => last.skill.slug.clone(),
                };
                Cursor { o: order.as_str().into(), k, id: last.skill.id }.encode()
            })
        } else {
            None
        };

        Ok(Page { items, next_cursor })
    }

    async fn categories(&self) -> Result<Vec<(String, i64)>> {
        let rows: Vec<(String, i64)> = sqlx::query_as(
            "SELECT c, count(*) FROM skills s, unnest(s.categories) c
             WHERE s.visibility = 'public' AND s.latest_version IS NOT NULL
             GROUP BY c ORDER BY count(*) DESC, c",
        )
        .fetch_all(&self.pool)
        .await?;
        Ok(rows)
    }
}

fn parse_cursor_timestamp(k: &str) -> Result<DateTime<Utc>> {
    let micros: i64 = k
        .parse()
        .map_err(|_| RegistryError::validation("INVALID_CURSOR", "bad cursor key"))?;
    DateTime::<Utc>::from_timestamp_micros(micros)
        .ok_or_else(|| RegistryError::validation("INVALID_CURSOR", "bad cursor key"))
}

// ---------------------------------------------------------------------------
// ReleaseRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl ReleaseRepo for PgRepos {
    async fn get(&self, id: ReleaseId) -> Result<Option<Release>> {
        let row: Option<ReleaseRow> = sqlx::query_as(
            &format!("SELECT {RELEASE_COLUMNS} FROM skill_releases WHERE id = $1"),
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn get_by_version(&self, skill_id: SkillId, version: &str) -> Result<Option<Release>> {
        let row: Option<ReleaseRow> = sqlx::query_as(
            &format!("SELECT {RELEASE_COLUMNS} FROM skill_releases WHERE skill_id = $1 AND version = $2"),
        )
        .bind(skill_id)
        .bind(version)
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn list_for_skill(&self, skill_id: SkillId, public_only: bool) -> Result<Vec<Release>> {
        let sql = if public_only {
            format!(
                "SELECT {RELEASE_COLUMNS} FROM skill_releases
                 WHERE skill_id = $1 AND status IN ('published', 'yanked')
                 ORDER BY created_at DESC"
            )
        } else {
            format!(
                "SELECT {RELEASE_COLUMNS} FROM skill_releases WHERE skill_id = $1 ORDER BY created_at DESC"
            )
        };
        let rows: Vec<ReleaseRow> = sqlx::query_as(&sql).bind(skill_id).fetch_all(&self.pool).await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn latest_published(&self, skill_id: SkillId) -> Result<Option<Release>> {
        let releases = self.list_for_skill(skill_id, true).await?;
        let mut best: Option<(semver::Version, Release)> = None;
        for release in releases {
            if release.status != ReleaseStatus::Published {
                continue;
            }
            if let Ok(v) = semver::Version::parse(&release.version) {
                if best.as_ref().map(|(bv, _)| v > *bv).unwrap_or(true) {
                    best = Some((v, release));
                }
            }
        }
        Ok(best.map(|(_, r)| r))
    }

    async fn create_pending(&self, release: NewRelease, audit: NewAuditEvent) -> Result<Release> {
        let mut tx = self.pool.begin().await?;
        let row: Option<ReleaseRow> = sqlx::query_as(
            &format!(
                "INSERT INTO skill_releases (skill_id, version, changelog, created_by_identity)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (skill_id, version) DO NOTHING
                 RETURNING {RELEASE_COLUMNS}"
            ),
        )
        .bind(release.skill_id)
        .bind(&release.version)
        .bind(&release.changelog)
        .bind(release.created_by_identity)
        .fetch_optional(&mut *tx)
        .await?;
        let row = row.ok_or_else(|| {
            RegistryError::conflict(
                "VERSION_EXISTS",
                format!("version {} already exists for this skill", release.version),
            )
        })?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn bind_artifact_and_enqueue_scan(
        &self,
        release_id: ReleaseId,
        artifact: NewArtifactRecord,
        scan_job: NewJob,
        audit: NewAuditEvent,
    ) -> Result<(Release, Artifact)> {
        let mut tx = self.pool.begin().await?;

        let current: Option<ReleaseRow> = sqlx::query_as(
            &format!("SELECT {RELEASE_COLUMNS} FROM skill_releases WHERE id = $1 FOR UPDATE"),
        )
        .bind(release_id)
        .fetch_optional(&mut *tx)
        .await?;
        let current = current.ok_or(RegistryError::NotFound("release"))?.into_domain()?;
        if current.status != ReleaseStatus::PendingUpload {
            // Idempotent replay: same digest already bound -> return current.
            if current.status == ReleaseStatus::Uploaded || current.status == ReleaseStatus::Scanning {
                if let Some(existing_artifact_id) = current.artifact_id {
                    let existing: Option<ArtifactRow> = sqlx::query_as(
                        &format!("SELECT {ARTIFACT_COLUMNS} FROM artifacts WHERE id = $1"),
                    )
                    .bind(existing_artifact_id)
                    .fetch_optional(&mut *tx)
                    .await?;
                    if let Some(existing) = existing {
                        if existing.sha256 == artifact.digest.as_str() {
                            let existing = existing.into_domain()?;
                            tx.rollback().await.ok();
                            return Ok((current, existing));
                        }
                    }
                }
            }
            return Err(RegistryError::invalid_state(
                "RELEASE_STATE",
                format!("release is {} — artifact can only bind to pending_upload", current.status.as_str()),
            ));
        }

        // Insert-or-reuse the content-addressed artifact record.
        let inserted: Option<ArtifactRow> = sqlx::query_as(
            &format!(
                "INSERT INTO artifacts (sha256, storage_key, media_type, size_bytes, expanded_bytes,
                                        file_count, scripts, safety, min_chengos_version, max_chengos_version)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 ON CONFLICT (sha256) DO NOTHING
                 RETURNING {ARTIFACT_COLUMNS}"
            ),
        )
        .bind(artifact.digest.as_str())
        .bind(&artifact.storage_key)
        .bind(&artifact.media_type)
        .bind(artifact.size_bytes)
        .bind(artifact.expanded_bytes)
        .bind(artifact.file_count)
        .bind(serde_json::to_value(&artifact.scripts).unwrap_or_default())
        .bind(serde_json::to_value(&artifact.safety).unwrap_or_default())
        .bind(&artifact.minimum_chengos_version)
        .bind(&artifact.maximum_chengos_version)
        .fetch_optional(&mut *tx)
        .await?;

        let artifact_row = match inserted {
            Some(row) => {
                for file in &artifact.files {
                    sqlx::query(
                        "INSERT INTO artifact_files (artifact_id, path, size_bytes, sha256, kind)
                         VALUES ($1, $2, $3, $4, $5)",
                    )
                    .bind(row.id)
                    .bind(&file.path)
                    .bind(file.size as i64)
                    .bind(&file.sha256)
                    .bind(file.kind.as_str())
                    .execute(&mut *tx)
                    .await?;
                }
                row
            }
            None => sqlx::query_as(
                &format!("SELECT {ARTIFACT_COLUMNS} FROM artifacts WHERE sha256 = $1"),
            )
            .bind(artifact.digest.as_str())
            .fetch_one(&mut *tx)
            .await?,
        };

        let updated: ReleaseRow = sqlx::query_as(
            &format!(
                "UPDATE skill_releases SET
                    artifact_id = $2, status = 'uploaded',
                    min_chengos_version = $3, max_chengos_version = $4, updated_at = now()
                 WHERE id = $1
                 RETURNING {RELEASE_COLUMNS}"
            ),
        )
        .bind(release_id)
        .bind(artifact_row.id)
        .bind(&artifact.minimum_chengos_version)
        .bind(&artifact.maximum_chengos_version)
        .fetch_one(&mut *tx)
        .await?;

        // Scan job commits with the release state — required work cannot be lost.
        insert_outbox_job(&mut *tx, &scan_job, 5).await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;

        Ok((updated.into_domain()?, artifact_row.into_domain()?))
    }

    async fn transition(
        &self,
        release_id: ReleaseId,
        expected_from: &[ReleaseStatus],
        to: ReleaseStatus,
        reason: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<Release> {
        let mut tx = self.pool.begin().await?;
        let current: Option<ReleaseRow> = sqlx::query_as(
            &format!("SELECT {RELEASE_COLUMNS} FROM skill_releases WHERE id = $1 FOR UPDATE"),
        )
        .bind(release_id)
        .fetch_optional(&mut *tx)
        .await?;
        let current = current.ok_or(RegistryError::NotFound("release"))?.into_domain()?;

        if !expected_from.contains(&current.status) {
            return Err(RegistryError::invalid_state(
                "RELEASE_STATE",
                format!(
                    "release is {}, expected one of {:?}",
                    current.status.as_str(),
                    expected_from.iter().map(|s| s.as_str()).collect::<Vec<_>>()
                ),
            ));
        }
        if !current.status.can_transition(to) {
            return Err(RegistryError::invalid_state(
                "ILLEGAL_TRANSITION",
                format!("{} -> {} is not a legal transition", current.status.as_str(), to.as_str()),
            ));
        }

        let updated: ReleaseRow = sqlx::query_as(
            &format!(
                "UPDATE skill_releases SET
                    status = $2,
                    published_at = CASE WHEN $2 = 'published' AND published_at IS NULL THEN now() ELSE published_at END,
                    yanked_at = CASE WHEN $2 = 'yanked' THEN now()
                                     WHEN $2 = 'published' THEN NULL
                                     ELSE yanked_at END,
                    yank_reason = CASE WHEN $2 = 'yanked' THEN $3
                                       WHEN $2 = 'published' THEN NULL
                                       ELSE yank_reason END,
                    quarantined_at = CASE WHEN $2 = 'quarantined' THEN now()
                                          WHEN $2 IN ('published', 'needs_review') THEN NULL
                                          ELSE quarantined_at END,
                    updated_at = now()
                 WHERE id = $1
                 RETURNING {RELEASE_COLUMNS}"
            ),
        )
        .bind(release_id)
        .bind(to.as_str())
        .bind(reason)
        .fetch_one(&mut *tx)
        .await?;

        // Keep the skill's denormalized latest-release columns fresh whenever
        // public visibility may have changed.
        if matches!(
            to,
            ReleaseStatus::Published | ReleaseStatus::Yanked | ReleaseStatus::Quarantined
        ) {
            refresh_skill_latest(&mut *tx, current.skill_id).await?;
        }

        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        updated.into_domain()
    }

    async fn list_by_status(&self, statuses: &[ReleaseStatus], page: PageRequest) -> Result<Page<Release>> {
        let status_strs: Vec<String> = statuses.iter().map(|s| s.as_str().to_string()).collect();
        let mut qb: QueryBuilder<Postgres> = QueryBuilder::new(format!(
            "SELECT {RELEASE_COLUMNS} FROM skill_releases WHERE status = ANY("
        ));
        qb.push_bind(status_strs).push(") ");
        if let Some(cursor) = &page.cursor {
            let ts = parse_cursor_timestamp(&cursor.k)?;
            qb.push(" AND (updated_at, id) > (")
                .push_bind(ts)
                .push(", ")
                .push_bind(cursor.id)
                .push(") ");
        }
        qb.push(" ORDER BY updated_at ASC, id ASC LIMIT ").push_bind(page.limit as i64 + 1);

        let rows: Vec<ReleaseRow> = qb.build_query_as().fetch_all(&self.pool).await?;
        let has_more = rows.len() > page.limit as usize;
        let mut items = Vec::with_capacity(rows.len().min(page.limit as usize));
        for row in rows.into_iter().take(page.limit as usize) {
            items.push(row.into_domain()?);
        }
        let next_cursor = if has_more {
            items.last().map(|last| {
                Cursor {
                    o: SortOrder::RecentlyUpdated.as_str().into(),
                    k: last.updated_at.timestamp_micros().to_string(),
                    id: last.id,
                }
                .encode()
            })
        } else {
            None
        };
        Ok(Page { items, next_cursor })
    }

    async fn stale_pending(&self, older_than: DateTime<Utc>, limit: i64) -> Result<Vec<Release>> {
        let rows: Vec<ReleaseRow> = sqlx::query_as(
            &format!(
                "SELECT {RELEASE_COLUMNS} FROM skill_releases
                 WHERE status = 'pending_upload' AND created_at < $1
                 ORDER BY created_at LIMIT $2"
            ),
        )
        .bind(older_than)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }
}

// ---------------------------------------------------------------------------
// ArtifactRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl ArtifactRepo for PgRepos {
    async fn get(&self, id: Uuid) -> Result<Option<Artifact>> {
        let row: Option<ArtifactRow> = sqlx::query_as(
            &format!("SELECT {ARTIFACT_COLUMNS} FROM artifacts WHERE id = $1"),
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn get_by_digest(&self, digest: &Digest) -> Result<Option<Artifact>> {
        let row: Option<ArtifactRow> = sqlx::query_as(
            &format!("SELECT {ARTIFACT_COLUMNS} FROM artifacts WHERE sha256 = $1"),
        )
        .bind(digest.as_str())
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn files(&self, artifact_id: Uuid) -> Result<Vec<ArtifactFileEntry>> {
        let rows: Vec<ArtifactFileRow> = sqlx::query_as(
            "SELECT path, size_bytes, sha256, kind FROM artifact_files WHERE artifact_id = $1 ORDER BY path",
        )
        .bind(artifact_id)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn scripts(&self, artifact_id: Uuid) -> Result<Vec<ScriptDeclaration>> {
        let row: Option<(serde_json::Value,)> =
            sqlx::query_as("SELECT scripts FROM artifacts WHERE id = $1")
                .bind(artifact_id)
                .fetch_optional(&self.pool)
                .await?;
        match row {
            Some((value,)) => Ok(serde_json::from_value(value).unwrap_or_default()),
            None => Ok(vec![]),
        }
    }

    async fn safety_summary(&self, artifact_id: Uuid) -> Result<Option<SafetySummary>> {
        let row: Option<(serde_json::Value,)> =
            sqlx::query_as("SELECT safety FROM artifacts WHERE id = $1")
                .bind(artifact_id)
                .fetch_optional(&self.pool)
                .await?;
        Ok(row.map(|(value,)| serde_json::from_value(value).unwrap_or_default()))
    }

    async fn unreferenced(&self, older_than: DateTime<Utc>, limit: i64) -> Result<Vec<Artifact>> {
        let rows: Vec<ArtifactRow> = sqlx::query_as(
            &format!(
                "SELECT {cols} FROM artifacts a
                 WHERE a.created_at < $1
                   AND NOT EXISTS (SELECT 1 FROM skill_releases r WHERE r.artifact_id = a.id)
                 ORDER BY a.created_at LIMIT $2",
                cols = "a.id, a.sha256, a.storage_key, a.media_type, a.size_bytes, a.expanded_bytes, a.file_count, a.created_at"
            ),
        )
        .bind(older_than)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn delete(&self, id: Uuid) -> Result<bool> {
        // Guarded delete: refuses when any release references the artifact.
        let result = sqlx::query(
            "DELETE FROM artifacts a WHERE a.id = $1
               AND NOT EXISTS (SELECT 1 FROM skill_releases r WHERE r.artifact_id = a.id)",
        )
        .bind(id)
        .execute(&self.pool)
        .await?;
        Ok(result.rows_affected() > 0)
    }

    async fn stats(&self) -> Result<(i64, i64)> {
        let row: (i64, Option<i64>) =
            sqlx::query_as("SELECT count(*), sum(size_bytes) FROM artifacts")
                .fetch_one(&self.pool)
                .await?;
        Ok((row.0, row.1.unwrap_or(0)))
    }
}

// ---------------------------------------------------------------------------
// ScanRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl ScanRepo for PgRepos {
    async fn insert_report(&self, report: &ScanReport) -> Result<ScanReportId> {
        let mut tx = self.pool.begin().await?;
        let row = sqlx::query(
            "INSERT INTO scan_reports (release_id, artifact_id, scanner_name, scanner_version,
                                       policy_version, conclusion, started_at, finished_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id",
        )
        .bind(report.release_id)
        .bind(report.artifact_id)
        .bind(&report.scanner_name)
        .bind(&report.scanner_version)
        .bind(&report.policy_version)
        .bind(report.conclusion.as_str())
        .bind(report.started_at)
        .bind(report.finished_at)
        .fetch_one(&mut *tx)
        .await?;
        let report_id: Uuid = row.get("id");
        for finding in &report.findings {
            sqlx::query(
                "INSERT INTO scan_findings (report_id, kind, severity, code, message, path, line, excerpt)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            )
            .bind(report_id)
            .bind(finding.kind.as_str())
            .bind(finding.severity.as_str())
            .bind(&finding.code)
            .bind(&finding.message)
            .bind(&finding.path)
            .bind(finding.line.map(|l| l as i32))
            .bind(&finding.excerpt)
            .execute(&mut *tx)
            .await?;
        }
        tx.commit().await?;
        Ok(report_id)
    }

    async fn latest_for_release(&self, release_id: ReleaseId) -> Result<Option<ScanReport>> {
        let reports = load_reports(&self.pool, release_id, Some(1)).await?;
        Ok(reports.into_iter().next())
    }

    async fn list_for_release(&self, release_id: ReleaseId) -> Result<Vec<ScanReport>> {
        load_reports(&self.pool, release_id, None).await
    }

    async fn releases_behind_policy(&self, policy_version: &str, limit: i64) -> Result<Vec<ReleaseId>> {
        let rows: Vec<(Uuid,)> = sqlx::query_as(
            "SELECT r.id FROM skill_releases r
             WHERE r.status IN ('published', 'approved', 'needs_review', 'yanked')
               AND NOT EXISTS (
                   SELECT 1 FROM scan_reports s
                   WHERE s.release_id = r.id AND s.policy_version = $1)
             LIMIT $2",
        )
        .bind(policy_version)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows.into_iter().map(|(id,)| id).collect())
    }
}

async fn load_reports(pool: &PgPool, release_id: ReleaseId, limit: Option<i64>) -> Result<Vec<ScanReport>> {
    let mut sql = String::from(
        "SELECT id, release_id, artifact_id, scanner_name, scanner_version, policy_version,
                conclusion, started_at, finished_at
         FROM scan_reports WHERE release_id = $1 ORDER BY finished_at DESC",
    );
    if limit.is_some() {
        sql.push_str(" LIMIT $2");
    }
    let mut query = sqlx::query(&sql).bind(release_id);
    if let Some(limit) = limit {
        query = query.bind(limit);
    }
    let rows = query.fetch_all(pool).await?;

    let mut reports = Vec::with_capacity(rows.len());
    for row in rows {
        let id: Uuid = row.get("id");
        let conclusion_raw: String = row.get("conclusion");
        let findings_rows = sqlx::query(
            "SELECT kind, severity, code, message, path, line, excerpt
             FROM scan_findings WHERE report_id = $1 ORDER BY id",
        )
        .bind(id)
        .fetch_all(pool)
        .await?;
        let mut findings = Vec::with_capacity(findings_rows.len());
        for f in findings_rows {
            let kind_raw: String = f.get("kind");
            let severity_raw: String = f.get("severity");
            findings.push(ScanFinding {
                kind: FindingKind::parse(&kind_raw).unwrap_or(FindingKind::PolicyViolation),
                severity: Severity::parse(&severity_raw).unwrap_or(Severity::Medium),
                code: f.get("code"),
                message: f.get("message"),
                path: f.get("path"),
                line: f.get::<Option<i32>, _>("line").map(|l| l as u32),
                excerpt: f.get("excerpt"),
            });
        }
        reports.push(ScanReport {
            id,
            release_id: row.get("release_id"),
            artifact_id: row.get("artifact_id"),
            scanner_name: row.get("scanner_name"),
            scanner_version: row.get("scanner_version"),
            policy_version: row.get("policy_version"),
            conclusion: ScanConclusion::parse(&conclusion_raw).unwrap_or(ScanConclusion::Error),
            started_at: row.get("started_at"),
            finished_at: row.get("finished_at"),
            findings,
        });
    }
    Ok(reports)
}

// ---------------------------------------------------------------------------
// ModerationRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl ModerationRepo for PgRepos {
    async fn create_report(&self, report: &AbuseReport) -> Result<Uuid> {
        let row = sqlx::query(
            "INSERT INTO reports (skill_id, release_id, reason, details, contact)
             VALUES ($1, $2, $3, $4, $5) RETURNING id",
        )
        .bind(report.skill_id)
        .bind(report.release_id)
        .bind(&report.reason)
        .bind(&report.details)
        .bind(&report.contact)
        .fetch_one(&self.pool)
        .await?;
        Ok(row.get("id"))
    }

    async fn get_report(&self, id: Uuid) -> Result<Option<AbuseReport>> {
        let row: Option<ReportRow> = sqlx::query_as("SELECT * FROM reports WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;
        row.map(|r| r.into_domain()).transpose()
    }

    async fn list_reports(&self, status: Option<ReportStatus>, page: PageRequest) -> Result<Page<AbuseReport>> {
        let mut qb: QueryBuilder<Postgres> = QueryBuilder::new("SELECT * FROM reports WHERE 1=1 ");
        if let Some(status) = status {
            qb.push(" AND status = ").push_bind(status.as_str().to_string());
        }
        if let Some(cursor) = &page.cursor {
            let ts = parse_cursor_timestamp(&cursor.k)?;
            qb.push(" AND (created_at, id) > (")
                .push_bind(ts)
                .push(", ")
                .push_bind(cursor.id)
                .push(") ");
        }
        qb.push(" ORDER BY created_at ASC, id ASC LIMIT ").push_bind(page.limit as i64 + 1);
        let rows: Vec<ReportRow> = qb.build_query_as().fetch_all(&self.pool).await?;
        let has_more = rows.len() > page.limit as usize;
        let mut items = Vec::with_capacity(rows.len().min(page.limit as usize));
        for row in rows.into_iter().take(page.limit as usize) {
            items.push(row.into_domain()?);
        }
        let next_cursor = if has_more {
            items.last().map(|last| {
                Cursor {
                    o: SortOrder::RecentlyUpdated.as_str().into(),
                    k: last.created_at.timestamp_micros().to_string(),
                    id: last.id,
                }
                .encode()
            })
        } else {
            None
        };
        Ok(Page { items, next_cursor })
    }

    async fn set_report_status(&self, id: Uuid, status: ReportStatus, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool.begin().await?;
        let result = sqlx::query(
            "UPDATE reports SET status = $2,
                    resolved_at = CASE WHEN $2 = 'open' THEN NULL ELSE now() END
             WHERE id = $1",
        )
        .bind(id)
        .bind(status.as_str())
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(result.rows_affected() > 0)
    }

    async fn record_action(&self, action: &ModerationAction, audit: NewAuditEvent) -> Result<()> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            "INSERT INTO moderation_actions (kind, actor, skill_id, release_id, publisher_id, report_id, reason)
             VALUES ($1, $2, $3, $4, $5, $6, $7)",
        )
        .bind(action.kind.as_str())
        .bind(&action.actor)
        .bind(action.skill_id)
        .bind(action.release_id)
        .bind(action.publisher_id)
        .bind(action.report_id)
        .bind(&action.reason)
        .execute(&mut *tx)
        .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// AuditRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl AuditRepo for PgRepos {
    async fn append(&self, event: NewAuditEvent) -> Result<()> {
        insert_audit(&self.pool, &event).await
    }

    async fn list_for_subject(&self, subject_type: &str, subject_id: &str, limit: i64) -> Result<Vec<AuditEvent>> {
        let rows: Vec<AuditEventRow> = sqlx::query_as(
            "SELECT * FROM audit_events WHERE subject_type = $1 AND subject_id = $2
             ORDER BY created_at DESC LIMIT $3",
        )
        .bind(subject_type)
        .bind(subject_id)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows.into_iter().map(|r| r.into_domain()).collect())
    }
}

// ---------------------------------------------------------------------------
// DownloadStatsRepo
// ---------------------------------------------------------------------------

#[async_trait]
impl DownloadStatsRepo for PgRepos {
    async fn add_daily_counts(
        &self,
        day: chrono::NaiveDate,
        batch_id: &str,
        counts: &[(ReleaseId, i64)],
    ) -> Result<()> {
        let mut tx = self.pool.begin().await?;
        let inserted = sqlx::query(
            "INSERT INTO download_counter_batches (batch_id) VALUES ($1) ON CONFLICT DO NOTHING",
        )
        .bind(batch_id)
        .execute(&mut *tx)
        .await?;
        if inserted.rows_affected() == 0 {
            // Batch already applied — idempotent no-op.
            tx.rollback().await.ok();
            return Ok(());
        }
        for (release_id, count) in counts {
            if *count <= 0 {
                continue;
            }
            let upserted = sqlx::query(
                "INSERT INTO download_events_daily (release_id, day, downloads)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (release_id, day) DO UPDATE
                 SET downloads = download_events_daily.downloads + EXCLUDED.downloads",
            )
            .bind(release_id)
            .bind(day)
            .bind(count)
            .execute(&mut *tx)
            .await;
            match upserted {
                Ok(_) => {
                    sqlx::query(
                        "UPDATE skills s SET downloads_total = s.downloads_total + $2
                         FROM skill_releases r WHERE r.id = $1 AND s.id = r.skill_id",
                    )
                    .bind(release_id)
                    .bind(count)
                    .execute(&mut *tx)
                    .await?;
                }
                // A release deleted between counting and flush is not an error.
                Err(sqlx::Error::Database(db)) if db.is_foreign_key_violation() => continue,
                Err(e) => return Err(e.into()),
            }
        }
        tx.commit().await?;
        Ok(())
    }

    async fn totals_for_skills(&self, skill_ids: &[SkillId]) -> Result<HashMap<SkillId, i64>> {
        let rows: Vec<(Uuid, i64)> = sqlx::query_as(
            "SELECT r.skill_id, COALESCE(SUM(d.downloads), 0)::bigint
             FROM skill_releases r
             JOIN download_events_daily d ON d.release_id = r.id
             WHERE r.skill_id = ANY($1)
             GROUP BY r.skill_id",
        )
        .bind(skill_ids)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows.into_iter().collect())
    }

    async fn total_for_release(&self, release_id: ReleaseId) -> Result<i64> {
        let row: (Option<i64>,) = sqlx::query_as(
            "SELECT SUM(downloads)::bigint FROM download_events_daily WHERE release_id = $1",
        )
        .bind(release_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(row.0.unwrap_or(0))
    }
}
