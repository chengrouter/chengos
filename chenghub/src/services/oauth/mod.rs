//! OAuth provider abstraction.
//!
//! Each provider adapter normalizes its wire format into
//! [`ExternalUserProfile`]; the identity domain never sees provider-specific
//! payloads. Adding a provider = one adapter + config; nothing in the
//! identity model changes (`qq.rs` exists to prove it).

pub mod github;
pub mod qq;
pub mod wechat;

use std::collections::HashMap;
use std::sync::Arc;

use async_trait::async_trait;

use crate::config::OAuthConfig;
use crate::domain::identity::{AuthProvider, ExternalUserProfile};
use crate::error::{codes, HubError, Result};

/// Provider-side session returned by the code exchange. WeChat delivers the
/// `openid` with the token, and the profile call needs both — so the
/// exchange result carries provider extras opaquely.
#[derive(Debug, Clone)]
pub struct ProviderSession {
    pub access_token: String,
    /// Provider extras required by the profile call (e.g. WeChat `openid`).
    pub extras: HashMap<String, String>,
}

#[async_trait]
pub trait OAuthProviderAdapter: Send + Sync {
    fn provider(&self) -> AuthProvider;
    /// Whether to generate and send a PKCE challenge.
    fn supports_pkce(&self) -> bool;
    /// Full browser redirect URL for the authorization step.
    fn authorization_url(
        &self,
        state: &str,
        redirect_uri: &str,
        pkce_challenge: Option<&str>,
    ) -> String;
    async fn exchange_code(
        &self,
        code: &str,
        redirect_uri: &str,
        pkce_verifier: Option<&str>,
    ) -> Result<ProviderSession>;
    async fn fetch_user_profile(&self, session: &ProviderSession) -> Result<ExternalUserProfile>;
}

/// Enabled providers keyed by name; built once in `app.rs` from config.
#[derive(Clone, Default)]
pub struct ProviderRegistry {
    providers: HashMap<AuthProvider, Arc<dyn OAuthProviderAdapter>>,
}

impl ProviderRegistry {
    pub fn from_config(config: &OAuthConfig) -> anyhow::Result<Self> {
        let mut providers: HashMap<AuthProvider, Arc<dyn OAuthProviderAdapter>> = HashMap::new();
        let http = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(config.http_timeout_secs.max(1)))
            .user_agent("chenghub/0.1")
            .build()?;
        if config.github.enabled() {
            providers.insert(
                AuthProvider::Github,
                Arc::new(github::GithubProvider::new(config.github.clone(), http.clone())),
            );
        }
        if config.wechat.enabled() {
            providers.insert(
                AuthProvider::Wechat,
                Arc::new(wechat::WechatProvider::new(config.wechat.clone(), http.clone())),
            );
        }
        if config.qq.enabled() {
            providers.insert(
                AuthProvider::Qq,
                Arc::new(qq::QqProvider::new(config.qq.clone(), http)),
            );
        }
        Ok(Self { providers })
    }

    pub fn get(&self, provider: AuthProvider) -> Result<Arc<dyn OAuthProviderAdapter>> {
        self.providers.get(&provider).cloned().ok_or_else(|| {
            HubError::validation(
                codes::PROVIDER_DISABLED,
                format!("login provider {} is not configured", provider.as_str()),
            )
        })
    }

    pub fn enabled(&self) -> Vec<AuthProvider> {
        let mut list: Vec<AuthProvider> = self.providers.keys().copied().collect();
        list.sort_by_key(|p| p.as_str());
        list
    }
}

/// Map an outbound provider failure to a stable error, never leaking the
/// provider response body into the client-facing message.
pub(crate) fn provider_error(provider: AuthProvider, context: &str, detail: impl std::fmt::Display) -> HubError {
    tracing::warn!(provider = provider.as_str(), context, error = %detail, "oauth provider call failed");
    HubError::validation(codes::OAUTH_PROVIDER_ERROR, format!("{} login failed", provider.as_str()))
}
