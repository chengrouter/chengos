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

### Added

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

### Notes

- Migration policy: reversible

## [0.2.0] - 2026-09-20

### Release notes

<!-- Maintainer: describe the user-facing changes, required migration
     steps, and any rollback limitation before publishing. -->

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
