//! Background job types and queue interfaces.
//!
//! PostgreSQL (`job_outbox`) is the durable record of required work; Redis
//! Streams is an optional fast delivery layer. A committed business
//! transaction that needs follow-up work MUST have committed an outbox row in
//! the same transaction — Redis enqueue failures must never lose work.

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::Result;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum JobType {
    ScanArtifact,
    RescanRelease,
    AggregateDownloads,
    CleanupUploads,
}

impl JobType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::ScanArtifact => "scan_artifact",
            Self::RescanRelease => "rescan_release",
            Self::AggregateDownloads => "aggregate_downloads",
            Self::CleanupUploads => "cleanup_uploads",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "scan_artifact" => Self::ScanArtifact,
            "rescan_release" => Self::RescanRelease,
            "aggregate_downloads" => Self::AggregateDownloads,
            "cleanup_uploads" => Self::CleanupUploads,
            _ => return None,
        })
    }
    pub const ALL: &'static [JobType] = &[
        Self::ScanArtifact,
        Self::RescanRelease,
        Self::AggregateDownloads,
        Self::CleanupUploads,
    ];
}

/// Typed payloads (serialized as JSON into the outbox row).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanArtifactPayload {
    pub release_id: Uuid,
    /// Digest cross-check; the artifact itself is resolved from the release
    /// row at scan time (the payload is never trusted for artifact identity).
    pub digest: String,
    /// Request slug/version for cross-checking during scan.
    pub publisher_handle: String,
    pub slug: String,
    pub version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RescanReleasePayload {
    pub release_id: Uuid,
    pub reason: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AggregateDownloadsPayload {}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CleanupUploadsPayload {}

/// A job to enqueue (written inside business transactions).
#[derive(Debug, Clone)]
pub struct NewJob {
    pub job_type: JobType,
    /// Payload schema version for forward compatibility.
    pub schema_version: i32,
    pub payload: serde_json::Value,
    /// Correlates job logs with the originating request.
    pub trace_id: Option<String>,
    /// Prevents duplicate enqueue for the same logical work.
    pub idempotency_key: Option<String>,
    pub run_at: DateTime<Utc>,
}

impl NewJob {
    pub fn now(job_type: JobType, payload: serde_json::Value) -> Self {
        Self {
            job_type,
            schema_version: 1,
            payload,
            trace_id: None,
            idempotency_key: None,
            run_at: Utc::now(),
        }
    }
    pub fn with_idempotency(mut self, key: impl Into<String>) -> Self {
        self.idempotency_key = Some(key.into());
        self
    }
    pub fn with_trace(mut self, trace_id: Option<String>) -> Self {
        self.trace_id = trace_id;
        self
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum JobStatus {
    /// Committed, waiting for dispatch/claim.
    Pending,
    /// Handed to Redis Streams (still recoverable from the outbox on loss).
    Dispatched,
    /// Claimed by a worker holding a lease.
    Running,
    Completed,
    /// Failed permanently after max attempts.
    DeadLettered,
}

impl JobStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Pending => "pending",
            Self::Dispatched => "dispatched",
            Self::Running => "running",
            Self::Completed => "completed",
            Self::DeadLettered => "dead_lettered",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "pending" => Self::Pending,
            "dispatched" => Self::Dispatched,
            "running" => Self::Running,
            "completed" => Self::Completed,
            "dead_lettered" => Self::DeadLettered,
            _ => return None,
        })
    }
}

/// A durable outbox job row.
#[derive(Debug, Clone)]
pub struct OutboxJob {
    pub id: Uuid,
    pub job_type: JobType,
    pub schema_version: i32,
    pub payload: serde_json::Value,
    pub status: JobStatus,
    pub trace_id: Option<String>,
    pub idempotency_key: Option<String>,
    pub attempts: i32,
    pub max_attempts: i32,
    pub run_at: DateTime<Utc>,
    pub lease_owner: Option<String>,
    pub lease_expires_at: Option<DateTime<Utc>>,
    pub last_error: Option<String>,
    pub dead_letter_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Durable outbox operations (implemented by PostgreSQL).
#[async_trait]
pub trait JobOutbox: Send + Sync {
    /// Standalone enqueue (business-transaction enqueues go through the
    /// repository composite operations instead).
    async fn enqueue(&self, job: NewJob) -> Result<Uuid>;

    /// Atomically claim up to `limit` due jobs for `worker`, setting a lease.
    /// Reclaims jobs whose lease has expired (worker crash recovery).
    async fn claim_due(&self, worker: &str, limit: i64, lease_secs: i64) -> Result<Vec<OutboxJob>>;

    /// Extend the lease for a long-running job. Returns false when the lease
    /// was lost (another worker reclaimed it) — the job must stop.
    async fn heartbeat(&self, job_id: Uuid, worker: &str, lease_secs: i64) -> Result<bool>;

    async fn complete(&self, job_id: Uuid, worker: &str) -> Result<()>;

    /// Record a failure; schedules a retry with backoff or dead-letters after
    /// max attempts (or immediately when `retryable` is false).
    async fn fail(&self, job_id: Uuid, worker: &str, error: &str, retryable: bool) -> Result<()>;

    /// Jobs pending Redis dispatch (status = pending, due now).
    async fn pending_for_dispatch(&self, limit: i64) -> Result<Vec<OutboxJob>>;

    /// Mark handed to Redis. Dispatched jobs remain reclaimable after a grace
    /// period so a lost Redis message cannot lose the work.
    async fn mark_dispatched(&self, job_ids: &[Uuid]) -> Result<()>;

    async fn dead_letters(&self, limit: i64) -> Result<Vec<OutboxJob>>;

    /// Reset a dead-lettered job for another attempt (admin operation).
    async fn requeue_dead_letter(&self, job_id: Uuid) -> Result<bool>;

    /// Backlog per job type for metrics/backpressure.
    async fn backlog_counts(&self) -> Result<Vec<(JobType, i64)>>;

    async fn get(&self, job_id: Uuid) -> Result<Option<OutboxJob>>;
}

/// Fast delivery layer (Redis Streams). Purely an accelerator: losing it must
/// only add latency (outbox polling picks the work up).
#[async_trait]
pub trait JobDelivery: Send + Sync {
    /// Push job ids for immediate pickup. Failures are non-fatal.
    async fn notify(&self, jobs: &[OutboxJob]) -> Result<()>;

    /// Block up to `timeout_ms` for delivered job ids.
    async fn wait_for_jobs(&self, worker: &str, max: usize, timeout_ms: u64) -> Result<Vec<Uuid>>;

    /// Acknowledge processed delivery entries for this worker.
    async fn ack(&self, worker: &str, job_ids: &[Uuid]) -> Result<()>;
}
