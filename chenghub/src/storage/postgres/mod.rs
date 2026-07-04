pub mod community_repository;
pub mod identity_repository;
pub mod models;
pub mod search_queries;

use sqlx::postgres::{PgPool, PgPoolOptions};

use crate::config::DatabaseConfig;
use crate::error::{HubError, Result};

/// One struct implements every repository port; `Arc<PgRepos>` is cloned
/// into services under the trait objects they need.
#[derive(Clone)]
pub struct PgRepos {
    pool: PgPool,
}

impl PgRepos {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
    pub fn pool(&self) -> &PgPool {
        &self.pool
    }
}

pub async fn connect(config: &DatabaseConfig) -> Result<PgPool> {
    PgPoolOptions::new()
        .max_connections(config.max_connections)
        .min_connections(config.min_connections)
        .acquire_timeout(std::time::Duration::from_secs(config.acquire_timeout_secs))
        .connect(config.url.expose())
        .await
        .map_err(|e| HubError::Unavailable(format!("PostgreSQL connection failed: {e}")))
}

/// Embedded migration set (applied only by `chenghub migrate`).
pub fn migrator() -> sqlx::migrate::Migrator {
    sqlx::migrate!("./migrations")
}

/// Verify the database matches the binary's embedded migrations without
/// applying anything. Used by `serve` startup.
pub async fn verify_migrations(pool: &PgPool) -> Result<()> {
    let migrator = migrator();
    let applied: Vec<(i64,)> =
        sqlx::query_as("SELECT version FROM _sqlx_migrations WHERE success ORDER BY version")
            .fetch_all(pool)
            .await
            .map_err(|e| {
                HubError::MigrationMismatch(format!(
                    "cannot read migration state (run `chenghub migrate`?): {e}"
                ))
            })?;

    let applied: std::collections::HashSet<i64> = applied.into_iter().map(|(v,)| v).collect();
    let mut missing = Vec::new();
    for migration in migrator.iter() {
        if !applied.contains(&migration.version) {
            missing.push(migration.version);
        }
    }
    if !missing.is_empty() {
        return Err(HubError::MigrationMismatch(format!(
            "pending migrations {missing:?}; run `chenghub migrate`"
        )));
    }
    Ok(())
}

/// Insert an audit event using any executor (pool or open transaction).
pub async fn insert_audit<'e, E: sqlx::PgExecutor<'e>>(
    exec: E,
    event: &crate::domain::moderation::NewAuditEvent,
) -> Result<()> {
    sqlx::query(
        "INSERT INTO audit_events (actor_type, actor, action, subject_type, subject_id, details, request_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)",
    )
    .bind(event.actor_type.as_str())
    .bind(&event.actor)
    .bind(&event.action)
    .bind(&event.subject_type)
    .bind(&event.subject_id)
    .bind(&event.details)
    .bind(&event.request_id)
    .execute(exec)
    .await?;
    Ok(())
}
