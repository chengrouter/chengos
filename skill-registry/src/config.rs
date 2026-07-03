//! Strongly typed application configuration.
//!
//! Load order (deterministic, later wins): built-in defaults -> optional TOML
//! file (`--config` / `REGISTRY_CONFIG`, falling back to `config/default.toml`
//! when present) -> environment variables.
//!
//! Classification:
//! * startup-only: database URL, Redis URL, listen address, public URL,
//!   artifact root, token secrets, telemetry format. Changing them requires a
//!   restart.
//! * hot-reloadable candidates (grouped in [`DynamicConfig`]): cache TTLs,
//!   rate limits, worker concurrency caps, moderation thresholds. `serve`
//!   snapshots them into a swappable handle so a future SIGHUP/admin reload
//!   can replace them without restart.

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
    /// Listen address, e.g. "127.0.0.1:8300". Startup-only.
    pub listen: String,
    /// Public base URL served to clients, e.g. "https://skills.example.com".
    pub public_url: String,
    /// Request timeout in seconds for non-upload endpoints.
    pub request_timeout_secs: u64,
    /// Graceful shutdown budget in seconds (HTTP drain + job drain).
    pub shutdown_timeout_secs: u64,
    /// Max JSON body size in bytes for non-artifact endpoints.
    pub max_json_body_bytes: usize,
    /// Exact allowed CORS origins. Empty = same-origin / proxy-only deployment.
    pub cors_allowed_origins: Vec<String>,
    /// Serve artifact downloads via `X-Accel-Redirect` (requires Nginx internal
    /// location). When false the registry streams file bytes itself (dev mode).
    pub use_x_accel_redirect: bool,
    /// The internal location prefix Nginx maps to the artifact root.
    pub x_accel_prefix: String,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            listen: "127.0.0.1:8300".into(),
            public_url: "http://127.0.0.1:8300".into(),
            request_timeout_secs: 30,
            shutdown_timeout_secs: 30,
            max_json_body_bytes: 1024 * 1024,
            cors_allowed_origins: vec![],
            use_x_accel_redirect: false,
            x_accel_prefix: "/internal/artifacts".into(),
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
            url: Secret::new("postgres://postgres:postgres@127.0.0.1:5432/skill_registry"),
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
    /// Redis URL. Startup-only. Redis is an accelerator, never business truth;
    /// the registry must keep serving reads when Redis is down.
    pub url: Secret,
    /// When false, all Redis-backed features degrade to PostgreSQL paths.
    pub enabled: bool,
    pub connect_timeout_secs: u64,
}

