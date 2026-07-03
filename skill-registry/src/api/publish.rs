//! Authenticated publishing endpoints.
//!
//! The artifact upload accepts the raw package bytes (not multipart), with
//! the declared digest in `X-Artifact-Digest`. `Idempotency-Key` on the
//! upload lets ChengFlow retry safely: replays of a completed upload return
//! the original response; the durable backstop is the idempotent
//! bind-by-digest in the repository either way.

use std::net::SocketAddr;

use axum::extract::{ConnectInfo, Path, Request, State};
use axum::http::{HeaderMap, StatusCode};
use axum::Json;
use futures::TryStreamExt;
use serde::Deserialize;

use crate::api::dto::ReleaseDto;
use crate::api::middleware::{check_rate, RequireAuth};
use crate::api::ApiState;
use crate::domain::artifact::Digest;
use crate::error::{RegistryError, Result};
use crate::ports::artifact_store::ByteStream;
use crate::services::publish_service::SkillMetadataInput;
use crate::services::publisher_auth_service::AuthContext;
use crate::storage::redis::idempotency::{IdempotencyOutcome, StoredResponse};

async fn publish_rate(state: &ApiState, auth: &AuthContext) -> Result<()> {
    check_rate(
        state,
        format!("publish:{}", auth.publisher.id),
        state.config.rate_limit.publish_per_publisher_per_min,
        60,
    )
    .await
}

#[derive(Deserialize)]
pub struct SkillMetadataBody {
    pub name: String,
    pub summary: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub categories: Vec<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub license: Option<String>,
}

/// `PUT /api/v1/publish/skills/{slug}` — create or update skill metadata.
pub async fn upsert_skill(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path(slug): Path<String>,
    Json(body): Json<SkillMetadataBody>,
) -> Result<Json<serde_json::Value>> {
    publish_rate(&state, &auth).await?;
    let skill = state
        .publish
        .upsert_skill(
            &auth,
            &slug,
            SkillMetadataInput {
                name: body.name,
                summary: body.summary,
                description: body.description,
                categories: body.categories,
                tags: body.tags,
                license: body.license,
            },
        )
        .await?;
    Ok(Json(serde_json::json!({
        "publisher": auth.publisher.handle,
        "slug": skill.slug,
        "updated_at": skill.updated_at,
    })))
}

#[derive(Deserialize)]
pub struct StartReleaseBody {
    pub version: String,
    #[serde(default)]
    pub changelog: Option<String>,
}

/// `POST /api/v1/publish/skills/{slug}/releases` — open a release session.
pub async fn start_release(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path(slug): Path<String>,
    Json(body): Json<StartReleaseBody>,
) -> Result<(StatusCode, Json<ReleaseDto>)> {
    publish_rate(&state, &auth).await?;
    let release = state
        .publish
        .start_release(&auth, &slug, &body.version, body.changelog)
        .await?;
    Ok((StatusCode::CREATED, Json(ReleaseDto::from_domain(&release, None))))
}

