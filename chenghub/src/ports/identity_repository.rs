//! Repository traits for the identity module: users, external identities,
//! sessions, tokens, roles, and device authorizations.
//!
//! All lookups take *hashes*, never raw tokens. Composite operations
//! (create-or-link login, refresh rotation) are transactional inside the
//! implementation.

use async_trait::async_trait;
use chrono::{DateTime, Utc};

use crate::domain::identity::{
    AccessToken, AuthProvider, ChengHubUser, DeviceAuthId, DeviceAuthorization, ExternalIdentity,
    ExternalUserProfile, IdentityId, RefreshToken, TokenId, UserId, UserSession,
};
use crate::domain::moderation::NewAuditEvent;
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::roles::{Role, RoleSet};
use crate::error::Result;

#[async_trait]
pub trait UserRepo: Send + Sync {
    async fn get(&self, id: UserId) -> Result<Option<ChengHubUser>>;
    async fn get_by_username(&self, username: &str) -> Result<Option<ChengHubUser>>;
    /// Direct creation (CLI bootstrap). OAuth users arrive via `IdentityRepo`.
    async fn create(&self, username: &str, display_name: &str) -> Result<ChengHubUser>;
    async fn roles(&self, id: UserId) -> Result<RoleSet>;
    async fn grant_role(
        &self,
        user_id: UserId,
        role: Role,
        granted_by: Option<UserId>,
        audit: NewAuditEvent,
    ) -> Result<bool>;
    async fn revoke_role(&self, user_id: UserId, role: Role, audit: NewAuditEvent) -> Result<bool>;
    /// Admin user directory: optional username/display-name substring query,
    /// newest first.
    async fn list(&self, query: Option<&str>, page: PageRequest) -> Result<Page<ChengHubUser>>;
}

#[async_trait]
pub trait IdentityRepo: Send + Sync {
    async fn find_by_subject(
        &self,
        provider: AuthProvider,
        subject: &str,
    ) -> Result<Option<ExternalIdentity>>;
    async fn list_for_user(&self, user_id: UserId) -> Result<Vec<ExternalIdentity>>;
    async fn count_for_user(&self, user_id: UserId) -> Result<i64>;
    /// Create a new user and bind the identity in one transaction. The
    /// username must already be de-duplicated by the caller.
    async fn create_user_with_identity(
        &self,
        username: &str,
        profile: &ExternalUserProfile,
    ) -> Result<(ChengHubUser, ExternalIdentity)>;
    /// Bind an additional identity to an existing user.
    async fn link_identity(
        &self,
        user_id: UserId,
        profile: &ExternalUserProfile,
    ) -> Result<ExternalIdentity>;
    /// Refresh profile fields and `last_login_at` on a returning login.
    async fn touch_login(&self, identity_id: IdentityId, profile: &ExternalUserProfile) -> Result<()>;
    async fn unlink(&self, user_id: UserId, identity_id: IdentityId) -> Result<bool>;
}

#[async_trait]
pub trait SessionRepo: Send + Sync {
    async fn create(
        &self,
        user_id: UserId,
        session_hash: &str,
        ttl_secs: u64,
        user_agent: Option<&str>,
        ip: Option<&str>,
    ) -> Result<UserSession>;
    /// Valid = not revoked, not expired. Implementations slide the
    /// expiration window and touch `last_seen_at`.
    async fn find_valid(&self, session_hash: &str, ttl_secs: u64) -> Result<Option<UserSession>>;
    async fn revoke(&self, session_hash: &str) -> Result<bool>;
    async fn revoke_all_for_user(&self, user_id: UserId) -> Result<u64>;
}

#[async_trait]
pub trait TokenRepo: Send + Sync {
    /// Issue an access+refresh pair transactionally.
    #[allow(clippy::too_many_arguments)]
    async fn issue_pair(
        &self,
        user_id: UserId,
        label: &str,
        scopes: &[String],
        access_hash: &str,
        refresh_hash: &str,
        access_ttl_secs: u64,
        refresh_ttl_secs: u64,
    ) -> Result<(AccessToken, RefreshToken)>;
    /// Valid = not revoked, not expired. Touches `last_used_at`.
    async fn find_valid_access(&self, token_hash: &str) -> Result<Option<AccessToken>>;
    /// Rotate a refresh token: revoke it (recording its successor), revoke
    /// its paired access token, and issue a new pair — one transaction.
    /// Returns `None` when the presented refresh token is unknown, revoked,
    /// or expired.
    async fn rotate_refresh(
        &self,
        refresh_hash: &str,
        new_access_hash: &str,
        new_refresh_hash: &str,
        access_ttl_secs: u64,
        refresh_ttl_secs: u64,
    ) -> Result<Option<(AccessToken, RefreshToken)>>;
    async fn list_access_for_user(&self, user_id: UserId) -> Result<Vec<AccessToken>>;
    /// Revoke one access token (and its paired refresh token) owned by the
    /// user.
    async fn revoke_access(&self, user_id: UserId, token_id: TokenId) -> Result<bool>;
    /// Revoke a refresh token by hash (logout from a device).
    async fn revoke_refresh(&self, refresh_hash: &str) -> Result<bool>;
    async fn revoke_all_for_user(&self, user_id: UserId) -> Result<u64>;
}

#[async_trait]
pub trait DeviceAuthRepo: Send + Sync {
    async fn create(
        &self,
        device_code_hash: &str,
        user_code: &str,
        client_name: &str,
        scopes: &[String],
        interval_secs: i32,
        ttl_secs: u64,
    ) -> Result<DeviceAuthorization>;
    async fn find_by_device_hash(&self, device_code_hash: &str) -> Result<Option<DeviceAuthorization>>;
    async fn find_by_user_code(&self, user_code: &str) -> Result<Option<DeviceAuthorization>>;
    /// Record a poll timestamp (used for `slow_down`). Returns the previous
    /// poll time.
    async fn record_poll(&self, id: DeviceAuthId) -> Result<Option<DateTime<Utc>>>;
    /// pending -> approved with the approving user. False when the record is
    /// no longer pending.
    async fn approve(&self, id: DeviceAuthId, user_id: UserId) -> Result<bool>;
    /// pending -> denied.
    async fn deny(&self, id: DeviceAuthId) -> Result<bool>;
    /// approved -> consumed (token handed out; device code is dead).
    async fn consume(&self, id: DeviceAuthId) -> Result<bool>;
    async fn mark_expired(&self, id: DeviceAuthId) -> Result<()>;
}

/// Background cleanup of expired identity artifacts.
#[async_trait]
pub trait IdentityCleanup: Send + Sync {
    /// Delete expired sessions, tokens, and device authorizations past their
    /// retention window. Returns the number of rows removed.
    async fn cleanup_expired(&self) -> Result<u64>;
}
