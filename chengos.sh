#!/usr/bin/env bash
set -euo pipefail

# Root workspace directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

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
    
    if ! curl -sSfL "$TARBALL_URL" -o chengos.tar.gz; then
        echo "ERROR: Failed to download release from $TARBALL_URL."
        echo "Please make sure you have created a Release and uploaded the release asset."
        exit 1
    fi
    
    echo "Extracting release package..."
    tar -xzf chengos.tar.gz --strip-components=1
    rm -f chengos.tar.gz
    
    echo "Starting ChengOS Manager..."
    exec ./chengos.sh
fi

# ── Local Mode Execution ──────────────────────────────────────────────────────
LANG_FILE="${ROOT_DIR}/.chengos_lang"
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
    t[menu_link]="7) 设置系统命令软链接 (Create Symlink)"
    t[menu_lang]="8) 切换语言 (Switch Language)"
    t[menu_exit]="9) 退出 (Exit)"
    t[select_op]="请选择操作 [1-9]: "
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
    t[status_header]="正在查询服务状态..."
    t[symlink_done]="已创建软链接: /usr/local/bin/chengos -> %s\n现在你可以在任何地方运行 'chengos' 命令了。"
    t[symlink_fail]="创建软链接失败，请确认是否拥有 sudo 权限。"
else
    t[banner]="===========================================\n       ChengOS Unified Management Utility\n==========================================="
    t[menu_install]="1) Install/Initialize Modules"
    t[menu_update]="2) Update Modules"
    t[menu_uninstall]="3) Uninstall/Stop Modules"
    t[menu_status]="4) Service Status"
    t[menu_start]="5) Start Services"
    t[menu_stop]="6) Stop Services"
    t[menu_link]="7) Create System Symlink"
    t[menu_lang]="8) Switch Language"
    t[menu_exit]="9) Exit"
    t[select_op]="Select option [1-9]: "
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
    t[status_header]="Checking services status..."
    t[symlink_done]="Created symlink: /usr/local/bin/chengos -> %s\nYou can now run the 'chengos' command from anywhere."
    t[symlink_fail]="Failed to create symlink. Please make sure you have sudo rights."
fi

# ── Utility Helpers ──────────────────────────────────────────────────────────

