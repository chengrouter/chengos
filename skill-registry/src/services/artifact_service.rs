//! Artifact ingestion orchestration.
//!
//! Upload flow: spool the request stream to a private work file (computing
//! SHA-256 while streaming and enforcing the archive size limit), verify the
//! declared digest, run the safe archive reader + Package v1 policy in a
//! blocking task, then move the bytes into content-addressed storage. The
//! work file is removed on every path. This service never touches release
//! state — that belongs to `publish_service`.
//!
//! If a database commit fails *after* the file is safely stored, the stored
//! object simply remains unreferenced; the cleanup job removes it later.

use std::path::{Path, PathBuf};
use std::sync::Arc;

use futures::StreamExt;
use sha2::{Digest as Sha2Digest, Sha256};
use tokio::io::AsyncWriteExt;
use tokio_util::io::ReaderStream;
use uuid::Uuid;

use crate::config::ArtifactConfig;
use crate::domain::artifact::{Digest, SafetySummary, PACKAGE_V1_MEDIA_TYPE};
use crate::error::{codes, RegistryError, Result};
use crate::ports::artifact_store::{ArtifactStore, ByteStream, StoredArtifact};
use crate::security::content_scan;
use crate::security::package_policy::{self, ExpectedIdentity, ValidatedPackage};
use crate::storage::filesystem::safe_archive::{self, ArchiveEntry, ArchiveLimits};
use crate::telemetry::metrics::SharedMetrics;

pub struct ArtifactService {
    store: Arc<dyn ArtifactStore>,
    spool_dir: PathBuf,
    config: ArtifactConfig,
    metrics: SharedMetrics,
}

/// Everything the publish flow needs after a successful upload.
pub struct UploadOutcome {
    pub stored: StoredArtifact,
    pub package: ValidatedPackage,
    pub safety: SafetySummary,
    pub media_type: &'static str,
}

impl ArtifactService {
    pub async fn new(
        store: Arc<dyn ArtifactStore>,
        spool_dir: PathBuf,
        config: ArtifactConfig,
        metrics: SharedMetrics,
    ) -> Result<Self> {
        tokio::fs::create_dir_all(&spool_dir)
            .await
            .map_err(|e| RegistryError::Internal(anyhow::anyhow!("create spool dir: {e}")))?;
        Ok(Self { store, spool_dir, config, metrics })
    }

    pub fn limits(&self) -> ArchiveLimits {
        ArchiveLimits::from_config(&self.config)
    }

    pub fn max_archive_bytes(&self) -> u64 {
        self.config.max_archive_bytes
    }

    /// Ingest an upload stream: spool, digest-check, validate, persist.
    pub async fn ingest_upload(
        &self,
        body: ByteStream,
        declared_digest: Option<&Digest>,
        expected_slug: &str,
        expected_version: &str,
    ) -> Result<UploadOutcome> {
        self.check_spool_quota().await?;
        self.metrics.active_transfers.inc();
        let result = self
            .ingest_inner(body, declared_digest, expected_slug, expected_version)
            .await;
        self.metrics.active_transfers.dec();
        result
    }

    async fn ingest_inner(
        &self,
        body: ByteStream,
        declared_digest: Option<&Digest>,
        expected_slug: &str,
        expected_version: &str,
    ) -> Result<UploadOutcome> {
        let spool = SpoolFile::create(&self.spool_dir).await?;

        let (digest, size) = spool
            .fill(body, self.config.max_archive_bytes, &self.metrics)
            .await?;
        if let Some(declared) = declared_digest {
            if declared != &digest {
                return Err(RegistryError::Validation {
                    code: codes::PKG_DIGEST_MISMATCH,
                    message: format!("declared digest {declared} does not match uploaded bytes {digest}"),
                });
            }
        }

        let (package, safety) = self
            .validate_spool(spool.path().to_path_buf(), expected_slug.to_string(), expected_version.to_string())
            .await?;

        // Persist into CAS by re-streaming the validated spool file.
        let file = tokio::fs::File::open(spool.path())
            .await
            .map_err(|e| RegistryError::Internal(anyhow::anyhow!("reopen spool: {e}")))?;
        let stream: ByteStream = Box::pin(ReaderStream::with_capacity(file, 64 * 1024));
        let stored = self
            .store
            .put_stream(stream, self.config.max_archive_bytes, Some(&digest))
            .await?;
        debug_assert_eq!(stored.size_bytes, size);

        Ok(UploadOutcome {
            stored,
            package,
            safety,
            media_type: PACKAGE_V1_MEDIA_TYPE,
        })
    }

