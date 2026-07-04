//! Abuse report routes (filing; moderation processing lives in admin.rs).

use axum::extract::{Path, State};
use axum::Json;
use uuid::Uuid;

use crate::api::dto::ReportRequest;
use crate::api::middleware::RequireUser;
use crate::api::ApiState;
use crate::domain::moderation::{Report, ReportReason, ReportSubjectType};
use crate::error::{codes, HubError, Result};

fn parse_reason(raw: &str) -> Result<ReportReason> {
    ReportReason::parse(raw).ok_or_else(|| {
        HubError::validation(codes::INVALID_PARAM, format!("unknown reason {raw:?}"))
    })
}

/// POST /api/v1/posts/:id/report
pub async fn report_post(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(post_id): Path<Uuid>,
    Json(request): Json<ReportRequest>,
) -> Result<Json<Report>> {
    state.abuse.check_report(ctx.user.id).await?;
    let report = state
        .moderation
        .file_report(
            &ctx,
            ReportSubjectType::Post,
            post_id,
            parse_reason(&request.reason)?,
            &request.detail,
        )
        .await?;
    Ok(Json(report))
}

/// POST /api/v1/comments/:id/report
pub async fn report_comment(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(comment_id): Path<Uuid>,
    Json(request): Json<ReportRequest>,
) -> Result<Json<Report>> {
    state.abuse.check_report(ctx.user.id).await?;
    let report = state
        .moderation
        .file_report(
            &ctx,
            ReportSubjectType::Comment,
            comment_id,
            parse_reason(&request.reason)?,
            &request.detail,
        )
        .await?;
    Ok(Json(report))
}

/// GET /api/v1/me/reports
pub async fn my_reports(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
) -> Result<Json<Vec<Report>>> {
    Ok(Json(state.moderation.my_reports(&ctx).await?))
}
