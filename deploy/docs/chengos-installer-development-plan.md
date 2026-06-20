# ChengOS Installer Tool Development Plan

## Purpose

This plan describes the next development pass for the unified ChengOS installation tool. It is based on the current `chengos.sh` manager behavior and the desired product flow for installation, update, uninstall, restart, shortcuts, language switching, and exit.

The goal is to improve the installer without breaking the existing deployment modules. Options 4, 5, and 6 in the current menu, which provide service status, start, and stop operations, do not require functional changes in this plan. They should remain intact unless a later design decision explicitly removes or reorganizes them.

## Current Scope

The installer currently supports native and Docker deployment paths, bilingual menu text, environment generation, service start/stop/status, uninstall, update, command shortcut creation, language switching, and exit. The next implementation should focus on correcting the installation defaults, making update and uninstall behavior mode-aware, adding restart, and clarifying shortcut behavior.

The implementation must preserve user configuration. Existing `.env` files, user secrets, runtime data, workspace files, skills, config overrides, and logs must not be overwritten or deleted during install/update unless the user explicitly chooses a destructive uninstall path.

## Step 1: Stabilize Environment Initialization

Modify `deploy/.env.example`.

This file is the unified deployment environment template used by all modes (native, Docker, and distributed). It should keep `CHENG_CLI_ALLOWED_ROOTS` documented and provide a safe default example that matches how the CLI is intended to access local workspaces. The template should avoid leaving users with an empty value that silently disables CLI sessions. The final default should be chosen consistently with runtime behavior, such as a package-local workspace directory or another approved absolute path.

Modify `deploy/generate-env.sh` (the unified generator).

This file creates the single `deploy/.env` shared by all modes. Add logic that fills `CHENG_CLI_ALLOWED_ROOTS` directly during generation so users are not prompted for it. The generated value should be deterministic and resolve to an absolute path visible to the API and CLI in native mode, and `docker-compose.yml` should override it to `/app/workspace` for Docker containers. The script should create the target workspace directory if needed, keep permissions reasonable, and preserve behavior for secrets, database URLs, Redis, Qdrant, ports, and CORS.

Modify `deploy/hybrid/generate-env.sh` and `deploy/docker/generate-env.sh` to delegate to `deploy/generate-env.sh`.

Both scripts are now thin wrappers that export mode-specific defaults and call the unified generator. Docker mode has a different filesystem namespace, so `deploy/docker/docker-compose.yml` must override `CHENG_CLI_ALLOWED_ROOTS` to the mounted path `/app/workspace` instead of setting it in the generated `.env`.

Modify `chengos.sh` and `deploy/chengos.sh`.

The root `chengos.sh` is a symlink to `deploy/chengos.sh`, which is the canonical manager source. Update the canonical file at `deploy/chengos.sh`; the root symlink will follow automatically. During install, `setup_native_env` and `setup_docker_env` should generate `.env` only when it does not already exist. Existing `.env` files should be reused by default. A forced regeneration path can exist as an explicit CLI flag later, but normal install and update must not overwrite secrets or user configuration.

Integrity checks for this step:

- A fresh native install creates `deploy/.env` with a non-empty `CHENG_CLI_ALLOWED_ROOTS`.
- Re-running install does not overwrite an existing `deploy/.env`.
- Existing secrets remain unchanged across install and update.
- Native start and Docker compose both read the same `deploy/.env`.

## Step 2: Add Reliable Install Mode Detection

Modify `chengos.sh` and `deploy/chengos.sh`.

Add helper functions that determine the active install mode from explicit markers instead of only checking whether deployment directories exist. The repository contains both `deploy/hybrid` and `deploy/docker`, so directory presence alone is not a reliable signal.

Recommended helper functions:

- `resolve_hybrid_dir`: returns the active native deployment directory.
- `resolve_docker_dir`: returns the active Docker deployment directory.
- `detect_install_mode`: decides whether the current installation is native or Docker by checking installed `deploy/.env`, compose state, local mode metadata, and user-supplied `--mode`.
- `write_install_metadata`: records the chosen mode after install, for example in `.chengos_install_mode`.
- `read_install_metadata`: loads that mode for update, uninstall, restart, status, start, and stop.

