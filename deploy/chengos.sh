#!/usr/bin/env bash
set -euo pipefail

# Root workspace directory
# Guard against `curl | bash` (pipe-from-stdin) where BASH_SOURCE is unset.
if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
    SCRIPT_PATH="${BASH_SOURCE[0]}"
elif [[ -n "${0:-}" && "$0" != "bash" && "$0" != "-bash" ]]; then
    SCRIPT_PATH="$0"
else
    SCRIPT_PATH="$(pwd)"
fi
SCRIPT_DIR_FROM_CALL="$(cd "$(dirname "$SCRIPT_PATH")" 2>/dev/null && pwd || pwd)"
if [[ -L "$SCRIPT_PATH" ]]; then
    REAL_SCRIPT_PATH="$(readlink -f "$SCRIPT_PATH")"
else
    REAL_SCRIPT_PATH="$SCRIPT_PATH"
fi
REAL_SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT_PATH")" 2>/dev/null && pwd || pwd)"

if [[ -d "${SCRIPT_DIR_FROM_CALL}/deploy/hybrid" || -d "${SCRIPT_DIR_FROM_CALL}/deploy/docker" ]]; then
    # Running from the repository root via the root symlink.
    ROOT_DIR="$SCRIPT_DIR_FROM_CALL"
elif [[ -d "${SCRIPT_DIR_FROM_CALL}/hybrid" || -d "${SCRIPT_DIR_FROM_CALL}/docker" ]]; then
    # Running from a flat or bundle-style root that contains the deployment scripts.
    ROOT_DIR="$SCRIPT_DIR_FROM_CALL"
elif [[ "$REAL_SCRIPT_DIR" == */deploy && ( -d "${REAL_SCRIPT_DIR}/hybrid" || -d "${REAL_SCRIPT_DIR}/docker" ) ]]; then
    # Running from deploy/ directly; the project root is one level up.
    ROOT_DIR="$(cd "${REAL_SCRIPT_DIR}/.." && pwd)"
elif [[ "$REAL_SCRIPT_DIR" == */deploy/hybrid ]]; then
    # Legacy direct invocation of the old hybrid copy.
    ROOT_DIR="$(cd "${REAL_SCRIPT_DIR}/../.." && pwd)"
else
    # Fallback to the real script directory.
    ROOT_DIR="$REAL_SCRIPT_DIR"
fi
cd "$ROOT_DIR"

