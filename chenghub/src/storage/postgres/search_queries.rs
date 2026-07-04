//! Search SQL, kept separate from core repository code.
//!
//! V1 strategy (Chinese-friendly, no external search engine):
//! * `simple`-config full-text search for space-delimited terms (English);
//! * trigram similarity + ILIKE substring fallback for CJK text, where
//!   `to_tsvector('simple', ...)` produces one giant token per run of Han
//!   characters and FTS alone would miss;
//! * similar-title lookup via `pg_trgm` for anti-duplication hints.
//!
//! The `SearchRepo` port keeps this swappable for Meilisearch/Tantivy later.

use async_trait::async_trait;
use uuid::Uuid;

use crate::domain::pagination::{Cursor, Page, PageRequest};
use crate::domain::post::PostId;
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::{PostRecord, SearchRepo, SimilarPost};

use super::models::{post_columns_prefixed, PostRecordRow, AUTHOR_JOIN_COLUMNS};
use super::PgRepos;

/// Escape LIKE wildcards in user input for the ILIKE fallback.
fn escape_like(input: &str) -> String {
    input.replace('\\', "\\\\").replace('%', "\\%").replace('_', "\\_")
}

#[async_trait]
impl SearchRepo for PgRepos {
    async fn search(&self, query: &str, page: PageRequest) -> Result<Page<PostRecord>> {
        let (k_score, k_id): (Option<f64>, Option<Uuid>) = match &page.cursor {
            None => (None, None),
            Some(c) => {
                if c.o != "search" {
                    return Err(HubError::validation(codes::INVALID_CURSOR, "invalid cursor"));
                }
                (Some(c.k.parse().map_err(|_| {
                    HubError::validation(codes::INVALID_CURSOR, "invalid cursor key")
                })?), Some(c.id))
            }
        };

        let pattern = format!("%{}%", escape_like(query));
        // Score: FTS rank (weighted title/body) + title trigram similarity +
        // a substring bonus. All three are cheap on the existing indexes;
        // the WHERE clause keeps the candidate set index-assisted.
        let sql = format!(
            "SELECT * FROM (
                SELECT {}, {AUTHOR_JOIN_COLUMNS},
                       (ts_rank(p.search_tsv, plainto_tsquery('simple', $1))
                        + similarity(p.title, $1)
                        + CASE WHEN p.title ILIKE $2 THEN 0.5 ELSE 0 END)::float8 AS score
                FROM posts p
                JOIN chenghub_users u ON u.id = p.author_id
                WHERE p.deleted_at IS NULL AND p.hidden_at IS NULL
                  AND (p.search_tsv @@ plainto_tsquery('simple', $1)
                       OR p.title % $1
                       OR p.title ILIKE $2
                       OR p.body_md ILIKE $2)
             ) ranked
             WHERE ($3::float8 IS NULL OR (score, id) < ($3, $4::uuid))
             ORDER BY score DESC, id DESC
             LIMIT $5",
            post_columns_prefixed()
        );

        let rows: Vec<(PostRecordRow, f64)> = sqlx::query_as::<_, PostRecordRowWithScore>(&sql)
            .bind(query)
            .bind(&pattern)
            .bind(k_score)
            .bind(k_id)
            .bind(page.limit as i64 + 1)
            .fetch_all(self.pool())
            .await?
            .into_iter()
            .map(|row| (row.record, row.score))
            .collect();

        let mut scored: Vec<(PostRecord, f64)> = rows
            .into_iter()
            .map(|(row, score)| row.into_domain().map(|r| (r, score)))
            .collect::<Result<_>>()?;
        let next_cursor = if scored.len() > page.limit as usize {
            scored.truncate(page.limit as usize);
            scored.last().map(|(record, score)| {
                Cursor { o: "search".into(), k: format!("{score:.9}"), id: record.post.id }.encode()
            })
        } else {
            None
        };
        Ok(Page {
            items: scored.into_iter().map(|(record, _)| record).collect(),
            next_cursor,
        })
    }

    async fn similar_titles(&self, title: &str, limit: u32) -> Result<Vec<SimilarPost>> {
        let pattern = format!("%{}%", escape_like(title));
        let rows: Vec<(Uuid, String, String, Option<String>, i32, f32)> = sqlx::query_as(
            "SELECT id, title, post_type, status, support_count,
                    GREATEST(similarity(title, $1),
                             CASE WHEN title ILIKE $2 THEN 0.6::float4 ELSE 0 END) AS sim
             FROM posts
             WHERE deleted_at IS NULL AND hidden_at IS NULL
               AND (title % $1 OR title ILIKE $2)
             ORDER BY sim DESC, support_count DESC
             LIMIT $3",
        )
        .bind(title)
        .bind(&pattern)
        .bind(limit.clamp(1, 20) as i64)
        .fetch_all(self.pool())
        .await?;

        Ok(rows
            .into_iter()
            .map(|(id, title, post_type, status, support_count, similarity)| SimilarPost {
                id: id as PostId,
                title,
                post_type,
                status,
                support_count,
                similarity,
            })
            .collect())
    }
}

/// Post record row plus the computed search score.
#[derive(sqlx::FromRow)]
struct PostRecordRowWithScore {
    #[sqlx(flatten)]
    record: PostRecordRow,
    score: f64,
}
