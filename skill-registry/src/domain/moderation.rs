//! Reports, moderation actions, and append-only audit events.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::release::ReleaseId;
use super::skill::SkillId;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReportStatus {
    Open,
    Resolved,
    Dismissed,
}

impl ReportStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Open => "open",
            Self::Resolved => "resolved",
            Self::Dismissed => "dismissed",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "open" => Some(Self::Open),
            "resolved" => Some(Self::Resolved),
            "dismissed" => Some(Self::Dismissed),
            _ => None,
        }
    }
}

/// An abuse/security report filed against a skill (optionally one release).
#[derive(Debug, Clone)]
pub struct AbuseReport {
    pub id: Uuid,
    pub skill_id: SkillId,
    pub release_id: Option<ReleaseId>,
    /// One of a small set of reasons: malware, secrets, spam, license, other.
    pub reason: String,
    pub details: String,
    /// Optional reporter contact; stored only for follow-up, never displayed.
    pub contact: Option<String>,
    pub status: ReportStatus,
    pub created_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
}

pub const REPORT_REASONS: &[&str] = &["malware", "secrets", "spam", "license", "impersonation", "other"];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ModerationActionKind {
    ApproveRelease,
    RejectRelease,
    YankRelease,
    UnyankRelease,
    QuarantineRelease,
    RestoreRelease,
    HideSkill,
    UnhideSkill,
    BanPublisher,
    UnbanPublisher,
    ResolveReport,
    DismissReport,
    Note,
}

impl ModerationActionKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::ApproveRelease => "approve_release",
            Self::RejectRelease => "reject_release",
            Self::YankRelease => "yank_release",
            Self::UnyankRelease => "unyank_release",
            Self::QuarantineRelease => "quarantine_release",
            Self::RestoreRelease => "restore_release",
            Self::HideSkill => "hide_skill",
            Self::UnhideSkill => "unhide_skill",
            Self::BanPublisher => "ban_publisher",
            Self::UnbanPublisher => "unban_publisher",
            Self::ResolveReport => "resolve_report",
            Self::DismissReport => "dismiss_report",
            Self::Note => "note",
        }
    }
}

/// Append-only moderation action record. Ordinary moderation never physically
/// deletes published artifacts; it changes visibility state and records why.
#[derive(Debug, Clone)]
pub struct ModerationAction {
    pub id: Uuid,
    pub kind: ModerationActionKind,
    /// Admin/moderator identifier (admin token label or identity id).
    pub actor: String,
    pub skill_id: Option<SkillId>,
    pub release_id: Option<ReleaseId>,
    pub publisher_id: Option<Uuid>,
    pub report_id: Option<Uuid>,
    pub reason: String,
    pub created_at: DateTime<Utc>,
}

/// Who performed an audited operation.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AuditActorType {
    /// Anonymous public request (e.g. download counting is not audited).
    Anonymous,
    /// A linked external identity acting through a grant/API token.
    Identity,
    /// Deployment administrator.
    Admin,
    /// Background job / system transition.
    System,
}

impl AuditActorType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Anonymous => "anonymous",
            Self::Identity => "identity",
            Self::Admin => "admin",
            Self::System => "system",
        }
    }
}

/// Append-only audit event. Every publishing, moderation, token, and state
/// transition operation writes one in the same transaction as the change.
#[derive(Debug, Clone)]
pub struct AuditEvent {
    pub id: Uuid,
    pub actor_type: AuditActorType,
    /// Identity id, admin label, or job name.
    pub actor: String,
    /// Stable action name, e.g. `release.publish`, `token.revoke`.
    pub action: String,
    /// Subject type: `skill`, `release`, `artifact`, `publisher`, `token`,
    /// `report`, `job`.
    pub subject_type: String,
    pub subject_id: String,
    /// Safe structured details (no secrets, no raw tokens).
    pub details: serde_json::Value,
    pub request_id: Option<String>,
    pub created_at: DateTime<Utc>,
}
