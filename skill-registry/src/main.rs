//! skill-registry binary entry point.
//!
//! Subcommand parsing, config loading, and tracing initialization only.
//! All business assembly lives in `app.rs`.

use clap::{Parser, Subcommand};
use skill_registry::{app, config::AppConfig, telemetry};

#[derive(Parser)]
#[command(name = "skill-registry", version, about = "ChengOS Skills Registry")]
struct Cli {
    /// Path to a TOML config file (overrides defaults, overridden by env vars).
    #[arg(long, global = true, env = "REGISTRY_CONFIG")]
    config: Option<String>,

    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Run the HTTP API and (unless disabled) background workers in one process.
    Serve,
    /// Apply pending database migrations. The only command that mutates schema.
    Migrate,
    /// Operational admin commands (run against the same database/config).
    Admin {
        #[command(subcommand)]
        command: AdminCommand,
    },
}

#[derive(Subcommand)]
enum AdminCommand {
    /// List dead-lettered jobs.
    DeadLetters {
        #[arg(long, default_value_t = 50)]
        limit: i64,
    },
    /// Requeue a dead-lettered job by id.
    RequeueJob { job_id: String },
    /// Force-quarantine a release by id (audited).
    QuarantineRelease {
        release_id: String,
        #[arg(long)]
        reason: String,
    },
    /// Revoke a publisher token by id (audited).
    RevokeToken { token_id: String },
    /// Print effective (secret-redacted) configuration and exit.
    ShowConfig,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    let config = AppConfig::load(cli.config.as_deref())?;
    telemetry::tracing::init(&config.telemetry);

    let runtime = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()?;

    runtime.block_on(async move {
        match cli.command {
            Command::Serve => app::serve(config).await,
            Command::Migrate => app::migrate(config).await,
            Command::Admin { command } => {
                let cmd = match command {
                    AdminCommand::DeadLetters { limit } => app::AdminCmd::DeadLetters { limit },
                    AdminCommand::RequeueJob { job_id } => app::AdminCmd::RequeueJob { job_id },
                    AdminCommand::QuarantineRelease { release_id, reason } => {
                        app::AdminCmd::QuarantineRelease { release_id, reason }
                    }
                    AdminCommand::RevokeToken { token_id } => {
                        app::AdminCmd::RevokeToken { token_id }
                    }
                    AdminCommand::ShowConfig => app::AdminCmd::ShowConfig,
                };
                app::admin(config, cmd).await
            }
        }
    })
}
