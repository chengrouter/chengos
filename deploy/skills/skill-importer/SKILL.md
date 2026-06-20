---
name: skill-importer
description: Use this skill to import external skills (from a URL, git repository, single SKILL.md document, or pasted text) and convert them into a ChengOS-native skill package — SKILL.md, skill.yaml, workflow.json, and reference notes — that the runtime can safely review and execute.
---

# Skill Importer

> Legacy reference only: the active importer is the workflow named
> `skills_importer`. Keep this package for prompt text, workflow design notes, and
> safety references while migration is in progress; do not treat it as the
> runtime Skill package for new imports.

Use this skill when a user wants to **install or import an external skill** into ChengOS. Inputs may be any of:

- a public git repository URL containing a `SKILL.md`/`skill.yaml`
- a URL to a single `SKILL.md` (or README) document
- raw text the user pastes describing a skill's capability and usage

This skill is a normal ChengOS workflow. Semantic conversion is performed by the LLM nodes inside the workflow; deterministic safety checks (path sandboxing, admin-lock honoring, canonical-spec validation, approval gating) are performed by dedicated backend nodes.

## What this skill produces

For each successful import the workflow writes a package under `skills/<skill-name>/`:

```
skills/<skill-name>/
  SKILL.md          # agent-facing instructions
  skill.yaml        # canonical machine-readable spec
  workflow.json     # executable workflow definition (or stub for review)
  references/
    source.md       # captured / summarized source material
    analysis.md     # LLM reasoning + unresolved assumptions
```

All external imports default to `normalization.status = needs_review` and `enabled = false`. The reviewing admin marks the skill `ready` from the Skill UI once they've verified the generated workflow and credentials.

## Pipeline (workflow.json)

1. **Workflow Input** — collects `source_type`, `source_location`, optional `source_content`, `skill_name_hint`.
2. **Fetch Source** (`tools/fetch_repository`) — git shallow-clones a repo, or HTTP-fetches a single URL, returning in-memory file payloads. The temp directory is removed automatically.
3. **LLM Analyze** (`ai/llm` with `references/import-prompt.md` — *Prompt 1*) — produces structured JSON describing capability, inputs, outputs, dependencies, inferred credentials, risk.
4. **LLM Package Generator** (`ai/llm` — *Prompt 2*) — emits the file list (`SKILL.md`, `skill.yaml`, `workflow.json`, `references/*`).
5. **Validate Spec** (`tools/validate_skill_spec`) — re-parses `skill.yaml` against `CanonicalSkillSpec`, ratchets `status` back to `needs_review`, forces `auto_execute = false`. Halts on validation failure.
6. **Approval Gate** (`tools/approver`) — pauses for user review with the generated diff, risk warnings, and the list of files that will be written.
7. **Write Skill Package** (`tools/write_skill_package`) — sandboxed file writer. Refuses writes outside `skills/<name>/`, refuses to overwrite admin-locked skills unless `force_admin_override` was explicitly granted.
8. **SkillFileWatcher** — detects new files, normalizes through `skill_normalizer`, and registers the skill row with `enabled = false`.

## Safety invariants

- `tools/write_skill_package` is **restricted**: it must only be wired inside this workflow.
- `tools/fetch_repository` performs `git clone --depth 1` and rejects non-`https/http/ssh/git` schemes.
- The validator always downgrades LLM-proposed `ready` → `needs_review`.
- Backend validation re-runs through `cheng_storage::skill_normalizer` after the watcher picks up the files; the LLM's claims are never trusted as the final policy.
- Missing credentials are surfaced through the runtime's `missing_credentials` output, never by editing the generated `skill.yaml` after the fact.

## Trigger phrases

- "Import this skill: <url>"
- "Install the skill from <repo>"
- "Convert this SKILL.md into a ChengOS skill"
- "Help me add this Claude skill / OpenClaw skill / Anthropic skill to ChengOS"

When triggered, ask the user for any missing inputs (source URL / pasted text, preferred slug, branch name for repos), then start the workflow.

## References

- `references/import-prompt.md` — Prompt 1 (analyze) and Prompt 2 (generate package).
- `references/safety-notes.md` — guard rails enforced by the backend nodes.
