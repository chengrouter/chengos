---
name: workflow-json-builder
description: Use this skill when the online UI chat assistant should guide a user through designing a ChengOS workflow and produce an importable workflow JSON file. It uses read-only APIs for templates, node schemas, and the model catalog; it does not create, save, or run workflows.
---

# Workflow JSON Builder

Use this skill in the online UI chat dialog when the user wants to design a workflow and receive a JSON artifact to import into the workflow editor. If the user wants the assistant to create, save, and run the workflow, use `workflow-creator` instead.

Use the Workflow service API configured by the UI/runtime to gather context, then return workflow JSON to the user.

> **Authoritative contract:** all generated workflow JSON must follow the
> **Workflow JSON Contract** (`docs/workflow-json-generation-guide.md`) — the
> single source of truth for structure, field names, port handling, and
> validation. This skill is the UI-chat front end to that
> contract; when in doubt, defer to the contract.
>
> **Scope & contract boundary:** this skill emits the canonical nested
> `WorkflowFileV1` file shape (`name` plus `definition`), not an API
> `CreateWorkflowRequest`. Use camelCase wire fields and UUIDs for IDs. Never
> emit the flat snake_case shape (`node_type`, `node_config`, `source_port`) —
> the canonical decoder rejects it. Do not include `skipValidation`: it is not
> a file-import feature. Agents that should create a workflow directly should
> prefer `tools/import_workflow` structured create mode, which validates live
> schemas before writing.

## Allowed APIs

Base URL: use the Workflow service base URL configured by the UI/runtime, then append `/api/v1`.

Read-only discovery:

```text
GET /api/v1/workflows/templates
GET /api/v1/workflows/templates/{id}
GET  /api/v1/nodes/directory
GET  /api/v1/nodes/schema/{nodeType}
POST /api/v1/nodes/schemas:resolve   (read-only batch schema lookup)
GET /api/v1/llm/models
```

## API Details

### GET /api/v1/workflows/templates
Returns all template workflow summaries: name, description, node count, edge count, tags, visibility. LLM uses it to recommend templates, pick by user intent, or explain template purpose. To get full nodes and edges, call `GET /api/v1/workflows/templates/{id}` which returns `definition.nodes` and `definition.edges`.

### GET /api/v1/workflows/templates/{id}
Returns a full template definition with nodes and edges. Use it to adapt an existing workflow instead of inventing everything from scratch.

### GET /api/v1/nodes/directory, GET /api/v1/nodes/schema/{nodeType}, POST /api/v1/nodes/schemas:resolve
`/nodes/directory` returns every node type's `typeId`, name, category, description, and `schemaHash`, without schemas. `/nodes/schema/{nodeType}` returns one node's input and output JSON Schema; `schemas:resolve` with `{"items":[{"typeId":"…"}]}` returns several at once. Pick candidates from the directory, then fetch schemas only for those. (`GET /api/v1/nodes/types` still returns every schema in one response but is deprecated.) Use these read-only schemas to understand available nodes, configuration, input/output ports, and possible connections.

### GET /api/v1/llm/models
Returns the model catalog grouped by provider; each model includes `model_type` such as `chat` or `embedding`. This catalog does not reflect a user's saved provider settings or credentials, and `enabled` currently defaults to false. Do not treat it as a definitive list of models configured for the user. If the user names a model absent from this catalog, preserve the requested model and disclose that provider/credential setup may be needed; do not substitute another model or invent credentials.

## LLM Capabilities

Based on these APIs, the assistant can:

### 1. Analyze node wiring for the user
For a workflow definition supplied by the user or fetched from a template, use `/nodes/schema/{nodeType}` to get each node's input/output schema, and check:
- Does the edge's `sourcePort` exist in the source node's outputs?
- Does the edge's `targetPort` exist in the target node's inputs?
- Are data types roughly compatible?
- Are there orphan nodes, nodes with no entry, cycle risks, or missing critical configs?

### 2. Create workflow JSON from natural language
Example flow: user says "I want to upload a file, convert it to text, then let LLM summarize". Find candidate nodes through `/nodes/directory`, fetch their schemas, and produce a canonical `WorkflowFileV1` envelope with `name` and nested `definition.nodes` / `definition.edges`.

### 3. Generate from templates
List templates, read a full template definition, then modify per user needs:
- Replace the model
- Add/remove nodes
- Change prompts/configs
- Adjust wiring
- Generate JSON for a new workflow or adapted copy

### 4. Explain workflows and node capabilities
Because node schemas include `description`, `category`, and `input/output` schemas, LLM can translate a complex workflow into human language: what each step does, how data flows, where credentials are needed, where failures may occur.

