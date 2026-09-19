#!/usr/bin/env bash
#
# `chengos.sh doctor` — report what this host actually exposes.
#
# The hardening in this repo is spread across .env values, a Compose file, an
# nginx template and two Node servers, and every one of its failure modes is
# quiet: a rate limiter keyed on the wrong address, an API still listening on
# 0.0.0.0, a bundle too old to carry a CSP nonce. None of them error. This
# probes the running system instead of reading the configuration back, because
# the question that matters is what answers on the wire, not what was intended.
#
# Read-only. It never changes a setting, restarts a service, or writes a file.
#
# Sourced by chengos.sh; run as `./chengos.sh doctor`.

# shellcheck shell=bash

DOCTOR_PASS=0
DOCTOR_WARN=0
DOCTOR_FAIL=0

_d_pass() { printf '  \033[32m✓\033[0m %s\n' "$1"; DOCTOR_PASS=$((DOCTOR_PASS + 1)); }
_d_warn() { printf '  \033[33m!\033[0m %s\n' "$1"; [[ -n "${2:-}" ]] && printf '      %s\n' "$2"; DOCTOR_WARN=$((DOCTOR_WARN + 1)); }
_d_fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; [[ -n "${2:-}" ]] && printf '      %s\n' "$2"; DOCTOR_FAIL=$((DOCTOR_FAIL + 1)); }
_d_info() { printf '    %s\n' "$1"; }
_d_head() { printf '\n\033[1m%s\033[0m\n' "$1"; }

_d_env() {
    local key="$1" file="$2"
    [[ -f "$file" ]] || return 1
    local value
    value="$(sed -n "s/^${key}=\(.*\)$/\1/p" "$file" | tail -n1 | tr -d '[:space:]')"
    printf '%s' "$value"
}

# Which local addresses a port is bound to, one per line. Empty when nothing
# listens. `ss` output differs enough between versions that the address is
# taken as "everything before the final colon".
_d_listeners() {
    local port="$1"
    command -v ss >/dev/null || return 0
    ss -H -tln 2>/dev/null \
        | awk -v p=":${port}$" '$4 ~ p { print $4 }' \
        | sed 's/:[0-9]*$//' \
        | sort -u
}

_d_is_public_bind() {
    case "$1" in
        127.*|::1|"[::1]"|localhost) return 1 ;;
        *) return 0 ;;
    esac
}

# ── Section 1: what is listening ─────────────────────────────────────────────

_doctor_ports() {
    local env_file="$1"
    _d_head "监听地址 / Listening addresses"

    if ! command -v ss >/dev/null; then
        _d_warn "ss 不可用，跳过端口检查" "install iproute2 to enable this section"
        return
    fi

    local api_port ui_port app_port
    api_port="$(_d_env API_PORT "$env_file")"; api_port="${api_port:-19225}"
    ui_port="$(_d_env UI_PORT "$env_file")";   ui_port="${ui_port:-8080}"
    app_port="$(_d_env APP_PORT "$env_file")"; app_port="${app_port:-5055}"

    local name port listeners addr public
    for spec in "cheng-api:${api_port}:strict" "ui-server:${ui_port}:proxied" "app-server:${app_port}:proxied"; do
        name="${spec%%:*}"; port="$(cut -d: -f2 <<<"$spec")"; local kind; kind="${spec##*:}"
        listeners="$(_d_listeners "$port")"

        if [[ -z "$listeners" ]]; then
            _d_info "${name} (${port}): 未监听 / not listening"
            continue
        fi

        public=false
        while read -r addr; do
            [[ -z "$addr" ]] && continue
            _d_is_public_bind "$addr" && public=true
        done <<<"$listeners"

        if ! $public; then
            _d_pass "${name} (${port}) 只绑本机 / loopback only"
        elif [[ "$kind" == "strict" ]]; then
            # The API is never meant to be addressed directly: reaching it
            # bypasses every scanner rule, rate limit and security header that
            # the frontend applies, and the login endpoint is on it.
            _d_fail "${name} (${port}) 绑在 $(tr '\n' ' ' <<<"$listeners")" \
                "API 不应直连。设 BIND_ADDRESS=127.0.0.1 并重启。"
        else
            _d_warn "${name} (${port}) 绑在 $(tr '\n' ' ' <<<"$listeners")" \
                "若前面有反向代理/隧道，设 UI_BIND/APP_BIND 为 127.0.0.1 或内网地址。"
        fi
    done
}

