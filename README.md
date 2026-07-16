<div align="center">

# ChengOS

### 你的 AI 办公助手 | Your AI Office Assistant

上传文档、管理文件、处理邮件、搭建知识库……用对话就能完成

Upload docs, manage files, process emails, build knowledge bases — get complex work done just by chatting

[安装部署 / Installation](#安装部署) · [功能场景 / Features](#功能场景) · [路线图 / Roadmap](#产品路线图) · [架构 / Architecture](#架构设计) · [English](#english)

</div>

---

## 介绍

ChengOS 是一个 AI 办公自动化平台。它把 AI、工具和数据整合在一起，让不懂代码的人也能通过自然语言对话来自动化办公任务。

不需要装一堆软件——ChengOS 把常用的办公能力都整合在一个地方。

### 核心特点

- **对话即操作** — 不需要写代码，告诉 AI 你想做什么，它帮你搞定
- **万物皆可问** — 上传文档、图片、音频、视频，AI 都能理解并回答问题
- **越用越聪明** — 搭建专属知识库，AI 从你的资料中找到精准答案

---

## 安装部署

一条命令即可完成安装：

```bash
curl -fsSL https://chengos.dev/chengos.sh | bash
```

脚本启动后可选择两种部署模式：

### Docker 部署

容器化部署，数据库、缓存和应用全部打包，开箱即用。

- 自动管理容器生命周期
- 一键启停所有服务
- 支持增量更新

### 二进制部署

原生安装，直接运行二进制文件，无需 Docker 环境。

- 无需 Docker 环境
- 更低的资源占用
- 适合生产环境部署

---

## 功能场景

| 场景 | 说明 |
|------|------|
| **AI 对话聊天** | 像聊天一样问 AI 任何问题，还能上传文件一起讨论 |
| **文档问答** | 上传 PDF、Word、Excel，AI 帮你总结内容、提取信息、回答问题 |
| **音视频理解** | 拍张纸的照片、发段录音、传个视频，AI 都能看懂听懂并回答你 |
| **专属知识库** | 把公司文档、手册丢进去，用自然语言搜索，AI 从你的资料里找答案 |
| **邮件助手** | AI 帮你读邮件、搜索、写回复、转发、归类，一句话搞定 |
| **文档/表格编辑** | 告诉 AI "把第三段改正式一点"或"补全缺失数据"，直接帮你改好 |
| **定时任务** | 设定每天早上自动汇总报告发邮件，不用人盯着，到点就执行 |
| **文件管理** | "找出所有包含预算的文件，做个汇总"——AI 自己一步步完成 |

---

## 使用方式

三步开始，就这么简单：

1. **选择模板或搭建工作流** — 从 11 个预置模板中选择，或拖拽搭建你自己的工作流
2. **和 AI 对话** — 告诉 AI 你想做什么，AI 自动理解你的意图
3. **AI 自动执行** — AI 选择合适的工作流自动执行，全程透明可见

### Skills 技能系统

AI 通过 Skills 理解你的需求，知道该调用哪个工作流。技能可随时添加，AI 即学即用。

---

## 技术特性

- **Docker 一键部署** — Docker Compose 一键启动，包含数据库、缓存和应用，开箱即用
- **多平台支持** — 支持 Linux、macOS、Windows，本地开发或云端部署都可以
- **9 大 AI 模型支持** — OpenAI、Claude、Gemini、DeepSeek、Ollama 等主流模型随你选
- **免费使用** — 个人和商业均可免费使用，后期提供企业版付费高级功能

---

## 产品路线图

### ✅ 已完成

核心功能已就绪，可以开始使用：

- AI 对话与文件处理
- 知识库搭建与问答
- ReAct 智能体
- 文档与表格编辑
- 邮件自动化
- 定时任务调度
- 9 大 AI 模型支持
- 60+ 内置节点

### 🚧 开发中

即将推出的新功能：

- WhatsApp / Telegram / Slack 接入
- MCP 协议支持
- 聊天软件直接驱动工作流
- 外部 AI 平台调用接入

### 📋 规划中

未来会实现的更多可能：

- 插件市场 — 一键安装社区工作流
- 团队协作与权限管理
- 数据看板与用量分析
- 移动端支持

---

## 典型工作流

### 文档问答流程

```
上传文档 → 解析内容 → AI 分析 → 返回答案
```

### 邮件助手流程

```
接收邮件 → AI 分类 → 生成回复 → 发送 / 归档
```

### 知识库检索流程

```
自然语言提问 → 向量检索 → AI 推理 → 精准回答
```

---

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   REST API   │  │  WebSocket   │  │   GraphQL    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Workflow Orchestrator                   │  │
│  │  • Lifecycle Management  • Event Dispatcher       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Workflow   │  │    Engine    │  │     Node     │  │
│  │   (Model)    │  │  (Executor)  │  │  (Runtime)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Persistence │  │    Cache     │  │   Message    │  │
│  │  (PostgreSQL)│  │  (Valkey)    │  │    Queue     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 设计原则

1. **关注点分离** — 清晰的层次边界
2. **可扩展性** — 插件化节点系统
3. **可靠性** — 错误恢复、重试、幂等性
4. **可观测性** — 全链路追踪、指标、日志
5. **高性能** — 异步执行、资源池化
6. **可测试性** — 依赖注入、Mock 支持

---

## 技术栈

- **后端**: Rust (Axum, Tokio, Petgraph)
- **前端**: Next.js, React, TypeScript, Tailwind CSS
- **数据库**: PostgreSQL
- **缓存**: Valkey
- **部署**: Docker Compose / 原生二进制

---

## 社区

- **GitHub**: [https://github.com/chengrouter/chengos](https://github.com/chengrouter/chengos)

---

## License

ChengOS 当前为**免费使用**授权，但**不开源**。

你可以免费使用 ChengOS 进行个人和商业办公自动化，但源码不公开。我们选择不开源是为了保护核心创新，避免被简单改皮后据为己有。

**后期规划**：

- **社区版**（免费）— 当前版本，包含核心办公自动化功能
- **企业版**（付费）— 提供团队协作、权限管理、数据看板等高级功能

如需商业合作或企业版咨询，请联系：hello@chengrouter.com

---

<div align="center">

**准备好让 AI 帮你办公了吗？一键安装 ChengOS，让 AI 成为你的办公搭档。**

</div>

---

# English

[← 中文](#介绍)

<div align="center">

# ChengOS

### Your AI Office Assistant

Upload docs, manage files, process emails, build knowledge bases — get complex work done just by chatting

</div>

---

## Introduction

ChengOS is an AI office automation platform. It brings AI, tools, and data together so anyone can automate their work through natural language conversations — no coding needed.

No need for a dozen apps — ChengOS puts everyday office tools in one place.

### Key Highlights

- **Chat to Act** — No coding required. Just tell AI what you want, and it gets it done
- **Ask Anything** — Upload documents, images, audio, or video — AI understands and answers
- **Gets Smarter Over Time** — Build your own knowledge base, and AI finds precise answers from your data

---

## Installation

Get started with a single command:

```bash
curl -fsSL https://chengos.dev/chengos.sh | bash
```

The installer supports two deployment modes:

### Docker

Containerized deployment with database, cache, and app all bundled — ready to go out of the box.

- Automatic container lifecycle management
- One-click start/stop for all services
- Incremental updates supported

### Binary

Native installation — run the binary directly, no Docker required.

- No Docker environment needed
- Lower resource footprint
- Suitable for production deployments

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Chat** | Chat with AI like a messaging app. Upload files and discuss them together |
| **Document Q&A** | Upload PDF, Word, or Excel files. AI summarizes, extracts info, and answers questions |
| **Audio & Video Understanding** | Send a photo, audio clip, or video — AI can see, hear, and understand it all |
| **Your Knowledge Base** | Drop in company docs and manuals. Search in plain language, AI finds answers from your data |
| **Email Assistant** | AI reads, searches, writes replies, forwards, and organizes your emails — just say the word |
| **Doc & Spreadsheet Editing** | Tell AI "Make paragraph 3 more formal" or "Fill in the missing data" and it edits directly |
| **Scheduled Tasks** | Set up daily auto-reports via email. No manual work needed — it runs on schedule |
| **File Management** | "Find all files mentioning budget and create a summary" — AI does it step by step |

---

## How It Works

Three steps to get started — it's that simple:

1. **Choose a template or build a workflow** — Pick from 11 pre-built templates, or drag and drop to build your own
2. **Chat with AI** — Tell AI what you want done. It automatically understands your intent
3. **AI executes automatically** — AI selects the right workflow and runs it — fully transparent and visible

### Skills System

AI understands your needs through Skills, knowing which workflow to call. Add new skills anytime — AI learns instantly.

---

## Technical Highlights

- **One-click Docker Deployment** — Docker Compose starts everything: database, cache, and app — ready to go
- **Multi-Platform Support** — Runs on Linux, macOS, and Windows. Deploy locally or in the cloud
- **9 AI Model Providers** — OpenAI, Claude, Gemini, DeepSeek, Ollama, and more — choose your favorite
- **Free to Use** — Free for personal and commercial use. Enterprise edition with advanced features coming soon

---

## Roadmap

### ✅ Available Now

Core features are ready to use:

- AI chat & file processing
- Knowledge base & Q&A
- ReAct agent
- Document & spreadsheet editing
- Email automation
- Scheduled task execution
- 9 AI model providers supported
- 60+ built-in nodes

### 🚧 In Progress

Coming soon:

- WhatsApp / Telegram / Slack integration
- MCP protocol support
- Chat apps driving workflows directly
- External AI platform integration

### 📋 Planned

More possibilities in the future:

- Plugin marketplace — one-click install community workflows
- Team collaboration & permissions
- Analytics dashboard & usage insights
- Mobile support

---

## Typical Workflows

### Document Q&A Flow

```
Upload Doc → Parse Content → AI Analysis → Return Answer
```

### Email Assistant Flow

```
Receive Email → AI Classify → Draft Reply → Send / Archive
```

### Knowledge Base Search Flow

```
Natural Language Query → Vector Search → AI Reasoning → Cited Answer
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   REST API   │  │  WebSocket   │  │   GraphQL    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Workflow Orchestrator                   │  │
│  │  • Lifecycle Management  • Event Dispatcher       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Workflow   │  │    Engine    │  │     Node     │  │
│  │   (Model)    │  │  (Executor)  │  │  (Runtime)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Persistence │  │    Cache     │  │   Message    │  │
│  │  (PostgreSQL)│  │  (Valkey)    │  │    Queue     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns** — Clear layer boundaries
2. **Extensibility** — Plugin-based node system
3. **Reliability** — Error recovery, retry, idempotency
4. **Observability** — Full-chain tracing, metrics, logging
5. **High Performance** — Async execution, resource pooling
6. **Testability** — Dependency injection, mock support

---

## Tech Stack

- **Backend**: Rust (Axum, Tokio, Petgraph)
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **Cache**: Valkey
- **Deployment**: Docker Compose / Native binary

---

## Community

- **GitHub**: [https://github.com/chengrouter/chengos](https://github.com/chengrouter/chengos)

---

## License

ChengOS is currently **free to use** but **not open source**.

You may use ChengOS for free for personal and commercial office automation. However, the source code is not publicly available. We've chosen not to open source to protect our core innovations from being simply rebranded by others.

**Future Plans**:

- **Community Edition** (Free) — Current version with core office automation features
- **Enterprise Edition** (Paid) — Team collaboration, permissions management, analytics dashboard, and more

For business inquiries or enterprise consultation, contact: hello@chengrouter.com

---

<div align="center">

**Ready to let AI handle your work? Install ChengOS in one click and make AI your office partner.**

</div>
