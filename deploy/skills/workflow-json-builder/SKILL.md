---
name: workflow-json-builder
description: Use this skill when the online UI chat assistant must guide a user through designing a ChengOS workflow and generate an importable workflow JSON file. The assistant uses Workflow API endpoints for templates, node schemas, and LLM model lists.
---

# Workflow JSON Builder

Use this skill in the online UI chat dialog when the goal is to help the user design a workflow and produce a JSON artifact they can import into the workflow editor.

The assistant calls the separately deployed Workflow API to gather context, then returns workflow JSON to the user.

> **Authoritative contract:** all generated workflow JSON must follow the
> **Workflow JSON Contract** (`docs/workflow-json-generation-guide.md`) — the
> single source of truth for structure, field names, port handling, and
> `skipValidation` semantics. This skill is the UI-chat front end to that
> contract; when in doubt, defer to the contract.

## Allowed APIs

Base URL: use the Workflow service base URL configured by the UI/runtime, then append `/api/v1`.

Read-only discovery:

```text
GET /api/v1/workflows/templates
GET /api/v1/workflows/templates/{id}
GET /api/v1/nodes/types
GET /api/v1/nodes/schema/{nodeType}
GET /api/v1/llm/models
```

## API Details

### GET /api/v1/workflows/templates
Returns all template workflow summaries: name, description, node count, edge count, tags, visibility. LLM uses it to recommend templates, pick by user intent, or explain template purpose. To get full nodes and edges, call `GET /api/v1/workflows/templates/{id}` which returns `definition.nodes` and `definition.edges`.

### GET /api/v1/workflows/templates/{id}
Returns a full template definition with nodes and edges. Use it to adapt an existing workflow instead of inventing everything from scratch.

### GET /api/v1/nodes/types and GET /api/v1/nodes/schema/{nodeType}
Returns node types, categories, descriptions, input JSON Schema, output JSON Schema, and i18n keys. LLM uses it to understand available nodes, how to configure each, what input/output ports exist, which nodes can connect to which, and to generate node config JSON. `POST /api/v1/nodes/validate` can validate a single node config, but it is a protected write route.

### GET /api/v1/llm/models
Returns models grouped by provider, including chat and embedding types. LLM uses it to select models for `ai/llm`, `ai/llm_config`, embedding/RAG nodes, or to fill model names when generating workflow JSON. Note: this endpoint currently does not read user settings, so `enabled` defaults to false; full user-level provider/credential info is in the protected `GET /api/v1/llm/providers`.

## LLM Capabilities

Based on these APIs, the assistant can:

### 1. Analyze node wiring for the user
Read a workflow's `nodes + edges`, then use `/nodes/schema/{nodeType}` to get each node's input/output schema, and check:
- Does the edge's `sourcePort` exist in the source node's outputs?
- Does the edge's `targetPort` exist in the target node's inputs?
- Are data types roughly compatible?
- Are there orphan nodes, nodes with no entry, cycle risks, or missing critical configs?

### 2. Create workflow JSON from natural language
Example flow: user says "I want to upload a file, convert it to text, then let LLM summarize". LLM calls `/nodes/types` to find file upload, document-to-text, LLM, and output nodes; calls `/llm/models` to pick an available model; generates a `CreateWorkflowRequest.definition` with `nodes + edges` (structure matches `workflow_dto.rs` line 189); returns importable JSON.

### 3. Configure or switch LLM models
For an existing workflow, use `GET /api/v1/workflows/{id}/llm-nodes` to find LLM nodes, then `PUT /api/v1/workflows/{id}/llm-nodes/{node_id}` to update model/provider/config (code in `workflow/mod.rs` line 1510). **Note**: these are protected write routes requiring authentication.

### 4. Generate from templates
List templates, read a full template definition, then modify per user needs:
- Replace the model
- Add/remove nodes
- Change prompts/configs
- Adjust wiring
- Generate new workflow JSON or create a copy