/// `PUT /api/v1/publish/skills/{slug}/releases/{version}/artifact`
///
/// Raw package bytes in the body; declared digest in `X-Artifact-Digest`.
pub async fn upload_artifact(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    ConnectInfo(_peer): ConnectInfo<SocketAddr>,
    Path((slug, version)): Path<(String, String)>,
    request: Request,
) -> Result<(StatusCode, Json<serde_json::Value>)> {
    publish_rate(&state, &auth).await?;
    let headers = request.headers().clone();
    let declared_digest = parse_digest_header(&headers)?;
    let request_id = headers
        .get("x-request-id")
        .and_then(|v| v.to_str().ok())
        .map(str::to_string);

    // Idempotency replay (accelerator; the digest-bind is the backstop).
    let idempotency = idempotency_key(&headers, &auth, &slug, &version);
    if let (Some(store), Some(key)) = (&state.idempotency, &idempotency) {
        match store.begin("upload", key).await {
            IdempotencyOutcome::Replay(stored) => {
                let body: serde_json::Value = serde_json::from_slice(&stored.body)
                    .unwrap_or_else(|_| serde_json::json!({}));
                return Ok((
                    StatusCode::from_u16(stored.status).unwrap_or(StatusCode::OK),
                    Json(body),
                ));
            }
            IdempotencyOutcome::InFlight => {
                return Err(RegistryError::conflict(
                    "UPLOAD_IN_FLIGHT",
                    "an upload with this idempotency key is already in progress",
                ));
            }
            IdempotencyOutcome::New => {}
        }
    }

    let body: ByteStream = Box::pin(
        request
            .into_body()
            .into_data_stream()
            .map_err(|e| std::io::Error::other(e.to_string())),
    );
    let result = state
        .publish
        .upload_artifact(&auth, &slug, &version, declared_digest.as_ref(), body, request_id)
        .await;

    match result {
        Ok((release, artifact)) => {
            let response = serde_json::json!({
                "publisher": auth.publisher.handle,
                "slug": slug,
                "version": release.version,
                "status": release.status.as_str(),
                "digest": format!("sha256:{}", artifact.digest.as_str()),
                "size_bytes": artifact.size_bytes,
            });
            if let (Some(store), Some(key)) = (&state.idempotency, &idempotency) {
                store
                    .complete(
                        "upload",
                        key,
                        &StoredResponse {
                            status: StatusCode::CREATED.as_u16(),
                            body: serde_json::to_vec(&response).unwrap_or_default(),
                            fingerprint: format!("{slug}@{version}"),
                        },
                        24 * 3600,
                    )
                    .await;
            }
            Ok((StatusCode::CREATED, Json(response)))
        }
        Err(err) => {
            if let (Some(store), Some(key)) = (&state.idempotency, &idempotency) {
                store.release("upload", key).await;
            }
            Err(err)
        }
    }
}

/// `GET /api/v1/publish/skills/{slug}/releases/{version}` — publisher's own
/// status view (any state, including scanning/needs_review).
pub async fn release_status(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path((slug, version)): Path<(String, String)>,
) -> Result<Json<ReleaseDto>> {
    let release = state.publish.release_status(&auth, &slug, &version).await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

/// `POST /api/v1/publish/skills/{slug}/releases/{version}/publish`
pub async fn publish_release(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path((slug, version)): Path<(String, String)>,
) -> Result<Json<ReleaseDto>> {
    publish_rate(&state, &auth).await?;
    let release = state.publish.publish(&auth, &slug, &version).await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

#[derive(Deserialize)]
pub struct YankBody {
    pub reason: String,
}

/// `POST /api/v1/publish/skills/{slug}/releases/{version}/yank`
pub async fn yank_release(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path((slug, version)): Path<(String, String)>,
    Json(body): Json<YankBody>,
) -> Result<Json<ReleaseDto>> {
    publish_rate(&state, &auth).await?;
    let release = state.publish.yank(&auth, &slug, &version, body.reason).await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

/// `POST /api/v1/publish/skills/{slug}/releases/{version}/unyank`
pub async fn unyank_release(
    State(state): State<ApiState>,
    RequireAuth(auth): RequireAuth,
    Path((slug, version)): Path<(String, String)>,
) -> Result<Json<ReleaseDto>> {
    publish_rate(&state, &auth).await?;
    let release = state.publish.unyank(&auth, &slug, &version).await?;
    Ok(Json(ReleaseDto::from_domain(&release, None)))
}

fn parse_digest_header(headers: &HeaderMap) -> Result<Option<Digest>> {
    match headers.get("x-artifact-digest").map(|v| v.to_str()) {
        None => Ok(None),
        Some(Ok(raw)) => Digest::parse(raw)
            .map(Some)
            .map_err(|m| RegistryError::validation("PKG_DIGEST_MISMATCH", m)),
        Some(Err(_)) => Err(RegistryError::validation(
            "PKG_DIGEST_MISMATCH",
            "x-artifact-digest is not valid ASCII",
        )),
    }
}

/// Scope the client-supplied key to publisher+release so keys cannot collide
/// or be replayed across publishers.
fn idempotency_key(headers: &HeaderMap, auth: &AuthContext, slug: &str, version: &str) -> Option<String> {
    headers
        .get("idempotency-key")
        .and_then(|v| v.to_str().ok())
        .map(str::trim)
        .filter(|v| !v.is_empty() && v.len() <= 128)
        .map(|v| format!("{}:{slug}:{version}:{v}", auth.publisher.id))
}
