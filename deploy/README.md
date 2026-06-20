# ChengOS Deployment Guide / ChengOS 部署指南

This directory contains the files required to deploy the ChengOS system. You can choose between **Docker Containerized Deployment** and **Native Host Deployment**.

本目录包含了 ChengOS 系统的所有部署文件。您可以选择 **Docker 容器化部署** 或 **二进制原生部署**。

---

## Directory Layout / 目录结构

```
deploy/
├── .env.example            # Unified environment template (shared by all modes)
│                           # 统一环境配置模板（各模式共用）
├── .env                    # Generated unified environment file (created by any mode)
│                           # 统一生成的环境配置文件（各模式共用）
├── generate-env.sh         # Unified environment generator (all modes delegate to this)
│                           # 统一环境生成脚本（各模式脚本均调用此脚本）
├── app/                    # Shared cheng-app static assets
│                           # 共享 cheng-app 静态资源
├── bin/                    # Shared proxy server scripts and compiled binaries
│                           # 共享代理服务器脚本和编译后的二进制程序
├── config/                 # Shared provider config and i18n overrides
│                           # 共享提供商配置和 i18n 覆盖文件
├── infra/                  # Shared Postgres/Redis/Qdrant docker-compose
│                           # 共享 Postgres/Redis/Qdrant docker-compose
├── models/                 # Optional local OCR model files
│                           # 可选本地 OCR 模型文件
├── node_skills/            # Shared node skill guides
│                           # 共享节点技能指南
├── skills/                 # Shared workflow skill definitions
│                           # 共享工作流技能定义
├── ui/                     # Shared cheng-ui static assets
│                           # 共享 cheng-ui 静态资源
├── logs/                   # Runtime logs (created on demand)
│                           # 运行时日志（按需创建）
├── runtime/                # Runtime state / PID files (created on demand)
│                           # 运行时状态 / PID 文件（按需创建）
├── workspace/              # Cheng CLI sandbox directory (created on demand)
│                           # Cheng CLI 沙箱目录（按需创建）
├── hybrid/                 # Native deployment scripts
│                           # 二进制原生部署脚本
│   ├── chengos.sh          # Unified management script
│   ├── generate-env.sh     # Delegates to ../generate-env.sh
│   ├── start.sh            # Native start script
│   ├── stop.sh             # Native stop script
│   └── status.sh           # Native status script
├── docker/                 # Docker orchestration files (compose files + scripts)
│                           # Docker 部署文件 (docker-compose 等)
│   ├── docker-compose.yml
│   ├── docker-compose.binds.yml
│   ├── docker-compose.remote.yml
│   ├── generate-env.sh     # Delegates to ../generate-env.sh
│   ├── start.sh
│   └── upgrade.sh
└── distributed/            # Distributed deployment files
                            # 分布式部署文件
    ├── generate-env.sh     # Delegates to ../generate-env.sh, applies VPS overrides
    ├── install_db.sh
    ├── start.sh
    ├── status.sh
    └── stop.sh
```

> **Note / 说明**: `deploy/production` was removed. Use `deploy/docker` (full Docker) or `deploy/hybrid` (native binary) for production deployments.
> 已移除 `deploy/production`。生产环境部署请使用 `deploy/docker`（Docker 容器化）或 `deploy/hybrid`（二进制原生部署）。
>
> **Unified environment / 统一环境配置**: `deploy/.env` is the single environment file used by all deployment modes. Running any mode-specific `generate-env.sh` or `start.sh` creates or updates this file. Docker containers receive Docker-network overrides via `docker-compose.yml` while still reading the same `deploy/.env` for secrets and ports.
> `deploy/.env` 是所有部署模式共用的唯一环境文件。运行任意模式下的 `generate-env.sh` 或 `start.sh` 都会创建或更新此文件。Docker 容器通过 `docker-compose.yml` 中的 `environment` 覆盖 Docker 内部网络地址，但密钥和端口仍从同一个 `deploy/.env` 读取。

> **Shared resources / 共享资源**: `.env.example`, `app/`, `bin/`, `config/`, `infra/`, `models/`, `node_skills/`, `skills/`, and `ui/` are maintained at the `deploy/` root and shared by all deployment modes. Each mode directory contains only its own scripts and compose files.
> `.env.example`、`app/`、`bin/`、`config/`、`infra/`、`models/`、`node_skills/`、`skills/` 和 `ui/` 统一维护在 `deploy/` 根目录下，各部署模式共用。每个模式子目录只包含各自的脚本和编排文件。

