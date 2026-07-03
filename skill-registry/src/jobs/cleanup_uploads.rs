//! `cleanup_uploads` handler: reclaim disk from crashed/abandoned work.
//!
//! * Orphan spool/`.part` files older than `cleanup_min_age_secs` — leftovers
//!   from process crashes mid-upload.
//! * Unreferenced artifact records (no release binding) past the same age —
//!   uploads whose publish transaction never committed. The database row is
//!   deleted only after the bytes are gone, so a crash between the two leaves
//!   a re-discoverable record, never an untracked file.

use std::time::{Duration, SystemTime};

use chrono::Utc;

use crate::error::Result;
use crate::jobs::JobContext;
use crate::ports::job_queue::OutboxJob;

pub async fn handle(ctx: &JobContext, _job: &OutboxJob) -> Result<()> {
    let min_age_secs = ctx.jobs_config.cleanup_min_age_secs.max(60) as u64;

    // 1. Orphan work files (spool + .part) under the artifact work dir.
    let work_dir = ctx.artifact_config.root.join(&ctx.artifact_config.work_dir);
    let mut removed_files = 0usize;
    if let Ok(mut dir) = tokio::fs::read_dir(&work_dir).await {
        let cutoff = SystemTime::now() - Duration::from_secs(min_age_secs);
        while let Ok(Some(entry)) = dir.next_entry().await {
            let Ok(meta) = entry.metadata().await else { continue };
            if !meta.is_file() {
                continue;
            }
            let old_enough = meta.modified().map(|m| m < cutoff).unwrap_or(false);
            if old_enough && tokio::fs::remove_file(entry.path()).await.is_ok() {
                removed_files += 1;
            }
        }
    }

    // 2. Unreferenced artifacts: bytes first, then the record.
    let older_than = Utc::now() - chrono::Duration::seconds(min_age_secs as i64);
    let orphans = ctx.artifact_repo.unreferenced(older_than, 100).await?;
    ctx.metrics.unreferenced_artifacts.set(orphans.len() as i64);
    let mut removed_artifacts = 0usize;
    for artifact in orphans {
        if let Err(err) = ctx.artifact_store.delete_unreferenced(&artifact.storage_key).await {
            tracing::warn!(digest = %artifact.digest, error = %err, "failed to delete unreferenced artifact bytes");
            continue;
        }
        if ctx.artifact_repo.delete(artifact.id).await? {
            removed_artifacts += 1;
        }
    }

    // Refresh storage gauges while we're here.
    if let Ok((count, bytes)) = ctx.artifact_repo.stats().await {
        ctx.metrics.artifact_count.set(count);
        ctx.metrics.artifact_bytes.set(bytes);
    }

    if removed_files > 0 || removed_artifacts > 0 {
        tracing::info!(removed_files, removed_artifacts, "cleanup pass finished");
    }
    Ok(())
}
