//! Search: full-text + trigram/ILIKE fallback, and similar-title
//! anti-duplication hints. Only publicly visible content is searchable.

use std::sync::Arc;

use crate::domain::pagination::{Page, PageRequest};
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::{PostRecord, SearchRepo, SimilarPost};

const MAX_QUERY_CHARS: usize = 200;

pub struct SearchService {
    search: Arc<dyn SearchRepo>,
}

impl SearchService {
    pub fn new(search: Arc<dyn SearchRepo>) -> Self {
        Self { search }
    }

    fn normalize_query(query: &str) -> Result<String> {
        let query = query.trim();
        if query.is_empty() {
            return Err(HubError::validation(codes::INVALID_PARAM, "query is required"));
        }
        Ok(query.chars().take(MAX_QUERY_CHARS).collect())
    }

    pub async fn search(&self, query: &str, page: PageRequest) -> Result<Page<PostRecord>> {
        let query = Self::normalize_query(query)?;
        self.search.search(&query, page).await
    }

    pub async fn similar_titles(&self, title: &str, limit: Option<u32>) -> Result<Vec<SimilarPost>> {
        let title = Self::normalize_query(title)?;
        self.search.similar_titles(&title, limit.unwrap_or(5)).await
    }
}
