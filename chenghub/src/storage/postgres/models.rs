//! Row structs mapping PostgreSQL rows to domain types.
//!
//! Enum-ish TEXT columns are validated on read; a value the binary does not
//! know is a data/schema mismatch and surfaces as an internal error rather
//! than silently degrading.

use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

use crate::domain::comment::Comment;
use crate::domain::identity::{
    AccessToken, AuthProvider, ChengHubUser, DeviceAuthStatus, DeviceAuthorization,
    ExternalIdentity, RefreshToken, UserSession,
};
use crate::domain::moderation::{
    AuditEvent, Report, ReportReason, ReportStatus, ReportSubjectType, UserBan,
};
use crate::domain::post::{Post, PostStatusTransition, PostType, RequirementStatus};
use crate::domain::workflow_share::WorkflowShare;
use crate::error::{HubError, Result};
use crate::ports::community_repository::{AuthorRef, CommentRecord, PostRecord};

fn bad_enum(table: &str, column: &str, value: &str) -> HubError {
    HubError::Internal(anyhow::anyhow!("unknown {table}.{column} value {value:?}"))
}

#[derive(FromRow)]
pub struct UserRow {
    pub id: Uuid,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    pub banned_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl UserRow {
    pub fn into_domain(self) -> ChengHubUser {
        ChengHubUser {
            id: self.id,
            username: self.username,
            display_name: self.display_name,
            avatar_url: self.avatar_url,
            email: self.email,
            banned_at: self.banned_at,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}

pub const USER_COLUMNS: &str =
    "id, username, display_name, avatar_url, email, banned_at, created_at, updated_at";

#[derive(FromRow)]
pub struct IdentityRow {
    pub id: Uuid,
    pub user_id: Uuid,
    pub provider: String,
    pub provider_subject: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_login_at: DateTime<Utc>,
}

impl IdentityRow {
    pub fn into_domain(self) -> Result<ExternalIdentity> {
        Ok(ExternalIdentity {
            provider: AuthProvider::parse(&self.provider)
                .ok_or_else(|| bad_enum("external_identities", "provider", &self.provider))?,
            id: self.id,
            user_id: self.user_id,
            provider_subject: self.provider_subject,
            display_name: self.display_name,
            avatar_url: self.avatar_url,
            email: self.email,
            created_at: self.created_at,
            last_login_at: self.last_login_at,
        })
    }
}

pub const IDENTITY_COLUMNS: &str = "id, user_id, provider, provider_subject, display_name, avatar_url, email, created_at, last_login_at";

#[derive(FromRow)]
pub struct SessionRow {
    pub id: Uuid,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub last_seen_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
}

impl SessionRow {
    pub fn into_domain(self) -> UserSession {
        UserSession {
            id: self.id,
            user_id: self.user_id,
            created_at: self.created_at,
            last_seen_at: self.last_seen_at,
            expires_at: self.expires_at,
            revoked_at: self.revoked_at,
        }
    }
}

#[derive(FromRow)]
pub struct AccessTokenRow {
    pub id: Uuid,
    pub user_id: Uuid,
    pub label: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub last_used_at: Option<DateTime<Utc>>,
}

impl AccessTokenRow {
    pub fn into_domain(self) -> AccessToken {
        AccessToken {
            id: self.id,
            user_id: self.user_id,
            label: self.label,
            scopes: self.scopes,
            created_at: self.created_at,
            expires_at: self.expires_at,
            revoked_at: self.revoked_at,
            last_used_at: self.last_used_at,
        }
    }
}

pub const ACCESS_TOKEN_COLUMNS: &str =
    "id, user_id, label, scopes, created_at, expires_at, revoked_at, last_used_at";

#[derive(FromRow)]
pub struct RefreshTokenRow {
    pub id: Uuid,
    pub user_id: Uuid,
    pub access_token_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub rotated_to: Option<Uuid>,
}

impl RefreshTokenRow {
    pub fn into_domain(self) -> RefreshToken {
        RefreshToken {
            id: self.id,
            user_id: self.user_id,
            access_token_id: self.access_token_id,
            created_at: self.created_at,
            expires_at: self.expires_at,
            revoked_at: self.revoked_at,
            rotated_to: self.rotated_to,
        }
    }
}

#[derive(FromRow)]
pub struct DeviceAuthRow {
    pub id: Uuid,
    pub user_code: String,
    pub client_name: String,
    pub scopes: Vec<String>,
    pub status: String,
    pub user_id: Option<Uuid>,
    pub interval_secs: i32,
    pub last_polled_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
}

impl DeviceAuthRow {
    pub fn into_domain(self) -> Result<DeviceAuthorization> {
        Ok(DeviceAuthorization {
            status: DeviceAuthStatus::parse(&self.status)
                .ok_or_else(|| bad_enum("device_authorizations", "status", &self.status))?,
            id: self.id,
            user_code: self.user_code,
            client_name: self.client_name,
            scopes: self.scopes,
            user_id: self.user_id,
            interval_secs: self.interval_secs,
            last_polled_at: self.last_polled_at,
            created_at: self.created_at,
            expires_at: self.expires_at,
        })
    }
}

pub const DEVICE_AUTH_COLUMNS: &str = "id, user_code, client_name, scopes, status, user_id, interval_secs, last_polled_at, created_at, expires_at";

#[derive(FromRow)]
pub struct PostRow {
    pub id: Uuid,
    pub author_id: Uuid,
    pub post_type: String,
    pub title: String,
    pub body_md: String,
    pub tags: Vec<String>,
    pub status: Option<String>,
    pub duplicate_of_post_id: Option<Uuid>,
    pub workflow_share_id: Option<Uuid>,
    pub support_count: i32,
    pub like_count: i32,
    pub star_count: i32,
    pub comments_count: i32,
    pub hidden_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub locked_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_activity_at: DateTime<Utc>,
}

impl PostRow {
    pub fn into_domain(self) -> Result<Post> {
        let status = match self.status {
            Some(s) => Some(
                RequirementStatus::parse(&s).ok_or_else(|| bad_enum("posts", "status", &s))?,
            ),
            None => None,
        };
        Ok(Post {
            post_type: PostType::parse(&self.post_type)
                .ok_or_else(|| bad_enum("posts", "post_type", &self.post_type))?,
            status,
            id: self.id,
            author_id: self.author_id,
            title: self.title,
            body_md: self.body_md,
            tags: self.tags,
            duplicate_of_post_id: self.duplicate_of_post_id,
            workflow_share_id: self.workflow_share_id,
            support_count: self.support_count,
            like_count: self.like_count,
            star_count: self.star_count,
            comments_count: self.comments_count,
            hidden_at: self.hidden_at,
            deleted_at: self.deleted_at,
            locked_at: self.locked_at,
            created_at: self.created_at,
            updated_at: self.updated_at,
            last_activity_at: self.last_activity_at,
        })
    }
}

pub const POST_COLUMNS: &str = "id, author_id, post_type, title, body_md, tags, status, duplicate_of_post_id, workflow_share_id, support_count, like_count, star_count, comments_count, hidden_at, deleted_at, locked_at, created_at, updated_at, last_activity_at";

/// `POST_COLUMNS` prefixed with `p.` for joined queries.
pub fn post_columns_prefixed() -> String {
    POST_COLUMNS
        .split(", ")
        .map(|c| format!("p.{c}"))
        .collect::<Vec<_>>()
        .join(", ")
}

/// Post row joined with author fields (aliased `author_*`).
#[derive(FromRow)]
pub struct PostRecordRow {
    #[sqlx(flatten)]
    pub post: PostRow,
    pub author_username: String,
    pub author_display_name: String,
    pub author_avatar_url: Option<String>,
}

pub const AUTHOR_JOIN_COLUMNS: &str = "u.username AS author_username, u.display_name AS author_display_name, u.avatar_url AS author_avatar_url";

impl PostRecordRow {
    pub fn into_domain(self) -> Result<PostRecord> {
        let author_id = self.post.author_id;
        Ok(PostRecord {
            post: self.post.into_domain()?,
            author: AuthorRef {
                id: author_id,
                username: self.author_username,
                display_name: self.author_display_name,
                avatar_url: self.author_avatar_url,
            },
        })
    }
}

#[derive(FromRow)]
pub struct StatusEventRow {
    pub id: Uuid,
    pub post_id: Uuid,
    pub from_status: Option<String>,
    pub to_status: String,
    pub changed_by: Option<Uuid>,
    pub note: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl StatusEventRow {
    pub fn into_domain(self) -> Result<PostStatusTransition> {
        let from_status = match self.from_status {
            Some(s) => Some(
                RequirementStatus::parse(&s)
                    .ok_or_else(|| bad_enum("post_status_events", "from_status", &s))?,
            ),
            None => None,
        };
        Ok(PostStatusTransition {
            to_status: RequirementStatus::parse(&self.to_status)
                .ok_or_else(|| bad_enum("post_status_events", "to_status", &self.to_status))?,
            from_status,
            id: self.id,
            post_id: self.post_id,
            changed_by: self.changed_by,
            note: self.note,
            created_at: self.created_at,
        })
    }
}

#[derive(FromRow)]
pub struct CommentRow {
    pub id: Uuid,
    pub post_id: Uuid,
    pub author_id: Uuid,
    pub body_md: String,
    pub like_count: i32,
    pub hidden_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl CommentRow {
    pub fn into_domain(self) -> Comment {
        Comment {
            id: self.id,
            post_id: self.post_id,
            author_id: self.author_id,
            body_md: self.body_md,
            like_count: self.like_count,
            hidden_at: self.hidden_at,
            deleted_at: self.deleted_at,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}

pub const COMMENT_COLUMNS: &str =
    "id, post_id, author_id, body_md, like_count, hidden_at, deleted_at, created_at, updated_at";

#[derive(FromRow)]
pub struct CommentRecordRow {
    #[sqlx(flatten)]
    pub comment: CommentRow,
    pub author_username: String,
    pub author_display_name: String,
    pub author_avatar_url: Option<String>,
}

impl CommentRecordRow {
    pub fn into_domain(self) -> CommentRecord {
        let author_id = self.comment.author_id;
        CommentRecord {
            comment: self.comment.into_domain(),
            author: AuthorRef {
                id: author_id,
                username: self.author_username,
                display_name: self.author_display_name,
                avatar_url: self.author_avatar_url,
            },
        }
    }
}

#[derive(FromRow)]
pub struct ReportRow {
    pub id: Uuid,
    pub reporter_id: Uuid,
    pub subject_type: String,
    pub subject_id: Uuid,
    pub reason: String,
    pub detail: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
    pub resolved_by: Option<Uuid>,
    pub resolution_note: Option<String>,
}

impl ReportRow {
    pub fn into_domain(self) -> Result<Report> {
        Ok(Report {
            subject_type: ReportSubjectType::parse(&self.subject_type)
                .ok_or_else(|| bad_enum("reports", "subject_type", &self.subject_type))?,
            reason: ReportReason::parse(&self.reason)
                .ok_or_else(|| bad_enum("reports", "reason", &self.reason))?,
            status: ReportStatus::parse(&self.status)
                .ok_or_else(|| bad_enum("reports", "status", &self.status))?,
            id: self.id,
            reporter_id: self.reporter_id,
            subject_id: self.subject_id,
            detail: self.detail,
            created_at: self.created_at,
            resolved_at: self.resolved_at,
            resolved_by: self.resolved_by,
            resolution_note: self.resolution_note,
        })
    }
}

pub const REPORT_COLUMNS: &str = "id, reporter_id, subject_type, subject_id, reason, detail, status, created_at, resolved_at, resolved_by, resolution_note";

#[derive(FromRow)]
pub struct BanRow {
    pub id: Uuid,
    pub user_id: Uuid,
    pub banned_by: Option<Uuid>,
    pub reason: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub lifted_at: Option<DateTime<Utc>>,
    pub lifted_by: Option<Uuid>,
}

impl BanRow {
    pub fn into_domain(self) -> UserBan {
        UserBan {
            id: self.id,
            user_id: self.user_id,
            banned_by: self.banned_by,
            reason: self.reason,
            created_at: self.created_at,
            expires_at: self.expires_at,
            lifted_at: self.lifted_at,
            lifted_by: self.lifted_by,
        }
    }
}

#[derive(FromRow)]
pub struct AuditRow {
    pub id: i64,
    pub actor_type: String,
    pub actor: String,
    pub action: String,
    pub subject_type: String,
    pub subject_id: String,
    pub details: serde_json::Value,
    pub request_id: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl AuditRow {
    pub fn into_domain(self) -> AuditEvent {
        AuditEvent {
            id: self.id,
            actor_type: self.actor_type,
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

#[derive(FromRow)]
pub struct WorkflowShareRow {
    pub id: Uuid,
    pub owner_id: Uuid,
    pub title: String,
    pub summary: String,
    pub payload: serde_json::Value,
    pub node_types: Vec<String>,
    pub node_count: i32,
    pub compat_version: String,
    pub sanitizer_version: String,
    pub hidden_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl WorkflowShareRow {
    pub fn into_domain(self) -> WorkflowShare {
        WorkflowShare {
            id: self.id,
            owner_id: self.owner_id,
            title: self.title,
            summary: self.summary,
            payload: self.payload,
            node_types: self.node_types,
            node_count: self.node_count,
            compat_version: self.compat_version,
            sanitizer_version: self.sanitizer_version,
            hidden_at: self.hidden_at,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}

pub const WORKFLOW_SHARE_COLUMNS: &str = "id, owner_id, title, summary, payload, node_types, node_count, compat_version, sanitizer_version, hidden_at, created_at, updated_at";
