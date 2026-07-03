//! Response DTOs — the stable public JSON shapes.
//!
//! DTOs are constructed explicitly from domain types (never `#[serde]` on
//! domain structs directly) so internal refactors cannot silently change the
//! wire contract. Fields are additive-only once shipped.

use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::domain::artifact::{Artifact, ArtifactFileEntry, SafetySummary, ScriptDeclaration};
use crate::domain::pagination::Page;
use crate::domain::publisher::Publisher;
use crate::domain::release::Release;
use crate::domain::scan::{ScanFinding, ScanReport};
use crate::ports::repositories::{ResolvedSkill, SkillListRow};
use crate::services::catalog_service::{ReleaseDetail, SkillDetail};

#[derive(Serialize)]
pub struct PageDto<T> {
    pub items: Vec<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next_cursor: Option<String>,
}

impl<T> PageDto<T> {
    pub fn from_page<S>(page: Page<S>, f: impl FnMut(S) -> T) -> Self {
        Self {
            next_cursor: page.next_cursor.clone(),
            items: page.items.into_iter().map(f).collect(),
        }
    }
}

#[derive(Serialize)]
pub struct PublisherDto {
    pub handle: String,
    pub display_name: String,
    pub publisher_type: String,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
}

impl PublisherDto {
    pub fn from_domain(publisher: &Publisher) -> Self {
        Self {
            handle: publisher.handle.clone(),
            display_name: publisher.display_name.clone(),
            publisher_type: publisher.publisher_type.as_str().to_string(),
            verified: publisher.verified,
            created_at: publisher.created_at,
        }
    }
}

#[derive(Serialize)]
pub struct SkillSummaryDto {
    pub publisher: String,
    pub publisher_display_name: String,
    pub publisher_verified: bool,
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latest_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latest_release_at: Option<DateTime<Utc>>,
    pub downloads_total: i64,
    pub updated_at: DateTime<Utc>,
}

impl SkillSummaryDto {
    pub fn from_row(row: SkillListRow) -> Self {
        Self {
            publisher: row.publisher_handle,
            publisher_display_name: row.publisher_display_name,
            publisher_verified: row.publisher_verified,
            slug: row.skill.slug,
            name: row.skill.name,
            summary: row.skill.summary,
            categories: row.skill.categories,
            tags: row.skill.tags,
            license: row.skill.license,
            latest_version: row.latest_version,
            latest_release_at: row.latest_release_at,
            downloads_total: row.downloads_total,
            updated_at: row.skill.updated_at,
        }
    }
}

#[derive(Serialize)]
pub struct ArtifactDto {
    /// `sha256:<hex>` — the pin ChengFlow installs against.
    pub digest: String,
    pub media_type: String,
    pub size_bytes: i64,
    pub expanded_bytes: i64,
    pub file_count: i32,
}

impl ArtifactDto {
    pub fn from_domain(artifact: &Artifact) -> Self {
        Self {
            digest: format!("sha256:{}", artifact.digest.as_str()),
            media_type: artifact.media_type.clone(),
            size_bytes: artifact.size_bytes,
            expanded_bytes: artifact.expanded_bytes,
            file_count: artifact.file_count,
        }
    }
}

#[derive(Serialize)]
pub struct ReleaseDto {
    pub version: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub changelog: Option<String>,
    pub minimum_chengos_version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub maximum_chengos_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub published_at: Option<DateTime<Utc>>,
    pub yanked: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub yank_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub artifact: Option<ArtifactDto>,
}

impl ReleaseDto {
    pub fn from_domain(release: &Release, artifact: Option<&Artifact>) -> Self {
        Self {
            version: release.version.clone(),
            status: release.status.as_str().to_string(),
            changelog: release.changelog.clone(),
            minimum_chengos_version: release.minimum_chengos_version.clone(),
            maximum_chengos_version: release.maximum_chengos_version.clone(),
            published_at: release.published_at,
            yanked: release.yanked_at.is_some(),
            yank_reason: release.yank_reason.clone(),
            created_at: release.created_at,
            artifact: artifact.map(ArtifactDto::from_domain),
        }
    }
}

#[derive(Serialize)]
pub struct SkillDetailDto {
    pub publisher: PublisherDto,
    pub slug: String,
    /// True when the request used a renamed slug; `slug` is the canonical one.
    pub via_alias: bool,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<String>,
    pub downloads_total: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latest_release: Option<ReleaseDto>,
}

