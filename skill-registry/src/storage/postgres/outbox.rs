//! Durable job outbox persistence (PostgreSQL implementation of [`JobOutbox`]).
//!
//! Rows are written inside business transactions (see
//! `repositories::insert_outbox_job`) so committed state can never lose its
//! follow-up work. Claiming uses `FOR UPDATE SKIP LOCKED` with leases;
//! expired leases are reclaimable, so a crashed worker's jobs recover.

use async_trait::async_trait;
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::error::{RegistryError, Result};
use crate::ports::job_queue::{JobOutbox, JobType, NewJob, OutboxJob};

use super::models::OutboxJobRow;

const JOB_COLUMNS: &str = "id, job_type, schema_version, payload, status, trace_id, idempotency_key, attempts, max_attempts, run_at, lease_owner, lease_expires_at, last_error, dead_letter_reason, created_at, updated_at";

#[derive(Clone)]
pub struct PgJobOutbox {
    pool: PgPool,
    max_attempts_default: i32,
    retry_backoff_secs: i64,
}

impl PgJobOutbox {
    pub fn new(pool: PgPool, max_attempts_default: i32, retry_backoff_secs: i64) -> Self {
        Self { pool, max_attempts_default, retry_backoff_secs }
    }
}

#[async_trait]
impl JobOutbox for PgJobOutbox {
    async fn enqueue(&self, job: NewJob) -> Result<Uuid> {
        let id = super::repositories::insert_outbox_job(&self.pool, &job, self.max_attempts_default).await?;
        match id {
            Some(id) => Ok(id),
            // Duplicate idempotency key: fetch the existing job id.
            None => {
                let key = job.idempotency_key.as_deref().unwrap_or_default();
                let row = sqlx::query("SELECT id FROM job_outbox WHERE idempotency_key = $1")
                    .bind(key)
                    .fetch_one(&self.pool)
                    .await?;
                Ok(row.get("id"))
            }
        }
    }

    async fn claim_due(&self, worker: &str, limit: i64, lease_secs: i64) -> Result<Vec<OutboxJob>> {
        // Claims pending jobs, dispatched jobs whose delivery grace elapsed,
        // and running jobs whose lease expired (crash recovery).
        let rows: Vec<OutboxJobRow> = sqlx::query_as(&format!(
            "WITH due AS (
                SELECT id FROM job_outbox
                WHERE run_at <= now()
                  AND (
                        status = 'pending'
                     OR (status = 'dispatched' AND updated_at < now() - interval '60 seconds')
                     OR (status = 'running' AND lease_expires_at < now())
                  )
                ORDER BY run_at
                LIMIT $2
                FOR UPDATE SKIP LOCKED
             )
             UPDATE job_outbox j SET
                status = 'running',
                lease_owner = $1,
                lease_expires_at = now() + make_interval(secs => $3),
                attempts = j.attempts + 1,
                updated_at = now()
             FROM due WHERE j.id = due.id
             RETURNING {JOB_COLUMNS}"
        ))
        .bind(worker)
        .bind(limit)
        .bind(lease_secs as f64)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn heartbeat(&self, job_id: Uuid, worker: &str, lease_secs: i64) -> Result<bool> {
        let result = sqlx::query(
            "UPDATE job_outbox SET lease_expires_at = now() + make_interval(secs => $3), updated_at = now()
             WHERE id = $1 AND lease_owner = $2 AND status = 'running'",
        )
        .bind(job_id)
        .bind(worker)
        .bind(lease_secs as f64)
        .execute(&self.pool)
        .await?;
        Ok(result.rows_affected() > 0)
    }

    async fn complete(&self, job_id: Uuid, worker: &str) -> Result<()> {
        let result = sqlx::query(
            "UPDATE job_outbox SET status = 'completed', lease_owner = NULL,
                    lease_expires_at = NULL, updated_at = now()
             WHERE id = $1 AND lease_owner = $2 AND status = 'running'",
        )
        .bind(job_id)
        .bind(worker)
        .execute(&self.pool)
        .await?;
        if result.rows_affected() == 0 {
            return Err(RegistryError::invalid_state(
                "JOB_LEASE_LOST",
                "job lease lost before completion; another worker may rerun it",
            ));
        }
        Ok(())
    }

