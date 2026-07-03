//! Structured logging setup and redaction helpers.
//!
//! JSON output in production, human-readable in development. Request and job
//! trace ids propagate through spans (`request_id`, `job_id` fields). Never
//! log tokens, Authorization headers, secret findings, or full local paths.

use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use crate::config::TelemetryConfig;

pub fn init(config: &TelemetryConfig) {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new(config.log_filter.clone()));

    if config.log_format == "json" {
        tracing_subscriber::registry()
            .with(filter)
            .with(fmt::layer().json().with_current_span(true).with_span_list(false))
            .init();
    } else {
        tracing_subscriber::registry()
            .with(filter)
            .with(fmt::layer().compact())
            .init();
    }
}

/// Shorten a digest for log lines (never log the full 64 chars where the
/// short form identifies the artifact well enough).
pub fn short_digest(digest: &str) -> &str {
    digest.get(..12).unwrap_or(digest)
}

/// Redact a bearer token / secret-ish value for logging.
pub fn redact(value: &str) -> String {
    if value.len() <= 8 {
        "****".to_string()
    } else {
        format!("{}****", &value[..4])
    }
}