# Determine sudo prefix (skip when running as root)
if [[ "$(id -u)" -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

# ── Local Tarball Detection ───────────────────────────────────────────────────
# Checks for a pre-existing release tarball before attempting a download.
# Returns the path on stdout if found, returns non-zero otherwise.
# Defined early so it is available in the bootstrap block below.
find_local_tarball() {
    local candidates=()
    local versioned

    # 1) Explicit override via env var
    if [[ -n "${CHENGOS_LOCAL_TARBALL:-}" && -f "$CHENGOS_LOCAL_TARBALL" ]]; then
        candidates+=("$CHENGOS_LOCAL_TARBALL")
    fi

    # 2) Versioned release asset name (newest first), then the transitional
    #    unversioned alias, in ROOT_DIR
    while IFS= read -r versioned; do
        [[ -n "$versioned" ]] && candidates+=("$versioned")
    done < <(ls -1 "${ROOT_DIR}"/chengos-full-linux-amd64-v*.tar.gz 2>/dev/null | sort -V -r)
    candidates+=("${ROOT_DIR}/chengos-full-linux-amd64.tar.gz")
    # 3) Generic name in ROOT_DIR
    candidates+=("${ROOT_DIR}/chengos.tar.gz")
    # 4) Current working directory
    candidates+=("chengos-full-linux-amd64.tar.gz")
    candidates+=("chengos.tar.gz")

    for f in "${candidates[@]}"; do
        if [[ -f "$f" && -s "$f" ]]; then
            printf '%s\n' "$f"
            return 0
        fi
    done
    return 1
}

# ── Dual Mode Detection (Bootstrap vs Local) ──────────────────────────────────
# If the script is run standalone without the deployment folders around,
# it acts as a Bootstrapper to download the release from GitHub.
if [[ ! -f "start.sh" && ! -d "hybrid" && ! -d "deploy" ]]; then
    echo "================================================="
    echo "       ChengOS One-Click Installer Bootstrap"
    echo "================================================="
    
    INSTALL_DIR="chengos"
    read -p "Enter installation directory [default: ./chengos]: " custom_dir < /dev/tty
    INSTALL_DIR="${custom_dir:-$INSTALL_DIR}"
    
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    echo "Looking for local release package..."
    if TARBALL_PATH="$(find_local_tarball)"; then
        echo "Found local release package: ${TARBALL_PATH}"
        cp "$TARBALL_PATH" chengos.tar.gz
    else
        echo "No local package found. Downloading the latest ChengOS release package..."
        REPO_URL="https://github.com/chengrouter/chengos"
        RELEASE_TAG="$(curl -fsSLI -o /dev/null -w '%{url_effective}' "${REPO_URL}/releases/latest" 2>/dev/null | sed 's#.*/tag/##' || true)"
        if [[ -n "$RELEASE_TAG" ]]; then
            TARBALL_URL="${REPO_URL}/releases/download/${RELEASE_TAG}/chengos-full-linux-amd64-${RELEASE_TAG}.tar.gz"
        else
            TARBALL_URL="${REPO_URL}/releases/latest/download/chengos-full-linux-amd64.tar.gz"
        fi

        if ! curl -sSfL "$TARBALL_URL" -o chengos.tar.gz; then
            echo "ERROR: Failed to download release from $TARBALL_URL."
            echo "Please make sure you have created a Release and uploaded the release asset."
            echo "Or place the tarball in the same directory as chengos.sh."
            exit 1
        fi
    fi
    
    echo "Extracting release package..."
    tar -xzf chengos.tar.gz --strip-components=1
    rm -f chengos.tar.gz
    [[ -n "$RELEASE_TAG" ]] && printf '%s\n' "$RELEASE_TAG" > .chengos_version
    
    echo "Starting ChengOS Manager..."
    exec ./chengos.sh
fi

# ── Local Mode Execution ──────────────────────────────────────────────────────
LANG_FILE="${ROOT_DIR}/.chengos_lang"
MODE_FILE="${ROOT_DIR}/.chengos_install_mode"
VERSION_FILE="${ROOT_DIR}/.chengos_version"
MODULES_FILE="${ROOT_DIR}/.chengos_modules"
CLI_TARGET_FILE="${ROOT_DIR}/.chengos_cli_target"
DOCKER_VERSION_FILE="${ROOT_DIR}/.chengos_docker_version"
# Defaults for the update/rollback flags. The CLI argument parser overrides
# them; declaring them here keeps every helper safe under `set -u` no matter
# which entry point (menu or command) reached it.
: "${FORCE_UPDATE:=false}"
: "${UPDATE_TARGET_VERSION:=}"
: "${UPDATE_KIND:=auto}"
: "${LOW_DISK_UPDATE:=false}"
UPDATE_BRANCH="${CHENGOS_UPDATE_BRANCH:-main}"
RAW_BASE_URL="${CHENGOS_RAW_BASE_URL:-https://raw.githubusercontent.com/chengrouter/chengos/${UPDATE_BRANCH}}"
DEFAULT_LANG="zh"

# ── Release update library ────────────────────────────────────────────────────
# Version parsing, discovery, verification, staging, backup, and rollback live
# in lib/release-update.sh so they stay testable outside this menu code. The
# library ships inside the release bundle (lib/) and also exists in the source
# tree (deploy/lib/).
RELEASE_LIB=""
RELEASE_VERIFIER=""
for _candidate_dir in "${ROOT_DIR}/lib" "${ROOT_DIR}/deploy/lib" "${REAL_SCRIPT_DIR}/lib"; do
    if [[ -f "${_candidate_dir}/release-update.sh" ]]; then
        RELEASE_LIB="${_candidate_dir}/release-update.sh"
        [[ -f "${_candidate_dir}/verify-release-archive.sh" ]] \
            && RELEASE_VERIFIER="${_candidate_dir}/verify-release-archive.sh"
        break
    fi
done
unset _candidate_dir
if [[ -z "$RELEASE_VERIFIER" && -f "${ROOT_DIR}/scripts/verify-release-archive.sh" ]]; then
    RELEASE_VERIFIER="${ROOT_DIR}/scripts/verify-release-archive.sh"
fi
if [[ -n "$RELEASE_LIB" ]]; then
    # shellcheck source=lib/release-update.sh
    source "$RELEASE_LIB"
    RELEASE_LIB_LOADED="true"
else
    RELEASE_LIB_LOADED="false"
fi

require_release_lib() {
    if [[ "$RELEASE_LIB_LOADED" != "true" ]]; then
        echo "ERROR: release update library not found (expected lib/release-update.sh)." >&2
        echo "Reinstall from a current release package, or run './chengos.sh update --scripts-only'." >&2
        return 1
    fi
    return 0
}

# Health endpoint of the local API, honouring a configured API port.
resolve_health_url() {
    local shared_dir port
    shared_dir="$(resolve_shared_dir)"
    port="3000"
    if [[ -f "${shared_dir}/.env" ]]; then
        local configured
        configured="$(sed -n 's/^API_PORT=\(.*\)$/\1/p' "${shared_dir}/.env" | tail -n1 | tr -d '[:space:]')"
        [[ -z "$configured" ]] && configured="$(sed -n 's/^PORT=\(.*\)$/\1/p' "${shared_dir}/.env" | tail -n1 | tr -d '[:space:]')"
        [[ -n "$configured" ]] && port="$configured"
    fi
    printf 'http://127.0.0.1:%s/health' "$port"
}

# Load or ask for language preference
if [[ -f "$LANG_FILE" ]]; then
    LANG_VAL=$(cat "$LANG_FILE")
else
    LANG_VAL=""
fi

# Detect language choice
set_language() {
    echo "==========================================="
    echo "  Please select language / 请选择语言:"
    echo "  1) 中文 (Chinese)"
    echo "  2) English"
    echo "==========================================="
    read -p "Select [1-2] (Default 1): " lang_choice < /dev/tty
    if [[ "$lang_choice" == "2" ]]; then
        LANG_VAL="en"
    else
        LANG_VAL="zh"
    fi
    echo "$LANG_VAL" > "$LANG_FILE"
}

if [[ -z "$LANG_VAL" ]]; then
    set_language
fi

# ── Translation System ────────────────────────────────────────────────────────
declare -A t

if [[ "$LANG_VAL" == "zh" ]]; then
    t[banner]="===========================================\n       ChengOS 统一管理与部署工具\n==========================================="
    t[menu_install]="1) 安装/初始化模块 (Install/Init)"
    t[menu_start]="2) 启动服务 (Start)"
    t[menu_stop]="3) 停止服务 (Stop)"
    t[menu_restart]="4) 重启服务 (Restart)"
    t[menu_update]="5) 更新模块 (Update)"
    t[menu_cli]="6) 单独安装 CLI (Install CLI Only)"
    t[menu_status]="7) 查看服务状态 (Status)"
    t[menu_link]="8) 安装系统命令 (Install Command Shortcuts)"
    t[menu_uninstall]="9) 卸载/停用模块 (Uninstall)"
    t[menu_lang]="10) 切换语言 (Switch Language)"
    t[menu_exit]="11) 退出 (Exit)"
    t[menu_reset_credentials]="12) 重置登录用户名/密码 (Reset Credentials)"
    t[menu_rollback]="13) 回滚到上一个版本 (Rollback)"
    t[select_op]="请选择操作 [1-12]: "
    t[mode_select]="请选择安装模式:\n  1) 二进制原生安装 (Native Host)\n  2) Docker 容器化安装 (Docker)"
    t[mode_prompt]="选择 [1-2] (默认 1): "
    t[install_config]="请选择安装配置:\n  1) 全量安装 (默认)\n  2) 最小安装 (Postgres + API + UI)\n  3) 自定义选择"
    t[config_prompt]="选择 [1-3] (默认 1): "
    t[prompt_redis]="是否启用 Valkey? (y/n) [默认 n]: "
    t[prompt_qdrant]="是否启用 Qdrant (RAG 向量库)? (y/n) [默认 n]: "
    t[prompt_ui]="是否启用 cheng-ui (管理后台)? (y/n) [默认 y]: "
    t[prompt_app]="是否启用 cheng-app (聊天窗口)? (y/n) [默认 y]: "
    t[prompt_cli]="是否启用 cheng-cli (终端工具)? (y/n) [默认 y]: "
    t[install_start]="开始执行安装/初始化流程..."
    t[install_done]="安装/初始化完成！"
    t[update_start]="开始执行更新流程..."
    t[update_done]="更新完成！"
    t[rollback_start]="开始回滚到上一个版本..."
    t[rollback_done]="回滚流程结束。"
    t[rollback_confirm]="确认回滚到上一个已备份的版本? [y/N]: "
    t[rollback_cancelled]="已取消回滚。"
    t[uninstall_start]="开始执行卸载/停用流程..."
    t[uninstall_done]="卸载完成！"
    t[stopping]="正在停止所有服务..."
    t[starting]="正在启动服务..."
    t[restarting]="正在重启服务..."
    t[status_header]="正在查询服务状态..."
    t[symlink_done]="已安装系统命令: /usr/local/bin/chengos -> %s"
    t[symlink_fail]="安装系统命令失败，请确认是否拥有 sudo 权限。"
    t[db_mode_select]="请选择数据库安装模式:"
    t[db_mode_managed]="  1) 沙箱本地进程 (managed-process) - 无需 Root (默认)"
    t[db_mode_system]="  2) 系统级服务 (system-service) - 需要 Sudo"
    t[db_mode_prompt]="选择 [1-2] (默认 1): "
    t[prompt_ui_port]="请输入 UI 端口 (默认 8080): "
    t[prompt_app_port]="请输入 App 端口 (默认 5055): "
    t[prompt_workspace_root]="请输入工作区根目录路径 (留空则使用默认 ./workspaces): "
    t[press_enter]="按回车键继续..."
    t[prompt_stop_db]="是否同时停止/删除数据库服务? (y/n) [默认 n]: "
    t[update_type_select]="请选择更新类型:"
    t[update_type_scripts]="  1) 仅更新脚本 (chengos.sh/start.sh/stop.sh/status.sh/generate-env.sh)"
    t[update_type_package]="  2) 仅更新包 (release tar.gz 或 Docker 镜像; 包含 cheng CLI 二进制)"
    t[update_type_both]="  3) 先更新脚本再更新包 (推荐; 包含 cheng CLI 二进制)"
    t[update_type_force]="  4) 强制更新包 (跳过版本检查, 强制下载并替换所有目录)"
    t[update_type_low]="  5) 低磁盘模式更新 (逐步操作: 解压→清理旧备份→备份→替换, 适合磁盘空间紧张时使用)"
    t[update_type_prompt]="选择 [1-5] (默认 3): "
    t[cli_install_title]="单独安装 CLI (cheng)"
    t[cli_install_local]="  1) 本机安装 (与 cheng-api 同机; 连接 127.0.0.1)"
    t[cli_install_remote]="  2) 其他终端/机器安装 (连接远程 ChengOS 服务器)"
    t[cli_install_prompt]="选择 [1-2] (默认 1): "
    t[cli_api_url_prompt]="API 服务器地址 [默认: %s]: "
    t[cli_remote_url_prompt]="远程 ChengOS 服务器地址 (例如 https://your-server.example.com): "
    t[cli_status_header]="── cheng CLI ──"
    t[cli_binary_installed]="  CLI 二进制: %s (已安装)"
    t[cli_binary_path]="  CLI 二进制: %s (在 PATH 中)"
    t[cli_binary_notfound]="  CLI 二进制: 未找到"
    t[cli_config_found]="  CLI 配置: %s (已配置)"
    t[cli_config_notfound]="  CLI 配置: 未找到"
    t[cli_running]="  CLI 进程: 运行中 (%s 个会话)"
    t[cli_not_running]="  CLI 进程: 未运行"
    t[symlink_installing]="正在安装 chengos 系统命令快捷方式..."
    t[symlink_creating_cheng]="正在创建 cheng 全局启动器..."
    t[symlink_cheng_done]="已创建快捷启动器: /usr/local/bin/cheng"
    t[symlink_cheng_hint]="现在你可以在任何地方运行 'cheng' 快速开启命令行对话（默认使用免密文件存储凭证）。"
    t[exit_msg]="再见！"
    t[invalid_op]="无效选项: %s"
    t[reset_title]="重置登录凭证"
    t[reset_target_prompt]="现有用户名或邮箱 (只有一个账号时可留空): "
    t[reset_username_prompt]="新用户名 (留空不修改): "
    t[reset_email_prompt]="新邮箱 (留空不修改): "
    t[reset_password_prompt]="新密码 (至少 8 位，留空不修改): "
    t[reset_password_confirm]="再次输入新密码: "
    t[reset_password_mismatch]="两次输入的密码不一致。"
    t[reset_failed]="凭证重置失败。"
else
    t[banner]="===========================================\n       ChengOS Unified Management Utility\n==========================================="
    t[menu_install]="1) Install/Initialize Modules"
    t[menu_start]="2) Start Services"
    t[menu_stop]="3) Stop Services"
    t[menu_restart]="4) Restart Services"
    t[menu_update]="5) Update Modules"
    t[menu_cli]="6) Install CLI Only"
    t[menu_status]="7) Service Status"
    t[menu_link]="8) Install Command Shortcuts"
    t[menu_uninstall]="9) Uninstall/Stop Modules"
    t[menu_lang]="10) Switch Language"
    t[menu_exit]="11) Exit"
    t[menu_reset_credentials]="12) Reset Login Username/Password"
    t[menu_rollback]="13) Roll Back to the Previous Version"
    t[select_op]="Select option [1-12]: "
    t[mode_select]="Select Installation Mode:\n  1) Native Host Binary\n  2) Docker Containers"
    t[mode_prompt]="Choose [1-2] (Default 1): "
    t[install_config]="Select Modules Configuration:\n  1) Full Installation (Default)\n  2) Minimal (Postgres + API + UI)\n  3) Custom Selection"
    t[config_prompt]="Choose [1-3] (Default 1): "
    t[prompt_redis]="Enable Valkey? (y/n) [Default n]: "
    t[prompt_qdrant]="Enable Qdrant (Vector DB)? (y/n) [Default n]: "
    t[prompt_ui]="Enable cheng-ui (Management UI)? (y/n) [Default y]: "
    t[prompt_app]="Enable cheng-app (Chat App)? (y/n) [Default y]: "
    t[prompt_cli]="Enable cheng-cli (CLI tool)? (y/n) [Default y]: "
    t[install_start]="Starting installation/initialization process..."
    t[install_done]="Installation/Initialization completed successfully!"
    t[update_start]="Starting update process..."
    t[update_done]="Update completed!"
    t[rollback_start]="Starting rollback to the previous version..."
    t[rollback_done]="Rollback finished."
    t[rollback_confirm]="Roll back to the most recent backed-up version? [y/N]: "
    t[rollback_cancelled]="Rollback cancelled."
    t[uninstall_start]="Starting uninstall/teardown process..."
    t[uninstall_done]="Uninstall completed!"
    t[stopping]="Stopping all services..."
    t[starting]="Starting services..."
    t[restarting]="Restarting services..."
    t[status_header]="Checking services status..."
    t[symlink_done]="Installed command shortcut: /usr/local/bin/chengos -> %s"
    t[symlink_fail]="Failed to install command shortcuts. Please make sure you have sudo rights."
    t[db_mode_select]="Select Database Installation Mode:"
    t[db_mode_managed]="  1) Sandboxed Local Process (managed-process) - No Root Required (Default)"
    t[db_mode_system]="  2) System Wide Service (system-service) - Requires Sudo"
    t[db_mode_prompt]="Choose [1-2] (Default 1): "
    t[prompt_ui_port]="Select UI port (Default 8080): "
    t[prompt_app_port]="Select App port (Default 5055): "
    t[prompt_workspace_root]="Enter workspace root path (leave empty for default ./workspaces): "
    t[press_enter]="Press Enter to continue..."
    t[prompt_stop_db]="Do you also want to stop/delete database services? (y/n) [Default n]: "
    t[update_type_select]="Select update type:"
    t[update_type_scripts]="  1) Script update only (chengos.sh/start.sh/stop.sh/status.sh/generate-env.sh)"
    t[update_type_package]="  2) Package update only (release tar.gz or Docker images; includes cheng CLI binary)"
    t[update_type_both]="  3) Script update, then package update (recommended; includes cheng CLI binary)"
    t[update_type_force]="  4) Force package update (skip version check; download and replace all directories)"
    t[update_type_low]="  5) Low-disk mode update (sequential: extract→prune old backups→backup→replace; for tight disk space)"
    t[update_type_prompt]="Choose [1-5] (Default 3): "
    t[cli_install_title]="Install CLI (cheng) Only"
    t[cli_install_local]="  1) On this machine (co-located with cheng-api; connects to 127.0.0.1)"
    t[cli_install_remote]="  2) On any other terminal/machine (connects to a remote ChengOS server)"
    t[cli_install_prompt]="Choose [1-2] (Default 1): "
    t[cli_api_url_prompt]="API server URL [default: %s]: "
    t[cli_remote_url_prompt]="Remote ChengOS server URL (e.g. https://your-server.example.com): "
    t[cli_status_header]="── cheng CLI ──"
    t[cli_binary_installed]="  CLI binary: %s (installed)"
    t[cli_binary_path]="  CLI binary: %s (on PATH)"
    t[cli_binary_notfound]="  CLI binary: not found"
    t[cli_config_found]="  CLI config: %s (configured)"
    t[cli_config_notfound]="  CLI config: not found"
    t[cli_running]="  CLI process: running (%s session(s))"
    t[cli_not_running]="  CLI process: not running"
    t[symlink_installing]="Installing system command shortcut for chengos..."
    t[symlink_creating_cheng]="Creating system-wide launcher for cheng..."
    t[symlink_cheng_done]="Created quick launcher: /usr/local/bin/cheng"
    t[symlink_cheng_hint]="Now you can run 'cheng' from anywhere to quickly start the chat (defaults to passwordless file storage)."
    t[exit_msg]="Goodbye!"
    t[invalid_op]="Invalid option: %s"
    t[reset_title]="Reset Login Credentials"
    t[reset_target_prompt]="Current username or email (leave empty if only one account exists): "
    t[reset_username_prompt]="New username (leave empty to keep): "
    t[reset_email_prompt]="New email (leave empty to keep): "
    t[reset_password_prompt]="New password (min 8 chars; leave empty to keep): "
    t[reset_password_confirm]="Confirm new password: "
    t[reset_password_mismatch]="The passwords do not match."
    t[reset_failed]="Credential reset failed."
fi

# ── Utility Helpers ──────────────────────────────────────────────────────────

resolve_hybrid_dir() {
    if [[ -f "${ROOT_DIR}/hybrid/start.sh" && -f "${ROOT_DIR}/hybrid/generate-env.sh" ]]; then
        printf '%s\n' "${ROOT_DIR}/hybrid"
    elif [[ -f "${ROOT_DIR}/start.sh" && -f "${ROOT_DIR}/generate-env.sh" ]]; then
        printf '%s\n' "$ROOT_DIR"
    elif [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
        printf '%s\n' "${ROOT_DIR}/deploy/hybrid"
    else
        printf '%s\n' "$ROOT_DIR"
    fi
}

resolve_shared_dir() {
    local hybrid_dir
    hybrid_dir="$(resolve_hybrid_dir)"
    if [[ "$hybrid_dir" == "$ROOT_DIR" ]]; then
        printf '%s\n' "$ROOT_DIR"
    else
        printf '%s\n' "$(cd "${hybrid_dir}/.." && pwd)"
    fi
}

resolve_docker_dir() {
    if [[ -f "${ROOT_DIR}/docker-compose.yml" && -f "${ROOT_DIR}/generate-env.sh" ]]; then
        printf '%s\n' "$ROOT_DIR"
    elif [[ -d "${ROOT_DIR}/deploy/docker" ]]; then
        printf '%s\n' "${ROOT_DIR}/deploy/docker"
    elif [[ -d "${ROOT_DIR}/docker" ]]; then
        printf '%s\n' "${ROOT_DIR}/docker"
    else
        printf '%s\n' "${ROOT_DIR}/deploy/docker"
    fi
}

write_install_metadata() {
    local mode="$1"
    [[ "$mode" == "native" || "$mode" == "docker" ]] || return 0
    printf '%s\n' "$mode" > "$MODE_FILE"
}

read_install_metadata() {
    if [[ -f "$MODE_FILE" ]]; then
        local mode
        mode="$(tr -d '[:space:]' < "$MODE_FILE")"
        if [[ "$mode" == "native" || "$mode" == "docker" ]]; then
            printf '%s\n' "$mode"
            return 0
        fi
    fi
    return 1
}

write_installed_modules() {
    local modules="$1"
    printf '%s\n' "$modules" > "$MODULES_FILE"
}

read_installed_modules() {
    if [[ -f "$MODULES_FILE" ]]; then
        local modules
        modules="$(tr -d '[:space:]' < "$MODULES_FILE")"
        if [[ -n "$modules" ]]; then
            printf '%s\n' "$modules"
            return 0
        fi
    fi
    return 1
}

write_cli_target_metadata() {
    local target_path="$1"
    [[ -n "$target_path" ]] || return 0
    printf '%s\n' "$target_path" > "$CLI_TARGET_FILE"
}

read_cli_target_metadata() {
    if [[ -f "$CLI_TARGET_FILE" ]]; then
        local target_path
        target_path="$(tr -d '[:space:]' < "$CLI_TARGET_FILE")"
        if [[ -n "$target_path" ]]; then
            printf '%s\n' "$target_path"
            return 0
        fi
    fi
    return 1
}

detect_install_mode() {
    local explicit_mode="${1:-}"
    if [[ "$explicit_mode" == "native" || "$explicit_mode" == "docker" ]]; then
        printf '%s\n' "$explicit_mode"
        return 0
    fi

    if read_install_metadata; then
        return 0
    fi

    local shared_dir hybrid_dir docker_dir
    shared_dir="$(resolve_shared_dir)"
    hybrid_dir="$(resolve_hybrid_dir)"
    docker_dir="$(resolve_docker_dir)"

    if [[ -f "${shared_dir}/.env" ]]; then
        if [[ -f "${hybrid_dir}/start.sh" && ! -f "${docker_dir}/docker-compose.yml" ]]; then
            printf 'native\n'
        elif [[ -f "${docker_dir}/docker-compose.yml" && ! -f "${hybrid_dir}/start.sh" ]]; then
            printf 'docker\n'
        else
            # Both layouts present; default to native if hybrid start.sh exists.
            printf 'native\n'
        fi
    elif [[ -f "${docker_dir}/docker-compose.yml" && ! -f "${hybrid_dir}/start.sh" ]]; then
        printf 'docker\n'
    else
        printf 'native\n'
    fi
}

# ── Bubblewrap (bwrap) Dependency Check ──────────────────────────────────────
# The code_shell / code_python nodes require bubblewrap for OS-namespace
# sandboxing. This function checks for bwrap and installs it automatically
# via the system package manager when it is absent.
ensure_bubblewrap() {
    if command -v bwrap > /dev/null 2>&1; then
        echo "[✓] bubblewrap (bwrap) is already installed: $(command -v bwrap)"
        return 0
    fi

    echo "[!] bubblewrap (bwrap) is not installed. Required for sandboxed code execution."
    echo "    Attempting automatic installation..."

    if command -v apt-get > /dev/null 2>&1; then
        ${SUDO} apt-get update -qq
        ${SUDO} apt-get install -y bubblewrap
    elif command -v dnf > /dev/null 2>&1; then
        ${SUDO} dnf install -y bubblewrap
    elif command -v yum > /dev/null 2>&1; then
        # CentOS 7 is EOL: mirrorlist.centos.org is dead, repos must point to vault.
        # Auto-fix before any yum operation so installation doesn't fail on stale mirrors.
        if [[ -d /etc/yum.repos.d ]] && ! command -v dnf > /dev/null 2>&1; then
            local _needs_vault_fix=false
            for _repo in /etc/yum.repos.d/CentOS-*.repo; do
                [[ -f "$_repo" ]] || continue
                if grep -q 'mirrorlist=' "$_repo" 2>/dev/null; then
                    _needs_vault_fix=true
                    break
                fi
            done
            if [[ "$_needs_vault_fix" == true ]]; then
                echo "[!] CentOS 7 mirrors are EOL. Switching to vault.centos.org..."
                ${SUDO} sed -i \
                    's|^mirrorlist=|#mirrorlist=|g; s|^#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' \
                    /etc/yum.repos.d/CentOS-*.repo
            fi
        fi
        # bubblewrap is in EPEL, not CentOS/RHEL base repos
        if ! rpm -q epel-release > /dev/null 2>&1; then
            ${SUDO} yum install -y epel-release 2>/dev/null || true
        fi
        ${SUDO} yum install -y bubblewrap
    elif command -v pacman > /dev/null 2>&1; then
        ${SUDO} pacman -Sy --noconfirm bubblewrap
    elif command -v zypper > /dev/null 2>&1; then
        ${SUDO} zypper install -y bubblewrap
    elif command -v apk > /dev/null 2>&1; then
        ${SUDO} apk add --no-cache bubblewrap
    else
        echo "ERROR: No supported package manager found. Please install bubblewrap manually:" >&2
        echo "  Debian/Ubuntu: sudo apt-get install bubblewrap" >&2
        echo "  RHEL/CentOS:   sudo dnf install bubblewrap" >&2
        echo "  Arch Linux:    sudo pacman -S bubblewrap" >&2
        return 1
    fi

    if ! command -v bwrap > /dev/null 2>&1; then
        echo "ERROR: bubblewrap installation failed. Please install it manually." >&2
        if command -v yum > /dev/null 2>&1 && ! command -v dnf > /dev/null 2>&1; then
            echo "  For CentOS/RHEL 7:" >&2
            echo "    1. Enable EPEL:  sudo yum install epel-release" >&2
            echo "    2. Install:      sudo yum install bubblewrap" >&2
            echo "  If base mirrors are dead (CentOS 7 EOL), switch to vault:" >&2
            echo "    sudo sed -i 's|mirrorlist=|#mirrorlist=|g; s|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*.repo" >&2
        fi
        return 1
    fi
    echo "[✓] bubblewrap installed successfully: $(command -v bwrap)"

    # Verify kernel supports unprivileged user namespaces (required for bwrap)
    local clone_unpriv="/proc/sys/kernel/unprivileged_userns_clone"
    if [[ -f "$clone_unpriv" ]]; then
        local val
        val="$(cat "$clone_unpriv" 2>/dev/null || echo 1)"
        if [[ "$val" != "1" ]]; then
            echo "[!] Enabling kernel.unprivileged_userns_clone=1 for bubblewrap..."
            ${SUDO} sysctl -w kernel.unprivileged_userns_clone=1 || true
            # Persist across reboots
            if [[ -d /etc/sysctl.d ]]; then
                echo 'kernel.unprivileged_userns_clone=1' | ${SUDO} tee /etc/sysctl.d/99-bubblewrap.conf > /dev/null
                echo "    Persisted to /etc/sysctl.d/99-bubblewrap.conf"
            fi
        fi
    fi
}

# ── Systemd User Session Setup ────────────────────────────────────────────────
# When cheng-api is started from a systemd service, SSH session, or any other
# non-login shell, the user-scope D-Bus socket and XDG_RUNTIME_DIR may not be
# set. Without them, systemd-run --user (used by bubblewrap cgroup v2 memory
# limiting) will fail with a D-Bus error.
#
# This function:
#   1. Enables systemd-user linger so the user session survives after logout.
#   2. Sets XDG_RUNTIME_DIR and DBUS_SESSION_BUS_ADDRESS in the current shell
#      session so cheng-api can invoke systemd-run --user without errors.
#   3. Adds the environment variables to the .env file so they are inherited
#      by the cheng-api process on every restart.
setup_systemd_user_session() {
    local shared_dir="$1"
    local uid
    uid="$(id -u)"
    local user_runtime_dir="/run/user/${uid}"

    # 1. Enable linger so the user session stays alive without an active login.
    if command -v loginctl > /dev/null 2>&1; then
        local current_user
        current_user="$(id -un)"
        if loginctl show-user "$current_user" 2>/dev/null | grep -q 'Linger=yes'; then
            echo "[✓] systemd-user linger already enabled for ${current_user}"
        else
            echo "    Enabling systemd-user linger for ${current_user}..."
            ${SUDO} loginctl enable-linger "$current_user" 2>/dev/null \
                && echo "[✓] loginctl enable-linger OK" \
                || echo "[!] loginctl enable-linger failed (non-fatal, continuing)"
        fi
    fi

    # 2. Explicitly start the systemd user manager for this UID if not running.
    #    On servers (especially root via SSH), user@<uid>.service may not be active
    #    even with linger enabled. This creates /run/user/<uid>/ and the bus socket.
    if [[ ! -d "$user_runtime_dir" ]] && command -v systemctl > /dev/null 2>&1; then
        echo "    Starting systemd user manager for uid=${uid}..."
        systemctl start "user@${uid}.service" 2>/dev/null \
            && echo "[✓] user@${uid}.service started" \
            || echo "[!] user@${uid}.service start failed (non-fatal, continuing)"
    fi

    # 3. Wait briefly for the runtime dir to appear (linger activation is async).
    if [[ ! -d "$user_runtime_dir" ]]; then
        echo "    Waiting for systemd user runtime dir ${user_runtime_dir}..."
        local waited=0
        while [[ ! -d "$user_runtime_dir" && $waited -lt 5 ]]; do
            sleep 1
            waited=$((waited + 1))
        done
    fi

    # 4. Export env vars in the current shell so subsequent commands inherit them.
    if [[ -d "$user_runtime_dir" ]]; then
        export XDG_RUNTIME_DIR="$user_runtime_dir"
        echo "[✓] XDG_RUNTIME_DIR=${XDG_RUNTIME_DIR}"
        local bus_socket="${user_runtime_dir}/bus"
        local bus_addr="unix:path=${bus_socket}"

        # If the D-Bus session bus socket doesn't exist yet, try multiple approaches.
        if [[ ! -S "$bus_socket" ]]; then
            echo "    D-Bus session bus socket not found at ${bus_socket}, attempting to start it..."

            # 4a. Try systemctl --user start dbus (works when user manager is running)
            if command -v systemctl > /dev/null 2>&1; then
                systemctl --user start dbus 2>/dev/null \
                    && echo "[✓] systemctl --user start dbus OK" \
                    || echo "[!] systemctl --user start dbus failed"
            fi

            # 4b. Try dbus-launch as a fallback (creates a new session bus)
            if [[ ! -S "$bus_socket" ]] && command -v dbus-launch > /dev/null 2>&1; then
                echo "    Trying dbus-launch fallback..."
                local dbus_launch_output
                dbus_launch_output="$(dbus-launch --sh-syntax 2>/dev/null || true)"
                if echo "$dbus_launch_output" | grep -q "DBUS_SESSION_BUS_ADDRESS="; then
                    bus_addr="$(echo "$dbus_launch_output" | grep "DBUS_SESSION_BUS_ADDRESS=" | head -1 | cut -d= -f2- | tr -d "'\"")"
                    bus_socket=""  # socket path may differ from the default
                    echo "[✓] dbus-launch started a session bus: ${bus_addr}"
                fi
            fi

            # 4c. Try dbus-daemon directly (when dbus-launch is not installed)
            if [[ -n "$bus_socket" && ! -S "$bus_socket" ]] && command -v dbus-daemon > /dev/null 2>&1; then
                echo "    Trying dbus-daemon fallback..."
                dbus-daemon --session --print-address --fork \
                    --address="unix:path=${bus_socket}" 2>/dev/null \
                    && echo "[✓] dbus-daemon started at ${bus_socket}" \
                    || echo "[!] dbus-daemon start failed"
            fi

            # 4d. Brief wait for socket to appear after start attempts
            if [[ -n "$bus_socket" && ! -S "$bus_socket" ]]; then
                local waited2=0
                while [[ ! -S "$bus_socket" && $waited2 -lt 3 ]]; do
                    sleep 1
                    waited2=$((waited2 + 1))
                done
            fi
        fi

        if [[ -z "$bus_socket" || -S "$bus_socket" ]]; then
            export DBUS_SESSION_BUS_ADDRESS="$bus_addr"
            echo "[✓] DBUS_SESSION_BUS_ADDRESS=${DBUS_SESSION_BUS_ADDRESS}"
        else
            # Socket still missing — set the default address anyway; systemd-run
            # will attempt to connect and fail gracefully if the bus is truly gone.
            export DBUS_SESSION_BUS_ADDRESS="$bus_addr"
            echo "[!] D-Bus socket not available at ${bus_socket} — set DBUS_SESSION_BUS_ADDRESS=${bus_addr} (may fail at runtime)"
        fi
    else
        echo "[!] ${user_runtime_dir} not available — cgroup v2 memory limit will fall back to prlimit/ulimit (safe, non-fatal)"
    fi

    # 4. Persist the env vars into the installation .env file so cheng-api
    #    always starts with them, even when launched by a systemd unit or cron.
    if [[ -n "${shared_dir:-}" && -f "${shared_dir}/.env" ]]; then
        local env_file="${shared_dir}/.env"

        persist_env_var() {
            local key="$1"
            local val="$2"
            [[ -n "$val" ]] || return 0
            if grep -q "^${key}=" "$env_file"; then
                # Update only if the value differs
                local existing
                existing="$(grep "^${key}=" "$env_file" | head -1 | cut -d= -f2-)"
                if [[ "$existing" != "$val" ]]; then
                    sed -i "s|^${key}=.*|${key}=${val}|" "$env_file"
                    echo "    Updated ${key} in .env"
                fi
            else
                {
                    echo ""
                    echo "# Systemd user session (for bubblewrap cgroup v2 memory limit)"
                    echo "${key}=${val}"
                } >> "$env_file"
                echo "    Added ${key} to .env"
            fi
        }

        persist_env_var "XDG_RUNTIME_DIR" "${XDG_RUNTIME_DIR:-}"
        persist_env_var "DBUS_SESSION_BUS_ADDRESS" "${DBUS_SESSION_BUS_ADDRESS:-}"
    fi
}

ensure_docker_compose() {
    command -v docker >/dev/null 2>&1 || { echo "Missing command: docker" >&2; exit 1; }
    docker compose version >/dev/null 2>&1 || { echo "docker compose plugin is required" >&2; exit 1; }
}

compute_native_modules() {
    local shared_dir="$1"
    # Prefer recorded modules from install time
    local recorded
    if recorded="$(read_installed_modules 2>/dev/null)"; then
        local modules="api"
        [[ ",$recorded," == *",ui,"* ]] && modules="${modules},ui"
        [[ ",$recorded," == *",app,"* ]] && modules="${modules},app"
        printf '%s\n' "$modules"
        return 0
    fi
    # Fallback: detect from directory structure
    modules="api"
    [[ -d "${shared_dir}/ui" && "$(ls -A "${shared_dir}/ui" 2>/dev/null)" ]] && modules="${modules},ui"
    [[ -d "${shared_dir}/app" && "$(ls -A "${shared_dir}/app" 2>/dev/null)" ]] && modules="${modules},app"
    printf '%s\n' "$modules"
}

modules_to_docker_services() {
    local modules="$1"
    local services="postgres api"
    [[ ",$modules," == *",redis,"* ]] && services="$services redis"
    [[ ",$modules," == *",qdrant,"* ]] && services="$services qdrant"
    [[ ",$modules," == *",ui,"* ]] && services="$services ui"
    [[ ",$modules," == *",app,"* ]] && services="$services app"
    printf '%s\n' "$services"
}

find_chengflow_binary() {
    local binary_name="$1"
    local binary_path

    for binary_path in \
        "${ROOT_DIR}/chengflow/target/release/${binary_name}" \
        "${ROOT_DIR}/chengflow/target/"*/release/"${binary_name}"
    do
        if [[ -f "$binary_path" ]]; then
            printf '%s\n' "$binary_path"
            return 0
        fi
    done

    return 1
}

copy_chengflow_binary() {
    local binary_name="$1"
    local target_name="$2"
    local target_dir="$3"
    local source_path

    source_path="$(find_chengflow_binary "$binary_name")" || {
        echo "ERROR: Built binary not found: ${binary_name}" >&2
        return 1
    }

    cp "$source_path" "${target_dir}/${target_name}"
    chmod +x "${target_dir}/${target_name}"
    echo "Copied ${binary_name}: ${source_path} -> ${target_dir}/${target_name}"
}

ensure_native_log_file_envs() {
    local shared_dir="$1"
    local env_file="${shared_dir}/.env"

    [[ -f "$env_file" ]] || return 0
    mkdir -p "${shared_dir}/logs"

    ensure_log_env() {
        local key="$1"
        local label="$2"
        local log_file="$3"

        if grep -q "^${key}=" "$env_file"; then
            echo "Using existing ${label} log file setting from ${env_file}"
            return 0
        fi

        {
            echo ""
            echo "# Native ${label} file log path."
            echo "${key}=${log_file}"
        } >> "$env_file"
        echo "Configured native ${label} log file: ${log_file}"
    }

    ensure_log_env "CHENG_API_LOG_FILE" "cheng-api" "${shared_dir}/logs/cheng-api.log"
    ensure_log_env "CHENG_CLI_LOG_FILE" "cheng-cli" "${shared_dir}/logs/cheng-cli.log"
    ensure_log_env "CHENG_UI_LOG_FILE" "cheng-ui" "${shared_dir}/logs/ui-server.log"
    ensure_log_env "CHENG_APP_LOG_FILE" "cheng-app" "${shared_dir}/logs/app-server.log"
}

# ── Standalone CLI-only Install ───────────────────────────────────────────────
# Installs just the `cheng` CLI binary, either alongside a co-located
# cheng-api (mode=local) or on a bare machine that only talks to a remote
# ChengOS server (mode=remote). Does not touch Postgres/UI/App or the hybrid
# deployment layout.

# Obtains a `cheng` binary (building from source in a dev workspace, or
# extracting it from a local/downloaded release tarball) and copies it into
# target_bin_dir/cheng.
install_cli_binary_only() {
    local target_bin_dir="$1"
    local binary_path=""

    if [[ -d "${ROOT_DIR}/chengflow" ]]; then
        echo "Developer workspace detected. Building cheng-cli from source..."
        (cd "${ROOT_DIR}/chengflow" && cargo build --release -p cheng-cli) || {
            echo "ERROR: Failed to build cheng-cli." >&2
            return 1
        }
        binary_path="$(find_chengflow_binary "cheng")" || {
            echo "ERROR: cheng-cli build did not produce a binary." >&2
            return 1
        }
        mkdir -p "$target_bin_dir"
        cp "$binary_path" "${target_bin_dir}/cheng"
        chmod +x "${target_bin_dir}/cheng"
        write_cli_target_metadata "${target_bin_dir}/cheng"
        echo "Installed cheng CLI binary: ${binary_path} -> ${target_bin_dir}/cheng"
        return 0
    fi

    echo "Looking for local release package..."
    local tarball="" downloaded="false"
    if tarball="$(find_local_tarball)"; then
        echo "Using local release package: ${tarball}"
    else
        echo "No local package found. Downloading the latest ChengOS release package..."
        local repo_url="https://github.com/chengrouter/chengos"
        local release_tag="$(curl -fsSLI -o /dev/null -w '%{url_effective}' "${repo_url}/releases/latest" 2>/dev/null | sed 's#.*/tag/##' || true)"
        local tarball_url
        if [[ -n "$release_tag" ]]; then
            tarball_url="${repo_url}/releases/download/${release_tag}/chengos-full-linux-amd64-${release_tag}.tar.gz"
        else
            tarball_url="${repo_url}/releases/latest/download/chengos-full-linux-amd64.tar.gz"
        fi
        tarball="/tmp/chengos_cli_download_$$.tar.gz"
        downloaded="true"
        if ! curl -sSfL "$tarball_url" -o "$tarball"; then
            echo "ERROR: Failed to download release from $tarball_url." >&2
            echo "Or place the tarball in the current directory and re-run." >&2
            rm -f "$tarball"
            return 1
        fi
    fi

    local temp_dir="/tmp/chengos_cli_extract_$$"
    mkdir -p "$temp_dir"
    if ! tar -xzf "$tarball" -C "$temp_dir" --strip-components=1; then
        echo "ERROR: Failed to extract release package." >&2
        [[ "$downloaded" == "true" ]] && rm -f "$tarball"
        rm -rf "$temp_dir"
        return 1
    fi

    if [[ ! -f "${temp_dir}/bin/cheng" ]]; then
        echo "ERROR: cheng binary not found inside the release package." >&2
        [[ "$downloaded" == "true" ]] && rm -f "$tarball"
        rm -rf "$temp_dir"
        return 1
    fi

    mkdir -p "$target_bin_dir"
    cp "${temp_dir}/bin/cheng" "${target_bin_dir}/cheng"
    chmod +x "${target_bin_dir}/cheng"
    write_cli_target_metadata "${target_bin_dir}/cheng"
    echo "Installed cheng CLI binary -> ${target_bin_dir}/cheng"

    [[ "$downloaded" == "true" ]] && rm -f "$tarball"
    rm -rf "$temp_dir"
}

sync_cli_binary_target() {
    local source_binary="$1"
    local target_path="$2"

    [[ -f "$source_binary" && -n "$target_path" ]] || return 0
    if [[ "$target_path" == "$source_binary" ]]; then
        return 0
    fi

    mkdir -p "$(dirname "$target_path")" 2>/dev/null || ${SUDO} mkdir -p "$(dirname "$target_path")"
    if cp "$source_binary" "$target_path" 2>/dev/null; then
        chmod +x "$target_path" 2>/dev/null || true
    else
        ${SUDO} cp "$source_binary" "$target_path"
        ${SUDO} chmod +x "$target_path"
    fi
    echo "Updated cheng CLI binary: ${target_path}"
}

sync_installed_cli_binaries() {
    local source_binary="$1"
    local shared_dir="$2"
    local cli_installed="$3"
    local target_path

    [[ -f "$source_binary" ]] || return 0

    if target_path="$(read_cli_target_metadata 2>/dev/null)"; then
        sync_cli_binary_target "$source_binary" "$target_path"
        return 0
    fi

    if [[ "$cli_installed" != "true" ]]; then
        return 0
    fi

    for target_path in /usr/local/bin/cheng "${HOME}/.local/bin/cheng"; do
        [[ -f "$target_path" ]] || continue
        if grep -qs "${shared_dir}/bin/cheng" "$target_path"; then
            echo "CLI launcher already points at updated binary: ${target_path}"
            continue
        fi
        sync_cli_binary_target "$source_binary" "$target_path"
        write_cli_target_metadata "$target_path"
    done
}

# Writes CHENG_LANG=<lang> to the user's shell profile so the CLI picks up
# the correct language on every invocation. Skips if already set to the
# same value. Only writes when a language preference is known.
write_cli_lang_env() {
    local lang="$1"
    [[ -n "$lang" ]] || return 0

    local marker="# cheng-cli language (managed by chengos.sh)"
    local line="export CHENG_LANG=${lang}"

    # Try ~/.bashrc, then ~/.zshrc — write to whichever exists (or bashrc
    # as the default for Linux systems without zsh).
    local profile_file="${HOME}/.bashrc"
    [[ -f "${HOME}/.zshrc" && ! -f "${HOME}/.bashrc" ]] && profile_file="${HOME}/.zshrc"

    if grep -q "${marker}" "$profile_file" 2>/dev/null; then
        # Update existing line
        sed -i "s|^export CHENG_LANG=.*|${line}|" "$profile_file" 2>/dev/null || return 0
        echo "Updated CHENG_LANG=${lang} in ${profile_file}"
    else
        {
            echo ""
            echo "${marker}"
            echo "${line}"
        } >> "$profile_file"
        echo "Added CHENG_LANG=${lang} to ${profile_file}"
    fi
}

# Writes ~/.config/cheng/config.json with the given server_url, unless a
# config file already exists (never silently overwrite user edits).
write_cli_config() {
    local server_url="$1"
    local config_dir="${HOME}/.config/cheng"
    local config_file="${config_dir}/config.json"

    mkdir -p "$config_dir"
    if [[ -f "$config_file" ]]; then
        echo "Existing CLI config found at ${config_file}; leaving it unchanged."
        echo "Edit it manually (or remove it and re-run) to change server_url."
        return 0
    fi

    cat > "$config_file" <<EOF
{
  "server_url": "${server_url}"
}
EOF
    echo "Wrote CLI config: ${config_file} (server_url=${server_url})"
}

# Top-level standalone CLI install: mode is "local" (co-located with
# cheng-api on this machine) or "remote" (bare terminal, talks to a remote
# ChengOS server). Installs the binary, writes config, and prints PATH setup
# instructions if needed. Does not require the hybrid/docker deployment
# layout to be present.
install_cli_standalone() {
    local mode="$1"
    local server_url="$2"

    if [[ -z "$server_url" ]]; then
        if [[ "$mode" == "local" ]]; then
            server_url="http://127.0.0.1:3000"
        else
            read -p "Enter the ChengOS server URL (e.g. https://your-server.example.com): " server_url < /dev/tty
        fi
    fi
    [[ -n "$server_url" ]] || { echo "ERROR: a server URL is required." >&2; return 1; }
    server_url="${server_url%/}"

    local target_bin_dir
    if [[ "$(id -u)" -eq 0 ]] || [[ -w /usr/local/bin ]]; then
        target_bin_dir="/usr/local/bin"
    else
        target_bin_dir="${HOME}/.local/bin"
    fi

    install_cli_binary_only "$target_bin_dir" || return 1
    write_cli_config "$server_url"
    write_cli_lang_env "$LANG_VAL"

    echo ""
    if [[ ":${PATH}:" != *":${target_bin_dir}:"* ]]; then
        echo "NOTE: ${target_bin_dir} is not on your PATH."
        echo "Add this to your shell profile (~/.bashrc or ~/.zshrc), then restart your shell:"
        echo "  export PATH=\"${target_bin_dir}:\$PATH\""
        echo ""
    fi
    echo "cheng CLI installed. Server: ${server_url}"
    echo "Run 'cheng' to start chatting (first run will prompt for login or setup)."
}

# Run sub-command in Docker or Native
run_service_cmd() {
    local cmd="$1" # start, stop, status
    local mode="${2:-native}"
    local with_infra="${3:-false}"

    if [[ "$mode" == "docker" ]]; then
        local shared_dir docker_dir
        shared_dir="$(resolve_shared_dir)"
        docker_dir="$(resolve_docker_dir)"
        
        cd "$shared_dir"
        if [[ "$cmd" == "start" ]]; then
            [[ -f .env ]] || bash generate-env.sh
            cd "$docker_dir"
            if [[ -f start.sh ]]; then
                bash start.sh
            else
                ensure_docker_compose
                docker compose --env-file ../.env up -d
            fi
        elif [[ "$cmd" == "stop" ]]; then
            cd "$docker_dir"
            ensure_docker_compose
            if [[ "$with_infra" == "true" ]]; then
                docker compose --env-file ../.env down -v
            else
                docker compose --env-file ../.env down
            fi
        elif [[ "$cmd" == "status" ]]; then
            cd "$docker_dir"
            ensure_docker_compose
            docker compose --env-file ../.env ps
        fi
    else
        local hybrid_dir
        hybrid_dir="$(resolve_hybrid_dir)"
        
        cd "$hybrid_dir"
        if [[ "$cmd" == "start" ]]; then
            shift 2
            bash start.sh "$@"
        elif [[ "$cmd" == "stop" ]]; then
            if [[ "$with_infra" == "true" ]]; then
                bash stop.sh --with-infra
            else
                bash stop.sh
            fi
        elif [[ "$cmd" == "status" ]]; then
            bash status.sh
        fi
    fi
}

# Setup env for native
setup_native_env() {
    local db_mode="$1"
    local enable_redis="$2"
    local enable_qdrant="$3"
    local ui_port="$4"
    local app_port="$5"
    local workspace_root="${6:-}"

    local shared_dir
    shared_dir="$(resolve_shared_dir)"

    cd "$shared_dir"
    export DB_INSTALL_MODE="$db_mode"
    export ENABLE_REDIS="$enable_redis"
    export ENABLE_QDRANT="$enable_qdrant"
    export UI_PORT="$ui_port"
    export APP_PORT="$app_port"

    local gen_args=()
    [[ -n "$workspace_root" ]] && gen_args+=(--workspace-root "$workspace_root")

    if [[ -f .env ]]; then
        # Check for placeholder values indicating incomplete env generation
        if grep -qE 'replace_with_|change_this_' .env 2>/dev/null; then
            echo "[!] Existing .env has placeholder values. Regenerating with --force..."
            gen_args+=(--force)
            bash generate-env.sh "${gen_args[@]+"${gen_args[@]}"}"
        else
            echo "Using existing environment configuration: ${shared_dir}/.env"
            # Persist workspace_root into existing .env if provided
            if [[ -n "$workspace_root" ]]; then
                local env_file="${shared_dir}/.env"
                if grep -q "^#\?CHENG_WORKSPACE_ROOT=" "$env_file"; then
                    sed -i "s|^#\?CHENG_WORKSPACE_ROOT=.*|CHENG_WORKSPACE_ROOT=${workspace_root}|" "$env_file"
                else
                    echo "" >> "$env_file"
                    echo "# Workspace root for non-CLI workflow execution" >> "$env_file"
                    echo "CHENG_WORKSPACE_ROOT=${workspace_root}" >> "$env_file"
                fi
                echo "Configured CHENG_WORKSPACE_ROOT=${workspace_root} in .env"
            fi
        fi
    else
        echo "Generating environment configuration (.env)..."
        bash generate-env.sh "${gen_args[@]+"${gen_args[@]}"}"
    fi
    # Keep native/binary runs logging to the installation-local logs directory.
    # Docker deployments set their container log path in docker-compose.yml.
    ensure_native_log_file_envs "$shared_dir"

    # Configure systemd user session environment for bubblewrap cgroup v2 support.
    # This sets XDG_RUNTIME_DIR / DBUS_SESSION_BUS_ADDRESS and persists them to .env.
    setup_systemd_user_session "$shared_dir"
}

# Setup env for docker
setup_docker_env() {
    local enable_redis="$1"
    local enable_qdrant="$2"
    local ui_port="$3"
    local app_port="$4"

    local shared_dir
    shared_dir="$(resolve_shared_dir)"

    cd "$shared_dir"
    export ENABLE_REDIS="$enable_redis"
    export ENABLE_QDRANT="$enable_qdrant"
    export UI_PORT="$ui_port"
    export APP_PORT="$app_port"

    if [[ -f .env ]]; then
        echo "Using existing environment configuration: ${shared_dir}/.env"
    else
        echo "Generating environment configuration (.env)..."
        bash generate-env.sh
    fi
}

# Reads a key from the managed Compose environment file.
read_env_value() {
    local env_file="$1" key="$2"
    [[ -f "$env_file" ]] || return 1
    local value
    value="$(sed -n "s/^${key}=\(.*\)$/\1/p" "$env_file" | tail -n1 | tr -d '[:space:]')"
    [[ -n "$value" ]] || return 1
    printf '%s' "$value"
}

# Writes (or replaces) a key in the managed Compose environment file.
write_env_value() {
    local env_file="$1" key="$2" value="$3"
    touch "$env_file"
    if grep -q "^${key}=" "$env_file"; then
        local tmp
        tmp="$(mktemp)"
        sed "s|^${key}=.*|${key}=${value}|" "$env_file" > "$tmp"
        cat "$tmp" > "$env_file"
        rm -f "$tmp"
    else
        printf '%s=%s\n' "$key" "$value" >> "$env_file"
    fi
}

# True when any per-image override is set, which makes coordinated release
# updates impossible: the pin no longer decides what runs.
docker_overrides_present() {
    local env_file="$1" key
    for key in CHENGOS_API_IMAGE CHENGOS_UI_IMAGE CHENGOS_APP_IMAGE CHENGOS_CLI_IMAGE; do
        if [[ -n "${!key:-}" ]]; then
            printf '%s' "$key"
            return 0
        fi
        if [[ -f "$env_file" ]] && grep -qE "^${key}=.+" "$env_file"; then
            printf '%s' "$key"
            return 0
        fi
    done
    return 1
}

docker_compose_cmd() {
    local docker_dir="$1"
    shift
    ( cd "$docker_dir" && docker compose --env-file ../.env "$@" )
}

# Pins every ChengOS application service to one exact release, pulls it,
# recreates the services, and verifies health. On any failure the previous pin
# is restored and the previous images are recreated. Data volumes are never
# touched: PostgreSQL, Valkey, Qdrant, and user volumes are out of scope for an
# application image update.
update_docker_install() {
    require_release_lib || return 1

    local shared_dir docker_dir env_file
    shared_dir="$(resolve_shared_dir)"
    docker_dir="$(resolve_docker_dir)"
    env_file="${shared_dir}/.env"

    cd "$shared_dir"
    ensure_docker_compose
    [[ -f .env ]] || bash generate-env.sh

    local override
    if override="$(docker_overrides_present "$env_file")"; then
        echo "ERROR: ${override} is set, so images no longer come from the release pin." >&2
        echo "Coordinated Docker release updates are disabled while a per-image override is present." >&2
        echo "Remove the override(s) from ${env_file} to re-enable version-pinned updates." >&2
        return 1
    fi

    local current_pin target_version
    current_pin="$(read_env_value "$env_file" CHENGOS_VERSION || true)"
    current_pin="$(rel_normalize_version "$current_pin")"

    if [[ -n "$UPDATE_TARGET_VERSION" ]]; then
        target_version="$(rel_normalize_version "$UPDATE_TARGET_VERSION")"
        rel_is_stable_semver "$target_version" || {
            echo "ERROR: --to '${UPDATE_TARGET_VERSION}' is not a stable release version." >&2
            return 1
        }
    else
        echo "Checking the latest stable ChengOS release..."
        if ! target_version="$(rel_fetch_latest_version)"; then
            echo "ERROR: could not determine the latest stable release (network, rate limit, or malformed metadata)." >&2
            echo "Nothing was changed. Retry later, or pin a version with './chengos.sh update --to X.Y.Z'." >&2
            return 1
        fi
    fi

    echo "Current pin      : ${current_pin:-latest (unpinned)}"
    echo "Target release   : ${target_version}"

    if [[ "$FORCE_UPDATE" != "true" && -z "$UPDATE_TARGET_VERSION" ]]; then
        if rel_is_stable_semver "$current_pin" && ! rel_version_gt "$target_version" "$current_pin"; then
            echo "Already up to date (${current_pin}); updates are upgrade-only."
            echo "Use --force, or --to X.Y.Z, to reinstall or downgrade deliberately."
            return 0
        fi
    fi

    # Pin first so `docker compose pull` resolves the exact tags, but remember
    # the previous pin so a failure can put it back.
    write_env_value "$env_file" CHENGOS_VERSION "$target_version"

    restore_docker_pin() {
        local reason="$1"
        echo "ERROR: ${reason}" >&2
        if [[ -n "$current_pin" ]]; then
            echo "Restoring the previous version pin (${current_pin})..." >&2
            write_env_value "$env_file" CHENGOS_VERSION "$current_pin"
        else
            echo "Restoring the previous unpinned configuration..." >&2
            write_env_value "$env_file" CHENGOS_VERSION "latest"
        fi
        docker_compose_cmd "$docker_dir" up -d --no-deps api ui app >/dev/null 2>&1 \
            || echo "ERROR: failed to recreate the previous services; run './chengos.sh start'." >&2
        return 1
    }

    echo "Pulling ChengOS images for ${target_version}..."
    if ! docker_compose_cmd "$docker_dir" pull api ui app; then
        restore_docker_pin "failed to pull one or more ChengOS images for ${target_version}"
        return 1
    fi
    # The CLI image is optional (profile-gated); its absence must not fail the
    # application update.
    docker_compose_cmd "$docker_dir" --profile cli pull cli >/dev/null 2>&1 || \
        echo "NOTE: the CLI image for ${target_version} was not pulled (profile disabled or image unavailable)."

    echo "Recreating ChengOS services..."
    if ! docker_compose_cmd "$docker_dir" up -d --no-deps api ui app; then
        restore_docker_pin "failed to recreate ChengOS services on ${target_version}"
        return 1
    fi

    local health_url
    health_url="$(resolve_health_url)"
    echo "Waiting for ${health_url} to report healthy (timeout ${CHENGOS_HEALTH_TIMEOUT}s)..."
    if ! rel_wait_for_health "$health_url" "$CHENGOS_HEALTH_TIMEOUT"; then
        restore_docker_pin "the API did not become healthy on ${target_version} within ${CHENGOS_HEALTH_TIMEOUT}s"
        return 1
    fi

    # Rollback metadata and the version record are written only after health
    # verification, so a failed update never claims to have happened.
    if [[ -n "$current_pin" ]]; then
        printf '%s\n' "$current_pin" > "$DOCKER_VERSION_FILE"
    fi
    rel_write_installed_version "$VERSION_FILE" "$target_version"

    echo "Docker update completed: ${current_pin:-unpinned} -> ${target_version}"
    docker_compose_cmd "$docker_dir" ps api ui app || true
}

# Restores the previous exact version pin, pulls it if needed, recreates the
# application services, and verifies health. Named data volumes are never
# deleted or recreated.
rollback_docker_install() {
    require_release_lib || return 1

    local shared_dir docker_dir env_file
    shared_dir="$(resolve_shared_dir)"
    docker_dir="$(resolve_docker_dir)"
    env_file="${shared_dir}/.env"

    cd "$shared_dir"
    ensure_docker_compose

    if ! rel_rollback_allowed "$shared_dir"; then
        echo "ERROR: the installed release declares an irreversible database migration." >&2
        rel_print_manual_recovery
        return 1
    fi

    local current_pin previous_pin
    current_pin="$(rel_normalize_version "$(read_env_value "$env_file" CHENGOS_VERSION || true)")"

    if [[ -n "$UPDATE_TARGET_VERSION" ]]; then
        previous_pin="$(rel_normalize_version "$UPDATE_TARGET_VERSION")"
    elif [[ -f "$DOCKER_VERSION_FILE" ]]; then
        previous_pin="$(rel_normalize_version "$(cat "$DOCKER_VERSION_FILE")")"
    else
        previous_pin=""
    fi

    if ! rel_is_stable_semver "$previous_pin"; then
        echo "ERROR: no previous exact version is recorded for this Docker installation." >&2
        echo "Rollback metadata is written by './chengos.sh update'. Pin a version explicitly with" >&2
        echo "  ./chengos.sh rollback --to X.Y.Z" >&2
        return 1
    fi

    echo "Rolling back Docker services: ${current_pin:-unpinned} -> ${previous_pin}"
    write_env_value "$env_file" CHENGOS_VERSION "$previous_pin"

    if ! docker_compose_cmd "$docker_dir" pull api ui app; then
        echo "ERROR: failed to pull ChengOS images for ${previous_pin}; restoring the current pin." >&2
        write_env_value "$env_file" CHENGOS_VERSION "${current_pin:-latest}"
        return 1
    fi

    if ! docker_compose_cmd "$docker_dir" up -d --no-deps api ui app; then
        echo "ERROR: failed to recreate services on ${previous_pin}; restoring the current pin." >&2
        write_env_value "$env_file" CHENGOS_VERSION "${current_pin:-latest}"
        docker_compose_cmd "$docker_dir" up -d --no-deps api ui app || true
        return 1
    fi

    local health_url
    health_url="$(resolve_health_url)"
    if ! rel_wait_for_health "$health_url" "$CHENGOS_HEALTH_TIMEOUT"; then
        echo "ERROR: the API did not become healthy on ${previous_pin} within ${CHENGOS_HEALTH_TIMEOUT}s." >&2
        echo "The pin was left at ${previous_pin}; inspect 'docker compose logs api'." >&2
        return 1
    fi

    rel_write_installed_version "$VERSION_FILE" "$previous_pin"
    rm -f "$DOCKER_VERSION_FILE"
    echo "Docker rollback completed: now on ${previous_pin}."
}

# Version-aware status block printed above the service status.
#
# A failed network lookup is reported as "latest version unavailable" — never
# silently rendered as "up to date", which would hide a pending security fix.
print_version_status() {
    local mode="${1:-native}"
    local shared_dir
    shared_dir="$(resolve_shared_dir)"

    echo "-------------------------------------------"
    echo "ChengOS Version"
    echo "-------------------------------------------"
    printf '  Install mode      : %s\n' "$mode"

    if [[ "$RELEASE_LIB_LOADED" != "true" ]]; then
        echo "  Version reporting : unavailable (lib/release-update.sh missing)"
        echo ""
        return 0
    fi

    local recorded status
    status=0
    recorded="$(rel_read_installed_version "$VERSION_FILE")" || status=$?
    if (( status == 0 )); then
        printf '  Installed version : %s\n' "$recorded"
    elif (( status == 2 )); then
        printf '  Installed version : %s (malformed record; will be normalized on the next update)\n' "$recorded"
    else
        echo "  Installed version : unknown (no .chengos_version record)"
    fi

    # The version the package on disk actually carries, which can differ from
    # the record if files were replaced by hand.
    if [[ -f "${shared_dir}/VERSION" ]]; then
        printf '  Package version   : %s\n' "$(rel_normalize_version "$(cat "${shared_dir}/VERSION")")"
    else
        echo "  Package version   : unknown (bundle predates the release contract)"
    fi

    if [[ "$mode" == "docker" ]]; then
        local env_file pin override
        env_file="${shared_dir}/.env"
        pin="$(read_env_value "$env_file" CHENGOS_VERSION || true)"
        printf '  Compose pin       : %s\n' "${pin:-latest (unpinned)}"
        if override="$(docker_overrides_present "$env_file")"; then
            printf '  Image overrides   : %s set — coordinated release updates are DISABLED\n' "$override"
        fi
        if [[ -f "$DOCKER_VERSION_FILE" ]]; then
            printf '  Rollback target   : %s\n' "$(rel_normalize_version "$(cat "$DOCKER_VERSION_FILE")")"
        fi
    else
        local backup_dir
        if backup_dir="$(rel_latest_backup "$ROOT_DIR")"; then
            printf '  Rollback target   : %s (%s)\n' "$(rel_backup_version "$backup_dir")" "$(basename "$backup_dir")"
        else
            echo "  Rollback target   : none (no update has been performed yet)"
        fi
    fi

    printf '  Migration policy  : %s\n' "$(rel_migration_policy "$shared_dir")"

    local health_url running
    health_url="$(resolve_health_url)"
    if running="$(rel_running_version "$health_url")"; then
        printf '  Running version   : %s (API healthy)\n' "$running"
        if (( status == 0 )) && [[ "$running" != "$recorded" ]]; then
            echo "  WARNING           : the running API reports a different version than the record"
        fi
    else
        echo "  Running version   : API not responding"
    fi

    local latest
    if latest="$(rel_fetch_latest_version)"; then
        printf '  Latest stable     : %s\n' "$latest"
        if (( status == 0 )); then
            if rel_version_gt "$latest" "$recorded"; then
                printf '  Update available  : %s -> %s (run ./chengos.sh update)\n' "$recorded" "$latest"
            else
                echo "  Update available  : no (up to date)"
            fi
        fi
    else
        echo "  Latest stable     : unavailable (release lookup failed; this is NOT a claim of being up to date)"
    fi
    echo ""
}

download_text_file() {
    local url="$1"
    local target="$2"
    local tmp_file

    tmp_file="${target}.tmp.$$"
    if ! curl -fsSL "$url" -o "$tmp_file"; then
        rm -f "$tmp_file"
        return 1
    fi
    if [[ ! -s "$tmp_file" ]]; then
        echo "Downloaded file is empty: ${url}" >&2
        rm -f "$tmp_file"
        return 1
    fi
    mv "$tmp_file" "$target"
}

update_script_files() {
    local hybrid_dir docker_dir updated_any
    hybrid_dir="$(resolve_hybrid_dir)"
    docker_dir="$(resolve_docker_dir)"
    updated_any="false"

    echo "Refreshing ChengOS installer/deployment scripts from GitHub branch: ${UPDATE_BRANCH}"
    echo "Source: ${RAW_BASE_URL}"

    update_one_script() {
        local relative_path="$1"
        local target_path="$2"
        local tmp_path

        mkdir -p "$(dirname "$target_path")"
        tmp_path="${target_path}.download.$$"
        echo "Checking ${relative_path}"
        if ! download_text_file "${RAW_BASE_URL}/${relative_path}" "$tmp_path"; then
            echo "ERROR: Failed to download ${relative_path}" >&2
            rm -f "$tmp_path"
            return 1
        fi
        if [[ -f "$target_path" ]] && cmp -s "$tmp_path" "$target_path"; then
            echo "Already current: ${target_path}"
            rm -f "$tmp_path"
            return 0
        fi
        mv "$tmp_path" "$target_path"
        case "$target_path" in
            *.sh|*/chengos.sh) chmod +x "$target_path" 2>/dev/null || true ;;
        esac
        echo "Updated: ${target_path}"
        updated_any="true"
    }

    local shared_dir
    shared_dir="$(resolve_shared_dir)"

    update_one_script "deploy/hybrid/start.sh" "${hybrid_dir}/start.sh"
    update_one_script "deploy/hybrid/stop.sh" "${hybrid_dir}/stop.sh"
    update_one_script "deploy/hybrid/status.sh" "${hybrid_dir}/status.sh"
    update_one_script "deploy/hybrid/generate-env.sh" "${hybrid_dir}/generate-env.sh"
    update_one_script "deploy/.env.example" "${shared_dir}/.env.example"

    if [[ -d "$docker_dir" || -f "${docker_dir}/docker-compose.yml" ]]; then
        update_one_script "deploy/docker/start.sh" "${docker_dir}/start.sh"
        update_one_script "deploy/docker/upgrade.sh" "${docker_dir}/upgrade.sh"
        update_one_script "deploy/docker/generate-env.sh" "${docker_dir}/generate-env.sh"
        update_one_script "deploy/docker/docker-compose.yml" "${docker_dir}/docker-compose.yml"
        update_one_script "deploy/docker/docker-compose.binds.yml" "${docker_dir}/docker-compose.binds.yml"
        update_one_script "deploy/docker/docker-compose.remote.yml" "${docker_dir}/docker-compose.remote.yml"
        update_one_script "deploy/.env.example" "${shared_dir}/.env.example"
    fi

    if [[ "$updated_any" == "true" ]]; then
        echo "Script update completed. Re-run ./chengos.sh for the refreshed manager if this command was launched from the old script."
    else
        echo "Installer/deployment scripts are already current."
    fi
}

rebuild_native_from_git_checkout() {
    local shared_dir="$1"
    local hybrid_dir="$2"
    local git_root="${3:-$ROOT_DIR}"

    if [[ ! -d "${git_root}/chengflow" ]]; then
        echo "No chengflow source directory found; Git checkout updated but binaries were not rebuilt."
        return 0
    fi

    local recorded_modules
    recorded_modules="$(read_installed_modules 2>/dev/null || echo "api,ui,app")"

    local cli_installed="false"
    if [[ ",$recorded_modules," == *",cli,"* || -f "${shared_dir}/bin/cheng" ]]; then
        cli_installed="true"
    fi

    local was_running="false"
    [[ -f "${shared_dir}/runtime/cheng-api.pid" ]] && was_running="true"

    echo "Stopping services before rebuilding package-owned files..."
    bash "${hybrid_dir}/stop.sh" || true

    if [[ ",$recorded_modules," == *",ui,"* && -d "${git_root}/chengflow-ui" ]]; then
        echo "Building UI from updated source..."
        (cd "${git_root}/chengflow-ui" && (pnpm build:deploy || npm run build:deploy))
    fi
    if [[ ",$recorded_modules," == *",app,"* && -d "${git_root}/chengflow-app" ]]; then
        echo "Building Chat App from updated source..."
        (cd "${git_root}/chengflow-app" && (pnpm build:deploy || npm run build:deploy))
    fi

    echo "Building backend Cargo packages from updated source..."
    local cargo_modules="-p cheng-api"
    [[ "$cli_installed" == "true" ]] && cargo_modules="$cargo_modules -p cheng-cli"
    (cd "${git_root}/chengflow" && cargo build --release $cargo_modules)

    mkdir -p "${shared_dir}/bin"
    copy_chengflow_binary "cheng-api" "cheng-api" "${shared_dir}/bin"
    if [[ "$cli_installed" == "true" ]]; then
        copy_chengflow_binary "cheng" "cheng" "${shared_dir}/bin"
        sync_installed_cli_binaries "${shared_dir}/bin/cheng" "$shared_dir" "$cli_installed"
    fi
    chmod +x "${shared_dir}/bin/"* 2>/dev/null || true

    # Sync shared resources from source to deploy directory
    # (mirrors sync_deploy_resources in build.sh so git-based updates stay
    #  consistent with tarball-based updates)
    if [[ -d "${git_root}/chengflow/workflow-templates" ]]; then
        echo "Syncing workflow-templates from source..."
        rm -rf "${shared_dir:?}/workflow-templates"
        cp -a "${git_root}/chengflow/workflow-templates" "${shared_dir}/workflow-templates"
    fi
    if [[ -d "${git_root}/chengflow/config" ]]; then
        echo "Syncing config from source..."
        mkdir -p "${shared_dir}/config"
        cp -an "${git_root}/chengflow/config/." "${shared_dir}/config/"
    fi
    if [[ -d "${git_root}/chengflow/skills" ]]; then
        echo "Syncing skills from source..."
        mkdir -p "${shared_dir}/skills"
        cp -a "${git_root}/chengflow/skills/." "${shared_dir}/skills/"
    fi

    # Copy built frontend assets to shared directory
    if [[ ",$recorded_modules," == *",ui,"* && -d "${git_root}/chengflow-ui/dist" ]]; then
        echo "Copying UI build output..."
        rm -rf "${shared_dir:?}/ui"
        cp -a "${git_root}/chengflow-ui/dist" "${shared_dir}/ui"
    fi
    if [[ ",$recorded_modules," == *",app,"* && -d "${git_root}/chengflow-app/dist-app" ]]; then
        echo "Copying App build output..."
        rm -rf "${shared_dir:?}/app"
        cp -a "${git_root}/chengflow-app/dist-app" "${shared_dir}/app"
    fi

    if [[ "$was_running" == "true" ]]; then
        echo "Services were running before update; restarting..."
        local restart_modules
        restart_modules="$(compute_native_modules "$shared_dir")"
        bash "${hybrid_dir}/start.sh" --with "$restart_modules"
    fi
}

update_native_install() {
    local shared_dir hybrid_dir latest_tag local_version
    shared_dir="$(resolve_shared_dir)"
    hybrid_dir="$(resolve_hybrid_dir)"
    cd "$shared_dir"
    echo "Native deployment directory: ${hybrid_dir}"
    echo "Shared resource directory: ${shared_dir}"
    if [[ -f .env ]]; then
        echo "Using existing environment configuration: ${shared_dir}/.env"
    else
        echo "Environment file is missing; generating ${shared_dir}/.env"
        bash generate-env.sh
    fi
    ensure_native_log_file_envs "$shared_dir"

    if [[ "$UPDATE_KIND" == "source" ]] && git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        local before after upstream git_root
        git_root="$(git -C "$ROOT_DIR" rev-parse --show-toplevel 2>/dev/null || printf '%s' "$ROOT_DIR")"
        before="$(git -C "$ROOT_DIR" rev-parse --short HEAD)"
        upstream="$(git -C "$ROOT_DIR" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
        echo "Git checkout detected: ${git_root}"
        echo "Current revision: ${before}"
        if [[ -n "$upstream" ]]; then
            echo "Updating from upstream: ${upstream}"
        else
            echo "No upstream branch configured; running git pull --ff-only"
        fi

        if ! git -C "$ROOT_DIR" fetch --prune; then
            echo "ERROR: git fetch failed. Check network access and repository permissions." >&2
            return 1
        fi

        if [[ -n "$upstream" ]]; then
            if ! git -C "$ROOT_DIR" merge --ff-only "$upstream"; then
                echo "ERROR: fast-forward update failed. Resolve local changes or branch divergence, then retry." >&2
                return 1
            fi
        else
            if ! git -C "$ROOT_DIR" pull --ff-only; then
                echo "ERROR: git pull failed. Configure an upstream branch or update manually." >&2
                return 1
            fi
        fi

        after="$(git -C "$ROOT_DIR" rev-parse --short HEAD)"
        if [[ "$before" == "$after" ]]; then
            echo "Git checkout is already current (${after})."
        else
            echo "Updated Git checkout: ${before} -> ${after}"
        fi
        rebuild_native_from_git_checkout "$shared_dir" "$hybrid_dir" "$git_root"
        return 0
    fi

    require_release_lib || return 1

    local local_version local_version_status
    local_version=""
    local_version_status=0
    local_version="$(rel_read_installed_version "$VERSION_FILE")" || local_version_status=$?
    if (( local_version_status == 2 )); then
        echo "WARNING: installed version record '${local_version}' is not a valid SemVer; treating the installation as unknown." >&2
        local_version=""
    fi

    local was_running
    was_running="false"
    [[ -f "${shared_dir}/runtime/cheng-api.pid" ]] && was_running="true"

    local recorded_modules
    recorded_modules="$(read_installed_modules 2>/dev/null || echo "api,ui,app")"

    # ── Select the release and obtain a verified bundle ───────────────────────
    # Nothing below this block touches the installation: an invalid download,
    # a bad checksum/signature, a malformed archive, or a version mismatch all
    # abort while the running system is still completely untouched.
    local stage_dir bundle_root target_version archive_path
    stage_dir="$(mktemp -d "${TMPDIR:-/tmp}/chengos-update-XXXXXXXX")"
    # shellcheck disable=SC2064
    trap "rm -rf '${stage_dir}'" RETURN

    local local_tarball_found
    local_tarball_found=""
    if local_tarball_found="$(find_local_tarball)"; then
        echo "Using local release package: ${local_tarball_found}"
        archive_path="$local_tarball_found"

        # A local package still has to declare its own version, and it is only
        # installed when it is newer — or when --force was given explicitly.
        local peeked
        peeked="$(rel_normalize_version "$(tar -xzOf "$archive_path" chengos/VERSION 2>/dev/null || true)")"
        if [[ -z "$peeked" ]]; then
            echo "ERROR: local package does not contain chengos/VERSION; it predates the release contract and cannot be verified." >&2
            return 1
        fi
        target_version="$peeked"

        if [[ -f "${archive_path}.sha256" ]]; then
            rel_verify_checksum "$archive_path" "${archive_path}.sha256" || return 1
            rel_verify_signature "$archive_path" "${archive_path}.sig" || return 1
        elif [[ "$CHENGOS_REQUIRE_SIGNATURE" == "required" ]]; then
            echo "ERROR: no checksum file found next to the local package (${archive_path}.sha256)," >&2
            echo "       and CHENGOS_REQUIRE_SIGNATURE=required. Download the .sha256 (and .sig)" >&2
            echo "       asset from the release, or update over the network instead." >&2
            return 1
        else
            # Only the checksum is missing here; signature policy is handled by
            # rel_verify_signature in the verified path above.
            echo "WARNING: no checksum file found next to the local package (${archive_path}.sha256)." >&2
            echo "         Installing on structural verification only: the archive layout and its" >&2
            echo "         embedded VERSION are checked, but its origin is not." >&2
        fi
    else
        echo "No local package found. Checking the latest stable ChengOS release..."
        if ! target_version="$(rel_fetch_latest_version)"; then
            echo "ERROR: could not determine the latest stable release (network, rate limit, or malformed metadata)." >&2
            echo "Nothing was changed. Retry later, or place a release tarball next to chengos.sh to update offline." >&2
            return 1
        fi
        echo "Latest stable release: ${target_version}"
        echo "Installed version    : ${local_version:-unknown}"

        if [[ "$FORCE_UPDATE" != "true" ]]; then
            if [[ -n "$local_version" ]] && ! rel_version_gt "$target_version" "$local_version"; then
                echo "Already up to date (${local_version}); updates are upgrade-only."
                echo "Use --force to reinstall or downgrade to ${target_version} deliberately."
                return 0
            fi
        else
            echo "Force update requested; installing ${target_version} regardless of the installed version."
        fi

        if ! archive_path="$(rel_download_release "$target_version" "$stage_dir")"; then
            return 1
        fi
        rel_verify_checksum "$archive_path" || return 1
        rel_verify_signature "$archive_path" || return 1
    fi

    # Refuse to stage a package the filesystem cannot hold. The extracted tree
    # is larger than the archive; four times the compressed size is a cheap,
    # deliberately conservative bound.  In low-disk mode we use 2× because the
    # archive is deleted immediately after extraction and old backups are
    # pruned to 1 before the new backup is created.
    local archive_bytes
    archive_bytes="$(wc -c < "$archive_path" | tr -d '[:space:]')"
    local space_multiplier=4
    [[ "$LOW_DISK_UPDATE" == "true" ]] && space_multiplier=2
    rel_check_free_space "$stage_dir" "$(( archive_bytes * space_multiplier ))" || return 1
    rel_check_free_space "$shared_dir" "$(( archive_bytes * space_multiplier ))" || return 1

    if ! bundle_root="$(rel_extract_and_verify "$archive_path" "${stage_dir}/extract" "$target_version" "$RELEASE_VERIFIER")"; then
        echo "ERROR: the downloaded package failed verification; the installation was not modified." >&2
        return 1
    fi
    echo "Package verified: ChengOS ${target_version}"

    # Low-disk mode: delete the archive immediately after successful extraction
    # to free ~65 MB before the backup step.
    if [[ "$LOW_DISK_UPDATE" == "true" && "$local_tarball_found" != "$archive_path" ]]; then
        echo "[low-disk] Removing downloaded archive to free space..."
        rm -f "$archive_path"
    fi

    # ── Everything below mutates the installation ────────────────────────────
    # Low-disk mode: prune old backups to keep only 1 before creating the new
    # backup, freeing up to (N-1)×200 MB.
    if [[ "$LOW_DISK_UPDATE" == "true" ]]; then
        echo "[low-disk] Pruning old backups (keep=1)..."
        rel_prune_backups "$ROOT_DIR" 1
    fi

    echo "Backing up the current package-owned state..."
    local backup_dir
    if ! backup_dir="$(rel_backup_package_state "$ROOT_DIR" "$shared_dir" "$hybrid_dir" "${local_version:-unknown}")"; then
        echo "ERROR: failed to back up the current package; refusing to update." >&2
        return 1
    fi
    echo "Backup: ${backup_dir}"

    # A stop that leaves a process running would let the updater replace files
    # underneath it. Nothing has been mutated yet, so abort cleanly.
    echo "Stopping services before replacing package-owned files..."
    if ! bash "${hybrid_dir}/stop.sh"; then
        echo "ERROR: services could not be stopped; the installation was not modified." >&2
        echo "Stop ChengOS manually, then rerun the update." >&2
        return 1
    fi

    # Restores the previous package and service, then reports the original
    # failure. Used for every failure mode after the first mutation.
    restore_previous_release() {
        local reason="$1"
        echo "ERROR: ${reason}" >&2
        echo "Restoring the previous package from ${backup_dir}..." >&2
        bash "${hybrid_dir}/stop.sh" >/dev/null 2>&1 || true
        if rel_restore_package_state "$backup_dir" "$ROOT_DIR" "$shared_dir" "$hybrid_dir"; then
            echo "Previous package restored (${local_version:-unknown}); restarting services..." >&2
            if [[ "$was_running" == "true" ]]; then
                bash "${hybrid_dir}/start.sh" --with "$(compute_native_modules "$shared_dir")" || \
                    echo "ERROR: the previous service failed to restart; run './chengos.sh start' after inspecting the logs." >&2
            fi
        else
            echo "ERROR: automatic restore failed. The backup is intact at ${backup_dir}." >&2
            echo "Recover manually as described in chengflow/docs/release-operations-guide.md." >&2
        fi
        return 1
    }

    if [[ "$LOW_DISK_UPDATE" == "true" ]]; then
        echo "[low-disk] Installing package files (low-disk mode: retire-then-copy)..."
        if ! rel_install_package_state_lowdisk "$bundle_root" "$ROOT_DIR" "$shared_dir" "$hybrid_dir" "$recorded_modules"; then
            restore_previous_release "failed to install package-owned files for ${target_version}"
            return 1
        fi
    else
        if ! rel_install_package_state "$bundle_root" "$ROOT_DIR" "$shared_dir" "$hybrid_dir" "$recorded_modules"; then
            restore_previous_release "failed to install package-owned files for ${target_version}"
            return 1
        fi
    fi

    # Low-disk mode: free the staging directory now that files are installed,
    # before the health check, to maximise available space during restart.
    if [[ "$LOW_DISK_UPDATE" == "true" ]]; then
        echo "[low-disk] Cleaning staging directory..."
        rm -rf "${stage_dir}/extract"
    fi

    if [[ -f "${shared_dir}/bin/cheng" ]]; then
        local cli_installed="false"
        [[ ",${recorded_modules}," == *",cli,"* ]] && cli_installed="true"
        sync_installed_cli_binaries "${shared_dir}/bin/cheng" "$shared_dir" "$cli_installed" || true
    fi

    # ── Start and prove the new release is actually serving ──────────────────
    if [[ "$was_running" == "true" ]]; then
        echo "Starting services on ${target_version}..."
        if ! bash "${hybrid_dir}/start.sh" --with "$(compute_native_modules "$shared_dir")"; then
            restore_previous_release "the new release failed to start"
            return 1
        fi

        local health_url
        health_url="$(resolve_health_url)"
        echo "Waiting for ${health_url} to report healthy (timeout ${CHENGOS_HEALTH_TIMEOUT}s)..."
        if ! rel_wait_for_health "$health_url" "$CHENGOS_HEALTH_TIMEOUT"; then
            restore_previous_release "the new release did not become healthy within ${CHENGOS_HEALTH_TIMEOUT}s"
            return 1
        fi
        echo "Health check passed."
    else
        echo "Services were not running before the update; skipping the post-update health check."
    fi

    # The version record is written only now: a system whose update failed
    # health verification never claims to be on the new version.
    rel_write_installed_version "$VERSION_FILE" "$target_version"
    if [[ "$LOW_DISK_UPDATE" == "true" ]]; then
        rel_prune_backups "$ROOT_DIR" 1
    else
        rel_prune_backups "$ROOT_DIR" "$CHENGOS_BACKUP_KEEP"
    fi

    echo "Native package update completed: ${local_version:-unknown} -> ${target_version}"
}

# Restores the most recent eligible backup and validates it the same way an
# update validates a new release.
rollback_native_install() {
    require_release_lib || return 1

    local shared_dir hybrid_dir
    shared_dir="$(resolve_shared_dir)"
    hybrid_dir="$(resolve_hybrid_dir)"

    local current_version
    current_version="$(rel_read_installed_version "$VERSION_FILE" || true)"

    # A release that rewrote data irreversibly cannot be rolled back by moving
    # files: the previous binaries cannot read the migrated database.
    if ! rel_rollback_allowed "$shared_dir"; then
        echo "ERROR: release ${current_version:-unknown} declares an irreversible database migration." >&2
        rel_print_manual_recovery
        return 1
    fi

    local backup_dir
    if ! backup_dir="$(rel_latest_backup "$ROOT_DIR")"; then
        echo "ERROR: no rollback point available under $(rel_backup_root "$ROOT_DIR")." >&2
        echo "Backups are created by './chengos.sh update'; a system that has never been updated has nothing to roll back to." >&2
        return 1
    fi

    local previous_version
    previous_version="$(rel_backup_version "$backup_dir")"
    echo "Rolling back: ${current_version:-unknown} -> ${previous_version}"
    echo "Rollback point: ${backup_dir}"

    local was_running="false"
    [[ -f "${shared_dir}/runtime/cheng-api.pid" ]] && was_running="true"

    echo "Stopping services..."
    if ! bash "${hybrid_dir}/stop.sh"; then
        echo "ERROR: services could not be stopped; no files were restored." >&2
        return 1
    fi

    if ! rel_restore_package_state "$backup_dir" "$ROOT_DIR" "$shared_dir" "$hybrid_dir"; then
        echo "ERROR: rollback failed while restoring package files. The backup at ${backup_dir} is intact." >&2
        return 1
    fi

    if [[ "$was_running" == "true" ]]; then
        echo "Starting services on ${previous_version}..."
        if ! bash "${hybrid_dir}/start.sh" --with "$(compute_native_modules "$shared_dir")"; then
            echo "ERROR: the restored release failed to start. Inspect the logs and run './chengos.sh start'." >&2
            return 1
        fi
        local health_url
        health_url="$(resolve_health_url)"
        if ! rel_wait_for_health "$health_url" "$CHENGOS_HEALTH_TIMEOUT"; then
            echo "ERROR: the restored release did not become healthy within ${CHENGOS_HEALTH_TIMEOUT}s." >&2
            echo "Files were restored; investigate the service logs before retrying." >&2
            return 1
        fi
        echo "Health check passed."
    fi

    if [[ "$previous_version" != "unknown" ]]; then
        rel_write_installed_version "$VERSION_FILE" "$previous_version"
    fi
    # The consumed rollback point is removed so a second rollback walks further
    # back rather than restoring the same release again.
    rm -rf "$backup_dir"

    echo "Rollback completed: now on ${previous_version}."
}

uninstall_docker_install() {
    local docker_dir
    docker_dir="$(resolve_docker_dir)"
    cd "$docker_dir"
    if [[ ! -f docker-compose.yml ]]; then
        echo "Docker installation not found."
        return 0
    fi
    ensure_docker_compose

    local recorded_modules docker_services
    recorded_modules="$(read_installed_modules 2>/dev/null || echo "")"

    if [[ -n "$recorded_modules" ]]; then
        docker_services="$(modules_to_docker_services "$recorded_modules")"
        docker compose --env-file ../.env down $docker_services
    else
        docker compose --env-file ../.env down
    fi
    read -p "Remove ChengOS Docker volumes and persistent data? (y/n) [Default n]: " remove_data < /dev/tty
    if [[ "$remove_data" =~ ^[Yy]$ ]]; then
        docker compose --env-file ../.env down -v
    fi
    read -p "Remove ChengOS Docker images? (y/n) [Default n]: " remove_images < /dev/tty
    if [[ "$remove_images" =~ ^[Yy]$ ]]; then
        if [[ -n "$docker_services" ]]; then
            for svc in $docker_services; do
                docker compose --env-file ../.env config --images "$svc" 2>/dev/null | head -1 | xargs -r docker image rm 2>/dev/null || true
            done
        else
            docker compose --env-file ../.env config --images 2>/dev/null | sort -u | xargs -r docker image rm || true
        fi
    fi

    rm -f "$MODULES_FILE"
}

uninstall_native_install() {
    local hybrid_dir
    hybrid_dir="$(resolve_hybrid_dir)"
    if [[ ! -f "${hybrid_dir}/start.sh" ]]; then
        echo "Native installation not found."
        return 0
    fi
    echo "This removes package-owned binaries and static assets only. .env, logs, runtime data, skills, and workspaces are kept by default."
    read -p "Continue uninstalling native package files? (y/n) [Default n]: " confirm < /dev/tty
    [[ "$confirm" =~ ^[Yy]$ ]] || return 0
    bash "${hybrid_dir}/stop.sh" || true

    local recorded_modules
    recorded_modules="$(read_installed_modules 2>/dev/null || echo "api,ui,app")"

    # Always remove bin (contains cheng-api)
    rm -rf "${hybrid_dir}/bin"
    # Only remove ui/app if they were installed
    [[ ",$recorded_modules," == *",ui,"* ]] && rm -rf "${hybrid_dir}/ui"
    [[ ",$recorded_modules," == *",app,"* ]] && rm -rf "${hybrid_dir}/app"

    read -p "Also remove runtime data and logs? (y/n) [Default n]: " remove_data < /dev/tty
    if [[ "$remove_data" =~ ^[Yy]$ ]]; then
        rm -rf "${hybrid_dir}/runtime" "${hybrid_dir}/logs"
    fi

    rm -f "$MODULES_FILE"
}

# ── CLI Commands Execution ───────────────────────────────────────────────────

reset_login_credentials() {
    local install_mode shared_dir docker_dir target new_username new_email new_password confirm
    local reset_args=(reset-credentials)

    install_mode="$(detect_install_mode)"
    shared_dir="$(resolve_shared_dir)"
    docker_dir="$(resolve_docker_dir)"

    echo "${t[reset_title]}"
    echo ""
    read -r -p "${t[reset_target_prompt]}" target < /dev/tty
    read -r -p "${t[reset_username_prompt]}" new_username < /dev/tty
    read -r -p "${t[reset_email_prompt]}" new_email < /dev/tty
    read -r -s -p "${t[reset_password_prompt]}" new_password < /dev/tty
    echo ""
    if [[ -n "$new_password" ]]; then
        read -r -s -p "${t[reset_password_confirm]}" confirm < /dev/tty
        echo ""
        if [[ "$new_password" != "$confirm" ]]; then
            echo "${t[reset_password_mismatch]}" >&2
            return 1
        fi
    fi

    [[ -n "$target" ]] && reset_args+=(--user "$target")
    [[ -n "$new_username" ]] && reset_args+=(--username "$new_username")
    [[ -n "$new_email" ]] && reset_args+=(--email "$new_email")
    if [[ -n "$new_password" ]]; then
        reset_args+=(--password-stdin)
    else
        reset_args+=(--no-password)
    fi

    if [[ "$install_mode" == "docker" ]]; then
        ensure_docker_compose
        if [[ -n "$new_password" ]]; then
            printf '%s' "$new_password" | (cd "$docker_dir" && docker compose --env-file ../.env run --rm -T api "${reset_args[@]}")
        else
            (cd "$docker_dir" && docker compose --env-file ../.env run --rm -T api "${reset_args[@]}")
        fi
    else
        if [[ ! -x "${shared_dir}/bin/cheng-api" ]]; then
            echo "cheng-api binary not found: ${shared_dir}/bin/cheng-api" >&2
            return 1
        fi
        if [[ -f "${shared_dir}/.env" ]]; then
            # shellcheck disable=SC1090
            set -a; source "${shared_dir}/.env"; set +a
        fi
        if [[ -n "$new_password" ]]; then
            printf '%s' "$new_password" | (cd "$shared_dir" && "${shared_dir}/bin/cheng-api" "${reset_args[@]}")
        else
            (cd "$shared_dir" && "${shared_dir}/bin/cheng-api" "${reset_args[@]}")
        fi
    fi
}

if [[ $# -gt 0 ]]; then
    CMD="$1"
    shift
    
    MODE=""
    WITH_MODULES="api,ui,app,pg,redis,qdrant"
    DB_INSTALL_MODE="managed-process"
    UI_PORT=8080
    APP_PORT=5055
    WORKSPACE_ROOT=""
    WITH_INFRA_OPT="false"
    UPDATE_KIND="auto"
    FORCE_UPDATE="false"
    UPDATE_TARGET_VERSION=""
    SERVER_URL=""
    CLI_TARGET="local"
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --mode)
                MODE="$2"
                shift 2
                ;;
            --server-url)
                SERVER_URL="$2"
                shift 2
                ;;
            --target)
                CLI_TARGET="$2"
                shift 2
                ;;
            --with)
                WITH_MODULES="$2"
                shift 2
                ;;
            --db-install-mode)
                DB_INSTALL_MODE="$2"
                shift 2
                ;;
            --ui-port)
                UI_PORT="$2"
                shift 2
                ;;
            --app-port)
                APP_PORT="$2"
                shift 2
                ;;
            --workspace-root)
                WORKSPACE_ROOT="$2"
                shift 2
                ;;
            --with-infra)
                WITH_INFRA_OPT="true"
                shift
                ;;
            --scripts-only)
                UPDATE_KIND="scripts"
                shift
                ;;
            --package-only)
                UPDATE_KIND="package"
                shift
                ;;
            --force)
                FORCE_UPDATE="true"
                shift
                ;;
            --low)
                LOW_DISK_UPDATE="true"
                shift
                ;;
            --to)
                # Explicit exact release for update/rollback. Reinstall and
                # downgrade are deliberate acts, never the default direction.
                UPDATE_TARGET_VERSION="$2"
                shift 2
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    if [[ -n "$MODE" && "$MODE" != "native" && "$MODE" != "docker" ]]; then
        echo "Invalid mode: $MODE"
        exit 1
    fi
    MODE="$(detect_install_mode "$MODE")"

    case "$CMD" in
        install)
            echo "${t[install_start]}"
            
            enable_redis="false"
            enable_qdrant="false"
            enable_ui="false"
            enable_app="false"
            enable_cli="false"
            
            [[ "$WITH_MODULES" == *"redis"* ]] && enable_redis="true"
            [[ "$WITH_MODULES" == *"qdrant"* ]] && enable_qdrant="true"
            [[ "$WITH_MODULES" == *"ui"* ]] && enable_ui="true"
            [[ "$WITH_MODULES" == *"app"* ]] && enable_app="true"
            [[ "$WITH_MODULES" == *"cli"* ]] && enable_cli="true"

            # Check if we are in a Developer Workspace (source folders exist)
            if [[ "$MODE" == "docker" ]]; then
                echo "Docker mode selected. Skipping native binary/frontend asset preparation."
            elif [[ -d "${ROOT_DIR}/chengflow" && -d "${ROOT_DIR}/chengflow-ui" ]]; then
                echo "Developer workspace detected. Compiling from source..."
                
                # 1. Build Frontends
                if [[ "$enable_ui" == "true" ]]; then
                    echo "Building UI..."
                    cd "${ROOT_DIR}/chengflow-ui"
                    pnpm build:deploy || npm run build:deploy
                fi
                if [[ "$enable_app" == "true" ]]; then
                    echo "Building Chat App..."
                    cd "${ROOT_DIR}/chengflow-app"
                    pnpm build:deploy || npm run build:deploy
                fi
                
                # 2. Build backend
                echo "Building backend Cargo packages..."
                cd "${ROOT_DIR}/chengflow"
                CARGO_MODULES="-p cheng-api"
                [[ "$enable_cli" == "true" ]] && CARGO_MODULES="$CARGO_MODULES -p cheng-cli"
                cargo build --release $CARGO_MODULES

                # Copy binaries to shared/bin
                shared_dir="$(resolve_shared_dir)"
                mkdir -p "${shared_dir}/bin"
                copy_chengflow_binary "cheng-api" "cheng-api" "${shared_dir}/bin"
                if [[ "$enable_cli" == "true" ]]; then
                    copy_chengflow_binary "cheng" "cheng" "${shared_dir}/bin"
                fi

                # Sync shared resources from source to deploy directory
                if [[ -d "${ROOT_DIR}/chengflow/workflow-templates" ]]; then
                    echo "Syncing workflow-templates from source..."
                    rm -rf "${shared_dir:?}/workflow-templates"
                    cp -a "${ROOT_DIR}/chengflow/workflow-templates" "${shared_dir}/workflow-templates"
                fi
                if [[ -d "${ROOT_DIR}/chengflow/config" ]]; then
                    echo "Syncing config from source..."
                    mkdir -p "${shared_dir}/config"
                    cp -an "${ROOT_DIR}/chengflow/config/." "${shared_dir}/config/"
                fi
                if [[ -d "${ROOT_DIR}/chengflow/skills" ]]; then
                    echo "Syncing skills from source..."
                    mkdir -p "${shared_dir}/skills"
                    cp -a "${ROOT_DIR}/chengflow/skills/." "${shared_dir}/skills/"
                fi

                # Copy built frontend assets to shared directory
                if [[ "$enable_ui" == "true" && -d "${ROOT_DIR}/chengflow-ui/dist" ]]; then
                    echo "Copying UI build output..."
                    rm -rf "${shared_dir:?}/ui"
                    cp -a "${ROOT_DIR}/chengflow-ui/dist" "${shared_dir}/ui"
                fi
                if [[ "$enable_app" == "true" && -d "${ROOT_DIR}/chengflow-app/dist-app" ]]; then
                    echo "Copying App build output..."
                    rm -rf "${shared_dir:?}/app"
                    cp -a "${ROOT_DIR}/chengflow-app/dist-app" "${shared_dir}/app"
                fi
            else
                echo "Release bundle detected. Skipping source compilation."
                
                shared_dir="$(resolve_shared_dir)"

                # Check if required assets are missing (only for enabled modules)
                need_extract="false"
                [[ ! -f "${shared_dir}/bin/cheng-api" ]] && need_extract="true"
                [[ "$enable_cli" == "true" && ! -f "${shared_dir}/bin/cheng" ]] && need_extract="true"
                [[ "$enable_ui" == "true" && ! -d "${shared_dir}/ui" ]] && need_extract="true"
                [[ "$enable_app" == "true" && ! -d "${shared_dir}/app" ]] && need_extract="true"
                [[ ! -d "${shared_dir}/workflow-templates" ]] && need_extract="true"
                [[ ! -d "${shared_dir}/config" ]] && need_extract="true"
                if [[ "$need_extract" == "true" ]]; then
                    echo "Required binaries or frontend assets are missing in ${shared_dir}."
                    echo "Looking for local release package..."
                    LOCAL_TARBALL_FOUND=""
                    if LOCAL_TARBALL_FOUND="$(find_local_tarball)"; then
                        echo "Using local release package: ${LOCAL_TARBALL_FOUND}"
                        TEMP_TAR="$LOCAL_TARBALL_FOUND"
                    else
                        echo "No local package found. Downloading the latest pre-compiled release package from GitHub..."
                        REPO_URL="https://github.com/chengrouter/chengos"
                        RELEASE_TAG="$(curl -fsSLI -o /dev/null -w '%{url_effective}' "${REPO_URL}/releases/latest" 2>/dev/null | sed 's#.*/tag/##' || true)"
                        if [[ -n "$RELEASE_TAG" ]]; then
                            TARBALL_URL="${REPO_URL}/releases/download/${RELEASE_TAG}/chengos-full-linux-amd64-${RELEASE_TAG}.tar.gz"
                        else
                            TARBALL_URL="${REPO_URL}/releases/latest/download/chengos-full-linux-amd64.tar.gz"
                        fi
                        TEMP_TAR="/tmp/chengos_download_$$.tar.gz"
                        if ! curl -sSfL "$TARBALL_URL" -o "$TEMP_TAR"; then
                            echo "ERROR: Failed to download release from $TARBALL_URL."
                            echo "Please build the project locally or upload a valid Release asset."
                            echo "Or place the tarball in the same directory as chengos.sh."
                            exit 1
                        fi
                    fi
                    
                    echo "Extracting pre-compiled assets..."
                    TEMP_DIR="/tmp/chengos_extract_$$"
                    mkdir -p "$TEMP_DIR"
                    tar -xzf "$TEMP_TAR" -C "$TEMP_DIR" --strip-components=1
                    
                    # Copy bin, ui, app back to shared directory (only enabled modules)
                    mkdir -p "${shared_dir}/bin"
                    cp -a "${TEMP_DIR}/bin/." "${shared_dir}/bin/"
                    chmod +x "${shared_dir}/bin/"*
                    [[ "$enable_ui" == "true" ]] && cp -a "${TEMP_DIR}/ui/." "${shared_dir}/ui/"
                    [[ "$enable_app" == "true" ]] && cp -a "${TEMP_DIR}/app/." "${shared_dir}/app/"
                    
                    # Copy config and workflow-templates (shared resources, not module-gated)
                    [[ -d "${TEMP_DIR}/config" ]] && {
                        mkdir -p "${shared_dir}/config"
                        cp -a "${TEMP_DIR}/config/." "${shared_dir}/config/"
                    }
                    [[ -d "${TEMP_DIR}/workflow-templates" ]] && {
                        mkdir -p "${shared_dir}/workflow-templates"
                        cp -a "${TEMP_DIR}/workflow-templates/." "${shared_dir}/workflow-templates/"
                    }
                    
                    # Clean up — only remove temp tar if we downloaded it
                    [[ -z "$LOCAL_TARBALL_FOUND" ]] && rm -rf "$TEMP_TAR"
                    rm -rf "$TEMP_DIR"
                    echo "Pre-compiled assets successfully extracted."
                fi
            fi
            
            # 3. Setup configs & environments
            if [[ "$MODE" == "docker" ]]; then
                setup_docker_env "$enable_redis" "$enable_qdrant" "$UI_PORT" "$APP_PORT"
                docker compose pull || true
            else
                # 3a. Check & install bubblewrap (required for code_shell / code_python nodes)
                ensure_bubblewrap || echo "[!] bubblewrap unavailable — sandboxed code nodes will fail until it is installed"
                # 3b. Setup .env and systemd user session (XDG_RUNTIME_DIR / DBUS)
                setup_native_env "$DB_INSTALL_MODE" "$enable_redis" "$enable_qdrant" "$UI_PORT" "$APP_PORT" "$WORKSPACE_ROOT"
            fi
            write_install_metadata "$MODE"

            # Record installed modules for selective update/uninstall/restart
            installed_modules="api"
            [[ "$enable_redis" == "true" ]] && installed_modules="${installed_modules},redis"
            [[ "$enable_qdrant" == "true" ]] && installed_modules="${installed_modules},qdrant"
            [[ "$enable_ui" == "true" ]] && installed_modules="${installed_modules},ui"
            [[ "$enable_app" == "true" ]] && installed_modules="${installed_modules},app"
            [[ "$enable_cli" == "true" ]] && installed_modules="${installed_modules},cli"
            write_installed_modules "$installed_modules"

            # Ensure all binaries are executable
            shared_dir="$(resolve_shared_dir)"
            if [[ -d "${shared_dir}/bin" ]]; then
                chmod +x "${shared_dir}/bin/"* 2>/dev/null || true
            fi

            echo "${t[install_done]}"
            ;;
            
        start)
            echo "${t[starting]}"
            if [[ "$MODE" == "docker" ]]; then
                run_service_cmd start docker
            else
                # Load config to see what modules to launch
                shared_dir="$(resolve_shared_dir)"
                hybrid_dir="$(resolve_hybrid_dir)"
                cd "$shared_dir"
                if [[ -f .env ]]; then
                    # shellcheck disable=SC1090
                    set -a; source .env; set +a
                fi
                ensure_native_log_file_envs "$shared_dir"
                
                modules="$(compute_native_modules "$shared_dir")"
                
                run_service_cmd start native --with "$modules"
            fi
            ;;
            
        stop)
            echo "${t[stopping]}"
            run_service_cmd stop "$MODE" "$WITH_INFRA_OPT"
            ;;
            
        status)
            # Exit code mirrors the service verdict: 0 when the API is serving,
            # non-zero when it is not, so `status` is usable in a health probe.
            echo "${t[status_header]}"
            print_version_status "$MODE"
            status_rc=0
            run_service_cmd status "$MODE" || status_rc=$?
            exit "$status_rc"
            ;;

        version)
            if [[ "$RELEASE_LIB_LOADED" == "true" ]]; then
                rel_read_installed_version "$VERSION_FILE" 2>/dev/null || echo "unknown"
                echo ""
            else
                cat "$VERSION_FILE" 2>/dev/null || echo "unknown"
            fi
            ;;

        restart)
            echo "${t[restarting]}"
            if [[ "$MODE" == "docker" ]]; then
                echo "Stopping Docker services..."
                run_service_cmd stop docker false || true
                echo "Starting Docker services..."
                run_service_cmd start docker
            else
                shared_dir="$(resolve_shared_dir)"
                hybrid_dir="$(resolve_hybrid_dir)"
                modules="$(compute_native_modules "$shared_dir")"
                ensure_native_log_file_envs "$shared_dir"
                echo "Stopping native services..."
                bash "${hybrid_dir}/stop.sh" || true
                echo "Starting native services with modules: ${modules}"
                (cd "$hybrid_dir" && bash start.sh --with "$modules")
            fi
            echo "Restart completed."
            ;;
            
        uninstall)
            echo "${t[uninstall_start]}"
            if [[ "$MODE" == "native" ]]; then
                uninstall_native_install
            else
                uninstall_docker_install
            fi
            echo "${t[uninstall_done]}"
            ;;
            
        update)
            echo "${t[update_start]}"
            if [[ "$MODE" == "docker" ]]; then
                if [[ "$UPDATE_KIND" == "scripts" ]]; then
                    update_script_files
                elif [[ "$UPDATE_KIND" == "package" ]]; then
                    update_docker_install
                else
                    update_script_files
                    update_docker_install
                fi
            else
                if [[ "$UPDATE_KIND" == "scripts" ]]; then
                    update_script_files
                elif [[ "$UPDATE_KIND" == "package" ]]; then
                    update_native_install
                else
                    update_script_files
                    update_native_install
                fi
            fi
            echo "${t[update_done]}"
            ;;

        rollback)
            echo "${t[rollback_start]}"
            if [[ "$MODE" == "docker" ]]; then
                rollback_docker_install
            else
                rollback_native_install
            fi
            echo "${t[rollback_done]}"
            ;;

        install-cli)
            if [[ "$CLI_TARGET" != "local" && "$CLI_TARGET" != "remote" ]]; then
                echo "Invalid --target: $CLI_TARGET (expected 'local' or 'remote')"
                exit 1
            fi
            echo "Installing cheng CLI (target: ${CLI_TARGET})..."
            install_cli_standalone "$CLI_TARGET" "$SERVER_URL"
            ;;

        reset-credentials|reset-admin)
            reset_login_credentials
            ;;
            
        *)
            echo "Unknown command: $CMD"
            exit 1
            ;;
    esac
    exit 0
