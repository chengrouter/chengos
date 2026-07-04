//! Sanitized workflow sharing domain.
//!
//! Payloads arrive from local ChengFlow instances that already ran the
//! sanitizer; the server re-validates and refuses payloads with residual
//! secret material.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::identity::UserId;

pub type WorkflowShareId = Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RequiredVariableKind {
    Credential,
    Env,
    Variable,
}

impl RequiredVariableKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Credential => "credential",
            Self::Env => "env",
            Self::Variable => "variable",
        }
    }
    pub fn parse(s: &str) -> Option<Self> {
        Some(match s {
            "credential" => Self::Credential,
            "env" => Self::Env,
            "variable" => Self::Variable,
            _ => return None,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RequiredVariable {
    pub name: String,
    pub kind: RequiredVariableKind,
    #[serde(default)]
    pub description: String,
    #[serde(default = "default_true")]
    pub required: bool,
}

fn default_true() -> bool {
    true
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SafetyFinding {
    /// e.g. "credential_removed", "env_path_redacted", "webhook_url_removed".
    pub kind: String,
    /// "info" | "warning".
    #[serde(default = "default_severity")]
    pub severity: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
}

fn default_severity() -> String {
    "info".into()
}

#[derive(Debug, Clone)]
pub struct WorkflowShare {
    pub id: WorkflowShareId,
    pub owner_id: UserId,
    pub title: String,
    pub summary: String,
    pub payload: serde_json::Value,
    pub node_types: Vec<String>,
    pub node_count: i32,
    pub compat_version: String,
    pub sanitizer_version: String,
    pub hidden_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Creation payload as submitted by the local ChengFlow proxy.
#[derive(Debug, Clone, Deserialize)]
pub struct NewWorkflowShare {
    pub title: String,
    #[serde(default)]
    pub summary: String,
    pub payload: serde_json::Value,
    #[serde(default)]
    pub node_types: Vec<String>,
    #[serde(default)]
    pub node_count: i32,
    #[serde(default = "default_version")]
    pub compat_version: String,
    #[serde(default = "default_version")]
    pub sanitizer_version: String,
    #[serde(default)]
    pub required_variables: Vec<RequiredVariable>,
    #[serde(default)]
    pub safety_findings: Vec<SafetyFinding>,
}

fn default_version() -> String {
    "1".into()
}
