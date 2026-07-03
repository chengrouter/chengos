pub mod job_outbox;
pub mod models;
pub mod outbox;
pub mod repositories;

use sqlx::postgres::{PgPool, PgPoolOptions};

use crate::config::DatabaseConfig;
use crate::error::{RegistryError, Result};

pub async fn connect(config: &DatabaseConfig) -> Result<PgPool> {
    PgPoolOptions::new()
        .max_connections(config.max_connections)
        .min_connections(config.min_connections)
        .acquire_timeout(std::time::Duration::from_secs(config.acquire_timeout_secs))
        .connect(config.url.expose())
        .await
        .map_err(|e| RegistryError::Unavailable(format!("PostgreSQL connection failed: {e}")))
}

/// Embedded migration set (applied only by `skill-registry migrate`).
pub fn migrator() -> sqlx::migrate::Migrator {
    sqlx::migrate!("./migrations")
}

/// Verify the database matches the binary's embedded migrations without
/// applying anything. Used by `serve` startup and readiness checks.
pub async fn verify_migrations(pool: &PgPool) -> Result<()> {
    let migrator = migrator();
    let applied: Vec<(i64,)> = sqlx::query_as(
        "SELECT version FROM _sqlx_migrations WHERE success ORDER BY version",
    )
    .fetch_all(pool)
    .await
    .map_err(|e| {
        RegistryError::MigrationMismatch(format!(
            "cannot read migration state (run `skill-registry migrate`?): {e}"
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
        return Err(RegistryError::MigrationMismatch(format!(
            "pending migrations {missing:?}; run `skill-registry migrate`"
        )));
    }
    Ok(())
}
