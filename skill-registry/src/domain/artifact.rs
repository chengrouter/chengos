//! Artifact identity and value objects.
//!
//! Artifacts are content-addressed by the SHA-256 of the archive bytes and
//! shared across releases when digests match. The storage key is derived from
//! the digest only — never from user input.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub type ArtifactId = Uuid;

pub const PACKAGE_V1_MEDIA_TYPE: &str = "application/vnd.chengos.skill-package.v1+zip";

/// Lowercase hex SHA-256 digest newtype.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Digest(String);

impl Digest {
    pub fn parse(s: &str) -> Result<Self, String> {
        let s = s.trim();
        let s = s.strip_prefix("sha256:").unwrap_or(s);
        if s.len() != 64 || !s.bytes().all(|b| b.is_ascii_hexdigit()) {
            return Err("digest must be 64 hex characters".into());
        }
        Ok(Self(s.to_ascii_lowercase()))
    }

    pub fn from_bytes(hash: &[u8; 32]) -> Self {
        Self(hex::encode(hash))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// Content-addressed storage key: `sha256/ab/cd/<full digest>`.
    pub fn storage_key(&self) -> String {
        format!("sha256/{}/{}/{}", &self.0[..2], &self.0[2..4], &self.0)
    }
}

impl std::fmt::Display for Digest {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

#[derive(Debug, Clone)]
pub struct Artifact {
    pub id: ArtifactId,
    pub digest: Digest,
    pub storage_key: String,
    pub media_type: String,
    /// Compressed archive bytes.
    pub size_bytes: i64,
    /// Sum of expanded entry sizes.
    pub expanded_bytes: i64,
    pub file_count: i32,
    pub created_at: DateTime<Utc>,
}

/// One validated file entry inside the package (mirrors manifest `files[]`).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArtifactFileEntry {
    pub path: String,
    pub size: u64,
    pub sha256: String,
    pub kind: FileKind,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FileKind {
    SkillMd,
    SkillYaml,
    WorkflowJson,
    Reference,
    Script,
}

impl FileKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::SkillMd => "skill_md",
            Self::SkillYaml => "skill_yaml",
            Self::WorkflowJson => "workflow_json",
            Self::Reference => "reference",
            Self::Script => "script",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "skill_md" => Self::SkillMd,
            "skill_yaml" => Self::SkillYaml,
            "workflow_json" => Self::WorkflowJson,
            "reference" => Self::Reference,
            "script" => Self::Script,
            _ => return None,
        })
    }
}

/// Declared script metadata (mirrors manifest `scripts[]`).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptDeclaration {
    pub path: String,
    pub interpreter: String,
    pub purpose: ScriptPurpose,
    #[serde(default)]
    pub entry_point: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ScriptPurpose {
    Install,
    Runtime,
    Helper,
    DocumentationExample,
}

impl ScriptPurpose {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Install => "install",
            Self::Runtime => "runtime",
            Self::Helper => "helper",
            Self::DocumentationExample => "documentation_example",
        }
    }
    pub fn is_executable_intent(&self) -> bool {
        matches!(self, Self::Install | Self::Runtime)
    }
}

/// Aggregated safety facts extracted at validation/scan time; displayed on
/// detail pages and stored with the artifact record. Advisory evidence only.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct SafetySummary {
    pub script_count: u32,
    pub executable_intent_scripts: u32,
    pub network_domains: Vec<String>,
    pub requires_credentials: Vec<String>,
    pub filesystem_write: bool,
    pub shell_features: Vec<String>,
    pub dynamic_execution: bool,
    pub secret_findings: u32,
    pub high_risk_nodes: Vec<String>,
}

/// Size boundary check shared by upload paths.
pub fn validate_sizes(size_bytes: u64, expanded_bytes: u64, max_archive: u64, max_expanded: u64) -> Result<(), String> {
    if size_bytes == 0 {
        return Err("artifact is empty".into());
    }
    if size_bytes > max_archive {
        return Err(format!("archive {size_bytes} bytes exceeds limit {max_archive}"));
    }
    if expanded_bytes > max_expanded {
        return Err(format!("expanded {expanded_bytes} bytes exceeds limit {max_expanded}"));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn digest_rules() {
        let d = Digest::parse(&"a".repeat(64)).unwrap();
        assert_eq!(d.storage_key(), format!("sha256/aa/aa/{}", "a".repeat(64)));
        assert!(Digest::parse("xyz").is_err());
        assert!(Digest::parse(&"A".repeat(64)).is_ok());
        assert!(Digest::parse(&format!("sha256:{}", "b".repeat(64))).is_ok());
    }
}
