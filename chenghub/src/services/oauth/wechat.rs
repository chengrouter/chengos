//! WeChat Open Platform web login (QR-code) adapter.
//!
//! Subject = `unionid` when the app is bound to an Open Platform account
//! (stable across the vendor's apps), otherwise `openid`. WeChat reports
//! errors as `{errcode, errmsg}` bodies with HTTP 200, so every response is
//! checked for `errcode` before parsing the success shape.

use std::collections::HashMap;

use async_trait::async_trait;
use serde::Deserialize;

use crate::config::OAuthProviderConfig;
use crate::domain::identity::{AuthProvider, ExternalUserProfile};
use crate::error::Result;

use super::{provider_error, OAuthProviderAdapter, ProviderSession};

const AUTHORIZE_URL: &str = "https://open.weixin.qq.com/connect/qrconnect";
const TOKEN_URL: &str = "https://api.weixin.qq.com/sns/oauth2/access_token";
const USERINFO_URL: &str = "https://api.weixin.qq.com/sns/userinfo";

pub struct WechatProvider {
    config: OAuthProviderConfig,
    http: reqwest::Client,
}

impl WechatProvider {
    pub fn new(config: OAuthProviderConfig, http: reqwest::Client) -> Self {
        Self { config, http }
    }
}

#[derive(Deserialize)]
struct WechatError {
    errcode: Option<i64>,
    errmsg: Option<String>,
}

#[derive(Deserialize)]
struct WechatToken {
    access_token: String,
    openid: String,
    unionid: Option<String>,
}

#[derive(Deserialize)]
struct WechatUserInfo {
    openid: String,
    nickname: Option<String>,
    headimgurl: Option<String>,
    unionid: Option<String>,
    country: Option<String>,
    province: Option<String>,
    city: Option<String>,
}

fn parse_wechat<T: serde::de::DeserializeOwned>(raw: &str, context: &str) -> Result<T> {
    if let Ok(err) = serde_json::from_str::<WechatError>(raw) {
        if let Some(code) = err.errcode {
            if code != 0 {
                return Err(provider_error(
                    AuthProvider::Wechat,
                    context,
                    format!("errcode {code}: {}", err.errmsg.unwrap_or_default()),
                ));
            }
        }
    }
    serde_json::from_str(raw).map_err(|e| provider_error(AuthProvider::Wechat, context, e))
}

#[async_trait]
impl OAuthProviderAdapter for WechatProvider {
    fn provider(&self) -> AuthProvider {
        AuthProvider::Wechat
    }

    /// WeChat's web login flow has no PKCE support.
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
            ("appid", self.config.client_id.as_str()),
            ("redirect_uri", redirect_uri),
            ("response_type", "code"),
            ("scope", "snsapi_login"),
            ("state", state),
        ])
        .expect("static params encode");
        // The fragment is required by WeChat's docs.
        format!("{AUTHORIZE_URL}?{query}#wechat_redirect")
    }

    async fn exchange_code(
        &self,
        code: &str,
        _redirect_uri: &str,
        _pkce_verifier: Option<&str>,
    ) -> Result<ProviderSession> {
        let raw = self
            .http
            .get(TOKEN_URL)
            .query(&[
                ("appid", self.config.client_id.as_str()),
                ("secret", self.config.client_secret.expose()),
                ("code", code),
                ("grant_type", "authorization_code"),
            ])
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Wechat, "token", e))?
            .text()
            .await
            .map_err(|e| provider_error(AuthProvider::Wechat, "token-read", e))?;
        let token: WechatToken = parse_wechat(&raw, "token-parse")?;

        let mut extras = HashMap::new();
        extras.insert("openid".to_string(), token.openid);
        if let Some(unionid) = token.unionid {
            extras.insert("unionid".to_string(), unionid);
        }
        Ok(ProviderSession { access_token: token.access_token, extras })
    }

    async fn fetch_user_profile(&self, session: &ProviderSession) -> Result<ExternalUserProfile> {
        let openid = session.extras.get("openid").cloned().ok_or_else(|| {
            provider_error(AuthProvider::Wechat, "userinfo", "missing openid from token exchange")
        })?;
        let raw = self
            .http
            .get(USERINFO_URL)
            .query(&[
                ("access_token", session.access_token.as_str()),
                ("openid", openid.as_str()),
                ("lang", "zh_CN"),
            ])
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Wechat, "userinfo", e))?
            .text()
            .await
            .map_err(|e| provider_error(AuthProvider::Wechat, "userinfo-read", e))?;
        let info: WechatUserInfo = parse_wechat(&raw, "userinfo-parse")?;

        // unionid is the stable subject when available (same user across the
        // vendor's apps); openid otherwise.
        let unionid = info.unionid.clone().or_else(|| session.extras.get("unionid").cloned());
        let subject = unionid.clone().unwrap_or_else(|| info.openid.clone());

        Ok(ExternalUserProfile {
            provider: AuthProvider::Wechat,
            subject,
            username_hint: None,
            display_name: info.nickname.clone().filter(|n| !n.is_empty()),
            avatar_url: info.headimgurl.clone().filter(|u| !u.is_empty()),
            email: None,
            profile: serde_json::json!({
                "openid": info.openid,
                "unionid": unionid,
                "region": [info.country, info.province, info.city],
            }),
        })
    }
}
