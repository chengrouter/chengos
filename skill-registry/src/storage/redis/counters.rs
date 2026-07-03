//! Redis-backed download counters.
//!
//! Layout:
//! * `sr:dl:seen:{window}:{release}:{bucket}` — dedupe marker (SET NX,
//!   expires with the window) so one client counts once per window.
//! * `sr:dl:counts` — live hash `release_id -> count`.
//! * `sr:dl:batch:{day}:{uuid}` — sealed batches awaiting durable persistence.
//!
//! `seal_and_list` atomically RENAMEs the live hash to a batch key, then
//! returns *every* batch key found — including ones sealed by a process that
//! crashed before `ack`. The batch key suffix doubles as the idempotency
//! `batch_id`, so PostgreSQL applies each batch exactly once no matter how
//! often it is retried.

use async_trait::async_trait;
use chrono::{NaiveDate, Utc};
use redis::AsyncCommands;
use uuid::Uuid;

use crate::domain::release::ReleaseId;
use crate::ports::counters::{CounterBatch, DownloadCounters};
use crate::storage::redis::{scan_keys, RedisHandle};

const LIVE_KEY: &str = "sr:dl:counts";
const BATCH_PREFIX: &str = "sr:dl:batch:";

pub struct RedisCounters {
    handle: RedisHandle,
    window_secs: u64,
}

impl RedisCounters {
    pub fn new(handle: RedisHandle, window_secs: u64) -> Self {
        Self { handle, window_secs: window_secs.max(1) }
    }
}

#[async_trait]
impl DownloadCounters for RedisCounters {
    async fn record(&self, release_id: ReleaseId, bucket: &str) -> bool {
        let window = Utc::now().timestamp() / self.window_secs as i64;
        let seen_key = format!("sr:dl:seen:{window}:{release_id}:{bucket}");
        let mut con = self.handle.connection();
        // First writer wins; the marker outlives the window slightly so a
        // boundary-straddling client cannot double count within it.
        let newly_seen: Result<Option<String>, _> = redis::cmd("SET")
            .arg(&seen_key)
            .arg("1")
            .arg("NX")
            .arg("EX")
            .arg(self.window_secs)
            .query_async(&mut con)
            .await;
        match newly_seen {
            Ok(Some(_)) => {}
            Ok(None) => return false,
            Err(err) => {
                self.handle.note_error("counters.record.seen", &err);
                return false;
            }
        }
        match con.hincr::<_, _, _, i64>(LIVE_KEY, release_id.to_string(), 1).await {
            Ok(_) => true,
            Err(err) => {
                self.handle.note_error("counters.record.incr", &err);
                false
            }
        }
    }

    async fn seal_and_list(&self) -> Vec<CounterBatch> {
        let mut con = self.handle.connection();
        // Seal the live hash (if any) under today's date + a fresh id.
        let batch_key = format!("{}{}:{}", BATCH_PREFIX, Utc::now().date_naive(), Uuid::new_v4());
        let renamed: Result<(), redis::RedisError> =
            redis::cmd("RENAME").arg(LIVE_KEY).arg(&batch_key).query_async(&mut con).await;
        if let Err(err) = renamed {
            // "no such key" just means no downloads since the last seal.
            if err.kind() != redis::ErrorKind::ResponseError {
                self.handle.note_error("counters.seal.rename", &err);
            }
        }

        let keys = match scan_keys(&self.handle, &format!("{BATCH_PREFIX}*")).await {
            Ok(keys) => keys,
            Err(err) => {
                self.handle.note_error("counters.seal.scan", &err);
                return vec![];
            }
        };

        let mut batches = Vec::new();
        for key in keys {
            let suffix = &key[BATCH_PREFIX.len()..];
            // `{day}:{uuid}`
            let Some((day_raw, _)) = suffix.split_once(':') else { continue };
            let Ok(day) = day_raw.parse::<NaiveDate>() else { continue };
            let raw: Vec<(String, i64)> = match con.hgetall(&key).await {
                Ok(raw) => raw,
                Err(err) => {
                    self.handle.note_error("counters.seal.read", &err);
                    continue;
                }
            };
            let counts: Vec<(ReleaseId, i64)> = raw
                .into_iter()
                .filter_map(|(id, count)| id.parse::<Uuid>().ok().map(|id| (id, count)))
                .collect();
            if !counts.is_empty() {
                batches.push(CounterBatch { batch_id: suffix.to_string(), day, counts });
            } else {
                // Empty or unparsable batch: nothing to persist, drop it.
                let _: Result<(), _> = con.del(&key).await;
            }
        }
        batches
    }

    async fn ack(&self, batch_id: &str) {
        let mut con = self.handle.connection();
        if let Err(err) = con.del::<_, ()>(format!("{BATCH_PREFIX}{batch_id}")).await {
            self.handle.note_error("counters.ack", &err);
        }
    }
}
