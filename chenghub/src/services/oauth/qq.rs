//! QQ Connect adapter.
//!
//! Not enabled in V1 unless configured (config gate in `ProviderRegistry`).
//! It exists to prove the provider abstraction is not GitHub/WeChat-specific:
//! QQ's three-step dance (token as urlencoded text, then `/me` for openid,
//! then the profile call) fits the same `ProviderSession` shape.

use std::collections::HashMap;

use async_trait::async_trait;
use serde::Deserialize;

use crate::config::OAuthProviderConfig;
use crate::domain::identity::{AuthProvider, ExternalUserProfile};
use crate::error::Result;

use super::{provider_error, OAuthProviderAdapter, ProviderSession};

const AUTHORIZE_URL: &str = "https://graph.qq.com/oauth2.0/authorize";
const TOKEN_URL: &str = "https://graph.qq.com/oauth2.0/token";
const ME_URL: &str = "https://graph.qq.com/oauth2.0/me";
const USERINFO_URL: &str = "https://graph.qq.com/user/get_user_info";

pub struct QqProvider {
    config: OAuthProviderConfig,
    http: reqwest::Client,
}

impl QqProvider {
    pub fn new(config: OAuthProviderConfig, http: reqwest::Client) -> Self {
        Self { config, http }
    }
}

#[derive(Deserialize)]
struct QqMe {
    openid: String,
}

#[derive(Deserialize)]
struct QqUserInfo {
    ret: i64,
    msg: Option<String>,
    nickname: Option<String>,
    #[serde(rename = "figureurl_qq_2")]
    figureurl_qq_2: Option<String>,
    #[serde(rename = "figureurl_qq_1")]
    figureurl_qq_1: Option<String>,
}

#[async_trait]
impl OAuthProviderAdapter for QqProvider {
    fn provider(&self) -> AuthProvider {
        AuthProvider::Qq
    }

    fn supports_pkce(&self) -> bool {
        false
    }

    fn authorization_url(
        &self,
        state: &str,
        redirect_uri: &str,
        _pkce_challenge: Option<&str>,
    ) -> String {
        let query = serde_urlencoded::to_string([
            ("response_type", "code"),
            ("client_id", self.config.client_id.as_str()),
            ("redirect_uri", redirect_uri),
            ("state", state),
        ])
        .expect("static params encode");
        format!("{AUTHORIZE_URL}?{query}")
    }

    async fn exchange_code(
        &self,
        code: &str,
        redirect_uri: &str,
        _pkce_verifier: Option<&str>,
    ) -> Result<ProviderSession> {
        // QQ answers `access_token=..&expires_in=..` as urlencoded text
        // (JSON only with fmt=json on newer endpoints; parse both).
        let raw = self
            .http
            .get(TOKEN_URL)
            .query(&[
                ("grant_type", "authorization_code"),
                ("client_id", self.config.client_id.as_str()),
                ("client_secret", self.config.client_secret.expose()),
                ("code", code),
                ("redirect_uri", redirect_uri),
                ("fmt", "json"),
            ])
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Qq, "token", e))?
            .text()
            .await
            .map_err(|e| provider_error(AuthProvider::Qq, "token-read", e))?;

        let access_token = serde_json::from_str::<serde_json::Value>(&raw)
            .ok()
            .and_then(|v| v.get("access_token").and_then(|t| t.as_str()).map(String::from))
            .or_else(|| {
                serde_urlencoded::from_str::<HashMap<String, String>>(&raw)
                    .ok()
                    .and_then(|m| m.get("access_token").cloned())
            })
            .ok_or_else(|| provider_error(AuthProvider::Qq, "token-parse", raw.clone()))?;

        // Resolve openid via /me.
        let me_raw = self
            .http
            .get(ME_URL)
            .query(&[("access_token", access_token.as_str()), ("fmt", "json")])
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Qq, "me", e))?
            .text()
            .await
            .map_err(|e| provider_error(AuthProvider::Qq, "me-read", e))?;
        // Legacy shape: callback( {...} );
        let me_json = me_raw
            .trim()
            .trim_start_matches("callback(")
            .trim_end_matches(");")
            .trim_end_matches(')')
            .trim();
        let me: QqMe = serde_json::from_str(me_json)
            .map_err(|e| provider_error(AuthProvider::Qq, "me-parse", e))?;

        let mut extras = HashMap::new();
        extras.insert("openid".to_string(), me.openid);
        Ok(ProviderSession { access_token, extras })
    }

    async fn fetch_user_profile(&self, session: &ProviderSession) -> Result<ExternalUserProfile> {
        let openid = session.extras.get("openid").cloned().ok_or_else(|| {
            provider_error(AuthProvider::Qq, "userinfo", "missing openid from token exchange")
        })?;
        let info: QqUserInfo = self
            .http
            .get(USERINFO_URL)
            .query(&[
                ("access_token", session.access_token.as_str()),
                ("oauth_consumer_key", self.config.client_id.as_str()),
                ("openid", openid.as_str()),
            ])
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Qq, "userinfo", e))?
            .json()
            .await
            .map_err(|e| provider_error(AuthProvider::Qq, "userinfo-parse", e))?;
        if info.ret != 0 {
            return Err(provider_error(
                AuthProvider::Qq,
                "userinfo-error",
                format!("ret {}: {}", info.ret, info.msg.unwrap_or_default()),
            ));
        }

        Ok(ExternalUserProfile {
            provider: AuthProvider::Qq,
            subject: openid.clone(),
            username_hint: None,
            display_name: info.nickname.clone().filter(|n| !n.is_empty()),
            avatar_url: info.figureurl_qq_2.or(info.figureurl_qq_1).filter(|u| !u.is_empty()),
            email: None,
            profile: serde_json::json!({ "openid": openid }),
        })
    }
}
