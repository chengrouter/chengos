//! Replaceable, content-addressed artifact storage port.
//!
//! Exposes opaque storage keys (`sha256/ab/cd/<digest>`), never absolute
//! filesystem paths. Reads and writes stream; SHA-256 is computed while
//! streaming, never by buffering whole artifacts in memory.

use async_trait::async_trait;
use futures::stream::BoxStream;

use crate::domain::artifact::Digest;
use crate::error::Result;

/// Outcome of a streaming put.
#[derive(Debug, Clone)]
pub struct StoredArtifact {
    pub digest: Digest,
    pub storage_key: String,
    pub size_bytes: u64,
    /// True when an identical digest already existed (deduplicated).
    pub deduplicated: bool,
}

#[derive(Debug, Clone)]
pub struct ArtifactMetadata {
    pub storage_key: String,
    pub size_bytes: u64,
}

/// A chunked byte stream (upload body or file read).
pub type ByteStream = BoxStream<'static, std::io::Result<bytes::Bytes>>;

#[async_trait]
pub trait ArtifactStore: Send + Sync {
    /// Stream `body` into storage, computing SHA-256 on the fly.
    ///
    /// * `max_bytes` aborts the write as soon as the stream exceeds it.
    /// * `expected_digest`, when set, fails the put on mismatch (bytes are
    ///   discarded, nothing becomes visible).
    ///
    /// The write is atomic: bytes land in a `.part` work file, are fsynced,
    /// and renamed into the content-addressed location. Concurrent identical
    /// uploads deduplicate to one stored object.
    async fn put_stream(
        &self,
        body: ByteStream,
        max_bytes: u64,
        expected_digest: Option<&Digest>,
    ) -> Result<StoredArtifact>;

    /// Open a stored artifact for streaming read.
    async fn open(&self, storage_key: &str) -> Result<ByteStream>;

    async fn exists(&self, storage_key: &str) -> Result<bool>;

    async fn metadata(&self, storage_key: &str) -> Result<ArtifactMetadata>;

    /// Delete a stored object. Callers must have verified the digest is
    /// unreferenced in the database; implementations only remove bytes.
    async fn delete_unreferenced(&self, storage_key: &str) -> Result<()>;
}
