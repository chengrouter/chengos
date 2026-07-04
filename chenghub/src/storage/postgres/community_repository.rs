//! PostgreSQL implementations of the community repository ports.
//!
//! Composite operations (status change, duplicate merge, hide/restore, ban)
//! run in explicit transactions and write their audit event in the same
//! transaction. Counters are trigger-maintained; the duplicate merge also
//! recounts the target explicitly per the product rules.

use std::collections::{HashMap, HashSet};

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::Row;
use uuid::Uuid;

use crate::domain::comment::{Comment, CommentId};
use crate::domain::identity::UserId;
use crate::domain::moderation::{
    NewAuditEvent, Report, ReportId, ReportReason, ReportStatus, ReportSubjectType, UserBan,
};
use crate::domain::pagination::{Cursor, Page, PageRequest};
use crate::domain::post::{
    Post, PostFilter, PostId, PostSort, PostStatusTransition, RequirementStatus,
    ViewerContext,
};
use crate::domain::reaction::{PostReaction, PostReactionState, ToggleOutcome};
use crate::domain::workflow_share::{
    NewWorkflowShare, RequiredVariable, RequiredVariableKind, SafetyFinding, WorkflowShare,
    WorkflowShareId,
};
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::*;

use super::models::*;
use super::{insert_audit, PgRepos};

fn cursor_err() -> HubError {
    HubError::validation(codes::INVALID_CURSOR, "invalid cursor")
}

/// Split a composite cursor key `"a:b"` into parts.
fn cursor_parts(cursor: &Cursor, expected: usize) -> Result<Vec<String>> {
    let parts: Vec<String> = cursor.k.split(':').map(String::from).collect();
    if parts.len() != expected {
        return Err(cursor_err());
    }
    Ok(parts)
}

fn micros_to_ts(raw: &str) -> Result<DateTime<Utc>> {
    let micros: i64 = raw.parse().map_err(|_| cursor_err())?;
    DateTime::<Utc>::from_timestamp_micros(micros).ok_or_else(cursor_err)
}

/// Insert tag rows for a post (tags are already validated + deduplicated).
async fn insert_tags(
    tx: &mut sqlx::PgConnection,
    post_id: PostId,
    tags: &[String],
) -> Result<()> {
    for tag in tags {
        sqlx::query("INSERT INTO post_tags (post_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING")
            .bind(post_id)
            .bind(tag)
            .execute(&mut *tx)
            .await?;
    }
    Ok(())
}

async fn insert_status_event(
    tx: &mut sqlx::PgConnection,
    post_id: PostId,
    from: Option<RequirementStatus>,
    to: RequirementStatus,
    changed_by: Option<UserId>,
    note: Option<&str>,
) -> Result<()> {
    sqlx::query(
        "INSERT INTO post_status_events (post_id, from_status, to_status, changed_by, note)
         VALUES ($1, $2, $3, $4, $5)",
    )
    .bind(post_id)
    .bind(from.map(|s| s.as_str()))
    .bind(to.as_str())
    .bind(changed_by)
    .bind(note)
    .execute(&mut *tx)
    .await?;
    Ok(())
}

async fn insert_moderation_action(
    tx: &mut sqlx::PgConnection,
    actor: UserId,
    action: &str,
    subject_type: &str,
    subject_id: Uuid,
    reason: &str,
) -> Result<()> {
    sqlx::query(
        "INSERT INTO moderation_actions (actor_id, action, subject_type, subject_id, reason)
         VALUES ($1, $2, $3, $4, $5)",
    )
    .bind(actor)
    .bind(action)
    .bind(subject_type)
    .bind(subject_id)
    .bind(reason)
    .execute(&mut *tx)
    .await?;
    Ok(())
}

#[async_trait]
impl PostRepo for PgRepos {
    async fn create(&self, post: NewPost) -> Result<Post> {
        let mut tx = self.pool().begin().await?;
        let status = matches!(post.post_type, crate::domain::post::PostType::Requirement)
            .then_some(RequirementStatus::New);
        let row: PostRow = sqlx::query_as(&format!(
            "INSERT INTO posts (author_id, post_type, title, body_md, tags, status, workflow_share_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING {POST_COLUMNS}"
        ))
        .bind(post.author_id)
        .bind(post.post_type.as_str())
        .bind(&post.title)
        .bind(&post.body_md)
        .bind(&post.tags)
        .bind(status.map(|s| s.as_str()))
        .bind(post.workflow_share_id)
        .fetch_one(&mut *tx)
        .await?;

        insert_tags(&mut tx, row.id, &post.tags).await?;
        if let Some(status) = status {
            insert_status_event(&mut tx, row.id, None, status, Some(post.author_id), None).await?;
        }
        tx.commit().await?;
        row.into_domain()
    }

    async fn get(&self, id: PostId) -> Result<Option<Post>> {
        let row: Option<PostRow> =
            sqlx::query_as(&format!("SELECT {POST_COLUMNS} FROM posts WHERE id = $1"))
                .bind(id)
                .fetch_optional(self.pool())
                .await?;
        row.map(PostRow::into_domain).transpose()
    }

    async fn get_record(&self, id: PostId) -> Result<Option<PostRecord>> {
        let row: Option<PostRecordRow> = sqlx::query_as(&format!(
            "SELECT {}, {AUTHOR_JOIN_COLUMNS} FROM posts p
             JOIN chenghub_users u ON u.id = p.author_id
             WHERE p.id = $1",
            post_columns_prefixed()
        ))
        .bind(id)
        .fetch_optional(self.pool())
        .await?;
        row.map(PostRecordRow::into_domain).transpose()
    }

