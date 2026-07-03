//! Moderation endpoints (admin-token authenticated).
//!
//! Review queue, release moderation, skill visibility, publisher bans,
//! report handling, and the audit trail. Every mutation requires a reason
//! and lands in the append-only moderation/audit tables.

use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::Json;
use serde::Deserialize;
use uuid::Uuid;

use crate::api::dto::{PageDto, ReleaseDto};
use crate::api::middleware::RequireAdmin;
use crate::api::ApiState;
use crate::domain::moderation::ReportStatus;
use crate::domain::pagination::{Cursor, PageRequest, SortOrder};
use crate::domain::release::ReleaseStatus;
use crate::error::{RegistryError, Result};

#[derive(Deserialize)]
pub struct QueueQuery {
    /// Comma-separated statuses; defaults to `needs_review`.
    #[serde(default)]
    pub status: Option<String>,
    pub limit: Option<u32>,
    pub cursor: Option<String>,
}

/// `GET /api/v1/admin/queue`
pub async fn review_queue(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Query(params): Query<QueueQuery>,
) -> Result<Json<PageDto<serde_json::Value>>> {
    let _ = admin;
    let statuses: Vec<ReleaseStatus> = match &params.status {
        None => vec![ReleaseStatus::NeedsReview],
        Some(raw) => raw
            .split(',')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(|s| {
                ReleaseStatus::parse(s)
                    .ok_or_else(|| RegistryError::validation("INVALID_STATUS", format!("unknown status {s:?}")))
            })
            .collect::<Result<_>>()?,
    };
    let cursor = params
        .cursor
        .as_deref()
        .map(|raw| Cursor::decode(raw, SortOrder::RecentlyUpdated))
        .transpose()
        .map_err(|m| RegistryError::validation("INVALID_CURSOR", m))?;
    let page = state
        .moderation
        .review_queue(&statuses, PageRequest::new(params.limit, cursor))
        .await?;
    Ok(Json(PageDto::from_page(page, |release| {
        serde_json::json!({
            "release_id": release.id,
            "skill_id": release.skill_id,
            "release": ReleaseDto::from_domain(&release, None),
        })
    })))
}

#[derive(Deserialize)]
pub struct ReasonBody {
    pub reason: String,
}

