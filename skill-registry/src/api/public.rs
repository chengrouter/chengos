//! Public, unauthenticated catalog endpoints.

use std::net::SocketAddr;

use axum::body::Body;
use axum::extract::{ConnectInfo, Path, Query, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Deserialize;

use crate::api::dto::{
    CategoryDto, PageDto, PublisherDto, ReleaseDetailDto, ReleaseDto, SkillDetailDto,
    SkillSummaryDto,
};
use crate::api::middleware::{check_rate, client_key};
use crate::api::ApiState;
use crate::domain::pagination::{Cursor, PageRequest, SortOrder};
use crate::error::{RegistryError, Result};
use crate::ports::repositories::SkillListFilter;
use crate::services::download_service::DownloadDelivery;

#[derive(Deserialize)]
pub struct ListQuery {
    #[serde(rename = "q")]
    pub query: Option<String>,
    pub category: Option<String>,
    pub tag: Option<String>,
    pub publisher: Option<String>,
    pub sort: Option<String>,
    pub limit: Option<u32>,
    pub cursor: Option<String>,
}

/// `GET /api/v1/skills`
pub async fn list_skills(
    State(state): State<ApiState>,
    Query(params): Query<ListQuery>,
) -> Result<Json<PageDto<SkillSummaryDto>>> {
    let query = params.query.map(|q| q.trim().to_string()).filter(|q| !q.is_empty());
    let order = match params.sort.as_deref() {
        None => {
            if query.is_some() {
                SortOrder::Relevance
            } else {
                SortOrder::RecentlyUpdated
            }
        }
        Some(raw) => SortOrder::parse(raw)
            .ok_or_else(|| RegistryError::validation("INVALID_SORT", format!("unknown sort {raw:?}")))?,
    };
    if order == SortOrder::Relevance && query.is_none() {
        return Err(RegistryError::validation(
            "INVALID_SORT",
            "relevance sort requires a query",
        ));
    }
    let cursor = params
        .cursor
        .as_deref()
        .map(|raw| Cursor::decode(raw, order))
        .transpose()
        .map_err(|m| RegistryError::validation("INVALID_CURSOR", m))?;

    let page = state
        .catalog
        .list_skills(
            SkillListFilter {
                query,
                category: normalize(params.category),
                tag: normalize(params.tag),
                publisher_handle: normalize(params.publisher),
                include_unlisted: false,
            },
            order,
            PageRequest::new(params.limit, cursor),
        )
        .await?;
    Ok(Json(PageDto::from_page(page, SkillSummaryDto::from_row)))
}

/// `GET /api/v1/skills/{publisher}/{slug}`
pub async fn skill_detail(
    State(state): State<ApiState>,
    Path((publisher, slug)): Path<(String, String)>,
) -> Result<Json<SkillDetailDto>> {
    let detail = state.catalog.skill_detail(&publisher, &slug).await?;
    Ok(Json(SkillDetailDto::from_detail(detail)))
}

/// `GET /api/v1/skills/{publisher}/{slug}/versions`
pub async fn versions(
    State(state): State<ApiState>,
    Path((publisher, slug)): Path<(String, String)>,
) -> Result<Json<serde_json::Value>> {
    let (resolved, releases) = state.catalog.versions(&publisher, &slug).await?;
    let versions: Vec<ReleaseDto> = releases
        .iter()
        .map(|release| ReleaseDto::from_domain(release, None))
        .collect();
    Ok(Json(serde_json::json!({
        "publisher": resolved.publisher.handle,
        "slug": resolved.skill.slug,
        "via_alias": resolved.via_alias,
        "versions": versions,
    })))
}

/// `GET /api/v1/skills/{publisher}/{slug}/releases/{version}`
pub async fn release_detail(
    State(state): State<ApiState>,
    Path((publisher, slug, version)): Path<(String, String, String)>,
) -> Result<Json<ReleaseDetailDto>> {
    let detail = state.catalog.release_detail(&publisher, &slug, &version).await?;
    Ok(Json(ReleaseDetailDto::from_detail(detail)))
}

/// `GET /api/v1/skills/{publisher}/{slug}/releases/{version}/download`
///
/// Production serves via `X-Accel-Redirect` (Nginx streams the file from an
/// internal-only location); development streams directly.
pub async fn download(
    State(state): State<ApiState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Path((publisher, slug, version)): Path<(String, String, String)>,
) -> Result<Response> {
    let client = client_key(&headers, Some(peer));
    check_rate(
        &state,
        format!("dl:{client}"),
        state.config.rate_limit.download_per_ip_per_min,
        60,
    )
    .await?;

    let resolved = state
        .downloads
        .resolve_download(&publisher, &slug, &version, &client)
        .await?;

    let mut response = match resolved.delivery {
        DownloadDelivery::Accel { internal_path } => {
            let mut response = StatusCode::OK.into_response();
            response.headers_mut().insert(
                "x-accel-redirect",
                HeaderValue::from_str(&internal_path)
                    .map_err(|_| RegistryError::Internal(anyhow::anyhow!("bad accel path")))?,
            );
            response
        }
        DownloadDelivery::Stream { body, size_bytes } => {
            state.metrics.download_bytes_total.inc_by(size_bytes);
            let mut response = Body::from_stream(body).into_response();
            response.headers_mut().insert(
                header::CONTENT_LENGTH,
                HeaderValue::from_str(&size_bytes.to_string()).expect("length header"),
            );
            response
        }
    };

    let headers = response.headers_mut();
    headers.insert(
        header::CONTENT_TYPE,
        HeaderValue::from_str(&resolved.artifact.media_type)
            .unwrap_or(HeaderValue::from_static("application/zip")),
    );
    if let Ok(disposition) =
        HeaderValue::from_str(&format!("attachment; filename=\"{}\"", resolved.filename))
    {
        headers.insert(header::CONTENT_DISPOSITION, disposition);
    }
    if let Ok(digest) = HeaderValue::from_str(&format!("sha256:{}", resolved.artifact.digest.as_str())) {
        headers.insert("x-artifact-digest", digest);
    }
    if resolved.yanked {
        headers.insert("x-release-yanked", HeaderValue::from_static("true"));
    }
    // Immutable content: the digest pins the bytes.
    headers.insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("public, max-age=31536000, immutable"),
    );
    Ok(response)
}

