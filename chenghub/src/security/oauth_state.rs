//! OAuth state + PKCE handling.
//!
//! Pending login state lives in a one-shot store (Redis in production, an
//! in-process map when Redis is down — single-instance only) keyed by the
//! random `state` value. Consuming is take-once: replaying a callback with
//! the same state fails, which blocks CSRF and login injection.

use std::collections::HashMap;
use std::sync::Mutex;

use async_trait::async_trait;
use base64::Engine;
use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::domain::identity::UserId;
use crate::error::Result;
use crate::security::token::generate_token;

/// Pending state stored between `/auth/:provider/start` and the callback.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PendingOAuthState {
    pub provider: String,
    /// Where the browser goes after login (validated before redirecting).
    pub return_to: String,
    /// Set when an already-authenticated browser is linking an extra
    /// identity to the current user rather than logging in.
    pub link_user_id: Option<UserId>,
    /// PKCE code verifier when the provider supports it (GitHub does).
    pub pkce_verifier: Option<String>,
    pub created_at: DateTime<Utc>,
}

/// One-shot state store. `take` must atomically remove the entry.
#[async_trait]
pub trait OAuthStateStore: Send + Sync {
    async fn put(&self, state: &str, payload: &PendingOAuthState, ttl_secs: u64) -> Result<()>;
    async fn take(&self, state: &str) -> Result<Option<PendingOAuthState>>;
}

/// Generate the random `state` parameter.
pub fn generate_state() -> String {
    generate_token("st_")
}

/// PKCE pair per RFC 7636 (S256).
pub struct PkcePair {
    pub verifier: String,
    pub challenge: String,
}

pub fn generate_pkce() -> PkcePair {
    let verifier = generate_token("pk_");
    let digest = Sha256::digest(verifier.as_bytes());
    let challenge = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(digest);
    PkcePair { verifier, challenge }
}

/// In-process fallback store. Correct for a single instance; multi-instance
/// deployments must run Redis (documented in the deployment guide).
#[derive(Default)]
pub struct MemoryStateStore {
    entries: Mutex<HashMap<String, (PendingOAuthState, DateTime<Utc>)>>,
}

#[async_trait]
impl OAuthStateStore for MemoryStateStore {
    async fn put(&self, state: &str, payload: &PendingOAuthState, ttl_secs: u64) -> Result<()> {
        let mut entries = self.entries.lock().expect("state store lock");
        let now = Utc::now();
        // Opportunistic sweep keeps the map bounded without a background task.
        entries.retain(|_, (_, expires)| *expires > now);
        entries.insert(
            state.to_string(),
            (payload.clone(), now + Duration::seconds(ttl_secs as i64)),
        );
        Ok(())
    }

    async fn take(&self, state: &str) -> Result<Option<PendingOAuthState>> {
        let mut entries = self.entries.lock().expect("state store lock");
        match entries.remove(state) {
            Some((payload, expires)) if expires > Utc::now() => Ok(Some(payload)),
            _ => Ok(None),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn memory_store_is_one_shot() {
        let store = MemoryStateStore::default();
        let payload = PendingOAuthState {
            provider: "github".into(),
            return_to: "/".into(),
            link_user_id: None,
            pkce_verifier: None,
            created_at: Utc::now(),
        };
        store.put("s1", &payload, 60).await.unwrap();
        assert!(store.take("s1").await.unwrap().is_some());
        assert!(store.take("s1").await.unwrap().is_none());
    }

    #[test]
    fn pkce_challenge_matches_verifier() {
        let pair = generate_pkce();
        let digest = Sha256::digest(pair.verifier.as_bytes());
        let expect = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(digest);
        assert_eq!(pair.challenge, expect);
    }
}