/// `POST /api/v1/admin/releases/{id}/approve`
pub async fn approve_release(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(release_id): Path<Uuid>,
    Json(body): Json<ReasonBody>,
) -> Result<Json<ReleaseDto>> {
    let release = state
        .moderation
        .approve_release(&admin.actor, release_id, &body.reason)
        .await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

/// `POST /api/v1/admin/releases/{id}/reject`
pub async fn reject_release(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(release_id): Path<Uuid>,
    Json(body): Json<ReasonBody>,
) -> Result<Json<ReleaseDto>> {
    let release = state
        .moderation
        .reject_release(&admin.actor, release_id, &body.reason)
        .await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

/// `POST /api/v1/admin/releases/{id}/quarantine`
pub async fn quarantine_release(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(release_id): Path<Uuid>,
    Json(body): Json<ReasonBody>,
) -> Result<Json<ReleaseDto>> {
    let release = state
        .moderation
        .quarantine_release(&admin.actor, release_id, &body.reason)
        .await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

#[derive(Deserialize)]
pub struct RestoreBody {
    pub reason: String,
    /// `true` -> published; `false` -> back to needs_review.
    #[serde(default)]
    pub to_published: bool,
}

/// `POST /api/v1/admin/releases/{id}/restore`
pub async fn restore_release(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(release_id): Path<Uuid>,
    Json(body): Json<RestoreBody>,
) -> Result<Json<ReleaseDto>> {
    let release = state
        .moderation
        .restore_release(&admin.actor, release_id, body.to_published, &body.reason)
        .await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

/// `POST /api/v1/admin/releases/{id}/rescan`
pub async fn rescan_release(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(release_id): Path<Uuid>,
    Json(body): Json<ReasonBody>,
) -> Result<(StatusCode, Json<serde_json::Value>)> {
    let job_id = state
        .moderation
        .request_rescan(&admin.actor, release_id, &body.reason)
        .await?;
    Ok((StatusCode::ACCEPTED, Json(serde_json::json!({ "job_id": job_id }))))
}

#[derive(Deserialize)]
pub struct HideBody {
    pub reason: String,
    pub hidden: bool,
}

/// `POST /api/v1/admin/skills/{id}/visibility`
pub async fn set_skill_visibility(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(skill_id): Path<Uuid>,
    Json(body): Json<HideBody>,
) -> Result<StatusCode> {
    state
        .moderation
        .set_skill_hidden(&admin.actor, skill_id, body.hidden, &body.reason)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Deserialize)]
pub struct BanBody {
    pub reason: String,
    pub banned: bool,
}

/// `POST /api/v1/admin/publishers/{id}/ban`
pub async fn set_publisher_banned(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(publisher_id): Path<Uuid>,
    Json(body): Json<BanBody>,
) -> Result<StatusCode> {
    state
        .moderation
        .set_publisher_banned(&admin.actor, publisher_id, body.banned, &body.reason)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Deserialize)]
pub struct ReportsQuery {
    #[serde(default)]
    pub status: Option<String>,
    pub limit: Option<u32>,
    pub cursor: Option<String>,
}

/// `GET /api/v1/admin/reports`
pub async fn list_reports(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Query(params): Query<ReportsQuery>,
) -> Result<Json<PageDto<serde_json::Value>>> {
    let _ = admin;
    let status = params
        .status
        .as_deref()
        .map(|raw| {
            ReportStatus::parse(raw)
                .ok_or_else(|| RegistryError::validation("INVALID_STATUS", format!("unknown status {raw:?}")))
        })
        .transpose()?;
    let cursor = params
        .cursor
        .as_deref()
        .map(|raw| Cursor::decode(raw, SortOrder::RecentlyUpdated))
        .transpose()
        .map_err(|m| RegistryError::validation("INVALID_CURSOR", m))?;
    let page = state
        .moderation
        .list_reports(status, PageRequest::new(params.limit, cursor))
        .await?;
    Ok(Json(PageDto::from_page(page, |report| {
        serde_json::json!({
            "id": report.id,
            "skill_id": report.skill_id,
            "release_id": report.release_id,
            "reason": report.reason,
            "details": report.details,
            "status": report.status.as_str(),
            "created_at": report.created_at,
            "resolved_at": report.resolved_at,
        })
    })))
}

#[derive(Deserialize)]
pub struct CloseReportBody {
    pub reason: String,
    #[serde(default)]
    pub dismiss: bool,
}

/// `POST /api/v1/admin/reports/{id}/close`
pub async fn close_report(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(report_id): Path<Uuid>,
    Json(body): Json<CloseReportBody>,
) -> Result<StatusCode> {
    state
        .moderation
        .close_report(&admin.actor, report_id, body.dismiss, &body.reason)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Deserialize)]
pub struct AuditQuery {
    pub subject_type: String,
    pub subject_id: String,
    #[serde(default = "default_audit_limit")]
    pub limit: i64,
}

fn default_audit_limit() -> i64 {
    100
}

/// `GET /api/v1/admin/audit`
pub async fn audit_trail(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Query(params): Query<AuditQuery>,
) -> Result<Json<serde_json::Value>> {
    let _ = admin;
    let events = state
        .moderation
        .audit_trail(&params.subject_type, &params.subject_id, params.limit)
        .await?;
    Ok(Json(serde_json::json!({
        "events": events.iter().map(|event| serde_json::json!({
            "id": event.id,
            "actor_type": event.actor_type.as_str(),
            "actor": event.actor,
            "action": event.action,
            "subject_type": event.subject_type,
            "subject_id": event.subject_id,
            "details": event.details,
            "request_id": event.request_id,
            "created_at": event.created_at,
        })).collect::<Vec<_>>(),
    })))
}
