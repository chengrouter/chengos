//! Idempotency-Key acceleration for publish endpoints.
//!
//! Redis remembers `Idempotency-Key -> outcome` briefly so an immediate retry
//! returns the original response instead of a confusing conflict. This is an
//! accelerator only: the durable idempotency guarantees are the PostgreSQL
//! uniqueness constraints (release `(skill, version)`, outbox idempotency
//! key). Losing Redis loses the friendly replay, never correctness.

use serde::{Deserialize, Serialize};

use crate::storage::redis::RedisHandle;

/// Stored terminal outcome of an idempotent request.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoredResponse {
    pub status: u16,
    /// Serialized JSON response body.
    pub body: Vec<u8>,
    /// Fingerprint of the original request (route + digest of key inputs);
    /// a replay with a different fingerprint is a client bug -> conflict.
    pub fingerprint: String,
}

pub enum IdempotencyOutcome {
    /// First time (or Redis unavailable): proceed; DB constraints backstop.
    New,
    /// Another request with this key is still running.
    InFlight,
    /// A completed response exists for this key.
    Replay(StoredResponse),
}

pub struct IdempotencyStore {
    handle: RedisHandle,
}

const IN_FLIGHT_TTL_SECS: u64 = 120;

impl IdempotencyStore {
    pub fn new(handle: RedisHandle) -> Self {
        Self { handle }
    }

    fn key(scope: &str, key: &str) -> String {
        format!("sr:idem:{scope}:{key}")
    }

    /// Claim the key or report its current state.
    pub async fn begin(&self, scope: &str, key: &str) -> IdempotencyOutcome {
        let redis_key = Self::key(scope, key);
        let mut con = self.handle.connection();
        // Try to claim as in-flight.
        let claimed: Result<Option<String>, _> = redis::cmd("SET")
            .arg(&redis_key)
            .arg("~inflight~")
            .arg("NX")
            .arg("EX")
            .arg(IN_FLIGHT_TTL_SECS)
            .query_async(&mut con)
            .await;
        match claimed {
            Ok(Some(_)) => IdempotencyOutcome::New,
            Ok(None) => {
                let existing: Result<Option<Vec<u8>>, _> =
                    redis::cmd("GET").arg(&redis_key).query_async(&mut con).await;
                match existing {
                    Ok(Some(raw)) if raw != b"~inflight~" => {
                        match serde_json::from_slice::<StoredResponse>(&raw) {
                            Ok(stored) => IdempotencyOutcome::Replay(stored),
                            Err(_) => IdempotencyOutcome::New,
                        }
                    }
                    Ok(Some(_)) => IdempotencyOutcome::InFlight,
                    Ok(None) => IdempotencyOutcome::New,
                    Err(err) => {
                        self.handle.note_error("idempotency.get", &err);
                        IdempotencyOutcome::New
                    }
                }
            }
            Err(err) => {
                self.handle.note_error("idempotency.begin", &err);
                IdempotencyOutcome::New
            }
        }
    }

    /// Store the terminal outcome for replays.
    pub async fn complete(&self, scope: &str, key: &str, response: &StoredResponse, ttl_secs: u64) {
        let Ok(raw) = serde_json::to_vec(response) else { return };
        let mut con = self.handle.connection();
        let result: Result<(), _> = redis::cmd("SET")
            .arg(Self::key(scope, key))
            .arg(raw)
            .arg("EX")
            .arg(ttl_secs.max(1))
            .query_async(&mut con)
            .await;
        if let Err(err) = result {
            self.handle.note_error("idempotency.complete", &err);
        }
    }

    /// Release an in-flight claim after a failure so the client can retry.
    pub async fn release(&self, scope: &str, key: &str) {
        let mut con = self.handle.connection();
        // Only delete the in-flight marker, never a stored response.
        let script = redis::Script::new(
            r#"
if redis.call('GET', KEYS[1]) == '~inflight~' then
  return redis.call('DEL', KEYS[1])
end
return 0
"#,
        );
        if let Err(err) = script
            .key(Self::key(scope, key))
            .invoke_async::<()>(&mut con)
            .await
        {
            self.handle.note_error("idempotency.release", &err);
        }
    }
}
