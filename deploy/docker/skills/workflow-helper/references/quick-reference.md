# 快速参考 — 节点一览与常见模式

> 本文件集中了理解工作流时需要的全部信息：所有节点、端口、常见连线模式。

## 1. 工作流 DTO 结构

```json
{
  "name": "工作流名称",
  "description": "简要描述",
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
  "skipValidation": false,
  "tags": [],
  "visibility": "private"
}
```

**关键规则**:
- `nodeId` / `edgeId` 必须是合法 UUID v4
- `nodeType` 必须精确匹配下表中的节点 ID
- edge 用 `sourceNode` / `targetNode`（不是 `sourceNodeId`）
- 类型不兼容的 edge 需设 `skipValidation: true`

## 2. 全部节点一览表

> **文件编辑 vs 平台文档**
> - **修改磁盘文件**（代码、Markdown、JSON、配置等）→ 用 `agent/tool_file_ops_hub`
> - **在 ChengOS 平台创建/编辑带版本的块文档** → 用 `document/*` 节点

### Agent 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `agent/llm_config` | LLM 配置 | `model`, `temperature`, `max_tokens` | 选择 LLM 模型并输出配置 |
| `agent/embedding_config` | Embedding 配置 | `embedding_model`, `dimension` | 选择 Embedding 模型 |
| `agent/llm` | AI 对话 | `llm_config`, `system_prompt`, `user_message` | 调用 LLM 对话 |
| `agent/react_agent` | ReAct 决策 | `task`, `llm_config`, `tools`, `max_iterations` | 智能代理，自主规划+执行 |
| `agent/react_plan` | ReAct Plan | `task`, `llm_config`, `tools`, `context` | 规划下一步行动 |
| `agent/react_execute` | ReAct Execute | `decision`, `context` | 执行工具调用 |
| `agent/react_review` | ReAct Review | `task`, `result`, `decision`, `context` | 评估执行结果 |
| `agent/tool_catalog` | 工具目录 | `operation`, `session_id` | 两阶段工具发现 |
| `agent/tool_http` | HTTP 工具 | `url`, `method`, `headers`, `body` | 发送 HTTP 请求 |
| `agent/workflow_inspect` | 工作流检查 | `action`, `workflow_id`, `node_type` | 只读查询工作流和节点 Schema |
| `tools/mail` | 邮件工具 | `provider`, `operation`, `to`, `subject`, `body` | 收发搜索邮件 |
| `agent/skill` | 技能执行 | `skill_name`, `input_data` | 调用已注册 Skill |
| `agent/tool_subflow` | 子工作流 | `workflow_path`, `input_data` | 调用另一个工作流 |
| `vector/qdrant_config` | Qdrant 配置 | `mode`, `collection_name` | 向量数据库连接 |

### Chat 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `chat/input` | Chat 输入 | `raw_input`, `history`, `stream_mode` | 接收多模态输入 |
| `chat/memory` | Chat 记忆 | `window_size`, `strategy`, `enabled` | 管理对话历史窗口 |
| `chat/output` | Chat 输出 | `context`, `theme`, `autoscroll` | 渲染消息到聊天界面 |

### Document 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `document/create` | 创建文档 | `workspace_id`, `title`, `initial_content` | 创建新文档 |
| `document/query` | 查询文档 | `document_id`, `as_markdown` | 获取文档内容 |
| `document/apply_ops` | 文档操作 | `document_id`, `operations`, `use_shadow` | 批量增删改 |
| `document/build_llm_context` | LLM上下文 | `document_id`, `instruction` | 为 LLM 编辑构建上下文 |
| `document/update_block` | 更新块 | `document_id`, `block_id`, `content` | 更新文档块内容 |
| `document/shadow_create` | 创建影子 | `document_id`, `source_type` | 创建 Shadow 编辑会话 |
| `document/shadow_write` | 写入影子 | `shadow_id`, `llm_output` | 写入 LLM 操作到 Shadow |
| `document/shadow_complete` | 完成影子 | `shadow_id` | 标记 Shadow 完成 |
| `document/shadow_await_review` | 等待审核 | `shadow_id`, `timeout_seconds` | 等待用户审核 Shadow |

### FileOps 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `agent/tool_file_ops_hub` | **文件操作工具箱** | `operation`, `path`, `sandbox_root`, `allow_write`, `allow_edit`, `allow_delete` | 聚合 7 种文件操作到一个节点 |

**`operation` 可选值**:

| operation | 说明 | 需开启权限 |
|-----------|------|----------|
| `file_info` | 获取文件/目录元信息 | `allow_read_info`（默认开） |
| `view_file` | 读取文件内容（支持行范围） | `allow_read_content`（默认开） |
| `list_directory` | 列出目录（支持 glob 过滤、递归深度） | `allow_list_directory`（默认开） |
| `search_files` | 全文搜索（支持正则、上下文行） | `allow_search`（默认开） |
| `write_file` | 写入/创建/追加文件 | `allow_write`（默认**关**） |
| `edit_file` | 精确内容替换（old->new，支持行范围） | `allow_edit`（默认**关**） |
| `delete_file` | 永久删除文件（支持 dry_run 演练） | `allow_delete`（默认**关**） |

