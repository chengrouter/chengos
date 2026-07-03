//! HTTP API layer.
//!
//! Thin handlers over the service layer: parse/validate the request shape,
//! call one service method, render DTOs. No business rules live here. All
//! failures flow through [`crate::error::RegistryError`]'s `IntoResponse`
//! (stable problem+json codes).

pub mod admin;
pub mod capabilities;
pub mod dto;
pub mod health;
pub mod middleware;
pub mod moderation;
pub mod public;
pub mod publish;
pub mod publisher_auth;
pub mod router;
pub mod versioning;

use std::sync::Arc;

use crate::config::AppConfig;
use crate::ports::rate_limit::RateLimiter;
use crate::services::catalog_service::CatalogService;
use crate::services::download_service::DownloadService;
use crate::services::moderation_service::ModerationService;
use crate::services::publish_service::PublishService;
use crate::services::publisher_auth_service::PublisherAuthService;
use crate::storage::redis::idempotency::IdempotencyStore;
use crate::telemetry::metrics::SharedMetrics;

/// Shared application state cloned into every handler.
#[derive(Clone)]
pub struct ApiState {
    pub config: Arc<AppConfig>,
    pub metrics: SharedMetrics,
    pub catalog: Arc<CatalogService>,
    pub downloads: Arc<DownloadService>,
    pub auth: Arc<PublisherAuthService>,
    pub publish: Arc<PublishService>,
    pub moderation: Arc<ModerationService>,
    pub jobs: Arc<dyn crate::ports::job_queue::JobOutbox>,
    pub rate_limiter: Arc<dyn RateLimiter>,
    /// Present only when Redis is connected; publish replays degrade to
    /// database uniqueness without it.
    pub idempotency: Option<Arc<IdempotencyStore>>,
    pub health: Arc<health::HealthState>,
}
