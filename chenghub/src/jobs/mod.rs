//! Background maintenance: periodic cleanup of expired sessions, tokens,
//! device codes (OAuth states expire in their store's TTL).

use std::sync::Arc;
use std::time::Duration;

use tokio_util::sync::CancellationToken;

use crate::ports::identity_repository::IdentityCleanup;

pub async fn cleanup_loop(
    cleanup: Arc<dyn IdentityCleanup>,
    interval_secs: u64,
    shutdown: CancellationToken,
) {
    let interval = Duration::from_secs(interval_secs.max(30));
    loop {
        tokio::select! {
            _ = shutdown.cancelled() => break,
            _ = tokio::time::sleep(interval) => {}
        }
        match cleanup.cleanup_expired().await {
            Ok(0) => {}
            Ok(removed) => tracing::debug!(removed, "cleanup removed expired identity rows"),
            Err(err) => tracing::warn!(error = %err, "cleanup pass failed"),
        }
    }
}
