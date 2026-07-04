//! PostgreSQL implementations of the identity repository ports.
//!
//! Composite operations (create-or-link login, refresh rotation, role
//! changes) run in explicit transactions; privileged changes write their
//! audit event in the same transaction.

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::Row;
use uuid::Uuid;

use crate::domain::identity::{
    AccessToken, AuthProvider, ChengHubUser, DeviceAuthId, DeviceAuthorization, ExternalIdentity,
    ExternalUserProfile, IdentityId, RefreshToken, TokenId, UserId, UserSession,
};
use crate::domain::moderation::NewAuditEvent;
use crate::domain::pagination::{Cursor, Page, PageRequest};
use crate::domain::roles::{Role, RoleSet};
use crate::error::Result;
use crate::ports::identity_repository::*;

use super::models::*;
use super::{insert_audit, PgRepos};

#[async_trait]
impl UserRepo for PgRepos {
    async fn get(&self, id: UserId) -> Result<Option<ChengHubUser>> {
        let row: Option<UserRow> = sqlx::query_as(&format!(
            "SELECT {USER_COLUMNS} FROM chenghub_users WHERE id = $1"
        ))
        .bind(id)
        .fetch_optional(self.pool())
        .await?;
        Ok(row.map(UserRow::into_domain))
    }

    async fn get_by_username(&self, username: &str) -> Result<Option<ChengHubUser>> {
        let row: Option<UserRow> = sqlx::query_as(&format!(
            "SELECT {USER_COLUMNS} FROM chenghub_users WHERE username = $1"
        ))
        .bind(username)
        .fetch_optional(self.pool())
        .await?;
        Ok(row.map(UserRow::into_domain))
    }

    async fn create(&self, username: &str, display_name: &str) -> Result<ChengHubUser> {
        let row: UserRow = sqlx::query_as(&format!(
            "INSERT INTO chenghub_users (username, display_name) VALUES ($1, $2)
             RETURNING {USER_COLUMNS}"
        ))
        .bind(username)
        .bind(display_name)
        .fetch_one(self.pool())
        .await?;
        Ok(row.into_domain())
    }

    async fn roles(&self, id: UserId) -> Result<RoleSet> {
        let rows: Vec<(String,)> =
            sqlx::query_as("SELECT role FROM user_roles WHERE user_id = $1")
                .bind(id)
                .fetch_all(self.pool())
                .await?;
        Ok(RoleSet(rows.iter().filter_map(|(r,)| Role::parse(r)).collect()))
    }

    async fn grant_role(
        &self,
        user_id: UserId,
        role: Role,
        granted_by: Option<UserId>,
        audit: NewAuditEvent,
    ) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let inserted = sqlx::query(
            "INSERT INTO user_roles (user_id, role, granted_by) VALUES ($1, $2, $3)
             ON CONFLICT (user_id, role) DO NOTHING",
        )
        .bind(user_id)
        .bind(role.as_str())
        .bind(granted_by)
        .execute(&mut *tx)
        .await?
        .rows_affected()
            > 0;
        if inserted {
            insert_audit(&mut *tx, &audit).await?;
        }
        tx.commit().await?;
        Ok(inserted)
    }

    async fn revoke_role(&self, user_id: UserId, role: Role, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let removed = sqlx::query("DELETE FROM user_roles WHERE user_id = $1 AND role = $2")
            .bind(user_id)
            .bind(role.as_str())
            .execute(&mut *tx)
            .await?
            .rows_affected()
            > 0;
        if removed {
            insert_audit(&mut *tx, &audit).await?;
        }
        tx.commit().await?;
        Ok(removed)
    }

    async fn list(&self, query: Option<&str>, page: PageRequest) -> Result<Page<ChengHubUser>> {
        let (cursor_time, cursor_id) = decode_time_cursor(&page, "newest")?;
        let pattern = query.map(|q| format!("%{}%", q.replace('%', "\\%").replace('_', "\\_")));
        let rows: Vec<UserRow> = sqlx::query_as(&format!(
            "SELECT {USER_COLUMNS} FROM chenghub_users
             WHERE ($1::text IS NULL OR username ILIKE $1 OR display_name ILIKE $1)
               AND ($2::timestamptz IS NULL OR (created_at, id) < ($2, $3))
             ORDER BY created_at DESC, id DESC
             LIMIT $4"
        ))
        .bind(&pattern)
        .bind(cursor_time)
        .bind(cursor_id)
        .bind(page.limit as i64 + 1)
        .fetch_all(self.pool())
        .await?;

        let mut items: Vec<ChengHubUser> = rows.into_iter().map(UserRow::into_domain).collect();
        let next_cursor = if items.len() > page.limit as usize {
            items.truncate(page.limit as usize);
            items.last().map(|u| {
                Cursor {
                    o: "newest".into(),
                    k: u.created_at.timestamp_micros().to_string(),
                    id: u.id,
                }
                .encode()
            })
        } else {
            None
        };
        Ok(Page { items, next_cursor })
    }
}

