//! OAuth 2.0 Device Authorization Flow (RFC 8628).
//!
//! Local ChengFlow instances call `code` then poll `token`; the user
//! approves in a browser at `/device`. Polling errors use the RFC wire
//! codes: `authorization_pending`, `slow_down`, `expired_token`,
//! `access_denied`.

use std::sync::Arc;

use chrono::Utc;
use serde::Serialize;

use crate::config::DeviceFlowConfig;
use crate::domain::identity::{DeviceAuthStatus, DeviceAuthorization, TokenPair, UserId};
use crate::error::{codes, HubError, Result};
use crate::ports::identity_repository::DeviceAuthRepo;
use crate::security::token::{
    generate_token, generate_user_code, normalize_user_code, TokenHasher, DEVICE_CODE_PREFIX,
};
use crate::services::identity_service::IdentityService;
use crate::telemetry::metrics::SharedMetrics;

#[derive(Debug, Serialize)]
pub struct DeviceCodeResponse {
    pub device_code: String,
    pub user_code: String,
    pub verification_uri: String,
    pub verification_uri_complete: String,
    pub expires_in: i64,
    pub interval: i64,
}

pub struct DeviceFlowService {
    devices: Arc<dyn DeviceAuthRepo>,
    identity: Arc<IdentityService>,
    hasher: TokenHasher,
    config: DeviceFlowConfig,
    public_url: String,
    metrics: SharedMetrics,
}

impl DeviceFlowService {
    pub fn new(
        devices: Arc<dyn DeviceAuthRepo>,
        identity: Arc<IdentityService>,
        hasher: TokenHasher,
        config: DeviceFlowConfig,
        public_url: String,
        metrics: SharedMetrics,
    ) -> Self {
        Self { devices, identity, hasher, config, public_url, metrics }
    }

    /// Start a device authorization: mint device + user codes.
    pub async fn start(&self, client_name: &str) -> Result<DeviceCodeResponse> {
        let raw_device_code = generate_token(DEVICE_CODE_PREFIX);
        let scopes = vec!["community".to_string()];
        // User-code collisions are possible (short code); retry a few times.
        for _ in 0..5 {
            let user_code = normalize_user_code(&generate_user_code(self.config.user_code_length));
            match self
                .devices
                .create(
                    &self.hasher.hash(&raw_device_code),
                    &user_code,
                    client_name,
                    &scopes,
                    self.config.interval_secs as i32,
                    self.config.code_ttl_secs,
                )
                .await
            {
                Ok(auth) => {
                    self.metrics.device_flows_total.with_label_values(&["started"]).inc();
                    let base = self.public_url.trim_end_matches('/');
                    return Ok(DeviceCodeResponse {
                        device_code: raw_device_code,
                        user_code: pretty_user_code(&auth.user_code),
                        verification_uri: format!("{base}/device"),
                        verification_uri_complete: format!(
                            "{base}/device?user_code={}",
                            auth.user_code
                        ),
                        expires_in: self.config.code_ttl_secs as i64,
                        interval: self.config.interval_secs as i64,
                    });
                }
                Err(HubError::Conflict { .. }) => continue,
                Err(other) => return Err(other),
            }
        }
        Err(HubError::Internal(anyhow::anyhow!("could not allocate a unique user code")))
    }

    /// Token endpoint poll. Returns a token pair once approved; otherwise
    /// one of the RFC 8628 error codes.
    pub async fn poll(&self, raw_device_code: &str) -> Result<TokenPair> {
        if !raw_device_code.starts_with(DEVICE_CODE_PREFIX) {
            return Err(HubError::device(codes::INVALID_GRANT));
        }
        let auth = self
            .devices
            .find_by_device_hash(&self.hasher.hash(raw_device_code))
            .await?
            .ok_or(HubError::device(codes::INVALID_GRANT))?;

        // Interval enforcement first: a fast poller gets slow_down without
        // consuming any state.
        let previous_poll = self.devices.record_poll(auth.id).await?;
        if let Some(previous) = previous_poll {
            let elapsed = (Utc::now() - previous).num_seconds();
            if elapsed < auth.interval_secs as i64 {
                return Err(HubError::device(codes::SLOW_DOWN));
            }
        }

        if auth.is_expired(Utc::now()) && auth.status == DeviceAuthStatus::Pending {
            self.devices.mark_expired(auth.id).await?;
            self.metrics.device_flows_total.with_label_values(&["expired"]).inc();
            return Err(HubError::device(codes::EXPIRED_TOKEN));
        }

        match auth.status {
            DeviceAuthStatus::Pending => Err(HubError::device(codes::AUTHORIZATION_PENDING)),
            DeviceAuthStatus::Denied => {
                self.metrics.device_flows_total.with_label_values(&["denied"]).inc();
                Err(HubError::device(codes::ACCESS_DENIED))
            }
            DeviceAuthStatus::Expired => Err(HubError::device(codes::EXPIRED_TOKEN)),
            DeviceAuthStatus::Consumed => Err(HubError::device(codes::INVALID_GRANT)),
            DeviceAuthStatus::Approved => {
                let user_id = auth.user_id.ok_or_else(|| {
                    HubError::Internal(anyhow::anyhow!("approved device auth without user"))
                })?;
                // consume() flips approved -> consumed exactly once; a lost
                // race means another poller already took the tokens.
                if !self.devices.consume(auth.id).await? {
                    return Err(HubError::device(codes::INVALID_GRANT));
                }
                let label = format!("device: {}", auth.client_name);
                let pair = self.identity.issue_token_pair(user_id, &label, &auth.scopes).await?;
                self.metrics.device_flows_total.with_label_values(&["approved"]).inc();
                Ok(pair)
            }
        }
    }

    /// Look up a user code for the approval page (no state change).
    pub async fn lookup(&self, user_code: &str) -> Result<DeviceAuthorization> {
        let normalized = normalize_user_code(user_code);
        let auth = self
            .devices
            .find_by_user_code(&normalized)
            .await?
            .ok_or(HubError::NotFound("device authorization"))?;
        Ok(auth)
    }

    /// Approve from the browser (session-authenticated user).
    pub async fn approve(&self, user_code: &str, user_id: UserId) -> Result<()> {
        let auth = self.lookup(user_code).await?;
        if auth.is_expired(Utc::now()) {
            self.devices.mark_expired(auth.id).await?;
            return Err(HubError::invalid_state(codes::EXPIRED_TOKEN, "code expired"));
        }
        if !self.devices.approve(auth.id, user_id).await? {
            return Err(HubError::invalid_state(
                codes::INVALID_GRANT,
                "code is no longer pending",
            ));
        }
        Ok(())
    }

    pub async fn deny(&self, user_code: &str) -> Result<()> {
        let auth = self.lookup(user_code).await?;
        if !self.devices.deny(auth.id).await? {
            return Err(HubError::invalid_state(
                codes::INVALID_GRANT,
                "code is no longer pending",
            ));
        }
        Ok(())
    }
}

/// Group a normalized code as XXXX-XXXX for display.
fn pretty_user_code(code: &str) -> String {
    let mut out = String::with_capacity(code.len() + code.len() / 4);
    for (i, c) in code.chars().enumerate() {
        if i > 0 && i % 4 == 0 {
            out.push('-');
        }
        out.push(c);
    }
    out
}
