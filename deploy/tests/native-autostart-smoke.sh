#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURE="$(mktemp -d)"
trap 'rm -r "$FIXTURE"' EXIT

mkdir -p "$FIXTURE"/{hybrid,bin,ui,app,units,mocks}
cp "$DEPLOY_DIR/chengos.sh" "$FIXTURE/chengos.sh"
printf 'en\n' > "$FIXTURE/.chengos_lang"
printf '#!/bin/bash\nexit 0\n' > "$FIXTURE/hybrid/start.sh"
cp "$FIXTURE/hybrid/start.sh" "$FIXTURE/hybrid/stop.sh"
cp "$FIXTURE/hybrid/start.sh" "$FIXTURE/hybrid/generate-env.sh"
printf '#!/bin/bash\nprintf "api %%s\\n" "$*" >> "%s"\n' "$FIXTURE/calls" > "$FIXTURE/bin/cheng-api"
printf 'console.log("ui");\n' > "$FIXTURE/bin/ui-server.js"
printf 'console.log("app");\n' > "$FIXTURE/bin/app-server.js"
touch "$FIXTURE/ui/index.html" "$FIXTURE/app/index.html"
printf 'PORT=19225\nUI_PORT=8080\nENABLE_REDIS=false\nCHENG_API_LOG_FILE=off\n' > "$FIXTURE/.env"
chmod +x "$FIXTURE/bin/cheng-api"

cat > "$FIXTURE/mocks/systemctl" <<'EOF'
#!/bin/bash
printf '%s\n' "$*" >> "$CHENGOS_TEST_CALLS"
case "$1" in
    show-environment) [[ "${CHENGOS_TEST_SYSTEMD_OFF:-}" != 1 ]]; exit $? ;;
    is-enabled|is-active)
        if [[ "$1" == "is-enabled" ]]; then
            flag=enabled
        else
            flag=active
        fi
        if test -f "$CHENGOS_SYSTEMD_UNIT_DIR/$flag"; then
            [[ "${2:-}" == "--quiet" ]] || echo "$flag"
            exit 0
        fi
        if [[ "${2:-}" != "--quiet" ]]; then
            [[ "$flag" == "enabled" ]] && echo "disabled" || echo "inactive"
        fi
        exit 1
        ;;
    enable) touch "$CHENGOS_SYSTEMD_UNIT_DIR/enabled" ;;
    disable) rm -f "$CHENGOS_SYSTEMD_UNIT_DIR/enabled" ;;
    start|restart) touch "$CHENGOS_SYSTEMD_UNIT_DIR/active" ;;
    stop) rm -f "$CHENGOS_SYSTEMD_UNIT_DIR/active" ;;
esac
exit 0
EOF
printf '#!/bin/bash\nexit 0\n' > "$FIXTURE/mocks/loginctl"
printf '#!/bin/bash\nexec "$@"\n' > "$FIXTURE/mocks/sudo"
chmod +x "$FIXTURE/mocks/"*

export PATH="$FIXTURE/mocks:$PATH"
export CHENGOS_TEST_CALLS="$FIXTURE/systemctl-calls"
export CHENGOS_SYSTEMD_UNIT_DIR="$FIXTURE/units"

bash "$FIXTURE/chengos.sh" service-run api
grep -Fxq 'api ' "$FIXTURE/calls" || { echo "API did not run" >&2; exit 1; }
CHENGOS_TEST_SYSTEMD_OFF=1 bash "$FIXTURE/chengos.sh" start --mode native
test ! -f "$FIXTURE/units/cheng-api.service"
bash "$FIXTURE/chengos.sh" start --mode native
for unit in chengos-infra cheng-api cheng-ui cheng-app; do
    test -f "$FIXTURE/units/$unit.service"
done
grep -Fq "ExecStart=/bin/bash \"$FIXTURE/chengos.sh\" service-run api" "$FIXTURE/units/cheng-api.service"
grep -Fq 'Restart=always' "$FIXTURE/units/cheng-ui.service"
grep -Fq 'start chengos-infra.service cheng-api.service cheng-ui.service cheng-app.service' "$FIXTURE/systemctl-calls"
if command -v systemd-analyze >/dev/null 2>&1; then
    systemd-analyze verify "$FIXTURE/units/"*.service
fi
bash "$FIXTURE/chengos.sh" start --mode native
test "$(grep -c '^enable ' "$FIXTURE/systemctl-calls")" -eq 1
status_output="$(bash "$FIXTURE/chengos.sh" status --mode native)"
[[ "$status_output" == *"cheng-api.service        active / enabled"* ]]
bash "$FIXTURE/chengos.sh" restart --mode native
bash "$FIXTURE/chengos.sh" stop --mode native
grep -Fq 'restart chengos-infra.service cheng-api.service cheng-ui.service cheng-app.service' "$FIXTURE/systemctl-calls"
grep -Fq 'stop chengos-infra.service cheng-api.service cheng-ui.service cheng-app.service' "$FIXTURE/systemctl-calls"
grep -Fq 'disable cheng-app.service cheng-ui.service cheng-api.service chengos-infra.service' "$FIXTURE/systemctl-calls"
test ! -f "$FIXTURE/units/enabled"
if status_output="$(bash "$FIXTURE/chengos.sh" status --mode native)"; then
    echo "Stopped API reported healthy" >&2
    exit 1
fi
[[ "$status_output" == *"cheng-api.service        inactive / disabled"* ]]
bash "$FIXTURE/chengos.sh" start --mode native
test "$(grep -c '^enable ' "$FIXTURE/systemctl-calls")" -eq 2
bash "$FIXTURE/chengos.sh" stop --mode native

printf '# an unrelated unit\n' > "$FIXTURE/units/cheng-ui.service"
if bash "$FIXTURE/chengos.sh" start --mode native; then
    echo "Overwrote an unrelated unit" >&2
    exit 1
fi
grep -Fxq '# an unrelated unit' "$FIXTURE/units/cheng-ui.service"
echo "Native autostart smoke test passed."
