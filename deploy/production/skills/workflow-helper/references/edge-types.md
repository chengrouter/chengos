# Edge & Wiring Guide

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

**注意**: 字段名是 `sourceNode` / `targetNode`，不是 `sourceNodeId`。

## 端口类型

端口的类型由节点的 input/output schema 定义。常见类型：

| 类型 | 说明 | 常见端口 |
|------|------|---------|
| `String` | 文本 | `user_message`, `system_prompt`, `content`, `query` |
| `Object` (JSON) | 结构化数据 | `llm_config`, `qdrant_config`, `embedding_config`, `context` |
| `Array` | 列表 | `tools`, `documents`, `messages` |
| `Boolean` | 布尔值 | `found`, `success`, `stream` |
| `Number` | 数值 | `status_code`, `elapsed_ms` |

## 连线规则

### 同名端口直连

最常见的模式。当源节点的输出端口名和目标节点的输入端口名一致时，直接连接：

```
llm_config.llm_config ──▶ llm.llm_config
chat/input.user_message ──▶ agent/llm.user_message
```

### 跨名端口连接

输出端口名和输入端口名不同，但类型兼容：

```
rag/formatter.formatted_prompt ──▶ agent/llm.user_message   (String → String)
agent/llm.context ──▶ chat/output.context                     (Object → Object)
```

### 工具连接（Agent tools 边）

工具节点通过 `tool_definition` 输出端口连接到 Agent 的 `tools` 输入端口。这是一种特殊边：

```
agent/tool_http.tool_definition ──▶ agent/react_agent.tools
agent/tool_file_ops_hub.tool_definition ──▶ agent/react_agent.tools
agent/workflow_inspect.tool_definition ──▶ agent/react_agent.tools
```

**特点**:
- 工具边在 DAG 中被排除（防止循环依赖）
- 一个 Agent 可以连接多个工具节点
- 工具边的方向是 **工具 → Agent**（工具定义流入 Agent）

### 配置节点连接

配置节点（如 `llm_config`、`embedding_config`、`qdrant_config`）输出完整配置对象：

```
agent/llm_config.llm_config ──▶ agent/llm.llm_config
agent/llm_config.llm_config ──▶ agent/react_agent.llm_config
agent/embedding_config.embedding_config ──▶ rag/retriever.embedding_config
vector/qdrant_config.qdrant_config ──▶ rag/retriever.qdrant_config
```

一个配置节点可以同时连接到多个下游节点（fan-out）。

## skipValidation

`skipValidation: true` 用于以下场景：

| 场景 | 说明 |
|------|------|
| 类型不完全匹配 | 如 `triggered_at`(datetime) → `initial_content`(string) |
| 动态类型 | 输出类型在运行时才确定（如 `smart_var` 模板输出） |
| 部分构建 | 工作流还没连完，先保存草稿 |
| 跨类型适配 | 需要隐式类型转换的场景 |

**建议**: 开发阶段可以设 `true` 快速迭代，确认连线正确后改回 `false` 以获得类型检查保护。

## 常见连线模式

### Chat 模式
```
chat/input ──user_message──▶ agent/llm ──context──▶ chat/output
                              ▲
llm_config ──llm_config──────┘
```

### Agent + Tools 模式
```
llm_config ──llm_config──▶ react_agent
tool_http ──tool_definition──▶ react_agent
file_ops_hub ──tool_definition──▶ react_agent
```

### RAG 检索模式
```
qdrant_config ──────▶ retriever ──documents──▶ formatter ──formatted_prompt──▶ llm
embedding_config ───▶ retriever                                                 ▲
                                                           llm_config ─────────┘
```

### 条件分支模式
```
branch_node ──branch_0──▶ node_a
             ──branch_1──▶ node_b
             ──branch_2──▶ node_c
```

条件端口使用 `branch_N` 命名模式。当分支未激活时，对应端口值为 null，下游节点自动跳过。

## 排查连线问题

1. **端口名不匹配**: 用 `get_node_schema` 查看节点的精确端口名
2. **类型不兼容**: 检查 source output 和 target input 的 schema 类型是否匹配
3. **工具边方向错**: 工具节点是源（source），Agent 是目标（target）
4. **缺少必需连线**: 检查目标节点的 required inputs 是否都有边连入
5. **自循环**: 同一节点的输出不能连回自己的输入
