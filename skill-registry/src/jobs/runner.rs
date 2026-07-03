//! The job worker loop and the periodic enqueuer.
//!
//! Claims come from [`OutboxJobSource`] (Redis nudge + PostgreSQL claim);
//! each claimed job runs in its own task under a per-type concurrency cap,
//! with lease heartbeats so a crashed worker's jobs are reclaimed by lease
//! expiry rather than lost. Handlers are idempotent by design — the state
//! machine (scan), the batch gate (aggregate), and age checks (cleanup) all
//! tolerate duplicate execution.

use std::sync::Arc;

use tokio::sync::Semaphore;
use tokio::task::JoinSet;
use tokio_util::sync::CancellationToken;

use crate::config::JobsConfig;
use crate::jobs::{self, JobContext};
use crate::ports::job_queue::{JobOutbox, JobType, NewJob, OutboxJob};
use crate::storage::postgres::job_outbox::OutboxJobSource;

pub struct JobRunner {
    source: OutboxJobSource,
    outbox: Arc<dyn JobOutbox>,
    ctx: JobContext,
    config: JobsConfig,
}

impl JobRunner {
    pub fn new(source: OutboxJobSource, outbox: Arc<dyn JobOutbox>, ctx: JobContext, config: JobsConfig) -> Self {
        Self { source, outbox, ctx, config }
    }

    pub async fn run(self, shutdown: CancellationToken) {
        let scan_permits = Arc::new(Semaphore::new(self.config.scan_concurrency.max(1)));
        let cleanup_permits = Arc::new(Semaphore::new(self.config.cleanup_concurrency.max(1)));
        let global_permits = Arc::new(Semaphore::new(self.config.max_concurrency.max(1)));
        let mut tasks: JoinSet<()> = JoinSet::new();

        loop {
            // Reap finished tasks without blocking.
            while tasks.try_join_next().is_some() {}

            let batch = tokio::select! {
                _ = shutdown.cancelled() => break,
                batch = self.source.next_batch(self.config.max_concurrency.max(1)) => batch,
            };
            let batch = match batch {
                Ok(batch) => batch,
                Err(err) => {
                    tracing::error!(error = %err, "failed to fetch jobs; backing off");
                    tokio::select! {
                        _ = shutdown.cancelled() => break,
                        _ = tokio::time::sleep(std::time::Duration::from_secs(5)) => continue,
                    }
                }
            };

            for job in batch {
                let type_permits = match job.job_type {
                    JobType::ScanArtifact | JobType::RescanRelease => scan_permits.clone(),
                    JobType::CleanupUploads => cleanup_permits.clone(),
                    JobType::AggregateDownloads => global_permits.clone(),
                };
                let Ok(global) = global_permits.clone().acquire_owned().await else { break };
                let Ok(typed) = type_permits.acquire_owned().await else { break };
                let outbox = self.outbox.clone();
                let ctx = self.ctx.clone();
                let worker = self.source.worker().to_string();
                let lease_secs = self.config.lease_secs;
                tasks.spawn(async move {
                    let _global = global;
                    let _typed = typed;
                    run_one(outbox, ctx, worker, lease_secs, job).await;
                });
            }
        }

        // Graceful drain: let in-flight jobs finish within the lease budget.
        tracing::info!(in_flight = tasks.len(), "job runner draining");
        let drain = tokio::time::timeout(
            std::time::Duration::from_secs(self.config.lease_secs.max(10) as u64),
            async {
                while tasks.join_next().await.is_some() {}
            },
        );
        if drain.await.is_err() {
            tracing::warn!("job drain timed out; unfinished jobs will be reclaimed by lease expiry");
        }
        tracing::info!("job runner stopped");
    }
}

