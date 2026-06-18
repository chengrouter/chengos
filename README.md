# ChengOS Deployment Guide / ChengOS 部署指南

This directory contains the files required to deploy the ChengOS system. You can choose between **Docker Containerized Deployment** and **Native Host Deployment**.

本目录包含了 ChengOS 系统的所有部署文件。您可以选择 **Docker 容器化部署** 或 **二进制原生部署**。

---

## Directory Layout / 目录结构

```
deploy/
├── docker/                 # Docker deployment files (docker-compose, etc.)
│                           # Docker 部署文件 (docker-compose 等)
├── distributed/            # Distributed deployment files
│                           # 分布式部署文件
└── hybrid/                 # Native deployment files (run-scripts, server-scripts, etc.)
                            # 二进制原生部署文件 (启停脚本、代理服务器等)
```

---

## Quick Start / 快速开始

We provide a bilingual bootstrap manager script `chengos.sh` at the workspace root to orchestrate your installation, updates, and service controls.

我们在根目录下提供了一个中英双语的统一管理脚本 `chengos.sh`，用于调度安装、更新和启停服务。

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
cd deploy/hybrid/
./start.sh [--with api,ui,app]   # Start services / 启动指定服务
./status.sh                      # Check logs and ports / 检查日志与端口
./stop.sh [--with-infra]         # Stop services / 停止进程
```

### B. Docker Deployment / Docker 容器化部署

Standard containerized deployment using Docker Compose.

使用 Docker Compose 进行的标准容器化部署。

**Manual Commands / 手动管理命令**:
```bash
cd deploy/docker/
bash generate-env.sh             # Create .env / 创建环境配置文件
docker compose up -d             # Start containers / 启动容器
docker compose down              # Stop containers / 停止容器
```

---

## Port Mappings / 默认端口分配

- **API Backend / 接口后台**: `3000`
- **Main UI Page / 管理控制台 (cheng-ui)**: `8080` (Proxies requests to `3000`)
- **Chat App Widget / 聊天客户端 (cheng-app)**: `5055` (Proxies requests to `3000`)
- **PostgreSQL**: `5432`
- **Redis**: `6379`
- **Qdrant**: `6333` (HTTP) / `6334` (gRPC)
