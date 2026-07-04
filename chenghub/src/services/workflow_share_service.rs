//! Workflow share storage and server-side sanitization validation.
//!
//! The local ChengFlow sanitizer is the first line of defense; this service
//! is the second: payloads that still contain obvious secret material are
//! rejected with `SHARE_SECRET_DETECTED`, and structurally invalid payloads
//! with `SHARE_PAYLOAD_INVALID`. Public reads only ever expose stored
//! (validated) content.

use std::sync::Arc;

use regex::Regex;

use crate::config::ContentLimitsConfig;
use crate::domain::post::ViewerContext;
use crate::domain::workflow_share::{
    NewWorkflowShare, RequiredVariable, SafetyFinding, WorkflowShare, WorkflowShareId,
};
use crate::error::{codes, HubError, Result};
use crate::ports::community_repository::WorkflowShareRepo;
use crate::services::identity_service::AuthContext;

/// Patterns for residual secret material. Deliberately high-precision:
/// false positives block legitimate shares, so each pattern targets a
/// well-known credential shape rather than generic entropy.
fn secret_patterns() -> &'static [(&'static str, Regex)] {
    use std::sync::OnceLock;
    static PATTERNS: OnceLock<Vec<(&'static str, Regex)>> = OnceLock::new();
    PATTERNS.get_or_init(|| {
        [
            ("private_key", r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
            ("aws_access_key", r"\bAKIA[0-9A-Z]{16}\b"),
            ("openai_key", r"\bsk-[A-Za-z0-9_-]{20,}\b"),
            ("anthropic_key", r"\bsk-ant-[A-Za-z0-9_-]{20,}\b"),
            ("github_token", r"\bgh[pousr]_[A-Za-z0-9]{36,}\b"),
            ("slack_token", r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b"),
            ("google_api_key", r"\bAIza[0-9A-Za-z_-]{35}\b"),
            ("jwt", r"\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),
            ("chengflow_channel_key", r"\bchk_[A-Za-z0-9]{16,}\b"),
            (
                "password_field",
                r#"(?i)"(password|passwd|secret|api_key|apikey|access_token|client_secret)"\s*:\s*"[^"${][^"]{3,}""#,
            ),
        ]
        .into_iter()
        .map(|(name, pattern)| (name, Regex::new(pattern).expect("static regex")))
        .collect()
    })
}

pub struct WorkflowShareService {
    shares: Arc<dyn WorkflowShareRepo>,
    limits: ContentLimitsConfig,
}

/// Full share view for detail responses.
pub struct ShareDetail {
    pub share: WorkflowShare,
    pub required_variables: Vec<RequiredVariable>,
    pub safety_findings: Vec<SafetyFinding>,
}

impl WorkflowShareService {
    pub fn new(shares: Arc<dyn WorkflowShareRepo>, limits: ContentLimitsConfig) -> Self {
        Self { shares, limits }
    }

    pub async fn create(&self, ctx: &AuthContext, share: NewWorkflowShare) -> Result<WorkflowShare> {
        ctx.ensure_can_write()?;
        self.validate(&share)?;
        self.shares.create(ctx.user.id, &share).await
    }

    fn validate(&self, share: &NewWorkflowShare) -> Result<()> {
        if share.title.trim().is_empty() {
            return Err(HubError::validation(codes::INVALID_PARAM, "title is required"));
        }
        let payload_text = serde_json::to_string(&share.payload)
            .map_err(|_| HubError::validation(codes::SHARE_PAYLOAD_INVALID, "payload is not JSON"))?;
        if payload_text.len() > self.limits.max_share_payload_bytes {
            return Err(HubError::validation(
                codes::BODY_TOO_LARGE,
                format!("payload exceeds {} bytes", self.limits.max_share_payload_bytes),
            ));
        }
        // Structural sanity: a sanitized workflow document must be an object
        // with a nodes collection.
        let nodes = share.payload.get("nodes");
        if !share.payload.is_object() || !nodes.map(|n| n.is_array()).unwrap_or(false) {
            return Err(HubError::validation(
                codes::SHARE_PAYLOAD_INVALID,
                "payload must be a sanitized workflow document with a nodes array",
            ));
        }
        // The local sanitizer must have run: it stamps the version it used.
        if share.sanitizer_version.trim().is_empty() {
            return Err(HubError::validation(
                codes::SHARE_UNSANITIZED,
                "payload was not produced by the workflow sanitizer",
            ));
        }
        // Residual secret scan over the serialized payload.
        for (name, pattern) in secret_patterns() {
            if pattern.is_match(&payload_text) {
                return Err(HubError::validation(
                    codes::SHARE_SECRET_DETECTED,
                    format!("payload appears to contain secret material ({name}); re-run sanitization"),
                ));
            }
        }
        Ok(())
    }

    pub async fn detail(&self, id: WorkflowShareId, viewer: &ViewerContext) -> Result<ShareDetail> {
        let share = self.shares.get(id).await?.ok_or(HubError::NotFound("workflow share"))?;
        if share.hidden_at.is_some() && !viewer.is_staff && viewer.user_id != Some(share.owner_id) {
            return Err(HubError::NotFound("workflow share"));
        }
        let required_variables = self.shares.variables(id).await?;
        let safety_findings = self.shares.findings(id).await?;
        Ok(ShareDetail { share, required_variables, safety_findings })
    }

    /// Raw sanitized payload for import.
    pub async fn payload(&self, id: WorkflowShareId, viewer: &ViewerContext) -> Result<serde_json::Value> {
        Ok(self.detail(id, viewer).await?.share.payload)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn secret_patterns_catch_common_shapes() {
        let cases = [
            "-----BEGIN RSA PRIVATE KEY-----",
            "AKIAIOSFODNN7EXAMPLE",
            "sk-abcdefghijklmnopqrstuvwx",
            "ghp_0123456789abcdefghijklmnopqrstuvwxyz",
            r#"{"api_key": "super-secret-value"}"#,
        ];
        for case in cases {
            assert!(
                secret_patterns().iter().any(|(_, p)| p.is_match(case)),
                "expected a match for {case}"
            );
        }
        // Placeholder values left by the sanitizer must NOT match.
        let sanitized = r#"{"api_key": "${CREDENTIAL:openai}"}"#;
        assert!(
            !secret_patterns().iter().any(|(_, p)| p.is_match(sanitized)),
            "sanitized placeholder should pass"
        );
    }
}
