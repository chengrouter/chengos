# ChengOS v0.3.0 Release Notes

> Release Date: 2026-10-24
> Previous Version: v0.2.1

---

## Overview

v0.3.0 adds **native coding-agent setup** to the deployment tooling (Codex and
Claude Code), a **browser handoff** setting for agents that need the user to
finish sign-in, and an **OpenWrt appliance** package. It also tightens the CLI
sandbox: single-user installs without an allowlist now run in deny-only mode
instead of disabling CLI sessions, and the release contract is hardened with
version-pinned Docker and native rollback.

---

## New Features

### 1. Native Coding-Agent CLI Setup (Codex and Claude Code)

**Files:** `deploy/cli/claude.sh`, `deploy/lib/cli-common.sh`, `deploy/lib/env-file.sh`, `deploy/tests/coding-agent-setup-smoke.sh`

- **Codex install without Node:** the installer downloads a Codex build directly from the npm registry, verifies its SHA-512 integrity and a pinned-key ECDSA signature, validates the archive layout, and records a full-tree manifest per version
- **Activation probe:** activation probes the native binary locally and through the backend's sandboxed `admin coding-agent-probe` before committing settings
- **Atomic configuration:** all coding-agent keys are committed in one locked `.env` transaction; `--repair` reconciles bookkeeping if a failure happens after the commit
- **Claude Code task mode:** Claude Code can be installed and reconfigured on its own, beside the Codex installer, with quoted allowlists and a restart request shared by both CLIs
- **Single-user web scope:** `--enable-web-default-scope` lets the platform administrator run coding agents from the web without a CLI session (device-code login required). It is never enabled implicitly, is refused unless sign-in mode is `single` with managed credentials on, and `--close-signup` closes open registration alongside it
- **Read-only defaults:** when the Claude Code allowed-tools key is absent, git and test commands are read-only by default; an explicitly empty value keeps shell commands off
- **Docker:** coding agents stay disabled in Docker until the bubblewrap sandbox gate passes under the default policy

### 2. Browser Handoff and Remembered Profiles

**Files:** `deploy/.env.example`, `deploy/docker/docker-compose.yml`

- Deployment config exposes the browser handoff settings, so an agent can pause and let the user finish sign-in in a browser
- A remembered browser profile directory is configurable; Docker pins it inside the runtime mount and keeps the local window off

### 3. OpenWrt Appliance Packaging

**Files:** `deploy/openwrt/`, `deploy/tests/openwrt-appliance-smoke.sh`

- Cross-build, packaging, procd service, probe, and deploy scripts for OpenWrt routers
- An ELF check verifies the binaries are static for the target architecture before packaging
- `chengos-openwrt.sh` is the appliance entry point; the appliance smoke test runs in CI

---

## Changes

### CLI Sandbox

**Files:** `deploy/.env.example`, `deploy/README.md`

- Single-user deployments without `CHENG_CLI_ALLOWED_ROOTS` run CLI sessions in **deny-only** mode: any readable directory except system, home, credential, and `.env` locations. Previously CLI was disabled in this case
- A set allowlist is always enforced; multi-user deployments still require one
- Native (hybrid) and loopback desktop installs no longer set an allowlist by default; Docker keeps `/app/workspace`
- Code indexing follows the same policy: an invalid or missing allowlist no longer means unrestricted indexing
- `CHENG_CLI_SANDBOX_PERMISSIVE` is deprecated and ignored
- CLI sessions and code indexing refuse to start in a directory that contains the deployment `.env`

### Security Hardening

**Files:** `deploy/.env.example`, `deploy/docker/docker-compose.yml`, `deploy/generate-env.sh`

- `TRUST_PROXY_HEADERS` is documented in the env template and set for the API container, whose only callers are the UI and app containers on the Docker network
- Desktop CI tests the LAN static-serving and client-address paths and asserts the built `index.html` keeps its CSP nonce placeholder

### Release Tooling

**Files:** `release.sh`, `scripts/check-release-consistency.sh`, `scripts/verify-release-archive.sh`, `scripts/test-release-contract.sh`

- Release contract: authoritative root `VERSION`, `release.sh` as the maintainer entry point, and a consistency gate
- Self-identifying native archives with `.sha256` checksum and detached signature; `scripts/verify-release-archive.sh` verifies them
- One embedded runtime version across all Rust components, surfaced by `--version` and `/health`
- Docker images are published under exact tags with OCI labels and a `release-manifest.json` asset
- Safe native update: checksum/signature verification, staged replacement, versioned backups, bounded health check, automatic restore, and `chengos.sh rollback`
- Version-pinned Docker update and rollback driven by `CHENGOS_VERSION`

---

## Infrastructure

- `VERSION` is `0.3.0`; `release.sh` synchronizes the Cargo workspace versions
- The desktop CI workflow uploads only the `deb` / `msi` artifacts

---

## Upgrade Instructions

### From v0.2.1

```bash
# Online update
./chengos.sh update
```

Existing `.env` files keep their active `CHENG_CLI_ALLOWED_ROOTS` line, so CLI
behavior does not change. To opt into deny-only mode on a single-user install,
comment that line out and restart:

```bash
# deploy/.env
# CHENG_CLI_ALLOWED_ROOTS=...   # commented out to enable deny-only mode

./chengos.sh restart
./chengos.sh doctor
```

A setup that relied on `CHENG_CLI_SANDBOX_PERMISSIVE=true` to tolerate an invalid
allowlist entry now has CLI disabled until the entry is fixed or removed.

### Fresh Install

```bash
# Native binary mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash -s -- --mode native

# Docker mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash
```

---

## Migration Policy

`reversible` — the release adds no destructive schema change, and v0.2.1 can run
against the migrated database. `chengos.sh rollback` is permitted.

---

## Downloads (China mirror)

For users in mainland China, the release archive is also available from Baidu Netdisk:

- **Baidu Netdisk:** https://pan.baidu.com/s/1r053qlQTHuCjvvyxDiWEXw?pwd=tc25 — extraction code: `tc25`

---

## Known Limitations

- Coding agents in Docker stay disabled until the bubblewrap sandbox gate passes under the default policy
- macOS desktop packaging is out of scope until there is a signing identity and a notarization step
- The Windows desktop MSI is built inside the builder VM rather than cross-compiled from Linux

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
