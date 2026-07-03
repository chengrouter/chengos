//! Prometheus metrics registry.
//!
//! One process-wide [`Metrics`] handle is built in `app.rs` and cloned into
//! API middleware, services, and the job runner. Exposed at `/metrics`.

use std::sync::Arc;

use prometheus::{
    Encoder, Histogram, HistogramOpts, HistogramVec, IntCounter, IntCounterVec, IntGauge,
    IntGaugeVec, Opts, Registry, TextEncoder,
};

#[derive(Clone)]
pub struct Metrics {
    pub registry: Registry,

    // HTTP
    pub http_requests_total: IntCounterVec,
    pub http_request_duration_seconds: HistogramVec,
    pub http_errors_total: IntCounterVec,

    // Persistence / cache
    pub pg_pool_connections: IntGauge,
    pub pg_pool_idle: IntGauge,
    pub redis_errors_total: IntCounter,
    pub cache_hits_total: IntCounter,
    pub cache_misses_total: IntCounter,

    // Transfers
    pub upload_bytes_total: IntCounter,
    pub download_bytes_total: IntCounter,
    pub active_transfers: IntGauge,

    // Jobs
    pub job_backlog: IntGaugeVec,
    pub job_runs_total: IntCounterVec,
    pub job_retries_total: IntCounterVec,
    pub job_dead_letters_total: IntCounterVec,
    pub job_duration_seconds: HistogramVec,

    // Domain
    pub scan_findings_total: IntCounterVec,
    pub artifact_count: IntGauge,
    pub artifact_bytes: IntGauge,
    pub unreferenced_artifacts: IntGauge,
    pub downloads_counted_total: IntCounter,
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
        fn gauge(r: &Registry, name: &str, help: &str) -> IntGauge {
            let v = IntGauge::new(name, help).expect("metric opts");
            r.register(Box::new(v.clone())).expect("register metric");
            v
        }
        fn gauge_vec(r: &Registry, name: &str, help: &str, labels: &[&str]) -> IntGaugeVec {
            let v = IntGaugeVec::new(Opts::new(name, help), labels).expect("metric opts");
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
                "registry_http_requests_total",
                "HTTP requests by route and status class",
                &["route", "method", "status"],
            ),
            http_request_duration_seconds: histogram_vec(
                &registry,
                "registry_http_request_duration_seconds",
                "HTTP request latency",
                &["route", "method"],
            ),
            http_errors_total: counter_vec(
                &registry,
                "registry_http_errors_total",
                "HTTP 5xx responses by route",
                &["route"],
            ),
            pg_pool_connections: gauge(
                &registry,
                "registry_pg_pool_connections",
                "Open PostgreSQL pool connections",
            ),
            pg_pool_idle: gauge(&registry, "registry_pg_pool_idle", "Idle PostgreSQL pool connections"),
            redis_errors_total: counter(
                &registry,
                "registry_redis_errors_total",
                "Redis operation failures (degradation events)",
            ),
            cache_hits_total: counter(&registry, "registry_cache_hits_total", "Cache hits"),
            cache_misses_total: counter(&registry, "registry_cache_misses_total", "Cache misses"),
            upload_bytes_total: counter(&registry, "registry_upload_bytes_total", "Artifact bytes received"),
            download_bytes_total: counter(
                &registry,
                "registry_download_bytes_total",
                "Artifact bytes streamed by the registry process (excludes X-Accel)",
            ),
            active_transfers: gauge(&registry, "registry_active_transfers", "In-flight uploads/downloads"),
            job_backlog: gauge_vec(&registry, "registry_job_backlog", "Pending jobs", &["job_type"]),
            job_runs_total: counter_vec(
                &registry,
                "registry_job_runs_total",
                "Job executions",
                &["job_type", "outcome"],
            ),
            job_retries_total: counter_vec(&registry, "registry_job_retries_total", "Job retries", &["job_type"]),
            job_dead_letters_total: counter_vec(
                &registry,
                "registry_job_dead_letters_total",
                "Dead-lettered jobs",
                &["job_type"],
            ),
            job_duration_seconds: histogram_vec(
                &registry,
                "registry_job_duration_seconds",
                "Job run duration",
                &["job_type"],
            ),
            scan_findings_total: counter_vec(
                &registry,
                "registry_scan_findings_total",
                "Scan findings by kind and severity",
                &["kind", "severity"],
            ),
            artifact_count: gauge(&registry, "registry_artifact_count", "Stored artifacts"),
            artifact_bytes: gauge(&registry, "registry_artifact_bytes", "Stored artifact bytes"),
            unreferenced_artifacts: gauge(
                &registry,
                "registry_unreferenced_artifacts",
                "Artifacts without database references (cleanup candidates)",
            ),
            downloads_counted_total: counter(
                &registry,
                "registry_downloads_counted_total",
                "Public download count increments",
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

/// A no-op friendly helper for tests.
pub fn noop_histogram() -> Histogram {
    Histogram::with_opts(HistogramOpts::new("noop", "noop")).expect("histogram")
}
