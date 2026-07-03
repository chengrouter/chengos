//! Liveness and readiness probes.
//!
//! * `/health/live` — process is up. Always 200 while serving.
//! * `/health/ready` — 200 only when PostgreSQL answers and the artifact
//!   root is reachable. Redis is reported but never gates readiness (it is
//!   an accelerator); a draining process reports 503 so load balancers stop
//!   sending traffic before connections close.

use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;

use crate::api::ApiState;

pub struct HealthState {
    pool: sqlx::PgPool,
    artifact_root: PathBuf,
    redis_enabled: bool,
    shutting_down: AtomicBool,
}

impl HealthState {
    pub fn new(pool: sqlx::PgPool, artifact_root: PathBuf, redis_enabled: bool) -> Self {
        Self {
            pool,
            artifact_root,
            redis_enabled,
            shutting_down: AtomicBool::new(false),
        }
    }

    /// Flip readiness off at the start of graceful shutdown.
    pub fn begin_shutdown(&self) {
        self.shutting_down.store(true, Ordering::SeqCst);
    }
}

pub async fn live() -> (StatusCode, Json<serde_json::Value>) {
    (StatusCode::OK, Json(serde_json::json!({ "status": "live" })))
}

pub async fn ready(State(state): State<ApiState>) -> (StatusCode, Json<serde_json::Value>) {
    let health = &state.health;
    if health.shutting_down.load(Ordering::SeqCst) {
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(serde_json::json!({ "status": "draining" })),
        );
    }

    let db_ok = tokio::time::timeout(
        Duration::from_secs(2),
        sqlx::query("SELECT 1").execute(&health.pool),
    )
    .await
    .map(|r| r.is_ok())
    .unwrap_or(false);
    let storage_ok = tokio::fs::metadata(&health.artifact_root)
        .await
        .map(|m| m.is_dir())
        .unwrap_or(false);

    let status = if db_ok && storage_ok { StatusCode::OK } else { StatusCode::SERVICE_UNAVAILABLE };
    let body = serde_json::json!({
        "status": if status == StatusCode::OK { "ready" } else { "unready" },
        "checks": {
            "database": db_ok,
            "artifact_storage": storage_ok,
            // Informational only; Redis loss degrades, never gates.
            "redis_configured": health.redis_enabled,
        }
    });
    (status, Json(body))
}