/// Decode a `(timestamp, id)` cursor for time-ordered listings.
pub(crate) fn decode_time_cursor(
    page: &PageRequest,
    order: &str,
) -> Result<(Option<DateTime<Utc>>, Option<Uuid>)> {
    match &page.cursor {
        None => Ok((None, None)),
        Some(c) => {
            if c.o != order {
                return Err(crate::error::HubError::validation(
                    crate::error::codes::INVALID_CURSOR,
                    "cursor does not match the requested sort order",
                ));
            }
            let micros: i64 = c.k.parse().map_err(|_| {
                crate::error::HubError::validation(
                    crate::error::codes::INVALID_CURSOR,
                    "invalid cursor key",
                )
            })?;
            let ts = DateTime::<Utc>::from_timestamp_micros(micros).ok_or_else(|| {
                crate::error::HubError::validation(
                    crate::error::codes::INVALID_CURSOR,
                    "invalid cursor timestamp",
                )
            })?;
            Ok((Some(ts), Some(c.id)))
        }
    }
}

#[async_trait]
impl IdentityRepo for PgRepos {
    async fn find_by_subject(
        &self,
        provider: AuthProvider,
        subject: &str,
    ) -> Result<Option<ExternalIdentity>> {
        let row: Option<IdentityRow> = sqlx::query_as(&format!(
            "SELECT {IDENTITY_COLUMNS} FROM external_identities
             WHERE provider = $1 AND provider_subject = $2"
        ))
        .bind(provider.as_str())
        .bind(subject)
        .fetch_optional(self.pool())
        .await?;
        row.map(IdentityRow::into_domain).transpose()
    }

    async fn list_for_user(&self, user_id: UserId) -> Result<Vec<ExternalIdentity>> {
        let rows: Vec<IdentityRow> = sqlx::query_as(&format!(
            "SELECT {IDENTITY_COLUMNS} FROM external_identities
             WHERE user_id = $1 ORDER BY created_at"
        ))
        .bind(user_id)
        .fetch_all(self.pool())
        .await?;
        rows.into_iter().map(IdentityRow::into_domain).collect()
    }

    async fn count_for_user(&self, user_id: UserId) -> Result<i64> {
        let (count,): (i64,) =
            sqlx::query_as("SELECT count(*) FROM external_identities WHERE user_id = $1")
                .bind(user_id)
                .fetch_one(self.pool())
                .await?;
        Ok(count)
    }

