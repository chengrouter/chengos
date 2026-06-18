---
name: workflow-helper
description: Use this skill when the user has questions about building, debugging, or understanding ChengOS workflows — including node selection, port wiring, field configuration, error troubleshooting, and workflow pattern recommendations.
---

# Workflow Helper

Use this skill when the user asks about **how to build, wire, configure, or troubleshoot** ChengOS workflows.

## Data Source

This skill queries the running ChengOS API for **live, up-to-date** node schemas and workflow templates.

**Prerequisite**: The ChengOS server must be running. Default base URL: `http://localhost:3000`.

### Response Structure

All endpoints return `{ "data": ..., "timestamp": "..." }`:
- `/nodes/types` → `data` is an array of node objects
- `/nodes/schema/<type>` → `data` is a single node object
- `/workflows/templates` → `data` is an array of template summary objects
- `/workflows/templates/<id>` → `data` is a single template detail object (includes full node/edge definition)

Each node object has (camelCase):

| Field | Description |
|-------|-------------|
| `typeId` | Node type identifier, e.g. `"ai/llm"` |
| `name` | Display name |
| `category` | Category string |
| `description` | What the node does |
| `inputSchema` | JSON Schema for input ports/fields |
| `outputSchema` | JSON Schema for output ports |

Each workflow template summary object has:

| Field | Description |
|-------|-------------|
| `workflowId` | Template UUID |
| `name` | Template name |
| `description` | What the template does |
| `nodeCount` | Number of nodes |
| `edgeCount` | Number of edges |
| `tags` | Array of tag strings |
| `isTemplate` | Always `true` |

The detail object adds a `definition` field:
- `definition.nodes` — array of node objects (`nodeId`, `nodeType`, `position`, `data`)
- `definition.edges` — array of edge objects (`edgeId`, `source`, `sourcePort`, `target`, `targetPort`)

**URL format**: node type IDs use `/` in URLs, e.g. `ai/llm` → `/api/v1/nodes/schema/ai/llm`.

### Available Queries

```bash
BASE=http://localhost:3000/api/v1

# List all node types (returns full schemas for all nodes)
curl -s $BASE/nodes/types | jq '.data[] | {typeId, name, category, description}'

# Get full schema for a specific node (typeId uses / in URL path)
curl -s $BASE/nodes/schema/ai/llm | jq '.data'

# Input ports only
curl -s $BASE/nodes/schema/ai/llm | jq '.data.inputSchema.properties | to_entries[] | {port: .key, type: .value.type, title: .value.title}'

# Output ports only
curl -s $BASE/nodes/schema/ai/llm | jq '.data.outputSchema.properties | to_entries[] | {port: .key, type: .value.type}'

# Filter nodes by category (categories are lowercase: agent, chat, document, io, rag, scheduler, table, tools, utils, workspace)
curl -s $BASE/nodes/types | jq '.data[] | select(.category=="agent") | {typeId, name}'

# Search nodes by name keyword
curl -s $BASE/nodes/types | jq '.data[] | select(.name | test("LLM";"i")) | {typeId, name, category}'

# Get inputSchema directly from the list (avoids a second request)
curl -s $BASE/nodes/types | jq '.data[] | select(.typeId=="ai/llm") | .inputSchema.properties'

# List all workflow templates (name + description)
curl -s $BASE/workflows/templates | jq '.data[] | {workflowId, name, description, tags, nodeCount}'

# Get full JSON of a specific template (nodes + edges)
curl -s $BASE/workflows/templates/<id> | jq '.data'

# Show all node types used in a template
curl -s $BASE/workflows/templates/<id> | jq '.data.definition.nodes[] | {nodeId, nodeType}'

# Show all edges (wiring) in a template
curl -s $BASE/workflows/templates/<id> | jq '.data.definition.edges[]'
```

**Note**: The `/nodes/types` endpoint already includes full `inputSchema` and `outputSchema` for every node.
You can get all port information from a single list call instead of making a separate schema request.

## Diagnostic Playbook

### 1. Node Selection

**When**: User asks "which node should I use for X?"

Steps:
1. `curl -s $BASE/nodes/types | jq '.data[] | {typeId, name, category, description}'`
2. Narrow down by category or keyword in name/description
3. For the top candidates, show their input/output ports from the same response
4. Recommend the best match with reasoning

### 2. Wiring / Connection Problems

**When**: User asks "why can't I connect X to Y?" or "which port should I use?"

Steps:
1. Get output ports of source and input ports of target from the list (or per-node schema)
2. Compare port types for compatibility — common type mismatch: `string` vs `array`, `object` vs `string`
3. Check wiring rules that are **not** in the schema:
   - A node's output port can only connect to one downstream input port of the same base type
   - `stream` typed ports require special handling — only `chat/output` and streaming-aware nodes accept them
   - Control-flow edges (trigger/gateway) bypass type checking
4. Explain root cause and show example edge JSON

### 3. Field Configuration

**When**: User asks "what should I fill in this field?" or "what does this config mean?"

Steps:
1. `curl -s $BASE/nodes/schema/<node_type> | jq '.data.inputSchema.properties.<field_name>'`
2. Show: `title`, `description`, `type`, `default`, `enum` values if present
3. Explain what to fill and why, with a concrete example value

### 4. Error Troubleshooting

**When**: User provides an error message, failure symptom, or unexpected behavior.

Steps:
1. Parse the error — identify which node type and field are involved
2. Query that node's schema for validation rules on the suspect field
3. Check for common issues not visible in schema:
   - Missing required credential (API key not configured)
   - Upstream node produced wrong type, causing downstream input mismatch
   - `skipValidation: true` bypassed type check but runtime failed
   - Agent loop exceeded max iterations
4. Provide: root cause, verification steps, fix instructions

### 5. Workflow Template Lookup

**When**: User asks "is there a template for X?" or "show me an example workflow".

Steps:
1. `curl -s $BASE/workflows/templates | jq '.data[] | {workflowId, name, description, tags}'`
2. Find templates matching the user's goal by name/description/tags
3. If a match is found, fetch the full definition:
   `curl -s $BASE/workflows/templates/<id> | jq '.data'`
4. From the definition, explain:
   - Which nodes are used (`definition.nodes[].nodeType`)
   - How they are connected (`definition.edges[]`)
   - Key configuration fields in each node's `data`

### 6. Workflow Pattern Design

**When**: User asks about workflow patterns, best practices, or how to design a flow.

Steps:
1. Identify what the user wants to achieve
2. Check if any existing template covers the pattern: `curl -s $BASE/workflows/templates | jq '.data[] | {workflowId, name, description}'`
3. If a relevant template exists, use its node/edge structure as the starting point
4. Otherwise, query relevant node schemas and recommend a pattern: which nodes, in what order, how to connect them
5. Show a concrete example with node `typeId`s, port names, and edge definitions

## Response Format

When answering, include:
- Exact `typeId` values (e.g., `ai/llm`, `chat/output`)
- Port names as shown in schema `properties` keys
- Example edge JSON: `{ "source": "node_a", "sourcePort": "output", "target": "node_b", "targetPort": "input" }`
- Clear explanation of why something works or doesn't work
