# Skill Importer — Agent Tool Call Guide

The real files in the workspace are the only source of truth. Use this sequence:

```text
external source only: fetch_repository -> package_path
all package work:    file_ops_hub -> inspect and write package files
                     validate_skill_spec(package_path) -> repair exact issues -> validate again
```

Available tools are `tools/fetch_repository`, `tools/file_ops_hub`, `tools/validate_skill_spec`, `tools/workflow_inspect`.

## 0. Reference files — read these before generating package files

Use `file_ops_hub` (`view_file` operation) to read these reference files from the `skill-importer` package:

| File | When to read | Purpose |
|------|-------------|---------|
| `skill-importer/references/templates/skill.yaml.template` | Before writing `skill.yaml` | Skeleton with all mandatory fields and inline comments |
| `skill-importer/references/templates/workflow.json.template` | Before writing `workflow.json` | Skeleton with correct envelope + `definition.nodes[]` + `definition.edges[]` structure |
| `skill-importer/references/templates/SKILL.md.template` | Before writing `SKILL.md` | Skeleton with frontmatter and section layout |
| `skill-importer/references/workflow-json-generation-guide.md` | Before writing `workflow.json` (detailed) | Full contract: UUID rules, camelCase fields, port strategies, common mistakes, pre-flight checklist |
| `skill-importer/skill.yaml` | As a working example | Real validated skill.yaml with all fields filled in |
| `skill-importer/workflow.json` | As a working example | Real validated workflow.json with correct structure |

## 1. Import an external source with `fetch_repository` — conditional

`fetch_repository` is an **external-ingestion tool**, not a general skill-file
operation. Use it only when the user supplied material that is outside this
workspace and needs to be turned into a new skill package:

| User supplied | Use `fetch_repository`? | Correct next action |
|---|---:|---|
| Git repository URL | Yes | Fetch it, then use the returned `package_path`. |
| Web URL | Yes | Fetch it, then inspect the saved `source/**` evidence. |
| Pasted/forwarded `SKILL.md` or other external source text | Yes | Use the pasted-content mode once to create a new package. |
| An existing package or files already under the workspace `skills/` directory | **No** | Use `file_ops_hub` to inspect, edit, and validate that package. |
| A new skill the agent itself is creating from the user's requirements | **No** | Create/write the package directly with `file_ops_hub`; do not invent an external source to fetch. |
| A repair, validation retry, or continuation of a package created earlier in this run | **No** | Keep using its existing relative package path with `file_ops_hub` and `validate_skill_spec`. |

**Never call `fetch_repository` for `skill-importer`, a template, another
workspace skill, or a package the agent has already created.** It imports
external evidence into a *new* package and refuses to replace an existing one;
it does not read, repair, or initialize a workspace-local skill.

If the source is already present in the workspace, `file_ops_hub` is the sole
file operation tool. Start with `file_tree`, `list_directory`, `view_file`, or
`file_info` on the existing package instead of fetching it again.

### External source examples

Repository:

```json
{"source_type":"repository","source_location":"https://github.com/acme/example.git","branch":"main","harvest_mode":"source_tree"}
```

URL:

```json
{"source_type":"url","source_location":"https://example.com/SKILL.md"}
```

Pasted content:

```json
{"source_type":"skill_md","source_location":"example-skill","source_content":"---\nname: example-skill\n---\n..."}
```

On success, retain `package_path` exactly (for example `skills/example-skill`). Fetch creates `package_path/source/` and refuses to replace an existing package.

**IMPORTANT — Path convention for `file_ops_hub`:**
The `sandbox_root` for `file_ops_hub` is already the workspace skills directory (e.g. `/…/chengflow/skills`). Therefore all `path` arguments to `file_ops_hub` must be **relative to the sandbox root**, NOT prefixed with `skills/`. If `fetch_repository` returns `package_path: "skills/example-skill"`, use `path: "example-skill"` in `file_ops_hub` (drop the leading `skills/`).

Likewise, when calling `validate_skill_spec`, pass `package_path` relative to the sandbox root (e.g. `"example-skill"`, not `"skills/example-skill"`).

## 2. Inspect and edit through `file_ops_hub`

List the package:

```json
{"operation":"file_tree","path":"example-skill","config":{"max_depth":4}}
```

Read source evidence:

```json
{"operation":"view_file","path":"example-skill/source/README.md"}
```

Write a required package file:

```json
{"operation":"write_file","path":"example-skill/SKILL.md","config":{"content":"---\nname: example-skill\n---\n# Example Skill\n...","create_backup":true}}
```

