# ChengOS 内置 Skill 模板

本目录是**只读的内置 Skill 模板目录**，随每个发行版一起发布（Docker 镜像、hybrid 包、OpenWrt 包）。
每个工作区会从这里安装自己的 Skill **实例**（独立的 Skill ID、工作流 ID 和
`<SKILLS_DIR>/<workspace>/<key>/` 包目录），安装与升级逻辑见
`crates/cheng-api/src/services/skill_templates.rs`。

> [!TIP]
> 只有带 `template.json` 的子目录才是可安装模板；没有它的目录会被加载器静默跳过。

## 可安装模板

| Key | 版本 | 功能简介 | 文档 |
|-----|------|---------|------|
| **workflow-helper** | 1.1.0 | 工作流帮助/排障助手：节点选择、端口连线、字段配置、错误排查、模式推荐。通过 `agent/workflow_inspect` 或只读 REST 接口实时查询节点 Schema 和模板。 | [SKILL.md](workflow-helper/SKILL.md) |
| **workflow-json-builder** | 1.2.0 | 在线 UI 对话框工作流 JSON 生成助手：只调用只读发现 API，按规范输出可导入的工作流 JSON，不直接创建、保存或运行工作流。 | [SKILL.md](workflow-json-builder/SKILL.md) |
| **workflow-creator** | 1.0.0 | 从需求创建 ChengOS 工作流，保存后在编辑器中运行并核对执行结果（`GET /api/v1/executions/{id}`），最后按用户确认清理测试工作流。 | [SKILL.md](workflow-creator/SKILL.md) |
| **claude-login** | 1.0.0 | Claude 订阅登录助手：通过服务器托管的登录连接 / 重新连接 Claude Code；登录邮件、链接和授权码只在服务器端处理，用户确认并点击授权。默认不启用，需要运维开启 `CHENG_CREDENTIAL_AUTH_AGENT_LOGIN_ENABLED`，依赖工作流模板 `claude-login-assistant`。 | [SKILL.md](claude-login/SKILL.md) |

工作流 JSON 的字段名、端口处理和校验规则以 `docs/workflow-json-generation-guide.md`
（Workflow JSON Contract）为准。

### workflow-helper

- **触发条件**: 用户询问如何构建、连线、配置或排查工作流
- **工具节点**: `agent/workflow_inspect`（只读）
- **参考文档**: [quick-reference.md](workflow-helper/references/quick-reference.md)、
  [edge-types.md](workflow-helper/references/edge-types.md)、
  [field-guide.md](workflow-helper/references/field-guide.md)、
  [troubleshooting.md](workflow-helper/references/troubleshooting.md)、
  [index.md](workflow-helper/references/index.md)

### claude-login

- **触发条件**: 用户要求连接、登录或重新连接 Claude（Claude Code）订阅
- **工具节点**: `tools/managed_cli_login`、`tools/browser`（允许人工接管，不记住登录、不导出登录态）
- **前提**: 每个用户在登录工具上选择自己的 IMAP 凭证；见运行手册 §9

### workflow-json-builder

- **触发条件**: 用户在在线对话框里描述自动化目标，希望得到可导入的工作流 JSON
- **允许 API**: `GET /api/v1/workflows/templates`, `GET /api/v1/workflows/templates/:id`,
  `GET /api/v1/nodes/directory`, `GET /api/v1/nodes/schema/*`,
  `POST /api/v1/nodes/schemas:resolve`, `GET /api/v1/llm/models`
- **禁止行为**: 不调用创建、更新、执行、保存工作流的 API

## 不可安装的目录

- **skill-importer/**: 只保留 `skill.yaml`，没有 `template.json`，不会被安装。Skill 编写/导入流程已退役
  （`tools/write_skill_package` 已移除），Skill 现在只能从内置模板或 Marketplace 安装。
  `skill.yaml` 是 `validate_skill_spec` 测试的固定输入，`tools/cli_install` 的调用方校验也按
  `skill-importer` 这个 slug 判断。

## 如何新增内置模板

1. 新建 `skill-templates/<key>/`，`<key>` 必须是安全的 slug。
2. 编写 `SKILL.md`（YAML frontmatter 至少包含 `name` 和 `description`，`name` 与 `<key>` 一致）。
3. 编写 `template.json`：`schemaVersion: 1`，`key` 必须等于目录名，另含 `version`、`name`、
   `description`、`sortOrder`、`enabledByDefault`、`requiresWorkflowTemplates`。
4. （可选）添加 `references/`、`scripts/`、`skill.yaml`、`workflow.json`。
5. 修改模板内容后提升 `template.json` 的 `version`。未被用户修改过的实例会按内容哈希自动升级；
   被修改过的实例只显示"有可用更新"。
6. 在本文件的表格中登记。
