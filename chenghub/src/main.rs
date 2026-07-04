//! chenghub binary entry point.
//!
//! Subcommand parsing, config loading, and tracing initialization only.
//! All business assembly lives in `app.rs`.

use chenghub::{app, config::AppConfig, telemetry};
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "chenghub", version, about = "ChengHub identity + community board")]
struct Cli {
    /// Path to a TOML config file (overrides defaults, overridden by env vars).
    #[arg(long, global = true, env = "CHENGHUB_CONFIG")]
    config: Option<String>,

    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Run the HTTP API and (unless disabled) background cleanup in one process.
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
    /// Create a user directly (bootstrap; normal users arrive via OAuth).
    CreateUser {
        username: String,
        #[arg(long)]
        display_name: Option<String>,
    },
    /// Grant a role (user|moderator|operator|admin) to a user by username.
    GrantRole { username: String, role: String },
    /// Revoke a role from a user by username.
    RevokeRole { username: String, role: String },
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
                    AdminCommand::CreateUser { username, display_name } => {
                        app::AdminCmd::CreateUser { username, display_name }
                    }
                    AdminCommand::GrantRole { username, role } => {
                        app::AdminCmd::GrantRole { username, role }
                    }
                    AdminCommand::RevokeRole { username, role } => {
                        app::AdminCmd::RevokeRole { username, role }
                    }
                    AdminCommand::ShowConfig => app::AdminCmd::ShowConfig,
                };
                app::admin(config, cmd).await
            }
        }
    })
}
