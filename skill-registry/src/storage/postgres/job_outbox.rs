//! Job sourcing that combines Redis delivery with PostgreSQL claiming.
//!
//! The runner asks [`OutboxJobSource`] for the next batch. When Redis is
//! healthy, delivered job ids arrive with low latency and are then *claimed*
//! through the outbox (PostgreSQL stays the arbiter — a Redis message for an
//! already-claimed or completed job is simply dropped). When Redis is absent
//! or failing, the source degrades to periodic outbox polling.

use std::sync::Arc;

use crate::error::Result;
use crate::ports::job_queue::{JobDelivery, JobOutbox, OutboxJob};

pub struct OutboxJobSource {
    outbox: Arc<dyn JobOutbox>,
    delivery: Option<Arc<dyn JobDelivery>>,
    worker: String,
    lease_secs: i64,
    poll_interval_secs: u64,
}

impl OutboxJobSource {
    pub fn new(
        outbox: Arc<dyn JobOutbox>,
        delivery: Option<Arc<dyn JobDelivery>>,
        worker: String,
        lease_secs: i64,
        poll_interval_secs: u64,
    ) -> Self {
        Self { outbox, delivery, worker, lease_secs, poll_interval_secs }
    }

    pub fn worker(&self) -> &str {
        &self.worker
    }

    /// Fetch the next batch of claimed jobs, blocking up to roughly one poll
    /// interval. Returns an empty vec on idle timeout.
    pub async fn next_batch(&self, max: usize) -> Result<Vec<OutboxJob>> {
        // Fast path: claim anything already due (also drains after restarts).
        let claimed = self
            .outbox
            .claim_due(&self.worker, max as i64, self.lease_secs)
            .await?;
        if !claimed.is_empty() {
            return Ok(claimed);
        }

        // Wait for a Redis nudge when available; otherwise sleep one interval.
        match &self.delivery {
            Some(delivery) => {
                let wait_ms = self.poll_interval_secs * 1000;
                match delivery.wait_for_jobs(&self.worker, max, wait_ms).await {
                    Ok(ids) if !ids.is_empty() => {
                        // Ack the delivery entries regardless of claim outcome:
                        // PostgreSQL is the durable record, so an unclaimed id
                        // is either already done or will be re-polled.
                        let claimed = self
                            .outbox
                            .claim_due(&self.worker, max as i64, self.lease_secs)
                            .await?;
                        delivery.ack(&self.worker, &ids).await.ok();
                        Ok(claimed)
                    }
                    Ok(_) => Ok(vec![]),
                    Err(err) => {
                        // Redis degradation: log once per batch and fall back
                        // to plain polling cadence.
                        tracing::warn!(error = %err, "job delivery degraded; falling back to outbox polling");
                        tokio::time::sleep(std::time::Duration::from_secs(self.poll_interval_secs)).await;
                        Ok(vec![])
                    }
                }
            }
            None => {
                tokio::time::sleep(std::time::Duration::from_secs(self.poll_interval_secs)).await;
                Ok(vec![])
            }
        }
    }
}
