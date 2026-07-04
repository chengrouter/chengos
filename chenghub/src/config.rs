//! Strongly typed application configuration.
//!
//! Load order (deterministic, later wins): built-in defaults -> optional TOML
//! file (`--config` / `CHENGHUB_CONFIG`, falling back to `config/default.toml`
//! when present) -> environment variables.
//!
//! Secrets (OAuth credentials, token HMAC, database URL) are expected from
//! the environment in production; the TOML files never contain them.

use std::fmt;
use std::path::{Path, PathBuf};

use serde::Deserialize;

/// A secret string that never appears in `Debug` output or logs.
#[derive(Clone, Default, Deserialize)]
#[serde(transparent)]
pub struct Secret(String);

impl Secret {
    pub fn new(value: impl Into<String>) -> Self {
        Self(value.into())
    }
    /// Access the secret value. Call sites should be the only place the raw
    /// value is used; never format or log the result.
    pub fn expose(&self) -> &str {
        &self.0
    }
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }
}

impl fmt::Debug for Secret {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("Secret(****)")
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct ServerConfig {
    /// Listen address, e.g. "127.0.0.1:8400". Startup-only.
    pub listen: String,
    /// Public base URL served to clients, e.g. "https://hub.example.com".
    /// Used for OAuth redirect URIs and device verification URIs.
    pub public_url: String,
    /// Request timeout in seconds.
    pub request_timeout_secs: u64,
    /// Graceful shutdown budget in seconds.
    pub shutdown_timeout_secs: u64,
    /// Max JSON body size in bytes (post bodies are capped separately below).
    pub max_json_body_bytes: usize,
    /// Exact allowed CORS origins. Empty = same-origin / proxy-only deployment.
    pub cors_allowed_origins: Vec<String>,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            listen: "127.0.0.1:8400".into(),
            public_url: "http://127.0.0.1:8400".into(),
            request_timeout_secs: 30,
            shutdown_timeout_secs: 30,
            max_json_body_bytes: 256 * 1024,
            cors_allowed_origins: vec![],
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct DatabaseConfig {
    /// PostgreSQL URL. Startup-only. Required in production.
    pub url: Secret,
    pub max_connections: u32,
    pub min_connections: u32,
    pub acquire_timeout_secs: u64,
    /// `serve` refuses to start when pending migrations exist (production
    /// safety); `migrate` is the only command that applies them.
    pub require_migrations_applied: bool,
}

impl Default for DatabaseConfig {
    fn default() -> Self {
        Self {
            url: Secret::new("postgres://postgres:postgres@127.0.0.1:5432/chenghub"),
            max_connections: 16,
            min_connections: 1,
            acquire_timeout_secs: 5,
            require_migrations_applied: true,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct RedisConfig {
    /// Redis URL. Startup-only. Redis is an accelerator (rate limits, OAuth
    /// state); ChengHub keeps serving when Redis is down, with OAuth state
    /// falling back to an in-process store (single-instance only).
    pub url: Secret,
    /// When false, all Redis-backed features degrade to local fallbacks.
    pub enabled: bool,
    pub connect_timeout_secs: u64,
}

impl Default for RedisConfig {
    fn default() -> Self {
        Self {
            url: Secret::new("redis://127.0.0.1:6379/1"),
            enabled: true,
            connect_timeout_secs: 2,
        }
    }
}

/// One OAuth provider's credentials. A provider is enabled when both fields
/// are non-empty.
#[derive(Debug, Clone, Default, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct OAuthProviderConfig {
    pub client_id: String,
    pub client_secret: Secret,
}

impl OAuthProviderConfig {
    pub fn enabled(&self) -> bool {
        !self.client_id.is_empty() && !self.client_secret.is_empty()
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct OAuthConfig {
    pub github: OAuthProviderConfig,
    pub wechat: OAuthProviderConfig,
    /// QQ exists to prove the provider abstraction; disabled unless configured.
    pub qq: OAuthProviderConfig,
    /// Pending state / PKCE verifier lifetime.
    pub state_ttl_secs: u64,
    /// Where the browser lands after a completed login when no explicit
    /// `return_to` was given. Must be a path, not an absolute URL.
    pub default_return_to: String,
    /// Allowed absolute-URL return origins (for the local ChengFlow UI dev
    /// server). Paths on the ChengHub origin are always allowed.
    pub allowed_return_origins: Vec<String>,
    /// Outbound HTTP timeout for provider calls.
    pub http_timeout_secs: u64,
}

impl Default for OAuthConfig {
    fn default() -> Self {
        Self {
            github: OAuthProviderConfig::default(),
            wechat: OAuthProviderConfig::default(),
            qq: OAuthProviderConfig::default(),
            state_ttl_secs: 600,
            default_return_to: "/".into(),
            allowed_return_origins: vec![],
            http_timeout_secs: 10,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct CookieConfig {
    /// Browser session cookie name.
    pub name: String,
    /// Cookie Domain attribute; empty = host-only.
    pub domain: String,
    /// Secure flag. Must be true in production.
    pub secure: bool,
    /// Session lifetime in seconds (sliding: refreshed on activity).
    pub session_ttl_secs: u64,
}

impl Default for CookieConfig {
    fn default() -> Self {
        Self {
            name: "chghub_session".into(),
            domain: String::new(),
            secure: false,
            session_ttl_secs: 30 * 24 * 3600,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct TokenConfig {
    /// HMAC secret for hashing opaque tokens / session ids before storage.
    /// Startup-only. Required (>= 32 bytes, not the dev default) in production.
    pub hmac_secret: Secret,
    /// Access token lifetime.
    pub access_ttl_secs: u64,
    /// Refresh token lifetime.
    pub refresh_ttl_secs: u64,
}

impl Default for TokenConfig {
    fn default() -> Self {
        Self {
            hmac_secret: Secret::new("dev-only-insecure-chenghub-hmac-secret00"),
            access_ttl_secs: 2 * 3600,
            refresh_ttl_secs: 90 * 24 * 3600,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct DeviceFlowConfig {
    /// Device code lifetime.
    pub code_ttl_secs: u64,
    /// Minimum polling interval returned to clients.
    pub interval_secs: u64,
    /// User code length (excluding the group separator).
    pub user_code_length: usize,
}

impl Default for DeviceFlowConfig {
    fn default() -> Self {
        Self {
            code_ttl_secs: 900,
            interval_secs: 5,
            user_code_length: 8,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct RateLimitConfig {
    /// Requests per minute per IP for anonymous reads/search.
    pub read_per_ip_per_min: u32,
    /// Requests per minute per IP for auth endpoints (OAuth start/callback,
    /// device code issuance).
    pub auth_per_ip_per_min: u32,
    /// Posts per hour per user.
    pub posts_per_user_per_hour: u32,
    /// Comments per hour per user.
    pub comments_per_user_per_hour: u32,
    /// Reactions per minute per user (support/like/star bursts).
    pub reactions_per_user_per_min: u32,
    /// Reports per day per user.
    pub reports_per_user_per_day: u32,
    /// Workflow shares per day per user.
    pub shares_per_user_per_day: u32,
}

impl Default for RateLimitConfig {
    fn default() -> Self {
        Self {
            read_per_ip_per_min: 300,
            auth_per_ip_per_min: 30,
            posts_per_user_per_hour: 10,
            comments_per_user_per_hour: 60,
            reactions_per_user_per_min: 30,
            reports_per_user_per_day: 20,
            shares_per_user_per_day: 10,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct ContentLimitsConfig {
    /// Max title length in characters.
    pub max_title_chars: usize,
    /// Max post body size in bytes.
    pub max_post_body_bytes: usize,
    /// Max comment body size in bytes.
    pub max_comment_body_bytes: usize,
    /// Max tags per post.
    pub max_tags: usize,
    /// Max tag length in characters.
    pub max_tag_chars: usize,
    /// Max sanitized workflow share payload size in bytes.
    pub max_share_payload_bytes: usize,
}

impl Default for ContentLimitsConfig {
    fn default() -> Self {
        Self {
            max_title_chars: 200,
            max_post_body_bytes: 64 * 1024,
            max_comment_body_bytes: 8 * 1024,
            max_tags: 8,
            max_tag_chars: 32,
            max_share_payload_bytes: 512 * 1024,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct JobsConfig {
    /// Run the background cleanup loop in this process.
    pub run_jobs: bool,
    /// Cleanup sweep interval in seconds (expired sessions, device codes,
    /// tokens, OAuth states).
    pub cleanup_interval_secs: u64,
}

impl Default for JobsConfig {
    fn default() -> Self {
        Self { run_jobs: true, cleanup_interval_secs: 300 }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct AdminConfig {
    /// Usernames auto-granted the admin role on their first OAuth login.
    /// Bootstrap convenience for fresh deployments; prefer `chenghub admin
    /// grant-role` afterwards.
    pub bootstrap_admin_usernames: Vec<String>,
}

impl Default for AdminConfig {
    fn default() -> Self {
        Self { bootstrap_admin_usernames: vec![] }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct TelemetryConfig {
    /// "json" (production) or "pretty" (development). Startup-only.
    pub log_format: String,
    /// Default log filter when RUST_LOG is unset.
    pub log_filter: String,
}

impl Default for TelemetryConfig {
    fn default() -> Self {
        Self {
            log_format: "pretty".into(),
            log_filter: "info,chenghub=debug".into(),
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct AppConfig {
    /// "development" or "production". Production tightens validation.
    pub environment: String,
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub oauth: OAuthConfig,
    pub cookies: CookieConfig,
    pub tokens: TokenConfig,
    pub device: DeviceFlowConfig,
    pub rate_limit: RateLimitConfig,
    pub limits: ContentLimitsConfig,
    pub jobs: JobsConfig,
    pub admin: AdminConfig,
    pub telemetry: TelemetryConfig,
}

impl AppConfig {
    pub fn load(config_path: Option<&str>) -> anyhow::Result<Self> {
        let mut config = AppConfig {
            environment: "development".into(),
            ..Default::default()
        };

        let path = config_path.map(PathBuf::from).or_else(|| {
            let default = Path::new("config/default.toml");
            default.exists().then(|| default.to_path_buf())
        });
        if let Some(path) = path {
            let raw = std::fs::read_to_string(&path)
                .map_err(|e| anyhow::anyhow!("failed to read config file {path:?}: {e}"))?;
            config = toml::from_str(&raw)
                .map_err(|e| anyhow::anyhow!("invalid config file {path:?}: {e}"))?;
        }

        config.apply_env();
        config.validate()?;
        Ok(config)
    }

    /// Environment variable overrides. Explicit mapping keeps the surface
    /// documented and typed; see `.env.example` for the full list.
    fn apply_env(&mut self) {
        fn env(key: &str) -> Option<String> {
            std::env::var(key).ok().filter(|v| !v.is_empty())
        }

        if let Some(v) = env("CHENGHUB_ENVIRONMENT") {
            self.environment = v;
        }
        if let Some(v) = env("CHENGHUB_LISTEN") {
            self.server.listen = v;
        }
        if let Some(v) = env("CHENGHUB_PUBLIC_URL") {
            self.server.public_url = v;
        }
        if let Some(v) = env("CHENGHUB_CORS_ALLOWED_ORIGINS") {
            self.server.cors_allowed_origins = v
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect();
        }
        if let Some(v) = env("DATABASE_URL").or_else(|| env("CHENGHUB_DATABASE_URL")) {
            self.database.url = Secret::new(v);
        }
        if let Some(v) = env("REDIS_URL").or_else(|| env("CHENGHUB_REDIS_URL")) {
            self.redis.url = Secret::new(v);
        }
        if let Some(v) = env("CHENGHUB_REDIS_ENABLED") {
            self.redis.enabled = v == "true" || v == "1";
        }
        if let Some(v) = env("CHENGHUB_GITHUB_CLIENT_ID") {
            self.oauth.github.client_id = v;
        }
        if let Some(v) = env("CHENGHUB_GITHUB_CLIENT_SECRET") {
            self.oauth.github.client_secret = Secret::new(v);
        }
        if let Some(v) = env("CHENGHUB_WECHAT_APP_ID") {
            self.oauth.wechat.client_id = v;
        }
        if let Some(v) = env("CHENGHUB_WECHAT_APP_SECRET") {
            self.oauth.wechat.client_secret = Secret::new(v);
        }
        if let Some(v) = env("CHENGHUB_QQ_APP_ID") {
            self.oauth.qq.client_id = v;
        }
        if let Some(v) = env("CHENGHUB_QQ_APP_SECRET") {
            self.oauth.qq.client_secret = Secret::new(v);
        }
        if let Some(v) = env("CHENGHUB_ALLOWED_RETURN_ORIGINS") {
            self.oauth.allowed_return_origins = v
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect();
        }
        if let Some(v) = env("CHENGHUB_TOKEN_HMAC_SECRET") {
            self.tokens.hmac_secret = Secret::new(v);
        }
        if let Some(v) = env("CHENGHUB_COOKIE_DOMAIN") {
            self.cookies.domain = v;
        }
        if let Some(v) = env("CHENGHUB_COOKIE_SECURE") {
            self.cookies.secure = v == "true" || v == "1";
        }
        if let Some(v) = env("CHENGHUB_BOOTSTRAP_ADMINS") {
            self.admin.bootstrap_admin_usernames = v
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect();
        }
        if let Some(v) = env("CHENGHUB_RUN_JOBS") {
            self.jobs.run_jobs = v == "true" || v == "1";
        }
        if let Some(v) = env("CHENGHUB_LOG_FORMAT") {
            self.telemetry.log_format = v;
        }
    }

    fn validate(&self) -> anyhow::Result<()> {
        anyhow::ensure!(
            self.environment == "development" || self.environment == "production",
            "environment must be 'development' or 'production', got {:?}",
            self.environment
        );
        anyhow::ensure!(
            self.server.listen.parse::<std::net::SocketAddr>().is_ok(),
            "server.listen must be a socket address, got {:?}",
            self.server.listen
        );
        let public = &self.server.public_url;
        anyhow::ensure!(
            public.starts_with("http://") || public.starts_with("https://"),
            "server.public_url must be an http(s) URL"
        );
        anyhow::ensure!(!self.database.url.is_empty(), "database.url is required (DATABASE_URL)");
        anyhow::ensure!(
            self.oauth.default_return_to.starts_with('/'),
            "oauth.default_return_to must be a path"
        );
        anyhow::ensure!(self.device.user_code_length >= 6, "device.user_code_length must be >= 6");
        anyhow::ensure!(self.limits.max_title_chars > 0, "limits.max_title_chars must be > 0");
        if self.environment == "production" {
            anyhow::ensure!(public.starts_with("https://"), "production requires an https public_url");
            anyhow::ensure!(
                self.tokens.hmac_secret.expose().len() >= 32
                    && !self.tokens.hmac_secret.expose().starts_with("dev-only"),
                "production requires CHENGHUB_TOKEN_HMAC_SECRET (>= 32 chars, not the dev default)"
            );
            anyhow::ensure!(self.cookies.secure, "production requires cookies.secure = true");
            for origin in &self.server.cors_allowed_origins {
                anyhow::ensure!(
                    origin.starts_with("https://"),
                    "production CORS origins must be https, got {origin:?}"
                );
            }
        }
        Ok(())
    }

    /// Redacted, human-readable dump for `admin show-config`.
    pub fn redacted_debug(&self) -> String {
        format!("{self:#?}")
    }
}