---

## Quick Start / 快速开始

We provide a bilingual bootstrap manager script `chengos.sh` at the workspace root to orchestrate your installation, updates, and service controls.

我们在根目录下提供了一个中英双语的统一管理脚本 `chengos.sh`，用于调度安装、更新和启停服务。

For the planned installer improvements around initialization defaults, mode-aware updates, uninstall safety, restart, shortcuts, and language switching, see [ChengOS Installer Tool Development Plan](docs/chengos-installer-development-plan.md).

### 1. Cloned Repository Deployment / 克隆仓库部署

If you have cloned the deployment repository, run:

如果你已经克隆了部署仓库，请在根目录下运行：

```bash
# Start interactive menu (Supports English/Chinese)
# 启动交互式安装菜单 (支持中英文选择)
./chengos.sh
```

Or you can use CLI arguments for a silent, automated installation:

或者使用命令行参数进行无交互的自动化安装：

```bash
# Native sandboxed install / 原生沙箱化一键安装
./chengos.sh install --mode native --db-install-mode managed-process --with api,ui,app,cli

# Docker container install / Docker 容器化一键安装
./chengos.sh install --mode docker --with api,ui,app,cli
```

### 2. Standalone Bootstrap One-Liner / 网页一键下载安装

You can perform a full bootstrap install from a clean host using `curl` or `wget` (Make sure you upload the packaged release asset `chengos-full-linux-amd64.tar.gz` to your GitHub Releases):

您也可以在干净的服务器上通过 `curl` 或 `wget` 一键安装（请确保已在 GitHub Releases 页面中上传了打包后的 `chengos-full-linux-amd64.tar.gz` 部署包）：

```bash
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/chengos.sh | bash
```

---

## Deployment Modes / 部署模式说明

### A. Native Host Deployment (hybrid) / 二进制原生部署

Runs the compiled API binary and static web files natively on the host. Highly optimized, lightweight, and requires no Docker.

在主机上原生运行编译好的 API 二进制程序和网页静态资源。极度轻量，性能优异且无需 Docker。

- **Database Installation Modes (`DB_INSTALL_MODE`)**:
  - **`managed-process` (Default / 默认)**: Runs PostgreSQL, Redis, and Qdrant locally as user processes in a sandbox. No `sudo` or root permissions are required, and system packages are left untouched.
  - **`system-service`**: Installs databases natively via the package manager (`apt-get`) and registers them as system-wide systemd services. Requires `sudo` permissions.
- **Optional Modules**:
  You can enable/disable modules in your `.env`:
  - `ENABLE_REDIS=false` (If disabled, backend automatically boots in PG-only mode / 关闭时后台自动以纯 PG 模式启动)
  - `ENABLE_QDRANT=false` (If disabled, RAG/Vector features are disabled / 关闭时自动停用 RAG 向量检索功能)

**Manual Commands / 手动管理命令**:
```bash
cd hybrid/
./start.sh [--with api,ui,app]   # Start services / 启动指定服务
./status.sh                      # Check logs and ports / 检查日志与端口
./stop.sh [--with-infra]         # Stop services / 停止进程
```

### B. Docker Deployment / Docker 容器化部署

Standard containerized deployment using Docker Compose.

使用 Docker Compose 进行的标准容器化部署。

**Manual Commands / 手动管理命令**:
```bash
cd docker/
bash generate-env.sh             # Create ../.env / 创建环境配置文件（位于 deploy/ 根目录）
docker compose --env-file ../.env up -d   # Start containers / 启动容器
docker compose --env-file ../.env down    # Stop containers / 停止容器
```

---

## Port Mappings / 默认端口分配

- **API Backend / 接口后台**: `3000`
- **Main UI Page / 管理控制台 (cheng-ui)**: `8080` (Proxies requests to `3000`)
- **Chat App Widget / 聊天客户端 (cheng-app)**: `5055` (Proxies requests to `3000`)
- **PostgreSQL**: `5432`
- **Redis**: `6379`
- **Qdrant**: `6333` (HTTP) / `6334` (gRPC)