    async fn fail(&self, job_id: Uuid, worker: &str, error: &str, retryable: bool) -> Result<()> {
        // Exponential backoff: backoff * 2^(attempts-1), capped at 1 hour.
        let error = truncate(error, 2000);
        let result = sqlx::query(
            "UPDATE job_outbox SET
                status = CASE
                    WHEN NOT $4 OR attempts >= max_attempts THEN 'dead_lettered'
                    ELSE 'pending' END,
                dead_letter_reason = CASE
                    WHEN NOT $4 OR attempts >= max_attempts THEN $3
                    ELSE dead_letter_reason END,
                run_at = CASE
                    WHEN $4 AND attempts < max_attempts
                    THEN now() + make_interval(secs => LEAST($5 * power(2, GREATEST(attempts - 1, 0)), 3600))
                    ELSE run_at END,
                last_error = $3,
                lease_owner = NULL,
                lease_expires_at = NULL,
                updated_at = now()
             WHERE id = $1 AND lease_owner = $2 AND status = 'running'",
        )
        .bind(job_id)
        .bind(worker)
        .bind(&error)
        .bind(retryable)
        .bind(self.retry_backoff_secs as f64)
        .execute(&self.pool)
        .await?;
        if result.rows_affected() == 0 {
            tracing::warn!(%job_id, "fail() on a job whose lease was already lost");
        }
        Ok(())
    }

    async fn pending_for_dispatch(&self, limit: i64) -> Result<Vec<OutboxJob>> {
        let rows: Vec<OutboxJobRow> = sqlx::query_as(&format!(
            "SELECT {JOB_COLUMNS} FROM job_outbox
             WHERE status = 'pending' AND run_at <= now()
             ORDER BY run_at LIMIT $1"
        ))
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn mark_dispatched(&self, job_ids: &[Uuid]) -> Result<()> {
        sqlx::query(
            "UPDATE job_outbox SET status = 'dispatched', updated_at = now()
             WHERE id = ANY($1) AND status = 'pending'",
        )
        .bind(job_ids)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    async fn dead_letters(&self, limit: i64) -> Result<Vec<OutboxJob>> {
        let rows: Vec<OutboxJobRow> = sqlx::query_as(&format!(
            "SELECT {JOB_COLUMNS} FROM job_outbox WHERE status = 'dead_lettered'
             ORDER BY updated_at DESC LIMIT $1"
        ))
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        rows.into_iter().map(|r| r.into_domain()).collect()
    }

    async fn requeue_dead_letter(&self, job_id: Uuid) -> Result<bool> {
        let result = sqlx::query(
            "UPDATE job_outbox SET status = 'pending', attempts = 0, run_at = now(),
                    dead_letter_reason = NULL, updated_at = now()
             WHERE id = $1 AND status = 'dead_lettered'",
        )
        .bind(job_id)
        .execute(&self.pool)
        .await?;
        Ok(result.rows_affected() > 0)
    }

    async fn backlog_counts(&self) -> Result<Vec<(JobType, i64)>> {
        let rows: Vec<(String, i64)> = sqlx::query_as(
            "SELECT job_type, count(*) FROM job_outbox
             WHERE status IN ('pending', 'dispatched', 'running')
             GROUP BY job_type",
        )
        .fetch_all(&self.pool)
        .await?;
        Ok(rows
            .into_iter()
            .filter_map(|(t, c)| JobType::parse(&t).map(|t| (t, c)))
            .collect())
    }

    async fn get(&self, job_id: Uuid) -> Result<Option<OutboxJob>> {
        let row: Option<OutboxJobRow> = sqlx::query_as(&format!(
            "SELECT {JOB_COLUMNS} FROM job_outbox WHERE id = $1"
        ))
        .bind(job_id)
        .fetch_optional(&self.pool)
        .await?;
        row.map(|r| r.into_domain()).transpose()
    }
}

fn truncate(s: &str, max: usize) -> String {
    if s.len() <= max {
        s.to_string()
    } else {
        let mut end = max;
        while !s.is_char_boundary(end) {
            end -= 1;
        }
        s[..end].to_string()
    }
}
