#!/usr/bin/env bash
set -euo pipefail

# Root workspace directory
SCRIPT_PATH="${BASH_SOURCE[0]}"
SCRIPT_DIR_FROM_CALL="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
if [[ -L "$SCRIPT_PATH" ]]; then
    REAL_SCRIPT_PATH="$(readlink -f "$SCRIPT_PATH")"
else
    REAL_SCRIPT_PATH="$SCRIPT_PATH"
fi
REAL_SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT_PATH")" && pwd)"

if [[ -d "${SCRIPT_DIR_FROM_CALL}/deploy/hybrid" || -d "${SCRIPT_DIR_FROM_CALL}/deploy/docker" ]]; then
    ROOT_DIR="$SCRIPT_DIR_FROM_CALL"
elif [[ "$REAL_SCRIPT_DIR" == */deploy/hybrid && -d "${REAL_SCRIPT_DIR}/../docker" ]]; then
    ROOT_DIR="$(cd "${REAL_SCRIPT_DIR}/../.." && pwd)"
else
    ROOT_DIR="$REAL_SCRIPT_DIR"
fi
cd "$ROOT_DIR"

# Determine sudo prefix (skip when running as root)
if [[ "$(id -u)" -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

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
    
    echo "Downloading the latest ChengOS release package..."
    REPO_URL="https://github.com/chengrouter/chengos"
    TARBALL_URL="${REPO_URL}/releases/latest/download/chengos-full-linux-amd64.tar.gz"
    RELEASE_TAG="$(curl -fsSLI -o /dev/null -w '%{url_effective}' "${REPO_URL}/releases/latest" 2>/dev/null | sed 's#.*/tag/##' || true)"
    
    if ! curl -sSfL "$TARBALL_URL" -o chengos.tar.gz; then
        echo "ERROR: Failed to download release from $TARBALL_URL."
        echo "Please make sure you have created a Release and uploaded the release asset."
        exit 1
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
DEFAULT_LANG="zh"

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
    t[menu_update]="2) 更新模块 (Update)"
    t[menu_uninstall]="3) 卸载/停用模块 (Uninstall)"
    t[menu_status]="4) 查看服务状态 (Status)"
    t[menu_start]="5) 启动服务 (Start)"
    t[menu_stop]="6) 停止服务 (Stop)"
    t[menu_restart]="7) 重启服务 (Restart)"
    t[menu_link]="8) 安装系统命令 (Install Command Shortcuts)"
    t[menu_lang]="9) 切换语言 (Switch Language)"
    t[menu_exit]="10) 退出 (Exit)"
    t[select_op]="请选择操作 [1-10]: "
    t[mode_select]="请选择安装模式:\n  1) 二进制原生安装 (Native Host)\n  2) Docker 容器化安装 (Docker)"
    t[mode_prompt]="选择 [1-2] (默认 1): "
    t[install_config]="请选择安装配置:\n  1) 全量安装 (默认)\n  2) 最小安装 (Postgres + API + UI)\n  3) 自定义选择"
    t[config_prompt]="选择 [1-3] (默认 1): "
    t[prompt_redis]="是否启用 Redis? (y/n) [默认 n]: "
    t[prompt_qdrant]="是否启用 Qdrant (RAG 向量库)? (y/n) [默认 n]: "
    t[prompt_ui]="是否启用 cheng-ui (管理后台)? (y/n) [默认 y]: "
    t[prompt_app]="是否启用 cheng-app (聊天窗口)? (y/n) [默认 y]: "
    t[prompt_cli]="是否启用 cheng-cli (终端工具)? (y/n) [默认 y]: "
    t[install_start]="开始执行安装/初始化流程..."
    t[install_done]="安装/初始化完成！"
    t[update_start]="开始执行更新流程..."
    t[update_done]="更新完成！"
    t[uninstall_start]="开始执行卸载/停用流程..."
    t[uninstall_done]="卸载完成！"
    t[stopping]="正在停止所有服务..."
    t[starting]="正在启动服务..."
    t[restarting]="正在重启服务..."
    t[status_header]="正在查询服务状态..."
    t[symlink_done]="已安装系统命令: /usr/local/bin/chengos -> %s"
    t[symlink_fail]="安装系统命令失败，请确认是否拥有 sudo 权限。"
else
    t[banner]="===========================================\n       ChengOS Unified Management Utility\n==========================================="
    t[menu_install]="1) Install/Initialize Modules"
    t[menu_update]="2) Update Modules"
    t[menu_uninstall]="3) Uninstall/Stop Modules"
    t[menu_status]="4) Service Status"
    t[menu_start]="5) Start Services"
    t[menu_stop]="6) Stop Services"
    t[menu_restart]="7) Restart Services"
    t[menu_link]="8) Install Command Shortcuts"
    t[menu_lang]="9) Switch Language"
    t[menu_exit]="10) Exit"
    t[select_op]="Select option [1-10]: "
    t[mode_select]="Select Installation Mode:\n  1) Native Host Binary\n  2) Docker Containers"
    t[mode_prompt]="Choose [1-2] (Default 1): "
    t[install_config]="Select Modules Configuration:\n  1) Full Installation (Default)\n  2) Minimal (Postgres + API + UI)\n  3) Custom Selection"
    t[config_prompt]="Choose [1-3] (Default 1): "
    t[prompt_redis]="Enable Redis? (y/n) [Default n]: "
    t[prompt_qdrant]="Enable Qdrant (Vector DB)? (y/n) [Default n]: "
    t[prompt_ui]="Enable cheng-ui (Management UI)? (y/n) [Default y]: "
    t[prompt_app]="Enable cheng-app (Chat App)? (y/n) [Default y]: "
    t[prompt_cli]="Enable cheng-cli (CLI tool)? (y/n) [Default y]: "
    t[install_start]="Starting installation/initialization process..."
    t[install_done]="Installation/Initialization completed successfully!"
    t[update_start]="Starting update process..."
    t[update_done]="Update completed!"
    t[uninstall_start]="Starting uninstall/teardown process..."
    t[uninstall_done]="Uninstall completed!"
    t[stopping]="Stopping all services..."
    t[starting]="Starting services..."
    t[restarting]="Restarting services..."
    t[status_header]="Checking services status..."
    t[symlink_done]="Installed command shortcut: /usr/local/bin/chengos -> %s"
    t[symlink_fail]="Failed to install command shortcuts. Please make sure you have sudo rights."
fi

# ── Utility Helpers ──────────────────────────────────────────────────────────

resolve_hybrid_dir() {
    if [[ -f "${ROOT_DIR}/start.sh" && -f "${ROOT_DIR}/generate-env.sh" ]]; then
        printf '%s\n' "$ROOT_DIR"
    elif [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
        printf '%s\n' "${ROOT_DIR}/deploy/hybrid"
    else
        printf '%s\n' "$ROOT_DIR"
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

detect_install_mode() {
    local explicit_mode="${1:-}"
    if [[ "$explicit_mode" == "native" || "$explicit_mode" == "docker" ]]; then
        printf '%s\n' "$explicit_mode"
        return 0
    fi

    if read_install_metadata; then
        return 0
    fi

    local hybrid_dir docker_dir
    hybrid_dir="$(resolve_hybrid_dir)"
    docker_dir="$(resolve_docker_dir)"

    if [[ -f "${docker_dir}/.env" && ! -f "${hybrid_dir}/.env" ]]; then
        printf 'docker\n'
    elif [[ -f "${hybrid_dir}/.env" ]]; then
        printf 'native\n'
    elif [[ -f "${docker_dir}/docker-compose.yml" && ! -f "${hybrid_dir}/start.sh" ]]; then
        printf 'docker\n'
    else
        printf 'native\n'
    fi
}

ensure_docker_compose() {
    command -v docker >/dev/null 2>&1 || { echo "Missing command: docker" >&2; exit 1; }
    docker compose version >/dev/null 2>&1 || { echo "docker compose plugin is required" >&2; exit 1; }
}

compute_native_modules() {
    local hybrid_dir="$1"
    local modules="api"
    [[ -d "${hybrid_dir}/ui" && "$(ls -A "${hybrid_dir}/ui" 2>/dev/null)" ]] && modules="${modules},ui"
    [[ -d "${hybrid_dir}/app" && "$(ls -A "${hybrid_dir}/app" 2>/dev/null)" ]] && modules="${modules},app"
    printf '%s\n' "$modules"
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

# Run sub-command in Docker or Native
run_service_cmd() {
    local cmd="$1" # start, stop, status
    local mode="${2:-native}"
    local with_infra="${3:-false}"

    if [[ "$mode" == "docker" ]]; then
        local docker_dir
        docker_dir="$(resolve_docker_dir)"
        
        cd "$docker_dir"
        if [[ "$cmd" == "start" ]]; then
            [[ -f .env ]] || bash generate-env.sh
            if [[ -f start.sh ]]; then
                bash start.sh
            else
                ensure_docker_compose
                docker compose up -d
            fi
        elif [[ "$cmd" == "stop" ]]; then
            ensure_docker_compose
            if [[ "$with_infra" == "true" ]]; then
                docker compose down -v
            else
                docker compose down
            fi
        elif [[ "$cmd" == "status" ]]; then
            ensure_docker_compose
            docker compose ps
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

    local hybrid_dir
    hybrid_dir="$(resolve_hybrid_dir)"

    cd "$hybrid_dir"
    export DB_INSTALL_MODE="$db_mode"
    export ENABLE_REDIS="$enable_redis"
    export ENABLE_QDRANT="$enable_qdrant"
    export UI_PORT="$ui_port"
    export APP_PORT="$app_port"

    if [[ -f .env ]]; then
        echo "Using existing environment configuration: ${hybrid_dir}/.env"
    else
        echo "Generating environment configuration (.env)..."
        bash generate-env.sh
    fi
}

# Setup env for docker
setup_docker_env() {
    local enable_redis="$1"
    local enable_qdrant="$2"
    local ui_port="$3"
    local app_port="$4"

    local docker_dir
    docker_dir="$(resolve_docker_dir)"

    cd "$docker_dir"
    if [[ -f .env ]]; then
        echo "Using existing Docker environment configuration: ${docker_dir}/.env"
    else
        bash generate-env.sh
        perl -0pi -e "s/^UI_PORT=.*/UI_PORT=${ui_port}/m" .env || true
        perl -0pi -e "s/^APP_PORT=.*/APP_PORT=${app_port}/m" .env || true
    fi
}

update_docker_install() {
    local docker_dir
    docker_dir="$(resolve_docker_dir)"
    cd "$docker_dir"
    ensure_docker_compose
    [[ -f .env ]] || bash generate-env.sh
    if [[ -f upgrade.sh ]]; then
        bash upgrade.sh
    else
        docker compose pull
        docker compose up -d
    fi
}

update_native_install() {
    local hybrid_dir latest_tag local_version
    hybrid_dir="$(resolve_hybrid_dir)"
    cd "$hybrid_dir"
    [[ -f .env ]] || bash generate-env.sh

    if [[ -d "${ROOT_DIR}/.git" ]]; then
        git -C "$ROOT_DIR" pull
        return 0
    fi

    local_version=""
    [[ -f "$VERSION_FILE" ]] && local_version="$(tr -d '[:space:]' < "$VERSION_FILE")"
    latest_tag="$(curl -fsSLI -o /dev/null -w '%{url_effective}' https://github.com/chengrouter/chengos/releases/latest 2>/dev/null | sed 's#.*/tag/##')"
    if [[ -n "$local_version" && -n "$latest_tag" && "$local_version" == "$latest_tag" ]]; then
        echo "Native package is already current (${local_version})."
        return 0
    fi

    local temp_tar temp_dir was_running
    temp_tar="/tmp/chengos_update_$$.tar.gz"
    temp_dir="/tmp/chengos_update_$$"
    was_running="false"
    [[ -f "${hybrid_dir}/runtime/cheng-api.pid" ]] && was_running="true"

    curl -fsSL "https://github.com/chengrouter/chengos/releases/latest/download/chengos-full-linux-amd64.tar.gz" -o "$temp_tar"
    mkdir -p "$temp_dir"
    tar -xzf "$temp_tar" -C "$temp_dir" --strip-components=1

    bash "${hybrid_dir}/stop.sh" || true
    for item in bin ui app chengos.sh start.sh stop.sh status.sh generate-env.sh .env.example; do
        [[ -e "${temp_dir}/${item}" ]] || continue
        rm -rf "${hybrid_dir:?}/${item}"
        cp -a "${temp_dir}/${item}" "${hybrid_dir}/${item}"
    done
    chmod +x "${hybrid_dir}/"*.sh "${hybrid_dir}/bin/"* 2>/dev/null || true
    [[ -n "$latest_tag" ]] && printf '%s\n' "$latest_tag" > "$VERSION_FILE"
    rm -rf "$temp_tar" "$temp_dir"
    [[ "$was_running" == "true" ]] && bash "${hybrid_dir}/start.sh"
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
    docker compose down
    read -p "Remove ChengOS Docker volumes and persistent data? (y/n) [Default n]: " remove_data < /dev/tty
    if [[ "$remove_data" =~ ^[Yy]$ ]]; then
        docker compose down -v
    fi
    read -p "Remove ChengOS Docker images? (y/n) [Default n]: " remove_images < /dev/tty
    if [[ "$remove_images" =~ ^[Yy]$ ]]; then
        docker compose --env-file .env config --images 2>/dev/null | sort -u | xargs -r docker image rm || true
    fi
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
    rm -rf "${hybrid_dir}/bin" "${hybrid_dir}/ui" "${hybrid_dir}/app"
    read -p "Also remove runtime data and logs? (y/n) [Default n]: " remove_data < /dev/tty
    if [[ "$remove_data" =~ ^[Yy]$ ]]; then
        rm -rf "${hybrid_dir}/runtime" "${hybrid_dir}/logs"
    fi
}

# ── CLI Commands Execution ───────────────────────────────────────────────────

if [[ $# -gt 0 ]]; then
    CMD="$1"
    shift
    
    MODE=""
    WITH_MODULES="api,ui,app,pg,redis,qdrant"
    DB_INSTALL_MODE="managed-process"
    UI_PORT=8080
    APP_PORT=5055
    WITH_INFRA_OPT="false"
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --mode)
                MODE="$2"
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
            --with-infra)
                WITH_INFRA_OPT="true"
                shift
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

                # Copy binaries to hybrid/bin
                hybrid_dir="$(resolve_hybrid_dir)"
                mkdir -p "${hybrid_dir}/bin"
                copy_chengflow_binary "cheng-api" "cheng-api" "${hybrid_dir}/bin"
                if [[ "$enable_cli" == "true" ]]; then
                    copy_chengflow_binary "cheng" "cheng" "${hybrid_dir}/bin"
                fi
            else
                echo "Release bundle detected. Skipping source compilation."
                
                hybrid_dir="$(resolve_hybrid_dir)"

                # Check if cheng-api binary or frontend static folders are missing
                if [[ ! -f "${hybrid_dir}/bin/cheng-api" || ! -d "${hybrid_dir}/ui" || ! -d "${hybrid_dir}/app" ]]; then
                    echo "Required binaries or frontend assets are missing in ${hybrid_dir}."
                    echo "Downloading the latest pre-compiled release package from GitHub..."
                    
                    REPO_URL="https://github.com/chengrouter/chengos"
                    TARBALL_URL="${REPO_URL}/releases/latest/download/chengos-full-linux-amd64.tar.gz"
                    
                    TEMP_TAR="/tmp/chengos_download_$$.tar.gz"
                    if ! curl -sSfL "$TARBALL_URL" -o "$TEMP_TAR"; then
                        echo "ERROR: Failed to download release from $TARBALL_URL."
                        echo "Please build the project locally or upload a valid Release asset."
                        exit 1
                    fi
                    
                    echo "Extracting pre-compiled assets..."
                    TEMP_DIR="/tmp/chengos_extract_$$"
                    mkdir -p "$TEMP_DIR"
                    tar -xzf "$TEMP_TAR" -C "$TEMP_DIR" --strip-components=1
                    
                    # Copy bin, ui, app back to hybrid directory
                    mkdir -p "${hybrid_dir}/bin"
                    cp -a "${TEMP_DIR}/bin/." "${hybrid_dir}/bin/"
                    chmod +x "${hybrid_dir}/bin/"*
                    cp -a "${TEMP_DIR}/ui/." "${hybrid_dir}/ui/"
                    cp -a "${TEMP_DIR}/app/." "${hybrid_dir}/app/"
                    
                    # Clean up
                    rm -rf "$TEMP_TAR" "$TEMP_DIR"
                    echo "Pre-compiled assets successfully downloaded and extracted."
                fi
            fi
            
            # 3. Setup configs & environments
            if [[ "$MODE" == "docker" ]]; then
                setup_docker_env "$enable_redis" "$enable_qdrant" "$UI_PORT" "$APP_PORT"
                docker compose pull || true
            else
                setup_native_env "$DB_INSTALL_MODE" "$enable_redis" "$enable_qdrant" "$UI_PORT" "$APP_PORT"
            fi
            write_install_metadata "$MODE"

            # Ensure all binaries are executable
            hybrid_dir="$(resolve_hybrid_dir)"
            if [[ -d "${hybrid_dir}/bin" ]]; then
                chmod +x "${hybrid_dir}/bin/"* 2>/dev/null || true
            fi

            echo "${t[install_done]}"
            ;;
            
        start)
            echo "${t[starting]}"
            if [[ "$MODE" == "docker" ]]; then
                run_service_cmd start docker
            else
                # Load config to see what modules to launch
                hybrid_dir="$(resolve_hybrid_dir)"
                cd "$hybrid_dir"
                if [[ -f .env ]]; then
                    # shellcheck disable=SC1090
                    set -a; source .env; set +a
                fi
                
                modules="$(compute_native_modules "$hybrid_dir")"
                
                run_service_cmd start native --with "$modules"
            fi
            ;;
            
        stop)
            echo "${t[stopping]}"
            run_service_cmd stop "$MODE" "$WITH_INFRA_OPT"
            ;;
            
        status)
            echo "${t[status_header]}"
            run_service_cmd status "$MODE"
            ;;

        restart)
            echo "${t[restarting]}"
            if [[ "$MODE" == "docker" ]]; then
                run_service_cmd stop docker false
                run_service_cmd start docker
            else
                hybrid_dir="$(resolve_hybrid_dir)"
                modules="$(compute_native_modules "$hybrid_dir")"
                run_service_cmd stop native false
                run_service_cmd start native --with "$modules"
            fi
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
                update_docker_install
            else
                update_native_install
            fi
            echo "${t[update_done]}"
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
    echo "  ${t[menu_update]}"
    echo "  ${t[menu_uninstall]}"
    echo "  ${t[menu_status]}"
    echo "  ${t[menu_start]}"
    echo "  ${t[menu_stop]}"
    echo "  ${t[menu_restart]}"
    echo "  ${t[menu_link]}"
    echo "  ${t[menu_lang]}"
    echo "  ${t[menu_exit]}"
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
                echo "Select Database Installation Mode:"
                echo "  1) Sandboxed Local Process (managed-process) - No Root Required (Default)"
                echo "  2) System Wide Service (system-service) - Requires Sudo"
                read -p "Choose [1-2] (Default 1): " db_choice < /dev/tty
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
            
            read -p "Select UI port (Default 8080): " ui_p < /dev/tty
            ui_port="${ui_p:-8080}"
            
            read -p "Select App port (Default 5055): " app_p < /dev/tty
            app_port="${app_p:-5055}"

            modules_list="api"
            [[ "$enable_redis" == "true" ]] && modules_list="${modules_list},redis"
            [[ "$enable_qdrant" == "true" ]] && modules_list="${modules_list},qdrant"
            [[ "$enable_ui" == "true" ]] && modules_list="${modules_list},ui"
            [[ "$enable_app" == "true" ]] && modules_list="${modules_list},app"
            [[ "$enable_cli" == "true" ]] && modules_list="${modules_list},cli"
            
            echo ""
            bash "$0" install --mode "$install_mode" --with "$modules_list" --db-install-mode "$db_mode" --ui-port "$ui_port" --app-port "$app_port"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        2)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" update --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        3)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" uninstall --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        4)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" status --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        5)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" start --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        6)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            read -p "Do you also want to stop/delete database services? (y/n) [Default n]: " clean_db < /dev/tty
            if [[ "$clean_db" =~ ^[Yy]$ ]]; then
                bash "$0" stop --mode "$install_mode" --with-infra
            else
                bash "$0" stop --mode "$install_mode"
            fi
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        7)
            clear
            install_mode="$(detect_install_mode)"
            echo ""
            bash "$0" restart --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;

        8)
            clear
            echo "Installing system command shortcut for chengos..."
            success=true
            if ! ${SUDO} ln -sf "${ROOT_DIR}/chengos.sh" /usr/local/bin/chengos 2>/dev/null; then
                success=false
            fi
            
            hybrid_dir="$(resolve_hybrid_dir)"
            
            if [[ -f "${hybrid_dir}/bin/cheng" ]]; then
                echo "Creating system-wide launcher for cheng..."
                chmod +x "${hybrid_dir}/bin/cheng" 2>/dev/null || true
                ${SUDO} rm -f /usr/local/bin/cheng 2>/dev/null || true
                if ! ${SUDO} tee /usr/local/bin/cheng >/dev/null <<EOF
