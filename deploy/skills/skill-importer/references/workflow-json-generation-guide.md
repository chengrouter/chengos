# ChengOS / ChengFlow Workflow JSON Contract

> The single authoritative spec for generating importable workflow JSON.
> When an LLM (importer prompt, `workflow-helper`, `workflow-json-builder`, or any
> agent) emits a workflow, it must follow **this** contract.

This document describes the **wire shape and the rules** — structure, field
names, validation, and common mistakes. It deliberately does **not** list node
types, port names, or config keys, because those live in the running engine and
drift over time. Always discover them live (see *Live Discovery*).

---

## 1. Golden Rules

These are the rules that, if broken, cause almost every failed import:

1. **All IDs are UUIDs.** `workflowId`, every `nodeId`, every `edgeId` must be a
   valid UUID (v4). Never use semantic IDs like `chat-input` or `node-001`.
2. **The core structure is `definition.nodes[]` and `definition.edges[]`.**
   Everything that matters about graph shape lives there.
3. **Edges use exactly these fields:** `sourceNode`, `sourcePort`, `targetNode`,
   `targetPort` (plus `edgeId`). `sourceNode`/`targetNode` are UUIDs that match a
   node's `nodeId`. `sourcePort`/`targetPort` are port **names**.
4. **Port names must come from the real node schema**, fetched live — never
   guessed from memory or copied from an old example.
5. **`nodeType` must be a registered type ID** (`category/name`, e.g. `ai/llm`),
   confirmed via `list_node_types`. Never invent a type ID.
6. **Use `skipValidation: true` when you do not embed full port schemas** (see
   §5). The runtime node registry then supplies each node's real ports.
7. **Keep config/helper nodes as separate connected nodes.** When a template or
   schema shows a dedicated config/credential node (e.g. an LLM-config or
   vector-config node) wired into a consumer, preserve that node and its edge.
   Do not inline its values into the consumer's `config` — that breaks wiring and
   credential resolution.

---

## 2. Field naming: camelCase on the wire

The import/export DTOs are camelCase (`serde(rename_all = "camelCase")`). Use the
import/API names — **never** the snake_case names that some inspection summaries
print.

| Use (wire / import) | Do **not** use |
| ------------------- | -------------- |
| `nodeId`            | `node_id`      |
| `nodeType`          | `node_type`    |
| `edgeId`            | `edge_id`      |
| `sourceNode`        | `source_node`, `source` |
| `sourcePort`        | `source_port`, `source_output` |
| `targetNode`        | `target_node`, `target` |
| `targetPort`        | `target_port`, `target_input` |

`tools/workflow_inspect` returns a *summary* view that may use different keys
(e.g. `source`/`target` on edges); those are read-only inspection names. When you
**write** `workflow.json`, always use the camelCase import names above.

---

## 3. Structure

A workflow is an envelope wrapping a `definition`:

```json
{
  "workflowId": "<UUID>",
  "name": "My Workflow",
  "description": "Optional description",
  "state": "draft",
  "version": 1,
  "tags": [],
  "visibility": "private",
  "definition": {
    "nodes": [],
    "edges": []
  }
}
```

- `name` is required (1–100 chars). `description` is optional (≤500 chars).
- `definition` carries the graph. `definition.nodes` and `definition.edges` are
  the authoritative structures.
- Envelope fields like `state`, `version`, `tags`, `visibility` are accepted on
  the export shape; the create/import endpoint primarily needs `name` and
  `definition` (plus `skipValidation` when used).
- `definition` may also carry `notes` and `containers` (e.g. loop containers) —
  omit them unless the workflow actually uses those features.

### Node object

```json
{
  "nodeId": "<UUID>",
  "nodeType": "ai/llm",
  "name": "Display Name",
  "position": { "x": 100, "y": 200 },
  "config": {}
}
```

| Field      | Required | Notes |
| ---------- | -------- | ----- |
| `nodeId`   | ✅       | UUID, referenced by edges |
| `nodeType` | ✅       | Registered type ID, `category/name` |
| `name`     | ✅       | Display label (any language) |
| `position` | optional | `{ "x", "y" }`; defaults to origin |
| `config`   | optional | Node runtime settings; `{}` is valid when defaults suffice |
| `inputs`   | optional | Port schema — see §5 |
| `outputs`  | optional | Port schema — see §5 |

### Edge object

```json
{
  "edgeId": "<UUID>",
  "sourceNode": "<source nodeId UUID>",
  "sourcePort": "response",
  "targetNode": "<target nodeId UUID>",
  "targetPort": "user_message"
}
```

All five fields are required. `sourceNode`/`targetNode` must equal the `nodeId`
of an existing node (or container id). `sourcePort` must be a real **output**
port name on the source; `targetPort` a real **input** port name on the target.

---

## 4. What validation actually checks

On create/import (when validation is **not** skipped), the engine runs
`WorkflowValidator::validate`, which enforces:

1. **Structure** — every edge's `sourceNode`/`targetNode` resolves to an existing
   node (or container), the `sourcePort` exists in the source node's declared
   outputs, and the `targetPort` exists in the target node's declared inputs.