    /// Re-read a stored artifact and run full validation + scans (scan job).
    pub async fn load_stored_package(
        &self,
        storage_key: &str,
        expected_digest: &Digest,
        expected_slug: &str,
        expected_version: &str,
    ) -> Result<(ValidatedPackage, SafetySummary, Vec<ArchiveEntry>)> {
        let spool = SpoolFile::create(&self.spool_dir).await?;
        let body = self.store.open(storage_key).await?;
        let (digest, _) = spool.fill(body, self.config.max_archive_bytes, &self.metrics).await?;
        if &digest != expected_digest {
            return Err(RegistryError::Validation {
                code: codes::PKG_DIGEST_MISMATCH,
                message: "stored artifact digest mismatch (storage corruption?)".into(),
            });
        }
        let limits = self.limits();
        let path = spool.path().to_path_buf();
        let slug = expected_slug.to_string();
        let version = expected_version.to_string();
        let (package, safety, entries) = tokio::task::spawn_blocking(move || {
            let entries = safe_archive::read_archive(&path, &limits)
                .map_err(|errors| RegistryError::PackageInvalid { errors })?;
            let package = package_policy::validate_package(
                &entries,
                ExpectedIdentity { slug: Some(&slug), version: Some(&version) },
            )
            .map_err(|errors| RegistryError::PackageInvalid { errors })?;
            let safety = compute_safety(&package, &entries);
            Ok::<_, RegistryError>((package, safety, entries))
        })
        .await
        .map_err(|e| RegistryError::Internal(anyhow::anyhow!("validation task panicked: {e}")))??;
        Ok((package, safety, entries))
    }

    async fn validate_spool(
        &self,
        path: PathBuf,
        expected_slug: String,
        expected_version: String,
    ) -> Result<(ValidatedPackage, SafetySummary)> {
        let limits = self.limits();
        tokio::task::spawn_blocking(move || {
            let entries = safe_archive::read_archive(&path, &limits)
                .map_err(|errors| RegistryError::PackageInvalid { errors })?;
            let package = package_policy::validate_package(
                &entries,
                ExpectedIdentity {
                    slug: Some(&expected_slug),
                    version: Some(&expected_version),
                },
            )
            .map_err(|errors| RegistryError::PackageInvalid { errors })?;
            let safety = compute_safety(&package, &entries);
            Ok::<_, RegistryError>((package, safety))
        })
        .await
        .map_err(|e| RegistryError::Internal(anyhow::anyhow!("validation task panicked: {e}")))?
    }

    /// Reject uploads when in-flight spool usage exceeds the quota
    /// (backpressure, and protection against disk exhaustion).
    async fn check_spool_quota(&self) -> Result<()> {
        let mut used: u64 = 0;
        let mut dir = match tokio::fs::read_dir(&self.spool_dir).await {
            Ok(dir) => dir,
            Err(_) => return Ok(()),
        };
        while let Ok(Some(entry)) = dir.next_entry().await {
            if let Ok(meta) = entry.metadata().await {
                used += meta.len();
            }
        }
        if used > self.config.work_dir_quota_bytes {
            return Err(RegistryError::Unavailable(
                "upload capacity temporarily exhausted; retry later".into(),
            ));
        }
        Ok(())
    }
}

/// Aggregate structural + content safety facts (secret findings are counted
/// by the scan job, which owns finding persistence).
pub fn compute_safety(package: &ValidatedPackage, entries: &[ArchiveEntry]) -> SafetySummary {
    let script_bodies: Vec<(String, String)> = entries
        .iter()
        .filter(|e| e.path.starts_with("scripts/"))
        .filter_map(|e| {
            std::str::from_utf8(&e.data)
                .ok()
                .map(|s| (e.path.clone(), s.to_string()))
        })
        .collect();
    content_scan::scan_package(package, &script_bodies).safety
}

/// A self-deleting spool file.
struct SpoolFile {
    path: PathBuf,
}

impl SpoolFile {
    async fn create(dir: &Path) -> Result<Self> {
        let path = dir.join(format!("{}.spool", Uuid::new_v4()));
        Ok(Self { path })
    }

    fn path(&self) -> &Path {
        &self.path
    }

    /// Stream `body` into the file, hashing and size-limiting.
    async fn fill(&self, mut body: ByteStream, max_bytes: u64, metrics: &SharedMetrics) -> Result<(Digest, u64)> {
        let mut options = tokio::fs::OpenOptions::new();
        options.write(true).create_new(true);
        #[cfg(unix)]
        options.mode(0o600);
        let mut file = options
            .open(&self.path)
            .await
            .map_err(|e| RegistryError::Internal(anyhow::anyhow!("open spool file: {e}")))?;

        let mut hasher = Sha256::new();
        let mut written: u64 = 0;
        while let Some(chunk) = body.next().await {
            let chunk = chunk.map_err(|e| RegistryError::Internal(anyhow::anyhow!("read stream: {e}")))?;
            written += chunk.len() as u64;
            if written > max_bytes {
                return Err(RegistryError::PayloadTooLarge { limit_bytes: max_bytes });
            }
            metrics.upload_bytes_total.inc_by(chunk.len() as u64);
            hasher.update(&chunk);
            file.write_all(&chunk)
                .await
                .map_err(|e| RegistryError::Internal(anyhow::anyhow!("write spool: {e}")))?;
        }
        if written == 0 {
            return Err(RegistryError::validation("EMPTY_ARTIFACT", "empty upload body"));
        }
        file.flush()
            .await
            .map_err(|e| RegistryError::Internal(anyhow::anyhow!("flush spool: {e}")))?;
        let hash: [u8; 32] = hasher.finalize().into();
        Ok((Digest::from_bytes(&hash), written))
    }
}

impl Drop for SpoolFile {
    fn drop(&mut self) {
        // Best-effort synchronous cleanup; the cleanup job catches leftovers.
        std::fs::remove_file(&self.path).ok();
    }
}
