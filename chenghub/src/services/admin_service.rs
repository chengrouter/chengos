//! Admin: dashboard aggregation, user directory, role management, and the
//! audit stream.

use std::sync::Arc;

use serde::Serialize;

use crate::domain::identity::{ChengHubUser, UserId};
use crate::domain::moderation::{AuditActorType, AuditEvent, NewAuditEvent, UserBan};
use crate::domain::pagination::{Page, PageRequest};
use crate::domain::roles::{Role, RoleSet};
use crate::error::{HubError, Result};
use crate::ports::community_repository::{
    AdminDashboardRepo, AuditRepo, BanRepo, CommentRecord, DashboardStats, PostRecord,
};
use crate::ports::identity_repository::UserRepo;
use crate::services::identity_service::AuthContext;

pub struct AdminService {
    dashboard: Arc<dyn AdminDashboardRepo>,
    users: Arc<dyn UserRepo>,
    bans: Arc<dyn BanRepo>,
    audit: Arc<dyn AuditRepo>,
}

impl AdminService {
    pub fn new(
        dashboard: Arc<dyn AdminDashboardRepo>,
        users: Arc<dyn UserRepo>,
        bans: Arc<dyn BanRepo>,
        audit: Arc<dyn AuditRepo>,
    ) -> Self {
        Self { dashboard, users, bans, audit }
    }

    fn ensure_staff(ctx: &AuthContext) -> Result<()> {
        if !ctx.roles.is_staff() {
            return Err(HubError::forbidden("staff role required"));
        }
        Ok(())
    }

    fn ensure_admin(ctx: &AuthContext) -> Result<()> {
        if !ctx.roles.is_admin() {
            return Err(HubError::forbidden("admin role required"));
        }
        Ok(())
    }

    pub async fn stats(&self, ctx: &AuthContext) -> Result<DashboardStats> {
        Self::ensure_staff(ctx)?;
        self.dashboard.stats().await
    }

    pub async fn top_open_requirements(&self, ctx: &AuthContext, limit: u32) -> Result<Vec<PostRecord>> {
        Self::ensure_staff(ctx)?;
        self.dashboard.top_open_requirements(limit).await
    }

    pub async fn recently_active_requirements(
        &self,
        ctx: &AuthContext,
        limit: u32,
    ) -> Result<Vec<PostRecord>> {
        Self::ensure_staff(ctx)?;
        self.dashboard.recently_active_requirements(limit).await
    }

    pub async fn hidden_posts(&self, ctx: &AuthContext, limit: u32) -> Result<Vec<PostRecord>> {
        Self::ensure_staff(ctx)?;
        self.dashboard.hidden_posts(limit).await
    }

    pub async fn hidden_comments(&self, ctx: &AuthContext, limit: u32) -> Result<Vec<CommentRecord>> {
        Self::ensure_staff(ctx)?;
        self.dashboard.hidden_comments(limit).await
    }

    pub async fn active_bans(&self, ctx: &AuthContext) -> Result<Vec<UserBan>> {
        Self::ensure_staff(ctx)?;
        self.bans.list_active().await
    }

    pub async fn audit_events(
        &self,
        ctx: &AuthContext,
        before_id: Option<i64>,
        limit: u32,
    ) -> Result<Vec<AuditEvent>> {
        Self::ensure_admin(ctx)?;
        self.audit.list(before_id, limit).await
    }

    // --- Users & roles ---------------------------------------------------------

    pub async fn list_users(
        &self,
        ctx: &AuthContext,
        query: Option<&str>,
        page: PageRequest,
    ) -> Result<Page<UserWithRoles>> {
        Self::ensure_staff(ctx)?;
        let page = self.users.list(query, page).await?;
        let mut items = Vec::with_capacity(page.items.len());
        for user in page.items {
            let roles = self.users.roles(user.id).await?;
            items.push(UserWithRoles { user, roles: roles.0 });
        }
        Ok(Page { items, next_cursor: page.next_cursor })
    }

    pub async fn grant_role(&self, ctx: &AuthContext, user_id: UserId, role: Role) -> Result<()> {
        Self::ensure_admin(ctx)?;
        if role == Role::User {
            return Err(HubError::validation(
                crate::error::codes::INVALID_PARAM,
                "the user role is implicit",
            ));
        }
        self.users.get(user_id).await?.ok_or(HubError::NotFound("user"))?;
        self.users
            .grant_role(
                user_id,
                role,
                Some(ctx.user.id),
                NewAuditEvent {
                    actor_type: AuditActorType::Admin,
                    actor: ctx.user.username.clone(),
                    action: "role.grant".into(),
                    subject_type: "user".into(),
                    subject_id: user_id.to_string(),
                    details: serde_json::json!({ "role": role.as_str() }),
                    request_id: None,
                },
            )
            .await?;
        Ok(())
    }

    pub async fn revoke_role(&self, ctx: &AuthContext, user_id: UserId, role: Role) -> Result<()> {
        Self::ensure_admin(ctx)?;
        // The last admin cannot remove their own admin role: guarantees the
        // deployment always keeps one working admin.
        if role == Role::Admin && user_id == ctx.user.id {
            return Err(HubError::validation(
                crate::error::codes::INVALID_PARAM,
                "admins cannot revoke their own admin role",
            ));
        }
        let removed = self
            .users
            .revoke_role(
                user_id,
                role,
                NewAuditEvent {
                    actor_type: AuditActorType::Admin,
                    actor: ctx.user.username.clone(),
                    action: "role.revoke".into(),
                    subject_type: "user".into(),
                    subject_id: user_id.to_string(),
                    details: serde_json::json!({ "role": role.as_str() }),
                    request_id: None,
                },
            )
            .await?;
        if !removed {
            return Err(HubError::NotFound("role grant"));
        }
        Ok(())
    }

    pub async fn roles_of(&self, user_id: UserId) -> Result<RoleSet> {
        self.users.roles(user_id).await
    }
}

#[derive(Serialize)]
pub struct UserWithRoles {
    #[serde(flatten)]
    pub user: ChengHubUser,
    pub roles: Vec<Role>,
}
