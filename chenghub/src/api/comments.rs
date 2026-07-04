//! Comment routes.

use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use uuid::Uuid;

use crate::api::dto::{author_ref_of, CommentDto, CommentListResponse, CommentRequest};
use crate::api::middleware::{MaybeUser, RequireUser};
use crate::api::ApiState;
use crate::domain::pagination::{Cursor, PageRequest};
use crate::error::{codes, HubError, Result};
use crate::services::post_service::viewer_of_opt;

#[derive(Deserialize)]
pub struct CommentsQuery {
    pub cursor: Option<String>,
    pub limit: Option<u32>,
}

/// GET /api/v1/posts/:id/comments
pub async fn list(
    State(state): State<ApiState>,
    Path(post_id): Path<Uuid>,
    Query(query): Query<CommentsQuery>,
    MaybeUser(user): MaybeUser,
) -> Result<Json<CommentListResponse>> {
    let cursor = match query.cursor.as_deref() {
        None => None,
        Some(raw) => Some(
            Cursor::decode(raw, "comments")
                .map_err(|msg| HubError::validation(codes::INVALID_CURSOR, msg))?,
        ),
    };
    let viewer = viewer_of_opt(user.as_ref());
    let page = state
        .comments
        .list(post_id, &viewer, PageRequest::new(query.limit, cursor))
        .await?;

    // Batch the viewer's likes for the returned page.
    let liked = match &user {
        Some(ctx) => {
            let ids: Vec<Uuid> = page.items.iter().map(|r| r.comment.id).collect();
            state.reactions.liked_lookup(ctx.user.id, &ids).await?
        }
        None => Default::default(),
    };

    Ok(Json(CommentListResponse {
        items: page
            .items
            .iter()
            .map(|record| CommentDto::from_record(record, liked.contains(&record.comment.id)))
            .collect(),
        next_cursor: page.next_cursor,
    }))
}

/// POST /api/v1/posts/:id/comments
pub async fn create(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(post_id): Path<Uuid>,
    Json(request): Json<CommentRequest>,
) -> Result<Json<CommentDto>> {
    state.abuse.check_comment(ctx.user.id).await?;
    let comment = state.comments.create(&ctx, post_id, &request.body_md).await?;
    Ok(Json(CommentDto::from_comment(&comment, author_ref_of(&ctx.user))))
}

/// PUT /api/v1/comments/:id
pub async fn update(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
    Json(request): Json<CommentRequest>,
) -> Result<Json<CommentDto>> {
    let comment = state.comments.update(&ctx, id, &request.body_md).await?;
    Ok(Json(CommentDto::from_comment(&comment, author_ref_of(&ctx.user))))
}

/// DELETE /api/v1/comments/:id
pub async fn delete(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.comments.delete(&ctx, id).await?;
    Ok(Json(serde_json::json!({ "ok": true })))
}
