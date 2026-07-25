# ChengOS v0.03 发布说明

> 发布日期：2025-07-25
> 上一版本：v0.02

---

## 概述

v0.03 是 ChengOS 的第三个预览版本。本次更新聚焦于 **节点预设系统**、**分流快捷方式**、**工作流模板库** 以及 **LLM 分流节点增强**，让工作流的搭建和路由更加灵活、开箱即用。

---

## 新功能

### 1. 节点预设系统（Node Presets）

新增全局节点预设配置（`presets.yaml`），为常用节点提供预定义配置方案，免去手动调参：

- **预设分类**：支持 `preset_types` 分类管理（如 Tool nodes、AI nodes），UI 中分级展示
- **配置补丁**：每个预设通过 `config_patch` 对目标节点配置进行浅合并，无需重复填写参数
- **风险等级**：支持 `low` / `medium` / `high` 三级风险标记，高风险预设默认不向 LLM 暴露
- **LLM 可见性**：`llm_visible` 字段控制预设是否可被 ReAct Agent 在工具发现阶段感知和使用
- **内置预设**：
  - `code-safe-mode` — 代码执行安全模式（禁止写入、严格沙箱）
  - `code-full-access` — 代码执行完全访问模式（允许写入、无沙箱）
  - `search-strict` — 搜索严格匹配模式（精确匹配、最多 10 条结果）
  - `agent-deep-think` — Agent 深度思考模式（30 轮迭代、深度推理）
- **分层覆盖**：全局预设放在 `CHENG_GLOBAL_CONFIG_DIR/presets.yaml`，工作区可同 ID 覆盖或新增

### 2. 分流快捷方式（Routing Shortcuts）

新增全局分流快捷方式配置（`shortcuts.yaml`），为 LLM 分流节点（`ai/llm_branch`）提供预置路由方案：

- **预置快捷方式**：
  - `Need Tools` — 路由到工具分支（`need_tools: true`，持续生效）
  - `Search` — 路由到搜索动作（`action.name: search`，单次生效）
  - `Deep Think` — 启用深度推理模式（`reasoning.mode: deep`，20 步推理，持续生效）
  - `Memory` — 路由到记忆写入分支（`memory: true`，持续生效）
- **路由模式**：
  - `once` — 仅对下一轮生效，自动清除
  - `always` — 持续生效，直到手动清除
- **分层覆盖**：全局快捷方式放在 `CHENG_GLOBAL_CONFIG_DIR/shortcuts.yaml`，工作区可同名称覆盖或新增

### 3. 工作流模板库（Workflow Templates）

系统启动时自动将 9 个预置工作流模板安装到新工作区，开箱即用：

| 模板名称 | 说明 |
|----------|------|
| `main_chat` | 主聊天工作流，通过条件路由分发到三个子工作流（记忆聊天 / 无记忆聊天 / 工具智能体） |
| `memory_chat` | 带对话记忆的聊天工作流，支持可配置窗口大小和历史搜索 |
| `no-memory-chat` | 轻量无记忆单轮聊天，适合状态less问答和一次性任务 |
| `http-tools` | 带 HTTP 请求能力的聊天工作流，LLM 可自主构造并发送 HTTP 请求 |
| `scheduled task` | 带定时任务管理的聊天工作流，通过自然语言创建和管理定时任务 |
| `skills run` | 带技能执行能力的聊天工作流，LLM 可发现并运行已安装的技能 |
| `tools_user` | 带文件操作工具的 ReAct 智能体工作流，支持沙箱内文件读写编辑 |
| `skills_importer` | 技能导入工作流，从仓库/URL/文本导入并生成技能包 |
| `create_workflow` | 工作流创建智能体，通过自然语言生成完整工作流定义 |

每个模板均包含详细的 `description` 字段，说明工作流用途、节点组成和典型场景。

### 4. LLM 分流节点增强（LlmBranchNode）

`ai/llm_branch` 节点全面升级，支持更灵活的路由逻辑：

- **多种匹配运算符**：`Truthy`（默认）、`Exists`、`Equals`、`NotEquals`、`Contains`、`GreaterThan`、`LessThan`
- **嵌套字段路径**：`field_name` 支持点号路径（如 `action.name`），访问嵌套 JSON 字段
- **Schema 提示生成**：根据 `branch_fields` 自动生成 JSON Schema 和系统提示片段，可接入上游 LLM 节点引导输出格式
- **增强兜底元数据**：路由失败时 `context_out` 携带失败原因、已尝试字段列表等诊断信息

---

## 优化与改进

### 配置架构
- **全局配置目录**：`CHENG_GLOBAL_CONFIG_DIR` 统一管理 `shortcuts.yaml` 和 `presets.yaml`，Docker 模式默认 `/app/config`，原生模式自动检测安装目录
- **分层配置体系**：全局配置 → 工作区配置，同 ID/名称可覆盖，支持灵活的多环境部署
- **环境变量文档化**：`.env.example` 新增 `CHENG_GLOBAL_CONFIG_DIR` 和 `TEMPLATE_WORKFLOWS_DIR` 详细注释

### 工作流模板
- **自动安装机制**：系统启动时检测 `TEMPLATE_WORKFLOWS_DIR`，自动将模板安装到新工作区
- **模板描述完善**：所有 9 个工作流模板均添加详细的英文描述，涵盖用途、节点组成和子工作流关系

---

## 环境变量变更

| 变量名 | 默认值 | 说明 |
|---|---|---|
| `CHENG_GLOBAL_CONFIG_DIR` | 自动检测 | 全局配置目录（`shortcuts.yaml` / `presets.yaml`），v0.02 引入，v0.03 完善配置内容 |
| `TEMPLATE_WORKFLOWS_DIR` | 自动检测 | 工作流模板目录，v0.02 引入，v0.03 填充 9 个预置模板 |

> 无新增环境变量，以上两项在 v0.02 已定义，v0.03 补充了实际配置文件和模板内容。

---

## 升级说明

### 从 v0.02 升级

```bash
# 下载最新安装包
./chengos.sh update

# 或手动升级
./build.sh --hybrid
# 然后将 dist/chengos-full-linux-amd64.tar.gz 传到服务器执行 chengos.sh update
```

升级后，新的 `presets.yaml` 和 `shortcuts.yaml` 会自动部署到全局配置目录，9 个工作流模板会安装到新创建的工作区。已有工作区不受影响，可通过手动导入模板获取新工作流。

### 全新安装

```bash
# Docker 模式
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash

# 原生二进制模式
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash -s -- --mode native
```

安装完成后编辑 `.env` 文件配置数据库密码和密钥，然后启动：

```bash
./chengos.sh start
```

---

## 已知限制

- 节点预设的 UI 选择面板仍在开发中，当前通过配置文件管理
- 分流快捷方式的 UI 切换入口尚未完成，当前通过 API 和配置文件使用
- 工作流模板为只读源，用户基于模板创建的工作流副本与模板无关联更新机制
- `presets.yaml` 的 `config_patch` 为浅合并，不支持嵌套对象的深度合并

---

## 反馈

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- 社区平台: ChengHub