# Run sub-command in Docker or Native
run_service_cmd() {
    local cmd="$1" # start, stop, status
    local mode="${2:-native}"
    local with_infra="${3:-false}"

    if [[ "$mode" == "docker" ]]; then
        # Resolve docker deploy directory
        local docker_dir=""
        if [[ -d "${ROOT_DIR}/deploy/docker" ]]; then
            docker_dir="${ROOT_DIR}/deploy/docker"
        else
            docker_dir="${ROOT_DIR}/docker"
        fi
        
        cd "$docker_dir"
        if [[ "$cmd" == "start" ]]; then
            [[ -f .env ]] || bash generate-env.sh
            docker compose up -d
        elif [[ "$cmd" == "stop" ]]; then
            if [[ "$with_infra" == "true" ]]; then
                docker compose down -v
            else
                docker compose down
            fi
        elif [[ "$cmd" == "status" ]]; then
            docker compose ps
        fi
    else
        # Resolve hybrid/native deploy directory
        local hybrid_dir=""
        if [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
            hybrid_dir="${ROOT_DIR}/deploy/hybrid"
        else
            hybrid_dir="${ROOT_DIR}"
        fi
        
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

    local hybrid_dir=""
    if [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
        hybrid_dir="${ROOT_DIR}/deploy/hybrid"
    else
        hybrid_dir="${ROOT_DIR}"
    fi

    cd "$hybrid_dir"
    export DB_INSTALL_MODE="$db_mode"
    export ENABLE_REDIS="$enable_redis"
    export ENABLE_QDRANT="$enable_qdrant"
    export UI_PORT="$ui_port"
    export APP_PORT="$app_port"

    echo "Generating environment configuration (.env)..."
    bash generate-env.sh --force
}

# Setup env for docker
setup_docker_env() {
    local enable_redis="$1"
    local enable_qdrant="$2"
    local ui_port="$3"
    local app_port="$4"

    local docker_dir=""
    if [[ -d "${ROOT_DIR}/deploy/docker" ]]; then
        docker_dir="${ROOT_DIR}/deploy/docker"
    else
        docker_dir="${ROOT_DIR}/docker"
    fi

    cd "$docker_dir"
    bash generate-env.sh --force
    perl -0pi -e "s/^UI_PORT=.*/UI_PORT=${ui_port}/m" .env || true
    perl -0pi -e "s/^APP_PORT=.*/APP_PORT=${app_port}/m" .env || true
}

# ── CLI Commands Execution ───────────────────────────────────────────────────

if [[ $# -gt 0 ]]; then
    CMD="$1"
    shift
    
    MODE="native"
    WITH_MODULES="api,ui,app,pg,redis,qdrant"
    DB_INSTALL_MODE="managed-process"
    UI_PORT=8080
    APP_PORT=5055
    
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
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

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
            if [[ -d "${ROOT_DIR}/chengflow" && -d "${ROOT_DIR}/chengflow-ui" ]]; then
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
                [[ "$enable_cli" == "true" ]] && CARGO_MODULES="$CARGO_MODULES -p chengctl"
                cargo build --release $CARGO_MODULES

                # Copy binaries to hybrid/bin
                mkdir -p "${ROOT_DIR}/deploy/hybrid/bin"
                cp "${ROOT_DIR}/chengflow/target/release/cheng-api" "${ROOT_DIR}/deploy/hybrid/bin/cheng-api"
                if [[ "$enable_cli" == "true" ]]; then
                    cp "${ROOT_DIR}/chengflow/target/release/chengctl" "${ROOT_DIR}/deploy/hybrid/bin/chengctl"
                fi
            else
                echo "Release bundle detected. Skipping source compilation."
                
                local hybrid_dir=""
                if [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                    hybrid_dir="${ROOT_DIR}/deploy/hybrid"
                else
                    hybrid_dir="${ROOT_DIR}"
                fi

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
            echo "${t[install_done]}"
            ;;
            
        start)
            echo "${t[starting]}"
            if [[ "$MODE" == "docker" ]]; then
                run_service_cmd start docker
            else
                # Load config to see what modules to launch
                local hybrid_dir=""
                if [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                    hybrid_dir="${ROOT_DIR}/deploy/hybrid"
                else
                    hybrid_dir="${ROOT_DIR}"
                fi
                cd "$hybrid_dir"
                if [[ -f .env ]]; then
                    # shellcheck disable=SC1090
                    set -a; source .env; set +a
                fi
                
                modules="api"
                [[ -d ui && "$(ls -A ui 2>/dev/null)" ]] && modules="${modules},ui"
                [[ -d app && "$(ls -A app 2>/dev/null)" ]] && modules="${modules},app"
                
                run_service_cmd start native false --with "$modules"
            fi
            ;;
            
        stop)
            echo "${t[stopping]}"
            with_infra="false"
            if [[ "${1:-}" == "--with-infra" ]]; then
                with_infra="true"
            fi
            run_service_cmd stop "$MODE" "$with_infra"
            ;;
            
        status)
            echo "${t[status_header]}"
            run_service_cmd status "$MODE"
            ;;
            
        uninstall)
            echo "${t[uninstall_start]}"
            run_service_cmd stop "$MODE" true
            if [[ "$MODE" == "native" ]]; then
                local target_dir=""
                if [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                    target_dir="${ROOT_DIR}/deploy/hybrid"
                else
                    target_dir="${ROOT_DIR}"
                fi
                rm -rf "${target_dir}/bin/"*
                rm -rf "${target_dir}/ui/"*
                rm -rf "${target_dir}/app/"*
                rm -rf "${target_dir}/runtime/"*
            fi
            echo "${t[uninstall_done]}"
            ;;
            
        update)
            echo "${t[update_start]}"
            if [[ -d "${ROOT_DIR}/.git" ]]; then
                git pull
            fi
            ./chengos.sh install --mode "$MODE" --with "$WITH_MODULES" --db-install-mode "$DB_INSTALL_MODE" --ui-port "$UI_PORT" --app-port "$APP_PORT"
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
            install_mode="native"
            if [[ -f "${ROOT_DIR}/.env" && $(grep -c "DB_INSTALL_MODE" "${ROOT_DIR}/.env" || true) -gt 0 ]] || [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                install_mode="native"
            elif [[ -d "${ROOT_DIR}/deploy/docker" || -d "${ROOT_DIR}/docker" ]]; then
                install_mode="docker"
            fi
            echo ""
            bash "$0" update --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        3)
            clear
            install_mode="native"
            if [[ -f "${ROOT_DIR}/.env" ]] || [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                install_mode="native"
            elif [[ -d "${ROOT_DIR}/deploy/docker" || -d "${ROOT_DIR}/docker" ]]; then
                install_mode="docker"
            fi
            echo ""
            bash "$0" uninstall --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        4)
            clear
            install_mode="native"
            if [[ -f "${ROOT_DIR}/.env" ]] || [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                install_mode="native"
            elif [[ -d "${ROOT_DIR}/deploy/docker" || -d "${ROOT_DIR}/docker" ]]; then
                install_mode="docker"
            fi
            echo ""
            bash "$0" status --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        5)
            clear
            install_mode="native"
            if [[ -f "${ROOT_DIR}/.env" ]] || [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                install_mode="native"
            elif [[ -d "${ROOT_DIR}/deploy/docker" || -d "${ROOT_DIR}/docker" ]]; then
                install_mode="docker"
            fi
            echo ""
            bash "$0" start --mode "$install_mode"
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        6)
            clear
            install_mode="native"
            if [[ -f "${ROOT_DIR}/.env" ]] || [[ -d "${ROOT_DIR}/deploy/hybrid" ]]; then
                install_mode="native"
            elif [[ -d "${ROOT_DIR}/deploy/docker" || -d "${ROOT_DIR}/docker" ]]; then
                install_mode="docker"
            fi
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
            echo "Creating system-wide symlink for chengos..."
            if sudo ln -sf "${ROOT_DIR}/chengos.sh" /usr/local/bin/chengos 2>/dev/null; then
                printf "${t[symlink_done]}\n" "${ROOT_DIR}/chengos.sh"
            else
                echo "${t[symlink_fail]}"
            fi
            read -p "Press Enter to continue..." dummy < /dev/tty
            ;;
            
        8)
            clear
            set_language
            exec bash "$0"
            ;;
            
        9)
            echo "Goodbye!"
            exit 0
            ;;
            
        *)
            echo "Invalid option: $op"
            sleep 1
            ;;
    esac
done
