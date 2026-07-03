//! Degradable cache port.
//!
//! Every operation is best-effort: a cache failure must degrade to the
//! underlying source of truth, never break a request. Implementations count
//! failures in metrics but do not propagate them as request errors.

use std::time::Duration;

use async_trait::async_trait;

/// Namespaced cache dimensions used for active invalidation.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CacheScope {
    /// Search/list results (short TTL).
    Catalog,
    /// Skill detail by canonical identity.
    SkillDetail,
    /// Immutable release/manifest documents (long TTL).
    Release,
    /// Aggregated popularity/category data.
    Aggregate,
}

impl CacheScope {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Catalog => "catalog",
            Self::SkillDetail => "skill",
            Self::Release => "release",
            Self::Aggregate => "agg",
        }
    }
}

#[async_trait]
pub trait Cache: Send + Sync {
    /// Best-effort get. `None` on miss *or* cache failure.
    async fn get(&self, scope: CacheScope, key: &str) -> Option<Vec<u8>>;

    /// Best-effort set with TTL.
    async fn set(&self, scope: CacheScope, key: &str, value: &[u8], ttl: Duration);

    /// Invalidate one key.
    async fn invalidate(&self, scope: CacheScope, key: &str);

    /// Invalidate every key under a prefix within a scope (publisher/skill/
    /// release dimension invalidation after writes).
    async fn invalidate_prefix(&self, scope: CacheScope, prefix: &str);

    /// Try to acquire a short single-flight lock (cache-stampede control).
    /// Returns true when this caller holds the lock. Failure -> true so the
    /// caller proceeds to the source of truth.
    async fn try_single_flight(&self, key: &str, ttl: Duration) -> bool;
}

/// No-op cache used when Redis is disabled and in tests.
pub struct NoopCache;

#[async_trait]
impl Cache for NoopCache {
    async fn get(&self, _scope: CacheScope, _key: &str) -> Option<Vec<u8>> {
        None
    }
    async fn set(&self, _scope: CacheScope, _key: &str, _value: &[u8], _ttl: Duration) {}
    async fn invalidate(&self, _scope: CacheScope, _key: &str) {}
    async fn invalidate_prefix(&self, _scope: CacheScope, _prefix: &str) {}
    async fn try_single_flight(&self, _key: &str, _ttl: Duration) -> bool {
        true
    }
}
