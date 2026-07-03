//! Redis-backed [`Cache`] implementation.
//!
//! Keys are namespaced `sr:cache:{scope}:{key}`; callers already embed the
//! cache schema version in `key`, so a version bump orphans old entries and
//! TTLs reclaim them.

use std::time::Duration;

use async_trait::async_trait;
use redis::AsyncCommands;

use crate::ports::cache::{Cache, CacheScope};
use crate::storage::redis::{scan_keys, RedisHandle};

pub struct RedisCache {
    handle: RedisHandle,
}

impl RedisCache {
    pub fn new(handle: RedisHandle) -> Self {
        Self { handle }
    }

    fn key(scope: CacheScope, key: &str) -> String {
        format!("sr:cache:{}:{}", scope.as_str(), key)
    }
}

#[async_trait]
impl Cache for RedisCache {
    async fn get(&self, scope: CacheScope, key: &str) -> Option<Vec<u8>> {
        let mut con = self.handle.connection();
        match con.get::<_, Option<Vec<u8>>>(Self::key(scope, key)).await {
            Ok(value) => value,
            Err(err) => {
                self.handle.note_error("cache.get", &err);
                None
            }
        }
    }

    async fn set(&self, scope: CacheScope, key: &str, value: &[u8], ttl: Duration) {
        let mut con = self.handle.connection();
        let result: Result<(), _> = redis::cmd("SET")
            .arg(Self::key(scope, key))
            .arg(value)
            .arg("PX")
            .arg(ttl.as_millis().max(1) as u64)
            .query_async(&mut con)
            .await;
        if let Err(err) = result {
            self.handle.note_error("cache.set", &err);
        }
    }

    async fn invalidate(&self, scope: CacheScope, key: &str) {
        let mut con = self.handle.connection();
        if let Err(err) = con.del::<_, ()>(Self::key(scope, key)).await {
            self.handle.note_error("cache.invalidate", &err);
        }
    }

    async fn invalidate_prefix(&self, scope: CacheScope, prefix: &str) {
        // SCAN (never KEYS) so invalidation cannot stall Redis.
        let pattern = format!("{}*", Self::key(scope, prefix));
        let keys = match scan_keys(&self.handle, &pattern).await {
            Ok(keys) => keys,
            Err(err) => {
                self.handle.note_error("cache.invalidate_prefix.scan", &err);
                return;
            }
        };
        let mut con = self.handle.connection();
        for chunk in keys.chunks(200) {
            if let Err(err) = con.del::<_, ()>(chunk).await {
                self.handle.note_error("cache.invalidate_prefix.del", &err);
            }
        }
    }

    async fn try_single_flight(&self, key: &str, ttl: Duration) -> bool {
        let mut con = self.handle.connection();
        let result: Result<Option<String>, _> = redis::cmd("SET")
            .arg(format!("sr:flight:{key}"))
            .arg("1")
            .arg("NX")
            .arg("PX")
            .arg(ttl.as_millis().max(1) as u64)
            .query_async(&mut con)
            .await;
        match result {
            Ok(reply) => reply.is_some(),
            Err(err) => {
                self.handle.note_error("cache.single_flight", &err);
                // Fail open: proceed to the source of truth.
                true
            }
        }
    }
}
