//! Background job system.
//!
//! PostgreSQL's `job_outbox` is the durable record of required work; Redis
//! Streams only accelerates delivery. The [`runner`] claims jobs through
//! leases (crash recovery = lease expiry), executes typed handlers, and
//! retries with exponential backoff until success or dead-letter. The
//! [`outbox_dispatcher`] pushes committed jobs into Redis and keeps backlog
//! gauges fresh. Periodic work (counter aggregation, upload cleanup) is
//! enqueued by [`runner::periodic_enqueuer`] with time-bucketed idempotency
//! keys so exactly one instance runs per interval across processes.

pub mod aggregate_downloads;
pub mod cleanup_uploads;
pub mod outbox_dispatcher;
pub mod rescan_release;
pub mod runner;
pub mod scan_artifact;

use std::sync::Arc;

use crate::config::{ArtifactConfig, JobsConfig};
use crate::ports::artifact_store::ArtifactStore;
use crate::ports::counters::DownloadCounters;
use crate::ports::repositories::{ArtifactRepo, DownloadStatsRepo};
use crate::services::scan_service::ScanService;
use crate::telemetry::metrics::SharedMetrics;

/// Everything job handlers need, cloned into each worker task.
#[derive(Clone)]
pub struct JobContext {
    pub scan_service: Arc<ScanService>,
    pub counters: Arc<dyn DownloadCounters>,
    pub download_stats: Arc<dyn DownloadStatsRepo>,
    pub artifact_repo: Arc<dyn ArtifactRepo>,
    pub artifact_store: Arc<dyn ArtifactStore>,
    pub artifact_config: ArtifactConfig,
    pub jobs_config: JobsConfig,
    pub metrics: SharedMetrics,
}

/// Whether a failed job should retry. Validation/policy failures are
/// deterministic — retrying cannot succeed — so they dead-letter immediately.
pub fn is_retryable(err: &crate::error::RegistryError) -> bool {
    use crate::error::RegistryError::*;
    !matches!(err, Validation { .. } | PackageInvalid { .. } | NotFound(_) | InvalidState { .. })
}
