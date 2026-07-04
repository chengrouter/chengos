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

/// Opaque cursor: base64url of `{"o": <order>, "k": <sort key>, "id": <uuid>}`.
/// The order is embedded so a cursor cannot be replayed against a different
/// sort and silently return garbage.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Cursor {
    pub o: String,
    /// Last row's sort key rendered as a string (timestamp micros or count
    /// composite depending on the order).
    pub k: String,
    pub id: Uuid,
}

impl Cursor {
    pub fn encode(&self) -> String {
        let json = serde_json::to_vec(self).expect("cursor serialize");
        base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(json)
    }

    pub fn decode(raw: &str, expected_order: &str) -> Result<Self, String> {
        let bytes = base64::engine::general_purpose::URL_SAFE_NO_PAD
            .decode(raw)
            .map_err(|_| "invalid cursor encoding".to_string())?;
        let cursor: Cursor =
            serde_json::from_slice(&bytes).map_err(|_| "invalid cursor payload".to_string())?;
        if cursor.o != expected_order {
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
        let c = Cursor { o: "hot".into(), k: "42:1234".into(), id: Uuid::new_v4() };
        let encoded = c.encode();
        let decoded = Cursor::decode(&encoded, "hot").unwrap();
        assert_eq!(c, decoded);
        assert!(Cursor::decode(&encoded, "newest").is_err());
        assert!(Cursor::decode("!!!", "hot").is_err());
    }
}
