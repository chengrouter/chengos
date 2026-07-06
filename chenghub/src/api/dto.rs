//! Request and response DTOs. Wire contracts stay separate from storage
//! and domain models so either can evolve independently.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::comment::Comment;
use crate::domain::identity::{AccessToken, ChengHubUser, ExternalIdentity};
use crate::domain::post::PostStatusTransition;
use crate::domain::reaction::PostReactionState;
use crate::domain::roles::RoleSet;
use crate::domain::workflow_share::{RequiredVariable, SafetyFinding, WorkflowShare};
use crate::ports::community_repository::{AuthorRef, CommentRecord, PostRecord};

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct UserDto {
    pub id: Uuid,
    pub username: String,
    pub display_name: String,
    pub avatar_url: Option<String>,
    pub roles: Vec<String>,
    pub banned: bool,
    pub created_at: DateTime<Utc>,
}

impl UserDto {
    pub fn from_user(user: &ChengHubUser, roles: &RoleSet) -> Self {
        Self {
            id: user.id,
            username: user.username.clone(),
            display_name: user.display_name.clone(),
            avatar_url: user.avatar_url.clone(),
            roles: roles.0.iter().map(|r| r.as_str().to_string()).collect(),
            banned: user.is_banned(),
            created_at: user.created_at,
        }
    }
}

#[derive(Serialize)]
pub struct MeResponse {
    pub authenticated: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user: Option<UserDto>,
    /// Providers available for login on this deployment.
    pub providers: Vec<String>,
}

#[derive(Serialize)]
pub struct IdentityDto {
    pub id: Uuid,
    pub provider: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_login_at: DateTime<Utc>,
}

impl From<ExternalIdentity> for IdentityDto {
    fn from(identity: ExternalIdentity) -> Self {
        Self {
            id: identity.id,
            provider: identity.provider.as_str().to_string(),
            display_name: identity.display_name,
            avatar_url: identity.avatar_url,
            created_at: identity.created_at,
            last_login_at: identity.last_login_at,
        }
    }
}

#[derive(Serialize)]
pub struct TokenDto {
    pub id: Uuid,
    pub label: String,
    pub scopes: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub last_used_at: Option<DateTime<Utc>>,
}

impl From<AccessToken> for TokenDto {
    fn from(token: AccessToken) -> Self {
        Self {
            id: token.id,
            label: token.label,
            scopes: token.scopes,
            created_at: token.created_at,
            expires_at: token.expires_at,
            last_used_at: token.last_used_at,
        }
    }
}

#[derive(Deserialize)]
pub struct RefreshRequest {
    pub refresh_token: String,
}

#[derive(Deserialize)]
pub struct CreateTokenRequest {
    #[serde(default = "default_token_label")]
    pub label: String,
}

fn default_token_label() -> String {
    "personal".into()
}

// ---------------------------------------------------------------------------
// Device flow
// ---------------------------------------------------------------------------

#[derive(Deserialize)]
pub struct DeviceCodeRequest {
    #[serde(default = "default_client_name")]
    pub client_name: String,
}

fn default_client_name() -> String {
    "chengflow".into()
}

#[derive(Deserialize)]
pub struct DeviceTokenRequest {
    pub device_code: String,
    /// RFC 8628 requires `urn:ietf:params:oauth:grant-type:device_code`;
    /// accepted but not enforced for the V1 first-party client.
    #[serde(default)]
    pub grant_type: Option<String>,
}

