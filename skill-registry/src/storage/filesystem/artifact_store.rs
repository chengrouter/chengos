//! Content-addressed local filesystem artifact store.
//!
//! Layout: `<root>/sha256/ab/cd/<full digest>` with uploads staged as
//! `.part` files under `<root>/<work_dir>/`. Writes stream through SHA-256,
//! fsync, then atomically rename into place. Storage keys are validated
//! strictly so no user input can influence a path.

use std::path::{Path, PathBuf};

use async_trait::async_trait;
use futures::StreamExt;
use sha2::{Digest as _, Sha256};
use tokio::fs;
use tokio::io::AsyncWriteExt;
use tokio_util::io::ReaderStream;
use uuid::Uuid;

use crate::domain::artifact::Digest;
use crate::error::{RegistryError, Result};
use crate::ports::artifact_store::{ArtifactMetadata, ArtifactStore, ByteStream, StoredArtifact};

pub struct FilesystemArtifactStore {
    root: PathBuf,
    work_dir: PathBuf,
    file_mode: u32,
}

impl FilesystemArtifactStore {
    /// Creates the root and work directories with restrictive permissions.
    pub async fn new(root: &Path, work_dir_name: &str, file_mode: u32) -> Result<Self> {
        let root = normalize_root(root)?;
        let work_dir = root.join(work_dir_name);
        fs::create_dir_all(&work_dir)
            .await
            .map_err(|e| RegistryError::Internal(anyhow::anyhow!("create artifact dirs: {e}")))?;
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            for dir in [&root, &work_dir] {
                let perms = std::fs::Permissions::from_mode(0o750);
                std::fs::set_permissions(dir, perms).ok();
            }
        }
        Ok(Self { root, work_dir, file_mode })
    }

    /// Root-contained absolute path for a validated storage key.
    fn resolve(&self, storage_key: &str) -> Result<PathBuf> {
        validate_storage_key(storage_key)?;
        let path = self.root.join(storage_key);
        // Defense in depth: the strict key grammar already prevents
        // traversal, but verify containment anyway.
        if !path.starts_with(&self.root) {
            return Err(RegistryError::Internal(anyhow::anyhow!("storage key escapes root")));
        }
        Ok(path)
    }

    pub fn work_dir(&self) -> &Path {
        &self.work_dir
    }

    /// Filesystem path for Nginx X-Accel mapping (`<x_accel_prefix>/<key>`).
    pub fn accel_location(prefix: &str, storage_key: &str) -> String {
        format!("{}/{}", prefix.trim_end_matches('/'), storage_key)
    }
}

fn normalize_root(root: &Path) -> Result<PathBuf> {
    std::fs::create_dir_all(root)
        .map_err(|e| RegistryError::Internal(anyhow::anyhow!("create artifact root {root:?}: {e}")))?;
    root.canonicalize()
        .map_err(|e| RegistryError::Internal(anyhow::anyhow!("canonicalize artifact root: {e}")))
}

/// Strict grammar: `sha256/<2 hex>/<2 hex>/<64 hex>` and internally consistent.
fn validate_storage_key(key: &str) -> Result<()> {
    let parts: Vec<&str> = key.split('/').collect();
    let valid = parts.len() == 4
        && parts[0] == "sha256"
        && parts[1].len() == 2
        && parts[2].len() == 2
        && parts[3].len() == 64
        && parts[1..=3].iter().all(|p| p.bytes().all(|b| b.is_ascii_hexdigit() && !b.is_ascii_uppercase()))
        && parts[3].starts_with(parts[1])
        && parts[3][2..].starts_with(parts[2]);
    if valid {
        Ok(())
    } else {
        Err(RegistryError::validation("INVALID_STORAGE_KEY", "malformed storage key"))
    }
}

fn map_io(err: std::io::Error, what: &str) -> RegistryError {
    if err.raw_os_error() == Some(28) {
        // ENOSPC — surface as the stable STORAGE_FULL code for operators.
        RegistryError::StorageFull
    } else {
        RegistryError::Internal(anyhow::anyhow!("{what}: {err}"))
    }
}

