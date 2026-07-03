//! Scan reports and findings.
//!
//! Reports are append-only: a rescan writes a new report and never overwrites
//! historical ones. Each report records the exact policy version that
//! produced it so policy updates can drive targeted rescans.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::artifact::ArtifactId;
use super::release::ReleaseId;

pub type ScanReportId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ScanConclusion {
    /// No findings at or above the reporting threshold.
    Clean,
    /// Findings present; severity decides review vs quarantine.
    Findings,
    /// Scanner failed; release must not advance on an errored scan.
    Error,
}

impl ScanConclusion {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Clean => "clean",
            Self::Findings => "findings",
            Self::Error => "error",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "clean" => Some(Self::Clean),
            "findings" => Some(Self::Findings),
            "error" => Some(Self::Error),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

impl Severity {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Low => "low",
            Self::Medium => "medium",
            Self::High => "high",
            Self::Critical => "critical",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "low" => Some(Self::Low),
            "medium" => Some(Self::Medium),
            "high" => Some(Self::High),
            "critical" => Some(Self::Critical),
            _ => None,
        }
    }
}

/// Stable finding kinds surfaced to the UI and ChengFlow.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FindingKind {
    Secret,
    NetworkAccess,
    FilesystemWrite,
    ShellFeature,
    DynamicExecution,
    PrivilegeEscalation,
    Download,
    HighRiskNode,
    CredentialUse,
    BinaryDependency,
    DeclarationMismatch,
    PolicyViolation,
}

impl FindingKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Secret => "secret",
            Self::NetworkAccess => "network_access",
            Self::FilesystemWrite => "filesystem_write",
            Self::ShellFeature => "shell_feature",
            Self::DynamicExecution => "dynamic_execution",
            Self::PrivilegeEscalation => "privilege_escalation",
            Self::Download => "download",
            Self::HighRiskNode => "high_risk_node",
            Self::CredentialUse => "credential_use",
            Self::BinaryDependency => "binary_dependency",
            Self::DeclarationMismatch => "declaration_mismatch",
            Self::PolicyViolation => "policy_violation",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "secret" => Self::Secret,
            "network_access" => Self::NetworkAccess,
            "filesystem_write" => Self::FilesystemWrite,
            "shell_feature" => Self::ShellFeature,
            "dynamic_execution" => Self::DynamicExecution,
            "privilege_escalation" => Self::PrivilegeEscalation,
            "download" => Self::Download,
            "high_risk_node" => Self::HighRiskNode,
            "credential_use" => Self::CredentialUse,
            "binary_dependency" => Self::BinaryDependency,
            "declaration_mismatch" => Self::DeclarationMismatch,
            "policy_violation" => Self::PolicyViolation,
            _ => return None,
        })
    }
}

#[derive(Debug, Clone)]
pub struct ScanReport {
    pub id: ScanReportId,
    pub release_id: ReleaseId,
    pub artifact_id: ArtifactId,
    pub scanner_name: String,
    pub scanner_version: String,
    /// Package/scan policy version that produced this report.
    pub policy_version: String,
    pub conclusion: ScanConclusion,
    pub started_at: DateTime<Utc>,
    pub finished_at: DateTime<Utc>,
    pub findings: Vec<ScanFinding>,
}

/// A single finding. `excerpt` MUST already be redacted at construction time —
/// secret values are never persisted, only their location and a masked hint.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanFinding {
    pub kind: FindingKind,
    pub severity: Severity,
    /// Stable machine code, e.g. `SECRET_AWS_KEY`, `NET_DOMAIN`.
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub line: Option<u32>,
    /// Redacted context (e.g. `AKIA****`). Never the raw value.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub excerpt: Option<String>,
}

impl ScanReport {
    pub fn max_severity(&self) -> Option<Severity> {
        self.findings.iter().map(|f| f.severity).max()
    }
}
