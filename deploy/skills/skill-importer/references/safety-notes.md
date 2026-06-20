# Skill Importer Safety Notes

This file documents the guard rails enforced by the backend nodes that the
`skill-importer` workflow depends on. None of them rely on the LLM behaving
correctly; they are deterministic checks in Rust.

## `tools/fetch_repository`

- **HTTPS only by default.** `http://`, `ssh://`, `git://`, and `git@host:repo`
  are rejected unless the workflow passes `allow_insecure_schemes = true`
  *and* the upstream approval gate has captured admin consent. `file://` and
  every other scheme are always rejected.
- **SSRF guard.** Hostnames and IP literals that resolve to loopback,
  link-local, private (RFC 1918), CGNAT (100.64.0.0/10), IPv6 ULA / link-local,
  multicast, or cloud-metadata aliases (`metadata.google.internal`,
  `169.254.169.254`, `localhost.*`, `*.local`) are rejected before any
  network call.
- Runs `git clone --depth 1`. Branch override is sanitized.
- Harvests only `README.md`, `SKILL.md`, `skill.yaml`, `workflow.json` from the
  repo root. Other files are ignored.
- Hard 2 MiB per-file cap. The temporary directory is cleaned up automatically
  when the node returns.
- HTTP mode honours a 30 s timeout, rejects non-200 responses, and refuses
  bodies larger than the per-file cap.
- `pasted_text` / `skill_md` modes do **not** touch the network; they just
  pass the inline `source_content` through as a single harvested file
  (`pasted.md` or `SKILL.md`).

## `tools/validate_skill_spec`

- Accepts `files` as either a structured array **or** a JSON string (the raw
  `ai/llm.response` text), so it can be wired directly to an LLM node without
  an extra parse step. Recognized shapes:
  * `[{ "path": "...", "content": "..." }, ...]`
  * `"[...]"` (JSON-encoded array as a string)
  * `"{ \"skill_name\": \"...\", \"files\": [...] }"` (the generator-prompt
    object, in which case only the `files` array is consumed)
- Requires `skill.yaml` to be present in the file payload (by basename match or
  `skills/<name>/skill.yaml` path).
- Parses YAML → `CanonicalSkillSpec`. Parse errors short-circuit the workflow.
- **Always** downgrades LLM-proposed `normalization.status = ready` to
  `needs_review` and sets `execution.auto_execute = false`.
- Validates `name` matches the workflow's `skill_name` input.
- **Workflow.json safety scan.** When `workflow.json` is present in the file
  payload, the validator parses it and:
  * **Hard-fails** if any node references a *forbidden* node ID
    (`tools/write_skill_package`, `tools/fetch_repository`, `tools/shell_exec`,
    `tools/code_shell`, `tools/code_python`, `tools/ssh`, any delete-file
    variant). Generated skills cannot recursively trigger the importer or
    schedule shell-level operations.
  * Emits a **warning** if any *high-risk* node (`tools/http`,
    `tools/mail`, `tools/browser`, `tools/subflow`, `tools/batch_subflow`)
    appears without a `utils/approver` somewhere in the workflow.
  * **Hard-fails** if any node references a `nodeType` that is not registered
    in the live ChengOS node registry (e.g. invented IDs like `io/entry_input`
    instead of the real `chat/input` / `chat/output`).
- Surfaces all normalization warnings to the approval card.

## `tools/write_skill_package`

- Accepts `files` and `skill_name` in either typed form or as JSON strings,
  using the same loose-parse rules as `validate_skill_spec`, so it can be
  wired directly to an LLM response.
- Sandboxes writes under `<workspace_root>/<SKILLS_DIR>/<skill_name>/`.
  `SKILLS_DIR` defaults to `skills`.
- `skill_name` must be a kebab-case slug (a-z, 0-9, `-`, `_`). Anything else is
  rejected before any I/O.
- After `create_dir_all`, the destination directory is `canonicalize`d. Every
  written file's parent is also canonicalized and re-checked against the
  sandbox root, defeating path-traversal payloads even when symlinks are
  involved.
- Allowed root files: `SKILL.md`, `skill.yaml`, `workflow.json`.
  Allowed subdirectories: `references/`. Any other path is rejected with
  `DISALLOWED_FILE`.
- Per-file size cap: 2 MiB. Per-package file count cap: 32.
- **Fail-closed on missing `SkillRepository`.** If the repo was not injected
  the node aborts with `REPO_NOT_AVAILABLE` — there is no silent fallback.
  Tests that need to exercise the writer in isolation must either inject an
  in-memory repo or set `CHENG_SKILL_IMPORTER_ALLOW_ANY_CALLER=1`.
- **Restricted-caller enforcement.** When a `SkillRepository` is wired, the
  node looks up the `skill-importer` skill (slug overridable via
  `CHENG_SKILL_IMPORTER_SLUG`) and refuses to run unless the current
  `NodeExecutionContext.workflow_id` matches the importer's linked workflow.
  Bootstrap allowance: if the importer skill is not yet synced into the DB
  the call is permitted with a warning (so the very first import can land).
- If the target skill row exists in the DB and carries
  `metadata.file_watcher.locked = true`, writes are denied with `SKILL_LOCKED`
  unless the workflow passes `force_admin_override = true`. The override is
  expected to come from the approver node, never from the LLM.

## Post-write flow

After `tools/write_skill_package` succeeds:

1. The existing `SkillFileWatcher` (driven by `notify` inotify events) hashes
   the new files, compares against the stored `last_hash`, and triggers
   `skill_normalizer::normalize_skill`.
2. The normalizer re-derives the canonical spec from the on-disk content,
   discarding whatever the LLM wrote into the `normalization` block. The
   backend, not the LLM, is the source of truth for `ready` vs `needs_review`.
3. The Skill row is upserted with `enabled = false` (Zero Trust default for
   external imports).
4. Admins promote the skill to `ready` and `enabled = true` from the Skill UI
   after reviewing `references/analysis.md`, the generated `workflow.json`,
   and the credential setup.

## What this design does *not* trust

- The LLM's claim that a skill is safe.
- Source documentation that says "auto-installable".
- The LLM's choice of file paths (validated against an allow-list).
- The LLM's risk classification (used as a *floor*; admin can ratchet up).
- Any shell command the source documentation suggests running.