/// Execute one claimed job with heartbeats; record the outcome.
async fn run_one(
    outbox: Arc<dyn JobOutbox>,
    ctx: JobContext,
    worker: String,
    lease_secs: i64,
    job: OutboxJob,
) {
    let job_type = job.job_type.as_str();
    let timer = std::time::Instant::now();
    tracing::info!(job_id = %job.id, job_type, attempt = job.attempts, "job started");

    let mut handler = std::pin::pin!(dispatch(&ctx, &job));
    let mut heartbeat = tokio::time::interval(std::time::Duration::from_secs(
        (lease_secs.max(9) as u64) / 3,
    ));
    heartbeat.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
    heartbeat.tick().await; // first tick fires immediately; consume it

    let result = loop {
        tokio::select! {
            result = &mut handler => break result,
            _ = heartbeat.tick() => {
                match outbox.heartbeat(job.id, &worker, lease_secs).await {
                    Ok(true) => {}
                    Ok(false) => {
                        // Lease lost: another worker owns the job now. Stop
                        // without recording anything.
                        tracing::warn!(job_id = %job.id, job_type, "lease lost; abandoning job");
                        return;
                    }
                    Err(err) => tracing::warn!(job_id = %job.id, error = %err, "heartbeat failed"),
                }
            }
        }
    };

    ctx.metrics
        .job_duration_seconds
        .with_label_values(&[job_type])
        .observe(timer.elapsed().as_secs_f64());

    match result {
        Ok(()) => {
            if let Err(err) = outbox.complete(job.id, &worker).await {
                tracing::error!(job_id = %job.id, error = %err, "failed to mark job completed");
            }
            ctx.metrics.job_runs_total.with_label_values(&[job_type, "ok"]).inc();
            tracing::info!(job_id = %job.id, job_type, elapsed_ms = timer.elapsed().as_millis() as u64, "job completed");
        }
        Err(err) => {
            let retryable = jobs::is_retryable(&err);
            ctx.metrics.job_runs_total.with_label_values(&[job_type, "error"]).inc();
            if retryable && job.attempts < job.max_attempts {
                ctx.metrics.job_retries_total.with_label_values(&[job_type]).inc();
            } else {
                ctx.metrics.job_dead_letters_total.with_label_values(&[job_type]).inc();
            }
            tracing::warn!(job_id = %job.id, job_type, retryable, error = %err, "job failed");
            if let Err(record_err) = outbox.fail(job.id, &worker, &err.to_string(), retryable).await {
                tracing::error!(job_id = %job.id, error = %record_err, "failed to record job failure");
            }
        }
    }
}

async fn dispatch(ctx: &JobContext, job: &OutboxJob) -> crate::error::Result<()> {
    match job.job_type {
        JobType::ScanArtifact => jobs::scan_artifact::handle(ctx, job).await,
        JobType::RescanRelease => jobs::rescan_release::handle(ctx, job).await,
        JobType::AggregateDownloads => jobs::aggregate_downloads::handle(ctx, job).await,
        JobType::CleanupUploads => jobs::cleanup_uploads::handle(ctx, job).await,
    }
}

/// Enqueue periodic work with time-bucketed idempotency keys: any number of
/// processes may run this loop; the outbox unique index guarantees exactly
/// one job per type per interval.
pub async fn periodic_enqueuer(
    outbox: Arc<dyn JobOutbox>,
    config: JobsConfig,
    shutdown: CancellationToken,
) {
    let flush_secs = config.counter_flush_interval_secs.max(30);
    // Cleanup cadence: hourly is plenty; the min-age gate does the real work.
    let cleanup_secs: u64 = 3600;
    let mut ticker = tokio::time::interval(std::time::Duration::from_secs(30));
    ticker.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);

    loop {
        tokio::select! {
            _ = shutdown.cancelled() => break,
            _ = ticker.tick() => {}
        }
        let now = chrono::Utc::now().timestamp() as u64;
        let entries = [
            (JobType::AggregateDownloads, now / flush_secs, "aggregate"),
            (JobType::CleanupUploads, now / cleanup_secs, "cleanup"),
        ];
        for (job_type, bucket, prefix) in entries {
            let job = NewJob::now(job_type, serde_json::json!({}))
                .with_idempotency(format!("{prefix}:{bucket}"));
            match outbox.enqueue(job).await {
                Ok(_) => {}
                // Conflict = this interval's job already exists. Expected.
                Err(crate::error::RegistryError::Conflict { .. }) => {}
                Err(err) => tracing::warn!(job_type = job_type.as_str(), error = %err, "periodic enqueue failed"),
            }
        }
    }
    tracing::info!("periodic enqueuer stopped");
}