#[derive(Deserialize)]
pub struct DeviceDecisionRequest {
    pub user_code: String,
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct PostDto {
    pub id: Uuid,
    pub post_type: String,
    pub title: String,
    pub body_md: String,
    pub tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duplicate_of_post_id: Option<Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workflow_share_id: Option<Uuid>,
    pub support_count: i32,
    pub like_count: i32,
    pub star_count: i32,
    pub comments_count: i32,
    pub hidden: bool,
    pub locked: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_activity_at: DateTime<Utc>,
    pub author: AuthorRef,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub viewer: Option<ViewerStateDto>,
}

#[derive(Serialize, Default, Clone, Copy)]
pub struct ViewerStateDto {
    pub supported: bool,
    pub liked: bool,
    pub starred: bool,
}

impl From<PostReactionState> for ViewerStateDto {
    fn from(state: PostReactionState) -> Self {
        Self { supported: state.supported, liked: state.liked, starred: state.starred }
    }
}

impl PostDto {
    pub fn from_record(record: &PostRecord, viewer: Option<PostReactionState>) -> Self {
        let post = &record.post;
        Self {
            id: post.id,
            post_type: post.post_type.as_str().to_string(),
            title: post.title.clone(),
            body_md: post.body_md.clone(),
            tags: post.tags.clone(),
            status: post.status.map(|s| s.as_str().to_string()),
            duplicate_of_post_id: post.duplicate_of_post_id,
            workflow_share_id: post.workflow_share_id,
            support_count: post.support_count,
            like_count: post.like_count,
            star_count: post.star_count,
            comments_count: post.comments_count,
            hidden: post.is_hidden(),
            locked: post.is_locked(),
            created_at: post.created_at,
            updated_at: post.updated_at,
            last_activity_at: post.last_activity_at,
            author: record.author.clone(),
            viewer: viewer.map(Into::into),
        }
    }
}

/// List item: everything the card needs, without the full body.
#[derive(Serialize)]
pub struct PostListItemDto {
    pub id: Uuid,
    pub post_type: String,
    pub title: String,
    /// Truncated plain-ish preview of the body.
    pub excerpt: String,
    pub tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    pub support_count: i32,
    pub like_count: i32,
    pub star_count: i32,
    pub comments_count: i32,
    pub hidden: bool,
    pub created_at: DateTime<Utc>,
    pub last_activity_at: DateTime<Utc>,
    pub author: AuthorRef,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub viewer: Option<ViewerStateDto>,
}

impl PostListItemDto {
    pub fn from_record(record: &PostRecord, viewer: Option<PostReactionState>) -> Self {
        let post = &record.post;
        Self {
            id: post.id,
            post_type: post.post_type.as_str().to_string(),
            title: post.title.clone(),
            excerpt: excerpt_of(&post.body_md, 240),
            tags: post.tags.clone(),
            status: post.status.map(|s| s.as_str().to_string()),
            support_count: post.support_count,
            like_count: post.like_count,
            star_count: post.star_count,
            comments_count: post.comments_count,
            hidden: post.is_hidden(),
            created_at: post.created_at,
            last_activity_at: post.last_activity_at,
            author: record.author.clone(),
            viewer: viewer.map(Into::into),
        }
    }
}

/// First characters of the body with Markdown syntax lightly stripped.
fn excerpt_of(body_md: &str, max_chars: usize) -> String {
    let plain: String = body_md
        .lines()
        .filter(|line| !line.trim_start().starts_with("```"))
        .collect::<Vec<_>>()
        .join(" ");
    let stripped: String = plain
        .chars()
        .filter(|c| !matches!(c, '#' | '*' | '`' | '>' | '_' | '~'))
        .collect();
    let trimmed = stripped.split_whitespace().collect::<Vec<_>>().join(" ");
    let mut excerpt: String = trimmed.chars().take(max_chars).collect();
    if trimmed.chars().count() > max_chars {
        excerpt.push('…');
    }
    excerpt
}

#[derive(Serialize)]
pub struct PostListResponse {
    pub items: Vec<PostListItemDto>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next_cursor: Option<String>,
}

#[derive(Serialize)]
pub struct StatusEventDto {
    pub from_status: Option<String>,
    pub to_status: String,
    pub changed_by: Option<Uuid>,
    pub note: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl From<&PostStatusTransition> for StatusEventDto {
    fn from(event: &PostStatusTransition) -> Self {
        Self {
            from_status: event.from_status.map(|s| s.as_str().to_string()),
            to_status: event.to_status.as_str().to_string(),
            changed_by: event.changed_by,
            note: event.note.clone(),
            created_at: event.created_at,
        }
    }
}

#[derive(Serialize)]
pub struct DuplicateBannerDto {
    pub target_post_id: Uuid,
    pub target_title: String,
}

#[derive(Serialize)]
pub struct PostDetailResponse {
    #[serde(flatten)]
    pub post: PostDto,
    pub status_history: Vec<StatusEventDto>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duplicate_of: Option<DuplicateBannerDto>,
}

#[derive(Deserialize)]
pub struct CreatePostRequest {
    pub post_type: String,
    pub title: String,
    #[serde(default)]
    pub body_md: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub workflow_share_id: Option<Uuid>,
}

#[derive(Deserialize)]
pub struct UpdatePostRequest {
    pub title: String,
    #[serde(default)]
    pub body_md: String,
    #[serde(default)]
    pub tags: Vec<String>,
}

#[derive(Deserialize)]
pub struct SetStatusRequest {
    pub status: String,
    #[serde(default)]
    pub note: Option<String>,
}

#[derive(Deserialize)]
pub struct MergeRequest {
    pub target_post_id: Uuid,
    #[serde(default)]
    pub note: Option<String>,
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct CommentDto {
    pub id: Uuid,
    pub post_id: Uuid,
    pub body_md: String,
    pub like_count: i32,
    pub hidden: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub author: AuthorRef,
    pub viewer_liked: bool,
}

impl CommentDto {
    pub fn from_record(record: &CommentRecord, viewer_liked: bool) -> Self {
        let comment = &record.comment;
        Self {
            id: comment.id,
            post_id: comment.post_id,
            body_md: comment.body_md.clone(),
            like_count: comment.like_count,
            hidden: comment.is_hidden(),
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            author: record.author.clone(),
            viewer_liked,
        }
    }

