# ChengOS v0.1.0 Release Notes

> Release Date: 2026-08-14
> Previous Version: v0.05

---

## Overview

v0.1.0 is the first stable release of ChengOS. This update spans one week of development across the **chengos** root repository, focusing on **multi-OS deployment support**, **version control & release engineering**, **online update system**, **credential management**, and **i18n node translation updates**.

This release introduces the complete release lifecycle: authoritative version stamping, CI-gated builds, archive verification, checksum/signature validation, staged updates with automatic rollback, and Docker version pinning.

---

## Installation Package

**File:** `chengos-full-linux-amd64-v0.1.0.tar.gz`
**Size:** 65 MB
**Target:** Linux x86_64 (musl static binary)

### Archive Contents

| Component | Description |
|-----------|-------------|
| `bin/cheng-api` | Backend API static binary (musl) |
| `bin/cheng` | CLI terminal client |
| `bin/app-server.js` / `bin/ui-server.js` | App / UI static file servers |
| `chengos.sh` | Unified management script (install / update / rollback / start / stop) |
| `hybrid/start.sh` / `stop.sh` / `status.sh` | Native deployment lifecycle scripts |
| `hybrid/generate-env.sh` | Hybrid mode environment configuration generator |
| `lib/release-update.sh` | Online update library (download / verify / stage / swap / restore) |
| `lib/verify-release-archive.sh` | Archive structural verifier |
| `infra/docker-compose.yml` | Docker Compose orchestration |
| `config/` | Presets, shortcuts, i18n translations |
| `skills/` | Built-in skill packages + workflow templates |
| `ui/` | Frontend production build |
| `VERSION` | Embedded version identifier: 0.1.0 |

### Checksum

```
sha256: 80d4c134ce536ab59f28b8dbc00a9f02af5429625db5a31e4e441cc18d301871
```

---

## New Features

### 1. Multi-OS Deployment Support

`chengos.sh` and `hybrid/start.sh` now support automatic detection and installation across multiple Linux distributions:

- **Supported distributions:** Ubuntu / Debian, CentOS / RHEL, Fedora, Arch Linux, openSUSE, Alpine
- **PostgreSQL auto-install:** CentOS 7 EOL handling with automatic mirror-to-vault migration; PostgreSQL 15 installed from official pgdg repo on EL7
- **Bubblewrap (bwrap) auto-install:** Required for `code_shell` / `code_python` sandboxed execution; auto-detected and installed via system package manager
- **Workspace root configuration:** New `CHENG_WORKSPACE_ROOT` environment variable for non-CLI workflow execution base directory

### 2. Version Control & Release Engineering

Complete release lifecycle infrastructure:

- **Authoritative `VERSION` file:** Single source of truth for release version, checked by `scripts/check-release-consistency.sh` to ensure tag == VERSION == Cargo workspace version
- **`release.sh`:** Maintainer entry point for building, verifying, checksumming, and signing native release archives
- **Self-identifying builds:** Versioned native archive with `.sha256` checksum and detached signature; `cheng-api --version`, `cheng --version`, and `/health` response all report the embedded version
- **GitHub Actions CI:** `release.yml` implements a gated release sequence (validate → build → docker → publish); `release-checks.yml` runs consistency checks on every push
- **Release contract tests:** `scripts/test-release-contract.sh` validates archive structure, version embedding, and forbidden content checks
- **`CHANGELOG.md`:** Formal changelog with rollback compatibility declarations (reversible / irreversible migration policy)

### 3. Online Update System

`deploy/lib/release-update.sh` provides a complete safe-update pipeline:

- **Release discovery:** Fetches latest stable version from GitHub Releases API
- **Download & verification:** Checksum (SHA-256) and optional signature verification (cosign / minisign / GPG)
- **Staged replacement:** Extract to staging directory → verify structure → backup current installation → swap → health check → automatic restore on failure
- **Versioned backups:** `chengos.sh rollback` restores the previous release
- **Free space guard:** Refuses to stage when insufficient disk space is available
- **Migration policy:** Checks `CHANGELOG.md` for rollback compatibility before allowing automatic rollback
- **Smoke tests:** `deploy/tests/update-smoke.sh` — 327-line test suite covering extraction, version mismatch rejection, incomplete archive rejection, staging space, and restart-failure restore

