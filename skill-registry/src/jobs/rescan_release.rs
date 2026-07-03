//! `rescan_release` handler: re-scan a visible release under current policy.

use crate::error::{RegistryError, Result};
use crate::jobs::JobContext;
use crate::ports::job_queue::{OutboxJob, RescanReleasePayload};

pub async fn handle(ctx: &JobContext, job: &OutboxJob) -> Result<()> {
    let payload: RescanReleasePayload = serde_json::from_value(job.payload.clone())
        .map_err(|e| RegistryError::validation("BAD_JOB_PAYLOAD", format!("rescan_release payload: {e}")))?;
    let outcome = ctx.scan_service.rescan_release(payload.release_id).await?;
    tracing::info!(
        release_id = %payload.release_id,
        reason = %payload.reason,
        outcome = ?outcome,
        "rescan completed"
    );
    Ok(())
}
