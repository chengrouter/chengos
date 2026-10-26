# Windows 与 ARM64 使用指南 / Windows & ARM64 Usage Guide

本指南区分两种不同的使用方式：Windows 电脑上的 ChengFlow 桌面应用，以及 ARM64
OpenWrt 路由器上的 ChengOS 服务。**OpenWrt ARM64 包不是 Windows ARM 安装包。**

| 设备 | 当前交付方式 | 支持范围 |
|---|---|---|
| Windows x64 电脑 | ChengFlow Desktop `.msi` | Windows x64 桌面构建 |
| Windows ARM64 电脑 | 暂无原生 ARM64 MSI | x64 仿真运行未列为正式支持 |
| ARM64 OpenWrt 路由器 | ChengOS OpenWrt 安装器 | 当前仅 NanoPi R76S / Kwrt 25.12 Snapshot 实验性支持 |

## Windows x64：安装并使用 ChengFlow Desktop

### 获取安装包

优先从 [GitHub Releases](https://github.com/chengrouter/chengos/releases) 下载 Windows
`.msi`。如果对应版本没有发布 MSI，可在
[ChengFlow Desktop Actions](https://github.com/chengrouter/chengos/actions/workflows/desktop.yml)
的构建运行中下载 `chengflow-desktop-windows` artifact。

当前 Windows 构建目标是 x64（`x86_64-pc-windows-msvc`），不是 Windows ARM64 原生包。
Windows ARM64 上的 x64 仿真是否可用，取决于设备和运行时环境，尚未作为正式支持配置验证。

### 安装与首次启动

1. 在 Windows 10/11 x64 上双击 `.msi` 并完成安装。
2. 从开始菜单启动 **ChengFlow**。首次启动会初始化本机数据库和工作区，可能需要一两分钟；请等待窗口出现，不要连续启动多个实例。
3. 按首次启动页面创建本机管理员和工作区，然后在设置中配置模型服务及其 API 凭证。
4. 工作流编辑器和 API 在本机运行；桌面应用会管理其内嵌服务，不需要另行部署 Linux 服务器。

### 数据、日志与卸载

- Windows 数据默认保存在 `%PROGRAMDATA%\ChengFlow`，与 `.msi` 的安装目录分开；卸载再安装不会自动清空数据。
- 桌面应用日志位于数据目录下的 `logs\chengflow-desktop.log`。
- 普通卸载会保留数据。开始菜单中的 **“卸载并清除数据”** 会删除本机工作流、工作区、数据库和登录状态；这是不可逆操作，请先备份。

## ARM64：在 OpenWrt 路由器上运行 ChengOS

### 支持范围与准备

当前 ARM64 profile 是**实验性**支持：NanoPi R76S，Kwrt 25.12 Snapshot。不要将该包视为适用于任意 ARM64 SBC、普通 Linux 发行版或 Windows ARM 的通用安装包。

安装前确认：

- 路由器固件、设备型号与上述 profile 一致；至少 1 GiB RAM。
- 已挂载持久化数据盘，安装位置至少有 2 GiB 可用空间和 100,000 个可用 inode。不要将数据库放在 `/tmp` 等重启会清空的位置。
- 路由器时间已通过 NTP 校准，并且固件可通过 HTTPS 下载发布文件。
- 首次安装需要路由器 root 权限。默认服务端口为 `19225`，只应从可信 LAN 访问，不要直接暴露到公网。

### 从 Windows 连接并安装

Windows 电脑可使用内置 OpenSSH 的 PowerShell 连接路由器。将示例 IP 替换成路由器的 LAN 地址：

```powershell
ssh root@192.168.1.1
```

以下命令在**路由器 SSH 会话**中执行，不是在 Windows PowerShell 本机执行。只有当 GitHub
Release 页面已发布 `chengos-openwrt-install.sh` 安装器时，才使用此步骤：

```sh
wget -O /tmp/chengos-openwrt-install.sh \
  https://github.com/chengrouter/chengos/releases/latest/download/chengos-openwrt-install.sh

# 只检查设备与安装条件，不安装
sh /tmp/chengos-openwrt-install.sh --check --accept-experimental

# 检查通过后，开始交互式安装
sh /tmp/chengos-openwrt-install.sh --accept-experimental
```

安装器会验证发布清单和下载文件，检查设备、磁盘与固件，并引导选择数据盘。确认目标目录确实位于已挂载的持久化磁盘后再继续；不要绕过校验安装未经签名的构建包。

安装完成后，在同一可信 LAN 的浏览器访问：

```text
http://192.168.1.1:19225
```

将地址替换为路由器实际的 LAN IP。首次访问时按页面提示完成管理员初始化。之后可在路由器 SSH 中运行 `chengos` 打开管理菜单，或查看服务状态和日志。

### 从 Windows ARM 电脑使用

Windows ARM64 电脑可以作为管理终端，通过 OpenSSH 连接 ARM64 OpenWrt 路由器；浏览器也可访问路由器上的 ChengOS 页面。它不会因此变成 Windows ARM 原生部署：服务仍运行在 OpenWrt 路由器上，Windows ARM64 原生 ChengFlow MSI 目前未提供。

---

# English

This guide covers two different setups: ChengFlow Desktop on a Windows PC and the ChengOS
service on an ARM64 OpenWrt router. **The OpenWrt ARM64 package is not a Windows ARM installer.**

| Device | Distribution | Current support |
|---|---|---|
| Windows x64 PC | ChengFlow Desktop `.msi` | Windows x64 desktop build |
| Windows ARM64 PC | No native ARM64 MSI | Running the x64 MSI under emulation is not officially validated |
| ARM64 OpenWrt router | ChengOS OpenWrt installer | Experimental: NanoPi R76S / Kwrt 25.12 Snapshot only |

## Windows x64: ChengFlow Desktop

Download the `.msi` from [GitHub Releases](https://github.com/chengrouter/chengos/releases).
If a release does not include an MSI, download the `chengflow-desktop-windows` artifact from
the corresponding run in
[ChengFlow Desktop Actions](https://github.com/chengrouter/chengos/actions/workflows/desktop.yml).
The current Windows build target is `x86_64-pc-windows-msvc`; a native Windows ARM64 MSI is not
provided.

1. On Windows 10/11 x64, run the `.msi` and finish installation.
2. Launch **ChengFlow** from the Start menu. The first launch initializes the local database
   and may take a minute or two. Wait for the window rather than starting another instance.
3. Complete first-run setup, create the local administrator and workspace, then configure an
   LLM provider and its API credentials.
4. The desktop app manages its local services; no separate Linux server is required.

Windows data is stored by default in `%PROGRAMDATA%\ChengFlow`, separately from the app
installation directory. Logs are under `logs\chengflow-desktop.log` in that data directory.
A normal uninstall keeps the data. The Start-menu action **Uninstall and remove data** deletes
workflows, workspaces, the database, and sign-in state; back up first.

## ARM64: ChengOS on OpenWrt

The only current ARM64 profile is experimental: **NanoPi R76S running Kwrt 25.12 Snapshot**.
Do not treat the package as a generic ARM64 Linux or Windows ARM distribution. The router
needs at least 1 GiB RAM, a persistent mounted data disk with 2 GiB free and 100,000 free
inodes, a correct system clock, HTTPS access, and root access for installation. Do not store
the database on an ephemeral filesystem such as `/tmp`, or expose port `19225` directly to
the public Internet.

From Windows PowerShell, connect to the router (replace the example address):

```powershell
ssh root@192.168.1.1
```

Run the following commands **in the router's SSH session**, and only after the installer has
been published as a GitHub Release asset:

```sh
wget -O /tmp/chengos-openwrt-install.sh \
  https://github.com/chengrouter/chengos/releases/latest/download/chengos-openwrt-install.sh

# Check the device and installation prerequisites without installing
sh /tmp/chengos-openwrt-install.sh --check --accept-experimental

# After the checks pass, start the guided installation
sh /tmp/chengos-openwrt-install.sh --accept-experimental
```

The installer verifies the signed release manifest and downloaded files, checks the device,
firmware, and storage, then guides you through installation. Confirm that the selected data
directory is on the mounted persistent disk. Do not bypass verification or install unsigned
development packages.

After installation, open `http://192.168.1.1:19225` from a trusted LAN browser, replacing the
example address with the router's LAN IP. Complete the first-run administrator setup. For
maintenance, SSH to the router and run `chengos` to open the management menu.

## Windows ARM64 as a management PC

A Windows ARM64 PC can manage the ARM64 OpenWrt router over SSH and access its ChengOS web UI
in a browser. In this setup the service still runs on OpenWrt; it is not a native Windows
ARM64 installation. A native Windows ARM64 ChengFlow MSI is not currently available.
