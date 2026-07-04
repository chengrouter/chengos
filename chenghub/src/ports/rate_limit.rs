//! Rate limiting port.
//!
//! The API middleware derives the bucket key (per-IP or per-user) and the
//! limit from `RateLimitConfig`; implementations only count. Rate limits are
//! a protection accelerator, not business truth: implementations must fail
//! *open* (allow) when the backing store is unavailable, so a Redis outage
//! degrades protection rather than availability.

use async_trait::async_trait;

#[derive(Debug, Clone, Copy)]
pub struct RateDecision {
    pub allowed: bool,
    /// When denied: seconds until the window resets (Retry-After).
    pub retry_after_secs: u64,
}

impl RateDecision {
    pub const ALLOW: Self = Self { allowed: true, retry_after_secs: 0 };
}

#[async_trait]
pub trait RateLimiter: Send + Sync {
    /// Count one hit against `bucket` and decide. `limit` hits are allowed
    /// per `window_secs` fixed window.
    async fn check(&self, bucket: &str, limit: u32, window_secs: u64) -> RateDecision;
}

/// Always-allow limiter for tests and Redis-disabled deployments.
pub struct NoopRateLimiter;

#[async_trait]
impl RateLimiter for NoopRateLimiter {
    async fn check(&self, _bucket: &str, _limit: u32, _window_secs: u64) -> RateDecision {
        RateDecision::ALLOW
    }
}
