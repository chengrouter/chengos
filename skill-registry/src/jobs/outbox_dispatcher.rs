//! Outbox dispatcher: pushes committed pending jobs into Redis Streams for
//! low-latency pickup and keeps backlog gauges fresh.
//!
//! Purely an accelerator loop. If Redis is absent or `notify` fails, jobs are
//! left `pending` and workers find them by polling — nothing is lost, work is
//! only slower. `mark_dispatched` runs *after* a successful notify; a crash
//! in between re-notifies (workers tolerate duplicate delivery because the
//! outbox claim is the single arbiter).

use std::sync::Arc;

use tokio_util::sync::CancellationToken;

use crate::ports::job_queue::{JobDelivery, JobOutbox};
use crate::telemetry::metrics::SharedMetrics;

pub struct OutboxDispatcher {
    outbox: Arc<dyn JobOutbox>,
    delivery: Option<Arc<dyn JobDelivery>>,
    poll_interval_secs: u64,
    metrics: SharedMetrics,
}

impl OutboxDispatcher {
    pub fn new(
        outbox: Arc<dyn JobOutbox>,
        delivery: Option<Arc<dyn JobDelivery>>,
        poll_interval_secs: u64,
        metrics: SharedMetrics,
    ) -> Self {
        Self { outbox, delivery, poll_interval_secs, metrics }
    }

    pub async fn run(self, shutdown: CancellationToken) {
        let mut ticker = tokio::time::interval(std::time::Duration::from_secs(
            self.poll_interval_secs.max(1),
        ));
        ticker.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
        loop {
            tokio::select! {
                _ = shutdown.cancelled() => break,
                _ = ticker.tick() => {}
            }
            if let Err(err) = self.tick().await {
                tracing::warn!(error = %err, "outbox dispatch tick failed");
            }
        }
        tracing::info!("outbox dispatcher stopped");
    }

    async fn tick(&self) -> crate::error::Result<()> {
        // Backlog gauges (also useful without Redis).
        if let Ok(counts) = self.outbox.backlog_counts().await {
            for (job_type, count) in counts {
                self.metrics
                    .job_backlog
                    .with_label_values(&[job_type.as_str()])
                    .set(count);
            }
        }

        let Some(delivery) = &self.delivery else { return Ok(()) };
        let pending = self.outbox.pending_for_dispatch(200).await?;
        if pending.is_empty() {
            return Ok(());
        }
        if delivery.notify(&pending).await.is_ok() {
            let ids: Vec<_> = pending.iter().map(|j| j.id).collect();
            self.outbox.mark_dispatched(&ids).await?;
        }
        Ok(())
    }
}
