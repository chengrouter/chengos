#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
EXAMPLE_ENV_FILE="${SCRIPT_DIR}/.env.example"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"
DOCKER_REPO_FILE="/etc/apt/sources.list.d/docker.list"
DOCKER_KEYRING="/etc/apt/keyrings/docker.asc"

log() {
  printf '[deploy] %s\n' "$1"
}

fail() {
  printf '[deploy] ERROR: %s\n' "$1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"
}

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  require_cmd sudo
  SUDO="sudo"
fi

docker_compose() {
  ${SUDO} docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

install_docker_on_debian() {
  log "Installing Docker Engine and Docker Compose plugin"
  ${SUDO} apt-get update
  ${SUDO} apt-get install -y ca-certificates curl gnupg
  ${SUDO} install -m 0755 -d /etc/apt/keyrings

  if [[ ! -f "${DOCKER_KEYRING}" ]]; then
    ${SUDO} curl -fsSL "https://download.docker.com/linux/debian/gpg" -o "${DOCKER_KEYRING}"
    ${SUDO} chmod a+r "${DOCKER_KEYRING}"
  fi

  . /etc/os-release
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=${DOCKER_KEYRING}] https://download.docker.com/linux/debian ${VERSION_CODENAME} stable" \
    | ${SUDO} tee "${DOCKER_REPO_FILE}" >/dev/null

  ${SUDO} apt-get update
  ${SUDO} apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ${SUDO} systemctl enable --now docker
}

ensure_docker() {
  if command -v docker >/dev/null 2>&1 && ${SUDO} docker compose version >/dev/null 2>&1; then
    log "Docker and Docker Compose are already installed"
    return
  fi

  if [[ ! -f /etc/debian_version ]]; then
    fail "Automatic dependency installation currently supports Debian/Ubuntu-like systems only"
  fi

  install_docker_on_debian
}

ensure_env_file() {
  if [[ -f "${ENV_FILE}" ]]; then
    return
  fi

  if [[ ! -f "${EXAMPLE_ENV_FILE}" ]]; then
    fail "Missing ${EXAMPLE_ENV_FILE}"
  fi

  cp "${EXAMPLE_ENV_FILE}" "${ENV_FILE}"
  fail "Created ${ENV_FILE}. Edit it first, then rerun this script"
}

require_env_value() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" "${ENV_FILE}" | tail -n 1 | cut -d'=' -f2- || true)"

  if [[ -z "${value}" ]]; then
    fail "Missing ${key} in ${ENV_FILE}"
  fi

  case "${value}" in
    change_this_*|replace_with_*|https://your-frontend.example.com)
      fail "Please set a real value for ${key} in ${ENV_FILE}"
      ;;
  esac
}

require_hex_64() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" "${ENV_FILE}" | tail -n 1 | cut -d'=' -f2- || true)"

  if [[ ! "${value}" =~ ^[0-9a-fA-F]{64}$ ]]; then
    fail "${key} must be a 64-character hex string"
  fi
}

validate_env_file() {
  require_env_value "POSTGRES_PASSWORD"
  require_env_value "REDIS_PASSWORD"
  require_env_value "DATABASE_URL"
  require_env_value "REDIS_URL"
  require_env_value "CREDENTIAL_MASTER_KEY_1"
  require_env_value "JWT_SECRET"
  require_env_value "CORS_ALLOWED_ORIGINS"
  require_hex_64 "CREDENTIAL_MASTER_KEY_1"
  require_hex_64 "JWT_SECRET"
}

ensure_skills_dir() {
  mkdir -p "${SCRIPT_DIR}/skills"
}

start_stack() {
  log "Pulling image and starting production stack"
  docker_compose pull
  docker_compose up -d
}

show_next_steps() {
  log "Deployment completed"
  log "Check status: ${SUDO} docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} ps"
  log "View logs: ${SUDO} docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE} logs -f chengos-app"
}

ensure_docker
ensure_env_file
validate_env_file
ensure_skills_dir
start_stack
show_next_steps
