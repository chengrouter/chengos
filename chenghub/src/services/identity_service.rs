//! Identity service: OAuth login, account linking, sessions, tokens, roles,
//! and banned-user enforcement.
//!
//! Create-or-link semantics:
//! * provider subject exists -> log in the mapped user;
//! * browser already authenticated + new subject -> link to current user;
//! * new subject, no session -> create a new ChengHub user.

use std::sync::Arc;

use crate::config::{AdminConfig, CookieConfig, OAuthConfig, TokenConfig};
use crate::domain::identity::{
    AccessToken, AuthProvider, ChengHubUser, ExternalIdentity, ExternalUserProfile, IdentityId,
    TokenId, TokenPair, UserId,
};
use crate::domain::moderation::{AuditActorType, NewAuditEvent};
use crate::domain::roles::{Role, RoleSet};
use crate::error::{codes, HubError, Result};
use crate::ports::identity_repository::{IdentityRepo, SessionRepo, TokenRepo, UserRepo};
use crate::security::oauth_state::{
    generate_pkce, generate_state, OAuthStateStore, PendingOAuthState,
};
use crate::security::token::{
    generate_token, TokenHasher, ACCESS_TOKEN_PREFIX, REFRESH_TOKEN_PREFIX, SESSION_PREFIX,
};
use crate::services::oauth::ProviderRegistry;
use crate::telemetry::metrics::SharedMetrics;

/// How the principal authenticated; some operations are cookie-only.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AuthVia {
    Session,
    Bearer,
}

/// Authenticated principal attached to a request.
#[derive(Clone)]
pub struct AuthContext {
    pub user: ChengHubUser,
    pub roles: RoleSet,
    pub via: AuthVia,
}

impl AuthContext {
    /// Guard for write operations: banned users read but never write.
    pub fn ensure_can_write(&self) -> Result<()> {
        if self.user.is_banned() {
            return Err(HubError::banned());
        }
        Ok(())
    }
}

/// Result of an OAuth callback.
pub struct LoginOutcome {
    pub user: ChengHubUser,
    /// Raw session token for the cookie. `None` when the callback only
    /// linked an identity to an existing session.
    pub session_token: Option<String>,
    pub return_to: String,
    pub linked: bool,
}

pub struct IdentityService {
    users: Arc<dyn UserRepo>,
    identities: Arc<dyn IdentityRepo>,
    sessions: Arc<dyn SessionRepo>,
    tokens: Arc<dyn TokenRepo>,
    providers: ProviderRegistry,
    state_store: Arc<dyn OAuthStateStore>,
    hasher: TokenHasher,
    oauth_config: OAuthConfig,
    cookie_config: CookieConfig,
    token_config: TokenConfig,
    admin_config: AdminConfig,
    public_url: String,
    metrics: SharedMetrics,
}