#[async_trait]
impl ArtifactStore for FilesystemArtifactStore {
    async fn put_stream(
        &self,
        mut body: ByteStream,
        max_bytes: u64,
        expected_digest: Option<&Digest>,
    ) -> Result<StoredArtifact> {
        let part_path = self.work_dir.join(format!("{}.part", Uuid::new_v4()));

        // create_new prevents clobbering a concurrent writer's file.
        let mut open_options = fs::OpenOptions::new();
        open_options.write(true).create_new(true);
        #[cfg(unix)]
        open_options.mode(self.file_mode);
        let mut file = open_options
            .open(&part_path)
            .await
            .map_err(|e| map_io(e, "open part file"))?;

        let write_result: Result<(Digest, u64)> = async {
            let mut hasher = Sha256::new();
            let mut written: u64 = 0;
            while let Some(chunk) = body.next().await {
                let chunk = chunk.map_err(|e| map_io(e, "read upload stream"))?;
                written += chunk.len() as u64;
                if written > max_bytes {
                    return Err(RegistryError::PayloadTooLarge { limit_bytes: max_bytes });
                }
                hasher.update(&chunk);
                file.write_all(&chunk).await.map_err(|e| map_io(e, "write part file"))?;
            }
            if written == 0 {
                return Err(RegistryError::validation("EMPTY_ARTIFACT", "empty upload body"));
            }
            file.flush().await.map_err(|e| map_io(e, "flush part file"))?;
            file.sync_all().await.map_err(|e| map_io(e, "fsync part file"))?;
            let hash: [u8; 32] = hasher.finalize().into();
            Ok((Digest::from_bytes(&hash), written))
        }
        .await;

        let (digest, size_bytes) = match write_result {
            Ok(ok) => ok,
            Err(err) => {
                drop(file);
                fs::remove_file(&part_path).await.ok();
                return Err(err);
            }
        };
        drop(file);

        if let Some(expected) = expected_digest {
            if expected != &digest {
                fs::remove_file(&part_path).await.ok();
                return Err(RegistryError::Validation {
                    code: crate::error::codes::PKG_DIGEST_MISMATCH,
                    message: format!("expected digest {expected}, got {digest}"),
                });
            }
        }

        let storage_key = digest.storage_key();
        let final_path = self.resolve(&storage_key)?;
        if let Some(parent) = final_path.parent() {
            fs::create_dir_all(parent).await.map_err(|e| map_io(e, "create shard dir"))?;
        }

        let deduplicated = fs::try_exists(&final_path).await.unwrap_or(false);
        if deduplicated {
            // Identical content already stored — discard the new copy.
            fs::remove_file(&part_path).await.ok();
        } else {
            match fs::rename(&part_path, &final_path).await {
                Ok(()) => {}
                Err(_) if fs::try_exists(&final_path).await.unwrap_or(false) => {
                    // Concurrent upload of the same digest won the rename.
                    fs::remove_file(&part_path).await.ok();
                }
                Err(e) => {
                    fs::remove_file(&part_path).await.ok();
                    return Err(map_io(e, "finalize artifact"));
                }
            }
        }

        Ok(StoredArtifact { digest, storage_key, size_bytes, deduplicated })
    }

    async fn open(&self, storage_key: &str) -> Result<ByteStream> {
        let path = self.resolve(storage_key)?;
        let file = fs::File::open(&path).await.map_err(|e| {
            if e.kind() == std::io::ErrorKind::NotFound {
                RegistryError::NotFound("artifact")
            } else {
                map_io(e, "open artifact")
            }
        })?;
        Ok(Box::pin(ReaderStream::with_capacity(file, 64 * 1024)))
    }

    async fn exists(&self, storage_key: &str) -> Result<bool> {
        let path = self.resolve(storage_key)?;
        Ok(fs::try_exists(&path).await.unwrap_or(false))
    }

    async fn metadata(&self, storage_key: &str) -> Result<ArtifactMetadata> {
        let path = self.resolve(storage_key)?;
        let meta = fs::metadata(&path).await.map_err(|e| {
            if e.kind() == std::io::ErrorKind::NotFound {
                RegistryError::NotFound("artifact")
            } else {
                map_io(e, "stat artifact")
            }
        })?;
        Ok(ArtifactMetadata { storage_key: storage_key.to_string(), size_bytes: meta.len() })
    }

    async fn delete_unreferenced(&self, storage_key: &str) -> Result<()> {
        let path = self.resolve(storage_key)?;
        match fs::remove_file(&path).await {
            Ok(()) => Ok(()),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
            Err(e) => Err(map_io(e, "delete artifact")),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn storage_key_grammar() {
        let digest = Digest::parse(&"ab".repeat(32)).unwrap();
        assert!(validate_storage_key(&digest.storage_key()).is_ok());
        assert!(validate_storage_key("sha256/../x/etc").is_err());
        assert!(validate_storage_key("sha256/ab/cd/short").is_err());
        // shard prefix must match the digest
        assert!(validate_storage_key(&format!("sha256/ff/ff/{}", "ab".repeat(32))).is_err());
    }

    #[tokio::test]
    async fn put_open_roundtrip_and_dedupe() {
        let dir = tempfile::tempdir().unwrap();
        let store = FilesystemArtifactStore::new(dir.path(), "work", 0o640).await.unwrap();

        let payload = b"hello artifact".to_vec();
        let stream = || -> ByteStream {
            Box::pin(futures::stream::iter(vec![Ok(bytes::Bytes::from(payload.clone()))]))
        };

        let stored = store.put_stream(stream(), 1024, None).await.unwrap();
        assert!(!stored.deduplicated);
        assert_eq!(stored.size_bytes, payload.len() as u64);

        let again = store.put_stream(stream(), 1024, None).await.unwrap();
        assert!(again.deduplicated);
        assert_eq!(again.digest, stored.digest);

        let mut read = store.open(&stored.storage_key).await.unwrap();
        let mut collected = Vec::new();
        while let Some(chunk) = read.next().await {
            collected.extend_from_slice(&chunk.unwrap());
        }
        assert_eq!(collected, payload);

        // over-limit aborts and cleans up
        let err = store.put_stream(stream(), 4, None).await.unwrap_err();
        assert!(matches!(err, RegistryError::PayloadTooLarge { .. }));
    }
}