The helper functions should keep explicit CLI arguments authoritative. If the user passes `--mode docker`, the command should use Docker mode even if native files also exist. If no mode is passed, metadata should be used first, then safe fallback detection.

Integrity checks for this step:

- A repo checkout containing both `deploy/hybrid` and `deploy/docker` can still choose Docker mode.
- A native release bundle without repo layout still resolves native paths correctly.
- Existing status/start/stop menu options 4, 5, and 6 continue to work.
- CLI and TUI mode detection behave consistently.

## Step 3: Implement Mode-Aware Updates

Modify `chengos.sh` and `deploy/chengos.sh`.

Replace the current generic update behavior with an update flow that branches by install mode.

For Docker mode, add a function such as `update_docker_install`. It should:

- Resolve the Docker deployment directory.
- Ensure Docker and Docker Compose are available.
- Ensure `deploy/.env` exists, generating it only if missing.
- Check the currently configured images from `deploy/.env` and compose files.
- Pull the latest images using Docker Compose.
- Determine whether any image digest changed when practical.
- Restart the stack only when needed, or clearly report that the images are already current.

The existing `deploy/docker/upgrade.sh` already contains useful Docker update behavior. The manager can either call it or share its logic. If `upgrade.sh` remains the lower-level implementation, keep it as the Docker-specific update module and make `chengos.sh update --mode docker` delegate to it.

For native/binary mode, add a function such as `update_native_install`. It should:

- Resolve the native deployment directory.
- Read the local installed package version from a metadata file such as `.chengos_version`.
- Query the latest release version.
- Compare local and remote versions.
- Download the packaged release only when a newer package exists.
- Stop services before replacing binaries or frontend assets.
- Replace packaged files such as `bin`, `ui`, `app`, server scripts, and deployment scripts as needed.
- Preserve `deploy/.env`, `runtime`, `logs`, user workspaces, skills/config overrides, and local language preference.
- Write the new `.chengos_version` only after the package update succeeds.
- Restart services after a successful update if they were running before the update.

For git/script updates, treat repository script refresh as an implementation detail of native update rather than a confusing extra TUI path. If the installation is a git checkout, the updater can check whether scripts changed through `git fetch`/`git pull`, but it must not overwrite packaged binaries or user config unless the selected update path requires it.

Modify bootstrap logic in `chengos.sh`.

When a standalone bootstrap install downloads the latest release package, record the resolved release tag in `.chengos_version`. This allows future native updates to compare the installed package with the latest release.

Integrity checks for this step:

- Docker update pulls images and restarts the stack without touching native files.
- Native update replaces package-owned files without overwriting `deploy/.env`.
- Updating from an already-current version exits cleanly with a clear message.
- Failed downloads or extraction errors leave the previous installation usable.
- Existing options 4, 5, and 6 keep their current behavior.

## Step 4: Make Uninstall Behavior Explicit and Safe

Modify `chengos.sh` and `deploy/chengos.sh`.

Split uninstall into native and Docker paths.

For Docker mode, add a function such as `uninstall_docker_install`. It should:

- Stop and remove ChengOS containers through Docker Compose.
- Remove Compose-managed volumes only after an explicit confirmation if data deletion is included in the selected uninstall behavior.
- Prompt the user whether to remove ChengOS images.
- Remove only ChengOS-related images when the user confirms.
- Leave unrelated Docker images, containers, networks, and volumes untouched.

For native mode, add or refine a function such as `uninstall_native_install`. It should:

- Explain what will be removed.
- Stop services.
- Remove package-owned runtime executables and static assets only after confirmation.
- Keep user configuration and data by default.
- Make destructive data removal a separate explicit confirmation.

The CLI should support non-interactive behavior later through flags such as `--yes`, `--keep-data`, or `--remove-images`, but the first implementation can keep confirmations interactive for destructive actions.

Integrity checks for this step:

- Docker uninstall removes ChengOS containers.
- Docker image removal happens only after user confirmation.
- Native uninstall does not accidentally remove `deploy/.env`, user workspaces, or persistent data by default.
- The command exits cleanly if nothing is installed.

## Step 5: Add Restart as a First-Class Command

Modify `chengos.sh` and `deploy/chengos.sh`.

Add a `restart` CLI command and a TUI menu entry. The restart flow should reuse existing stop/start behavior instead of duplicating service-specific logic.

Recommended behavior:

