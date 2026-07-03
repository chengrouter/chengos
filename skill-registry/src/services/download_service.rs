//! Artifact download resolution and delivery.
//!
//! Resolves `publisher/slug/version` to the release's immutable artifact,
//! enforces the download state policy (published always; yanked only because
//! the request pins an exact version; quarantined blocked entirely), records
//! a privacy-preserving download event, and picks the delivery mechanism:
//! an `X-Accel-Redirect` internal path for Nginx in production, or a direct
//! byte stream in development.
//!
//! Counting never blocks or fails a download. Client identity is collapsed
//! to an HMAC bucket (keyed, windowed) before it leaves this module, so raw
//! IPs are never stored or forwarded.

use std::sync::Arc;

use hmac::{Hmac, Mac};
use sha2::Sha256;

use crate::config::{CountersConfig, ServerConfig};
use crate::domain::artifact::Artifact;
use crate::domain::release::{Release, ReleaseStatus};
use crate::error::{RegistryError, Result};
use crate::ports::artifact_store::{ArtifactStore, ByteStream};
use crate::ports::counters::DownloadCounters;
use crate::ports::repositories::{ArtifactRepo, ReleaseRepo, ResolvedSkill};
use crate::services::catalog_service::CatalogService;
use crate::telemetry::metrics::SharedMetrics;

/// How the HTTP layer should deliver the bytes.
pub enum DownloadDelivery {
    /// Production: respond with `X-Accel-Redirect: <internal_path>` and let
    /// Nginx stream the file from the (internal-only) artifact location.
    Accel { internal_path: String },
    /// Development: stream the file through the registry process.
    Stream { body: ByteStream, size_bytes: u64 },
}

pub struct ResolvedDownload {
    pub resolved: ResolvedSkill,
    pub release: Release,
    pub artifact: Artifact,
    /// True when the release is yanked — served (pinned request) but the
    /// response advertises it via a warning header.
    pub yanked: bool,
    /// Suggested Content-Disposition filename.
    pub filename: String,
    pub delivery: DownloadDelivery,
}

pub struct DownloadService {
    catalog: Arc<CatalogService>,
    releases: Arc<dyn ReleaseRepo>,
    artifacts: Arc<dyn ArtifactRepo>,
    store: Arc<dyn ArtifactStore>,
    counters: Arc<dyn DownloadCounters>,
    counters_config: CountersConfig,
    server_config: ServerConfig,
    metrics: SharedMetrics,
}

impl DownloadService {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        catalog: Arc<CatalogService>,
        releases: Arc<dyn ReleaseRepo>,
        artifacts: Arc<dyn ArtifactRepo>,
        store: Arc<dyn ArtifactStore>,
        counters: Arc<dyn DownloadCounters>,
        counters_config: CountersConfig,
        server_config: ServerConfig,
        metrics: SharedMetrics,
    ) -> Self {
        Self {
            catalog,
            releases,
            artifacts,
            store,
            counters,
            counters_config,
            server_config,
            metrics,
        }
    }

    /// Resolve and authorize a download, count it, and prepare delivery.
    ///
    /// `client_key` is the caller's network identity as seen by the HTTP
    /// layer (peer/forwarded IP); it is HMAC-bucketed here and never stored.
    pub async fn resolve_download(
        &self,
        publisher: &str,
        slug: &str,
        version: &str,
        client_key: &str,
    ) -> Result<ResolvedDownload> {
        let resolved = self.catalog.resolve_public(publisher, slug).await?;
        let release = self
            .releases
            .get_by_version(resolved.skill.id, version)
            .await?
            .ok_or(RegistryError::NotFound("release"))?;

        match release.status {
            ReleaseStatus::Published | ReleaseStatus::Yanked => {}
            ReleaseStatus::Quarantined => {
                return Err(RegistryError::invalid_state(
                    "RELEASE_QUARANTINED",
                    "this release has been quarantined by moderation and cannot be downloaded",
                ));
            }
            // Pre-publication states are not public knowledge.
            _ => return Err(RegistryError::NotFound("release")),
        }

        let artifact_id = release
            .artifact_id
            .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("downloadable release without artifact")))?;
        let artifact = self
            .artifacts
            .get(artifact_id)
            .await?
            .ok_or_else(|| RegistryError::Internal(anyhow::anyhow!("artifact record missing")))?;

        // Count before delivery (best-effort; the accel path never reports
        // back). Dedup by (release, HMAC bucket) within the window.
        let bucket = self.client_bucket(client_key);
        if self.counters.record(release.id, &bucket).await {
            self.metrics.downloads_counted_total.inc();
        }

        let filename = format!(
            "{}-{}-{}.zip",
            resolved.publisher.handle, resolved.skill.slug, release.version
        );
        let delivery = if self.server_config.use_x_accel_redirect {
            DownloadDelivery::Accel {
                internal_path: format!(
                    "{}/{}",
                    self.server_config.x_accel_prefix.trim_end_matches('/'),
                    artifact.storage_key
                ),
            }
        } else {
            let metadata = self.store.metadata(&artifact.storage_key).await?;
            let body = self.store.open(&artifact.storage_key).await?;
            DownloadDelivery::Stream { body, size_bytes: metadata.size_bytes }
        };

        Ok(ResolvedDownload {
            yanked: release.status == ReleaseStatus::Yanked,
            resolved,
            release,
            artifact,
            filename,
            delivery,
        })
    }

    /// Collapse a client key into a keyed, windowed bucket: two downloads by
    /// the same client in one window count once; the mapping is not
    /// reversible without the HMAC key and rotates every window.
    fn client_bucket(&self, client_key: &str) -> String {
        let window = chrono::Utc::now().timestamp() / self.counters_config.window_secs.max(1) as i64;
        let mut mac = Hmac::<Sha256>::new_from_slice(self.counters_config.bucket_hmac_key.expose().as_bytes())
            .expect("HMAC accepts any key length");
        mac.update(client_key.as_bytes());
        mac.update(b"|");
        mac.update(window.to_string().as_bytes());
        let out = mac.finalize().into_bytes();
        hex::encode(&out[..16])
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::config::Secret;

    fn service_bucket(key: &str, window_secs: u64, client: &str) -> String {
        // Exercise the bucket math without a full service graph.
        let window = chrono::Utc::now().timestamp() / window_secs.max(1) as i64;
        let mut mac = Hmac::<Sha256>::new_from_slice(key.as_bytes()).unwrap();
        mac.update(client.as_bytes());
        mac.update(b"|");
        mac.update(window.to_string().as_bytes());
        hex::encode(&mac.finalize().into_bytes()[..16])
    }

    #[test]
    fn bucket_is_stable_within_window_and_key_dependent() {
        let a = service_bucket("key-a", 86400, "203.0.113.7");
        let b = service_bucket("key-a", 86400, "203.0.113.7");
        let c = service_bucket("key-b", 86400, "203.0.113.7");
        let d = service_bucket("key-a", 86400, "203.0.113.8");
        assert_eq!(a, b);
        assert_ne!(a, c);
        assert_ne!(a, d);
        // Not reversible to the input, and fixed-length hex.
        assert_eq!(a.len(), 32);
        assert!(!a.contains("203"));
    }

    #[test]
    fn secret_type_used_for_counter_key() {
        // Guard against accidentally logging the key: Secret redacts Debug.
        let config = CountersConfig {
            bucket_hmac_key: Secret::new("super-secret"),
            window_secs: 3600,
        };
        assert_eq!(format!("{:?}", config.bucket_hmac_key), "Secret(****)");
    }
}
