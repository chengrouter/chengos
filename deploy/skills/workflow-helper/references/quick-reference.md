# 快速参考 — 工作流 JSON 结构与常见连线模式

> 本文件讲**结构与连线模式**。节点类型 ID、端口名、配置字段一律以运行时引擎为准，
> 用 `list_node_types` / `get_node_schema` 实时获取，不要照抄本文示例里的 ID。
>
> **权威契约：** 工作流 JSON 的字段名、端口策略、`skipValidation` 语义见
> **Workflow JSON Contract**（`docs/workflow-json-generation-guide.md`）。

## 1. 工作流 DTO 结构

```json
{
  "name": "工作流名称",
  "description": "简要描述",
  "skipValidation": true,
  "definition": {
    "nodes": [
      {
        "nodeId": "<uuid-v4>",
        "nodeType": "<node-type-id>",
        "name": "节点显示名",
        "position": { "x": 100, "y": 100 },
        "config": { }
      }
    ],
    "edges": [
      {
        "edgeId": "<uuid-v4>",
        "sourceNode": "<source-node-uuid>",
        "targetNode": "<target-node-uuid>",
        "sourcePort": "output_port_name",
        "targetPort": "input_port_name"
      }
    ]
  },
  "isDraft": false,
  "tags": [],
  "visibility": "private"
}
```

**关键规则**:
- `nodeId` / `edgeId` / `workflowId` 必须是合法 UUID v4，不能用 `"node_1"` 这种语义 ID。
- `nodeType` 必须精确匹配 `list_node_types` 返回的 ID（大小写、斜杠都要对）。
- edge 用 `sourceNode` / `targetNode` / `sourcePort` / `targetPort`（camelCase，不是 `source_node`）。
- 端口（`inputs`/`outputs`）要么**整体省略**并设 `skipValidation: true`（推荐，运行时由
  节点注册表补全端口）；要么按 **JSON Schema 对象**（`{ "type":"object","properties":{…} }`）
  内嵌——**绝不要**用 `[{name,type}]` 数组形式（校验读取的是 `properties` 键，数组永远校验不过）。

## 2. 节点目录 —— 实时获取，不要硬编码

本文**不再内置节点一览表**：节点会随版本增删、改名、换分类，硬编码的表会很快误导人。

```bash
BASE=http://localhost:3000/api/v1

# 列出所有节点类型及完整 schema
curl -s $BASE/nodes/types | jq '.data[] | {typeId, name, category, description}'

# 按关键词搜索
curl -s $BASE/nodes/types | jq '.data[] | select(.name|test("LLM";"i")) | {typeId, name, category}'

# 查看单个节点端口
curl -s $BASE/nodes/schema/ai/llm | jq '.data.inputSchema.properties, .data.outputSchema.properties'
```

或用 `tools/workflow_inspect`（`action: list_node_types` / `get_node_schema` / `list_ports`）。

## 3. 常见连线模式（形状示例，ID 以实时 schema 为准）

> 下面用的 `ai/llm`、`chat/input` 等是**当前**示例 ID，仅说明连线形状。
> 生成前务必用 `list_node_types` 确认类型 ID、用 `get_node_schema` 确认端口名。

### 模式A: Chat 聊天机器人

```
chat/input ──user_message──> ai/llm ──response/context──> chat/output
                              ^
ai/llm_config ──llm_config────┘
```

- `chat/input.user_message` -> `ai/llm.user_message`
- `ai/llm_config.llm_config` -> `ai/llm.llm_config`
- `ai/llm.context`(或 `response`) -> `chat/output.context`

> 凡用 `ai/llm`，都应连一个 `ai/llm_config` 节点提供 `llm_config`，不要把 provider/model/凭证
> 直接塞进 `ai/llm.config`，否则工作流跑不起来。

### 模式B: ReAct Agent + 工具

```
ai/llm_config       ──llm_config──────> agent/react_agent
tools/http          ──tool_definition──> agent/react_agent
tools/file_ops_hub  ──tool_definition──> agent/react_agent
tools/workflow_inspect ──tool_definition──> agent/react_agent
```

- 工具节点通过 `tool_definition` 端口连到 Agent 的 `tools` 端口。
- 工具节点的 `mode` 设为 `"llm"`，让 Agent 在运行时填参数。
- 一个 Agent 可连多个工具。

### 模式C: RAG 知识问答

```
ai/qdrant_config    ──qdrant_config────> rag/retriever ──documents──> rag/formatter ──> ai/llm
ai/embedding_config ──embedding_config──> rag/retriever                                  ^
                                                                ai/llm_config ──llm_config┘
```

- `qdrant_config` 和 `embedding_config` 都连到 `rag/retriever`。
- `rag/retriever.documents` -> `rag/formatter.documents`。
- `rag/formatter` 的输出 -> `ai/llm.user_message`（跨名端口，两端都是 String）。

### 模式D: 定时任务

```
tools/schedule (独立节点)
  config: { workflow_id, run_at, frequency, timezone }
```

- 通常是独立工作流，定时触发另一个工作流；`workflow_id` 指向目标工作流。

## 4. 实时查询

确认精确 schema 或查看现有工作流，用 `tools/workflow_inspect`：

```
action: list_workflows                              # 列出模板工作流
action: list_workflows, name_filter: "聊天"          # 按名称搜索
action: get_workflow,   workflow_id: "<uuid>"        # 工作流详情（nodes/edges）
action: get_node_schema, node_type: "ai/llm"         # 节点 schema（别名 describe_node_type）
action: list_ports,      node_type: "ai/llm"         # 紧凑端口形状
action: list_node_types, category_filter: "ai"       # 按分类列节点
action: find_replacements                            # 给定无效类型，返回有效候选
```
