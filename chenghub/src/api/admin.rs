//! Admin and operations routes. Role checks live in the services; every
//! privileged change writes an audit event in its transaction.

use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use uuid::Uuid;

use crate::api::dto::{
    BanRequest, GrantRoleRequest, HideRequest, MergeRequest, PostListItemDto, ResolveReportRequest,
};
use crate::api::middleware::RequireUser;
use crate::api::ApiState;
use crate::domain::moderation::ReportStatus;
use crate::domain::pagination::{Cursor, PageRequest};
use crate::domain::roles::Role;
use crate::error::{codes, HubError, Result};

/// GET /api/v1/admin/dashboard — one response with every dashboard block.
pub async fn dashboard(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
) -> Result<Json<serde_json::Value>> {
    let stats = state.admin.stats(&ctx).await?;
    let top = state.admin.top_open_requirements(&ctx, 10).await?;
    let active = state.admin.recently_active_requirements(&ctx, 10).await?;
    let hidden_posts = state.admin.hidden_posts(&ctx, 20).await?;
    let hidden_comments = state.admin.hidden_comments(&ctx, 20).await?;
    let bans = state.admin.active_bans(&ctx).await?;
    let open_reports = state
        .moderation
        .list_reports(&ctx, Some(ReportStatus::Open), PageRequest::new(Some(20), None))
        .await?;

    let post_items = |records: &[crate::ports::community_repository::PostRecord]| {
        records
            .iter()
            .map(|r| PostListItemDto::from_record(r, None))
            .collect::<Vec<_>>()
    };
    Ok(Json(serde_json::json!({
        "stats": stats,
        "top_open_requirements": post_items(&top),
        "recently_active_requirements": post_items(&active),
        "hidden_posts": post_items(&hidden_posts),
        "hidden_comments": hidden_comments
            .iter()
            .map(|r| crate::api::dto::CommentDto::from_record(r, false))
            .collect::<Vec<_>>(),
        "banned_users": bans,
        "open_reports": open_reports.items,
    })))
}

#[derive(Deserialize)]
pub struct RequirementsQuery {
    pub status: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<u32>,
}

/// GET /api/v1/admin/requirements — triage queue (pending sort).
pub async fn requirements(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Query(query): Query<RequirementsQuery>,
) -> Result<Json<serde_json::Value>> {
    use crate::domain::post::{PostFilter, PostSort, PostType, RequirementStatus};
    if !ctx.roles.is_staff() {
        return Err(HubError::forbidden("staff role required"));
    }
    let status = query
        .status
        .as_deref()
        .map(|raw| {
            RequirementStatus::parse(raw).ok_or_else(|| {
                HubError::validation(codes::INVALID_PARAM, format!("unknown status {raw:?}"))
            })
        })
        .transpose()?;
    let sort = if status.map(|s| s.is_open()).unwrap_or(true) {
        PostSort::Pending
    } else {
        PostSort::Resolved
    };
    let cursor = match query.cursor.as_deref() {
        None => None,
        Some(raw) => Some(
            Cursor::decode(raw, sort.as_str())
                .map_err(|msg| HubError::validation(codes::INVALID_CURSOR, msg))?,
        ),
    };
    let filter = PostFilter {
        post_type: Some(PostType::Requirement),
        status,
        tag: None,
        author: None,
        viewer: crate::services::post_service::viewer_of(&ctx),
    };
    let page = state
        .posts
        .list(&filter, sort, PageRequest::new(query.limit, cursor))
        .await?;
    Ok(Json(serde_json::json!({
        "items": page.items.iter().map(|r| PostListItemDto::from_record(r, None)).collect::<Vec<_>>(),
        "next_cursor": page.next_cursor,
    })))
}

/// PATCH /api/v1/admin/posts/:id/status — same semantics as the public
/// route; exists so admin tooling can use a stable admin prefix.
pub async fn set_status(
    state: State<ApiState>,
    user: RequireUser,
    path: Path<Uuid>,
    body: Json<crate::api::dto::SetStatusRequest>,
) -> Result<Json<crate::api::dto::PostDto>> {
    crate::api::posts::set_status(state, user, path, body).await
}

/// POST /api/v1/admin/posts/:id/merge — duplicate merge.
pub async fn merge(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(source_id): Path<Uuid>,
    Json(request): Json<MergeRequest>,
) -> Result<Json<crate::ports::community_repository::MergeOutcome>> {
    let outcome = state
        .requirements
        .merge(&ctx, source_id, request.target_post_id, request.note.as_deref())
        .await?;
    Ok(Json(outcome))
}