### 4. Credential Management

- **`chengos.sh` menu option 12:** Reset login username/password interactively
- Supports resetting username, email, and password for any account
- Password confirmation with mismatch detection
- Bilingual prompts (Chinese / English)

### 5. Docker Version Pinning

- **`CHENGOS_VERSION` in `.env`:** All four ChengOS images (API / UI / App / CLI) resolve their tag from a single version value
- **Immutable releases:** Docker images published under exact version tags with OCI version/revision/source labels
- **`release-manifest.json`:** Published as a release asset for reproducible deployments
- **`latest` is convenience only:** Not a reproducible production version; never an update or rollback target

---

## Bug Fixes

### Archive Verifier SIGPIPE Fix

`scripts/verify-release-archive.sh` — Fixed false "required entry missing from archive" failures on large archives:

- **Root cause:** `printf '%s\n' "$listing" | grep -qx "chengos/${required}"` pipelines under `set -o pipefail` — when `grep -q` exits early on match, `printf` receives SIGPIPE, making the pipeline return non-zero
- **Impact:** Non-deterministic verification failures depending on pipe buffer timing; affected archives with ~1000+ entries
- **Fix:** Replaced all `printf | grep` pipelines with bash builtin string matching (`[[ "${wrapped}" == *"${nl}chengos/${required}${nl}"* ]]`)

---

## i18n Node Translation Updates

Updated Chinese translations across 14 node definition files:

| Node | Changes |
|------|---------|
| `agent/react_agent` | Added: `execution_mode`, `long_task_safety_policy`, `reminder_policy`, `short_task_budget_chunk`, `transparent_agent_streaming`, `artifacts`, `continuation_policy`, `interim_report`, `pause_reason`, `suggested_next_action` |
| `ai/context_merge` | Added: `merge_mode` input |
| `ai/llm_branch` | Updated field descriptions |
| `rag/chunker` | Updated field descriptions |
| `rag/document_indexer` | Updated field descriptions |
| `rag/formatter` | Updated field descriptions |
| `rag/retriever` | Updated field descriptions |
| `tools/code_python` | Updated field descriptions |
| `tools/code_shell` | Updated field descriptions |
| `tools/file_ops_hub` | Updated field descriptions |
| `tools/mcp_hub` | Updated field descriptions |
| `tools/view_file` | Updated field descriptions |
| `nodes-zh-overrides` | Updated global overrides |

Removed obsolete translation entries for deprecated nodes: `chat/memory`, `chat/save_reply`, `tools/cli_context_init`, `tools/cli_fallback_context`, `tools/cli_fallback_response_parse`, `tools/cli_install_plan`.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHENG_WORKSPACE_ROOT` | `{install_dir}/workspaces` | Base directory for `code_shell` / `code_python` working_subdir resolution when no CLI session sandbox is present |
| `CHENGOS_VERSION` | `latest` | Pin exact release version for Docker image tags; `latest` is first-install convenience only |

---

## Upgrade Instructions

### From v0.05

```bash
# Online update (checksum + signature verified, auto-restore on failure)
./chengos.sh update

# Or manual upgrade from local build
./build.sh --hybrid --release --target x86_64-unknown-linux-musl --with-cli
# Transfer dist/chengos-full-linux-amd64-v0.1.0.tar.gz to server
./chengos.sh update
```

After upgrade, new i18n translations and deployment scripts are deployed automatically. Existing workspaces and configurations are unaffected.

### Fresh Install

```bash
# Native binary mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash -s -- --mode native

# Docker mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash
```

After installation, edit `.env` to configure database password and secret key, then start:

```bash
./chengos.sh start
```

---

## Known Limitations

- Node preset UI selection panel is still under development; currently managed via config files
- Routing shortcut UI toggle is not yet complete; currently used via API and config files
- `presets.yaml` `config_patch` uses shallow merge; deep merge of nested objects is not supported
- Online update signature verification requires `cosign`, `minisign`, or `gpg` to be installed; falls back to checksum-only verification if none are present

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
