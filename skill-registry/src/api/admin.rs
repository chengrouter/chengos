//! Operational admin endpoints (admin-token authenticated): job dead-letter
//! management and Prometheus metrics.

use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::Json;
use serde::Deserialize;
use uuid::Uuid;

use crate::api::middleware::RequireAdmin;
use crate::api::ApiState;
use crate::error::{RegistryError, Result};

#[derive(Deserialize)]
pub struct DeadLettersQuery {
    #[serde(default = "default_limit")]
    pub limit: i64,
}

fn default_limit() -> i64 {
    50
}

/// `GET /api/v1/admin/jobs/dead-letters`
pub async fn dead_letters(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Query(params): Query<DeadLettersQuery>,
) -> Result<Json<serde_json::Value>> {
    let _ = admin;
    let jobs = state.jobs.dead_letters(params.limit.clamp(1, 500)).await?;
    Ok(Json(serde_json::json!({
        "jobs": jobs.iter().map(|job| serde_json::json!({
            "id": job.id,
            "job_type": job.job_type.as_str(),
            "attempts": job.attempts,
            "max_attempts": job.max_attempts,
            "last_error": job.last_error,
            "dead_letter_reason": job.dead_letter_reason,
            "created_at": job.created_at,
            "updated_at": job.updated_at,
        })).collect::<Vec<_>>(),
    })))
}

/// `POST /api/v1/admin/jobs/{id}/requeue`
pub async fn requeue_job(
    State(state): State<ApiState>,
    admin: RequireAdmin,
    Path(job_id): Path<Uuid>,
) -> Result<StatusCode> {
    let _ = admin;
    if state.jobs.requeue_dead_letter(job_id).await? {
        Ok(StatusCode::ACCEPTED)
    } else {
        Err(RegistryError::NotFound("job"))
    }
}

/// `GET /metrics` — Prometheus exposition. Restrict at the proxy in
/// production (see `deploy/nginx.conf.example`).
pub async fn metrics(State(state): State<ApiState>) -> ([(&'static str, &'static str); 1], String) {
    (
        [("content-type", "text/plain; version=0.0.4")],
        state.metrics.render(),
    )
}
