# Changelog

All notable changes to ChengOS are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Each released section is committed *before* its annotated tag, so the GitHub
Release body is always reproducible from the tagged source.

## Release note conventions

Every release section must declare its rollback compatibility so operators and
`chengos.sh rollback` agree on what is safe:

- `Migration policy: reversible` — the release adds no destructive schema change
  and the previous release can run against the migrated database. Automatic
  rollback is permitted.
- `Migration policy: irreversible` — the release drops or rewrites data that the
  previous release cannot read. Automatic rollback is refused; the manual
  recovery procedure in `chengflow/docs/release-operations-guide.md` applies.

## [Unreleased]

## [0.3.0] - 2026-10-24

### Release notes

<!-- Maintainer: describe the user-facing changes, required migration
     steps, and any rollback limitation before publishing. -->

### Changed

- chore(sandbox): document deny-only CLI sandbox mode and update environment templates
- chore(deploy): document TRUST_PROXY_HEADERS and gate the desktop LAN build
- docs(release): 只保留最新发布说明 v0.2.1
- chore: uqdate deploy/hybrid/install directory

### Fixed

- fix(deploy): run managed PostgreSQL on a free port when 5432 is taken

### Other

- New features: Native installation and configuration for Codex and Claude Code, browser handoff setup, and OpenWrt router packaging. Changes: Single-user deployments without an allowlist now switch to “deny-only” mode instead of directly disabling the CLI; TRUST_PROXY_HEADERS has been documented; version pinning and rollback have been added to the release process. Upgrade notes: Upgrading from v0.2.1, changes in CLI sandbox behavior, and the impact of the deprecation of CHENG_CLI_SANDBOX_PERMISSIVE. Migration strategy: Reversible, consistent with the Unreleased statement in CHANGELOG.md.
- Add browser handoff and remembered-profile settings to deployment config.
- Add OpenWrt appliance packaging and tighten Claude Code shell defaults.
- Add Claude Code task-mode setup beside the Codex installer.
- Add single-user web default scope to the Codex setup
- Add native coding-agent CLI (Codex) setup to the deployment tooling

### Notes

- Migration policy: reversible

## [0.3.0] - 2026-10-24

### Release notes

See `deploy/RELEASE_NOTES_v0.3.0.md` for the full user-facing notes, upgrade
steps, and known limitations.

### Added

- Native coding-agent CLI setup for Codex (npm-verified, no Node required) and
  Claude Code, with activation probes and one locked `.env` transaction.
- Single-user web default scope for coding agents (`--enable-web-default-scope`),
  refused unless sign-in mode is `single` with managed credentials on.
- Browser handoff and remembered-profile settings in deployment config.
- OpenWrt appliance packaging under `deploy/openwrt/`.
- Release contract: authoritative root `VERSION`, `release.sh` maintainer entry
  point, and `scripts/check-release-consistency.sh` validation gate.
- Self-identifying build outputs: versioned native archive with `.sha256`
  checksum and detached signature, plus `scripts/verify-release-archive.sh`.
- One embedded runtime version across all Rust components
  (`cheng_common::version`), surfaced by `cheng-api --version`, `cheng --version`
  and the `/health` response.
- Immutable Docker releases: API/UI/App/CLI images published under exact tags
  with OCI version/revision/source labels and a `release-manifest.json` asset.
- Safe native update with checksum/signature verification, staged replacement,
  versioned backups, bounded health check, automatic restore, and
  `chengos.sh rollback`.
- Version-pinned Docker update and rollback driven by `CHENGOS_VERSION`.
- Release gates (`scripts/test-release-contract.sh`) and the operations guide
  `chengflow/docs/release-operations-guide.md`.

### Changed

- CLI sandbox: single-user deployments without `CHENG_CLI_ALLOWED_ROOTS` now
  run CLI sessions in deny-only mode (any readable directory except system,
  home, credential, and `.env` locations) instead of disabling them. A set
  allowlist is always enforced, multi-user deployments still require one, and
  an allowlist entry can no longer expose a protected system directory. New
  native (hybrid) and loopback desktop installs no longer set an allowlist by
  default; Docker keeps `/app/workspace`.
- Code indexing follows the same policy: an invalid or missing allowlist no
  longer means unrestricted indexing, and protected locations are refused.
- `CHENG_CLI_SANDBOX_PERMISSIVE` is deprecated and ignored.

### Notes

