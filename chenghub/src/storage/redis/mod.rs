//! Redis-backed accelerators: rate limits and OAuth/PKCE pending state.
//!
//! Redis is never business truth. Rate limits fail open; OAuth state falls
//! back to an in-process store when Redis is unavailable (single-instance
//! only — multi-instance deployments must run Redis). Failures increment
//! `chenghub_redis_errors_total` and log at `warn`.

pub mod oauth_state;
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
    /// failure is fatal (it is not: `serve` falls back to local stores).
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
