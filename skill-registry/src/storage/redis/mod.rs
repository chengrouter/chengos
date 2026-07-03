//! Redis-backed accelerators: cache, download counters, rate limits,
//! idempotency markers, and job delivery notifications.
//!
//! Redis is never business truth. Every module here degrades gracefully:
//! cache misses fall through to PostgreSQL, counters lose at most the
//! unsealed window, rate limits fail open, idempotency falls back to the
//! database uniqueness constraints, and job delivery falls back to outbox
//! polling. Failures increment `registry_redis_errors_total` and log at
//! `warn`, never propagate to callers as request errors.

pub mod cache;
pub mod counters;
pub mod idempotency;
pub mod jobs;
pub mod rate_limit;

use std::time::Duration;

use redis::aio::ConnectionManager;

use crate::config::RedisConfig;
use crate::telemetry::metrics::SharedMetrics;

/// Shared Redis connection handle. `ConnectionManager` reconnects internally,
/// so one handle is cloned into every Redis-backed component.
#[derive(Clone)]
pub struct RedisHandle {
    manager: ConnectionManager,
    metrics: SharedMetrics,
}

impl RedisHandle {
    /// Connect within the configured timeout. Callers decide whether a
    /// failure is fatal (it is not: `serve` falls back to noop accelerators).
    pub async fn connect(config: &RedisConfig, metrics: SharedMetrics) -> anyhow::Result<Self> {
        let client = redis::Client::open(config.url.expose())
            .map_err(|e| anyhow::anyhow!("invalid redis url: {e}"))?;
        let manager = tokio::time::timeout(
            Duration::from_secs(config.connect_timeout_secs.max(1)),
            client.get_connection_manager(),
        )
        .await
        .map_err(|_| anyhow::anyhow!("redis connect timed out"))?
        .map_err(|e| anyhow::anyhow!("redis connect failed: {e}"))?;
        Ok(Self { manager, metrics })
    }

    pub fn connection(&self) -> ConnectionManager {
        self.manager.clone()
    }

    /// Record a degradation event (metric + warn log) for a failed Redis
    /// operation. Callers then take their fallback path.
    pub fn note_error(&self, operation: &str, err: &redis::RedisError) {
        self.metrics.redis_errors_total.inc();
        tracing::warn!(operation, error = %err, "redis operation failed; degrading");
    }
}

/// Iterate all keys matching `pattern` via cursor SCAN (never KEYS).
pub(crate) async fn scan_keys(
    handle: &RedisHandle,
    pattern: &str,
) -> Result<Vec<String>, redis::RedisError> {
    let mut con = handle.connection();
    let mut keys = Vec::new();
    let mut cursor: u64 = 0;
    loop {
        let (next, batch): (u64, Vec<String>) = redis::cmd("SCAN")
            .arg(cursor)
            .arg("MATCH")
            .arg(pattern)
            .arg("COUNT")
            .arg(200)
            .query_async(&mut con)
            .await?;
        keys.extend(batch);
        if next == 0 {
            break;
        }
        cursor = next;
    }
    Ok(keys)
}
