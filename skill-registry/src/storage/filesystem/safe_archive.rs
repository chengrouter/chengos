//! Safe ZIP archive reader.
//!
//! Reads a Package v1 archive without trusting any header field: sizes are
//! enforced on *actual* streamed bytes, paths are validated structurally,
//! entry types are checked from unix modes, and reading stops immediately
//! when a hard limit is exceeded. Content-level policy (required files,
//! manifest consistency, binary signatures, UTF-8) lives in
//! [`crate::security::package_policy`]; this module only guarantees the
//! archive is structurally safe to look at.

use std::collections::HashSet;
use std::io::Read;
use std::path::Path;

use sha2::{Digest as _, Sha256};
use unicode_normalization::UnicodeNormalization;

use crate::error::{codes, PackageError};

#[derive(Debug, Clone)]
pub struct ArchiveLimits {
    pub max_files: usize,
    pub max_file_bytes: u64,
    pub max_expanded_bytes: u64,
    pub max_compression_ratio: u64,
    pub max_path_bytes: usize,
    pub max_path_depth: usize,
}

impl ArchiveLimits {
    pub fn from_config(config: &crate::config::ArtifactConfig) -> Self {
        Self {
            max_files: config.max_files,
            max_file_bytes: config.max_file_bytes,
            max_expanded_bytes: config.max_expanded_bytes,
            max_compression_ratio: config.max_compression_ratio,
            max_path_bytes: config.max_path_bytes,
            max_path_depth: config.max_path_depth,
        }
    }
}

/// One safely extracted file entry (directories are skipped).
#[derive(Debug, Clone)]
pub struct ArchiveEntry {
    pub path: String,
    pub size: u64,
    pub sha256: String,
    pub data: Vec<u8>,
}

pub const NESTED_ARCHIVE_EXTENSIONS: &[&str] = &[
    "zip", "tar", "gz", "tgz", "bz2", "xz", "zst", "7z", "rar", "jar", "war",
];

