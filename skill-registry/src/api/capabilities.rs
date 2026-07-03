//! `GET /api/v1/capabilities` — deployment feature negotiation.
//!
//! ChengFlow calls this before enabling marketplace features: it advertises
//! the API version, accepted package formats, size limits, and feature set,
//! so a ChengFlow instance can degrade cleanly against older/newer
//! registries instead of failing mid-install.

use axum::extract::State;
use axum::Json;
use serde::Serialize;

use crate::api::versioning::{API_VERSION, FEATURES, SUPPORTED_PACKAGE_FORMATS};
use crate::api::ApiState;
use crate::domain::artifact::PACKAGE_V1_MEDIA_TYPE;
use crate::security::policy_version::active_policy_version;

#[derive(Serialize)]
pub struct CapabilitiesDto {
    pub api_version: &'static str,
    pub registry_version: &'static str,
    pub package_formats: &'static [i32],
    pub package_media_type: &'static str,
    pub scan_policy_version: String,
    pub features: &'static [&'static str],
    pub limits: LimitsDto,
}

#[derive(Serialize)]
pub struct LimitsDto {
    pub max_archive_bytes: u64,
    pub max_expanded_bytes: u64,
    pub max_files: usize,
    pub max_page_size: u32,
}

pub async fn capabilities(State(state): State<ApiState>) -> Json<CapabilitiesDto> {
    Json(CapabilitiesDto {
        api_version: API_VERSION,
        registry_version: env!("CARGO_PKG_VERSION"),
        package_formats: SUPPORTED_PACKAGE_FORMATS,
        package_media_type: PACKAGE_V1_MEDIA_TYPE,
        scan_policy_version: active_policy_version(),
        features: FEATURES,
        limits: LimitsDto {
            max_archive_bytes: state.config.artifacts.max_archive_bytes,
            max_expanded_bytes: state.config.artifacts.max_expanded_bytes,
            max_files: state.config.artifacts.max_files,
            max_page_size: crate::domain::pagination::MAX_PAGE_SIZE,
        },
    })
}
