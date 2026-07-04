//! Sanitized workflow share routes. Creation requires authentication;
//! public reads only expose stored (validated) content.

use axum::extract::{Path, State};
use axum::Json;
use uuid::Uuid;

use crate::api::dto::WorkflowShareDto;
use crate::api::middleware::{MaybeUser, RequireUser};
use crate::api::ApiState;
use crate::domain::workflow_share::NewWorkflowShare;
use crate::error::Result;
use crate::services::post_service::viewer_of_opt;

/// POST /api/v1/workflow-shares
pub async fn create(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Json(request): Json<NewWorkflowShare>,
) -> Result<Json<WorkflowShareDto>> {
    state.abuse.check_share(ctx.user.id).await?;
    let share = state.shares.create(&ctx, request).await?;
    let viewer = crate::services::post_service::viewer_of(&ctx);
    let detail = state.shares.detail(share.id, &viewer).await?;
    Ok(Json(WorkflowShareDto::from_parts(
        &detail.share,
        detail.required_variables,
        detail.safety_findings,
    )))
}

/// GET /api/v1/workflow-shares/:id — metadata, variables, findings.
pub async fn detail(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
    MaybeUser(user): MaybeUser,
) -> Result<Json<WorkflowShareDto>> {
    let viewer = viewer_of_opt(user.as_ref());
    let detail = state.shares.detail(id, &viewer).await?;
    Ok(Json(WorkflowShareDto::from_parts(
        &detail.share,
        detail.required_variables,
        detail.safety_findings,
    )))
}

/// GET /api/v1/workflow-shares/:id/payload — the sanitized workflow
/// document for import.
pub async fn payload(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
    MaybeUser(user): MaybeUser,
) -> Result<Json<serde_json::Value>> {
    let viewer = viewer_of_opt(user.as_ref());
    Ok(Json(state.shares.payload(id, &viewer).await?))
}