### 5. Explain workflows and node capabilities
Because node schemas include `description`, `category`, and `input/output` schemas, LLM can translate a complex workflow into human language: what each step does, how data flows, where credentials are needed, where failures may occur.

## Boundary

The APIs listed above are **read-only discovery**. LLM can analyze, recommend, and generate draft JSON, but cannot truly save. To persist, use `POST /api/v1/workflows` to create; `PUT/PATCH /api/v1/workflows/{id}` to update; `POST /api/v1/nodes/validate` to validate a node config. These protected write routes require authentication.

## Conversation Flow

1. Understand the user's goal in one or two turns.
   - Ask only for missing information that changes the workflow structure, such as input source, desired output, target channel, model preference, schedule, storage destination, or approval step.
   - Do not ask for technical node names unless the user already thinks in nodes.

2. Load discovery context.
   - Call `/nodes/types` first.
   - Call `/workflows/templates` when the goal sounds like a common workflow pattern.
   - Call `/llm/models` if any LLM, embedding, RAG, chat, summarization, classification, extraction, or document reasoning step is needed.

3. Choose a construction strategy.
   - Prefer adapting a matching template.
   - If no good template exists, compose nodes from schemas.
   - Use the smallest workflow that satisfies the user's goal.

4. Draft the workflow.
   - Pick node types by `typeId` (must use format `{category}/{type}` from `/api/v1/nodes/types`).
   - Configure each node from its `inputSchema`.
   - Wire edges by matching source `outputSchema.properties` keys to target `inputSchema.properties` keys.
   - Generate UUID v4 strings for `workflowId`, every `nodeId`, and every `edgeId`. NEVER use semantic names like "input_node".
   - Use readable node names in the user's language.

5. Review the draft before final JSON.
   - Explain the nodes and data flow briefly.
   - Mention any assumptions, missing credentials, or fields the user must fill after import.
   - If the user requests changes, revise the draft and regenerate the JSON.

6. Produce the final artifact.
   - Output one importable JSON object in a fenced `json` block.
   - Do not include comments inside JSON.

## Output JSON Shape

Generate export/import style workflow JSON:

```json
{
  "workflowId": "uuid-v4",
  "name": "Workflow name",
  "description": "What this workflow does",
  "state": "draft",
  "nodeCount": 0,
  "edgeCount": 0,
  "createdAt": "2026-04-26T00:00:00Z",
  "updatedAt": "2026-04-26T00:00:00Z",
  "version": 1,
  "isFavorite": false,
  "isTemplate": false,
  "isDraft": true,
  "tags": [],
  "visibility": "private",
  "skipValidation": true,
  "definition": {
    "nodes": [],
    "edges": []
  }
}
```

Each node (recommended **Strategy A**: omit `inputs`/`outputs` and set top-level
`"skipValidation": true`; the runtime node registry supplies real ports):

```json
{
  "nodeId": "uuid-v4",
  "nodeType": "ai/llm",
  "name": "LLM",
  "position": { "x": 0, "y": 0 },
  "config": {}
}
```

If you instead want server-side validation at import (**Strategy B**), embed
`inputs`/`outputs` as **JSON-Schema objects** and drop `skipValidation`:

```json
{
  "nodeId": "uuid-v4",
  "nodeType": "ai/llm",
  "name": "LLM",
  "position": { "x": 0, "y": 0 },
  "config": {},
  "inputs": {
    "type": "object",
    "properties": { "user_message": { "type": "string" } },
    "required": ["user_message"]
  },
  "outputs": {
    "type": "object",
    "properties": { "response": { "type": "string" } }
  }
}
```

> Never use the `[{ "name": …, "type": … }]` array form for `inputs`/`outputs`.
> The engine reads port names from `properties` keys, so arrays never validate;
> they only appear to work when `skipValidation: true` ignores them — in which
> case omit them (Strategy A). See the Workflow JSON Contract for details.

