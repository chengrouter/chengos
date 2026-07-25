---
name: skill-importer-http-discovery-progress
description: Skill importer HTTP-discovery + full-source-snapshot plan — all 7 steps implemented 2026-07-19
metadata:
  type: project
---

Plan `docs/skill-importer-http-discovery-fetch-development-plan.md` — all 7 steps implemented & compiled green 2026-07-19 (user ran build). Builds on [[tool-rag-artifact-refactor-progress]] / prior agentic-tools-refactor (Steps 1-5 in log/log.md).

- **New shared module** `crates/cheng-nodes/src/nodes/builtin/tools/skill_source_snapshot.rs`: `CHSNAP01` framed container (magic+u32 header len+JSON header+raw payload), `SnapshotEntry`, `SourceCaps` (2048 files/16MiB/256MiB/depth24), `build()`/`parse_and_verify()` (per-entry sha256, path safety, dup/case-conflict, limits). MIME `application/vnd.cheng.skill-source-snapshot`.
- **Step1/2 http_request.rs**: `HttpRequestProfile{General,Discovery}` static field (not in llm_input_fields), `validate_request_profile()` (DISCOVERY_* codes) before approval/network, `read_body_capped()` streamed cap (2MiB discovery via new `MAX_DISCOVERY_RESPONSE_BYTES`, 25MiB general), `filter_discovery_headers()` allowlist, `extract_validated_location()` for 3xx, new output fields `retained_bytes`+`location`.
- **Step3 fetch_repository.rs + repository_harvest.rs**: removed `allow_insecure_schemes` from llm_input_fields; `collect_source_snapshot()` walks whole tree (excl `.git`), byte-preserving, rejects symlink/special/limit; `attach_source_snapshot()` persists snapshot artifact + manifest; new output fields source_snapshot_artifact/source_manifest/source_manifest_artifact/source_file_count/source_total_bytes/source_scan_truncated; fetch_url now streams+caps+no-redirect.
- **Step4 write_skill_package.rs + skill_package_store.rs**: input `source_snapshot: Option<ArtifactRef>` (in llm_input_fields); `resolve_source_snapshot()` verifies mime/scope(exec+wf)/producer/size/sha256 then parse_and_verify then maps under fixed `source/` prefix; store `prepare_source_staged_files()` (byte-preserving, no basename allowlist); combined MAX_STAGED_FILES=2080/MAX_STAGED_BYTES=272MiB.
- **Step5** `config/system-workflows/skills_importer.json`: added `tools/http` discovery node (mode=llm, request_profile=discovery), tool_4 + edge (sourcePort body_preview), rewritten 5-tool routing prompt; `DEFINITION_VERSION` 1→2 in system_workflows.rs.
- Tests added in each module (snapshot round-trip/tamper, collector, discovery profile, store source-prefix, fetcher snapshot, writer resolve happy/wrong-mime, system-workflow 5-tools).

Deferred (plan §6): selective subdir discovery, archive extraction, authed sources, JS pages, dependency install. Producer node_id verification is best-effort (exec+wf matched, not exact fetch node_id).
