---
name: workflow-creator
description: 用户要求创建、导入、运行或跑通一个 ChengOS 工作流，并希望在编辑器里看到它真正执行时使用。负责从需求出发搭建节点图、保存、运行并核对结果。不用于解释节点或端口的含义，也不用于只生成 JSON 而不运行的场景（那种情况用 workflow-json-builder）。
---

# 创建并跑通工作流

把工作流作为数据创建到正在运行的 ChengFlow 后端，然后在编辑器里真正运行一次，直到输出符合用户的预期。
除非已注册的节点无法表达某一步，否则不要新增 Rust 节点或 React 表单。

## 开始前

输入内容、步骤、输出和模板选择先从对话中获取。只有缺少的信息会改变节点图，或者决定运行是否有外部副作用时才追问。
其余情况选择默认值并明确告诉用户：输出使用编辑器预览，不使用模板，`state: "draft"`。

如果用户要求先讨论，只给出节点和连线的草图，等待确认后再创建。

## 模板的三个来源

不要混用。

**内置目录。** 目录名就是 key，位于 `chengflow/workflow-templates/<key>/workflow.json`。先列出目录确认当前有哪些 key，再读取选中的 `workflow.json` 复制图结构。

**当前工作区的安装副本。** 调用 `GET /api/v1/workflow-template-sync/updates`，需要登录并带 `X-Workspace-Id`。没有工作区时不要调用。每一项有目录 `key`，安装后有 `installedWorkflowId`，用 `GET /api/v1/workflows/{installedWorkflowId}` 读取副本。只有用户想要工作区副本时，才用 `POST /api/v1/workflow-template-sync/sync` 配合 `mode: "add_missing"` 和 `templateKeys` 安装缺失的模板。

**公共模板。** `GET /api/v1/workflows/templates` 返回标记为模板的数据库工作流。`GET /api/v1/workflows/templates/{id}` 的 `{id}` 必须是工作流 UUID，不能是目录 key。

## 创建时最容易失败的规则

JSON 约定见 `docs/workflow-json-generation-guide.md`。下面是 REST 创建时最需要注意的部分。

- `nodeType` 和端口名必须来自运行中的引擎，不要凭记忆或本技能里的例子使用。
- 创建前用 `GET /api/v1/nodes/directory` 核对每个 `nodeType`。未注册的类型会跳过端口校验，拼错的类型可能保存成功，直到运行时才失败。
- 字段名使用 camelCase：`nodeId`、`nodeType`、`edgeId`、`sourceNode`、`sourcePort`、`targetNode`、`targetPort`。
- 持久化的 id 是 UUID，不要使用 `chat-input` 这类语义化 id。
- 不要把密钥粘贴到节点 `config` 里。使用凭证节点，或引用已在设置中保存的凭证。
- 不要写节点的 `inputs` 和 `outputs`，由服务端根据注册表的 schema 校验端口。
- 不要设置 `skipValidation: true`。它会跳过端口校验，可能保存一个执行时才失败的图。只有用户明确要求保存无效图时才设置，并告诉用户。

## 创建工作流

1. 确认后端 API 可访问。
2. 通过已登录的前端页面调用 API，让页面自己附加认证信息。`localStorage` 中的 `cheng_token` 和 `cheng_active_workspace_id` / `cheng_workspace_id` 由页面读取。不要把 bearer token 复制到 shell、日志、文件或对话中。
3. 先用轻量目录查找节点，再只获取用到的 schema。`GET /api/v1/nodes/directory` 返回 `typeId`、`name`、`category`、`description`、`schemaHash`，不含 schema。取 schema 用 `GET /api/v1/nodes/schema/{nodeType}`，或批量用 `POST /api/v1/nodes/schemas:resolve`，请求体为 `{ "items": [{ "typeId": "…", "knownHash": "…" }] }`。这些接口公开，不需要认证。不要用 `GET /api/v1/nodes/types` 查几个节点。
4. 用 `POST /api/v1/workflows` 创建。请求体为 camelCase，必须有 `name`（1–100 字符）以及 `definition.nodes` 和 `definition.edges`。必须带 `X-Workspace-Id`，否则返回 `WORKSPACE_REQUIRED`。成功返回 `201`，新 id 在 `data.workflowId`。测试用的工作流建议加 `[test] ` 前缀，便于识别和清理。
5. 如果当前环境有 `tools/import_workflow`，优先用它的结构化创建方式（`key` + `sourceKey` / `targetKey`，自动生成 UUID，写入前校验）。不要和旧的 `content` 字符串字段混用。
6. 需要 LLM 的节点，要先在设置中保存提供方和凭证。节点只保存引用，运行时由服务端注入密钥。模型字符串的常见格式是 `<凭证ID>::<模型名>`。

保存只存储定义，不会执行节点。

## 在编辑器中运行

在运行前检查副作用，而不是在保存前。只检查本次运行会实际执行的节点。

- 如果运行会花钱、发送消息、写入工作区以外的位置或创建定时任务，先询问用户，等待明确同意。
- 如果运行只调用使用测试凭证的外部 API、写入工作区内部，或者在沙箱中执行，告知用户后继续。

打开编辑器中该工作流的页面，例如 `/editor/<workflowId>`。截图不能证明运行成功，要以执行结果为准。

- 执行按钮在保存之后才可用。先保存（工具栏或 Ctrl+S），再运行。运行完成后按钮会变成"重新执行"。运行会调用 `POST /api/v1/executions`，进度通过 `/ws/executions` 推送。
- 以 `GET /api/v1/executions/{id}` 的结果为准，不要只看界面上的标记。
  - `state` 的终态是 `completed`、`failed`、`cancelled`、`timeout`，正常成功是 `completed`。
  - `nodeStatuses[].state` 为 `waiting`、`ready`、`running`、`completed`、`failed`、`skipped`。预期路径上的节点应为 `completed`，未走的分支为 `skipped`。
  - 对照约定的样例检查 `nodeStatuses[].outputs` 和顶层 `resultData`。失败时读取对应节点的 `error`。`nodeStatuses` 没有输入字段，节点的输入就是与其相连的上游节点的 `outputs`。
  - 修正图后保存，再运行一次。
- 常见的首次运行失败：LLM 节点的凭证缺失，或模型名不正确。

如果页面是登录页，停下来请用户登录。不要伪造账号或 token。

## 清理

运行结束后，列出本次会话创建的 `[test] ` 工作流，询问用户是否删除（`DELETE /api/v1/workflows/{id}`）。只删除用户确认的。保留用户想要的结果。
