# shellcheck shell=bash
#
# One Compose file list for every Docker entry point (docker/start.sh,
# docker/upgrade.sh, chengos.sh start/stop/status/restart/update/rollback/
# uninstall/admin). Building it in one place keeps an update or rollback from
# silently recreating the API container without an override that start.sh
# applied.
#
# Sourced, never executed. Fixed order:
#   docker-compose.yml          always
#   docker-compose.binds.yml    unless binds are off (--no-binds)
#   docker-compose.remote.yml   when remote is on (--remote)
#   docker-compose.env-dir.yml  when .env is in the migrated env/ layout
#
# Overrides:
#   CHENGOS_COMPOSE_BINDS=false   same as --no-binds
#   CHENGOS_COMPOSE_REMOTE=true   same as --remote

# compose_file_args DOCKER_DIR SHARED_DIR [binds] [remote]
# Fills the global array COMPOSE_FILE_ARGS with `-f <abs path>` pairs.
compose_file_args() {
    local docker_dir="$1" shared_dir="$2"
    local binds="${3:-${CHENGOS_COMPOSE_BINDS:-true}}"
    local remote="${4:-${CHENGOS_COMPOSE_REMOTE:-false}}"

    COMPOSE_FILE_ARGS=(-f "${docker_dir}/docker-compose.yml")
    if [[ "$binds" == "true" && -f "${docker_dir}/docker-compose.binds.yml" ]]; then
        COMPOSE_FILE_ARGS+=(-f "${docker_dir}/docker-compose.binds.yml")
    fi
    if [[ "$remote" == "true" ]]; then
        COMPOSE_FILE_ARGS+=(-f "${docker_dir}/docker-compose.remote.yml")
    fi
    # The env/ directory mount is what makes a settings-panel write visible to
    # the host and vice versa. Without the override file (older scripts) the
    # single-file mount keeps working read-only, exactly as before.
    if [[ -L "${shared_dir}/.env" && -f "${shared_dir}/env/.env" \
          && -f "${docker_dir}/docker-compose.env-dir.yml" ]]; then
        COMPOSE_FILE_ARGS+=(-f "${docker_dir}/docker-compose.env-dir.yml")
    fi
}

# compose_env_file SHARED_DIR — the --env-file argument (canonical path, so a
# compatibility link is never the thing Compose reads).
compose_env_file() {
    local shared_dir="$1"
    readlink -f -- "${shared_dir}/.env" 2>/dev/null || printf '%s\n' "${shared_dir}/.env"
}
