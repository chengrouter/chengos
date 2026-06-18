# Troubleshooting Guide

## 工作流创建阶段

### Invalid node ID

**错误**: `Invalid node ID`

**原因**: `nodeId` 或 `edgeId` 不是合法的 UUID v4。

**修复**: 确保所有 ID 格式为 `xxxxxxxx-xxxx-4xxx-axxx-xxxxxxxxxxxx`，不能用 `"node_1"` 之类的字符串。

### Unknown node type

**错误**: 节点类型未找到 / `node_type` not registered

**原因**: `nodeType` 字段值不匹配任何已注册节点。

**排查**:
1. 用 `agent/workflow_inspect` 的 `list_node_types` 查看所有已注册节点
2. 注意大小写和斜杠：是 `agent/llm` 不是 `Agent/LLM`
3. WebUI 节点可能未在运行时注册，需确认

### Edge validation failed

**错误**: 端口类型不匹配 / edge validation error

**排查**:
1. 确认 `sourcePort` 存在于源节点的 output schema 中
2. 确认 `targetPort` 存在于目标节点的 input schema 中
3. 确认两端类型兼容
4. 如果确实需要跨类型连接，设 `skipValidation: true`

### Missing workspace_id

**错误**: `workspace_id` is required

**原因**: `document/*` 和部分节点需要 `workspace_id` 配置。

**修复**: 先查询可用 workspace（通过 `list_workflows` 查看已有工作流所属 workspace），填入正确的 UUID。

## 工作流执行阶段

### Node execution failed

**常见原因**:

| 原因 | 表现 | 解决 |
|------|------|------|
| LLM API 超时 | `timeout` / `request timeout` | 增加 `timeout_secs` 或检查网络 |
| Credential 无效 | `credential not found` / `decryption failed` | 确认 credential_id 存在且未过期 |
| 缺少必需输入 | `missing required field: xxx` | 检查上游节点是否正确输出、edge 是否连上 |
| 上游节点失败 | 节点状态为 skipped | 先排查上游失败原因 |
| 沙箱权限 | `permission denied` / `sandbox violation` | 检查 `file_ops_hub` 的 `allow_write` 等开关 |

### Node skipped (auto-skip)

**机制**: 当节点的所有入边值都为 null 时，节点自动跳过。

**常见场景**:
- 条件分支中未激活的路径
- 上游节点执行失败导致输出为空

**排查**: 检查上游节点的执行状态和输出值。

### Agent 工具调用循环

**表现**: Agent 反复调用同一个工具，迭代次数耗尽。

**排查**:
1. 检查 `max_iterations` 是否设置太小
2. 检查工具返回的结果是否提供了足够信息让 Agent 判断任务完成
3. 检查 `system_prompt` 是否清晰描述了完成条件
4. 检查 `use_llm_evaluation` 是否开启（让 LLM 自行判断是否完成）

### Streaming 不生效

**排查**:
1. `agent/llm` 默认开启 streaming，检查 `llm_config.stream` 是否被设为 `false`
2. 其他节点需要显式设 `stream: true`
3. 确认前端（chat/output）正确处理了流式事件

## 配置常见问题

### LLM model 格式

正确格式: `provider::model_name`

```
openai::gpt-4o
openai::gpt-4o-mini
anthropic::claude-sonnet-4-20250514
```

错误格式: `gpt-4o`（缺少 provider 前缀）

### Credential 引用

- `agent/llm_config` 的 `model` 字段格式中的 provider 前缀对应 credential 中的 provider 名
- `agent/tool_http` 中 `credential_id` 用于 HTTP 请求认证
- `utils/credential` 用于给 `agent/skill` 注入凭证

### 定时任务时区

`scheduler/create` 的 `timezone` 使用 IANA 时区名：
- `Asia/Shanghai`（中国）
- `America/New_York`（美东）
- `UTC`

不支持 `GMT+8` 之类的偏移量格式。

## 使用 workflow_inspect 诊断

当遇到不确定的问题时，可以通过 `agent/workflow_inspect` 工具进行实时诊断：

```
# 查看工作流的完整节点和边定义
action: get_workflow, workflow_id: "<uuid>"

# 确认某个节点类型的精确 schema
action: get_node_schema, node_type: "agent/llm"

# 查找类似工作流作为参考
action: list_workflows, name_filter: "聊天"
```

## 使用 get_execution_trace 排查运行问题

当需要查看执行细节时，使用已有的 `agent/get_execution_trace` 节点：
- 需要 `trace_key`（格式: `session_id:turn`）
- 返回完整的执行 trace 内容