## Boundary

The APIs listed above are **read-only discovery**. This skill can analyze, recommend, and generate draft JSON, but must not create, update, save, validate through protected write APIs, or run a workflow. If the user wants an end-to-end created and executed workflow, use `workflow-creator`.

## Conversation Flow

1. Understand the user's goal in one or two turns.
   - Ask only for missing information that changes the workflow structure, such as input source, desired output, target channel, model preference, schedule, storage destination, or approval step.
   - Do not ask for technical node names unless the user already thinks in nodes.

2. Load discovery context.
   - Call `/nodes/directory` first, then fetch schemas for the candidate nodes.
   - Call `/workflows/templates` when the goal sounds like a common workflow pattern.
   - Call `/llm/models` if any LLM, embedding, RAG, chat, summarization, classification, extraction, or document reasoning step is needed.

3. Choose a construction strategy.
   - Prefer adapting a matching template.
   - If no good template exists, compose nodes from schemas.
   - Use the smallest workflow that satisfies the user's goal.

4. Draft the workflow.
   - Pick node types by `typeId` (must use format `{category}/{type}` from `/api/v1/nodes/directory`).
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

Generate the canonical nested workflow-file envelope. Do not include server-owned fields such as `nodeCount`, `edgeCount`, `createdAt`, `updatedAt`, `isFavorite`, or `isTemplate`; they are not authoritative file fields.

```json
{
  "schemaVersion": 1,
  "workflowId": "uuid-v4",
  "name": "Workflow name",
  "description": "What this workflow does",
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

Each node omits `inputs`/`outputs` to avoid carrying stale schema snapshots.
The canonical file importer does not validate ports against the live registry,
so independently verify every node type and edge port against live schemas
before returning the file:

```json
{
  "nodeId": "uuid-v4",
  "nodeType": "ai/llm",
  "name": "LLM",
  "position": { "x": 0, "y": 0 },
  "config": {}
}
```

> Do not embed `inputs`/`outputs`; they are opaque file data, not a source of
> port validation, and only add a stale copy of the schema. Never use the
> `[{ "name": …, "type": … }]` array form. A misspelled `nodeType` is not
> caught by the file importer, so every `nodeType` and edge port must be
> checked against live discovery before returning the file. See the Workflow
> JSON Contract for details.

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

- Put the complete workflow under `definition.nodes` and `definition.edges`.
- Use `config` for node runtime settings. Empty config `"config": {}` is valid when all options use defaults.
- Omit per-node `inputs`/`outputs` and do not emit `skipValidation`.
- Keep positions readable: left-to-right flow, about 320 px apart.

## Wiring Rules

Use schema properties as port names.

For an edge:

- `sourcePort` must be an exact key from the source node `outputSchema.properties` (case-sensitive).
- `targetPort` must be an exact key from the target node `inputSchema.properties` (case-sensitive).
- **Required Inputs**: Every required input must be connected unless its schema provides a default.
- **No Cycles**: Workflow should be a DAG (directed acyclic graph).
- Prefer matching compatible types: string to string, object to object, array to array, boolean to boolean, number/integer to number/integer.
- If schemas use richer metadata, prefer exact semantic matches over only type matches.
- If a type mismatch is necessary, insert a transform, formatter, smart variable, or LLM node that explicitly converts the value.

## LLM Model Selection

When using `/llm/models`:

- Prefer `model_type: "chat"` for generation, classification, extraction, routing, summarization, and agent steps.
- Prefer `model_type: "embedding"` for indexing, semantic search, vector retrieval, and RAG ingestion.
- If the user names a provider/model, preserve that exact choice; use catalog metadata when it is present.
- If no model is specified, choose a reasonable chat model from the catalog and mark it as an assumption in the response. The catalog is not user settings; disclose when credentials or provider configuration may still be required.
- Do not invent provider credentials or credential IDs. If a user-specific credential reference is missing, leave it unset where the schema permits and tell the user what to configure after import; if it is required, ask the user before producing the final JSON.

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
- Per-node `inputs`/`outputs` are omitted, and there is no `skipValidation` field.
- Every `nodeType` appears in the live node list (import does not reject unknown types).
- All required inputs have incoming edges or defaults.
- Every edge references existing node IDs.
- Every edge port exists exactly in the selected node schemas (case-sensitive).
- No cycles in the workflow graph (must be a DAG).
- `schemaVersion` is `1`; the file uses the nested envelope with `name` and `definition`.
- LLM model/provider values came from the catalog or the user, and missing credentials/configuration are clearly disclosed.
- The JSON is valid, with no comments or trailing commas.
