# ChengOS v0.02 发布说明

> 发布日期：2025-07-25
> 上一版本：v0.01

---

## 概述

v0.02 是 ChengOS 的第二个预览版本。本次更新聚焦于 **国际化完善**、**CLI 工具增强**、**社区平台 ChengHub**、**多媒体能力扩展** 以及 **部署打包优化**。

---

## 新功能

### 1. 国际化（i18n）全面覆盖
- 完成所有节点类型的中文翻译文件（AI、Chat、Document、IO、RAG、Agent、Tools 等全系列）
- 节点配置面板、工作流编辑器、聊天界面均支持中英双语切换
- 新增 `providers.toml` 提供商定义文件，内置主流 LLM 服务商配置

### 2. CLI 终端客户端增强
- 新增 `cheng` 终端客户端，支持交互式 TUI 会话
- 实现 `goback` 历史导航功能，可在对话中回溯上下文
- CLI 工具调用能力增强，支持在工作流沙箱中执行文件操作

### 3. ChengHub 社区平台（新增）
- 全新社区模块，支持工作流分享、评论、点赞
- OAuth 登录集成（GitHub / QQ / 微信）
- 内容审核与管理后台
- 设备授权流程（Device Flow）
- 速率限制与滥用防护

### 4. 多媒体工件预览
- 支持图片、音频、视频等多媒体工件的在线预览
- 视频帧提取与音频提取节点
- OCR 文字识别（支持中英文）

### 5. Token 计数
- 对话消息新增 Token 计数显示
- 帮助用户了解上下文窗口使用情况

---

## 优化与改进

### 部署与打包
- **统一部署脚本**：重构 `chengos.sh` 管理脚本，支持 Docker / 原生双模式一键安装、启动、停止、升级
- **分布式部署支持**：新增 `deploy/distributed/` 分布式部署配置模板
- **全局配置目录**：新增 `CHENG_GLOBAL_CONFIG_DIR` 环境变量，支持全局 `shortcuts.yaml` 和 `presets.yaml` 配置，跨工作区共享
- **工作流模板目录**：新增 `workflow-templates/` 目录和 `TEMPLATE_WORKFLOWS_DIR` 环境变量，系统启动时自动将示例工作流安装到新工作区
- **Docker 构建优化**：`.dockerignore` 白名单模式精简构建上下文
- **环境变量生成器**：`generate-env.sh` 自动检测本地目录并设置绝对路径

### 快捷方式与预设
- 新增全局快捷方式配置（记忆 / 搜索 / 深度思考 / 工具调用）
- 新增全局节点预设配置
- 支持工作区级别覆盖全局配置

### 技能系统
- 技能 UI 管理界面优化
- 新增工作流构建助手技能（workflow-helper / workflow-json-builder）
- 节点技能指南完善（browser-tool / http-tool）

---

## 修复的问题

- 修复 `chengos.sh` 升级流程中共享资源未同步的问题
- 修复 Docker 构建时 `workflow-templates/` 目录缺失导致构建失败
- 修复原生部署下全局配置目录路径未自动解析的问题

---

## 升级说明

### 从 v0.01 升级

```bash
# 下载最新安装包
./chengos.sh update

# 或手动升级
./build.sh --hybrid
# 然后将 dist/chengos-full-linux-amd64.tar.gz 传到服务器执行 chengos.sh update
```

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

## 环境变量变更

| 变量名 | 默认值 | 说明 |
|---|---|---|
| `CHENG_GLOBAL_CONFIG_DIR` | 自动检测 | 全局配置目录（shortcuts.yaml / presets.yaml） |
| `TEMPLATE_WORKFLOWS_DIR` | 自动检测 | 工作流模板目录（示例工作流） |

---

## 已知限制

- 工作流模板目录目前为空，用户需自行添加 `template.json` + `workflow.json` 模板包
- ChengHub 社区平台为初始版本，API 可能后续调整
- 多用户模式下的并发安全需要单写入者规则保障

---

## 反馈

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- 社区平台: ChengHub（随本版本一同发布）
