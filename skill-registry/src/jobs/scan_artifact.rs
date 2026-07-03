//! `scan_artifact` handler: first scan of a freshly uploaded release.

use crate::error::{RegistryError, Result};
use crate::jobs::JobContext;
use crate::ports::job_queue::{OutboxJob, ScanArtifactPayload};

pub async fn handle(ctx: &JobContext, job: &OutboxJob) -> Result<()> {
    let payload: ScanArtifactPayload = serde_json::from_value(job.payload.clone())
        .map_err(|e| RegistryError::validation("BAD_JOB_PAYLOAD", format!("scan_artifact payload: {e}")))?;
    let outcome = ctx
        .scan_service
        .scan_release(payload.release_id, Some(&payload.digest))
        .await?;
    tracing::info!(
        release_id = %payload.release_id,
        slug = %payload.slug,
        version = %payload.version,
        outcome = ?outcome,
        "scan completed"
    );
    Ok(())
}
