//! Public post routes: list, detail, create/update/delete, status, search,
//! and similar-title lookup.

use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use uuid::Uuid;

use crate::api::dto::{
    CreatePostRequest, DuplicateBannerDto, PostDetailResponse, PostDto, PostListItemDto,
    PostListResponse, SetStatusRequest, StatusEventDto, UpdatePostRequest,
};
use crate::api::middleware::{MaybeUser, RequireUser};
use crate::api::ApiState;
use crate::domain::pagination::{Cursor, PageRequest};
use crate::domain::post::{PostFilter, PostSort, PostType, RequirementStatus};
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::SimilarPost;
use crate::services::post_service::viewer_of_opt;

#[derive(Deserialize)]
pub struct ListQuery {
    #[serde(rename = "type")]
    pub post_type: Option<String>,
    pub status: Option<String>,
    pub tag: Option<String>,
    /// Author filter by user id.
    pub author: Option<Uuid>,
    pub sort: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<u32>,
}

fn parse_sort(raw: Option<&str>) -> Result<PostSort> {
    match raw {
        None => Ok(PostSort::Hot),
        Some(raw) => PostSort::parse(raw).ok_or_else(|| {
            HubError::validation(codes::INVALID_PARAM, format!("unknown sort {raw:?}"))
        }),
    }
}

fn parse_cursor(raw: Option<&str>, order: &str) -> Result<Option<Cursor>> {
    match raw {
        None => Ok(None),
        Some(raw) => Cursor::decode(raw, order)
            .map(Some)
            .map_err(|msg| HubError::validation(codes::INVALID_CURSOR, msg)),
    }
}

/// GET /api/v1/posts
pub async fn list(
    State(state): State<ApiState>,
    Query(query): Query<ListQuery>,
    MaybeUser(user): MaybeUser,
) -> Result<Json<PostListResponse>> {
    let sort = parse_sort(query.sort.as_deref())?;
    let post_type = query
        .post_type
        .as_deref()
        .map(|raw| {
            PostType::parse(raw).ok_or_else(|| {
                HubError::validation(codes::INVALID_PARAM, format!("unknown type {raw:?}"))
            })
        })
        .transpose()?;
    let status = query
        .status
        .as_deref()
        .map(|raw| {
            RequirementStatus::parse(raw).ok_or_else(|| {
                HubError::validation(codes::INVALID_PARAM, format!("unknown status {raw:?}"))
            })
        })
        .transpose()?;

    let viewer = viewer_of_opt(user.as_ref());
    let filter = PostFilter {
        post_type,
        status,
        tag: query.tag.clone(),
        author: query.author,
        viewer: viewer.clone(),
    };
    let page = PageRequest::new(query.limit, parse_cursor(query.cursor.as_deref(), sort.as_str())?);
    let result = state.posts.list(&filter, sort, page).await?;
    let states = state.posts.viewer_states(&viewer, &result.items).await?;

    Ok(Json(PostListResponse {
        items: result
            .items
            .iter()
            .map(|record| {
                PostListItemDto::from_record(record, states.get(&record.post.id).copied())
            })
            .collect(),
        next_cursor: result.next_cursor,
    }))
}

/// GET /api/v1/posts/:id
pub async fn detail(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
    MaybeUser(user): MaybeUser,
) -> Result<Json<PostDetailResponse>> {
    let viewer = viewer_of_opt(user.as_ref());
    let detail = state.posts.detail(id, &viewer).await?;
    Ok(Json(PostDetailResponse {
        post: PostDto::from_record(&detail.record, detail.viewer_state),
        status_history: detail.status_history.iter().map(StatusEventDto::from).collect(),
        duplicate_of: detail.duplicate_of.map(|(target_post_id, target_title)| {
            DuplicateBannerDto { target_post_id, target_title }
        }),
    }))
}

/// POST /api/v1/posts
pub async fn create(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Json(request): Json<CreatePostRequest>,
) -> Result<Json<PostDto>> {
    state.abuse.check_post(ctx.user.id).await?;
    let post_type = PostType::parse(&request.post_type).ok_or_else(|| {
        HubError::validation(codes::INVALID_PARAM, format!("unknown type {:?}", request.post_type))
    })?;
    let post = state
        .posts
        .create(
            &ctx,
            post_type,
            &request.title,
            &request.body_md,
            &request.tags,
            request.workflow_share_id,
        )
        .await?;
    // Re-read joined with the author for a uniform response shape.
    let record = state
        .posts
        .detail(post.id, &crate::services::post_service::viewer_of(&ctx))
        .await?;
    Ok(Json(PostDto::from_record(&record.record, record.viewer_state)))
}

/// PUT /api/v1/posts/:id
pub async fn update(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdatePostRequest>,
) -> Result<Json<PostDto>> {
    state
        .posts
        .update(&ctx, id, &request.title, &request.body_md, &request.tags)
        .await?;
    let record = state
        .posts
        .detail(id, &crate::services::post_service::viewer_of(&ctx))
        .await?;
    Ok(Json(PostDto::from_record(&record.record, record.viewer_state)))
}

/// DELETE /api/v1/posts/:id
pub async fn delete(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.posts.delete(&ctx, id).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}

/// PATCH /api/v1/posts/:id/status — operator requirement triage.
pub async fn set_status(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<SetStatusRequest>,
) -> Result<Json<PostDto>> {
    let to = RequirementStatus::parse(&request.status).ok_or_else(|| {
        HubError::validation(codes::INVALID_PARAM, format!("unknown status {:?}", request.status))
    })?;
    state
        .requirements
        .set_status(&ctx, id, to, request.note.as_deref())
        .await?;
    let record = state
        .posts
        .detail(id, &crate::services::post_service::viewer_of(&ctx))
        .await?;
    Ok(Json(PostDto::from_record(&record.record, record.viewer_state)))
}

#[derive(Deserialize)]
pub struct SearchQuery {
    pub q: String,
    pub cursor: Option<String>,
    pub limit: Option<u32>,
}

/// GET /api/v1/posts/search
pub async fn search(
    State(state): State<ApiState>,
    Query(query): Query<SearchQuery>,
    MaybeUser(user): MaybeUser,
) -> Result<Json<PostListResponse>> {
    let page = PageRequest::new(query.limit, parse_cursor(query.cursor.as_deref(), "search")?);
    let result = state.search.search(&query.q, page).await?;
    let viewer = viewer_of_opt(user.as_ref());
    let states = state.posts.viewer_states(&viewer, &result.items).await?;
    Ok(Json(PostListResponse {
        items: result
            .items
            .iter()
            .map(|record| {
                PostListItemDto::from_record(record, states.get(&record.post.id).copied())
            })
            .collect(),
        next_cursor: result.next_cursor,
    }))
}

#[derive(Deserialize)]
pub struct SimilarQuery {
    pub title: String,
    pub limit: Option<u32>,
}

/// GET /api/v1/posts/similar — anti-duplication hints while composing.
pub async fn similar(
    State(state): State<ApiState>,
    Query(query): Query<SimilarQuery>,
) -> Result<Json<Vec<SimilarPost>>> {
    Ok(Json(state.search.similar_titles(&query.title, query.limit).await?))
}
