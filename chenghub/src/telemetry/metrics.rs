//! Prometheus metrics registry.
//!
//! One process-wide [`Metrics`] handle is built in `app.rs` and cloned into
//! API middleware and services. Exposed at `/metrics`.

use std::sync::Arc;

use prometheus::{
    Encoder, HistogramOpts, HistogramVec, IntCounter, IntCounterVec, Opts, Registry, TextEncoder,
};

#[derive(Clone)]
pub struct Metrics {
    pub registry: Registry,

    // HTTP
    pub http_requests_total: IntCounterVec,
    pub http_request_duration_seconds: HistogramVec,
    pub http_errors_total: IntCounterVec,

    // Infrastructure
    pub redis_errors_total: IntCounter,
    pub provider_errors_total: IntCounterVec,

    // Identity
    pub logins_total: IntCounterVec,
    pub device_flows_total: IntCounterVec,
    pub tokens_issued_total: IntCounterVec,

    // Community
    pub posts_created_total: IntCounterVec,
    pub comments_created_total: IntCounter,
    pub reactions_total: IntCounterVec,
    pub reports_total: IntCounter,
    pub moderation_actions_total: IntCounterVec,
    pub rate_limited_total: IntCounterVec,
}

impl Metrics {
    pub fn new() -> Arc<Self> {
        let registry = Registry::new();

        fn counter_vec(r: &Registry, name: &str, help: &str, labels: &[&str]) -> IntCounterVec {
            let v = IntCounterVec::new(Opts::new(name, help), labels).expect("metric opts");
            r.register(Box::new(v.clone())).expect("register metric");
            v
        }
        fn counter(r: &Registry, name: &str, help: &str) -> IntCounter {
            let v = IntCounter::new(name, help).expect("metric opts");
            r.register(Box::new(v.clone())).expect("register metric");
            v
        }
        fn histogram_vec(r: &Registry, name: &str, help: &str, labels: &[&str]) -> HistogramVec {
            let v = HistogramVec::new(HistogramOpts::new(name, help), labels).expect("metric opts");
            r.register(Box::new(v.clone())).expect("register metric");
            v
        }

        let metrics = Self {
            http_requests_total: counter_vec(
                &registry,
                "chenghub_http_requests_total",
                "HTTP requests by route and status class",
                &["route", "method", "status"],
            ),
            http_request_duration_seconds: histogram_vec(
                &registry,
                "chenghub_http_request_duration_seconds",
                "HTTP request latency",
                &["route", "method"],
            ),
            http_errors_total: counter_vec(
                &registry,
                "chenghub_http_errors_total",
                "HTTP 5xx responses by route",
                &["route"],
            ),
            redis_errors_total: counter(
                &registry,
                "chenghub_redis_errors_total",
                "Redis operation failures (degradation events)",
            ),
            provider_errors_total: counter_vec(
                &registry,
                "chenghub_provider_errors_total",
                "OAuth provider call failures",
                &["provider"],
            ),
            logins_total: counter_vec(
                &registry,
                "chenghub_logins_total",
                "Completed browser logins by provider and outcome",
                &["provider", "outcome"],
            ),
            device_flows_total: counter_vec(
                &registry,
                "chenghub_device_flows_total",
                "Device authorization flows by outcome",
                &["outcome"],
            ),
            tokens_issued_total: counter_vec(
                &registry,
                "chenghub_tokens_issued_total",
                "Issued tokens by kind",
                &["kind"],
            ),
            posts_created_total: counter_vec(
                &registry,
                "chenghub_posts_created_total",
                "Created posts by type",
                &["post_type"],
            ),
            comments_created_total: counter(
                &registry,
                "chenghub_comments_created_total",
                "Created comments",
            ),
            reactions_total: counter_vec(
                &registry,
                "chenghub_reactions_total",
                "Reactions by type and action",
                &["reaction", "action"],
            ),
            reports_total: counter(&registry, "chenghub_reports_total", "Filed abuse reports"),
            moderation_actions_total: counter_vec(
                &registry,
                "chenghub_moderation_actions_total",
                "Moderation actions by kind",
                &["action"],
            ),
            rate_limited_total: counter_vec(
                &registry,
                "chenghub_rate_limited_total",
                "Rate-limited requests by bucket class",
                &["bucket"],
            ),
            registry,
        };
        Arc::new(metrics)
    }

    pub fn render(&self) -> String {
        let mut buf = Vec::new();
        let encoder = TextEncoder::new();
        if encoder.encode(&self.registry.gather(), &mut buf).is_err() {
            return String::new();
        }
        String::from_utf8(buf).unwrap_or_default()
    }
}

/// Convenience alias used across layers.
pub type SharedMetrics = Arc<Metrics>;
