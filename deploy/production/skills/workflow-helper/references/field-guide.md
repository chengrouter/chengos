# Field Guide — 节点配置字段填写指南

本文档覆盖各类节点中最常遇到的配置字段。如需精确 schema，请用 `agent/workflow_inspect` 的 `get_node_schema` action。

## Agent 类

### agent/llm_config

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `model` | String | 是 | - | 格式 `provider::model`，如 `openai::gpt-4o` |
| `temperature` | f32 | 否 | 0.7 | 创造性控制，0.0-2.0 |
| `max_tokens` | u32 | 否 | 模型默认 | 最大输出 token 数 |
| `stream` | bool | 否 | true | 是否启用流式输出 |
| `timeout_secs` | u32 | 否 | 120 | API 超时秒数 |
| `top_p` | f32 | 否 | 1.0 | 核采样参数 |

### agent/llm

| 字段 | 类型 | 必填 | 来源 | 说明 |
|------|------|------|------|------|
| `llm_config` | Object | 是 | 连线(llm_config) | 从 `agent/llm_config` 节点连入 |
| `system_prompt` | String | 否 | config | 系统提示词 |
| `user_message` | String | 是 | 连线/config | 用户消息，可从 `chat/input` 连入 |
| `context` | Object | 否 | 连线 | Agent 上下文（多轮对话时从上游传入） |
| `tools` | Array | 否 | 连线(tools) | 工具定义（从工具节点连入） |

### agent/react_agent

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task` | String | 是 | Agent 任务描述 |
| `llm_config` | Object | 是 | 从 `llm_config` 节点连入 |
| `tools` | Array | 否 | 从工具节点的 `tool_definition` 端口连入 |
| `max_iterations` | u32 | 否(默认10) | 最大迭代次数 |
| `use_function_calling` | bool | 否(默认true) | 使用 function calling 格式 |
| `use_llm_evaluation` | bool | 否(默认true) | LLM 自评是否完成 |

### agent/tool_http

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | "manual"/"llm" | 否(默认manual) | manual=用户配置, llm=LLM 自动填充 |
| `url` | String | 是(manual) | 请求 URL |
| `method` | String | 否(默认GET) | HTTP 方法: GET/POST/PUT/DELETE/PATCH |
| `headers` | Object | 否 | 请求头 |
| `body` | String | 否 | 请求体 |
| `credential_id` | String | 否 | 凭证 ID（用于认证） |
| `timeout_seconds` | u32 | 否(默认30) | 超时秒数 |

**注意**: 作为 Agent 工具使用时，`mode` 设为 `"llm"`，让 LLM 在运行时填充参数。

### agent/tool_file_ops_hub

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `sandbox_root` | String | 否 | 沙箱根目录（限制文件操作范围） |
| `allow_read_info` | bool | 否(默认true) | 允许读取文件元信息 |
| `allow_read_content` | bool | 否(默认true) | 允许读取文件内容 |
| `allow_list_directory` | bool | 否(默认true) | 允许列目录 |
| `allow_search` | bool | 否(默认true) | 允许全文搜索 |
| `allow_write` | bool | 否(默认false) | 允许写文件 |
| `allow_edit` | bool | 否(默认false) | 允许编辑文件 |
| `allow_delete` | bool | 否(默认false) | 允许删除文件 |

**安全提示**: 写入/编辑/删除默认关闭，需要显式开启。生产环境建议设置 `sandbox_root`。

### agent/workflow_inspect

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | "manual"/"llm" | 否(默认manual) | 执行模式 |
| `action` | String | 是 | `list_workflows`/`get_workflow`/`list_node_types`/`get_node_schema` |
| `workflow_id` | String | get_workflow 时必填 | 工作流 UUID |
| `name_filter` | String | 否 | 工作流名称模糊过滤 |
| `node_type` | String | get_node_schema 时必填 | 节点类型 ID（如 `agent/llm`） |
| `category_filter` | String | 否 | 节点分类过滤 |

## Chat 类

### chat/input

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `stream_mode` | bool | 否(默认true) | 启用流式输入处理 |
| `raw_input` | String | 自动 | 用户原始输入（运行时自动填充） |
| `history` | Array | 自动 | 对话历史（运行时自动填充） |

### chat/output

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `context` | Object | 是(连线) | 从 `agent/llm` 的 `context` 端口连入 |
| `autoscroll` | bool | 否(默认true) | 自动滚动到最新消息 |
| `theme` | String | 否 | 主题样式 |

### chat/memory

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `window_size` | u32 | 否(默认20) | 对话历史窗口大小（保留最近 N 轮） |
| `strategy` | String | 否 | 记忆策略 |
| `enabled` | bool | 否(默认true) | 是否启用记忆 |

## Document 类

### document/create

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `workspace_id` | String(UUID) | 是 | 目标 workspace |
| `title` | String | 是 | 文档标题 |
| `initial_content` | String | 否 | 初始内容（Markdown 格式） |

### document/query

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `document_id` | String(UUID) | 是 | 文档 ID |
| `include_content` | bool | 否(默认true) | 是否包含内容 |
| `as_markdown` | bool | 否(默认false) | 以 Markdown 格式返回 |

## RAG 类

### rag/retriever

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | String | 是 | 检索查询文本 |
| `embedding_config` | Object | 是(连线) | 从 `embedding_config` 节点连入 |
| `qdrant_config` | Object | 是(连线) | 从 `qdrant_config` 节点连入 |
| `collection_name` | String | 是 | 向量集合名称 |
| `limit` | u32 | 否(默认5) | 返回结果数量 |

### vector/qdrant_config

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | String | 否(默认local) | `local` 或 `remote` |
| `collection_name` | String | 是 | 向量集合名称 |

## Scheduler 类

### scheduler/create

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `workflow_id` | String(UUID) | 是 | 要定时触发的工作流 ID |
| `run_at` | String | 是 | 首次执行时间（ISO 8601 格式） |
| `frequency` | String | 否 | `once`/`daily`/`weekly`/`monthly`/`cron` |
| `timezone` | String | 否(默认UTC) | IANA 时区名（如 `Asia/Shanghai`） |
| `cron_expression` | String | frequency=cron 时必填 | Cron 表达式 |

## Utils 类

### utils/smart_var

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `template` | String | 是 | 模板字符串，用 `{{variable}}` 占位 |
| `extract_mode` | String | 否 | 提取模式 |

### tools/code

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `language` | String | 是 | `javascript`/`python`/`shell` |
| `script` | String | 是 | 要执行的脚本代码 |
| `mode` | String | 否 | 执行模式 |
| `timeout_seconds` | u32 | 否(默认30) | 超时秒数 |

## 通用字段模式

### mode 字段（Manual / Llm）

很多工具节点都有 `mode` 字段：
- `"manual"`: 用户在 UI 或 config 中预先填好所有参数
- `"llm"`: 由 LLM 在运行时根据上下文自动填充参数

**规则**: 作为独立节点使用时用 `manual`；作为 Agent 工具连接到 `react_agent.tools` 时用 `"llm"`。

### credential_id 字段

引用存储在 ChengOS 中的加密凭证。值为凭证的 UUID。凭证通过平台管理界面或 API 创建。不要硬编码 API key。