fi

# ── Interactive TUI Menu ──────────────────────────────────────────────────────

while true; do
    clear
    printf "${t[banner]}\n"
    echo "  ${t[menu_install]}"
    echo "  ${t[menu_start]}"
    echo "  ${t[menu_stop]}"
    echo "  ${t[menu_restart]}"
    echo "  ${t[menu_update]}"
    echo "  ${t[menu_cli]}"
    echo "  ${t[menu_status]}"
    echo "  ${t[menu_link]}"
    echo "  ${t[menu_uninstall]}"
    echo "  ${t[menu_lang]}"
    echo "  ${t[menu_exit]}"
    echo "  ${t[menu_reset_credentials]}"
    echo "  ${t[menu_rollback]}"
    echo "==========================================="
    read -p "${t[select_op]}" op < /dev/tty
    
    case "$op" in
        1)
            clear
            printf "${t[mode_select]}\n"
            read -p "${t[mode_prompt]}" mode_choice < /dev/tty
            install_mode="native"
            [[ "$mode_choice" == "2" ]] && install_mode="docker"
            
            db_mode="managed-process"
            if [[ "$install_mode" == "native" ]]; then
                echo ""
                echo "${t[db_mode_select]}"
                echo "${t[db_mode_managed]}"
                echo "${t[db_mode_system]}"
                read -p "${t[db_mode_prompt]}" db_choice < /dev/tty
                [[ "$db_choice" == "2" ]] && db_mode="system-service"
            fi
            
            clear
            printf "${t[install_config]}\n"
            read -p "${t[config_prompt]}" config_choice < /dev/tty
            
            enable_redis="false"
            enable_qdrant="false"
            enable_ui="true"
            enable_app="true"
            enable_cli="true"
            
            if [[ "$config_choice" == "2" ]]; then
                enable_redis="false"
                enable_qdrant="false"
                enable_ui="true"
                enable_app="false"
                enable_cli="false"
            elif [[ "$config_choice" == "3" ]]; then
                read -p "${t[prompt_redis]}" redis_yn < /dev/tty
                [[ "$redis_yn" =~ ^[Yy]$ ]] && enable_redis="true"
                
                read -p "${t[prompt_qdrant]}" qdrant_yn < /dev/tty
                [[ "$qdrant_yn" =~ ^[Yy]$ ]] && enable_qdrant="true"
                
                read -p "${t[prompt_ui]}" ui_yn < /dev/tty
                [[ "$ui_yn" =~ ^[Nn]$ ]] && enable_ui="false"
                
                read -p "${t[prompt_app]}" app_yn < /dev/tty
                [[ "$app_yn" =~ ^[Nn]$ ]] && enable_app="false"
                
                read -p "${t[prompt_cli]}" cli_yn < /dev/tty
                [[ "$cli_yn" =~ ^[Nn]$ ]] && enable_cli="false"
            else
                enable_redis="true"
                enable_qdrant="true"
                enable_ui="true"
                enable_app="true"
                enable_cli="true"
            fi
            
            read -p "${t[prompt_ui_port]}" ui_p < /dev/tty
            ui_port="${ui_p:-8080}"
            
            read -p "${t[prompt_app_port]}" app_p < /dev/tty
            app_port="${app_p:-5055}"

            workspace_root=""
            if [[ "$install_mode" == "native" ]]; then
                read -p "${t[prompt_workspace_root]}" workspace_root < /dev/tty
            fi

            modules_list="api"
            [[ "$enable_redis" == "true" ]] && modules_list="${modules_list},redis"
            [[ "$enable_qdrant" == "true" ]] && modules_list="${modules_list},qdrant"
            [[ "$enable_ui" == "true" ]] && modules_list="${modules_list},ui"
            [[ "$enable_app" == "true" ]] && modules_list="${modules_list},app"
            [[ "$enable_cli" == "true" ]] && modules_list="${modules_list},cli"
            
            echo ""
            install_args=(install --mode "$install_mode" --with "$modules_list" --db-install-mode "$db_mode" --ui-port "$ui_port" --app-port "$app_port")
            [[ -n "$workspace_root" ]] && install_args+=(--workspace-root "$workspace_root")
            bash "$0" "${install_args[@]}"
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        2)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" start --mode "$install_mode"
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        3)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            read -p "${t[prompt_stop_db]}" clean_db < /dev/tty
            if [[ "$clean_db" =~ ^[Yy]$ ]]; then
                bash "$0" stop --mode "$install_mode" --with-infra
            else
                bash "$0" stop --mode "$install_mode"
            fi
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        4)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" restart --mode "$install_mode"
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;

        5)
            clear
            install_mode="$(detect_install_mode)"
            echo "${t[update_type_select]}"
            echo "${t[update_type_scripts]}"
            echo "${t[update_type_package]}"
            echo "${t[update_type_both]}"
            echo "${t[update_type_force]}"
            echo "${t[update_type_low]}"
            read -p "${t[update_type_prompt]}" update_choice < /dev/tty
            update_flag=""
            [[ "$update_choice" == "1" ]] && update_flag="--scripts-only"
            [[ "$update_choice" == "2" ]] && update_flag="--package-only"
            [[ "$update_choice" == "4" ]] && update_flag="--package-only --force"
            [[ "$update_choice" == "5" ]] && update_flag="--low"
            echo ""
            if [[ -n "$update_flag" ]]; then
                bash "$0" update --mode "$install_mode" $update_flag
            else
                bash "$0" update --mode "$install_mode"
            fi
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        6)
            clear
            echo "${t[cli_install_title]}"
            echo "${t[cli_install_local]}"
            echo "${t[cli_install_remote]}"
            read -p "${t[cli_install_prompt]}" cli_target_choice < /dev/tty
            cli_target="local"
            [[ "$cli_target_choice" == "2" ]] && cli_target="remote"

            server_url_input=""
            if [[ "$cli_target" == "local" ]]; then
                shared_dir="$(resolve_shared_dir)"
                default_api_port="3000"
                if [[ -f "${shared_dir}/.env" ]]; then
                    # shellcheck disable=SC1090
                    set -a; source "${shared_dir}/.env"; set +a
                    [[ -n "${API_PORT:-}" ]] && default_api_port="$API_PORT"
                fi
                read -p "$(printf "${t[cli_api_url_prompt]}" "http://127.0.0.1:${default_api_port}")" server_url_input < /dev/tty
                server_url_input="${server_url_input:-http://127.0.0.1:${default_api_port}}"
            else
                read -p "${t[cli_remote_url_prompt]}" server_url_input < /dev/tty
            fi

            echo ""
            bash "$0" install-cli --target "$cli_target" --server-url "$server_url_input"
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;

        7)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" status --mode "$install_mode"
            echo ""
            echo "${t[cli_status_header]}"
            shared_dir="$(resolve_shared_dir)"
            cli_binary="${shared_dir}/bin/cheng"
            if [[ -f "$cli_binary" ]]; then
                printf "${t[cli_binary_installed]}\n" "$cli_binary"
            elif command -v cheng >/dev/null 2>&1; then
                printf "${t[cli_binary_path]}\n" "$(command -v cheng)"
            else
                echo "${t[cli_binary_notfound]}"
            fi
            cli_config="${HOME}/.config/cheng/config.json"
            if [[ -f "$cli_config" ]]; then
                printf "${t[cli_config_found]}\n" "$cli_config"
            else
                echo "${t[cli_config_notfound]}"
            fi
            cli_pids="$(pgrep -x cheng 2>/dev/null || true)"
            if [[ -n "$cli_pids" ]]; then
                cli_count="$(printf '%s\n' "$cli_pids" | wc -l)"
                printf "${t[cli_running]}\n" "$cli_count"
                echo "    PID: $(echo "$cli_pids" | tr '\n' ' ')"
            else
                echo "${t[cli_not_running]}"
            fi
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        8)
            clear
            echo "${t[symlink_installing]}"
            success=true
            if ! ${SUDO} ln -sf "${ROOT_DIR}/chengos.sh" /usr/local/bin/chengos 2>/dev/null; then
                success=false
            fi
            
            shared_dir="$(resolve_shared_dir)"
            
            if [[ -f "${shared_dir}/bin/cheng" ]]; then
                echo "${t[symlink_creating_cheng]}"
                chmod +x "${shared_dir}/bin/cheng" 2>/dev/null || true
                ${SUDO} rm -f /usr/local/bin/cheng 2>/dev/null || true
                if ! ${SUDO} tee /usr/local/bin/cheng >/dev/null <<EOF
