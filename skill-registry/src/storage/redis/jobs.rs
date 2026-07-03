//! Redis Streams job delivery (accelerator over the PostgreSQL outbox).
//!
//! The dispatcher XADDs committed outbox job ids to one stream; workers
//! block on XREADGROUP for low-latency pickup. Every failure path degrades
//! to outbox polling: a lost stream entry only delays the job until the
//! dispatched-grace reclaim, never loses it.

use std::collections::HashMap;

use async_trait::async_trait;
use redis::streams::{StreamReadOptions, StreamReadReply};
use redis::AsyncCommands;
use tokio::sync::Mutex;
use uuid::Uuid;

use crate::error::Result;
use crate::ports::job_queue::{JobDelivery, OutboxJob};
use crate::storage::redis::RedisHandle;

const STREAM_KEY: &str = "sr:jobs:stream";
const GROUP: &str = "workers";
/// Cap the stream so a stalled consumer can't grow Redis unboundedly; the
/// outbox re-delivers anything trimmed away.
const MAX_STREAM_LEN: usize = 10_000;

pub struct RedisJobDelivery {
    handle: RedisHandle,
    /// job id -> stream entry id for entries delivered but not yet acked,
    /// per worker.
    pending_entries: Mutex<HashMap<String, HashMap<Uuid, String>>>,
}

impl RedisJobDelivery {
    pub async fn new(handle: RedisHandle) -> Self {
        let delivery = Self { handle, pending_entries: Mutex::new(HashMap::new()) };
        delivery.ensure_group().await;
        delivery
    }

    async fn ensure_group(&self) {
        let mut con = self.handle.connection();
        let result: Result<(), redis::RedisError> = redis::cmd("XGROUP")
            .arg("CREATE")
            .arg(STREAM_KEY)
            .arg(GROUP)
            .arg("$")
            .arg("MKSTREAM")
            .query_async(&mut con)
            .await;
        if let Err(err) = result {
            // BUSYGROUP = already exists; anything else is a degradation.
            if !err.to_string().contains("BUSYGROUP") {
                self.handle.note_error("jobs.ensure_group", &err);
            }
        }
    }
}

#[async_trait]
impl JobDelivery for RedisJobDelivery {
    async fn notify(&self, jobs: &[OutboxJob]) -> Result<()> {
        let mut con = self.handle.connection();
        for job in jobs {
            let result: Result<String, redis::RedisError> = redis::cmd("XADD")
                .arg(STREAM_KEY)
                .arg("MAXLEN")
                .arg("~")
                .arg(MAX_STREAM_LEN)
                .arg("*")
                .arg("job_id")
                .arg(job.id.to_string())
                .arg("job_type")
                .arg(job.job_type.as_str())
                .query_async(&mut con)
                .await;
            if let Err(err) = result {
                self.handle.note_error("jobs.notify", &err);
                // Non-fatal by contract: the outbox poller will deliver.
                return Ok(());
            }
        }
        Ok(())
    }

    async fn wait_for_jobs(&self, worker: &str, max: usize, timeout_ms: u64) -> Result<Vec<Uuid>> {
        let mut con = self.handle.connection();
        let options = StreamReadOptions::default()
            .group(GROUP, worker)
            .count(max.max(1))
            .block(timeout_ms as usize);
        let reply: StreamReadReply = match con.xread_options(&[STREAM_KEY], &[">"], &options).await {
            Ok(reply) => reply,
            Err(err) => {
                self.handle.note_error("jobs.wait", &err);
                return Ok(vec![]);
            }
        };

        let mut job_ids = Vec::new();
        let mut pending = self.pending_entries.lock().await;
        let worker_pending = pending.entry(worker.to_string()).or_default();
        for stream in reply.keys {
            for entry in stream.ids {
                let Some(raw) = entry.get::<String>("job_id") else {
                    // Malformed entry: ack it away so it doesn't wedge PEL.
                    let mut con = self.handle.connection();
                    let _: Result<(), _> = con.xack(STREAM_KEY, GROUP, &[&entry.id]).await;
                    continue;
                };
                match raw.parse::<Uuid>() {
                    Ok(job_id) => {
                        worker_pending.insert(job_id, entry.id.clone());
                        job_ids.push(job_id);
                    }
                    Err(_) => {
                        let mut con = self.handle.connection();
                        let _: Result<(), _> = con.xack(STREAM_KEY, GROUP, &[&entry.id]).await;
                    }
                }
            }
        }
        Ok(job_ids)
    }

    async fn ack(&self, worker: &str, job_ids: &[Uuid]) -> Result<()> {
        let entry_ids: Vec<String> = {
            let mut pending = self.pending_entries.lock().await;
            let Some(worker_pending) = pending.get_mut(worker) else {
                return Ok(());
            };
            job_ids
                .iter()
                .filter_map(|job_id| worker_pending.remove(job_id))
                .collect()
        };
        if entry_ids.is_empty() {
            return Ok(());
        }
        let mut con = self.handle.connection();
        if let Err(err) = con.xack::<_, _, _, ()>(STREAM_KEY, GROUP, &entry_ids).await {
            self.handle.note_error("jobs.ack", &err);
        }
        Ok(())
    }
}