    async fn update_content(&self, id: PostId, update: PostUpdate) -> Result<Post> {
        let mut tx = self.pool().begin().await?;
        let row: PostRow = sqlx::query_as(&format!(
            "UPDATE posts SET title = $2, body_md = $3, tags = $4 WHERE id = $1
             RETURNING {POST_COLUMNS}"
        ))
        .bind(id)
        .bind(&update.title)
        .bind(&update.body_md)
        .bind(&update.tags)
        .fetch_one(&mut *tx)
        .await?;
        sqlx::query("DELETE FROM post_tags WHERE post_id = $1")
            .bind(id)
            .execute(&mut *tx)
            .await?;
        insert_tags(&mut tx, id, &update.tags).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn soft_delete(&self, id: PostId) -> Result<bool> {
        let affected = sqlx::query(
            "UPDATE posts SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected > 0)
    }

    async fn list(
        &self,
        filter: &PostFilter,
        sort: PostSort,
        page: PageRequest,
    ) -> Result<Page<PostRecord>> {
        list_posts(self, filter, sort, page).await
    }

    async fn set_status(
        &self,
        id: PostId,
        from: RequirementStatus,
        to: RequirementStatus,
        duplicate_of: Option<PostId>,
        changed_by: UserId,
        note: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<Post> {
        let mut tx = self.pool().begin().await?;
        // Guard on the expected `from` so concurrent operators can't
        // silently overwrite each other.
        let row: Option<PostRow> = sqlx::query_as(&format!(
            "UPDATE posts SET status = $3, duplicate_of_post_id = $4, last_activity_at = now()
             WHERE id = $1 AND status = $2
             RETURNING {POST_COLUMNS}"
        ))
        .bind(id)
        .bind(from.as_str())
        .bind(to.as_str())
        .bind(duplicate_of)
        .fetch_optional(&mut *tx)
        .await?;
        let Some(row) = row else {
            tx.rollback().await?;
            return Err(HubError::invalid_state(
                codes::INVALID_STATUS_TRANSITION,
                "post status changed concurrently; reload and retry",
            ));
        };
        insert_status_event(&mut tx, id, Some(from), to, Some(changed_by), note).await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }

    async fn merge_duplicate(
        &self,
        source_id: PostId,
        target_id: PostId,
        actor: UserId,
        note: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<MergeOutcome> {
        let mut tx = self.pool().begin().await?;

        // Lock both posts in a stable order to avoid deadlocks between
        // concurrent merges.
        let (first, second) = if source_id < target_id {
            (source_id, target_id)
        } else {
            (target_id, source_id)
        };
        for lock_id in [first, second] {
            sqlx::query("SELECT id FROM posts WHERE id = $1 FOR UPDATE")
                .bind(lock_id)
                .fetch_optional(&mut *tx)
                .await?;
        }

        let source: Option<PostRow> =
            sqlx::query_as(&format!("SELECT {POST_COLUMNS} FROM posts WHERE id = $1"))
                .bind(source_id)
                .fetch_optional(&mut *tx)
                .await?;
        let source = source.ok_or(HubError::NotFound("post"))?.into_domain()?;
        let target: Option<PostRow> =
            sqlx::query_as(&format!("SELECT {POST_COLUMNS} FROM posts WHERE id = $1"))
                .bind(target_id)
                .fetch_optional(&mut *tx)
                .await?;
        let target = target.ok_or(HubError::NotFound("post"))?.into_domain()?;

        // Re-validate invariants under the lock.
        let source_status = source.status.ok_or_else(|| {
            HubError::invalid_state(codes::NOT_REQUIREMENT, "source is not a requirement")
        })?;
        if target.is_deleted()
            || target.status == Some(RequirementStatus::Duplicate)
            || target_id == source_id
        {
            return Err(HubError::invalid_state(
                codes::MERGE_TARGET_INVALID,
                "merge target must be a live, non-duplicate post",
            ));
        }

        // Copy supports without double-counting; the reaction trigger bumps
        // the target count per inserted row.
        let supports_copied = sqlx::query(
            "INSERT INTO post_reactions (user_id, post_id, reaction_type)
             SELECT user_id, $2, 'support' FROM post_reactions
             WHERE post_id = $1 AND reaction_type = 'support'
             ON CONFLICT DO NOTHING",
        )
        .bind(source_id)
        .bind(target_id)
        .execute(&mut *tx)
        .await?
        .rows_affected() as i64;

        // Recount the target in the same transaction (belt and braces —
        // this is the number the product logic depends on).
        let target_support_count: i32 = sqlx::query(
            "UPDATE posts SET support_count = sub.cnt, last_activity_at = now()
             FROM (SELECT count(*)::int AS cnt FROM post_reactions
                   WHERE post_id = $1 AND reaction_type = 'support') sub
             WHERE id = $1
             RETURNING support_count",
        )
        .bind(target_id)
        .fetch_one(&mut *tx)
        .await?
        .get("support_count");

        // Mark the source as duplicate-of-target (comments stay on the
        // source; the API surfaces the duplicate banner from these fields).
        sqlx::query(
            "UPDATE posts SET status = 'duplicate', duplicate_of_post_id = $2,
                    last_activity_at = now()
             WHERE id = $1",
        )
        .bind(source_id)
        .bind(target_id)
        .execute(&mut *tx)
        .await?;

        insert_status_event(
            &mut tx,
            source_id,
            Some(source_status),
            RequirementStatus::Duplicate,
            Some(actor),
            note,
        )
        .await?;
        insert_moderation_action(&mut tx, actor, "post.merge_duplicate", "post", source_id, "")
            .await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;

        Ok(MergeOutcome { source_id, target_id, supports_copied, target_support_count })
    }

    async fn status_history(&self, post_id: PostId) -> Result<Vec<PostStatusTransition>> {
        let rows: Vec<StatusEventRow> = sqlx::query_as(
            "SELECT id, post_id, from_status, to_status, changed_by, note, created_at
             FROM post_status_events WHERE post_id = $1 ORDER BY created_at, id",
        )
        .bind(post_id)
        .fetch_all(self.pool())
        .await?;
        rows.into_iter().map(StatusEventRow::into_domain).collect()
    }

    async fn set_hidden(
        &self,
        id: PostId,
        hidden: bool,
        actor: UserId,
        reason: &str,
        audit: NewAuditEvent,
    ) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let affected = if hidden {
            sqlx::query(
                "UPDATE posts SET hidden_at = now(), hidden_by = $2
                 WHERE id = $1 AND hidden_at IS NULL AND deleted_at IS NULL",
            )
            .bind(id)
            .bind(actor)
            .execute(&mut *tx)
            .await?
            .rows_affected()
        } else {
            sqlx::query(
                "UPDATE posts SET hidden_at = NULL, hidden_by = NULL
                 WHERE id = $1 AND hidden_at IS NOT NULL",
            )
            .bind(id)
            .execute(&mut *tx)
            .await?
            .rows_affected()
        };
        if affected > 0 {
            let action = if hidden { "post.hide" } else { "post.restore" };
            insert_moderation_action(&mut tx, actor, action, "post", id, reason).await?;
            insert_audit(&mut *tx, &audit).await?;
        }
        tx.commit().await?;
        Ok(affected > 0)
    }

    async fn touch_activity(&self, id: PostId) -> Result<()> {
        sqlx::query("UPDATE posts SET last_activity_at = now() WHERE id = $1")
            .bind(id)
            .execute(self.pool())
            .await?;
        Ok(())
    }
}

/// Shared list query: one SQL text per sort with a common filter block.
async fn list_posts(
    repos: &PgRepos,
    filter: &PostFilter,
    sort: PostSort,
    page: PageRequest,
) -> Result<Page<PostRecord>> {
    let base_filter = "p.deleted_at IS NULL
        AND ($1::text IS NULL OR p.post_type = $1)
        AND ($2::text IS NULL OR p.status = $2)
        AND ($3::text IS NULL OR EXISTS (
              SELECT 1 FROM post_tags pt WHERE pt.post_id = p.id AND pt.tag = $3))
        AND ($4::uuid IS NULL OR p.author_id = $4)
        AND (p.hidden_at IS NULL OR $5::boolean OR p.author_id = $6::uuid)";

    let (sort_where, order_by) = match sort {
        PostSort::Hot => (
            "($7::int IS NULL OR (p.support_count, p.last_activity_at, p.id) < ($7, $8::timestamptz, $9::uuid))",
            "p.support_count DESC, p.last_activity_at DESC, p.id DESC",
        ),
        // Unused cursor params are still referenced (`$n IS NULL OR TRUE`)
        // so their types come from the bind, never server-side inference.
        PostSort::Newest => (
            "($7::int IS NULL OR TRUE)
             AND ($8::timestamptz IS NULL OR (p.created_at, p.id) < ($8, $9::uuid))",
            "p.created_at DESC, p.id DESC",
        ),
        PostSort::Active => (
            "($7::int IS NULL OR TRUE)
             AND ($8::timestamptz IS NULL OR (p.last_activity_at, p.id) < ($8, $9::uuid))",
            "p.last_activity_at DESC, p.id DESC",
        ),
        PostSort::Pending => (
            "p.status IN ('new', 'triaged', 'planned', 'in_progress')
             AND ($8::timestamptz IS NULL OR TRUE)
             AND ($7::int IS NULL OR (p.support_count, p.id) < ($7, $9::uuid))",
            "p.support_count DESC, p.id DESC",
        ),
        PostSort::Resolved => (
            "p.status IN ('done', 'rejected', 'duplicate')
             AND ($7::int IS NULL OR ((p.status = 'done')::int, p.updated_at, p.id) < ($7, $8::timestamptz, $9::uuid))",
            "(p.status = 'done')::int DESC, p.updated_at DESC, p.id DESC",
        ),
    };

    // Decode the cursor into up to three typed binds.
    let (mut k_int, mut k_ts, mut k_id): (Option<i32>, Option<DateTime<Utc>>, Option<Uuid>) =
        (None, None, None);
    if let Some(cursor) = &page.cursor {
        if cursor.o != sort.as_str() {
            return Err(cursor_err());
        }
        k_id = Some(cursor.id);
        match sort {
            PostSort::Hot | PostSort::Resolved => {
                let parts = cursor_parts(cursor, 2)?;
                k_int = Some(parts[0].parse().map_err(|_| cursor_err())?);
                k_ts = Some(micros_to_ts(&parts[1])?);
            }
            PostSort::Newest | PostSort::Active => {
                let parts = cursor_parts(cursor, 1)?;
                k_ts = Some(micros_to_ts(&parts[0])?);
            }
            PostSort::Pending => {
                let parts = cursor_parts(cursor, 1)?;
                k_int = Some(parts[0].parse().map_err(|_| cursor_err())?);
            }
        }
    }

    let sql = format!(
        "SELECT {}, {AUTHOR_JOIN_COLUMNS} FROM posts p
         JOIN chenghub_users u ON u.id = p.author_id
         WHERE {base_filter} AND {sort_where}
         ORDER BY {order_by}
         LIMIT $10",
        post_columns_prefixed()
    );

    let rows: Vec<PostRecordRow> = sqlx::query_as(&sql)
        .bind(filter.post_type.map(|t| t.as_str()))
        .bind(filter.status.map(|s| s.as_str()))
        .bind(&filter.tag)
        .bind(filter.author)
        .bind(filter.viewer.is_staff)
        .bind(filter.viewer.user_id)
        .bind(k_int)
        .bind(k_ts)
        .bind(k_id)
        .bind(page.limit as i64 + 1)
        .fetch_all(repos.pool())
        .await?;

    let mut items: Vec<PostRecord> = rows
        .into_iter()
        .map(PostRecordRow::into_domain)
        .collect::<Result<_>>()?;
    let next_cursor = if items.len() > page.limit as usize {
        items.truncate(page.limit as usize);
        items.last().map(|record| {
            let p = &record.post;
            let k = match sort {
                PostSort::Hot => format!(
                    "{}:{}",
                    p.support_count,
                    p.last_activity_at.timestamp_micros()
                ),
                PostSort::Newest => p.created_at.timestamp_micros().to_string(),
                PostSort::Active => p.last_activity_at.timestamp_micros().to_string(),
                PostSort::Pending => p.support_count.to_string(),
                PostSort::Resolved => format!(
                    "{}:{}",
                    i32::from(p.status == Some(RequirementStatus::Done)),
                    p.updated_at.timestamp_micros()
                ),
            };
            Cursor { o: sort.as_str().into(), k, id: p.id }.encode()
        })
    } else {
        None
    };
    Ok(Page { items, next_cursor })
}

#[async_trait]
impl CommentRepo for PgRepos {
    async fn create(&self, post_id: PostId, author_id: UserId, body_md: &str) -> Result<Comment> {
        let mut tx = self.pool().begin().await?;
        let row: CommentRow = sqlx::query_as(&format!(
            "INSERT INTO comments (post_id, author_id, body_md) VALUES ($1, $2, $3)
             RETURNING {COMMENT_COLUMNS}"
        ))
        .bind(post_id)
        .bind(author_id)
        .bind(body_md)
        .fetch_one(&mut *tx)
        .await?;
        // Meaningful activity: comment creation bumps the post.
        sqlx::query("UPDATE posts SET last_activity_at = now() WHERE id = $1")
            .bind(post_id)
            .execute(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(row.into_domain())
    }

    async fn get(&self, id: CommentId) -> Result<Option<Comment>> {
        let row: Option<CommentRow> =
            sqlx::query_as(&format!("SELECT {COMMENT_COLUMNS} FROM comments WHERE id = $1"))
                .bind(id)
                .fetch_optional(self.pool())
                .await?;
        Ok(row.map(CommentRow::into_domain))
    }

    async fn list_for_post(
        &self,
        post_id: PostId,
        viewer: &ViewerContext,
        page: PageRequest,
    ) -> Result<Page<CommentRecord>> {
        let (k_ts, k_id) = match &page.cursor {
            None => (None, None),
            Some(c) => {
                if c.o != "comments" {
                    return Err(cursor_err());
                }
                (Some(micros_to_ts(&c.k)?), Some(c.id))
            }
        };
        let comment_cols: String = COMMENT_COLUMNS
            .split(", ")
            .map(|col| format!("c.{col}"))
            .collect::<Vec<_>>()
            .join(", ");
        let rows: Vec<CommentRecordRow> = sqlx::query_as(&format!(
            "SELECT {comment_cols}, u.username AS author_username,
                    u.display_name AS author_display_name, u.avatar_url AS author_avatar_url
             FROM comments c
             JOIN chenghub_users u ON u.id = c.author_id
             WHERE c.post_id = $1
               AND (c.deleted_at IS NULL OR $2::boolean)
               AND (c.hidden_at IS NULL OR $2::boolean OR c.author_id = $3::uuid)
               AND ($4::timestamptz IS NULL OR (c.created_at, c.id) > ($4, $5::uuid))
             ORDER BY c.created_at, c.id
             LIMIT $6"
        ))
        .bind(post_id)
        .bind(viewer.is_staff)
        .bind(viewer.user_id)
        .bind(k_ts)
        .bind(k_id)
        .bind(page.limit as i64 + 1)
        .fetch_all(self.pool())
        .await?;

        let mut items: Vec<CommentRecord> =
            rows.into_iter().map(CommentRecordRow::into_domain).collect();
        let next_cursor = if items.len() > page.limit as usize {
            items.truncate(page.limit as usize);
            items.last().map(|record| {
                Cursor {
                    o: "comments".into(),
                    k: record.comment.created_at.timestamp_micros().to_string(),
                    id: record.comment.id,
                }
                .encode()
            })
        } else {
            None
        };
        Ok(Page { items, next_cursor })
    }

    async fn update_body(&self, id: CommentId, body_md: &str) -> Result<Comment> {
        let row: CommentRow = sqlx::query_as(&format!(
            "UPDATE comments SET body_md = $2 WHERE id = $1 RETURNING {COMMENT_COLUMNS}"
        ))
        .bind(id)
        .bind(body_md)
        .fetch_one(self.pool())
        .await?;
        Ok(row.into_domain())
    }

    async fn soft_delete(&self, id: CommentId) -> Result<bool> {
        let affected = sqlx::query(
            "UPDATE comments SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(self.pool())
        .await?
        .rows_affected();
        Ok(affected > 0)
    }

    async fn set_hidden(
        &self,
        id: CommentId,
        hidden: bool,
        actor: UserId,
        reason: &str,
        audit: NewAuditEvent,
    ) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let affected = if hidden {
            sqlx::query(
                "UPDATE comments SET hidden_at = now(), hidden_by = $2
                 WHERE id = $1 AND hidden_at IS NULL AND deleted_at IS NULL",
            )
            .bind(id)
            .bind(actor)
            .execute(&mut *tx)
            .await?
            .rows_affected()
        } else {
            sqlx::query(
                "UPDATE comments SET hidden_at = NULL, hidden_by = NULL
                 WHERE id = $1 AND hidden_at IS NOT NULL",
            )
            .bind(id)
            .execute(&mut *tx)
            .await?
            .rows_affected()
        };
        if affected > 0 {
            let action = if hidden { "comment.hide" } else { "comment.restore" };
            insert_moderation_action(&mut tx, actor, action, "comment", id, reason).await?;
            insert_audit(&mut *tx, &audit).await?;
        }
        tx.commit().await?;
        Ok(affected > 0)
    }
}

#[async_trait]
impl ReactionRepo for PgRepos {
    async fn add_support(&self, user_id: UserId, post_id: PostId) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let inserted = sqlx::query(
            "INSERT INTO post_reactions (user_id, post_id, reaction_type)
             VALUES ($1, $2, 'support') ON CONFLICT DO NOTHING",
        )
        .bind(user_id)
        .bind(post_id)
        .execute(&mut *tx)
        .await?
        .rows_affected()
            > 0;
        if inserted {
            sqlx::query("UPDATE posts SET last_activity_at = now() WHERE id = $1")
                .bind(post_id)
                .execute(&mut *tx)
                .await?;
        }
        tx.commit().await?;
        Ok(inserted)
    }

    async fn toggle_post_reaction(
        &self,
        user_id: UserId,
        post_id: PostId,
        reaction: PostReaction,
    ) -> Result<ToggleOutcome> {
        let mut tx = self.pool().begin().await?;
        let inserted = sqlx::query(
            "INSERT INTO post_reactions (user_id, post_id, reaction_type)
             VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        )
        .bind(user_id)
        .bind(post_id)
        .bind(reaction.as_str())
        .execute(&mut *tx)
        .await?
        .rows_affected()
            > 0;
        if !inserted {
            sqlx::query(
                "DELETE FROM post_reactions
                 WHERE user_id = $1 AND post_id = $2 AND reaction_type = $3",
            )
            .bind(user_id)
            .bind(post_id)
            .bind(reaction.as_str())
            .execute(&mut *tx)
            .await?;
        }
        let count_column = match reaction {
            PostReaction::Support => "support_count",
            PostReaction::Like => "like_count",
            PostReaction::Star => "star_count",
        };
        let count: i32 =
            sqlx::query(&format!("SELECT {count_column} FROM posts WHERE id = $1"))
                .bind(post_id)
                .fetch_one(&mut *tx)
                .await?
                .get(count_column);
        tx.commit().await?;
        Ok(ToggleOutcome { active: inserted, count })
    }

    async fn toggle_comment_like(
        &self,
        user_id: UserId,
        comment_id: CommentId,
    ) -> Result<ToggleOutcome> {
        let mut tx = self.pool().begin().await?;
        let inserted = sqlx::query(
            "INSERT INTO comment_reactions (user_id, comment_id, reaction_type)
             VALUES ($1, $2, 'like') ON CONFLICT DO NOTHING",
        )
        .bind(user_id)
        .bind(comment_id)
        .execute(&mut *tx)
        .await?
        .rows_affected()
            > 0;
        if !inserted {
            sqlx::query(
                "DELETE FROM comment_reactions WHERE user_id = $1 AND comment_id = $2",
            )
            .bind(user_id)
            .bind(comment_id)
            .execute(&mut *tx)
            .await?;
        }
        let count: i32 = sqlx::query("SELECT like_count FROM comments WHERE id = $1")
            .bind(comment_id)
            .fetch_one(&mut *tx)
            .await?
            .get("like_count");
        tx.commit().await?;
        Ok(ToggleOutcome { active: inserted, count })
    }

    async fn post_state(&self, user_id: UserId, post_id: PostId) -> Result<PostReactionState> {
        let rows: Vec<(String,)> = sqlx::query_as(
            "SELECT reaction_type FROM post_reactions WHERE user_id = $1 AND post_id = $2",
        )
        .bind(user_id)
        .bind(post_id)
        .fetch_all(self.pool())
        .await?;
        let mut state = PostReactionState::default();
        for (r,) in rows {
            match r.as_str() {
                "support" => state.supported = true,
                "like" => state.liked = true,
                "star" => state.starred = true,
                _ => {}
            }
        }
        Ok(state)
    }

    async fn post_states(
        &self,
        user_id: UserId,
        post_ids: &[PostId],
    ) -> Result<HashMap<PostId, PostReactionState>> {
        if post_ids.is_empty() {
            return Ok(HashMap::new());
        }
        let rows: Vec<(Uuid, String)> = sqlx::query_as(
            "SELECT post_id, reaction_type FROM post_reactions
             WHERE user_id = $1 AND post_id = ANY($2)",
        )
        .bind(user_id)
        .bind(post_ids)
        .fetch_all(self.pool())
        .await?;
        let mut map: HashMap<PostId, PostReactionState> = HashMap::new();
        for (post_id, r) in rows {
            let state = map.entry(post_id).or_default();
            match r.as_str() {
                "support" => state.supported = true,
                "like" => state.liked = true,
                "star" => state.starred = true,
                _ => {}
            }
        }
        Ok(map)
    }

    async fn liked_comments(
        &self,
        user_id: UserId,
        comment_ids: &[CommentId],
    ) -> Result<HashSet<CommentId>> {
        if comment_ids.is_empty() {
            return Ok(HashSet::new());
        }
        let rows: Vec<(Uuid,)> = sqlx::query_as(
            "SELECT comment_id FROM comment_reactions
             WHERE user_id = $1 AND comment_id = ANY($2)",
        )
        .bind(user_id)
        .bind(comment_ids)
        .fetch_all(self.pool())
        .await?;
        Ok(rows.into_iter().map(|(id,)| id).collect())
    }

    async fn user_reactions(&self, user_id: UserId) -> Result<HashMap<String, Vec<PostId>>> {
        let rows: Vec<(Uuid, String)> = sqlx::query_as(
            "SELECT post_id, reaction_type FROM post_reactions
             WHERE user_id = $1 ORDER BY created_at DESC LIMIT 2000",
        )
        .bind(user_id)
        .fetch_all(self.pool())
        .await?;
        let mut map: HashMap<String, Vec<PostId>> = HashMap::new();
        for (post_id, r) in rows {
            map.entry(r).or_default().push(post_id);
        }
        Ok(map)
    }
}

#[async_trait]
impl ReportRepo for PgRepos {
    async fn create(
        &self,
        reporter_id: UserId,
        subject_type: ReportSubjectType,
        subject_id: Uuid,
        reason: ReportReason,
        detail: &str,
    ) -> Result<Report> {
        let row: ReportRow = sqlx::query_as(&format!(
            "INSERT INTO reports (reporter_id, subject_type, subject_id, reason, detail)
             VALUES ($1, $2, $3, $4, $5) RETURNING {REPORT_COLUMNS}"
        ))
        .bind(reporter_id)
        .bind(subject_type.as_str())
        .bind(subject_id)
        .bind(reason.as_str())
        .bind(detail)
        .fetch_one(self.pool())
        .await?;
        row.into_domain()
    }

    async fn list(&self, status: Option<ReportStatus>, page: PageRequest) -> Result<Page<Report>> {
        let (k_ts, k_id) = match &page.cursor {
            None => (None, None),
            Some(c) => {
                if c.o != "reports" {
                    return Err(cursor_err());
                }
                (Some(micros_to_ts(&c.k)?), Some(c.id))
            }
        };
        let rows: Vec<ReportRow> = sqlx::query_as(&format!(
            "SELECT {REPORT_COLUMNS} FROM reports
             WHERE ($1::text IS NULL OR status = $1)
               AND ($2::timestamptz IS NULL OR (created_at, id) < ($2, $3::uuid))
             ORDER BY created_at DESC, id DESC
             LIMIT $4"
        ))
        .bind(status.map(|s| s.as_str()))
        .bind(k_ts)
        .bind(k_id)
        .bind(page.limit as i64 + 1)
        .fetch_all(self.pool())
        .await?;

        let mut items: Vec<Report> = rows
            .into_iter()
            .map(ReportRow::into_domain)
            .collect::<Result<_>>()?;
        let next_cursor = if items.len() > page.limit as usize {
            items.truncate(page.limit as usize);
            items.last().map(|r| {
                Cursor {
                    o: "reports".into(),
                    k: r.created_at.timestamp_micros().to_string(),
                    id: r.id,
                }
                .encode()
            })
        } else {
            None
        };
        Ok(Page { items, next_cursor })
    }

    async fn list_for_reporter(&self, reporter_id: UserId) -> Result<Vec<Report>> {
        let rows: Vec<ReportRow> = sqlx::query_as(&format!(
            "SELECT {REPORT_COLUMNS} FROM reports WHERE reporter_id = $1
             ORDER BY created_at DESC LIMIT 200"
        ))
        .bind(reporter_id)
        .fetch_all(self.pool())
        .await?;
        rows.into_iter().map(ReportRow::into_domain).collect()
    }

    async fn resolve(
        &self,
        id: ReportId,
        resolver: UserId,
        status: ReportStatus,
        note: Option<&str>,
        audit: NewAuditEvent,
    ) -> Result<Report> {
        let mut tx = self.pool().begin().await?;
        let row: Option<ReportRow> = sqlx::query_as(&format!(
            "UPDATE reports SET status = $2, resolved_at = now(), resolved_by = $3,
                    resolution_note = $4
             WHERE id = $1 AND status = 'open'
             RETURNING {REPORT_COLUMNS}"
        ))
        .bind(id)
        .bind(status.as_str())
        .bind(resolver)
        .bind(note)
        .fetch_optional(&mut *tx)
        .await?;
        let Some(row) = row else {
            tx.rollback().await?;
            return Err(HubError::invalid_state(
                codes::REPORT_ALREADY_RESOLVED,
                "report is not open",
            ));
        };
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        row.into_domain()
    }
}

#[async_trait]
impl BanRepo for PgRepos {
    async fn ban(
        &self,
        user_id: UserId,
        actor: UserId,
        reason: &str,
        expires_at: Option<DateTime<Utc>>,
        audit: NewAuditEvent,
    ) -> Result<UserBan> {
        let mut tx = self.pool().begin().await?;
        let row: BanRow = sqlx::query_as(
            "INSERT INTO user_bans (user_id, banned_by, reason, expires_at)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, banned_by, reason, created_at, expires_at, lifted_at, lifted_by",
        )
        .bind(user_id)
        .bind(actor)
        .bind(reason)
        .bind(expires_at)
        .fetch_one(&mut *tx)
        .await?;
        sqlx::query("UPDATE chenghub_users SET banned_at = now() WHERE id = $1")
            .bind(user_id)
            .execute(&mut *tx)
            .await?;
        insert_moderation_action(&mut tx, actor, "user.ban", "user", user_id, reason).await?;
        insert_audit(&mut *tx, &audit).await?;
        tx.commit().await?;
        Ok(row.into_domain())
    }

    async fn unban(&self, user_id: UserId, actor: UserId, audit: NewAuditEvent) -> Result<bool> {
        let mut tx = self.pool().begin().await?;
        let affected = sqlx::query(
            "UPDATE user_bans SET lifted_at = now(), lifted_by = $2
             WHERE user_id = $1 AND lifted_at IS NULL",
        )
        .bind(user_id)
        .bind(actor)
        .execute(&mut *tx)
        .await?
        .rows_affected();
        if affected > 0 {
            sqlx::query("UPDATE chenghub_users SET banned_at = NULL WHERE id = $1")
                .bind(user_id)
                .execute(&mut *tx)
                .await?;
            insert_moderation_action(&mut tx, actor, "user.unban", "user", user_id, "").await?;
            insert_audit(&mut *tx, &audit).await?;
        }
        tx.commit().await?;
        Ok(affected > 0)
    }

    async fn list_active(&self) -> Result<Vec<UserBan>> {
        let rows: Vec<BanRow> = sqlx::query_as(
            "SELECT id, user_id, banned_by, reason, created_at, expires_at, lifted_at, lifted_by
             FROM user_bans WHERE lifted_at IS NULL
             ORDER BY created_at DESC LIMIT 500",
        )
        .fetch_all(self.pool())
        .await?;
        Ok(rows.into_iter().map(BanRow::into_domain).collect())
    }
}

#[async_trait]
impl AuditRepo for PgRepos {
    async fn write(&self, event: NewAuditEvent) -> Result<()> {
        insert_audit(self.pool(), &event).await
    }

    async fn list(
        &self,
        before_id: Option<i64>,
        limit: u32,
    ) -> Result<Vec<crate::domain::moderation::AuditEvent>> {
        let rows: Vec<AuditRow> = sqlx::query_as(
            "SELECT id, actor_type, actor, action, subject_type, subject_id, details,
                    request_id, created_at
             FROM audit_events
             WHERE ($1::bigint IS NULL OR id < $1)
             ORDER BY id DESC LIMIT $2",
        )
        .bind(before_id)
        .bind(limit.clamp(1, 200) as i64)
        .fetch_all(self.pool())
        .await?;
        Ok(rows.into_iter().map(AuditRow::into_domain).collect())
    }
}

#[async_trait]
impl WorkflowShareRepo for PgRepos {
    async fn create(&self, owner_id: UserId, share: &NewWorkflowShare) -> Result<WorkflowShare> {
        let mut tx = self.pool().begin().await?;
        let row: WorkflowShareRow = sqlx::query_as(&format!(
            "INSERT INTO workflow_shares
                (owner_id, title, summary, payload, node_types, node_count,
                 compat_version, sanitizer_version)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING {WORKFLOW_SHARE_COLUMNS}"
        ))
        .bind(owner_id)
        .bind(&share.title)
        .bind(&share.summary)
        .bind(&share.payload)
        .bind(&share.node_types)
        .bind(share.node_count)
        .bind(&share.compat_version)
        .bind(&share.sanitizer_version)
        .fetch_one(&mut *tx)
        .await?;

        for variable in &share.required_variables {
            sqlx::query(
                "INSERT INTO workflow_share_required_variables
                    (share_id, name, kind, description, required)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (share_id, kind, name) DO NOTHING",
            )
            .bind(row.id)
            .bind(&variable.name)
            .bind(variable.kind.as_str())
            .bind(&variable.description)
            .bind(variable.required)
            .execute(&mut *tx)
            .await?;
        }
        for finding in &share.safety_findings {
            sqlx::query(
                "INSERT INTO workflow_share_safety_findings
                    (share_id, kind, severity, message, path)
                 VALUES ($1, $2, $3, $4, $5)",
            )
            .bind(row.id)
            .bind(&finding.kind)
            .bind(&finding.severity)
            .bind(&finding.message)
            .bind(&finding.path)
            .execute(&mut *tx)
            .await?;
        }
        tx.commit().await?;
        Ok(row.into_domain())
    }

    async fn get(&self, id: WorkflowShareId) -> Result<Option<WorkflowShare>> {
        let row: Option<WorkflowShareRow> = sqlx::query_as(&format!(
            "SELECT {WORKFLOW_SHARE_COLUMNS} FROM workflow_shares WHERE id = $1"
        ))
        .bind(id)
        .fetch_optional(self.pool())
        .await?;
        Ok(row.map(WorkflowShareRow::into_domain))
    }

    async fn variables(&self, id: WorkflowShareId) -> Result<Vec<RequiredVariable>> {
        let rows: Vec<(String, String, String, bool)> = sqlx::query_as(
            "SELECT name, kind, description, required
             FROM workflow_share_required_variables WHERE share_id = $1 ORDER BY name",
        )
        .bind(id)
        .fetch_all(self.pool())
        .await?;
        Ok(rows
            .into_iter()
            .filter_map(|(name, kind, description, required)| {
                RequiredVariableKind::parse(&kind).map(|kind| RequiredVariable {
                    name,
                    kind,
                    description,
                    required,
                })
            })
            .collect())
    }

    async fn findings(&self, id: WorkflowShareId) -> Result<Vec<SafetyFinding>> {
        let rows: Vec<(String, String, String, Option<String>)> = sqlx::query_as(
            "SELECT kind, severity, message, path
             FROM workflow_share_safety_findings WHERE share_id = $1 ORDER BY severity DESC, kind",
        )
        .bind(id)
        .fetch_all(self.pool())
        .await?;
        Ok(rows
            .into_iter()
            .map(|(kind, severity, message, path)| SafetyFinding { kind, severity, message, path })
            .collect())
    }

    async fn set_hidden(&self, id: WorkflowShareId, hidden: bool) -> Result<bool> {
        let affected = if hidden {
            sqlx::query(
                "UPDATE workflow_shares SET hidden_at = now()
                 WHERE id = $1 AND hidden_at IS NULL",
            )
            .bind(id)
            .execute(self.pool())
            .await?
            .rows_affected()
        } else {
            sqlx::query(
                "UPDATE workflow_shares SET hidden_at = NULL
                 WHERE id = $1 AND hidden_at IS NOT NULL",
            )
            .bind(id)
            .execute(self.pool())
            .await?
            .rows_affected()
        };
        Ok(affected > 0)
    }
}

#[async_trait]
impl AdminDashboardRepo for PgRepos {
    async fn stats(&self) -> Result<DashboardStats> {
        let posts_by_type: Vec<(String, i64)> = sqlx::query_as(
            "SELECT post_type, count(*) FROM posts WHERE deleted_at IS NULL GROUP BY post_type",
        )
        .fetch_all(self.pool())
        .await?;
        let requirements_by_status: Vec<(String, i64)> = sqlx::query_as(
            "SELECT status, count(*) FROM posts
             WHERE post_type = 'requirement' AND deleted_at IS NULL AND status IS NOT NULL
             GROUP BY status",
        )
        .fetch_all(self.pool())
        .await?;
        let (open_reports,): (i64,) =
            sqlx::query_as("SELECT count(*) FROM reports WHERE status = 'open'")
                .fetch_one(self.pool())
                .await?;
        let (hidden_posts,): (i64,) = sqlx::query_as(
            "SELECT count(*) FROM posts WHERE hidden_at IS NOT NULL AND deleted_at IS NULL",
        )
        .fetch_one(self.pool())
        .await?;
        let (hidden_comments,): (i64,) = sqlx::query_as(
            "SELECT count(*) FROM comments WHERE hidden_at IS NOT NULL AND deleted_at IS NULL",
        )
        .fetch_one(self.pool())
        .await?;
        let (banned_users,): (i64,) =
            sqlx::query_as("SELECT count(*) FROM chenghub_users WHERE banned_at IS NOT NULL")
                .fetch_one(self.pool())
                .await?;
        let (users_total,): (i64,) = sqlx::query_as("SELECT count(*) FROM chenghub_users")
            .fetch_one(self.pool())
            .await?;

        Ok(DashboardStats {
            posts_by_type: posts_by_type.into_iter().collect(),
            requirements_by_status: requirements_by_status.into_iter().collect(),
            open_reports,
            hidden_posts,
            hidden_comments,
            banned_users,
            users_total,
        })
    }

    async fn top_open_requirements(&self, limit: u32) -> Result<Vec<PostRecord>> {
        let rows: Vec<PostRecordRow> = sqlx::query_as(&format!(
            "SELECT {}, {AUTHOR_JOIN_COLUMNS} FROM posts p
             JOIN chenghub_users u ON u.id = p.author_id
             WHERE p.status IN ('new', 'triaged', 'planned', 'in_progress')
               AND p.deleted_at IS NULL
             ORDER BY p.support_count DESC, p.id DESC LIMIT $1",
            post_columns_prefixed()
        ))
        .bind(limit.clamp(1, 100) as i64)
        .fetch_all(self.pool())
        .await?;
        rows.into_iter().map(PostRecordRow::into_domain).collect()
    }

    async fn recently_active_requirements(&self, limit: u32) -> Result<Vec<PostRecord>> {
        let rows: Vec<PostRecordRow> = sqlx::query_as(&format!(
            "SELECT {}, {AUTHOR_JOIN_COLUMNS} FROM posts p
             JOIN chenghub_users u ON u.id = p.author_id
             WHERE p.post_type = 'requirement' AND p.deleted_at IS NULL
             ORDER BY p.last_activity_at DESC, p.id DESC LIMIT $1",
            post_columns_prefixed()
        ))
        .bind(limit.clamp(1, 100) as i64)
        .fetch_all(self.pool())
        .await?;
        rows.into_iter().map(PostRecordRow::into_domain).collect()
    }

    async fn hidden_posts(&self, limit: u32) -> Result<Vec<PostRecord>> {
        let rows: Vec<PostRecordRow> = sqlx::query_as(&format!(
            "SELECT {}, {AUTHOR_JOIN_COLUMNS} FROM posts p
             JOIN chenghub_users u ON u.id = p.author_id
             WHERE p.hidden_at IS NOT NULL AND p.deleted_at IS NULL
             ORDER BY p.hidden_at DESC, p.id DESC LIMIT $1",
            post_columns_prefixed()
        ))
        .bind(limit.clamp(1, 100) as i64)
        .fetch_all(self.pool())
        .await?;
        rows.into_iter().map(PostRecordRow::into_domain).collect()
    }

    async fn hidden_comments(&self, limit: u32) -> Result<Vec<CommentRecord>> {
        let comment_cols: String = COMMENT_COLUMNS
            .split(", ")
            .map(|col| format!("c.{col}"))
            .collect::<Vec<_>>()
            .join(", ");
        let rows: Vec<CommentRecordRow> = sqlx::query_as(&format!(
            "SELECT {comment_cols}, u.username AS author_username,
                    u.display_name AS author_display_name, u.avatar_url AS author_avatar_url
             FROM comments c
             JOIN chenghub_users u ON u.id = c.author_id
             WHERE c.hidden_at IS NOT NULL AND c.deleted_at IS NULL
             ORDER BY c.hidden_at DESC, c.id DESC LIMIT $1"
        ))
        .bind(limit.clamp(1, 100) as i64)
        .fetch_all(self.pool())
        .await?;
        Ok(rows.into_iter().map(CommentRecordRow::into_domain).collect())
    }
}
