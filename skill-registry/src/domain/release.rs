//! Release identity, status machine, and immutability rules.
//!
//! A release is `skill + SemVer version`, bound to exactly one immutable
//! artifact. All legal state transitions live here; services must call
//! [`ReleaseStatus::can_transition`] (enforced again by repository guards and
//! database triggers).

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::artifact::ArtifactId;
use super::skill::SkillId;

pub type ReleaseId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReleaseStatus {
    /// Release session created; waiting for the artifact stream.
    PendingUpload,
    /// Artifact stored and bound; scan job queued in the same transaction.
    Uploaded,
    /// A scan worker holds the release.
    Scanning,
    /// Scan produced findings (or auto-approve is off); human review required.
    NeedsReview,
    /// Approved by policy/moderator but not yet visible.
    Approved,
    /// Publicly visible and installable.
    Published,
    /// Rejected by scan policy or moderator. Terminal except for admin restore.
    Rejected,
    /// Yanked by publisher/moderator: hidden from lists and latest-version
    /// resolution; still downloadable by exact pinned version+digest.
    Yanked,
    /// Quarantined by moderation: downloads blocked entirely.
    Quarantined,
}

impl ReleaseStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::PendingUpload => "pending_upload",
            Self::Uploaded => "uploaded",
            Self::Scanning => "scanning",
            Self::NeedsReview => "needs_review",
            Self::Approved => "approved",
            Self::Published => "published",
            Self::Rejected => "rejected",
            Self::Yanked => "yanked",
            Self::Quarantined => "quarantined",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "pending_upload" => Self::PendingUpload,
            "uploaded" => Self::Uploaded,
            "scanning" => Self::Scanning,
            "needs_review" => Self::NeedsReview,
            "approved" => Self::Approved,
            "published" => Self::Published,
            "rejected" => Self::Rejected,
            "yanked" => Self::Yanked,
            "quarantined" => Self::Quarantined,
            _ => return None,
        })
    }

    /// The complete legal transition table.
    pub fn can_transition(self, to: ReleaseStatus) -> bool {
        use ReleaseStatus::*;
        matches!(
            (self, to),
            (PendingUpload, Uploaded)
                | (Uploaded, Scanning)
                | (Scanning, NeedsReview)
                | (Scanning, Approved)
                | (Scanning, Rejected)
                | (Scanning, Quarantined)
                // scan worker crash recovery re-queues the scan
                | (Scanning, Uploaded)
                | (NeedsReview, Approved)
                | (NeedsReview, Rejected)
                | (NeedsReview, Quarantined)
                | (Approved, Published)
                | (Approved, Quarantined)
                | (Published, Yanked)
                | (Published, Quarantined)
                | (Yanked, Published)
                | (Yanked, Quarantined)
                // moderation restore paths
                | (Quarantined, Published)
                | (Quarantined, NeedsReview)
                | (Rejected, NeedsReview)
        )
    }

    /// Whether the artifact may be downloaded in this state when the client
    /// pins an exact version.
    pub fn downloadable_pinned(self) -> bool {
        matches!(self, Self::Published | Self::Yanked)
    }

    /// Whether this release participates in public listings and
    /// latest-version resolution.
    pub fn publicly_listed(self) -> bool {
        matches!(self, Self::Published)
    }

    /// Once an artifact is bound (>= Uploaded), the binding is immutable.
    pub fn artifact_locked(self) -> bool {
        !matches!(self, Self::PendingUpload)
    }
}

#[derive(Debug, Clone)]
pub struct Release {
    pub id: ReleaseId,
    pub skill_id: SkillId,
    /// SemVer 2.0.0, unique per skill.
    pub version: String,
    pub status: ReleaseStatus,
    pub changelog: Option<String>,
    pub minimum_chengos_version: String,
    pub maximum_chengos_version: Option<String>,
    /// Bound artifact. `None` only in `PendingUpload`.
    pub artifact_id: Option<ArtifactId>,
    pub created_by_identity: Uuid,
    pub published_at: Option<DateTime<Utc>>,
    pub yanked_at: Option<DateTime<Utc>>,
    pub yank_reason: Option<String>,
    pub quarantined_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Optional human-friendly release tags (`latest` is computed, not stored;
/// publishers may tag e.g. `beta`).
#[derive(Debug, Clone)]
pub struct ReleaseTag {
    pub skill_id: SkillId,
    pub tag: String,
    pub release_id: ReleaseId,
}

pub fn validate_version(version: &str) -> Result<semver::Version, String> {
    semver::Version::parse(version).map_err(|e| format!("invalid SemVer {version:?}: {e}"))
}

/// Compatibility range check used by capabilities/detail surfaces.
pub fn engine_in_range(
    engine: &semver::Version,
    minimum: &str,
    maximum: Option<&str>,
) -> Result<bool, String> {
    let min = validate_version(minimum)?;
    if engine < &min {
        return Ok(false);
    }
    if let Some(max) = maximum {
        let max = validate_version(max)?;
        if engine > &max {
            return Ok(false);
        }
    }
    Ok(true)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn transitions() {
        use ReleaseStatus::*;
        assert!(PendingUpload.can_transition(Uploaded));
        assert!(Uploaded.can_transition(Scanning));
        assert!(Scanning.can_transition(NeedsReview));
        assert!(NeedsReview.can_transition(Approved));
        assert!(Approved.can_transition(Published));
        assert!(Published.can_transition(Yanked));
        assert!(Yanked.can_transition(Published));
        assert!(Published.can_transition(Quarantined));
        assert!(Quarantined.can_transition(Published));
        // illegal examples
        assert!(!Published.can_transition(Approved));
        assert!(!Rejected.can_transition(Published));
        assert!(!PendingUpload.can_transition(Published));
        assert!(!Yanked.can_transition(NeedsReview));
    }

    #[test]
    fn engine_range() {
        let v = semver::Version::parse("1.5.0").unwrap();
        assert!(engine_in_range(&v, "1.0.0", None).unwrap());
        assert!(engine_in_range(&v, "1.0.0", Some("2.0.0")).unwrap());
        assert!(!engine_in_range(&v, "2.0.0", None).unwrap());
        assert!(!engine_in_range(&v, "1.0.0", Some("1.4.9")).unwrap());
    }
}