    async fn create_user_with_identity(
        &self,
        username: &str,
        profile: &ExternalUserProfile,
    ) -> Result<(ChengHubUser, ExternalIdentity)> {
        let mut tx = self.pool().begin().await?;
        let display_name = profile
            .display_name
            .clone()
            .or_else(|| profile.username_hint.clone())
            .unwrap_or_else(|| username.to_string());
        let user: UserRow = sqlx::query_as(&format!(
            "INSERT INTO chenghub_users (username, display_name, avatar_url, email)
             VALUES ($1, $2, $3, $4) RETURNING {USER_COLUMNS}"
        ))
        .bind(username)
        .bind(&display_name)
        .bind(&profile.avatar_url)
        .bind(&profile.email)
        .fetch_one(&mut *tx)
        .await?;

        let identity: IdentityRow = sqlx::query_as(&format!(
            "INSERT INTO external_identities
                (user_id, provider, provider_subject, display_name, avatar_url, email, profile)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING {IDENTITY_COLUMNS}"
        ))
        .bind(user.id)
        .bind(profile.provider.as_str())
        .bind(&profile.subject)
        .bind(&profile.display_name)
        .bind(&profile.avatar_url)
        .bind(&profile.email)
        .bind(&profile.profile)
        .fetch_one(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok((user.into_domain(), identity.into_domain()?))
    }

    async fn link_identity(
        &self,
        user_id: UserId,
        profile: &ExternalUserProfile,
    ) -> Result<ExternalIdentity> {
        let identity: IdentityRow = sqlx::query_as(&format!(
            "INSERT INTO external_identities
                (user_id, provider, provider_subject, display_name, avatar_url, email, profile)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING {IDENTITY_COLUMNS}"
        ))
        .bind(user_id)
        .bind(profile.provider.as_str())
        .bind(&profile.subject)
        .bind(&profile.display_name)
        .bind(&profile.avatar_url)
        .bind(&profile.email)
        .bind(&profile.profile)
        .fetch_one(self.pool())
        .await?;
        identity.into_domain()
    }

    async fn touch_login(
        &self,
        identity_id: IdentityId,
        profile: &ExternalUserProfile,
    ) -> Result<()> {
        sqlx::query(
            "UPDATE external_identities SET
                display_name = COALESCE($2, display_name),
                avatar_url = COALESCE($3, avatar_url),
                email = COALESCE($4, email),
                profile = $5,
                last_login_at = now()
             WHERE id = $1",
        )
        .bind(identity_id)
        .bind(&profile.display_name)
        .bind(&profile.avatar_url)
        .bind(&profile.email)
        .bind(&profile.profile)
        .execute(self.pool())
        .await?;
        Ok(())
    }

    async fn unlink(&self, user_id: UserId, identity_id: IdentityId) -> Result<bool> {
        let affected =
            sqlx::query("DELETE FROM external_identities WHERE id = $1 AND user_id = $2")
                .bind(identity_id)
                .bind(user_id)
                .execute(self.pool())
                .await?
                .rows_affected();
        Ok(affected > 0)
    }
}

#[async_trait]
impl SessionRepo for PgRepos {
    async fn create(
        &self,
        user_id: UserId,
        session_hash: &str,
        ttl_secs: u64,
        user_agent: Option<&str>,
        ip: Option<&str>,
    ) -> Result<UserSession> {
        let row: SessionRow = sqlx::query_as(
            "INSERT INTO browser_sessions (user_id, session_hash, user_agent, ip, expires_at)
             VALUES ($1, $2, $3, $4, now() + make_interval(secs => $5))
             RETURNING id, user_id, created_at, last_seen_at, expires_at, revoked_at",
        )
        .bind(user_id)
        .bind(session_hash)
        .bind(user_agent)
        .bind(ip)
        .bind(ttl_secs as f64)
        .fetch_one(self.pool())
        .await?;
        Ok(row.into_domain())
    }

    async fn find_valid(&self, session_hash: &str, ttl_secs: u64) -> Result<Option<UserSession>> {
        // Sliding window: touching last_seen_at also extends expiry.
        let row: Option<SessionRow> = sqlx::query_as(
            "UPDATE browser_sessions
             SET last_seen_at = now(), expires_at = now() + make_interval(secs => $2)
             WHERE session_hash = $1 AND revoked_at IS NULL AND expires_at > now()
             RETURNING id, user_id, created_at, last_seen_at, expires_at, revoked_at",
        )
        .bind(session_hash)
        .bind(ttl_secs as f64)
        .fetch_optional(self.pool())
        .await?;
        Ok(row.map(SessionRow::into_domain))
    }

    async fn revoke(&self, session_hash: &str) -> Result<bool> {
        let affected = sqlx::query(
            "UPDATE browser_sessions SET revoked_at = now()
             WHERE session_hash = $1 AND revoked_at IS NULL",
        )
        .bind(session_hash)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected > 0)
    }

    async fn revoke_all_for_user(&self, user_id: UserId) -> Result<u64> {
        let affected = sqlx::query(
            "UPDATE browser_sessions SET revoked_at = now()
             WHERE user_id = $1 AND revoked_at IS NULL",
        )
        .bind(user_id)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected)
    }
}