Use the same pattern for `skill.yaml`, optional `workflow.json`, and `references/**`. Do not edit `source/**`. Before overwriting an existing file, read or diff it; use its `expected_sha256` when available. Keep backups enabled and use `list_backups` / `rollback_file` if a mutation must be reversed.

**Mandatory mutation protocol — every target, every time:** Before `edit_file`, `patch_file`, or any overwrite/delete/move operation, call `view_file` or `file_info` for that exact target path in the current agent run. A batch read or remembered earlier content does **not** satisfy this requirement. Before `write_file`/`create_file`, call `file_info` first: if the target exists, inspect it before overwriting; if it is absent, that absence check authorizes creation. After every mutation, verify the resulting target with `view_file`, `file_info`, `diff_file`, `validate_file`, or another appropriate read/verification operation before reporting success.

**If a `file_ops_hub` call fails with "Cannot resolve path", do NOT retry the same path.** Use `list_directory` with `path: "."` to discover the actual directory layout, then adjust. Never repeat a failed path more than once.

Required `skill.yaml` policy — **all fields below are mandatory**.

**Read the skeleton template first:**
```json
{"operation":"view_file","path":"skill-importer/references/templates/skill.yaml.template"}
```

**You can also read an existing skill package as a working example:**
```json
{"operation":"view_file","path":"skill-importer/skill.yaml"}
```

Key fields (see template for full structure):

```yaml
schema_version: "1"
name: example-skill
display_name: Example Skill       # MANDATORY — missing this causes validation failure
description: A short description.
version: 1.0.0
category: productivity
tags: [example]

backend:
  type: workflow                   # MUST be one of: workflow, http, shell, browser, mcp, native_adapter, cli, agentic
                                    # "reference" is NOT valid. Use "workflow" with workflow.json, "agentic" for LLM tools.
  workflow_id: "<UUID>"            # REQUIRED when type=workflow. Use the workflowId from workflow.json.

credentials:
  required: []                     # Each entry MUST be a struct: {name: ..., provider: ...}, NOT a bare string

normalization:
  status: needs_review
  confidence: 0.8
  warnings: []                     # List any uncertainties (e.g. missing date, missing credentials)

source:
  kind: external
  format: chengos
  path: skills/example-skill/skill.yaml
```

**Common validation errors to avoid:**
- Missing `display_name` — always include it.
- Missing `backend.workflow_id` — REQUIRED when `backend.type: workflow`. Use the `workflowId` from `workflow.json`.
- `backend.type: reference` — invalid; use `workflow`, `agentic`, or another valid variant.
- `credentials.required` entries must be structs (`{name: ..., provider: ...}`), not bare strings.
- Never embed credentials or secrets in any file.

## 3. Discover node types, ports, and config fields

There are **two distinct kinds of information** you need before writing `workflow.json`, and they come from **different actions**:

| What you need | Which action | What it returns | Used for |
|---|---|---|---|
| Registered node type IDs | `list_node_types` | All valid `nodeType` values | `nodeType` field on nodes |
| **Connection port names** | **`list_ports`** | Compact input/output port names + types | `sourcePort` / `targetPort` on **edges** |
| Config field names + defaults | `get_node_schema` | Full input schema with all properties | `config` object on **nodes** |

**CRITICAL — ports ≠ config fields:**
- **Ports** are connection endpoints used in edges (`sourcePort`, `targetPort`). Examples: `user_message`, `response`, `data`, `llm_config`, `context`.
- **Config fields** are node parameters set in the `config` object. Examples: `action`, `to`, `subject`, `body`, `run_at`, `mode`.
- **Never use a config field name as a port name in an edge.** This is the #1 cause of validation loops.

### Step-by-step discovery before writing workflow.json

**Context management principle:** `get_node_schema` returns very long output (often thousands of characters per node). Minimize its use. Prefer `list_ports` (compact, ~50 chars per node) for edge wiring, and only call `get_node_schema` when you truly need config field details for a specific node.

1. **List all node types** to confirm valid `nodeType` values:
   ```json
   {"action":"list_node_types","limit":200}
   ```

2. **Batch `list_ports` for all node types you plan to use** — this is cheap and compact:
   ```json
   {"action":"list_ports","node_type":"chat/input"}
   {"action":"list_ports","node_type":"tools/schedule"}
   {"action":"list_ports","node_type":"tools/mail"}
   ```
   Record the output port names (for `sourcePort`) and input port names (for `targetPort`). For well-known nodes like `chat/input` (output: `user_message`) and `chat/output` (input: `context`), you can skip this step.