Each edge:

```json
{
  "edgeId": "uuid-v4",
  "sourceNode": "source-node-uuid",
  "sourcePort": "output",
  "targetNode": "target-node-uuid",
  "targetPort": "input"
}
```

Rules:

- Set `nodeCount` and `edgeCount` to the actual lengths of the nodes and edges arrays.
- Put the complete workflow under `definition.nodes` and `definition.edges`.
- Use `config` for node runtime settings. Empty config `"config": {}` is valid when all options use defaults.
- Prefer Strategy A: omit per-node `inputs`/`outputs` and set top-level `"skipValidation": true`. Only embed them (Strategy B) as JSON-Schema objects (`{ "type": "object", "properties": { … }, "required": [ … ] }`) — never as `[{name,type}]` arrays.
- Keep positions readable: left-to-right flow, about 320 px apart.

## Wiring Rules

Use schema properties as port names.

For an edge:

- `sourcePort` must be an exact key from the source node `outputSchema.properties` (case-sensitive).
- `targetPort` must be an exact key from the target node `inputSchema.properties` (case-sensitive).
- **Required Inputs**: All `required: true` inputs must have incoming edges.
- **No Cycles**: Workflow should be a DAG (directed acyclic graph).
- Prefer matching compatible types: string to string, object to object, array to array, boolean to boolean, number/integer to number/integer.
- If schemas use richer metadata, prefer exact semantic matches over only type matches.
- Avoid connecting one source output to many downstream inputs unless the editor/runtime supports fan-out for that port.
- If a type mismatch is necessary, insert a transform, formatter, smart variable, or LLM node that explicitly converts the value.

## LLM Model Selection

When using `/llm/models`:

- Prefer `modelType: "chat"` for generation, classification, extraction, routing, summarization, and agent steps.
- Prefer `modelType: "embedding"` for indexing, semantic search, vector retrieval, and RAG ingestion.
- If the user names a provider/model, use it if present.
- If no model is specified, choose a reasonable chat model from the returned list and mark it as an assumption in the response.
- Do not invent provider credentials. If a node needs credentials, leave a clear placeholder in `config` or tell the user to bind credentials after import.

## Template Strategy

When adapting a template:

1. Fetch summaries from `/workflows/templates`.
2. Select by name, description, tags, and rough node pattern.
3. Fetch the full template.
4. Preserve useful wiring and replace only what the user needs changed.
5. Generate new IDs unless the UI import flow explicitly allows keeping template IDs.
6. Update workflow name, description, tags, positions, counts, and model/config fields.

## Response Style

During design:

- Be concise and practical.
- Translate user goals into workflow steps, not API implementation details.
- Ask a question only when the answer changes the generated JSON.

Before final JSON, include a short summary:

```text
我会生成这个流程：输入 -> 处理 -> 输出。
需要你导入后补充：API Key / 知识库 ID / webhook 地址。
```

Final answer must include:

- A short note explaining what the workflow does.
- One fenced `json` block containing the full importable workflow JSON.
- A short list of fields the user may need to fill after import, if any.

## Quality Checklist

Before returning JSON, verify:

- All IDs (workflowId, nodeId, edgeId) use UUID v4 format. NEVER use semantic names.
- Ports are either omitted with `skipValidation: true` (Strategy A), or embedded as JSON-Schema objects (Strategy B) — never `[{name,type}]` arrays.
- All required inputs have incoming edges (or rely on `skipValidation` + runtime).
- Every edge references existing node IDs.
- Every edge port exists exactly in the selected node schemas (case-sensitive).
- No cycles in the workflow graph (must be a DAG).
- `nodeCount` equals length of `nodes` array, `edgeCount` equals length of `edges` array.
- LLM model/provider values came from `/llm/models` or are clearly marked as placeholders.
- The JSON is valid, with no comments or trailing commas.
