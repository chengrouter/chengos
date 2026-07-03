//! Redis fixed-window rate limiter.
//!
//! One INCR-with-expiry per hit (atomic via a tiny Lua script). Fails open:
//! when Redis is unreachable, requests are allowed and the degradation is
//! visible in `registry_redis_errors_total`.

use async_trait::async_trait;
use chrono::Utc;
use redis::Script;

use crate::ports::rate_limit::{RateDecision, RateLimiter};
use crate::storage::redis::RedisHandle;

/// INCR the window counter and set its expiry on first hit, atomically.
const WINDOW_SCRIPT: &str = r#"
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count
"#;

pub struct RedisRateLimiter {
    handle: RedisHandle,
    script: Script,
}

impl RedisRateLimiter {
    pub fn new(handle: RedisHandle) -> Self {
        Self { handle, script: Script::new(WINDOW_SCRIPT) }
    }
}

#[async_trait]
impl RateLimiter for RedisRateLimiter {
    async fn check(&self, bucket: &str, limit: u32, window_secs: u64) -> RateDecision {
        if limit == 0 {
            // Zero-limit config means "disabled", not "block everything".
            return RateDecision::ALLOW;
        }
        let window_secs = window_secs.max(1);
        let now = Utc::now().timestamp();
        let window_index = now / window_secs as i64;
        let key = format!("sr:rl:{bucket}:{window_index}");
        let mut con = self.handle.connection();
        let count: i64 = match self
            .script
            .key(&key)
            .arg(window_secs)
            .invoke_async(&mut con)
            .await
        {
            Ok(count) => count,
            Err(err) => {
                self.handle.note_error("rate_limit.check", &err);
                return RateDecision::ALLOW;
            }
        };
        if count <= limit as i64 {
            RateDecision::ALLOW
        } else {
            let window_end = (window_index + 1) * window_secs as i64;
            RateDecision {
                allowed: false,
                retry_after_secs: (window_end - now).max(1) as u64,
            }
        }
    }
}
