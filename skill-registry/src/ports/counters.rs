//! Privacy-preserving download counter port.
//!
//! Counters are an *approximation accelerator*: increments land in Redis and
//! a periodic job seals them into idempotent batches persisted to PostgreSQL
//! (`download_counter_batches` gate + daily aggregates). Losing Redis loses at
//! most the unsealed window — never previously persisted totals. Client
//! identity is reduced to an HMAC bucket before it reaches this port; raw IPs
//! or user identifiers must never be passed in.

use async_trait::async_trait;
use chrono::NaiveDate;

use crate::domain::release::ReleaseId;

/// A sealed, idempotently-appliable batch of per-release counts.
#[derive(Debug, Clone)]
pub struct CounterBatch {
    /// Unique id; PostgreSQL uses it as an ON CONFLICT DO NOTHING gate so a
    /// batch applied twice (crash between apply and ack) counts once.
    pub batch_id: String,
    /// The UTC day the counts belong to.
    pub day: NaiveDate,
    pub counts: Vec<(ReleaseId, i64)>,
}

#[async_trait]
pub trait DownloadCounters: Send + Sync {
    /// Record one download for `release_id`, deduplicated by `bucket` within
    /// the counting window. Returns true when the event was newly counted.
    /// Best-effort: failures return false and must not fail the download.
    async fn record(&self, release_id: ReleaseId, bucket: &str) -> bool;

    /// Seal the current live window into a batch (if non-empty) and return
    /// every batch not yet acknowledged — including batches sealed by a
    /// previous process that crashed before `ack`.
    async fn seal_and_list(&self) -> Vec<CounterBatch>;

    /// Acknowledge that a batch has been durably persisted; the accelerator
    /// may discard it.
    async fn ack(&self, batch_id: &str);
}

/// Used when Redis is disabled: downloads simply aren't counted (documented
/// degradation; the catalog keeps serving previously persisted totals).
pub struct NoopCounters;

#[async_trait]
impl DownloadCounters for NoopCounters {
    async fn record(&self, _release_id: ReleaseId, _bucket: &str) -> bool {
        false
    }
    async fn seal_and_list(&self) -> Vec<CounterBatch> {
        vec![]
    }
    async fn ack(&self, _batch_id: &str) {}
}