- `./chengos.sh restart --mode native` stops and starts native services.
- `./chengos.sh restart --mode docker` restarts Docker services.
- Without `--mode`, restart uses the same install-mode detection helper as update and uninstall.
- Restart should not delete infrastructure, volumes, data, or images.
- Restart should preserve the same module selection behavior used by start.

Menu integration should keep the existing status/start/stop functions intact. Because options 4, 5, and 6 do not require changes, restart can be inserted after them as option 7, with shortcut and language options renumbered after it.

Integrity checks for this step:

- CLI restart works in native mode.
- CLI restart works in Docker mode.
- TUI restart calls the same command path as CLI restart.
- Restart does not regenerate `deploy/.env`.

## Step 6: Clarify and Improve System Shortcuts

Modify `chengos.sh` and `deploy/chengos.sh`.

Keep the current shortcut feature, but rename the behavior clearly as command shortcut installation unless true OS keyboard shortcuts are explicitly implemented. The current feature creates system commands such as `chengos` and `cheng`; that is useful, but it is not the same as global keyboard hotkeys.

Recommended behavior:

- Keep creating `/usr/local/bin/chengos` for the manager.
- Keep creating `/usr/local/bin/cheng` when the CLI binary exists.
- Make the prompt text clear that this installs shell commands.
- Verify target paths before writing.
- Use `sudo` only when needed.
- Report exactly which shortcuts were installed.

If global keyboard shortcuts are later required, they should be implemented as an optional desktop-environment-specific module, not mixed into the basic installer flow. Linux desktop shortcut support varies across GNOME, KDE, terminal environments, remote servers, and headless hosts.

Integrity checks for this step:

- Existing command shortcut behavior still works.
- The menu wording no longer suggests unsupported keyboard hotkeys.
- Shortcut installation does not run during install/update unless selected.

## Step 7: Preserve Language Switching and Exit

Modify `chengos.sh` and `deploy/chengos.sh`.

Keep language switching backed by `.chengos_lang`. If menu numbering changes after adding restart, update all Chinese and English menu labels, prompts, and valid input ranges together.

Exit should remain a simple menu action with no side effects.

Integrity checks for this step:

- Switching language updates the menu immediately.
- The selected language persists across future runs.
- Exit does not stop services or change files.

## Step 8: Documentation and Verification

Modify `deploy/README.md`.

Add a short link to this development plan from the deployment guide so future maintainers can find the intended installer behavior.

Optionally modify `deploy/hybrid/README.md` and `deploy/docker/README.md`.

If the implementation changes user-facing update, uninstall, restart, or shortcut commands, update the mode-specific README files with concise examples.

Verification should include:

- `bash -n chengos.sh`
- `bash -n deploy/chengos.sh`
- `bash -n deploy/hybrid/generate-env.sh`
- `bash -n deploy/docker/generate-env.sh`
- `bash -n deploy/docker/upgrade.sh`
- Fresh native install smoke test.
- Fresh Docker install smoke test.
- Native update with current version.
- Native update with mocked older `.chengos_version`.
- Docker update with existing `deploy/.env`.
- Docker uninstall with image removal declined.
- Docker uninstall with image removal accepted in a disposable test environment.
- Restart in native and Docker modes.
- Language switch persistence.
- Existing options 4, 5, and 6: status, start, and stop.

## Module Integrity Requirements

The manager must keep orchestration responsibilities separate from mode-specific implementation details.

`chengos.sh` (root symlink) and `deploy/chengos.sh` (canonical source) should own the user-facing CLI/TUI flow, language strings, command dispatch, install-mode detection, and delegation to native or Docker operations.

`deploy/generate-env.sh` should own unified `.env` generation and shared defaults.

`deploy/hybrid/start.sh`, `deploy/hybrid/stop.sh`, and `deploy/hybrid/status.sh` should continue to own native service lifecycle behavior.

`deploy/hybrid/generate-env.sh` and `deploy/docker/generate-env.sh` should delegate to `deploy/generate-env.sh` and only apply mode-specific overrides.

`deploy/docker/start.sh`, `deploy/docker/upgrade.sh`, and Docker Compose files should continue to own Docker lifecycle and image update behavior.

No update, install, restart, or shortcut feature should silently delete user data. Destructive operations belong only to uninstall flows and must require explicit confirmation.

