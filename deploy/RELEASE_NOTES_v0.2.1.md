# ChengOS v0.2.1 Release Notes

> Release Date: 2026-09-27
> Previous Version: v0.2.0

---

## Overview

v0.2.1 is a deployment-focused patch release. Its headline is an **optional
local decision model (Laya)** added to `ai/decision_branch`, which now routes
through one of **three switchable providers — Jev, Laya, or LLM** — and a
**sign-in-free read-only demo account** for public demos. Alongside them, this
release syncs the decision-provider configuration and routing templates into
`deploy/`, renames the **FlowChat** channel to **ChengApp**, and teaches
`release.sh` to version the `chengflow-ui` desktop app as its own repository.

---

## New Features

### 1. Decision Providers — Jev / Laya / LLM (switchable)

**Files:** `deploy/.env.example`, `deploy/lib/doctor.sh`, `deploy/HARDENING.md`, `deploy/docker/docker-compose.yml`

- **Three switchable providers:** `ai/decision_branch` routes each request through one of three providers, selected per node — **Jev** (hosted typed decision model; the routed request is sent to TypeSafe), **LLM** (a connected chat model used as an uncalibrated baseline), and **Laya** (a local model on this host). Switching providers is a node setting, not a redeploy
- **Local semantic routing (new — Laya):** The **Laya** provider runs `laya serve` (a `ggmlc` GGUF model) on the deployment's own host, so routing decisions never leave the machine. It is **off by default** and operator-managed — users never see or set its address
- **Dedicated port 1215:** Laya is pinned to **1215**, never `8080`, which is `UI_PORT`'s default on the same host; `chengos.sh doctor` now fails if `LAYA_PORT` collides with the API, UI, or app port
- **Hybrid (native) mode:** `start.sh` launches `laya serve` when `LAYA_BIN` and either `LAYA_MODEL_PATH` (one GGUF) or `LAYA_MODELS_DIR` (English + multilingual GGUFs in one server) are set, verifies each GGUF against its pinned `sha256`, and sends one warm-up request
- **Docker mode:** run `laya serve` on the host and point the API container at it with `LAYA_ENDPOINT=http://host.docker.internal:1215`; the compose file now maps `host.docker.internal` to the host gateway
- **Identity by digest:** `laya serve` reports only family names, so `LAYA_ARTIFACT_SHA256` (and the per-family `_MULTILINGUAL` / `_ENGLISH` variants) pin the served GGUF — the only identity a calibration profile can be keyed on
- **Optional auth:** Laya is unauthenticated unless `LAYA_API_KEY` is set; `doctor` fails when a reachable Laya has no token and warns even when it does, because only `cheng-api` should reach it

### 2. Sign-in-free Read-only Demo Account

**Files:** `deploy/.env.example`, `deploy/README.md`

- **No login for visitors:** With `CHENG_DEMO_MODE=true`, `CHENG_DEMO_USER_EMAIL` names an ordinary (non-admin) account; the UI calls `POST /api/v1/auth/demo` and browses the whole app as that account, read-only
- **Fail-closed surface:** Every write, execution REST/WebSocket, login, registration and password change, and reads of credentials, settings, members, channels, MCP and account data return `403 DEMO_MODE_RESTRICTED`
- **Documented setup:** Initialize the demo user, workspace and demo content with demo mode disabled on a trusted network, then stop, set `CHENG_DEMO_MODE=true` and `CHENG_DEMO_USER_EMAIL`, and start again

### 3. Decision Provider Config & Routing Template

**Files:** `deploy/config/decision_providers.toml`, `deploy/config/decision_calibration.toml`, `deploy/config/i18n/nodes/ai-decision_branch.json`, `deploy/workflow-templates/decision-routing/`

- **Provider defaults:** `decision_providers.toml` is the single source of the built-in **Jev** and **LLM** decision-provider defaults, embedded at build time and overridable via `CHENG_DECISION_PROVIDERS_TOML`; the **Laya** provider is configured through the deployment environment instead
- **Calibration profiles:** `decision_calibration.toml` ships measured provider × model × language × task thresholds; an uncalibrated combination is sent to `fallback_out` in `calibrated` mode
- **Node i18n:** `ai-decision_branch` node labels and descriptions added under `deploy/config/i18n/nodes/`
- **Routing template:** New experimental `decision-routing` workflow template (semantic routing to the smallest capable agent), plus updated `main-chat` and `no-memory-chat` templates