# ── Section 2: configuration that decides who is believed ────────────────────

_doctor_trust() {
    local env_file="$1"
    _d_head "信任与跨域 / Trust and CORS"

    if [[ ! -f "$env_file" ]]; then
        _d_fail "找不到 ${env_file}" "尚未安装？先跑 ./chengos.sh install"
        return
    fi

    local cors trusted cf
    cors="$(_d_env CORS_PERMISSIVE "$env_file")"
    trusted="$(_d_env TRUSTED_PROXY_IPS "$env_file")"
    cf="$(_d_env TRUST_CLOUDFLARE "$env_file")"

    case "$cors" in
        ""|false|FALSE|False|0|no|off) _d_pass "CORS 非全开 (CORS_PERMISSIVE=${cors:-unset})" ;;
        *) _d_fail "CORS_PERMISSIVE=${cors}" "任意站点都可调用本 API。生产环境应设为 false。" ;;
    esac

    [[ "$cf" =~ ^(1|true|TRUE|yes|on)$ ]] \
        && _d_info "TRUST_CLOUDFLARE=true（读 CF-Connecting-IP）" \
        || _d_info "TRUST_CLOUDFLARE=false（读 X-Forwarded-For 末位）"

    if [[ -n "$trusted" ]]; then
        _d_pass "TRUSTED_PROXY_IPS=${trusted}"
        return
    fi

    # A proxy on another host arrives from a public address, which is not
    # trusted implicitly. Nothing breaks visibly: every visitor is attributed
    # to that one address and shares a single rate-limit bucket.
    local ui_bind
    ui_bind="$(_d_env UI_BIND "$env_file")"
    if [[ -n "$ui_bind" ]] && _d_is_public_bind "$ui_bind" && [[ "$ui_bind" != "0.0.0.0" ]]; then
        _d_warn "UI_BIND=${ui_bind} 但 TRUSTED_PROXY_IPS 为空" \
            "若代理在另一台机器且来自公网地址，所有访客会共用一个限流桶。"
    else
        _d_info "TRUSTED_PROXY_IPS 未设（同机/内网代理无需设置）"
    fi
}

# ── Section 3: what the frontend actually answers ────────────────────────────