    pub fn from_comment(comment: &Comment, author: AuthorRef) -> Self {
        Self {
            id: comment.id,
            post_id: comment.post_id,
            body_md: comment.body_md.clone(),
            like_count: comment.like_count,
            hidden: comment.is_hidden(),
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            author,
            viewer_liked: false,
        }
    }
}

#[derive(Serialize)]
pub struct CommentListResponse {
    pub items: Vec<CommentDto>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next_cursor: Option<String>,
}

#[derive(Deserialize)]
pub struct CommentRequest {
    pub body_md: String,
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

#[derive(Deserialize)]
pub struct ReportRequest {
    pub reason: String,
    #[serde(default)]
    pub detail: String,
}

#[derive(Deserialize)]
pub struct ResolveReportRequest {
    #[serde(default)]
    pub dismiss: bool,
    #[serde(default)]
    pub note: Option<String>,
}

// ---------------------------------------------------------------------------
// Workflow shares
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct WorkflowShareDto {
    pub id: Uuid,
    pub owner_id: Uuid,
    pub title: String,
    pub summary: String,
    pub node_types: Vec<String>,
    pub node_count: i32,
    pub compat_version: String,
    pub sanitizer_version: String,
    pub created_at: DateTime<Utc>,
    pub required_variables: Vec<RequiredVariable>,
    pub safety_findings: Vec<SafetyFinding>,
}

impl WorkflowShareDto {
    pub fn from_parts(
        share: &WorkflowShare,
        required_variables: Vec<RequiredVariable>,
        safety_findings: Vec<SafetyFinding>,
    ) -> Self {
        Self {
            id: share.id,
            owner_id: share.owner_id,
            title: share.title.clone(),
            summary: share.summary.clone(),
            node_types: share.node_types.clone(),
            node_count: share.node_count,
            compat_version: share.compat_version.clone(),
            sanitizer_version: share.sanitizer_version.clone(),
            created_at: share.created_at,
            required_variables,
            safety_findings,
        }
    }
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

#[derive(Deserialize)]
pub struct BanRequest {
    #[serde(default)]
    pub reason: String,
    #[serde(default)]
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
pub struct HideRequest {
    #[serde(default)]
    pub reason: String,
}

#[derive(Deserialize)]
pub struct GrantRoleRequest {
    pub role: String,
}

/// Helper for author refs when only the acting user is known.
pub fn author_ref_of(user: &ChengHubUser) -> AuthorRef {
    AuthorRef {
        id: user.id,
        username: user.username.clone(),
        display_name: user.display_name.clone(),
        avatar_url: user.avatar_url.clone(),
    }
}
