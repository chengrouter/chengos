# Field Guide — 节点配置字段填写指南

> 精确的字段名、类型、默认值随节点版本变化，**一律用实时 schema 获取**，不要照抄硬编码表：
>
> ```
> action: get_node_schema, node_type: "ai/llm"   # 完整 input/output schema + 默认值 + enum
> action: list_ports,      node_type: "ai/llm"   # 紧凑端口形状（名称/类型/是否必填）
> ```
> ```bash
> curl -s http://localhost:3000/api/v1/nodes/schema/ai/llm | jq '.data.inputSchema.properties'
> ```
>
> **权威契约：** 端口策略与字段命名见 `docs/workflow-json-generation-guide.md`。

本文只讲**跨节点通用的配置模式**——这些模式比单个节点的字段表稳定得多。

## 1. `mode` 字段（Manual / Llm）

很多工具型节点（如 `tools/http`、`tools/workflow_inspect`、`tools/file_ops_hub` 等）都有 `mode`：

- `"manual"`：用户在 UI 或 `config` 中预先填好所有参数。
- `"llm"`：由 LLM 在运行时根据上下文自动填充参数。

**规则**：作为独立节点使用时用 `manual`；作为 Agent 工具连接到 `agent/react_agent.tools`
时用 `"llm"`，让 Agent 在运行时决定参数。

## 2. 配置/凭证节点要单独成节点

像 LLM 配置、Embedding 配置、向量库配置这类节点，输出一个完整配置对象，通过端口连入消费节点：

```
ai/llm_config.llm_config        -> ai/llm.llm_config
ai/llm_config.llm_config        -> agent/react_agent.llm_config
ai/embedding_config.embedding_config -> rag/retriever.embedding_config
ai/qdrant_config.qdrant_config  -> rag/retriever.qdrant_config
```

- 一个配置节点可同时连多个下游（fan-out）。
- **不要**把 provider/model/API-key 直接写进消费节点的 `config` 来代替连线——
  消费节点拿不到配置输入就跑不起来。

## 3. `credential_id` / 凭证

- 引用 ChengOS 中存储的加密凭证，值为凭证的 UUID。
- 凭证通过平台管理界面或 API 创建，**不要硬编码 API key**。
- LLM 配置节点的 `model` 前缀（见下）对应凭证里的 provider 名。
- `utils/credential` 用于给 `tools/skill` 等节点注入凭证。

## 4. LLM model 格式

正确格式为 `provider::model_name`：

```
openai::gpt-4o
openai::gpt-4o-mini
anthropic::claude-...
```

错误格式：`gpt-4o`（缺少 provider 前缀）。可用的 provider/model 列表通过
`GET /api/v1/llm/models` 获取，不要凭记忆写型号。

## 5. 沙箱 / 权限开关

文件操作类节点（如 `tools/file_ops_hub`）通常把写/改/删默认关闭，需显式开启
（如 `allow_write` / `allow_edit` / `allow_delete`），并建议设置 `sandbox_root`
限制操作范围。具体开关名以 `get_node_schema` 为准。

## 6. 自动填充的输入

部分输入在运行时自动填充（如聊天输入的原始消息、对话历史），不需要手动连线或配置；
schema 里这类字段通常标注为运行时注入。遇到不确定的字段，查 `get_node_schema` 的
`description` 与 `default`。