impl SkillDetailDto {
    pub fn from_detail(detail: SkillDetail) -> Self {
        let SkillDetail { resolved, latest, downloads_total } = detail;
        let ResolvedSkill { skill, publisher, via_alias } = resolved;
        Self {
            publisher: PublisherDto::from_domain(&publisher),
            slug: skill.slug,
            via_alias,
            name: skill.name,
            summary: skill.summary,
            description: skill.description,
            categories: skill.categories,
            tags: skill.tags,
            license: skill.license,
            downloads_total,
            created_at: skill.created_at,
            updated_at: skill.updated_at,
            latest_release: latest.as_ref().map(|r| ReleaseDto::from_domain(r, None)),
        }
    }
}

#[derive(Serialize)]
pub struct FileEntryDto {
    pub path: String,
    pub size: u64,
    pub sha256: String,
    pub kind: String,
}

impl FileEntryDto {
    pub fn from_domain(file: &ArtifactFileEntry) -> Self {
        Self {
            path: file.path.clone(),
            size: file.size,
            sha256: file.sha256.clone(),
            kind: file.kind.as_str().to_string(),
        }
    }
}

#[derive(Serialize)]
pub struct ScriptDto {
    pub path: String,
    pub interpreter: String,
    pub purpose: String,
    pub entry_point: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

impl ScriptDto {
    pub fn from_domain(script: &ScriptDeclaration) -> Self {
        Self {
            path: script.path.clone(),
            interpreter: script.interpreter.clone(),
            purpose: script.purpose.as_str().to_string(),
            entry_point: script.entry_point,
            description: script.description.clone(),
        }
    }
}

/// Advisory safety facts shown on detail pages (never a substitute for the
/// local ChengFlow validation).
#[derive(Serialize)]
pub struct SafetyDto {
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

impl SafetyDto {
    pub fn from_domain(safety: &SafetySummary) -> Self {
        Self {
            script_count: safety.script_count,
            executable_intent_scripts: safety.executable_intent_scripts,
            network_domains: safety.network_domains.clone(),
            requires_credentials: safety.requires_credentials.clone(),
            filesystem_write: safety.filesystem_write,
            shell_features: safety.shell_features.clone(),
            dynamic_execution: safety.dynamic_execution,
            secret_findings: safety.secret_findings,
            high_risk_nodes: safety.high_risk_nodes.clone(),
        }
    }
}

#[derive(Serialize)]
pub struct FindingDto {
    pub kind: String,
    pub severity: String,
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub line: Option<u32>,
    /// Already redacted at scan time; never a raw value.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub excerpt: Option<String>,
}

impl FindingDto {
    pub fn from_domain(finding: &ScanFinding) -> Self {
        Self {
            kind: finding.kind.as_str().to_string(),
            severity: finding.severity.as_str().to_string(),
            code: finding.code.clone(),
            message: finding.message.clone(),
            path: finding.path.clone(),
            line: finding.line,
            excerpt: finding.excerpt.clone(),
        }
    }
}

#[derive(Serialize)]
pub struct ScanReportDto {
    pub conclusion: String,
    pub policy_version: String,
    pub scanner_version: String,
    pub finished_at: DateTime<Utc>,
    pub findings: Vec<FindingDto>,
}

impl ScanReportDto {
    pub fn from_domain(report: &ScanReport) -> Self {
        Self {
            conclusion: report.conclusion.as_str().to_string(),
            policy_version: report.policy_version.clone(),
            scanner_version: report.scanner_version.clone(),
            finished_at: report.finished_at,
            findings: report.findings.iter().map(FindingDto::from_domain).collect(),
        }
    }
}

#[derive(Serialize)]
pub struct ReleaseDetailDto {
    pub publisher: String,
    pub slug: String,
    pub via_alias: bool,
    #[serde(flatten)]
    pub release: ReleaseDto,
    pub files: Vec<FileEntryDto>,
    pub scripts: Vec<ScriptDto>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub safety: Option<SafetyDto>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latest_scan: Option<ScanReportDto>,
    pub downloads_total: i64,
}

impl ReleaseDetailDto {
    pub fn from_detail(detail: ReleaseDetail) -> Self {
        Self {
            publisher: detail.resolved.publisher.handle.clone(),
            slug: detail.resolved.skill.slug.clone(),
            via_alias: detail.resolved.via_alias,
            release: ReleaseDto::from_domain(&detail.release, detail.artifact.as_ref()),
            files: detail.files.iter().map(FileEntryDto::from_domain).collect(),
            scripts: detail.scripts.iter().map(ScriptDto::from_domain).collect(),
            safety: detail.safety.as_ref().map(SafetyDto::from_domain),
            latest_scan: detail.latest_scan.as_ref().map(ScanReportDto::from_domain),
            downloads_total: detail.downloads_total,
        }
    }
}

#[derive(Serialize)]
pub struct CategoryDto {
    pub name: String,
    pub skill_count: i64,
}