impl IdentityService {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        users: Arc<dyn UserRepo>,
        identities: Arc<dyn IdentityRepo>,
        sessions: Arc<dyn SessionRepo>,
        tokens: Arc<dyn TokenRepo>,
        providers: ProviderRegistry,
        state_store: Arc<dyn OAuthStateStore>,
        hasher: TokenHasher,
        oauth_config: OAuthConfig,
        cookie_config: CookieConfig,
        token_config: TokenConfig,
        admin_config: AdminConfig,
        public_url: String,
        metrics: SharedMetrics,
    ) -> Self {
        Self {
            users,
            identities,
            sessions,
            tokens,
            providers,
            state_store,
            hasher,
            oauth_config,
            cookie_config,
            token_config,
            admin_config,
            public_url,
            metrics,
        }
    }

    pub fn enabled_providers(&self) -> Vec<AuthProvider> {
        self.providers.enabled()
    }

    fn redirect_uri(&self, provider: AuthProvider) -> String {
        format!(
            "{}/api/v1/auth/{}/callback",
            self.public_url.trim_end_matches('/'),
            provider.as_str()
        )
    }

    /// Validate a client-supplied return target: a local path, or an
    /// absolute URL whose origin is allow-listed.
    fn validate_return_to(&self, raw: Option<&str>) -> String {
        let fallback = self.oauth_config.default_return_to.clone();
        let Some(raw) = raw.map(str::trim).filter(|s| !s.is_empty()) else {
            return fallback;
        };
        // Local path: allow, but refuse protocol-relative `//host` tricks.
        if raw.starts_with('/') && !raw.starts_with("//") {
            return raw.to_string();
        }
        if self
            .oauth_config
            .allowed_return_origins
            .iter()
            .any(|origin| raw.starts_with(origin.trim_end_matches('/')))
        {
            return raw.to_string();
        }
        fallback
    }

    /// Begin a provider login: create state (+ PKCE when supported), stash
    /// it, and return the provider redirect URL.
    pub async fn start_login(
        &self,
        provider: AuthProvider,
        return_to: Option<&str>,
        link_user_id: Option<UserId>,
    ) -> Result<String> {
        let adapter = self.providers.get(provider)?;
        let state = generate_state();
        let pkce = adapter.supports_pkce().then(generate_pkce);
        let pending = PendingOAuthState {
            provider: provider.as_str().to_string(),
            return_to: self.validate_return_to(return_to),
            link_user_id,
            pkce_verifier: pkce.as_ref().map(|p| p.verifier.clone()),
            created_at: chrono::Utc::now(),
        };
        self.state_store
            .put(&state, &pending, self.oauth_config.state_ttl_secs)
            .await?;
        Ok(adapter.authorization_url(
            &state,
            &self.redirect_uri(provider),
            pkce.as_ref().map(|p| p.challenge.as_str()),
        ))
    }

    /// Complete a provider callback: validate state, exchange the code,
    /// normalize the profile, and create/link/login.
    pub async fn complete_login(
        &self,
        provider: AuthProvider,
        state: &str,
        code: &str,
        session_user: Option<UserId>,
    ) -> Result<LoginOutcome> {
        let pending = self
            .state_store
            .take(state)
            .await?
            .filter(|p| p.provider == provider.as_str())
            .ok_or_else(|| {
                HubError::validation(codes::OAUTH_STATE_INVALID, "login state is invalid or expired")
            })?;

        let adapter = self.providers.get(provider)?;
        let session = adapter
            .exchange_code(code, &self.redirect_uri(provider), pending.pkce_verifier.as_deref())
            .await
            .inspect_err(|_| {
                self.metrics
                    .provider_errors_total
                    .with_label_values(&[provider.as_str()])
                    .inc();
            })?;
        let profile = adapter.fetch_user_profile(&session).await.inspect_err(|_| {
            self.metrics
                .provider_errors_total
                .with_label_values(&[provider.as_str()])
                .inc();
        })?;

        // The link target must be the user who started the link flow AND
        // still be the user in the browser session.
        let link_target = match (pending.link_user_id, session_user) {
            (Some(intended), Some(current)) if intended == current => Some(intended),
            _ => None,
        };

        let (user, linked) = self.create_or_link(&profile, link_target).await?;
        self.metrics
            .logins_total
            .with_label_values(&[provider.as_str(), if linked { "linked" } else { "login" }])
            .inc();

        // Linking keeps the existing session; login/create mints a new one.
        let session_token = if linked {
            None
        } else {
            Some(self.create_session(user.id, None, None).await?)
        };

        Ok(LoginOutcome { user, session_token, return_to: pending.return_to, linked })
    }

    async fn create_or_link(
        &self,
        profile: &ExternalUserProfile,
        link_target: Option<UserId>,
    ) -> Result<(ChengHubUser, bool)> {
        if let Some(existing) = self
            .identities
            .find_by_subject(profile.provider, &profile.subject)
            .await?
        {
            // Known identity: refresh profile fields, log the mapped user in.
            self.identities.touch_login(existing.id, profile).await?;
            let user = self
                .users
                .get(existing.user_id)
                .await?
                .ok_or(HubError::NotFound("user"))?;
            return Ok((user, false));
        }

        if let Some(user_id) = link_target {
            // Authenticated browser linking a new identity.
            let user = self.users.get(user_id).await?.ok_or(HubError::NotFound("user"))?;
            self.identities.link_identity(user_id, profile).await?;
            return Ok((user, true));
        }

        // Brand-new user.
        let user = self.create_user_from_profile(profile).await?;
        self.bootstrap_admin_if_configured(&user).await?;
        Ok((user, false))
    }

    /// Create a user with a de-duplicated username derived from the profile.
    async fn create_user_from_profile(&self, profile: &ExternalUserProfile) -> Result<ChengHubUser> {
        let base = derive_username(profile);
        for attempt in 0..6 {
            let candidate = match attempt {
                0 => base.clone(),
                1..=3 => format!("{base}-{}", attempt + 1),
                _ => format!("{base}-{}", &generate_token("")[..6]),
            };
            match self
                .identities
                .create_user_with_identity(&candidate, profile)
                .await
            {
                Ok((user, _identity)) => return Ok(user),
                Err(HubError::Conflict { .. }) => continue,
                Err(other) => return Err(other),
            }
        }
        Err(HubError::Internal(anyhow::anyhow!("could not allocate a unique username")))
    }

    async fn bootstrap_admin_if_configured(&self, user: &ChengHubUser) -> Result<()> {
        if !self
            .admin_config
            .bootstrap_admin_usernames
            .iter()
            .any(|u| u == &user.username)
        {
            return Ok(());
        }
        self.users
            .grant_role(
                user.id,
                Role::Admin,
                None,
                NewAuditEvent {
                    actor_type: AuditActorType::System,
                    actor: "bootstrap".into(),
                    action: "role.grant".into(),
                    subject_type: "user".into(),
                    subject_id: user.id.to_string(),
                    details: serde_json::json!({ "role": "admin", "via": "bootstrap_config" }),
                    request_id: None,
                },
            )
            .await?;
        Ok(())
    }

    // --- Sessions ----------------------------------------------------------

    /// Mint a browser session; returns the raw cookie value.
    pub async fn create_session(
        &self,
        user_id: UserId,
        user_agent: Option<&str>,
        ip: Option<&str>,
    ) -> Result<String> {
        let raw = generate_token(SESSION_PREFIX);
        self.sessions
            .create(
                user_id,
                &self.hasher.hash(&raw),
                self.cookie_config.session_ttl_secs,
                user_agent,
                ip,
            )
            .await?;
        Ok(raw)
    }

    pub async fn authenticate_session(&self, raw_cookie: &str) -> Result<Option<AuthContext>> {
        if !raw_cookie.starts_with(SESSION_PREFIX) {
            return Ok(None);
        }
        let session = self
            .sessions
            .find_valid(&self.hasher.hash(raw_cookie), self.cookie_config.session_ttl_secs)
            .await?;
        let Some(session) = session else { return Ok(None) };
        let Some(user) = self.users.get(session.user_id).await? else {
            return Ok(None);
        };
        let roles = self.users.roles(user.id).await?;
        Ok(Some(AuthContext { user, roles, via: AuthVia::Session }))
    }

    pub async fn authenticate_bearer(&self, raw_token: &str) -> Result<Option<AuthContext>> {
        if !raw_token.starts_with(ACCESS_TOKEN_PREFIX) {
            return Ok(None);
        }
        let token = self.tokens.find_valid_access(&self.hasher.hash(raw_token)).await?;
        let Some(token) = token else { return Ok(None) };
        let Some(user) = self.users.get(token.user_id).await? else {
            return Ok(None);
        };
        let roles = self.users.roles(user.id).await?;
        Ok(Some(AuthContext { user, roles, via: AuthVia::Bearer }))
    }

    pub async fn logout(&self, raw_cookie: &str) -> Result<()> {
        self.sessions.revoke(&self.hasher.hash(raw_cookie)).await?;
        Ok(())
    }

    // --- External identities -------------------------------------------------

    pub async fn list_identities(&self, user_id: UserId) -> Result<Vec<ExternalIdentity>> {
        self.identities.list_for_user(user_id).await
    }

    /// Unbinding the last identity would lock the user out permanently.
    pub async fn unlink_identity(&self, user_id: UserId, identity_id: IdentityId) -> Result<()> {
        if self.identities.count_for_user(user_id).await? <= 1 {
            return Err(HubError::invalid_state(
                codes::LAST_IDENTITY,
                "cannot unbind the last login identity",
            ));
        }
        if !self.identities.unlink(user_id, identity_id).await? {
            return Err(HubError::NotFound("identity"));
        }
        Ok(())
    }

    // --- Tokens ---------------------------------------------------------------

    /// Issue a fresh access+refresh pair (device flow approval and manual
    /// token creation share this path).
    pub async fn issue_token_pair(
        &self,
        user_id: UserId,
        label: &str,
        scopes: &[String],
    ) -> Result<TokenPair> {
        let raw_access = generate_token(ACCESS_TOKEN_PREFIX);
        let raw_refresh = generate_token(REFRESH_TOKEN_PREFIX);
        let (access, _refresh) = self
            .tokens
            .issue_pair(
                user_id,
                label,
                scopes,
                &self.hasher.hash(&raw_access),
                &self.hasher.hash(&raw_refresh),
                self.token_config.access_ttl_secs,
                self.token_config.refresh_ttl_secs,
            )
            .await?;
        self.metrics.tokens_issued_total.with_label_values(&["access"]).inc();
        Ok(TokenPair {
            access_token: raw_access,
            token_type: "Bearer",
            expires_in: self.token_config.access_ttl_secs as i64,
            refresh_token: raw_refresh,
            scope: access.scopes.join(" "),
        })
    }

    /// Rotate a refresh token. Banned users may not refresh (their access
    /// tokens keep read-only semantics until expiry; no new leases).
    pub async fn refresh(&self, raw_refresh: &str) -> Result<TokenPair> {
        if !raw_refresh.starts_with(REFRESH_TOKEN_PREFIX) {
            return Err(HubError::device(codes::INVALID_GRANT));
        }
        let new_access = generate_token(ACCESS_TOKEN_PREFIX);
        let new_refresh = generate_token(REFRESH_TOKEN_PREFIX);
        let rotated = self
            .tokens
            .rotate_refresh(
                &self.hasher.hash(raw_refresh),
                &self.hasher.hash(&new_access),
                &self.hasher.hash(&new_refresh),
                self.token_config.access_ttl_secs,
                self.token_config.refresh_ttl_secs,
            )
            .await?;
        let Some((access, _)) = rotated else {
            return Err(HubError::device(codes::INVALID_GRANT));
        };
        if let Some(user) = self.users.get(access.user_id).await? {
            if user.is_banned() {
                // Undo nothing: the old token is already revoked, which is
                // the correct outcome for a banned account.
                return Err(HubError::banned());
            }
        }
        self.metrics.tokens_issued_total.with_label_values(&["refresh"]).inc();
        Ok(TokenPair {
            access_token: new_access,
            token_type: "Bearer",
            expires_in: self.token_config.access_ttl_secs as i64,
            refresh_token: new_refresh,
            scope: access.scopes.join(" "),
        })
    }

    pub async fn list_tokens(&self, user_id: UserId) -> Result<Vec<AccessToken>> {
        self.tokens.list_access_for_user(user_id).await
    }

    pub async fn revoke_token(&self, user_id: UserId, token_id: TokenId) -> Result<()> {
        if !self.tokens.revoke_access(user_id, token_id).await? {
            return Err(HubError::NotFound("token"));
        }
        Ok(())
    }

    /// Device logout: revoke the refresh token (and its paired access token).
    pub async fn revoke_refresh(&self, raw_refresh: &str) -> Result<bool> {
        self.tokens.revoke_refresh(&self.hasher.hash(raw_refresh)).await
    }

    pub async fn roles_of(&self, user_id: UserId) -> Result<RoleSet> {
        self.users.roles(user_id).await
    }
}

