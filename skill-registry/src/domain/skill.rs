//! The Skill aggregate: publisher-owned catalog entry.
//!
//! Skill *metadata* (name, summary, description, categories, tags, license,
//! visibility) is mutable; release contents are immutable and live in
//! [`super::release`]. Slug renames keep old URLs working through
//! [`SkillAlias`] records that resolve to the canonical slug.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::publisher::PublisherId;

pub type SkillId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SkillVisibility {
    /// Listed in search and category browsing.
    Public,
    /// Reachable by direct URL, not listed.
    Unlisted,
    /// Hidden by moderation; detail/download blocked for non-owners.
    Hidden,
}

impl SkillVisibility {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Public => "public",
            Self::Unlisted => "unlisted",
            Self::Hidden => "hidden",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "public" => Some(Self::Public),
            "unlisted" => Some(Self::Unlisted),
            "hidden" => Some(Self::Hidden),
            _ => None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Skill {
    pub id: SkillId,
    pub publisher_id: PublisherId,
    /// Canonical slug. Renames move the previous slug into `skill_aliases`.
    pub slug: String,
    pub name: String,
    pub summary: String,
    pub description: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    pub license: Option<String>,
    pub visibility: SkillVisibility,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone)]
pub struct SkillAlias {
    pub skill_id: SkillId,
    /// A previously used slug that now redirects to the canonical one.
    pub old_slug: String,
    pub created_at: DateTime<Utc>,
}

pub const SLUG_MAX_LEN: usize = 64;
pub const MAX_CATEGORIES: usize = 3;
pub const MAX_TAGS: usize = 10;
pub const MAX_SUMMARY_LEN: usize = 280;
pub const MAX_DESCRIPTION_LEN: usize = 64 * 1024;

/// Slug rule shared with `skill-package-spec` §3:
/// `^[a-z0-9][a-z0-9-]{1,63}$`, no trailing `-`.
pub fn validate_slug(slug: &str) -> Result<(), String> {
    if slug.len() < 2 || slug.len() > SLUG_MAX_LEN {
        return Err(format!("slug must be 2..={SLUG_MAX_LEN} characters"));
    }
    let bytes = slug.as_bytes();
    if !bytes[0].is_ascii_lowercase() && !bytes[0].is_ascii_digit() {
        return Err("slug must start with a lowercase letter or digit".into());
    }
    if bytes[bytes.len() - 1] == b'-' {
        return Err("slug must not end with '-'".into());
    }
    if !bytes
        .iter()
        .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || *b == b'-')
    {
        return Err("slug may contain only [a-z0-9-]".into());
    }
    Ok(())
}

/// Validate mutable metadata fields on create/update.
pub fn validate_metadata(
    name: &str,
    summary: &str,
    description: &str,
    categories: &[String],
    tags: &[String],
) -> Result<(), String> {
    if name.trim().is_empty() || name.len() > 128 {
        return Err("name must be 1..=128 characters".into());
    }
    if summary.len() > MAX_SUMMARY_LEN {
        return Err(format!("summary must be <= {MAX_SUMMARY_LEN} characters"));
    }
    if description.len() > MAX_DESCRIPTION_LEN {
        return Err("description too long".into());
    }
    if categories.len() > MAX_CATEGORIES {
        return Err(format!("at most {MAX_CATEGORIES} categories"));
    }
    if tags.len() > MAX_TAGS {
        return Err(format!("at most {MAX_TAGS} tags"));
    }
    for tag in tags {
        if tag.is_empty() || tag.len() > 32 || validate_slug(&format!("t-{tag}")).is_err() {
            return Err(format!("invalid tag {tag:?}: lowercase [a-z0-9-], <= 32 chars"));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slug_rules() {
        assert!(validate_slug("my-skill").is_ok());
        assert!(validate_slug("2fast").is_ok());
        assert!(validate_slug("My-Skill").is_err());
        assert!(validate_slug("x").is_err());
        assert!(validate_slug("bad-").is_err());
        assert!(validate_slug("-bad").is_err());
        assert!(validate_slug(&"a".repeat(65)).is_err());
    }
}
