//! HTTP API layer.
//!
//! Thin handlers over the service layer: parse/validate the request shape,
//! call one service method, render DTOs. No business rules live here. All
//! failures flow through [`crate::error::HubError`]'s `IntoResponse`
//! (stable problem+json codes).

pub mod admin;
pub mod auth;
pub mod comments;
pub mod device;
pub mod dto;
pub mod health;
pub mod middleware;
pub mod posts;
pub mod reactions;
pub mod reports;
pub mod router;
pub mod workflow_shares;

use std::sync::Arc;

use crate::config::AppConfig;
use crate::ports::rate_limit::RateLimiter;
use crate::services::abuse_service::AbuseService;
use crate::services::admin_service::AdminService;
use crate::services::comment_service::CommentService;
use crate::services::device_flow_service::DeviceFlowService;
use crate::services::identity_service::IdentityService;
use crate::services::moderation_service::ModerationService;
use crate::services::post_service::PostService;
use crate::services::reaction_service::ReactionService;
use crate::services::requirement_service::RequirementService;
use crate::services::search_service::SearchService;
use crate::services::workflow_share_service::WorkflowShareService;
use crate::telemetry::metrics::SharedMetrics;

/// Shared application state cloned into every handler.
#[derive(Clone)]
pub struct ApiState {
    pub config: Arc<AppConfig>,
    pub metrics: SharedMetrics,
    pub identity: Arc<IdentityService>,
    pub device_flow: Arc<DeviceFlowService>,
    pub posts: Arc<PostService>,
    pub comments: Arc<CommentService>,
    pub reactions: Arc<ReactionService>,
    pub requirements: Arc<RequirementService>,
    pub search: Arc<SearchService>,
    pub moderation: Arc<ModerationService>,
    pub admin: Arc<AdminService>,
    pub shares: Arc<WorkflowShareService>,
    pub abuse: Arc<AbuseService>,
    pub rate_limiter: Arc<dyn RateLimiter>,
    pub health: Arc<health::HealthState>,
}