#!/usr/bin/env bash
# Load CHENG_CLI_LOG_FILE from .env so CLI logs go into the installation logs dir
if [[ -z "\${CHENG_CLI_LOG_FILE:-}" && -f "${shared_dir}/.env" ]]; then
    while IFS='=' read -r _env_key _env_val; do
        if [[ "\$_env_key" == "CHENG_CLI_LOG_FILE" ]]; then
            export CHENG_CLI_LOG_FILE="\$_env_val"
            break
        fi
    done < "${shared_dir}/.env"
fi
# Set CHENG_LANG from the installation language preference if not already set
if [[ -z "\${CHENG_LANG:-}" && -f "${ROOT_DIR}/.chengos_lang" ]]; then
    export CHENG_LANG="$(cat "${ROOT_DIR}/.chengos_lang" 2>/dev/null)"
fi
if [[ "\${1:-}" == "chat" || "\${1:-}" == "help" || "\${1:-}" == "-h" || "\${1:-}" == "--help" || "\${1:-}" == "-V" || "\${1:-}" == "--version" ]]; then
    exec "${shared_dir}/bin/cheng" "\$@"
else
    exec "${shared_dir}/bin/cheng" chat --auth-storage file "\$@"
fi
EOF
                then
                    success=false
                fi
                ${SUDO} chmod +x /usr/local/bin/cheng 2>/dev/null || success=false
            fi
            
            if [[ "$success" == "true" ]]; then
                printf "${t[symlink_done]}\n" "${ROOT_DIR}/chengos.sh"
                if [[ -f "${shared_dir}/bin/cheng" ]]; then
                    echo "${t[symlink_cheng_done]}"
                    echo "${t[symlink_cheng_hint]}"
                fi
            else
                echo "${t[symlink_fail]}"
            fi
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        9)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" uninstall --mode "$install_mode"
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        10)
            clear
            set_language
            exec bash "$0"
            ;;

        11)
            echo "${t[exit_msg]}"
            exit 0
            ;;

        12)
            clear
            if ! reset_login_credentials; then
                echo ""
                echo "${t[reset_failed]}" >&2
            fi
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;
            
        13)
            clear
            install_mode="$(detect_install_mode)"
            print_version_status "$install_mode"
            read -p "${t[rollback_confirm]}" rollback_yn < /dev/tty
            if [[ "$rollback_yn" =~ ^[Yy]$ ]]; then
                echo ""
                bash "$0" rollback --mode "$install_mode"
            else
                echo "${t[rollback_cancelled]}"
            fi
            read -p "${t[press_enter]}" dummy < /dev/tty
            ;;

        *)
            printf "${t[invalid_op]}\n" "$op"
            sleep 1
            ;;
    esac
done
