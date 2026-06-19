# ChengOS 编译、打包与发布工作流指南
# ChengOS Build, Package, and Release Workflow Guide

如果您对 `chengflow`（后端）、`chengflow-ui`（管理前端）或 `chengflow-app`（聊天前端）进行了代码修改、Bug 修复或版本升级，请按照以下流程与命令进行编译、打包并提交发布到您的 GitHub 部署仓库（`https://github.com/chengrouter/chengos.git`），该流程**不会泄露任何源码**。

---

## 整体工作流顺序 / Workflow Order

```
1. 修改源码并完成本地测试
   ↓
2. 编译并部署前端 UI & App
   ↓
3. 编译后端并打包整包 dist/...
   ↓
4. 推送 deploy/ 变动至 GitHub 部署仓库
   ↓
5. 上传安装包至 GitHub Release 页面
   ↓
6. 终端用户运行一键更新
```

---

## 详细步骤与命令 / Detailed Steps

### 第一步：编译并部署前端静态文件

代码修改完成后，需要先将两个前端项目进行生产构建，并把构建产物自动输出到 `/deploy/hybrid/` 对应的子目录中。

1. **编译管理后台前端 (`chengflow-ui`)**：
   ```bash
   cd /home/cheng/works/chengos/chengflow-ui
   pnpm build:deploy
   ```
   *该命令会自动执行 Vite 生产构建，清空并更新 `/home/cheng/works/chengos/deploy/hybrid/ui/` 中的静态文件。*

2. **编译聊天前端 SDK (`chengflow-app`)**：
   ```bash
   cd /home/cheng/works/chengos/chengflow-app
   pnpm build:deploy
   ```
   *该命令会自动执行生产构建，清空并更新 `/home/cheng/works/chengos/deploy/hybrid/app/` 中的静态文件。*

---

### 第二步：编译 Rust 后端并打包整包

接下来需要编译后端的 Rust 代码，并与前面生成的静态文件、控制脚本进行打包。

1. **进入后端目录并执行混合打包命令**：
   ```bash
   cd /home/cheng/works/chengos/chengflow
   ./build.sh --hybrid
   ```
   * **该命令做了什么**：
     1. 在本地编译生成 Rust 生产环境优化版的 `cheng-api`（和 `chengctl`）二进制程序。
     2. 将编译好的二进制程序放入部署包的 `bin/` 目录。
     3. 自动将 `/home/cheng/works/chengos/deploy/hybrid/` 下的所有文件（包括您刚刚部署的 `ui/` 和 `app/`，以及 Node 代理服务器、`chengos.sh`）收集起来。
     4. 在 `/home/cheng/works/chengos/dist/` 目录下生成统一的无源码发布压缩包：`chengos-full-linux-amd64.tar.gz`。

---

### 第三步：推送部署脚本改动至 GitHub

如果您修改了 `deploy/` 下的控制脚本（如 `start.sh`、`chengos.sh` 等配置），需要将其提交推送到 GitHub。

1. **进入根目录的部署追踪范围**（假定您的部署仓库初始化在根目录且仅追踪 `deploy/` 文件夹）：
   ```bash
   cd /home/cheng/works/chengos
   # 查看变动
   git status
   # 添加部署文件
   git add deploy/ chengos.sh README.md
   # 提交
   git commit -m "Update deployment scripts and configurations"
   # 推送
   git push origin main
   ```

---

### 第四步：在 GitHub 上发布安装包 (Release)

由于不上传源码，终端用户一键安装时需要下载编译好的二进制压缩包：

1. 打开您的 GitHub 仓库：`https://github.com/chengrouter/chengos`。
2. 点击右侧的 **Releases** -> **Draft a new release**。
3. 创建一个新的版本号标签（例如 `v1.0.1`）。
4. 在 **Attach binaries...** 区域中，拖入并上传刚刚在本地生成的打包文件：
   `/home/cheng/works/chengos/dist/chengos-full-linux-amd64.tar.gz`
5. 点击 **Publish release** 发布。

---

## 终端用户一键更新流程 / End-User Update

当您发布了新版本后，您的终端用户可以通过以下简单的命令完成升级，无需重新安装：

### 方式 A：交互式升级
用户在部署目录下直接运行：
```bash
./chengos.sh
```
在菜单中选择 `2) 更新模块 (Update)` 即可，脚本会自动执行 `git pull` 并拉取 GitHub 上的最新 Release 压缩包解压覆盖。

### 方式 B：一键静默命令升级
对于无人值守 of 服务器，用户可直接运行：
```bash
./chengos.sh update
```
