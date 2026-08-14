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

## [0.1.0]

### Added

- Initial ChengOS release baseline: workflow engine, REST/WebSocket API, visual
  editor, channel gateway app, and the `cheng` terminal client.

### Notes

- Migration policy: reversible
