# Troubleshooting Guide

> **权威契约：** 工作流 JSON 的字段名、端口策略、`skipValidation` 见
> `docs/workflow-json-generation-guide.md`。下面的类型 ID 为当前示例，
> 诊断时以 `list_node_types` / `get_node_schema` 的实时结果为准。

## 工作流创建阶段

### Invalid node ID

**错误**: `Invalid node ID`

**原因**: `nodeId` 或 `edgeId` 不是合法的 UUID v4。

**修复**: 确保所有 ID 形如 `xxxxxxxx-xxxx-4xxx-axxx-xxxxxxxxxxxx`，不能用 `"node_1"`
之类的语义字符串。`workflowId` 同理。

### Unknown node type

**错误**: 节点类型未找到 / `node_type` not registered

**原因**: `nodeType` 不匹配任何已注册节点（常因照抄了过时示例里的旧 ID）。

**排查**:
1. 用 `tools/workflow_inspect` 的 `list_node_types` 查看所有已注册节点。
2. 注意大小写和斜杠：是 `ai/llm` 不是 `Agent/LLM`，是 `ui/page_root` 不是 `ui.page_root`。
3. 用 `find_replacements` 让引擎给出有效候选 ID。
4. WebUI (`ui/*`) 节点可能未在运行时注册，需确认。

### Edge validation failed

**错误**: 端口类型不匹配 / edge validation error

**排查**:
1. 确认 `sourcePort` 存在于源节点的 output schema 中。
2. 确认 `targetPort` 存在于目标节点的 input schema 中。
3. 确认两端类型兼容。
4. 若节点未内嵌端口 schema，或确实需要跨类型连接，设 `skipValidation: true`。

### Missing workspace_id

**错误**: `workspace_id` is required

**原因**: `document/*` 和部分节点需要 `workspace_id` 配置。

**修复**: 先确认可用 workspace（通过 `list_workflows` 查看已有工作流所属 workspace），
填入正确的 UUID。

## 工作流执行阶段

### Node execution failed

| 原因 | 表现 | 解决 |
|------|------|------|
| LLM API 超时 | `timeout` / `request timeout` | 增大超时配置或检查网络 |
| Credential 无效 | `credential not found` / `decryption failed` | 确认 credential_id 存在且未过期 |
| 缺少必需输入 | `missing required field: xxx` | 检查上游节点是否正确输出、edge 是否连上 |
| 上游节点失败 | 节点状态为 skipped | 先排查上游失败原因 |
| 沙箱权限 | `permission denied` / `sandbox violation` | 检查 `tools/file_ops_hub` 的 `allow_write` 等开关 |

### Node skipped (auto-skip)

**机制**: 当节点的所有入边值都为 null 时，节点自动跳过。

**常见场景**: 条件分支中未激活的路径；上游节点执行失败导致输出为空。

**排查**: 检查上游节点的执行状态和输出值。

### Agent 工具调用循环

**表现**: Agent 反复调用同一个工具，迭代次数耗尽。

**排查**:
1. 检查 `max_iterations` 是否设置太小。
2. 检查工具返回结果是否提供了足够信息让 Agent 判断任务完成。
3. 检查 `system_prompt` 是否清晰描述了完成条件。
4. 检查 LLM 自评开关（让 LLM 自行判断是否完成）是否开启。

### Streaming 不生效

**排查**:
1. `ai/llm` 默认开启 streaming，检查 `llm_config` 的 `stream` 是否被设为 `false`。
2. 其他节点需要显式设 `stream: true`。
3. 确认前端（`chat/output`）正确处理了流式事件。

## 配置常见问题

### LLM model 格式

正确格式: `provider::model_name`（如 `openai::gpt-4o`）。错误格式: `gpt-4o`（缺 provider 前缀）。
可用型号通过 `GET /api/v1/llm/models` 获取，不要凭记忆写型号。

### Credential 引用

- LLM 配置节点 `model` 字段的 provider 前缀对应 credential 中的 provider 名。
- HTTP 工具（`tools/http`）用 `credential_id` 做请求认证。
- `utils/credential` 用于给 `tools/skill` 注入凭证。

### 定时任务时区

定时节点（`tools/schedule`）的 `timezone` 使用 IANA 时区名（`Asia/Shanghai`、
`America/New_York`、`UTC`），不支持 `GMT+8` 之类的偏移量格式。

## 使用 workflow_inspect 诊断

```
action: get_workflow,    workflow_id: "<uuid>"   # 工作流完整节点和边定义
action: get_node_schema, node_type: "ai/llm"     # 节点精确 schema
action: list_workflows,  name_filter: "聊天"      # 查找类似工作流作参考
action: get_execution,   execution_id: "<uuid>"  # 执行状态与节点输出
```

需要更细的执行轨迹时，可用 `tools/get_execution_trace` 节点查看完整 trace 内容。