- Upgrading: existing `.env` files keep their active `CHENG_CLI_ALLOWED_ROOTS`
  line, so CLI behavior does not change. To opt into deny-only mode on a
  single-user install, comment that line out and restart. A setup that relied
  on `CHENG_CLI_SANDBOX_PERMISSIVE=true` to tolerate an invalid allowlist entry
  now has CLI disabled until the entry is fixed or removed.
- CLI sessions and code indexing can no longer start in a directory that
  contains the deployment `.env` (for example the install root or `/opt`),
  even if it is allowlisted. Start from the workspace or a project directory.
- Migration policy: reversible

## [0.2.1] - 2026-09-27

### Release notes

<!-- Maintainer: describe the user-facing changes, required migration
     steps, and any rollback limitation before publishing. -->

### Added

- feat(deploy): optional local Laya decision model
- feat(deploy): guided onboarding config and rebuilt UI

### Changed

- chore(release): 移除 rpm 打包并统一 FlowChat 为 ChengApp
- chore(deploy): 同步 chengflow 的决策配置与路由模板
- chore(deploy): 忽略前端构建产物与杂散日志
- docs(deploy): document the sign-in-free demo account

### Other

- revert(deploy): drop guided onboarding config and rebuilt UI
-  版本0.2.0修复构建脚本

### Notes

- Migration policy: reversible

## [0.2.0] - 2026-09-20

### Release notes

v0.2.0 is a packaging and deployment release. ChengOS now ships real installers
instead of a source checkout: a desktop application with an embedded engine, an
Android mobile app, and native `.deb` / `.rpm` packages for Linux (plus `.msi`
on Windows). It also hardens the self-hosted deployment path (Cloudflare Tunnel
origin, configurable trusted-proxy set and listen interface, `chengos.sh
doctor`) and unifies every component under a single `0.2.0` version. The backend
port is now `19225`. See `deploy/RELEASE_NOTES_v0.2.0.md` for the full notes.

### Added

- feat(deploy): add `chengos.sh doctor`; fix doc placement and scrub hostnames
- feat(deploy): add a Cloudflare Tunnel path for the origin
- feat(deploy): make the trusted proxy set and listen interface configurable
- feat(deploy): cloud trial runtime config, release gates and migration checks

### Changed

- chore(release): require ui-server, app-server and http-hardening in the archive
- docs(deploy): add a public-deployment hardening runbook
- chore: stop tracking internal docs/ working documents
- chore: ignore the desktop build staging directory
- chore: desktop app plan and CI workflow (pre-existing)

### Fixed

- fix(release): commit the chengapp version bump in its own repository

### Other

- harden(deploy): stop exposing the API itself in native installs
- harden(deploy): close the native servers' scan hole, wire the Cloudflare edge
-  版本统一化/后端端口修改为19225
-  构建桌面应用
-  demo模式/chengflow-sdk-open-source-plan
-  plan all ok
-  agent-truncation-layer-consolidation-development-plan

### Notes

- Migration policy: reversible

## [0.1.2] - 2026-08-23

### Release notes

<!-- Maintainer: describe the user-facing changes, required migration
     steps, and any rollback limitation before publishing. -->

### Fixed

- fix: restore deleted config images

### Other

-  v0.1.2 is a patch release spanning two days of development across **chengflow** (backend), **chengflow-ui** (frontend), and **chengapp** (desktop/mobile app). This release focuses on **message compression & port schema validation**, **approval whitelist persistence fixes**, **think/tool-call rendering fixes**, **execution archive trace excerpts**, **ChengApp Android build support**, and the **web translation browser extension**.
-  v 0.1.1 版本更新

### Notes

- Migration policy: reversible

## [0.1.1] - 2026-08-19

### Release notes

<!-- Maintainer: describe the user-facing changes, required migration
     steps, and any rollback limitation before publishing. -->

### Added

- feat: release.sh tags all source repos with unified version

### Fixed

- fix: restore deleted config images and update deploy scripts

### Other

- readmd.md Update
- V0.1.0
- 修复 CI: shellcheck 过滤不存在的脚本，避免 chengflow/build.sh 缺失时报错
- 回退版本到 0.1.0
- 回退版本到 0.1.0
- CI 修复：chengflow 不在仓库时跳过 Cargo 版本检查，精简 release.yml 为纯验证
- V0.1.0

### Notes

- Migration policy: reversible

## [0.1.0]

### Added

- Initial ChengOS release baseline: workflow engine, REST/WebSocket API, visual
  editor, channel gateway app, and the `cheng` terminal client.

### Notes

- Migration policy: reversible