#!/usr/bin/env bash
if [[ "\${1:-}" == "chat" || "\${1:-}" == "help" || "\${1:-}" == "-h" || "\${1:-}" == "--help" || "\${1:-}" == "-V" || "\${1:-}" == "--version" ]]; then
    exec "${hybrid_dir}/bin/cheng" "\$@"
else
    exec "${hybrid_dir}/bin/cheng" chat --auth-storage file "\$@"
fi
EOF
                then
                    success=false
                fi
                ${SUDO} chmod +x /usr/local/bin/cheng 2>/dev/null || success=false
            fi
            
            if [[ "$success" == "true" ]]; then
                printf "${t[symlink_done]}\n" "${ROOT_DIR}/chengos.sh"
                if [[ -f "${hybrid_dir}/bin/cheng" ]]; then
                    if [[ "$LANG_VAL" == "zh" ]]; then
                        echo "已创建快捷启动器: /usr/local/bin/cheng"
                        echo "现在你可以在任何地方运行 'cheng' 快速开启命令行对话（默认使用免密文件存储凭证）。"
                    else
                        echo "Created quick launcher: /usr/local/bin/cheng"
                        echo "Now you can run 'cheng' from anywhere to quickly start the chat (defaults to passwordless file storage)."
                    fi
                fi
            else
                echo "${t[symlink_fail]}"
            fi
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        9)
            clear
            set_language
            exec bash "$0"
            ;;
            
        10)
            echo "Goodbye!"
            exit 0
            ;;
            
        *)
            echo "Invalid option: $op"
            sleep 1
            ;;
    esac
done