impl Default for RedisConfig {
    fn default() -> Self {
        Self {
            url: Secret::new("redis://127.0.0.1:6379/0"),
            enabled: true,
            connect_timeout_secs: 2,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct ArtifactConfig {
    /// Root directory for content-addressed artifact storage. Startup-only.
    pub root: PathBuf,
    /// Work directory for in-flight uploads (`.part` files) under root.
    pub work_dir: String,
    /// Max compressed artifact size in bytes.
    pub max_archive_bytes: u64,
    /// Max total expanded bytes across all entries.
    pub max_expanded_bytes: u64,
    /// Max expanded bytes for a single file.
    pub max_file_bytes: u64,
    /// Max number of file entries.
    pub max_files: usize,
    /// Max compression ratio (expanded / compressed), per file and total.
    pub max_compression_ratio: u64,
    /// Max entry path length in bytes.
    pub max_path_bytes: usize,
    /// Max entry path depth in segments.
    pub max_path_depth: usize,
    /// Upload session / stream timeout in seconds.
    pub upload_timeout_secs: u64,
    /// Quota in bytes for the upload work directory (backpressure guard).
    pub work_dir_quota_bytes: u64,
    /// Unix permissions (octal string) for created artifact files.
    pub file_mode: String,
}

impl Default for ArtifactConfig {
    fn default() -> Self {
        Self {
            root: PathBuf::from("./data/artifacts"),
            work_dir: "work".into(),
            max_archive_bytes: 20 * 1024 * 1024,
            max_expanded_bytes: 100 * 1024 * 1024,
            max_file_bytes: 20 * 1024 * 1024,
            max_files: 512,
            max_compression_ratio: 200,
            max_path_bytes: 256,
            max_path_depth: 8,
            upload_timeout_secs: 300,
            work_dir_quota_bytes: 2 * 1024 * 1024 * 1024,
            file_mode: "0640".into(),
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct AuthConfig {
    /// HMAC secret for hashing publisher grant/API tokens. Startup-only.
    /// Required (non-empty, >= 32 bytes) in production.
    pub token_hmac_secret: Secret,
    /// Separate admin bearer token hash input secret. Startup-only.
    pub admin_token: Secret,
    /// Grant code lifetime (one-time codes exchanged for grant tokens).
    pub grant_code_ttl_secs: u64,
    /// Publisher grant token lifetime.
    pub grant_token_ttl_secs: u64,
    /// Identity assertion max age (issued-at skew window).
    pub assertion_max_age_secs: u64,
    /// Replay-protection window for assertion `jti` values.
    pub jti_ttl_secs: u64,
}

impl Default for AuthConfig {
    fn default() -> Self {
        Self {
            token_hmac_secret: Secret::new("dev-only-insecure-token-hmac-secret-0000"),
            admin_token: Secret::new(""),
            grant_code_ttl_secs: 120,
            grant_token_ttl_secs: 90 * 24 * 3600,
            assertion_max_age_secs: 60,
            jti_ttl_secs: 300,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct CacheConfig {
    /// TTL for search/list responses. Hot-reloadable.
    pub search_ttl_secs: u64,
    /// TTL for immutable release/manifest responses. Hot-reloadable.
    pub release_ttl_secs: u64,
    /// Cache key schema version; bump to invalidate everything.
    pub schema_version: u32,
}

impl Default for CacheConfig {
    fn default() -> Self {
        Self {
            search_ttl_secs: 30,
            release_ttl_secs: 3600,
            schema_version: 1,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct RateLimitConfig {
    /// Hot-reloadable. Requests per minute per IP for public catalog reads.
    pub public_per_ip_per_min: u32,
    /// Requests per minute per IP for artifact downloads.
    pub download_per_ip_per_min: u32,
    /// Requests per minute per publisher for publish endpoints.
    pub publish_per_publisher_per_min: u32,
    /// Requests per minute per IP for auth endpoints.
    pub auth_per_ip_per_min: u32,
    /// Reports per day per IP.
    pub report_per_ip_per_day: u32,
}

impl Default for RateLimitConfig {
    fn default() -> Self {
        Self {
            public_per_ip_per_min: 300,
            download_per_ip_per_min: 60,
            publish_per_publisher_per_min: 30,
            auth_per_ip_per_min: 20,
            report_per_ip_per_day: 20,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct JobsConfig {
    /// Run background workers in this process (`REGISTRY_RUN_JOBS`).
    pub run_jobs: bool,
    /// Global concurrent job cap. Hot-reloadable candidate.
    pub max_concurrency: usize,
    /// Per-type caps.
    pub scan_concurrency: usize,
    pub cleanup_concurrency: usize,
    /// Job lease seconds before another worker may reclaim.
    pub lease_secs: i64,
    /// Max attempts before dead-letter.
    pub max_attempts: i32,
    /// Base retry backoff seconds (exponential).
    pub retry_backoff_secs: i64,
    /// Outbox poll interval when Redis is degraded.
    pub outbox_poll_interval_secs: u64,
    /// Cleanup: minimum age before an orphan `.part`/work dir is removed.
    pub cleanup_min_age_secs: i64,
    /// Download counter flush interval.
    pub counter_flush_interval_secs: u64,
}

impl Default for JobsConfig {
    fn default() -> Self {
        Self {
            run_jobs: true,
            max_concurrency: 8,
            scan_concurrency: 4,
            cleanup_concurrency: 1,
            lease_secs: 300,
            max_attempts: 5,
            retry_backoff_secs: 30,
            outbox_poll_interval_secs: 5,
            cleanup_min_age_secs: 24 * 3600,
            counter_flush_interval_secs: 300,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct ModerationConfig {
    /// Hot-reloadable. When true, a clean scan auto-approves the release;
    /// findings still force `needs_review`.
    pub auto_approve_clean_scans: bool,
    /// Findings at or above this severity force quarantine instead of review.
    /// One of: "low", "medium", "high", "critical".
    pub quarantine_at_severity: String,
}

impl Default for ModerationConfig {
    fn default() -> Self {
        Self {
            auto_approve_clean_scans: false,
            quarantine_at_severity: "critical".into(),
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, deny_unknown_fields)]
pub struct CountersConfig {
    /// HMAC key for privacy-preserving download buckets. Startup-only.
    pub bucket_hmac_key: Secret,
    /// Counting window seconds (one download per release/bucket/window).
    pub window_secs: u64,
}

impl Default for CountersConfig {
    fn default() -> Self {
        Self {
            bucket_hmac_key: Secret::new("dev-only-insecure-counter-hmac-key"),
            window_secs: 24 * 3600,
        }
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
            log_filter: "info,skill_registry=debug".into(),
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
    pub artifacts: ArtifactConfig,
    pub auth: AuthConfig,
    pub cache: CacheConfig,
    pub rate_limit: RateLimitConfig,
    pub jobs: JobsConfig,
    pub moderation: ModerationConfig,
    pub counters: CountersConfig,
    pub telemetry: TelemetryConfig,
}

/// Snapshot of hot-reloadable settings, held behind a swappable handle by the
/// running app so a future reload path can replace them atomically.
#[derive(Debug, Clone)]
pub struct DynamicConfig {
    pub cache: CacheConfig,
    pub rate_limit: RateLimitConfig,
    pub moderation: ModerationConfig,
    pub max_concurrency: usize,
}

impl AppConfig {
    pub fn load(config_path: Option<&str>) -> anyhow::Result<Self> {
        let mut config = AppConfig {
            environment: "development".into(),
            ..Default::default()
        };

        let path = config_path
            .map(PathBuf::from)
            .or_else(|| {
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

        if let Some(v) = env("REGISTRY_ENVIRONMENT") {
            self.environment = v;
        }
        if let Some(v) = env("REGISTRY_LISTEN") {
            self.server.listen = v;
        }
        if let Some(v) = env("REGISTRY_PUBLIC_URL") {
            self.server.public_url = v;
        }
        if let Some(v) = env("REGISTRY_CORS_ALLOWED_ORIGINS") {
            self.server.cors_allowed_origins =
                v.split(',').map(|s| s.trim().to_string()).filter(|s| !s.is_empty()).collect();
        }
        if let Some(v) = env("REGISTRY_USE_X_ACCEL_REDIRECT") {
            self.server.use_x_accel_redirect = v == "true" || v == "1";
        }
        if let Some(v) = env("DATABASE_URL").or_else(|| env("REGISTRY_DATABASE_URL")) {
            self.database.url = Secret::new(v);
        }
        if let Some(v) = env("REDIS_URL").or_else(|| env("REGISTRY_REDIS_URL")) {
            self.redis.url = Secret::new(v);
        }
        if let Some(v) = env("REGISTRY_REDIS_ENABLED") {
            self.redis.enabled = v == "true" || v == "1";
        }
        if let Some(v) = env("REGISTRY_ARTIFACT_ROOT") {
            self.artifacts.root = PathBuf::from(v);
        }
        if let Some(v) = env("REGISTRY_TOKEN_HMAC_SECRET") {
            self.auth.token_hmac_secret = Secret::new(v);
        }
        if let Some(v) = env("REGISTRY_ADMIN_TOKEN") {
            self.auth.admin_token = Secret::new(v);
        }
        if let Some(v) = env("REGISTRY_COUNTER_HMAC_KEY") {
            self.counters.bucket_hmac_key = Secret::new(v);
        }
        if let Some(v) = env("REGISTRY_RUN_JOBS") {
            self.jobs.run_jobs = v == "true" || v == "1";
        }
        if let Some(v) = env("REGISTRY_LOG_FORMAT") {
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
        anyhow::ensure!(
            !self.database.url.is_empty(),
            "database.url is required (DATABASE_URL)"
        );
        anyhow::ensure!(self.artifacts.max_files > 0, "artifacts.max_files must be > 0");
        anyhow::ensure!(
            self.artifacts.max_expanded_bytes >= self.artifacts.max_file_bytes,
            "artifacts.max_expanded_bytes must be >= max_file_bytes"
        );
        anyhow::ensure!(
            u32::from_str_radix(self.artifacts.file_mode.trim_start_matches("0o").trim_start_matches('0'), 8).is_ok()
                || self.artifacts.file_mode == "0",
            "artifacts.file_mode must be an octal permission string"
        );
        anyhow::ensure!(
            matches!(
                self.moderation.quarantine_at_severity.as_str(),
                "low" | "medium" | "high" | "critical"
            ),
            "moderation.quarantine_at_severity must be low|medium|high|critical"
        );
        if self.environment == "production" {
            anyhow::ensure!(
                public.starts_with("https://"),
                "production requires an https public_url"
            );
            anyhow::ensure!(
                self.auth.token_hmac_secret.expose().len() >= 32
                    && !self.auth.token_hmac_secret.expose().starts_with("dev-only"),
                "production requires REGISTRY_TOKEN_HMAC_SECRET (>= 32 chars, not the dev default)"
            );
            anyhow::ensure!(
                !self.counters.bucket_hmac_key.expose().starts_with("dev-only"),
                "production requires REGISTRY_COUNTER_HMAC_KEY (not the dev default)"
            );
            for origin in &self.server.cors_allowed_origins {
                anyhow::ensure!(
                    origin.starts_with("https://"),
                    "production CORS origins must be https, got {origin:?}"
                );
            }
        }
        Ok(())
    }

    pub fn dynamic(&self) -> DynamicConfig {
        DynamicConfig {
            cache: self.cache.clone(),
            rate_limit: self.rate_limit.clone(),
            moderation: self.moderation.clone(),
            max_concurrency: self.jobs.max_concurrency,
        }
    }

    /// Redacted, human-readable dump for `admin show-config`.
    pub fn redacted_debug(&self) -> String {
        format!("{self:#?}")
    }

    pub fn artifact_file_mode(&self) -> u32 {
        u32::from_str_radix(self.artifacts.file_mode.trim_start_matches("0o"), 8).unwrap_or(0o640)
    }
}
