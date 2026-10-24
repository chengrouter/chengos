#!/usr/bin/env bash
#
# SSH transport to the router, shared by deploy.sh and probe.sh.
#
# This file is sourced, never executed. Callers set ROUTER and SSH_PORT (or
# rely on the defaults below) before calling ow_remote.
#
# ControlPersist keeps one authenticated master connection, so a whole
# operation asks for the router password at most once. File transfer pipes
# through `ssh ... cat` instead of scp: Dropbear images often ship no
# sftp-server, and current OpenSSH scp defaults to the SFTP protocol.

: "${ROUTER:=root@192.168.1.1}"
: "${SSH_PORT:=22}"

ow_ssh_opts() {
    local control_path="${OW_SSH_CONTROL_PATH:-$HOME/.ssh/cm-%r@%h:%p}"
    printf '%s\n' -p "$SSH_PORT" \
        -o ControlMaster=auto \
        -o "ControlPath=${control_path}" \
        -o ControlPersist=10m
}

# ow_remote CMD...   run a command on the router
ow_remote() {
    local opts=()
    mapfile -t opts < <(ow_ssh_opts)
    ssh "${opts[@]}" "$ROUTER" "$@"
}

# ow_remote_script ARGS... < script   run a POSIX sh script from stdin with args
ow_remote_script() {
    local quoted="" arg
    for arg in "$@"; do
        quoted+=" $(ow_sh_quote "$arg")"
    done
    ow_remote "sh -s --${quoted}"
}

# ow_upload LOCAL REMOTE   stream a file to the router
ow_upload() {
    local local_path="${1:?local path required}" remote_path="${2:?remote path required}"
    ow_remote "cat > $(ow_sh_quote "$remote_path")" < "$local_path"
}

# Single-quotes a value for a remote POSIX shell command line.
ow_sh_quote() {
    local value="$1"
    printf "'%s'" "${value//\'/\'\\\'\'}"
}
