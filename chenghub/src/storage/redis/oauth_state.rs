//! Redis-backed one-shot OAuth state store.
//!
//! `take` uses GETDEL for atomic consume-once semantics, which is what
//! blocks OAuth callback replay across instances.

use async_trait::async_trait;

use crate::error::{HubError, Result};
use crate::security::oauth_state::{OAuthStateStore, PendingOAuthState};
use crate::storage::redis::RedisHandle;

pub struct RedisStateStore {
    handle: RedisHandle,
}

impl RedisStateStore {
    pub fn new(handle: RedisHandle) -> Self {
        Self { handle }
    }

    fn key(state: &str) -> String {
        format!("ch:oauth:{state}")
    }
}

#[async_trait]
impl OAuthStateStore for RedisStateStore {
    async fn put(&self, state: &str, payload: &PendingOAuthState, ttl_secs: u64) -> Result<()> {
        let json = serde_json::to_string(payload)
            .map_err(|e| HubError::Internal(anyhow::anyhow!("state serialize: {e}")))?;
        let mut con = self.handle.connection();
        redis::cmd("SET")
            .arg(Self::key(state))
            .arg(json)
            .arg("EX")
            .arg(ttl_secs.max(1))
            .query_async::<()>(&mut con)
            .await
            .map_err(|err| {
                self.handle.note_error("oauth_state.put", &err);
                // Losing state breaks the login flow; surface it rather than
                // silently issuing a state the callback can never validate.
                HubError::Unavailable("login state store unavailable".into())
            })?;
        Ok(())
    }

    async fn take(&self, state: &str) -> Result<Option<PendingOAuthState>> {
        let mut con = self.handle.connection();
        let raw: Option<String> = redis::cmd("GETDEL")
            .arg(Self::key(state))
            .query_async(&mut con)
            .await
            .map_err(|err| {
                self.handle.note_error("oauth_state.take", &err);
                HubError::Unavailable("login state store unavailable".into())
            })?;
        match raw {
            None => Ok(None),
            Some(json) => Ok(serde_json::from_str(&json).ok()),
        }
    }
}
