//! GitHub OAuth adapter (web application flow).
//!
//! Subject = the numeric GitHub user id (stable across renames). When the
//! public profile has no email, the `/user/emails` endpoint is consulted
//! (requires the `user:email` scope requested at authorization).

use std::collections::HashMap;

use async_trait::async_trait;
use serde::Deserialize;

use crate::config::OAuthProviderConfig;
use crate::domain::identity::{AuthProvider, ExternalUserProfile};
use crate::error::Result;

use super::{provider_error, OAuthProviderAdapter, ProviderSession};

const AUTHORIZE_URL: &str = "https://github.com/login/oauth/authorize";
const TOKEN_URL: &str = "https://github.com/login/oauth/access_token";
const USER_URL: &str = "https://api.github.com/user";
const EMAILS_URL: &str = "https://api.github.com/user/emails";

pub struct GithubProvider {
    config: OAuthProviderConfig,
    http: reqwest::Client,
}

impl GithubProvider {
    pub fn new(config: OAuthProviderConfig, http: reqwest::Client) -> Self {
        Self { config, http }
    }
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: Option<String>,
    error: Option<String>,
    error_description: Option<String>,
}

#[derive(Deserialize)]
struct GithubUser {
    id: i64,
    login: String,
    name: Option<String>,
    email: Option<String>,
    avatar_url: Option<String>,
    html_url: Option<String>,
}

#[derive(Deserialize)]
struct GithubEmail {
    email: String,
    primary: bool,
    verified: bool,
}

#[async_trait]
impl OAuthProviderAdapter for GithubProvider {
    fn provider(&self) -> AuthProvider {
        AuthProvider::Github
    }

    fn supports_pkce(&self) -> bool {
        true
    }

    fn authorization_url(
        &self,
        state: &str,
        redirect_uri: &str,
        pkce_challenge: Option<&str>,
    ) -> String {
        let mut params = vec![
            ("client_id", self.config.client_id.as_str()),
            ("redirect_uri", redirect_uri),
            ("state", state),
            ("scope", "read:user user:email"),
        ];
        if let Some(challenge) = pkce_challenge {
            params.push(("code_challenge", challenge));
            params.push(("code_challenge_method", "S256"));
        }
        let query = serde_urlencoded::to_string(params).expect("static params encode");
        format!("{AUTHORIZE_URL}?{query}")
    }

    async fn exchange_code(
        &self,
        code: &str,
        redirect_uri: &str,
        pkce_verifier: Option<&str>,
    ) -> Result<ProviderSession> {
        let mut form = vec![
            ("client_id", self.config.client_id.as_str()),
            ("client_secret", self.config.client_secret.expose()),
            ("code", code),
            ("redirect_uri", redirect_uri),
        ];
        if let Some(verifier) = pkce_verifier {
            form.push(("code_verifier", verifier));
        }
        let response = self
            .http
            .post(TOKEN_URL)
            .header(reqwest::header::ACCEPT, "application/json")
            .form(&form)
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Github, "token", e))?;
        let token: TokenResponse = response
            .json()
            .await
            .map_err(|e| provider_error(AuthProvider::Github, "token-parse", e))?;
        if let Some(err) = token.error {
            let detail = token.error_description.unwrap_or_default();
            return Err(provider_error(
                AuthProvider::Github,
                "token-error",
                format!("{err}: {detail}"),
            ));
        }
        let access_token = token.access_token.ok_or_else(|| {
            provider_error(AuthProvider::Github, "token-missing", "no access_token in response")
        })?;
        Ok(ProviderSession { access_token, extras: HashMap::new() })
    }

    async fn fetch_user_profile(&self, session: &ProviderSession) -> Result<ExternalUserProfile> {
        let user: GithubUser = self
            .http
            .get(USER_URL)
            .bearer_auth(&session.access_token)
            .header(reqwest::header::ACCEPT, "application/vnd.github+json")
            .send()
            .await
            .map_err(|e| provider_error(AuthProvider::Github, "user", e))?
            .error_for_status()
            .map_err(|e| provider_error(AuthProvider::Github, "user-status", e))?
            .json()
            .await
            .map_err(|e| provider_error(AuthProvider::Github, "user-parse", e))?;

        // The public profile email is often unset; fall back to the primary
        // verified address from the emails endpoint.
        let email = match user.email {
            Some(email) if !email.is_empty() => Some(email),
            _ => self.fetch_primary_email(&session.access_token).await,
        };

        Ok(ExternalUserProfile {
            provider: AuthProvider::Github,
            subject: user.id.to_string(),
            username_hint: Some(user.login.clone()),
            display_name: user.name.clone().filter(|n| !n.is_empty()).or(Some(user.login.clone())),
            avatar_url: user.avatar_url,
            email,
            profile: serde_json::json!({ "login": user.login, "html_url": user.html_url }),
        })
    }
}

impl GithubProvider {
    /// Best-effort: a failure here degrades to "no email", never fails login.
    async fn fetch_primary_email(&self, access_token: &str) -> Option<String> {
        let emails: Vec<GithubEmail> = self
            .http
            .get(EMAILS_URL)
            .bearer_auth(access_token)
            .header(reqwest::header::ACCEPT, "application/vnd.github+json")
            .send()
            .await
            .ok()?
            .error_for_status()
            .ok()?
            .json()
            .await
            .ok()?;
        emails
            .iter()
            .find(|e| e.primary && e.verified)
            .or_else(|| emails.iter().find(|e| e.verified))
            .map(|e| e.email.clone())
    }
}
