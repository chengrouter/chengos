//! Stable cursor pagination.
//!
//! Public list APIs paginate with an opaque cursor encoding `(sort_key, id)`
//! of the last returned row — never SQL OFFSET, which is unstable under
//! concurrent writes and slow at depth.

use base64::Engine;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub const DEFAULT_PAGE_SIZE: u32 = 20;
pub const MAX_PAGE_SIZE: u32 = 100;

/// Deterministic sort orders offered by list endpoints. Every order has a
/// unique total ordering because `id` breaks ties.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SortOrder {
    /// Most recently updated skill first (default).
    RecentlyUpdated,
    /// Newest skill first.
    Newest,
    /// Most downloads (all-time aggregate) first.
    Downloads,
    /// Alphabetical by slug.
    Name,
    /// Search relevance (only valid together with a query).
    Relevance,
}

impl SortOrder {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::RecentlyUpdated => "recently_updated",
            Self::Newest => "newest",
            Self::Downloads => "downloads",
            Self::Name => "name",
            Self::Relevance => "relevance",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "recently_updated" => Self::RecentlyUpdated,
            "newest" => Self::Newest,
            "downloads" => Self::Downloads,
            "name" => Self::Name,
            "relevance" => Self::Relevance,
            _ => return None,
        })
    }
}

/// Opaque cursor: base64url of `{"o": <order>, "k": <sort key>, "id": <uuid>}`.
/// The order is embedded so a cursor cannot be replayed against a different
/// sort and silently return garbage.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Cursor {
    pub o: String,
    /// Last row's sort key rendered as a string (timestamp micros, count, or
    /// slug depending on the order).
    pub k: String,
    pub id: Uuid,
}

impl Cursor {
    pub fn encode(&self) -> String {
        let json = serde_json::to_vec(self).expect("cursor serialize");
        base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(json)
    }

    pub fn decode(raw: &str, expected_order: SortOrder) -> Result<Self, String> {
        let bytes = base64::engine::general_purpose::URL_SAFE_NO_PAD
            .decode(raw)
            .map_err(|_| "invalid cursor encoding".to_string())?;
        let cursor: Cursor =
            serde_json::from_slice(&bytes).map_err(|_| "invalid cursor payload".to_string())?;
        if cursor.o != expected_order.as_str() {
            return Err("cursor does not match the requested sort order".into());
        }
        Ok(cursor)
    }
}

#[derive(Debug, Clone)]
pub struct PageRequest {
    pub limit: u32,
    pub cursor: Option<Cursor>,
}

impl PageRequest {
    pub fn new(limit: Option<u32>, cursor: Option<Cursor>) -> Self {
        let limit = limit.unwrap_or(DEFAULT_PAGE_SIZE).clamp(1, MAX_PAGE_SIZE);
        Self { limit, cursor }
    }
}

#[derive(Debug, Clone)]
pub struct Page<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<String>,
}

impl<T> Page<T> {
    pub fn map<U>(self, f: impl FnMut(T) -> U) -> Page<U> {
        Page {
            items: self.items.into_iter().map(f).collect(),
            next_cursor: self.next_cursor,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cursor_roundtrip() {
        let c = Cursor {
            o: SortOrder::Downloads.as_str().into(),
            k: "12345".into(),
            id: Uuid::new_v4(),
        };
        let encoded = c.encode();
        let decoded = Cursor::decode(&encoded, SortOrder::Downloads).unwrap();
        assert_eq!(c, decoded);
        assert!(Cursor::decode(&encoded, SortOrder::Name).is_err());
        assert!(Cursor::decode("!!!", SortOrder::Downloads).is_err());
    }
}
