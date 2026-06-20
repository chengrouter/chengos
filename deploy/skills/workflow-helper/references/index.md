# Node Discovery Index

This skill does **not** ship a static node catalog. Node type IDs, ports, and
config fields live in the running engine and drift as nodes are added or
refactored. Always discover them live.

> **Authoritative contract:** for workflow JSON shape, field names, port
> handling, and `skipValidation`, see the **Workflow JSON Contract**
> (`docs/workflow-json-generation-guide.md`).

## How to discover nodes

Use the running API or the `tools/workflow_inspect` node:

```bash
BASE=http://localhost:3000/api/v1

# All node types with full input/output schema
curl -s $BASE/nodes/types | jq '.data[] | {typeId, name, category, description}'

# One node's schema (typeId uses / in the path)
curl -s $BASE/nodes/schema/ai/llm | jq '.data'
```

```text
# Via the inspect tool (read-only)
action: list_node_types                       # all registered type IDs
action: list_node_types, category_filter: "…" # filter by category
action: get_node_schema, node_type: "ai/llm"  # one node's full schema
action: list_ports,      node_type: "ai/llm"  # compact port shape
```

Categories are lowercase and are themselves discovered from
`list_node_types` (e.g. `agent`, `ai`, `chat`, `document`, `io`, `rag`, `table`,
`tools`, `ui`, `utils`, `workspace`). Do not assume a fixed category list — read
it back from the engine.

## Requirement → search hint

Map intent to a category keyword, then filter live with `category_filter` or a
name/description search over `list_node_types`:

| If the user wants… | Look in category |
| ------------------ | ---------------- |
| An assistant that decides and calls tools | `agent` |
| LLM calls, embedding / vector config | `ai` |
| Chat input/output, context window, frontend message stream | `chat` |
| Create/edit versioned platform documents, AI draft review | `document` |
| Parse/continue after a user file upload, OCR, speech-to-text | `io` |
| Knowledge-base ingestion and retrieval Q&A | `rag` |
| Query/edit tables, give an LLM the table schema | `table` |
| HTTP, code execution, files, mail, schedule, subflow, skill, MCP | `tools` |
| Script execution, variable templates, credentials, routing, delay | `utils` |
| Page routing and layout assembly | `ui` |
| Edit files on disk (code, Markdown, JSON, config) | `tools/file_ops_hub` |

## Companion references

- `quick-reference.md` — workflow JSON structure and common wiring **shapes**
  (illustrative; confirm every type ID and port against the live schema).
- `edge-types.md` — how edges, ports, tool edges, and `skipValidation` work.
- `field-guide.md` — type-agnostic config patterns (`mode`, `credential_id`,
  LLM model format); exact fields come from `get_node_schema`.
- `troubleshooting.md` — create/execution error playbook.

## Notes

- The source of truth is the Rust node implementation and the runtime node
  registry. Examples in these files are illustrative and must not be trusted as
  a current node list.
- If a node appears in source but is not exported/registered, treat it as
  implementation-dependent.
