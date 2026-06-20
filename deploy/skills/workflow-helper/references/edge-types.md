# Edge & Wiring Guide

> **权威契约：** edge 字段名、端口策略、`skipValidation` 语义见
> `docs/workflow-json-generation-guide.md`。本文讲连线机制；示例里的类型 ID/端口名
> 仅为说明形状，生成前用 `get_node_schema` 确认。

## Edge 基本结构

每条 edge 连接一个源节点的输出端口到目标节点的输入端口：

```json
{
  "edgeId": "<uuid-v4>",
  "sourceNode": "<source-node-uuid>",
  "targetNode": "<target-node-uuid>",
  "sourcePort": "output_port_name",
  "targetPort": "input_port_name"
}
```

**注意**: 字段名是 `sourceNode` / `targetNode` / `sourcePort` / `targetPort`（camelCase），
不是 `sourceNodeId`，也不是 snake_case 的 `source_node` / `source_output`。

## 端口类型

端口类型由节点的 input/output schema 定义。常见类型（具体以 schema 为准）：

| 类型 | 说明 | 常见端口（示例） |
|------|------|---------|
| `String` | 文本 | `user_message`, `system_prompt`, `content`, `query` |
| `Object` (JSON) | 结构化数据 | `llm_config`, `qdrant_config`, `embedding_config`, `context` |
| `Array` | 列表 | `tools`, `documents`, `messages` |
| `Boolean` | 布尔值 | `found`, `success`, `stream` |
| `Number` | 数值 | `status_code`, `elapsed_ms` |

## 连线规则

### 同名端口直连

最常见的模式。源节点输出端口名与目标节点输入端口名一致时，直接连接：

```
ai/llm_config.llm_config ──▶ ai/llm.llm_config
chat/input.user_message  ──▶ ai/llm.user_message
```

### 跨名端口连接

输出端口名和输入端口名不同，但类型兼容：

```
rag/formatter.<output> ──▶ ai/llm.user_message   (String → String)
ai/llm.context         ──▶ chat/output.context   (Object → Object)
```

### 工具连接（Agent tools 边）

工具节点通过 `tool_definition` 输出端口连到 Agent 的 `tools` 输入端口，这是一种特殊边：

```
tools/http.tool_definition            ──▶ agent/react_agent.tools
tools/file_ops_hub.tool_definition    ──▶ agent/react_agent.tools
tools/workflow_inspect.tool_definition ──▶ agent/react_agent.tools
```

**特点**:
- 工具边在 DAG 中被排除（防止循环依赖）。
- 一个 Agent 可以连接多个工具节点。
- 方向是 **工具 → Agent**（工具定义流入 Agent）。

### 配置节点连接

配置节点（如 `ai/llm_config`、`ai/embedding_config`、`ai/qdrant_config`）输出完整配置对象：

```
ai/llm_config.llm_config        ──▶ ai/llm.llm_config
ai/llm_config.llm_config        ──▶ agent/react_agent.llm_config
ai/embedding_config.embedding_config ──▶ rag/retriever.embedding_config
ai/qdrant_config.qdrant_config  ──▶ rag/retriever.qdrant_config
```

一个配置节点可以同时连到多个下游节点（fan-out）。

## skipValidation

`skipValidation: true` 适用于以下场景：

| 场景 | 说明 |
|------|------|
| 省略端口 schema | 节点未内嵌 `inputs`/`outputs` 时**必须**设 true，运行时由注册表补全端口 |
| 类型不完全匹配 | 如 datetime → string 的跨类型连接 |
| 动态类型 | 输出类型运行时才确定（如 `utils/smart_var` 模板输出） |
| 部分构建 | 工作流还没连完，先存草稿 |

**说明**: 若每个节点都内嵌了完整的 JSON-Schema 端口（Strategy B），且类型都匹配，
可设 `false` 以获得导入期类型检查；否则保持 `true`。详见契约 §5。

## 常见连线模式（形状示例）

### Chat 模式
```
chat/input ──user_message──▶ ai/llm ──context──▶ chat/output
                              ▲
ai/llm_config ──llm_config────┘
```

### Agent + Tools 模式
```
ai/llm_config       ──llm_config──────▶ agent/react_agent
tools/http          ──tool_definition──▶ agent/react_agent
tools/file_ops_hub  ──tool_definition──▶ agent/react_agent
```

### RAG 检索模式
```
ai/qdrant_config    ──────▶ rag/retriever ──documents──▶ rag/formatter ──▶ ai/llm
ai/embedding_config ──────▶ rag/retriever                                  ▲
                                                      ai/llm_config ───────┘
```

### 条件分支模式
```
<branch/router node> ──branch_0──▶ node_a
                      ──branch_1──▶ node_b
                      ──branch_2──▶ node_c
```

条件分支节点（如 `ai/llm_branch`、`utils/condition_router`）用 `branch_N` 命名输出端口。
分支未激活时对应端口值为 null，下游节点自动跳过。精确端口名以 `get_node_schema` 为准。

## 排查连线问题

1. **端口名不匹配**: 用 `get_node_schema` 查看节点的精确端口名。
2. **类型不兼容**: 检查 source output 与 target input 的 schema 类型是否匹配。
3. **工具边方向错**: 工具节点是源（source），Agent 是目标（target）。
4. **缺少必需连线**: 检查目标节点的 required inputs 是否都有边连入。
5. **自循环**: 同一节点的输出不能连回自己的输入；整图必须是 DAG。