/// POST /api/v1/admin/posts/:id/hide
pub async fn hide_post(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<HideRequest>,
) -> Result<Json<serde_json::Value>> {
    state.moderation.set_post_hidden(&ctx, id, true, &request.reason).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// POST /api/v1/admin/posts/:id/restore
pub async fn restore_post(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<HideRequest>,
) -> Result<Json<serde_json::Value>> {
    state.moderation.set_post_hidden(&ctx, id, false, &request.reason).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// POST /api/v1/admin/comments/:id/hide
pub async fn hide_comment(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<HideRequest>,
) -> Result<Json<serde_json::Value>> {
    state.comments.set_hidden(&ctx, id, true, &request.reason).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// POST /api/v1/admin/comments/:id/restore
pub async fn restore_comment(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<HideRequest>,
) -> Result<Json<serde_json::Value>> {
    state.comments.set_hidden(&ctx, id, false, &request.reason).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

#[derive(Deserialize)]
pub struct ReportsQuery {
    pub status: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<u32>,
}

/// GET /api/v1/admin/reports
pub async fn list_reports(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Query(query): Query<ReportsQuery>,
) -> Result<Json<serde_json::Value>> {
    let status = query
        .status
        .as_deref()
        .map(|raw| {
            ReportStatus::parse(raw).ok_or_else(|| {
                HubError::validation(codes::INVALID_PARAM, format!("unknown status {raw:?}"))
            })
        })
        .transpose()?;
    let cursor = match query.cursor.as_deref() {
        None => None,
        Some(raw) => Some(
            Cursor::decode(raw, "reports")
                .map_err(|msg| HubError::validation(codes::INVALID_CURSOR, msg))?,
        ),
    };
    let page = state
        .moderation
        .list_reports(&ctx, status, PageRequest::new(query.limit, cursor))
        .await?;
    Ok(Json(serde_json::json!({
        "items": page.items,
        "next_cursor": page.next_cursor,
    })))
}

/// POST /api/v1/admin/reports/:id/resolve
pub async fn resolve_report(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<ResolveReportRequest>,
) -> Result<Json<crate::domain::moderation::Report>> {
    let report = state
        .moderation
        .resolve_report(&ctx, id, request.dismiss, request.note.as_deref())
        .await?;
    Ok(Json(report))
}

#[derive(Deserialize)]
pub struct UsersQuery {
    pub q: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<u32>,
}

/// GET /api/v1/admin/users
pub async fn list_users(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Query(query): Query<UsersQuery>,
) -> Result<Json<serde_json::Value>> {
    let cursor = match query.cursor.as_deref() {
        None => None,
        Some(raw) => Some(
            Cursor::decode(raw, "newest")
                .map_err(|msg| HubError::validation(codes::INVALID_CURSOR, msg))?,
        ),
    };
    let page = state
        .admin
        .list_users(&ctx, query.q.as_deref(), PageRequest::new(query.limit, cursor))
        .await?;
    Ok(Json(serde_json::json!({
        "items": page.items,
        "next_cursor": page.next_cursor,
    })))
}

/// POST /api/v1/admin/users/:id/ban
pub async fn ban_user(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(user_id): Path<Uuid>,
    Json(request): Json<BanRequest>,
) -> Result<Json<crate::domain::moderation::UserBan>> {
    let ban = state
        .moderation
        .ban_user(&ctx, user_id, &request.reason, request.expires_at)
        .await?;
    Ok(Json(ban))
}

/// POST /api/v1/admin/users/:id/unban
pub async fn unban_user(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(user_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.moderation.unban_user(&ctx, user_id).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

#[derive(Deserialize)]
pub struct AuditQuery {
    pub before_id: Option<i64>,
    pub limit: Option<u32>,
}

/// GET /api/v1/admin/audit-events
pub async fn audit_events(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Query(query): Query<AuditQuery>,
) -> Result<Json<Vec<crate::domain::moderation::AuditEvent>>> {
    let events = state
        .admin
        .audit_events(&ctx, query.before_id, query.limit.unwrap_or(50))
        .await?;
    Ok(Json(events))
}

fn parse_role(raw: &str) -> Result<Role> {
    Role::parse(raw)
        .ok_or_else(|| HubError::validation(codes::INVALID_PARAM, format!("unknown role {raw:?}")))
}

/// POST /api/v1/admin/users/:id/roles
pub async fn grant_role(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(user_id): Path<Uuid>,
    Json(request): Json<GrantRoleRequest>,
) -> Result<Json<serde_json::Value>> {
    state.admin.grant_role(&ctx, user_id, parse_role(&request.role)?).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// DELETE /api/v1/admin/users/:id/roles/:role
pub async fn revoke_role(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path((user_id, role)): Path<(Uuid, String)>,
) -> Result<Json<serde_json::Value>> {
    state.admin.revoke_role(&ctx, user_id, parse_role(&role)?).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}