### IO 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `io/file_upload` | 文件上传 | `files_json`, `enable_ocr` | 处理文件上传 |
| `input_text` | 文本输入 | `text` | 固定文本输入 |

### RAG 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `rag/chunker` | 文档分块 | `content`, `mode` | 分割文档为块 |
| `rag/document_indexer` | 文档入库 | `qdrant_config`, `embedding_config` | 索引到向量库 |
| `rag/formatter` | RAG 格式化 | `query`, `documents` | 格式化检索结果为 prompt |
| `rag/kb_manager` | 知识库管理 | `qdrant_config`, `operation` | 管理知识库 |
| `rag/retriever` | 知识检索 | `query`, `embedding_config`, `collection_name` | 向量检索 |

### Scheduler 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `scheduler/create` | 创建定时任务 | `workflow_id`, `run_at`, `frequency`, `timezone` | 定时触发工作流 |
| `scheduler/manage` | 管理任务 | `action`, `task_id` | 查询/取消任务 |

### Table 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `table/query` | 查询表格 | `table_id`, `include_schema` | 获取表格数据 |
| `table/build_llm_context` | 表格LLM上下文 | `table_id`, `instruction`, `format` | LLM 表格编辑上下文 |
| `table/apply_record_ops` | 表格操作 | `table_id`, `operations` | 批量操作记录 |

### Utils 类

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `tools/code` | 代码执行 | `mode`, `language`, `script` | 沙箱执行脚本 |
| `utils/delay` | 延迟 | `delay_value`, `delay_unit` | 工作流延迟 |
| `utils/preview` | 内容预览 | `data`, `display_format` | 预览输出结果 |
| `utils/smart_var` | 智能变量 | `template`, `extract_mode` | 动态变量模板 |

### WebUI 类（使用前确认运行时注册）

| nodeType | 名称 | 核心参数 | 说明 |
|----------|------|---------|------|
| `ui.page_root` | 页面根 | `theme`, `layout_template` | 页面骨架生成器 |
| `ui.route` | 路由 | - | 路由树节点 |
| `ui.top_nav` | 顶部导航 | `menu_items`, `actions` | 顶部导航栏 |
| `ui.left_sidebar` | 左侧边栏 | `menu_items`, `collapsible` | 左侧导航 |
| `ui.right_sidebar` | 右侧面板 | `width`, `title`, `content` | 右侧信息面板 |
| `ui.header` | 页头 | `title`, `breadcrumb`, `tabs` | 页面头部 |
| `ui.content` | 内容区 | `blocks` | 页面主内容 |
| `ui.footer` | 页脚 | `copyright`, `links` | 页面底部 |
| `webui.rbac_guard` | RBAC 守卫 | `rules`, `on_fail` | 路由权限控制 |

## 3. 常见模式完整示例

### 模式A: Chat 聊天机器人

```
chat/input ──user_message──> agent/llm ──context──> chat/output
                               ^
agent/llm_config ──llm_config──┘
```

**节点**:
- `chat/input`: 接收用户消息
- `agent/llm_config`: 配置 LLM 模型
- `agent/llm`: 调用 LLM 生成回复
- `chat/output`: 输出到聊天界面

**关键连线**:
- `chat/input.user_message` -> `agent/llm.user_message`
- `agent/llm_config.llm_config` -> `agent/llm.llm_config`
- `agent/llm.context` -> `chat/output.context`

### 模式B: ReAct Agent + Tools

```
agent/llm_config ──llm_config──> agent/react_agent
agent/tool_http ──tool_definition──> agent/react_agent
agent/tool_file_ops_hub ──tool_definition──> agent/react_agent
agent/workflow_inspect ──tool_definition──> agent/react_agent
```

**关键点**:
- 工具节点通过 `tool_definition` 端口连到 Agent 的 `tools` 端口
- 工具节点的 `mode` 设为 `"llm"` 让 Agent 在运行时填参数
- 一个 Agent 可连多个工具

### 模式C: RAG 知识问答

```
vector/qdrant_config ──qdrant_config──> rag/retriever ──documents──> rag/formatter ──formatted_prompt──> agent/llm
agent/embedding_config ──embedding_config──> rag/retriever                                                ^
                                                                         agent/llm_config ──llm_config──┘
```

**关键点**:
- `qdrant_config` 和 `embedding_config` 都连到 `retriever`
- `retriever.documents` -> `formatter.documents`
- `formatter.formatted_prompt` -> `llm.user_message`（跨名端口，类型都是 String）

### 模式D: 定时任务

```
scheduler/create (独立节点)
  config: { workflow_id, run_at, frequency, timezone }
```

**关键点**:
- `scheduler/create` 通常是独立工作流，定时触发另一个工作流
- `workflow_id` 指向要被触发的目标工作流

## 4. 实时查询

如需确认节点精确 schema 或查看现有工作流，使用 `agent/workflow_inspect` 工具：

```
# 列出所有工作流
action: list_workflows

# 按名称搜索
action: list_workflows, name_filter: "聊天"

# 查看工作流详情
action: get_workflow, workflow_id: "<uuid>"

# 查看节点 schema
action: get_node_schema, node_type: "agent/llm"

# 列出某分类的节点
action: list_node_types, category_filter: "Agent"
```
