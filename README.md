# ChengOS 部署与系统架构指南 / ChengOS Deployment & Architecture Guide

<div align="center">

[安装部署 / Installation](#6-部署步骤与快捷命令-quick-start--commands) · [核心特性 / Features](#2-系统核心特性-key-features) · [工具目录 / Tools](#3-工作流工具箱一览-workflow-tools-directory) · [English](#english)

</div>

---

ChengOS 是一个可视化的 AI 数据处理与智能体工作流系统。本目录包含了 ChengOS 系统生产与开发环境的完整部署脚本、基础设施配置与运行资源。

---

## 1. 核心功能模块与客户端/服务端架构 (Architecture & Modules)

ChengOS 采用标准的 **客户端/服务端 (Client-Server)** 架构，各组件职责明确，通过高效率 REST API 与 WebSocket 双向数据流通信：

```
                              ┌───────────────────────────────────┐
                              │     后端核心服务 (chengflow)      │
                              │    Rust DAG Engine / REST & WS    │
                              └─────────────────┬─────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│  可视化管理后台  │                  │   应用/聊天网关  │                  │  终端 CLI 客户端 │
│  (chengflow-ui)  │                  │ (chengflow-app)  │                  │   (cheng CLI)    │
│ React Flow 画布  │                  │ Web Widget / H5  │                  │ 本地 / 跨设备 URL│
└──────────────────┘                  └──────────────────┘                  └──────────────────┘
```

| 模块名称 | 技术栈 | 功能角色与主要职责 |
|---|---|---|
| **`chengflow` / `cheng-api`** | Rust (Cargo 空间) | **服务端核心**: 高性能 DAG 工作流执行引擎，提供 REST + WebSocket API、节点与工具沙箱、凭证隔离、多租户权限、向量检索与调度器。 |
| **`chengflow-ui` / `cheng-ui`** | React 18 + TS + Vite | **Web 编辑与管理端**: 基于 React Flow 的可视化工作流编排画布、MCP Hub 配置管理、Skill 技能包协同、本地 Word/表格可视化编辑工作区。 |
| **`chengflow-app` / `cheng-app`** | React 18 + TS + Vite | **应用客户端与聊天网关**: 支持多 Channel / 应用通道绑定，提供嵌入式 Web Widget 以及适配手机端/平板的响应式 H5/PWA 聊天对话界面。 |
| **`cheng` CLI (`chengctl`)** | Rust 命令行工具 | **终端交互客户端**: 支持本地直连与**跨设备 URL 远程连接**，提供类似于 Claude Code / Codex 的终端交互对话与工作流/智能体执行能力。 |
| **`deploy/`** | Shell + Docker Compose | **系统部署与运维工具**: 包含统一部署管理脚本 `chengos.sh`，支持二进制原生部署 (hybrid) 与 Docker Compose 容器化部署 (docker)。 |

---

## 2. 系统核心特性 (Key Features)

### 🔌 Model Context Protocol (MCP) 原生支持
- **MCP Client & Server 协同**: 内置 `tools/mcp_hub` 节点与底层 MCP 客户端驱动，支持通过 Stdio、SSE (Server-Sent Events) 与 HTTP 传输协议接入外部 MCP 服务。
- **动态工具与上下文发现**: ReAct Agent 和工作流节点可自动发现并调用 MCP Server 暴露的工具 (Tools)、提示词模板 (Prompts) 与上下文资源 (Resources)，标准化扩充 LLM 能力边界。
- **UI & 环境变量集中配置**: 可以在 `chengflow-ui` 管理后台进行可视化的 MCP 服务连接管理，也可在 `.env` 中批量注入预设 MCP 规则。

### 📦 Skills 多格式灵活导入 (Multi-Format Skill Import)
ChengOS 内置了完整的 `skill-importer` 自动化导入流水线，支持将各种来源的能力定义一键转换为可运行的 Skill 包：
1. **自然语言 / Prompt 智能生成**: 描述你想要的自动化能力，LLM 自动分析并生成对应的技能代码与定义文件。
2. **HTTP / Web URL 导入**: 直接输入网页或远程 API 描述链接，系统自动提取结构化 Skill 规范。
3. **Git 仓库自动解析**: 给出 Git 仓库地址，流水线可抓取仓库中的代码与配置，智能解析并构建 Skill 包。
4. **标准 `SKILL.md` 与既有包**: 兼容标准 Markdown + YAML Frontmatter 的 `SKILL.md` 文件或 ZIP 压缩包一键导入。
- **安全流水线**: 导入过程包含自动解析 ➔ 标准校验 (`tools/validate_skill_spec`) ➔ 人工审核 ➔ 安全写入 (`tools/write_skill_package`) ➔ `SkillFileWatcher` 动态热加载入库。

### 🔐 统一凭证管理与安全隔离 (Credential System & Security Isolation)
- **拒绝凭证裸奔**: 彻底告别在工作流节点配置、Skills 定义、JSON 文件或硬编码脚本中明文裸露 API Key / Token / 密码的做法。所有敏感凭证均由底层凭证仓库 (Credential Vault) 统一加密托管。
- **LLM 零接触安全隔离**: 无论是工作流节点还是自主 ReAct Agent，在推理与决策过程中 **LLM 完全接触不到任何真实凭证明文**。
- **Tools 与 Skills 全面支持凭证注入**: `utils/credential` 凭证节点与后端引擎 (Rust) 在运行时动态解析凭证，并绑定至具体工具 (`tools/http`, `tools/mcp_hub`, `tools/ssh` 等) 以及 **Skills 执行流程 (`tools/skill`, `tools/skills_hub`)** 中。
- **隐式安全绑定**: 敏感密钥仅在服务端底层真实发起网络通信或命令行执行时注入，不经过 LLM Prompt 提示词上下文，从根源上杜绝 Prompt 注入导致的凭证泄露风险。
- **沙箱隔离与多租户隔离**: 结合沙箱权限管理与用户 `user_id` 数据隔离，确保生产环境与私有化部署的安全合规。

### 📄 本地 Word 文档与电子表格编辑 (Local Document & Spreadsheet Workspace)
- **无需依赖外部在线文档平台**: 内置本地富文本/Word (`.docx`) 与电子表格 (`.xlsx`/网格) 可视化画布，**无需连接飞书、Google Sheets 等在线表格工具即可直接编辑**。
- **离线与数据隐私安全**: 所有文档和表格数据均存储于本地工作区沙箱，满足高安全与私有化部署要求。
- **工作流与 AI 深度整合**: 配合 `document-ops_hub` 和 `table-apply_record_ops` 等节点，Agent 可直接在工作流中读取、格式化、批量修改或生成本地 Word 与 Excel 数据。

### 🖥️ CLI 终端（本地运行与跨设备 URL 远程连接）
- **本地直连模式**: 与 `cheng-api` 同机部署时，CLI 自动连接 `http://127.0.0.1:3000`，免配快速上手。
- **跨设备 URL 远程运行**: CLI 可安装在任何开发机、笔记本或远程服务器上，只需配置远程 ChengOS 服务器的 URL (例如 `https://your-server.example.com`)，即可跨设备远程调度服务端的 Workflow 与 Agent。
- **沉浸式终端对话体验**: 类似 Claude Code / Codex 等先进终端工具，支持命令行实时流式对话、自动工具调用展示与上下文保持。

### 💬 多种聊天交互入口 (Multiple Chat Entrances)
针对不同的使用场景，ChengOS 提供了三类高效的聊天交互入口：
1. **Web UI 前端编排 + 嵌入式聊天对话框**: 在编排工作流的同时，可以在 UI 右侧或下方调出 Chat 窗口进行实时测试、调试与生成。
2. **App 桌面 Web + 手机 IM / H5 / PWA 移动端对话**: 通过 `chengflow-app` 网关，接入 WhatsApp、Telegram、Slack 等主流移动社交/IM 终端以及手机浏览器/PWA 移动应用进行对话，支持响应式布局与多通道隔离。
3. **CLI 终端实时对话**: 面向命令行爱好者与运维开发人员，通过终端 `cheng` 命令实现无 UI 依赖的高效实时交互。

---

## 3. 工作流工具箱一览 (Workflow Tools Directory)

ChengOS 工作流引擎内置了涵盖代码执行、文件管理、网络抓取、AI 多模态、文档表格及系统调度的丰富工具库：

### 💻 代码与 Shell 执行 (Code & Shell Sandbox)
- **`tools/code_shell`**: 沙箱内 Bash/Shell 命令执行，支持自定义环境变量与工作目录限制。
- **`tools/code_python`**: 本地 Python 脚本执行器，支持数据处理、数据分析与科学计算。
- **`tools/code_js`**: JavaScript / Node.js 脚本沙箱，用于轻量级逻辑与 JSON 数据转换。

### 📁 文件系统与工作区管理 (File & Workspace Tools)
- **`tools/read_file` / `tools/write_file`**: 沙箱文件的安全读取与创建/覆盖写入。
- **`tools/edit_file` / `tools/patch_file` / `tools/diff_file`**: 代码与文本文件的精确行替换、Patch 补丁应用与 Diff 比对。
- **`tools/copy_file` / `tools/move_file` / `tools/delete_file`**: 文件与目录的复制、移动、重命名及删除。
- **`tools/backup_file` / `tools/rollback_file`**: 文件快捷备份与故障回滚机制。
- **`tools/search_files` / `tools/list_directory` / `tools/file_info`**: 正则文件搜索、目录列表展示与文件元数据查看。
- **`tools/validate_file`**: 文件格式、编码及语法校验。

### 🌐 网络与外部集成 (Web & Remote Integration)
- **`tools/http`**: 通用 HTTP/HTTPS API 请求客户端，支持 Auth 凭证管理、自定义 Header 与 JSON/Form 请求体。
- **`tools/browser`**: 无头浏览器 (Playwright/Puppeteer) 网页自动化，支持页面导航、截图、DOM 元素提取与交互。
- **`tools/web`**: Web 搜索引擎接入与网页内容提纯提取。
- **`tools/mail`**: SMTP/IMAP 邮件自动发送与读取。
- **`tools/ssh`**: 远程服务器 SSH 命令执行与运维交互。
- **`tools/fetch_repository`**: Git 仓库 Clone、Pull 与代码分支获取。

### 🤖 AI 推理与多模态 (AI & Multimodal)
- **`ai/llm`**: 通用大语言模型调用（支持 OpenAI、Claude、DeepSeek、Ollama 等兼容接口）。
- **`ai/llm_branch`**: LLM 智能条件分流与路由节点，支持根据提示词或字段条件分派下游分支。
- **`agent/react_agent`**: ReAct 自主智能体节点，支持多轮思考 (Reasoning) 与工具迭代调用。
- **`tools/generate_image` / `tools/generate_audio` / `tools/generate_video`**: AI 图像生成、语音合成 (TTS) 与视频生成。
- **`io/speech_to_text` (ASR)**: 语音转文字与音频转写。
- **`io/ocr`**: 图片文本识别与文档 OCR 解析。
- **`ai/translation`**: 多语言智能翻译。
- **`io/video_extract_audio` / `io/video_extract_frames`**: 视频音频提取与关键帧采样。

### 📝 文档、表格与 RAG 数据处理 (Document & Table Automation)
- **`document/ops_hub` & `document/*`**: 智能文档组装、块更新 (Update Block)、上下文构建与格式化。
- **`table/apply_record_ops` & `table/query`**: 本地电子表格与网格数据的结构化查询、记录增删改查。
- **`rag/document_indexer` / `rag/retriever` / `rag/chunker`**: RAG 知识库文档分块、向量化索引与上下文检索。

### ⚙️ 系统调度与高阶拓展 (System & Orchestration)
- **`tools/schedule`**: 定时任务 (Cron) 与延迟提醒调度器。
- **`tools/mcp_hub`**: MCP 服务扩展节点。
- **`tools/skills_hub` / `tools/skill`**: 动态技能包加载与凭证安全执行。
- **`tools/subflow` / `tools/batch_subflow`**: 子工作流嵌套调用与并行批量处理。
- **`utils/approver`**: 人工审批与 Human-in-the-loop 交互等待节点。
- **`agent/workflow_inspect`**: 工作流与节点 Schema 自检调试工具。

---

## 4. 目录结构说明 (Directory Layout)

```
deploy/
├── chengos.sh              # 统一中英双语管理与安装工具脚本 (根目录与 deploy/ 均可执行)
├── generate-env.sh         # 统一环境变量生成脚本 (根据配置自动推导端口与路径)
├── .env.example            # 统一环境变量配置模板
├── .env                    # 当前运行环境的统一配置文件 (生成后由各模式共用)
├── app/                    # cheng-app 编译后的前端静态资源
├── ui/                     # cheng-ui 编译后的前端静态资源
├── bin/                    # 编译后的 cheng-api / cheng CLI 二进制与 Node 代理服务
├── config/                 # 共享配置文件、节点 i18n 覆盖与全局预设 (presets.yaml/shortcuts.yaml)
├── infra/                  # 数据库 Docker Compose 描述文件 (Postgres / Valkey / Qdrant)
├── skills/                 # 系统预置 Skill 技能定义库与 skill-importer 导入器
├── workflow-templates/     # 预置工作流模板库 (启动时自动安装到新工作区)
├── models/                 # 可选的本地 OCR/AI 模型存储目录
├── logs/                   # 系统运行日志输出目录
├── workspace/              # CLI 与工作流沙箱文件存储目录
├── hybrid/                 # 原生二进制部署模式脚本目录 (start.sh / stop.sh / status.sh)
├── docker/                 # Docker 容器化部署模式目录 (docker-compose.yml / start.sh 等)
└── distributed/            # 多机分布式部署参考脚本
```

---

## 5. 集成安装工具箱 (`chengos.sh`) 使用指南

ChengOS 提供了功能完善的一键部署与运维脚本 `chengos.sh`，支持交互式菜单与静默 CLI 命令：

```bash
# 启动交互式控制台菜单 (支持中英文语言选择)
./chengos.sh
```

### 🛠️ 交互式菜单功能一览
1. **安装/初始化模块 (Install/Init)**: 可选二进制原生或 Docker 容器化模式，支持全量安装、最小安装或自定义选择模块。
2. **启动服务 (Start)**: 启动选定的部署服务。
3. **停止服务 (Stop)**: 停止运行中的服务，可选是否一并停止数据库。
4. **重启服务 (Restart)**: 一键重新加载配置与重启应用服务。
5. **更新模块 (Update)**: 支持单独更新部署脚本、更新最新 Release 部署包 (含 `cheng` CLI 二进制) 或两者同时更新。
6. **单独安装 CLI (Install CLI Only)**: 快速为本机或远程终端配置 `cheng` 命令行客户端。
7. **查看服务状态 (Status)**: 查看进程 PID、端口占用与实时运行日志。
8. **安装系统快捷命令 (Install Command Shortcuts)**: 一键向系统路径 (`/usr/local/bin`) 创建快捷启动命令软链接：
   - 运行 **`chengos`**：在任意终端窗口快速调出控制台管理工具箱菜单；
   - 运行 **`cheng`**：在任意终端窗口快速启动 CLI 终端实时对话。
9. **卸载/停用模块 (Uninstall)**: 清理运行进程与静态文件，可选择保留或彻底清理数据库数据。
10. **切换语言 (Switch Language)**: 中文 / English 界面一键切换。

---

## 6. 部署步骤与快捷命令 (Quick Start & Commands)

### 🚀 A. 二进制原生部署 (Hybrid Mode - 推荐轻量体验)

在宿主机上直接运行编译好的 API 二进制程序和网页静态资源，无需 Docker 即可获得极佳性能。

```bash
# 1. 运行一键安装命令 (默认沙箱进程模式，无需 sudo 根权限)
./chengos.sh install --mode native --db-install-mode managed-process --with api,ui,app,cli

# 2. 启动服务
./chengos.sh start

# 3. 查看状态
./chengos.sh status
```

> **数据库模式说明 (`DB_INSTALL_MODE`)**:
> - `managed-process` (默认推荐): 将 PostgreSQL、Valkey 和 Qdrant 以普通用户沙箱进程方式运行，**无需系统 root/sudo 权限**。
> - `system-service`: 使用系统包管理器通过 `apt-get` 安装数据库并注册为 systemd 系统服务，需要 `sudo` 权限。

---

### 🐳 B. Docker 容器化部署 (Docker Mode)

使用标准的 Docker Compose 进行容器化调度管理。

```bash
# 1. 容器化一键安装
./chengos.sh install --mode docker --with api,ui,app,cli

# 2. 启动 Docker 容器组
./chengos.sh start

# 3. 停止容器组
./chengos.sh stop
```

---

### 💻 C. CLI 独立安装与远程连接设置

如果你只需要在其他开发机或终端上使用 `cheng` 命令行连接远程的 ChengOS 服务：

```bash
# 本地终端选择快捷安装 CLI
./chengos.sh cli

# 模式选择：
#  1) 本机安装 — 自动连接 http://127.0.0.1:3000
#  2) 远程终端安装 — 输入远程 ChengOS 服务器地址 (如 https://your-server.example.com)
```

安装完成后，在任意命令行窗口中直接运行：
```bash
cheng
```
即刻开启终端实时对话与工作流执行。

---

## 7. 默认端口与服务分配 (Default Ports)

| 服务名称 | 默认端口 | 环境变量配置项 | 说明 |
|---|---|---|---|
| **API Backend (cheng-api)** | `3000` | `PORT=3000` | 后端核心 API 与 WebSocket 端口 |
| **Main UI (cheng-ui)** | `8080` | `UI_PORT=8080` | Web 可视化编排与管理控制台 |
| **Chat App (cheng-app)** | `5055` | `APP_PORT=5055` | 聊天应用客户端与移动端 H5 界面 |
| **PostgreSQL** | `5432` | `POSTGRES_PORT=5432` | 主关系型数据库 |
| **Valkey (Redis 兼容)** | `6379` | `REDIS_PORT=6379` | 高速缓存与速率限制器 |
| **Qdrant Vector DB** | `6333` / `6334` | `QDRANT_PORT=6333` | RAG 向量检索数据库 (HTTP/gRPC) |

---

## 8. 许可证与授权说明 (License)

ChengOS 当前为**免费使用**授权，但**不开源**。

你可以免费使用 ChengOS 进行个人和商业办公自动化，但源码不公开。我们选择不开源是为了保护核心创新，避免被简单改皮后据为己有。

**后期规划**：

- **社区版**（免费）— 当前版本，包含核心办公自动化功能
- **企业版**（付费）— 提供团队协作、权限管理、数据看板等高级功能

如需商业合作或企业版咨询，请联系：hello@chengrouter.com

---

# English

[← 中文](#1-核心功能模块与客户端服务端架构-architecture--modules)

<div align="center">

# ChengOS Deployment & Architecture Guide

Visual AI Data Processing & Agentic Workflow Engine

[Installation](#6-deployment-steps--commands) · [Features](#2-key-system-features) · [Tools Directory](#3-workflow-tools-directory)

</div>

---

ChengOS is a visual AI data processing and agent workflow system. This directory contains deployment scripts, infrastructure configs, and runtime resources for production and development.

---

## 1. Architecture & Core Modules

ChengOS uses a standard **Client-Server** architecture with clear module responsibilities, communicating via high-performance REST API and WebSocket streams:

```
                              ┌───────────────────────────────────┐
                              │    Backend Service (chengflow)    │
                              │    Rust DAG Engine / REST & WS    │
                              └─────────────────┬─────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│ Visual Management│                  │ App/Chat Gateway │                  │   Terminal CLI   │
│   (chengflow-ui) │                  │ (chengflow-app)  │                  │   (cheng CLI)    │
│ React Flow Canvas│                  │ Web Widget / H5  │                  │Local / Remote URL│
└──────────────────┘                  └──────────────────┘                  └──────────────────┘
```

| Module | Tech Stack | Role & Key Responsibilities |
|---|---|---|
| **`chengflow` / `cheng-api`** | Rust (Cargo workspace) | **Backend Core**: High-performance DAG workflow engine, REST + WebSocket API, node & tool sandbox, credential vault isolation, multi-tenant RBAC, vector retrieval, and scheduling. |
| **`chengflow-ui` / `cheng-ui`** | React 18 + TS + Vite | **Web Editor & Management**: React Flow visual editor, MCP Hub configuration management, Skill package orchestration, local Word/Excel document canvas. |
| **`chengflow-app` / `cheng-app`** | React 18 + TS + Vite | **App Gateway & Chat UI**: App pairing, channel routing, embedded Web Widget, and responsive H5/PWA chat interface for mobile/tablet devices. |
| **`cheng` CLI (`chengctl`)** | Rust CLI Binary | **Terminal Client**: Local connection & **cross-device URL remote execution**, providing Claude Code / Codex style terminal chat and agent execution. |
| **`deploy/`** | Shell + Docker Compose | **Deployment & Operations**: Dual-mode bootstrap manager script `chengos.sh`, supporting Native Hybrid and Docker Compose deployments. |

---

## 2. Key System Features

### 🔌 Native Model Context Protocol (MCP) Support
- **MCP Client & Server Integration**: Built-in `tools/mcp_hub` node and native MCP client driver, supporting Stdio, SSE (Server-Sent Events), and HTTP transports.
- **Dynamic Tool & Resource Discovery**: ReAct Agents and workflow nodes automatically discover and execute MCP tools, prompts, and context resources.
- **Visual & Env Config**: Centralized configuration management via `chengflow-ui` or bulk `.env` rules.

### 📦 Multi-Format Skill Import Pipeline
Built-in `skill-importer` pipeline converts external capability specifications into runnable Skill packages:
1. **Natural Language / Prompt Generation**: Describe automated tasks; LLM generates skill logic and manifest files.
2. **HTTP / Web URL Import**: Pass a web page or API documentation URL; system extracts structured skill specs.
3. **Git Repository Parsing**: Provide a Git repository URL; pipeline fetches source code/configs and parses skills.
4. **Standard `SKILL.md` & Packages**: Direct import of standard `SKILL.md` files (with YAML frontmatter) or ZIP packages.
- **Security Pipeline**: Parsing ➔ Standard Validation (`tools/validate_skill_spec`) ➔ Review ➔ Safe Write (`tools/write_skill_package`) ➔ Hot-reload via `SkillFileWatcher`.

### 🔐 Credential Management & Security Isolation
- **No Raw Credential Exposure**: Eliminates plain-text API keys, Tokens, or passwords in workflow nodes, Skills definitions, or JSON files. All sensitive credentials are encrypted in the backend Credential Vault.
- **Zero LLM Contact**: During reasoning and execution, **LLMs have zero access to raw credential secrets**.
- **Tools & Skills Credential Injection**: `utils/credential` node and Rust backend engine dynamically resolve credentials at runtime, binding them to both tool nodes (`tools/http`, `tools/mcp_hub`, `tools/ssh`) and **Skill executions (`tools/skill`, `tools/skills_hub`)**.
- **Implicit Secure Injection**: Secrets are injected only during low-level network or shell execution on the server side, never exposed to LLM prompt contexts, preventing prompt injection leaks.
- **Sandboxing & Multi-Tenancy**: Combines sandbox execution limits with user-level `user_id` data isolation for enterprise compliance.

### 📄 Local Word & Spreadsheet Workspace
- **No Third-Party Online Sheet Dependence**: Integrated visual canvas for rich text/Word (`.docx`) and Spreadsheet (`.xlsx`/grid). **Edits locally without connecting to external platforms like Feishu or Google Sheets**.
- **Offline & Privacy-First**: Files and tables are stored within local workspace sandboxes, ensuring complete data privacy.
- **AI & Workflow Integration**: Paired with `document-ops_hub` and `table-apply_record_ops` nodes, Agents read, format, and update Word and Excel data programmatically.

### 🖥️ CLI Terminal (Local & Cross-Device Remote Execution)
- **Local Mode**: Auto-connects to co-located `http://127.0.0.1:3000`.
- **Remote Cross-Device Mode**: Configure a remote ChengOS server URL (e.g. `https://your-server.example.com`) to trigger workflows and Agents from any machine.
- **Claude Code / Codex Terminal Experience**: Streamed responses, tool execution display, and interactive session history directly in your terminal.

### 💬 Multiple Chat Entry Points
1. **Web UI Canvas + Embedded Chat**: Visual workflow editing combined with instant side-panel chat for testing and generation.
2. **App Desktop + Mobile IM / H5 / PWA Chat**: Driven by the `chengflow-app` channel gateway, connects mainstream mobile chat apps (WhatsApp, Telegram, Slack, etc.), Web Widgets, or mobile browser/PWA apps, providing decoupled channel routing and session isolation.
3. **CLI Real-Time Terminal Chat**: Fast, lightweight command-line chat for developers and SSH power users.

---

## 3. Workflow Tools Directory

### 💻 Code & Shell Sandbox
- **`tools/code_shell`**: Sandboxed Bash/Shell execution with environment variable and path bounds.
- **`tools/code_python`**: Local Python execution for data analysis and scientific computing.
- **`tools/code_js`**: JavaScript / Node.js execution for JSON data transformations.

### 📁 File System & Workspace Tools
- **`tools/read_file` / `tools/write_file`**: Read and write files safely in sandbox.
- **`tools/edit_file` / `tools/patch_file` / `tools/diff_file`**: Line editing, patch applying, and diff generation.
- **`tools/copy_file` / `tools/move_file` / `tools/delete_file`**: Copy, move, rename, and delete file operations.
- **`tools/backup_file` / `tools/rollback_file`**: Rapid file snapshot backup and rollback.
- **`tools/search_files` / `tools/list_directory` / `tools/file_info`**: Regex search, directory listing, and metadata inspection.
- **`tools/validate_file`**: File encoding, syntax, and format validation.

### 🌐 Network & External Integrations
- **`tools/http`**: General HTTP/HTTPS API client with auth credentials and custom headers.
- **`tools/browser`**: Headless browser automation (Playwright/Puppeteer) for web page navigation, screenshots, and extraction.
- **`tools/web`**: Web search engine integration and clean content extraction.
- **`tools/mail`**: SMTP/IMAP email sending and fetching.
- **`tools/ssh`**: Remote server SSH command execution.
- **`tools/fetch_repository`**: Git repository clone, pull, and branch checkout.

### 🤖 AI Inference & Multimodal
- **`ai/llm`**: LLM provider invocation (OpenAI, Claude, DeepSeek, Ollama, etc.).
- **`ai/llm_branch`**: Intelligent conditional routing node.
- **`agent/react_agent`**: ReAct autonomous Agent node with multi-step reasoning and tool iterations.
- **`tools/generate_image` / `tools/generate_audio` / `tools/generate_video`**: AI image, text-to-speech, and video generation.
- **`io/speech_to_text` (ASR)**: Speech recognition and audio transcription.
- **`io/ocr`**: Image OCR text recognition and document extraction.
- **`ai/translation`**: Multi-language AI translation.
- **`io/video_extract_audio` / `io/video_extract_frames`**: Video audio extraction and frame sampling.

### 📝 Document, Table & RAG Processing
- **`document/ops_hub` & `document/*`**: Smart document assembly, block updates, and formatting.
- **`table/apply_record_ops` & `table/query`**: Structured table/grid query and CRUD operations.
- **`rag/document_indexer` / `rag/retriever` / `rag/chunker`**: Knowledge base chunking, vector indexing, and retrieval.

### ⚙️ System & Orchestration
- **`tools/schedule`**: Cron and delayed task scheduler.
- **`tools/mcp_hub`**: MCP server integration hub.
- **`tools/skills_hub` / `tools/skill`**: Dynamic Skill package execution with credential binding.
- **`tools/subflow` / `tools/batch_subflow`**: Sub-workflow nesting and parallel batch execution.
- **`utils/approver`**: Human-in-the-loop approval wait node.
- **`agent/workflow_inspect`**: Workflow and node schema self-inspection.

---

## 4. Directory Layout

```
deploy/
├── chengos.sh              # Bilingual installer & manager utility
├── generate-env.sh         # Unified environment variable generator
├── .env.example            # Environment template
├── .env                    # Active environment file (shared by native & docker)
├── app/                    # Built cheng-app static web files
├── ui/                     # Built cheng-ui static web files
├── bin/                    # Compiled cheng-api, cheng CLI, and proxy binaries
├── config/                 # Shared configs, i18n overrides, presets (presets.yaml/shortcuts.yaml)
├── infra/                  # Database docker-compose files (Postgres / Valkey / Qdrant)
├── skills/                 # Built-in skills library and skill-importer
├── workflow-templates/     # Pre-built workflow templates (auto-installed on boot)
├── models/                 # Optional local OCR/AI model storage
├── logs/                   # System runtime logs
├── workspace/              # CLI & sandbox workspace storage
├── hybrid/                 # Native binary mode scripts (start.sh / stop.sh / status.sh)
├── docker/                 # Docker Compose mode files (docker-compose.yml / start.sh)
└── distributed/            # Distributed multi-node deployment scripts
```

---

## 5. Integrated Installation Toolbox (`chengos.sh`)

ChengOS includes an interactive and non-interactive management utility `chengos.sh`:

```bash
# Launch interactive menu (Supports English / Chinese)
./chengos.sh
```

### 🛠️ Interactive Options
1. **Install/Init Modules**: Native or Docker mode with Full, Minimal, or Custom module selections.
2. **Start Services**: Launch configured services.
3. **Stop Services**: Stop running services (optionally teardown databases).
4. **Restart Services**: Reload configurations and restart services.
5. **Update Modules**: Update management scripts, release tarballs (with `cheng` CLI), or both.
6. **Install CLI Only**: Quick setup for local or remote `cheng` CLI.
7. **Service Status**: Inspect process PIDs, ports, and live logs.
8. **Install Command Shortcuts**: Installs global launcher symlinks to system path (`/usr/local/bin`):
   - Run **`chengos`**: Quickly launches the interactive management toolbox menu from any terminal;
   - Run **`cheng`**: Quickly launches the real-time CLI chat terminal from any terminal.
9. **Uninstall Modules**: Teardown processes, with choice to keep or erase databases.
10. **Switch Language**: Toggle Chinese / English UI.

---

## 6. Deployment Steps & Commands

### 🚀 A. Native Host Deployment (Hybrid Mode)

Runs API binary and static web assets natively on host without Docker.

```bash
# 1. One-click native install (sandboxed managed-process mode, no root required)
./chengos.sh install --mode native --db-install-mode managed-process --with api,ui,app,cli

# 2. Start services
./chengos.sh start

# 3. Check status
./chengos.sh status
```

> **Database Installation Modes (`DB_INSTALL_MODE`)**:
> - `managed-process` (Default): Runs PostgreSQL, Valkey, and Qdrant as unprivileged user processes. **No root/sudo required**.
> - `system-service`: Installs databases via system package manager (`apt-get`) as systemd services. Requires `sudo`.

---

### 🐳 B. Docker Compose Deployment (Docker Mode)

Standard containerized deployment using Docker Compose.

```bash
# 1. One-click Docker install
./chengos.sh install --mode docker --with api,ui,app,cli

# 2. Start containers
./chengos.sh start

# 3. Stop containers
./chengos.sh stop
```

---

### 💻 C. CLI Standalone Install & Remote Setup

To install `cheng` CLI on a local or remote machine connecting to a ChengOS server:

```bash
# Run CLI setup wizard
./chengos.sh cli

# Select mode:
#  1) Local machine — auto-connects to http://127.0.0.1:3000
#  2) Remote machine — enter remote ChengOS server URL (e.g. https://your-server.example.com)
```

Start chatting instantly from terminal:
```bash
cheng
```

---

## 7. Default Ports Mapping

| Service | Default Port | Env Var | Description |
|---|---|---|---|
| **API Backend (cheng-api)** | `3000` | `PORT=3000` | Core API & WebSocket server |
| **Main UI (cheng-ui)** | `8080` | `UI_PORT=8080` | Web visual editor & admin console |
| **Chat App (cheng-app)** | `5055` | `APP_PORT=5055` | Chat app widget & mobile H5 interface |
| **PostgreSQL** | `5432` | `POSTGRES_PORT=5432` | Primary relational database |
| **Valkey (Redis compatible)** | `6379` | `REDIS_PORT=6379` | Cache & rate limiter |
| **Qdrant Vector DB** | `6333` / `6334` | `QDRANT_PORT=6333` | RAG vector database (HTTP/gRPC) |

---

## 8. License

ChengOS is currently **free to use** but **not open source**.

You may use ChengOS for free for personal and commercial office automation. However, the source code is not publicly available. We've chosen not to open source to protect our core innovations from being simply rebranded by others.

**Future Plans**:

- **Community Edition** (Free) — Current version with core office automation features
- **Enterprise Edition** (Paid) — Team collaboration, permissions management, analytics dashboard, and more

For business inquiries or enterprise consultation, contact: hello@chengrouter.com
