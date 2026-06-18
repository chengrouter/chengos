# ChengOS Skills 注册表

本文件列出所有已注册的 Skills，供 LLM Agent 和用户快速定位已有能力、避免重复创建。

> [!TIP]
> 在创建新 Skill 之前，请先查阅此表确认是否已有类似能力。

## Skills 列表

| Skill 名称 | 功能简介 | 调用方式 | 文档路径 |
|-----------|---------|---------|---------|
| **workflow-helper** | 工作流帮助/排障助手。回答用户关于节点选择、端口连线、字段配置、错误排查、模式推荐等问题。通过 `agent/workflow_inspect` 工具节点实时查询工作流和节点 Schema。 | 当用户询问「如何构建/连线/配置/排障工作流」时自动匹配 | [SKILL.md](workflow-helper/SKILL.md) |
| **workflow-json-builder** | 在线 UI 对话框工作流 JSON 生成助手。只使用模板、节点 Schema、LLM 模型等只读 API，引导用户确认需求并生成可导入的工作流 JSON，不直接创建/保存/执行工作流。 | 当用户在在线对话框里要求「帮我生成工作流 JSON / 通过聊天创建工作流草稿 / 分析节点连线并输出导入文件」时自动匹配 | [SKILL.md](workflow-json-builder/SKILL.md) |

## 各 Skill 详细说明

### workflow-helper

- **名称**: `workflow-helper`
- **触发条件**: 用户需求涉及理解工作流结构、选择节点、连接端口、配置字段、排查错误
- **覆盖的节点类别**: Agent, Chat, Document, IO, RAG, Scheduler, Table, Utils, WebUI
- **工具节点**: `agent/workflow_inspect`（只读查询，无需 HTTP API）
- **快速参考**: [quick-reference.md](workflow-helper/references/quick-reference.md)
- **完整文档**: [SKILL.md](workflow-helper/SKILL.md)

#### 参考文档

| 文档 | 说明 |
|------|------|
| [quick-reference.md](workflow-helper/references/quick-reference.md) | 所有节点一览表 + 常见模式 |
| [edge-types.md](workflow-helper/references/edge-types.md) | 端口类型、连线规则 |
| [field-guide.md](workflow-helper/references/field-guide.md) | 节点字段填写指南 |
| [troubleshooting.md](workflow-helper/references/troubleshooting.md) | 常见错误排查 |
| [index.md](workflow-helper/references/index.md) | 按分类导航 |

### workflow-json-builder

- **名称**: `workflow-json-builder`
- **触发条件**: 用户通过在线 UI 对话框描述自动化目标，希望 LLM 指导设计流程并输出可导入工作流 JSON
- **允许 API**: `GET /api/v1/workflows/templates`, `GET /api/v1/workflows/templates/:id`, `GET /api/v1/nodes/types`, `GET /api/v1/nodes/schema/*`, `GET /api/v1/llm/models`
- **禁止行为**: 不直接调用创建、更新、执行、保存工作流 API
- **完整文档**: [SKILL.md](workflow-json-builder/SKILL.md)

## 如何注册新 Skill

1. 在 `skills/` 下创建新目录，如 `skills/my-new-skill/`
2. 编写 `SKILL.md`（必须包含 YAML frontmatter: `name` 和 `description`）
3. 在本文件中添加一行到 **Skills 列表** 表格
4. (可选) 添加 `references/`、`scripts/` 等子目录