2. **No cycles** — the graph must be a DAG.
3. **Connections** — required inputs are connected or have defaults, and
   connected port types are compatible.

The key subtlety: structure validation reads each node's **declared** input/output
schema from the JSON you submit. If you do not embed those schemas, the node has
*no* declared ports, so every edge's port-existence check fails — unless you skip
validation. That is exactly what §5 is about.

---

## 5. Ports: `inputs` / `outputs` — two valid strategies

`inputs` and `outputs` are **JSON Schema objects**, not arrays. The engine reads
port names from `inputs.properties` / `outputs.properties` (via `has_input` /
`has_output`). There are two correct ways to satisfy the contract:

### Strategy A — Omit ports, set `skipValidation: true` (recommended)

Leave `inputs`/`outputs` off each node and set top-level `"skipValidation": true`.
The import skips structure/connection validation, and the runtime node registry
hydrates each node's real ports at execution time. Your only job is to wire edges
to the **correct port names**, which you get from live discovery (§6).

```json
{
  "name": "Summarize",
  "skipValidation": true,
  "definition": {
    "nodes": [
      { "nodeId": "input-node", "nodeType": "chat/input", "name": "Input", "config": {} },
      { "nodeId": "llm-config-node", "nodeType": "ai/llm_config", "name": "LLM Config", "config": {} },
      { "nodeId": "llm-node", "nodeType": "ai/llm", "name": "LLM", "config": {} },
      { "nodeId": "output-node", "nodeType": "chat/output", "name": "Output", "config": {} }
    ],
    "edges": [
      { "edgeId": "input-to-llm", "sourceNode": "input-node", "sourcePort": "user_message", "targetNode": "llm-node", "targetPort": "user_message" },
      { "edgeId": "config-to-llm", "sourceNode": "llm-config-node", "sourcePort": "llm_config", "targetNode": "llm-node", "targetPort": "llm_config" },
      { "edgeId": "llm-to-output", "sourceNode": "llm-node", "sourcePort": "response", "targetNode": "output-node", "targetPort": "context" }
    ]
  }
}
```

### Strategy B — Embed full JSON-Schema ports, no skip

Only if you want server-side validation at import time. Embed each node's real
schema as an **object with `properties`**, matching the live schema exactly:

```json
{
  "nodeId": "…",
  "nodeType": "ai/llm",
  "name": "LLM",
  "config": {},
  "inputs": {
    "type": "object",
    "properties": {
      "user_message": { "type": "string" }
    },
    "required": ["user_message"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "response": { "type": "string" }
    }
  }
}
```

> ⚠️ **Do not use the `[{ "name": …, "type": … }]` array form for ports.** The
> validator reads `properties` keys; an array has none, so `has_input`/`has_output`
> return false and validation fails. An array only ever "works" by accident when
> `skipValidation: true` makes the engine ignore the field entirely — in which
> case you should just omit it (Strategy A).

**Pick A unless you have a specific reason to embed schemas.** Mixing — embedding
ports on some nodes but not others — means you must keep `skipValidation: true`.

---

## 6. Live Discovery — never memorize node types or ports

Node type IDs, port names, and config keys live in the running engine and change
as nodes are added or refactored. Treat the engine as the source of truth.

### Preferred: `tools/workflow_inspect` (for agents/workflows)

A read-only tool. Use its `action` field (not `operation`). Actions:

| `action`            | Purpose |
| ------------------- | ------- |
| `list_node_types`   | All registered node type IDs (supports `node_filter`, `category_filter`). The **only** valid source of `nodeType` values. |
| `list_ports`        | Compact port shape (name / type / required) for one `node_type`. **Use this for edge port names** (`sourcePort` / `targetPort`). |
| `get_node_schema`   | Full input/output schema for one `node_type` (alias `describe_node_type`). Use this for **config field** details, NOT for edge port names. |
| `list_workflows`    | List template workflows (`is_template=true`). |
| `get_workflow`      | Full node/edge definition of one workflow — use a matching template as a structural reference. |
| `find_replacements` | Given invalid `node_types`, suggest valid candidates. |
| `get_execution` / `list_executions` | Inspect run status / node outputs. |

> ⚠️ **Ports vs config fields — do not confuse them.**
> `list_ports` returns **connection port names** used in edges (`sourcePort`, `targetPort`). Examples: `user_message`, `response`, `data`, `llm_config`, `context`.
> `get_node_schema` returns **config field names** used in the node's `config` object. Examples: `action`, `to`, `subject`, `body`, `run_at`.
> **Using a config field name as an edge port is the #1 cause of validation loops.** Always use `list_ports` for edge wiring.

> 💡 **Context management — minimize `get_node_schema` calls.**
> `get_node_schema` returns very long output (often thousands of characters per node), which can flood the context window and obscure the port names you actually need. The recommended workflow is:
> 1. Call `list_ports` for all node types you plan to use (compact, ~50 chars each).
> 2. Write the full workflow structure with correct edges using those port names.
> 3. Only then, selectively call `get_node_schema` for nodes where you need to fill in non-obvious config fields.
> 4. For simple nodes like `chat/input` and `chat/output`, `config: {}` is sufficient — skip `get_node_schema` entirely.