/// `GET /api/v1/categories`
pub async fn categories(State(state): State<ApiState>) -> Result<Json<Vec<CategoryDto>>> {
    let categories = state.catalog.categories().await?;
    Ok(Json(
        categories
            .into_iter()
            .map(|(name, skill_count)| CategoryDto { name, skill_count })
            .collect(),
    ))
}

/// `GET /api/v1/publishers/{handle}`
pub async fn publisher(
    State(state): State<ApiState>,
    Path(handle): Path<String>,
) -> Result<Json<PublisherDto>> {
    let publisher = state.catalog.publisher(&handle).await?;
    Ok(Json(PublisherDto::from_domain(&publisher)))
}

#[derive(Deserialize)]
pub struct ReportBody {
    pub publisher: String,
    pub slug: String,
    #[serde(default)]
    pub version: Option<String>,
    pub reason: String,
    pub details: String,
    #[serde(default)]
    pub contact: Option<String>,
}

/// `POST /api/v1/reports` — anonymous abuse report (heavily rate limited).
pub async fn file_report(
    State(state): State<ApiState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(body): Json<ReportBody>,
) -> Result<(StatusCode, Json<serde_json::Value>)> {
    let client = client_key(&headers, Some(peer));
    check_rate(
        &state,
        format!("report:{client}"),
        state.config.rate_limit.report_per_ip_per_day,
        24 * 3600,
    )
    .await?;
    let report_id = state
        .moderation
        .file_report(
            &body.publisher,
            &body.slug,
            body.version.as_deref(),
            &body.reason,
            &body.details,
            body.contact,
        )
        .await?;
    Ok((
        StatusCode::ACCEPTED,
        Json(serde_json::json!({ "report_id": report_id })),
    ))
}

fn normalize(value: Option<String>) -> Option<String> {
    value.map(|v| v.trim().to_lowercase()).filter(|v| !v.is_empty())
}