---

## Changes

### Packaging & Naming

**Files:** `.github/workflows/desktop.yml`, `README.md`, `deploy/RELEASE_NOTES_v0.2.0.md`

- **Desktop packages:** The desktop CI workflow and the v0.2.0 notes list only `deb` / `msi` artifacts; the Linux build produces `deb` only
- **FlowChat → ChengApp:** The messaging-channel examples in `README.md` (English and Chinese) rename the **FlowChat** channel to **ChengApp**

### Repository Hygiene

**Files:** `.gitignore`

- **Frontend build output ignored:** `deploy/ui/assets/` and `deploy/app/assets/` are no longer tracked — `chengflow/build.sh` regenerates them and the hashed filenames change on every build, so tracking them grew the repository without bound
- **Stray logs ignored:** `rungem.log` added to the ignore list

### Release Tooling

**Files:** `release.sh`

- **`chengflow-ui` versioned as its own repository:** `release.sh` now bumps `chengflow-ui/src-tauri/Cargo.toml` alongside the other manifests, detects whether `chengflow-ui` is a separate git repository, and commits the version bump in the correct repository

---

## Infrastructure

### Release Contract

- `VERSION` is `0.2.1`; `release.sh` synchronizes the Cargo workspace versions and now includes `chengflow-ui/src-tauri/Cargo.toml` in its "files to change" summary and `git add` set

### CI

- `.github/workflows/desktop.yml` uploads only the `deb` / `msi` artifacts

---

## Upgrade Instructions

### From v0.2.0

```bash
# Online update
./chengos.sh update

# Or manual upgrade from local build
./chengflow/build.sh --hybrid
# Transfer dist/chengos-full-linux-amd64-v0.2.1.tar.gz to server
./chengos.sh update
```

### Enabling the Local Laya Decision Model (optional)

```bash
# deploy/.env
LAYA_ENABLED=true
LAYA_PORT=1215
LAYA_BIN=/opt/laya/laya
LAYA_MODEL_PATH=/opt/laya/models/laya_multilingual_f16.gguf
# or, for English + multilingual in one server:
# LAYA_MODELS_DIR=/opt/laya/models
# LAYA_ARTIFACT_SHA256_MULTILINGUAL=<sha256>
# LAYA_ARTIFACT_SHA256_ENGLISH=<sha256>
# LAYA_API_KEY=<token>   # protects both laya serve and cheng-api

./chengos.sh restart
./chengos.sh doctor      # verifies the port and auth posture
```

### Enabling the Public Demo Account

```bash
# deploy/.env
CHENG_DEMO_MODE=false
./chengos.sh start
# Through a trusted network, create the demo user, workspace and demo content
./chengos.sh stop
# Set CHENG_DEMO_MODE=true and CHENG_DEMO_USER_EMAIL=<demo user email>
./chengos.sh start
```

### Fresh Install

```bash
# Native binary mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash -s -- --mode native

# Docker mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash
```

### Downloads (China mirror)

For users in mainland China, the release archive is also available from Baidu Netdisk:

- **Baidu Netdisk:** https://pan.baidu.com/s/1r053qlQTHuCjvvyxDiWEXw?pwd=tc25 — extraction code: `tc25`

---

## Known Limitations

- The local Laya decision model is optional and operator-managed; a served GGUF without a pinned `sha256` is uncalibrated and routes on raw answers only
- Laya listens on all interfaces (`laya serve` has no `--host` option), so the port must be firewalled to the `cheng-api` host or protected with `LAYA_API_KEY`
- The `decision-routing` workflow template is experimental and, with the Jev provider, sends the routed user request to TypeSafe on every turn
- The guided onboarding config and rebuilt UI were reverted before this release and are not included
- macOS desktop packaging is out of scope until there is a signing identity and a notarization step
- The Windows desktop MSI is built inside the builder VM rather than cross-compiled from Linux

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
