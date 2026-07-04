//! Moderation domain: reports, bans, moderation actions, audit events.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::identity::UserId;

pub type ReportId = Uuid;
pub type BanId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReportSubjectType {
    Post,
    Comment,
}

impl ReportSubjectType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Post => "post",
            Self::Comment => "comment",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "post" => Self::Post,
            "comment" => Self::Comment,
            _ => return None,
        })
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReportReason {
    Spam,
    Abuse,
    Illegal,
    Sensitive,
    OffTopic,
    Other,
}

impl ReportReason {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Spam => "spam",
            Self::Abuse => "abuse",
            Self::Illegal => "illegal",
            Self::Sensitive => "sensitive",
            Self::OffTopic => "off_topic",
            Self::Other => "other",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "spam" => Self::Spam,
            "abuse" => Self::Abuse,
            "illegal" => Self::Illegal,
            "sensitive" => Self::Sensitive,
            "off_topic" => Self::OffTopic,
            "other" => Self::Other,
            _ => return None,
        })
    }
}

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
        Some(match s {
            "open" => Self::Open,
            "resolved" => Self::Resolved,
            "dismissed" => Self::Dismissed,
            _ => return None,
        })
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct Report {
    pub id: ReportId,
    pub reporter_id: UserId,
    pub subject_type: ReportSubjectType,
    pub subject_id: Uuid,
    pub reason: ReportReason,
    pub detail: String,
    pub status: ReportStatus,
    pub created_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
    pub resolved_by: Option<UserId>,
    pub resolution_note: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct UserBan {
    pub id: BanId,
    pub user_id: UserId,
    pub banned_by: Option<UserId>,
    pub reason: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub lifted_at: Option<DateTime<Utc>>,
    pub lifted_by: Option<UserId>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AuditActorType {
    User,
    Moderator,
    Operator,
    Admin,
    System,
    Cli,
}

impl AuditActorType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::User => "user",
            Self::Moderator => "moderator",
            Self::Operator => "operator",
            Self::Admin => "admin",
            Self::System => "system",
            Self::Cli => "cli",
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct AuditEvent {
    pub id: i64,
    pub actor_type: String,
    pub actor: String,
    pub action: String,
    pub subject_type: String,
    pub subject_id: String,
    pub details: serde_json::Value,
    pub request_id: Option<String>,
    pub created_at: DateTime<Utc>,
}

/// Payload for writing a new audit event (always inside the same transaction
/// as the change it records).
#[derive(Debug, Clone)]
pub struct NewAuditEvent {
    pub actor_type: AuditActorType,
    pub actor: String,
    pub action: String,
    pub subject_type: String,
    pub subject_id: String,
    pub details: serde_json::Value,
    pub request_id: Option<String>,
}