_doctor_probe() {
    local env_file="$1"
    _d_head "实测前端行为 / Live frontend behaviour"

    command -v curl >/dev/null || { _d_warn "curl 不可用，跳过"; return; }

    local ui_port ui_bind host base
    ui_port="$(_d_env UI_PORT "$env_file")"; ui_port="${ui_port:-8080}"
    ui_bind="$(_d_env UI_BIND "$env_file")"
    case "$ui_bind" in
        ""|0.0.0.0|::|"[::]") host="127.0.0.1" ;;
        *:*)                  host="[${ui_bind}]" ;;
        *)                    host="$ui_bind" ;;
    esac
    base="http://${host}:${ui_port}"

    if ! curl -sf --max-time 3 -o /dev/null "${base}/"; then
        _d_warn "UI 未响应 (${base})" "服务没起来，或 UI_BIND 改了但未重启。"
        return
    fi

    # The behaviour that made a wordlist scan of a live deployment report every
    # probe as HTTP 200: the SPA fallback handed out index.html for each.
    local probes=(
        "/.env" "/backend/api/.env" "/config/credentials.json"
        "/.git/config" "/wp-login.php" "/docker-compose.prod.yml"
        "/.terraform/terraform.tfstate" "/assets/index.js.map"
    )
    local leaked=() code p
    for p in "${probes[@]}"; do
        code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${base}${p}")"
        [[ "$code" == "404" ]] || leaked+=("${p} → ${code}")
    done

    if ((${#leaked[@]} == 0)); then
        _d_pass "扫描路径全部 404 (${#probes[@]} 条)"
    else
        _d_fail "${#leaked[@]}/${#probes[@]} 条扫描路径未被拒绝" \
            "请求可能没走到加固过的那一层（宿主 nginx 直接 root 指向了静态目录？）"
        for p in "${leaked[@]}"; do _d_info "$p"; done
    fi

    # Deep links must still resolve, or the fix broke the app.
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 -H 'Accept: text/html' "${base}/editor/doctor-probe")"
    [[ "$code" == "200" ]] \
        && _d_pass "SPA 深链正常 (200)" \
        || _d_fail "SPA 深链返回 ${code}" "客户端路由坏了，不只是扫描被拦。"

    local headers
    headers="$(curl -s -D- -o /dev/null --max-time 3 -H 'Accept: text/html' "${base}/")"

    local missing=()
    grep -qi '^content-security-policy:' <<<"$headers" || missing+=("Content-Security-Policy")
    grep -qi '^x-content-type-options:'  <<<"$headers" || missing+=("X-Content-Type-Options")
    if ((${#missing[@]} == 0)); then
        _d_pass "安全响应头齐全"
    else
        _d_fail "缺少安全响应头: ${missing[*]}" "前端可能是未加固的旧版本。"
    fi

    if grep -qi "connect-src 'self' https:" <<<"$headers" || grep -qi 'connect-src[^;]*[^-]https:' <<<"$headers"; then
        _d_warn "CSP connect-src 含通配 https:" "注入的脚本可把读到的数据发往任意站点。"
    fi

    # An old bundle has no __CSP_NONCE__ placeholder, so the servers fall back
    # to 'unsafe-inline' rather than breaking every page load. That is a working
    # but weaker state, and it is invisible unless someone looks.
    if grep -qi "script-src[^;]*'unsafe-inline'" <<<"$headers"; then
        _d_warn "script-src 仍含 'unsafe-inline'" \
            "前端 bundle 缺少 __CSP_NONCE__ 占位符。重建前端后会自动收紧。"
    else
        local n1 n2
        n1="$(curl -s --max-time 3 "${base}/" | grep -o 'nonce="[a-f0-9]\{16,\}"' | head -1)"
        n2="$(curl -s --max-time 3 "${base}/" | grep -o 'nonce="[a-f0-9]\{16,\}"' | head -1)"
        if [[ -n "$n1" && "$n1" != "$n2" ]]; then
            _d_pass "CSP nonce 逐请求变化"
        elif [[ -n "$n1" ]]; then
            _d_fail "CSP nonce 两次请求相同" "被缓存了；nonce 失去意义。"
        fi
    fi
}

# ── Section 4: the edge ──────────────────────────────────────────────────────

_doctor_edge() {
    _d_head "边缘 / Edge"

    if systemctl is-active --quiet cloudflared 2>/dev/null; then
        _d_pass "cloudflared 运行中（隧道模式）"
        _d_info "源站不应有公网入站端口；不要跑 origin-firewall.sh"
        return
    fi

    _d_info "未检测到 cloudflared（反向代理模式，或隧道未启用）"

    if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q '^Status: active'; then
        _d_pass "ufw 已启用"
    else
        _d_warn "未检测到启用的 ufw" "80/443 之外的端口是否对公网开放，请自行确认。"
    fi

    # Only externally-originated traffic proves reachability, so say what this
    # check cannot do rather than implying a clean bill of health.
    _d_info "本机无法验证公网可达性。请在另一台机器上执行："
    _d_info "  curl -sv --max-time 5 http://<源站公网IP>:19225/health   # 应超时/拒绝"
}

# ── Entry point ──────────────────────────────────────────────────────────────

run_doctor() {
    local env_file="$1" mode="${2:-unknown}"

    # chengos.sh runs under `set -euo pipefail`, which is right for an installer
    # and wrong for a diagnostic: a probe that finds nothing is a RESULT, not an
    # error, and `grep -q` returning 1 must not abort the report half-written.
    # Relax here and restore before returning, so the caller is unaffected.
    local _d_saved_opts
    _d_saved_opts="$(set +o)"
    set +e +o pipefail

    printf '\033[1mChengOS doctor\033[0m  (mode: %s)\n' "$mode"
    printf '%s\n' "$env_file"

    _doctor_ports "$env_file"
    _doctor_trust "$env_file"
    _doctor_probe "$env_file"
    _doctor_edge

    _d_head "小结 / Summary"
    printf '  通过 %d   警告 %d   问题 %d\n' "$DOCTOR_PASS" "$DOCTOR_WARN" "$DOCTOR_FAIL"
    if ((DOCTOR_FAIL > 0)); then
        printf '\n  详见 deploy/HARDENING.md\n'
    fi

    eval "$_d_saved_opts"

    # Exit code is for scripting: non-zero only on a real problem, so doctor can
    # gate a deploy. Warnings are advisory and must not fail a pipeline.
    ((DOCTOR_FAIL > 0)) && return 1
    return 0
}