/// Read and structurally validate the archive at `path` (blocking).
///
/// Returns all file entries with their contents on success, or every
/// collected structural error. Size-limit violations abort immediately.
pub fn read_archive(path: &Path, limits: &ArchiveLimits) -> Result<Vec<ArchiveEntry>, Vec<PackageError>> {
    let file = std::fs::File::open(path)
        .map_err(|e| vec![PackageError::new("PKG_READ_ERROR", format!("open archive: {e}"))])?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| {
        vec![PackageError::new(codes::PKG_INVALID_JSON, format!("not a readable ZIP archive: {e}"))]
    })?;

    let mut errors: Vec<PackageError> = Vec::new();
    let mut entries: Vec<ArchiveEntry> = Vec::new();
    let mut seen_exact: HashSet<String> = HashSet::new();
    let mut seen_folded: HashSet<String> = HashSet::new();
    let mut total_expanded: u64 = 0;
    let mut total_compressed: u64 = 0;
    let mut file_count = 0usize;

    for index in 0..archive.len() {
        let mut entry = match archive.by_index(index) {
            Ok(entry) => entry,
            Err(e) => {
                errors.push(PackageError::new("PKG_READ_ERROR", format!("read entry {index}: {e}")));
                continue;
            }
        };

        // Raw name checks happen before any interpretation.
        let raw_name = String::from_utf8_lossy(entry.name_raw()).to_string();

        if entry.is_dir() {
            // Directory entries carry no content; ignore them (path safety of
            // contained files is checked on the files themselves).
            continue;
        }

        // --- entry type ---------------------------------------------------
        if let Some(mode) = entry.unix_mode() {
            match mode & 0o170000 {
                0o120000 => {
                    errors.push(PackageError::at(codes::PKG_SYMLINK_FORBIDDEN, "symlink entries are forbidden", &raw_name));
                    continue;
                }
                0o010000 | 0o140000 => {
                    errors.push(PackageError::at(codes::PKG_SPECIAL_FILE_FORBIDDEN, "FIFO/socket entries are forbidden", &raw_name));
                    continue;
                }
                0o020000 | 0o060000 => {
                    errors.push(PackageError::at(codes::PKG_SPECIAL_FILE_FORBIDDEN, "device entries are forbidden", &raw_name));
                    continue;
                }
                _ => {}
            }
        }

        // --- path safety ---------------------------------------------------
        if let Err(err) = validate_entry_path(&raw_name, limits) {
            errors.push(err);
            continue;
        }
        let normalized: String = raw_name.nfc().collect();

        if !seen_exact.insert(normalized.clone()) {
            errors.push(PackageError::at(codes::PKG_DUPLICATE_PATH, "duplicate entry path", &raw_name));
            continue;
        }
        if !seen_folded.insert(normalized.to_lowercase()) {
            errors.push(PackageError::at(
                codes::PKG_DUPLICATE_PATH,
                "path collides with another entry after case folding",
                &raw_name,
            ));
            continue;
        }

        // --- nested archives (by extension; magic checked in policy) -------
        if let Some(ext) = normalized.rsplit('.').next() {
            if normalized.contains('.') && NESTED_ARCHIVE_EXTENSIONS.contains(&ext.to_ascii_lowercase().as_str()) {
                errors.push(PackageError::at(codes::PKG_NESTED_ARCHIVE, "nested archives are forbidden", &raw_name));
                continue;
            }
        }

        // --- counts ---------------------------------------------------------
        file_count += 1;
        if file_count > limits.max_files {
            errors.push(PackageError::new(
                codes::PKG_TOO_MANY_FILES,
                format!("more than {} files", limits.max_files),
            ));
            return Err(errors);
        }

        // --- streamed content with hard limits ------------------------------
        let compressed_size = entry.compressed_size().max(1);
        let mut hasher = Sha256::new();
        let mut data: Vec<u8> = Vec::with_capacity((entry.size() as usize).min(64 * 1024));
        let mut buf = [0u8; 64 * 1024];
        let mut actual: u64 = 0;
        loop {
            let read = match entry.read(&mut buf) {
                Ok(0) => break,
                Ok(n) => n,
                Err(e) => {
                    errors.push(PackageError::at("PKG_READ_ERROR", format!("decompress: {e}"), &raw_name));
                    actual = u64::MAX; // poison; skip storing this entry
                    break;
                }
            };
            actual += read as u64;
            // Stop the moment ACTUAL bytes exceed a limit — declared sizes
            // are never trusted.
            if actual > limits.max_file_bytes {
                errors.push(PackageError::at(
                    codes::PKG_FILE_TOO_LARGE,
                    format!("file exceeds {} bytes", limits.max_file_bytes),
                    &raw_name,
                ));
                return Err(errors);
            }
            if total_expanded + actual > limits.max_expanded_bytes {
                errors.push(PackageError::new(
                    codes::PKG_EXPANDED_TOO_LARGE,
                    format!("expanded size exceeds {} bytes", limits.max_expanded_bytes),
                ));
                return Err(errors);
            }
            if actual / compressed_size > limits.max_compression_ratio {
                errors.push(PackageError::at(
                    codes::PKG_COMPRESSION_RATIO,
                    format!("compression ratio exceeds {}:1", limits.max_compression_ratio),
                    &raw_name,
                ));
                return Err(errors);
            }
            hasher.update(&buf[..read]);
            data.extend_from_slice(&buf[..read]);
        }
        if actual == u64::MAX {
            continue;
        }
        total_expanded += actual;
        total_compressed += compressed_size;
        if total_compressed > 0 && total_expanded / total_compressed.max(1) > limits.max_compression_ratio {
            errors.push(PackageError::new(
                codes::PKG_COMPRESSION_RATIO,
                format!("total compression ratio exceeds {}:1", limits.max_compression_ratio),
            ));
            return Err(errors);
        }

        let hash: [u8; 32] = hasher.finalize().into();
        entries.push(ArchiveEntry {
            path: normalized,
            size: actual,
            sha256: hex::encode(hash),
            data,
        });
    }

    if errors.is_empty() {
        Ok(entries)
    } else {
        Err(errors)
    }
}