#[async_trait]
impl TokenRepo for PgRepos {
    async fn issue_pair(
        &self,
        user_id: UserId,
        label: &str,
        scopes: &[String],
        access_hash: &str,
        refresh_hash: &str,
        access_ttl_secs: u64,
        refresh_ttl_secs: u64,
    ) -> Result<(AccessToken, RefreshToken)> {
        let mut tx = self.pool().begin().await?;
        let access: AccessTokenRow = sqlx::query_as(&format!(
            "INSERT INTO access_tokens (user_id, token_hash, label, scopes, expires_at)
             VALUES ($1, $2, $3, $4, now() + make_interval(secs => $5))
             RETURNING {ACCESS_TOKEN_COLUMNS}"
        ))
        .bind(user_id)
        .bind(access_hash)
        .bind(label)
        .bind(scopes)
        .bind(access_ttl_secs as f64)
        .fetch_one(&mut *tx)
        .await?;

        let refresh: RefreshTokenRow = sqlx::query_as(
            "INSERT INTO refresh_tokens (user_id, access_token_id, token_hash, expires_at)
             VALUES ($1, $2, $3, now() + make_interval(secs => $4))
             RETURNING id, user_id, access_token_id, created_at, expires_at, revoked_at, rotated_to",
        )
        .bind(user_id)
        .bind(access.id)
        .bind(refresh_hash)
        .bind(refresh_ttl_secs as f64)
        .fetch_one(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok((access.into_domain(), refresh.into_domain()))
    }

    async fn find_valid_access(&self, token_hash: &str) -> Result<Option<AccessToken>> {
        let row: Option<AccessTokenRow> = sqlx::query_as(&format!(
            "UPDATE access_tokens SET last_used_at = now()
             WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()
             RETURNING {ACCESS_TOKEN_COLUMNS}"
        ))
        .bind(token_hash)
        .fetch_optional(self.pool())
        .await?;
        Ok(row.map(AccessTokenRow::into_domain))
    }

    async fn rotate_refresh(
        &self,
        refresh_hash: &str,
        new_access_hash: &str,
        new_refresh_hash: &str,
        access_ttl_secs: u64,
        refresh_ttl_secs: u64,
    ) -> Result<Option<(AccessToken, RefreshToken)>> {
        let mut tx = self.pool().begin().await?;

        // Lock the presented refresh token row to serialize concurrent
        // rotation attempts with the same token.
        let old: Option<RefreshTokenRow> = sqlx::query_as(
            "SELECT id, user_id, access_token_id, created_at, expires_at, revoked_at, rotated_to
             FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE",
        )
        .bind(refresh_hash)
        .fetch_optional(&mut *tx)
        .await?;
        let Some(old) = old else {
            tx.rollback().await?;
            return Ok(None);
        };
        if old.revoked_at.is_some() || old.expires_at <= Utc::now() {
            tx.rollback().await?;
            return Ok(None);
        }

        // Revoke the old pair.
        sqlx::query("UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1")
            .bind(old.id)
            .execute(&mut *tx)
            .await?;
        if let Some(access_id) = old.access_token_id {
            sqlx::query(
                "UPDATE access_tokens SET revoked_at = now()
                 WHERE id = $1 AND revoked_at IS NULL",
            )
            .bind(access_id)
            .execute(&mut *tx)
            .await?;
        }

        // Issue the new pair, inheriting label/scopes from the old access
        // token when it still exists (cleanup may have removed it).
        let inherited: Option<AccessTokenRow> = sqlx::query_as(&format!(
            "INSERT INTO access_tokens (user_id, token_hash, label, scopes, expires_at)
             SELECT $1, $2, label, scopes, now() + make_interval(secs => $3)
             FROM access_tokens WHERE id = $4
             RETURNING {ACCESS_TOKEN_COLUMNS}"
        ))
        .bind(old.user_id)
        .bind(new_access_hash)
        .bind(access_ttl_secs as f64)
        .bind(old.access_token_id)
        .fetch_optional(&mut *tx)
        .await?;
        let access: AccessTokenRow = match inherited {
            Some(row) => row,
            None => {
                sqlx::query_as(&format!(
                    "INSERT INTO access_tokens (user_id, token_hash, label, expires_at)
                     VALUES ($1, $2, 'refreshed', now() + make_interval(secs => $3))
                     RETURNING {ACCESS_TOKEN_COLUMNS}"
                ))
                .bind(old.user_id)
                .bind(new_access_hash)
                .bind(access_ttl_secs as f64)
                .fetch_one(&mut *tx)
                .await?
            }
        };

        let refresh: RefreshTokenRow = sqlx::query_as(
            "INSERT INTO refresh_tokens (user_id, access_token_id, token_hash, expires_at)
             VALUES ($1, $2, $3, now() + make_interval(secs => $4))
             RETURNING id, user_id, access_token_id, created_at, expires_at, revoked_at, rotated_to",
        )
        .bind(old.user_id)
        .bind(access.id)
        .bind(new_refresh_hash)
        .bind(refresh_ttl_secs as f64)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query("UPDATE refresh_tokens SET rotated_to = $2 WHERE id = $1")
            .bind(old.id)
            .bind(refresh.id)
            .execute(&mut *tx)
            .await?;

        tx.commit().await?;
        Ok(Some((access.into_domain(), refresh.into_domain())))
    }

    async fn list_access_for_user(&self, user_id: UserId) -> Result<Vec<AccessToken>> {
        let rows: Vec<AccessTokenRow> = sqlx::query_as(&format!(
            "SELECT {ACCESS_TOKEN_COLUMNS} FROM access_tokens
             WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > now()
             ORDER BY created_at DESC"
        ))
        .bind(user_id)
        .fetch_all(self.pool())
        .await?;
        Ok(rows.into_iter().map(AccessTokenRow::into_domain).collect())
    }

    async fn revoke_access(&self, user_id: UserId, token_id: TokenId) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let affected = sqlx::query(
            "UPDATE access_tokens SET revoked_at = now()
             WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL",
        )
        .bind(token_id)
        .bind(user_id)
        .execute(&mut *tx)
        .await?
        .rows_affected();
        if affected > 0 {
            sqlx::query(
                "UPDATE refresh_tokens SET revoked_at = now()
                 WHERE access_token_id = $1 AND revoked_at IS NULL",
            )
            .bind(token_id)
            .execute(&mut *tx)
            .await?;
        }
        tx.commit().await?;
        Ok(affected > 0)
    }