3. **Write the full workflow.json structure** — nodes, edges, envelope — using the port names from step 2. At this point you have a structurally correct workflow with empty or minimal `config` objects.

4. **Only now, selectively call `get_node_schema`** for nodes where you need to fill in non-obvious config fields:
   ```json
   {"action":"get_node_schema","node_type":"tools/schedule"}
   ```
   Use the returned properties to fill that node's `config` object. **Do not call `get_node_schema` for every node** — only for ones where you don't know the config fields. For simple nodes (chat/input, chat/output), `config: {}` is sufficient.

Treat live schemas and templates as authoritative. Preserve dedicated config and credential nodes and exact port names. If required schema information is unavailable, create a conservative review/reference package and document the limitation.

### workflow.json format

When `backend.type: workflow` is chosen, include a `workflow.json` alongside `skill.yaml`.

**Before writing `workflow.json`, read the authoritative spec and template:**

1. Read the workflow JSON contract via `file_ops_hub`:
   ```json
   {"operation":"view_file","path":"skill-importer/references/workflow-json-generation-guide.md"}
   ```
   This document defines the exact structure (envelope + `definition.nodes[]` + `definition.edges[]`), UUID requirements, camelCase field names, port strategies, and common mistakes.

2. Read the skeleton template:
   ```json
   {"operation":"view_file","path":"skill-importer/references/templates/workflow.json.template"}
   ```

3. Use an existing skill package as a working example — read `skill-importer/workflow.json`:
   ```json
   {"operation":"view_file","path":"skill-importer/workflow.json"}
   ```

**Key rules (summary — full details in the guide):**
- Top-level is an envelope: `{ "workflowId", "name", "skipValidation": true, "definition": { "nodes": [...], "edges": [...] } }`.
- All IDs (`workflowId`, `nodeId`, `edgeId`) must be valid UUIDs.
- Edges use `sourceNode`/`sourcePort`/`targetNode`/`targetPort` (camelCase).
- Set `"skipValidation": true` and omit `inputs`/`outputs` on nodes (Strategy A) unless you have a specific reason to embed schemas.
- **`run_at` must be a full ISO-8601 datetime** (e.g. `"2026-07-24T06:00:00"`), not a bare time like `"06:00"`. If the user only specifies a time without a date, pick the next occurrence and note it in `normalization.warnings`.
- **Use `workflow_inspect` with `list_ports`** to discover connection port names for each node type before writing edges. Use `get_node_schema` only for config field details. **Never confuse config field names with port names** — this causes validation loops.

## 4. Validate the on-disk package

```json
{"package_path":"example-skill"}
```

When `valid` is false, use every structured issue:

```text
file: skill.yaml
field: credentials.required[0].provider
message: provider is required
```

Edit that exact file and field, then validate the same `package_path` again. Preserve and report warnings.

### Loop avoidance — CRITICAL

If the same `issue_fingerprint` remains after **one** real repair attempt, **stop retrying and emit `FinalAnswer`** explaining the unresolved issues. Do NOT call `validate_skill_spec` again with the same arguments.

If you receive a `[LOOP_DETECTED]` or **any** `[PROTOCOL_VIOLATION: ...]` observation:
1. Do NOT repeat the same tool call with the same arguments.
2. Follow the violation's instruction literally before taking the next mutation. In particular, after `WRITE_WITHOUT_PRE_READ`, read the named target with `view_file` or `file_info`; do not retry the write because you read it in an earlier batch.
3. If the issue is a path error, use `list_directory` with `path: "."` to discover the correct layout.
4. If the issue is a validation error you cannot fix (e.g. missing user-provided info like a specific date), emit `FinalAnswer` with a clear explanation of what is blocking and what user input is needed.
5. If you have already written the package files but validation fails on a fixable field, fix it via `file_ops_hub` `write_file` with `overwrite: true`, then validate **once more**. If it still fails, stop.
6. **If validation reports invalid edge ports** (e.g. "port not found"), do NOT guess new port names or re-read `get_node_schema`. Instead, call `list_ports` for the specific `node_type` to get the correct port names, fix the edges, then validate once. If it still fails, stop and emit `FinalAnswer`.

When `valid` is true, report `package_path`, files created or changed, fetch/validation warnings, and that the Skill remains in `needs_review` with automatic execution disabled.