Canonical agent call form:

```text
tools/workflow_inspect(<instance_id>) {"mode":"manual","action":"list_node_types"}
```

### Alternative: REST discovery (for the UI chat builder)

Read-only endpoints under `/api/v1`:

```text
GET /api/v1/nodes/types               # all node types + input/output JSON Schema
GET /api/v1/nodes/schema/{nodeType}   # one node's schema (nodeType uses / in the path)
GET /api/v1/workflows/templates       # template summaries
GET /api/v1/workflows/templates/{id}  # full template definition (nodes + edges)
GET /api/v1/llm/models                # available chat / embedding models
```

Allowed `nodeType` values are exactly those returned by `list_node_types` /
`/nodes/types`, **plus** any type IDs already present in an inspected template.

---

## 7. Common Mistakes

| Mistake | Fix |
| ------- | --- |
| Semantic IDs (`chat-input`, `node-1`) | Use UUIDs for `workflowId`, `nodeId`, `edgeId`. |
| snake_case edge fields (`source_node`, `source_output`) | Use `sourceNode`/`sourcePort`/`targetNode`/`targetPort`. |
| Guessed/old `nodeType` | Confirm via `list_node_types`. Type IDs drift — do not trust old examples. |
| Guessed port names | Confirm via `list_ports` (NOT `get_node_schema`), or copy from a template. Config field names are NOT port names. |
| Ports as `[{name,type}]` array | Use the JSON-Schema object form (§5) or omit + `skipValidation: true`. |
| Omitting ports without `skipValidation` | Add `"skipValidation": true`. |
| Inlining a config/credential node's values | Keep the dedicated node and its edge. |
| Edge references a non-existent `nodeId` | Every `sourceNode`/`targetNode` must match a node's `nodeId`. |
| Cycle in the graph | Workflows must be DAGs. |

---

## 8. Pre-flight Checklist

Before returning workflow JSON, verify:

- [ ] `workflowId`, every `nodeId`, every `edgeId` is a valid UUID.
- [ ] Every `nodeType` came from `list_node_types` (or an inspected template).
- [ ] Edges use `sourceNode`/`sourcePort`/`targetNode`/`targetPort` (camelCase).
- [ ] Every `sourcePort`/`targetPort` is a real port from `list_ports` (NOT `get_node_schema` field names).
- [ ] Every edge's `sourceNode`/`targetNode` matches an existing node `nodeId`.
- [ ] Ports are either omitted with `skipValidation: true`, or embedded as
      JSON-Schema **objects** (never `[{name,type}]` arrays).
- [ ] Required inputs are connected (or rely on `skipValidation` + runtime).
- [ ] Dedicated config/credential nodes are kept and wired, not inlined.
- [ ] The graph is a single connected DAG (no cycles).
- [ ] The JSON is valid: no comments, no trailing commas.

---

## 9. Minimal Example

A tiny "input → LLM config → LLM → output" flow using Strategy A. **Confirm
every `nodeType` and port against `list_node_types` / `get_node_schema` before
trusting this shape** — it is a structural illustration, not a
guaranteed-current node list.

```json
{
  "workflowId": "11111111-1111-4111-8111-111111111111",
  "name": "Simple Chat",
  "state": "draft",
  "skipValidation": true,
  "definition": {
    "nodes": [
      {
        "nodeId": "22222222-2222-4222-8222-222222222222",
        "nodeType": "chat/input",
        "name": "User Input",
        "position": { "x": 0, "y": 0 },
        "config": {}
      },
      {
        "nodeId": "33333333-3333-4333-8333-333333333333",
        "nodeType": "ai/llm_config",
        "name": "LLM Config",
        "position": { "x": 280, "y": -120 },
        "config": {}
      },
      {
        "nodeId": "44444444-4444-4444-8444-444444444444",
        "nodeType": "ai/llm",
        "name": "LLM",
        "position": { "x": 320, "y": 0 },
        "config": {}
      },
      {
        "nodeId": "55555555-5555-4555-8555-555555555555",
        "nodeType": "chat/output",
        "name": "Reply",
        "position": { "x": 640, "y": 0 },
        "config": {}
      }
    ],
    "edges": [
      {
        "edgeId": "66666666-6666-4666-8666-666666666666",
        "sourceNode": "22222222-2222-4222-8222-222222222222",
        "sourcePort": "user_message",
        "targetNode": "44444444-4444-4444-8444-444444444444",
        "targetPort": "user_message"
      },
      {
        "edgeId": "77777777-7777-4777-8777-777777777777",
        "sourceNode": "33333333-3333-4333-8333-333333333333",
        "sourcePort": "llm_config",
        "targetNode": "44444444-4444-4444-8444-444444444444",
        "targetPort": "llm_config"
      },
      {
        "edgeId": "88888888-8888-4888-8888-888888888888",
        "sourceNode": "44444444-4444-4444-8444-444444444444",
        "sourcePort": "response",
        "targetNode": "55555555-5555-4555-8555-555555555555",
        "targetPort": "context"
      }
    ]
  }
}
```