    async fn revoke_refresh(&self, refresh_hash: &str) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let row: Option<(Uuid, Option<Uuid>)> = sqlx::query_as(
            "UPDATE refresh_tokens SET revoked_at = now()
             WHERE token_hash = $1 AND revoked_at IS NULL
             RETURNING id, access_token_id",
        )
        .bind(refresh_hash)
        .fetch_optional(&mut *tx)
        .await?;
        if let Some((_, Some(access_id))) = &row {
            sqlx::query(
                "UPDATE access_tokens SET revoked_at = now()
                 WHERE id = $1 AND revoked_at IS NULL",
            )
            .bind(access_id)
            .execute(&mut *tx)
            .await?;
        }
        tx.commit().await?;
        Ok(row.is_some())
    }

    async fn revoke_all_for_user(&self, user_id: UserId) -> Result<u64> {
        let mut tx = self.pool().begin().await?;
        let a = sqlx::query(
            "UPDATE access_tokens SET revoked_at = now()
             WHERE user_id = $1 AND revoked_at IS NULL",
        )
        .bind(user_id)
        .execute(&mut *tx)
        .await?
        .rows_affected();
        let r = sqlx::query(
            "UPDATE refresh_tokens SET revoked_at = now()
             WHERE user_id = $1 AND revoked_at IS NULL",
        )
        .bind(user_id)
        .execute(&mut *tx)
        .await?
        .rows_affected();
        tx.commit().await?;
        Ok(a + r)
    }
}