fn validate_entry_path(raw: &str, limits: &ArchiveLimits) -> Result<(), PackageError> {
    if raw.is_empty() {
        return Err(PackageError::new(codes::PKG_PATH_TRAVERSAL, "empty entry path"));
    }
    if raw.len() > limits.max_path_bytes {
        return Err(PackageError::at(
            codes::PKG_PATH_TOO_LONG,
            format!("path exceeds {} bytes", limits.max_path_bytes),
            raw,
        ));
    }
    if raw.contains('\\') {
        return Err(PackageError::at(codes::PKG_PATH_TRAVERSAL, "backslash path separators are forbidden", raw));
    }
    if raw.starts_with('/') || raw.starts_with('~') {
        return Err(PackageError::at(codes::PKG_ABSOLUTE_PATH, "absolute paths are forbidden", raw));
    }
    // Windows drive letters / alternate data streams.
    if raw.len() >= 2 && raw.as_bytes()[1] == b':' {
        return Err(PackageError::at(codes::PKG_ABSOLUTE_PATH, "drive-letter paths are forbidden", raw));
    }
    if raw.bytes().any(|b| b < 0x20 || b == 0x7f) {
        return Err(PackageError::at(codes::PKG_PATH_TRAVERSAL, "control characters in path", raw));
    }
    let segments: Vec<&str> = raw.split('/').collect();
    if segments.len() > limits.max_path_depth {
        return Err(PackageError::at(
            codes::PKG_PATH_TOO_LONG,
            format!("path deeper than {} segments", limits.max_path_depth),
            raw,
        ));
    }
    for segment in &segments {
        if segment.is_empty() || *segment == "." || *segment == ".." {
            return Err(PackageError::at(codes::PKG_PATH_TRAVERSAL, "path traversal segment", raw));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use zip::write::SimpleFileOptions;

    fn limits() -> ArchiveLimits {
        ArchiveLimits {
            max_files: 16,
            max_file_bytes: 1024 * 1024,
            max_expanded_bytes: 2 * 1024 * 1024,
            max_compression_ratio: 200,
            max_path_bytes: 256,
            max_path_depth: 8,
        }
    }

    fn build_zip(entries: &[(&str, &[u8])]) -> tempfile::NamedTempFile {
        let file = tempfile::NamedTempFile::new().unwrap();
        let mut writer = zip::ZipWriter::new(file.reopen().unwrap());
        for (name, data) in entries {
            writer.start_file(*name, SimpleFileOptions::default()).unwrap();
            writer.write_all(data).unwrap();
        }
        writer.finish().unwrap();
        file
    }

    #[test]
    fn reads_valid_archive() {
        let zip = build_zip(&[("SKILL.md", b"# hi"), ("skill.yaml", b"name: x")]);
        let entries = read_archive(zip.path(), &limits()).unwrap();
        assert_eq!(entries.len(), 2);
        assert_eq!(entries[0].path, "SKILL.md");
        assert_eq!(entries[0].size, 4);
    }

    #[test]
    fn rejects_traversal_and_absolute() {
        let zip = build_zip(&[("../evil.txt", b"x")]);
        let errs = read_archive(zip.path(), &limits()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_PATH_TRAVERSAL));

        let zip = build_zip(&[("/etc/passwd", b"x")]);
        let errs = read_archive(zip.path(), &limits()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_ABSOLUTE_PATH));
    }

    #[test]
    fn rejects_duplicates_and_case_collisions() {
        let zip = build_zip(&[("a.txt", b"1"), ("A.TXT", b"2")]);
        let errs = read_archive(zip.path(), &limits()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_DUPLICATE_PATH));
    }

    #[test]
    fn rejects_nested_archives() {
        let zip = build_zip(&[("references/inner.zip", b"PK")]);
        let errs = read_archive(zip.path(), &limits()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_NESTED_ARCHIVE));
    }

    #[test]
    fn bomb_stops_on_actual_bytes() {
        let big = vec![b'a'; 3 * 1024 * 1024];
        let zip = build_zip(&[("SKILL.md", big.as_slice())]);
        let errs = read_archive(zip.path(), &limits()).unwrap_err();
        assert!(errs
            .iter()
            .any(|e| e.code == codes::PKG_FILE_TOO_LARGE
                || e.code == codes::PKG_EXPANDED_TOO_LARGE
                || e.code == codes::PKG_COMPRESSION_RATIO));
    }

    #[test]
    fn rejects_symlink_entries() {
        let file = tempfile::NamedTempFile::new().unwrap();
        let mut writer = zip::ZipWriter::new(file.reopen().unwrap());
        writer
            .add_symlink("link.md", "/etc/passwd", SimpleFileOptions::default())
            .unwrap();
        writer.finish().unwrap();
        let errs = read_archive(file.path(), &limits()).unwrap_err();
        assert!(errs.iter().any(|e| e.code == codes::PKG_SYMLINK_FORBIDDEN));
    }
}
