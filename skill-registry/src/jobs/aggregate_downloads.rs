//! `aggregate_downloads` handler: flush Redis download counters into the
//! durable PostgreSQL aggregates.
//!
//! Idempotent end-to-end: `seal_and_list` returns sealed batches (including
//! ones a crashed predecessor never acked); `add_daily_counts` gates on the
//! batch id with ON CONFLICT DO NOTHING; `ack` only runs after the durable
//! write succeeds. Any crash point replays without double counting.

use crate::error::Result;
use crate::jobs::JobContext;
use crate::ports::job_queue::OutboxJob;

pub async fn handle(ctx: &JobContext, _job: &OutboxJob) -> Result<()> {
    let batches = ctx.counters.seal_and_list().await;
    if batches.is_empty() {
        return Ok(());
    }
    let mut flushed_batches = 0usize;
    let mut flushed_events: i64 = 0;
    for batch in batches {
        ctx.download_stats
            .add_daily_counts(batch.day, &batch.batch_id, &batch.counts)
            .await?;
        ctx.counters.ack(&batch.batch_id).await;
        flushed_batches += 1;
        flushed_events += batch.counts.iter().map(|(_, n)| *n).sum::<i64>();
    }
    tracing::info!(flushed_batches, flushed_events, "download counters flushed");
    Ok(())
}