#[async_trait]
impl DeviceAuthRepo for PgRepos {
    async fn create(
        &self,
        device_code_hash: &str,
        user_code: &str,
        client_name: &str,
        scopes: &[String],
        interval_secs: i32,
        ttl_secs: u64,
    ) -> Result<DeviceAuthorization> {
        let row: DeviceAuthRow = sqlx::query_as(&format!(
            "INSERT INTO device_authorizations
                (device_code_hash, user_code, client_name, scopes, interval_secs, expires_at)
             VALUES ($1, $2, $3, $4, $5, now() + make_interval(secs => $6))
             RETURNING {DEVICE_AUTH_COLUMNS}"
        ))
        .bind(device_code_hash)
        .bind(user_code)
        .bind(client_name)
        .bind(scopes)
        .bind(interval_secs)
        .bind(ttl_secs as f64)
        .fetch_one(self.pool())
        .await?;
        row.into_domain()
    }

    async fn find_by_device_hash(
        &self,
        device_code_hash: &str,
    ) -> Result<Option<DeviceAuthorization>> {
        let row: Option<DeviceAuthRow> = sqlx::query_as(&format!(
            "SELECT {DEVICE_AUTH_COLUMNS} FROM device_authorizations WHERE device_code_hash = $1"
        ))
        .bind(device_code_hash)
        .fetch_optional(self.pool())
        .await?;
        row.map(DeviceAuthRow::into_domain).transpose()
    }

    async fn find_by_user_code(&self, user_code: &str) -> Result<Option<DeviceAuthorization>> {
        let row: Option<DeviceAuthRow> = sqlx::query_as(&format!(
            "SELECT {DEVICE_AUTH_COLUMNS} FROM device_authorizations WHERE user_code = $1"
        ))
        .bind(user_code)
        .fetch_optional(self.pool())
        .await?;
        row.map(DeviceAuthRow::into_domain).transpose()
    }

    async fn record_poll(&self, id: DeviceAuthId) -> Result<Option<DateTime<Utc>>> {
        let row = sqlx::query(
            "UPDATE device_authorizations d SET last_polled_at = now()
             FROM (SELECT last_polled_at FROM device_authorizations WHERE id = $1) old
             WHERE d.id = $1
             RETURNING old.last_polled_at",
        )
        .bind(id)
        .fetch_optional(self.pool())
        .await?;
        Ok(row.and_then(|r| r.get::<Option<DateTime<Utc>>, _>("last_polled_at")))
    }

    async fn approve(&self, id: DeviceAuthId, user_id: UserId) -> Result<bool> {
        let affected = sqlx::query(
            "UPDATE device_authorizations
             SET status = 'approved', user_id = $2, approved_at = now()
             WHERE id = $1 AND status = 'pending' AND expires_at > now()",
        )
        .bind(id)
        .bind(user_id)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected > 0)
    }

    async fn deny(&self, id: DeviceAuthId) -> Result<bool> {
        let affected = sqlx::query(
            "UPDATE device_authorizations SET status = 'denied'
             WHERE id = $1 AND status = 'pending'",
        )
        .bind(id)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected > 0)
    }

    async fn consume(&self, id: DeviceAuthId) -> Result<bool> {
        let affected = sqlx::query(
            "UPDATE device_authorizations SET status = 'consumed'
             WHERE id = $1 AND status = 'approved'",
        )
        .bind(id)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected > 0)
    }

    async fn mark_expired(&self, id: DeviceAuthId) -> Result<()> {
        sqlx::query(
            "UPDATE device_authorizations SET status = 'expired'
             WHERE id = $1 AND status = 'pending'",
        )
        .bind(id)
        .execute(self.pool())
        .await?;
        Ok(())
    }
}

#[async_trait]
impl IdentityCleanup for PgRepos {
    async fn cleanup_expired(&self) -> Result<u64> {
        let mut removed = 0u64;
        removed += sqlx::query(
            "DELETE FROM browser_sessions WHERE expires_at < now() - interval '7 days'",
        )
        .execute(self.pool())
        .await?
        .rows_affected();
        removed += sqlx::query(
            "DELETE FROM access_tokens WHERE expires_at < now() - interval '7 days'",
        )
        .execute(self.pool())
        .await?
        .rows_affected();
        removed += sqlx::query(
            "DELETE FROM refresh_tokens WHERE expires_at < now() - interval '7 days'",
        )
        .execute(self.pool())
        .await?
        .rows_affected();
        removed += sqlx::query(
            "DELETE FROM device_authorizations WHERE expires_at < now() - interval '1 day'",
        )
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(removed)
    }
}