/// Derive a username candidate from the provider profile: lowercase ASCII
/// alphanumerics/dash/underscore, trimmed to 30 chars, defaulting to "user".
fn derive_username(profile: &ExternalUserProfile) -> String {
    let source = profile
        .username_hint
        .as_deref()
        .or(profile.display_name.as_deref())
        .unwrap_or("user");
    let mut name: String = source
        .to_lowercase()
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_')
        .take(30)
        .collect();
    name = name.trim_matches(|c| c == '-' || c == '_').to_string();
    if name.is_empty() || !name.chars().next().unwrap().is_ascii_alphanumeric() {
        name = format!("{}-user", profile.provider.as_str());
    }
    name
}

#[cfg(test)]
mod tests {
    use super::*;

    fn profile(hint: Option<&str>, display: Option<&str>) -> ExternalUserProfile {
        ExternalUserProfile {
            provider: AuthProvider::Wechat,
            subject: "s".into(),
            username_hint: hint.map(String::from),
            display_name: display.map(String::from),
            avatar_url: None,
            email: None,
            profile: serde_json::Value::Null,
        }
    }

    #[test]
    fn username_derivation() {
        assert_eq!(derive_username(&profile(Some("Alice"), None)), "alice");
        // Pure CJK nickname falls back to a provider-derived name.
        assert_eq!(derive_username(&profile(None, Some("张三"))), "wechat-user");
        assert_eq!(derive_username(&profile(Some("--x--"), None)), "x");
    }
}
