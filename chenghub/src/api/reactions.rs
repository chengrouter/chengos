//! Reaction routes. Support is one-way; like/star toggle.

use axum::extract::{Path, State};
use axum::Json;
use uuid::Uuid;

use crate::api::middleware::RequireUser;
use crate::api::ApiState;
use crate::domain::reaction::PostReaction;
use crate::error::Result;

/// POST /api/v1/posts/:id/support — "I need this too", not removable.
pub async fn support(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(post_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.abuse.check_reaction(ctx.user.id).await?;
    let reaction_state = state.reactions.support(&ctx, post_id).await?;
    Ok(Json(serde_json::json!({ "viewer": {
        "supported": reaction_state.supported,
        "liked": reaction_state.liked,
        "starred": reaction_state.starred,
    }})))
}

/// POST /api/v1/posts/:id/like — toggle.
pub async fn like(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(post_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.abuse.check_reaction(ctx.user.id).await?;
    let outcome = state.reactions.toggle(&ctx, post_id, PostReaction::Like).await?;
    Ok(Json(serde_json::json!({ "active": outcome.active, "count": outcome.count })))
}

/// POST /api/v1/posts/:id/star — toggle.
pub async fn star(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(post_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.abuse.check_reaction(ctx.user.id).await?;
    let outcome = state.reactions.toggle(&ctx, post_id, PostReaction::Star).await?;
    Ok(Json(serde_json::json!({ "active": outcome.active, "count": outcome.count })))
}

/// POST /api/v1/comments/:id/like — toggle.
pub async fn comment_like(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
    Path(comment_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    state.abuse.check_reaction(ctx.user.id).await?;
    let outcome = state.reactions.toggle_comment_like(&ctx, comment_id).await?;
    Ok(Json(serde_json::json!({ "active": outcome.active, "count": outcome.count })))
}

/// GET /api/v1/me/reactions — the viewer's reacted post ids by type.
pub async fn my_reactions(
    State(state): State<ApiState>,
    RequireUser(ctx): RequireUser,
) -> Result<Json<std::collections::HashMap<String, Vec<Uuid>>>> {
    Ok(Json(state.reactions.my_reactions(&ctx).await?))
}
