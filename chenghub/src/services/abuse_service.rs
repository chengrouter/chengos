//! Centralized write limits and burst controls.
//!
//! Buckets are per-user for writes and per-IP for anonymous reads. The
//! limiter fails open (Redis outage degrades protection, not availability);
//! banned-user checks live on `AuthContext::ensure_can_write`, not here.

use std::sync::Arc;

use crate::config::RateLimitConfig;
use crate::domain::identity::UserId;
use crate::error::{HubError, Result};
use crate::ports::rate_limit::RateLimiter;
use crate::telemetry::metrics::SharedMetrics;

pub struct AbuseService {
    limiter: Arc<dyn RateLimiter>,
    config: RateLimitConfig,
    metrics: SharedMetrics,
}

impl AbuseService {
    pub fn new(
        limiter: Arc<dyn RateLimiter>,
        config: RateLimitConfig,
        metrics: SharedMetrics,
    ) -> Self {
        Self { limiter, config, metrics }
    }

    async fn check(&self, bucket: String, class: &str, limit: u32, window_secs: u64) -> Result<()> {
        let decision = self.limiter.check(&bucket, limit, window_secs).await;
        if decision.allowed {
            Ok(())
        } else {
            self.metrics.rate_limited_total.with_label_values(&[class]).inc();
            Err(HubError::RateLimited { retry_after_secs: decision.retry_after_secs })
        }
    }

    pub async fn check_read(&self, client_key: &str) -> Result<()> {
        self.check(
            format!("read:{client_key}"),
            "read",
            self.config.read_per_ip_per_min,
            60,
        )
        .await
    }

    pub async fn check_auth(&self, client_key: &str) -> Result<()> {
        self.check(
            format!("auth:{client_key}"),
            "auth",
            self.config.auth_per_ip_per_min,
            60,
        )
        .await
    }

    pub async fn check_post(&self, user: UserId) -> Result<()> {
        self.check(
            format!("post:{user}"),
            "post",
            self.config.posts_per_user_per_hour,
            3600,
        )
        .await
    }

    pub async fn check_comment(&self, user: UserId) -> Result<()> {
        self.check(
            format!("comment:{user}"),
            "comment",
            self.config.comments_per_user_per_hour,
            3600,
        )
        .await
    }

    pub async fn check_reaction(&self, user: UserId) -> Result<()> {
        self.check(
            format!("reaction:{user}"),
            "reaction",
            self.config.reactions_per_user_per_min,
            60,
        )
        .await
    }

    pub async fn check_report(&self, user: UserId) -> Result<()> {
        self.check(
            format!("report:{user}"),
            "report",
            self.config.reports_per_user_per_day,
            24 * 3600,
        )
        .await
    }

    pub async fn check_share(&self, user: UserId) -> Result<()> {
        self.check(
            format!("share:{user}"),
            "share",
            self.config.shares_per_user_per_day,
            24 * 3600,
        )
        .await
    }
}
