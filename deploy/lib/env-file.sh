# shellcheck shell=bash
#
# ChengOS deployment .env reader/writer.
#
# Sourced, never executed. Every script that edits the instance .env goes
# through envf_set so that it agrees with the backend settings writer
# (chengflow cheng-api services/env_settings/env_file.rs) on four things:
#
#   parsing   KEY=value, optional `export `, surrounding quotes stripped, an
#             unquoted value loses its ` # comment`; the last assignment wins
#   location  the CANONICAL path: `.env` may be a compatibility symlink to
#             `env/.env`, and a write must never replace the link
#   locking   an exclusive flock(2) on `<canonical>.lock`, held across the
#             whole read-modify-write
#   shape     comments and ordering are kept; a commented `#KEY=` template line
#             is uncommented in place; unknown keys are appended under a header
#
# Writes in the migrated layout (`<shared>/env/.env`, a directory bind mount in
# Docker) are temp file + rename, so readers see the old or the new file. The
# legacy layout keeps the historical in-place rewrite: there `.env` may be a
# single-file Docker bind mount, which a rename would silently detach.

: "${ENVF_LOCK_TIMEOUT:=30}"

envf_err() { printf 'ERROR: %s\n' "$*" >&2; }

envf_valid_key() {
    [[ "${1:-}" =~ ^[A-Z_][A-Z0-9_]*$ ]]
}

# The path every reader and writer must use. Resolves a symlinked .env (and
# symlinked parent directories) the same way the backend's canonicalize does.
envf_canonical() {
    local path="$1" resolved
    if resolved="$(readlink -f -- "$path" 2>/dev/null)" && [[ -n "$resolved" ]]; then
        printf '%s\n' "$resolved"
    else
        printf '%s\n' "$path"
    fi
}

# Prints the value of KEY; returns 1 when the key has no active assignment.
# An assignment with an empty value prints nothing and returns 0.
envf_get() {
    local file="$1" key="$2"
    envf_valid_key "$key" || { envf_err "invalid key: ${key}"; return 2; }
    [[ -f "$file" ]] || return 1
    awk -v key="$key" '
        {
            line = $0
            sub(/\r$/, "", line)
            sub(/^[ \t]+/, "", line); sub(/[ \t]+$/, "", line)
            if (line == "" || substr(line, 1, 1) == "#") next
            if (substr(line, 1, 7) == "export ") { line = substr(line, 8); sub(/^[ \t]+/, "", line) }
            eq = index(line, "=")
            if (eq == 0) next
            k = substr(line, 1, eq - 1); sub(/[ \t]+$/, "", k)
            if (k != key) next
            v = substr(line, eq + 1); sub(/^[ \t]+/, "", v)
            q = substr(v, 1, 1)
            if (q != "\"" && q != "'\''") {
                i = index(v, " #"); if (i > 0) v = substr(v, 1, i - 1)
                sub(/[ \t]+$/, "", v)
            }
            n = length(v)
            if (n >= 2 && (q == "\"" || q == "'\''") && substr(v, n, 1) == q) v = substr(v, 2, n - 2)
            val = v; found = 1
        }
        END { if (found) { printf "%s", val; exit 0 } exit 1 }
    ' "$file"
}

# Renders VALUE for the right-hand side. Must stay readable by `source` (bash),
# Compose's env_file, and the backend reader alike, so a value that needs
# quoting is single-quoted (literal everywhere). A value that would need both
# quoting and a literal single quote is refused rather than mangled.
envf_render_value() {
    local value="$1"
    if [[ "$value" == *$'\n'* || "$value" == *$'\r'* ]]; then
        envf_err "values must be a single line"
        return 1
    fi
    # Shell metacharacters too: `KEY=Bash(cargo:*)` unquoted is a syntax
    # error for `source`, which would stop ChengOS from starting.
    local plain=true
    case "$value" in
        *[[:space:]\#\"\'\$\`\\\(\)\;\&\|\<\>\*\?\[\]\{\}\~\!]*) plain=false ;;
    esac
    if [[ -z "$value" || "$plain" == true ]]; then
        printf '%s' "$value"
        return 0
    fi
    if [[ "$value" == *"'"* ]]; then
        envf_err "value contains a single quote and characters that need quoting; refusing to write it"
        return 1
    fi
    printf "'%s'" "$value"
}

# Runs "$@" while holding the writer lock of FILE (canonical path expected).
# A new lock file inherits the env file's owner and mode so that the backend,
# which may run as another user in the same group, can take the same lock.
envf_with_lock() {
    local file="$1"; shift
    local lock="${file}.lock"
    if ! command -v flock >/dev/null 2>&1; then
        envf_err "flock (util-linux) is required to edit ${file} safely"
        return 1
    fi
    if [[ ! -e "$lock" ]]; then
        ( umask 077; : >> "$lock" ) || { envf_err "cannot create ${lock}"; return 1; }
        if [[ -e "$file" ]]; then
            # Same group access as the env file, but always writable by its
            # owner: flock needs a file it can open for writing.
            chmod --reference="$file" "$lock" 2>/dev/null || true
            chmod u+rw "$lock" 2>/dev/null || true
            [[ "$(id -u)" -eq 0 ]] && chown --reference="$file" "$lock" 2>/dev/null || true
        fi
    fi
    (
        exec 9>>"$lock" || exit 1
        if ! flock -w "$ENVF_LOCK_TIMEOUT" 9; then
            envf_err "timed out after ${ENVF_LOCK_TIMEOUT}s waiting for ${lock}"
            exit 1
        fi
        "$@"
    )
}

# True when FILE lives in the migrated layout, where a rename is safe.
envf_atomic_layout() {
    [[ "$(basename "$(dirname "$1")")" == "env" ]]
}

# envf_set FILE [--section TEXT] KEY=VALUE... [-KEY...]
#
# Applies every update in one locked transaction. `-KEY` clears the key the way
# the settings panel does (`# KEY=`). The staged content is fully validated
# before it replaces the live file, a `.bak` copy is kept, and the result is
# read back; any mismatch restores the backup.
envf_set() {
    local file="$1"; shift
    local section="Added by chengos.sh"
    if [[ "${1:-}" == "--section" ]]; then
        section="${2:?--section needs a value}"
        shift 2
    fi
    [[ $# -gt 0 ]] || return 0

    local -a keys=() values=() actions=()
    local arg key value rendered
    for arg in "$@"; do
        if [[ "$arg" == -* ]]; then
            key="${arg#-}"
            envf_valid_key "$key" || { envf_err "invalid key: ${key}"; return 1; }
            keys+=("$key"); values+=(""); actions+=("unset")
            continue
        fi
        [[ "$arg" == *=* ]] || { envf_err "expected KEY=VALUE, got: ${arg}"; return 1; }
        key="${arg%%=*}"
        value="${arg#*=}"
        envf_valid_key "$key" || { envf_err "invalid key: ${key}"; return 1; }
        rendered="$(envf_render_value "$value")" || return 1
        keys+=("$key"); values+=("$rendered"); actions+=("set")
    done

    local canonical
    canonical="$(envf_canonical "$file")"
    if [[ ! -e "$canonical" ]]; then
        ( umask 077; : >> "$canonical" ) || { envf_err "cannot create ${canonical}"; return 1; }
    fi
    [[ -f "$canonical" ]] || { envf_err "${canonical} is not a regular file"; return 1; }

    envf_with_lock "$canonical" \
        _envf_apply_locked "$canonical" "$section" "${#keys[@]}" "${keys[@]}" "${values[@]}" "${actions[@]}"
}

_envf_apply_locked() {
    local file="$1" section="$2" n="$3"; shift 3
    local -a keys=("${@:1:n}") values=("${@:n+1:n}") actions=("${@:2*n+1:n}")
    local dir base tmp i
    dir="$(dirname "$file")"
    base="$(basename "$file")"
    tmp="$(mktemp "${dir}/.${base}.tmp.XXXXXX")" || { envf_err "cannot stage a write in ${dir}"; return 1; }

    local -a awk_env=()
    for ((i = 0; i < n; i++)); do
        awk_env+=("ENVF_K_${i}=${keys[i]}" "ENVF_V_${i}=${values[i]}" "ENVF_A_${i}=${actions[i]}")
    done
    if ! env "${awk_env[@]}" ENVF_N="$n" ENVF_SECTION="$section" awk '
        function parse_key(line,    k, eq) {
            sub(/\r$/, "", line)
            sub(/^[ \t]+/, "", line)
            if (substr(line, 1, 7) == "export ") { line = substr(line, 8); sub(/^[ \t]+/, "", line) }
            eq = index(line, "=")
            if (eq == 0) return ""
            k = substr(line, 1, eq - 1); sub(/[ \t]+$/, "", k)
            return (k ~ /^[A-Z_][A-Z0-9_]*$/) ? k : ""
        }
        BEGIN {
            n = ENVIRON["ENVF_N"] + 0
            for (i = 0; i < n; i++) {
                k = ENVIRON["ENVF_K_" i]
                want[k] = 1; val[k] = ENVIRON["ENVF_V_" i]; act[k] = ENVIRON["ENVF_A_" i]; order[i] = k
            }
        }
        { lines[NR] = $0 }
        END {
            # Pass 1: rewrite every active assignment of a managed key.
            for (r = 1; r <= NR; r++) {
                t = lines[r]; sub(/^[ \t]+/, "", t)
                if (t == "" || substr(t, 1, 1) == "#") continue
                k = parse_key(t)
                if (k == "" || !(k in want)) continue
                lines[r] = (act[k] == "unset") ? "# " k "=" : k "=" val[k]
                done[k] = 1
            }
            # Pass 2: uncomment the first template line of a key still unset.
            for (r = 1; r <= NR; r++) {
                t = lines[r]; sub(/^[ \t]+/, "", t)
                if (substr(t, 1, 1) != "#") continue
                t = substr(t, 2)
                k = parse_key(t)
                if (k == "" || !(k in want) || (k in done) || act[k] == "unset") continue
                lines[r] = k "=" val[k]
                done[k] = 1
            }
            for (r = 1; r <= NR; r++) print lines[r]
            # Pass 3: append what the file never mentioned.
            header = 0
            for (i = 0; i < n; i++) {
                k = order[i]
                if ((k in done) || act[k] == "unset") continue
                if (!header) { print ""; print "# " ENVIRON["ENVF_SECTION"]; header = 1 }
                print k "=" val[k]
                done[k] = 1
            }
        }
    ' "$file" > "$tmp"; then
        rm -f "$tmp"
        envf_err "failed to stage the update of ${file}"
        return 1
    fi

    # Validate the staged content before it can replace anything. A short write
    # (e.g. ENOSPC) must never reach the live file: nothing is ever removed by
    # an update, so the staged copy has at least every original line and ends
    # with a newline.
    if ! _envf_staged_complete "$file" "$tmp"; then
        rm -f "$tmp"; envf_err "the staged update of ${file} is incomplete (disk full?); nothing was changed"; return 1
    fi
    local expected got
    for ((i = 0; i < n; i++)); do
        if [[ "${actions[i]}" == "unset" ]]; then
            if envf_get "$tmp" "${keys[i]}" >/dev/null; then
                rm -f "$tmp"; envf_err "staged update still assigns ${keys[i]}"; return 1
            fi
            continue
        fi
        expected="$(_envf_unrender "${values[i]}")"
        got="$(envf_get "$tmp" "${keys[i]}")" || got=$'\x01missing'
        if [[ "$got" != "$expected" ]]; then
            rm -f "$tmp"; envf_err "staged update does not read back ${keys[i]} correctly"; return 1
        fi
    done

    chmod --reference="$file" "$tmp" 2>/dev/null || chmod 600 "$tmp"
    [[ "$(id -u)" -eq 0 ]] && chown --reference="$file" "$tmp" 2>/dev/null || true
    cp -p -- "$file" "${file}.bak" 2>/dev/null || { rm -f "$tmp"; envf_err "cannot back up ${file}"; return 1; }

    if envf_atomic_layout "$file"; then
        sync -- "$tmp" 2>/dev/null || true
        if ! mv -f -- "$tmp" "$file"; then
            rm -f "$tmp"; envf_err "cannot replace ${file}"; return 1
        fi
        sync -- "$dir" 2>/dev/null || true
    else
        # Legacy layout: rewrite in place to keep a single-file bind mount
        # attached. Not crash-atomic; the .bak copy is the recovery path.
        _envf_inplace_write "$file" "$tmp" || return
    fi
    return 0
}

# True when STAGED has at least as many lines as FILE and ends with a newline.
_envf_staged_complete() {
    local file="$1" staged="$2" old new
    [[ -s "$staged" ]] || return 1
    [[ "$(tail -c1 -- "$staged" | od -An -tx1 | tr -d ' \n')" == "0a" ]] || return 1
    old="$(wc -l < "$file")"
    new="$(wc -l < "$staged")"
    (( new >= old ))
}

# _envf_inplace_write FILE STAGED — the legacy single-file write, hardened for
# a full disk. Needs FILE.bak to hold the previous content already. Status: 0
# written; 1 not written or written-and-restored (FILE holds the previous
# content); 4 the write AND the restore failed: FILE may be damaged and
# FILE.bak holds the intact previous content.
_envf_inplace_write() {
    local file="$1" staged="$2" need avail
    need="$(stat -c %s -- "$staged")"
    avail="$(df -B1 --output=avail -- "$(dirname "$file")" 2>/dev/null | tail -n1 | tr -d ' ')"
    if [[ "${CHENGOS_NPM_TEST_INSECURE:-0}" == "1" && "${ENVF_TEST_SKIP_SPACE_CHECK:-0}" == "1" ]]; then
        avail="" # test hook: exercise the failure path below with a real ENOSPC
    fi
    # Truncating FILE frees its blocks, but a larger new version still needs
    # room; refuse before touching it rather than half-writing it.
    if [[ "$avail" =~ ^[0-9]+$ ]] && (( avail < need + 65536 )); then
        rm -f -- "$staged"
        envf_err "not enough free space next to ${file} (${avail} bytes free, ${need} needed); nothing was changed"
        return 1
    fi
    if cat -- "$staged" > "$file" 2>/dev/null; then
        rm -f -- "$staged"
        sync -- "$file" 2>/dev/null || true
        return 0
    fi
    # The write failed part-way. Free the staged copy first so the restore has
    # room, restore in place (same inode), and verify it.
    rm -f -- "$staged"
    if cat -- "${file}.bak" > "$file" 2>/dev/null \
        && [[ "$(sha256sum < "$file")" == "$(sha256sum < "${file}.bak")" ]]; then
        sync -- "$file" 2>/dev/null || true
        envf_err "write to ${file} failed (disk full?); the previous content was restored"
        return 1
    fi
    envf_err "write to ${file} failed AND restoring it failed: the intact previous content is in ${file}.bak; copy it back once space is available (cp ${file}.bak ${file})"
    return 4
}

# envf_replace_file TARGET STAGED [--if-absent]
#
# Commits a complete, already-validated file (e.g. a freshly generated .env)
# under the same lock and layout rules as envf_set. With --if-absent the commit
# is refused (status 3) when TARGET appeared meanwhile: the existence check and
# the write happen under one lock, so two generators cannot both "create" it.
# STAGED must live in TARGET's directory; it is consumed on success.
envf_replace_file() {
    local target="$1" staged="$2" mode="${3:-}"
    local canonical
    canonical="$(envf_canonical "$target")"
    [[ -f "$staged" ]] || { envf_err "staged file ${staged} is missing"; return 1; }
    envf_with_lock "$canonical" _envf_replace_locked "$canonical" "$staged" "$mode"
}

_envf_replace_locked() {
    local file="$1" staged="$2" mode="$3"
    if [[ -e "$file" ]]; then
        if [[ "$mode" == "--if-absent" ]]; then
            envf_err "${file} already exists"
            return 3
        fi
        chmod --reference="$file" "$staged" 2>/dev/null || chmod 600 "$staged"
        [[ "$(id -u)" -eq 0 ]] && chown --reference="$file" "$staged" 2>/dev/null || true
        cp -p -- "$file" "${file}.bak" 2>/dev/null || { envf_err "cannot back up ${file}"; return 1; }
        if ! envf_atomic_layout "$file"; then
            # Legacy layout: keep the inode a single-file bind mount holds.
            _envf_inplace_write "$file" "$staged"
            return
        fi
    else
        chmod 600 "$staged" 2>/dev/null || true
    fi
    sync -- "$staged" 2>/dev/null || true
    mv -f -- "$staged" "$file" || { envf_err "cannot replace ${file}"; return 1; }
    sync -- "$(dirname "$file")" 2>/dev/null || true
}

# Inverse of envf_render_value for the read-back check.
_envf_unrender() {
    local v="$1"
    if [[ ${#v} -ge 2 && "${v:0:1}" == "'" && "${v: -1}" == "'" ]]; then
        printf '%s' "${v:1:${#v}-2}"
    else
        printf '%s' "$v"
    fi
}

# ── Layout: legacy `<shared>/.env` vs migrated `<shared>/env/.env` ───────────

# Prints one of: migrated, legacy, split, missing.
envf_layout() {
    local shared="$1"
    local link="${shared}/.env" real="${shared}/env/.env"
    if [[ -L "$link" ]]; then
        if [[ -f "$real" && "$(envf_canonical "$link")" == "$(envf_canonical "$real")" ]]; then
            printf 'migrated\n'
        else
            printf 'split\n'
        fi
    elif [[ -f "$link" ]]; then
        if [[ -e "$real" ]]; then printf 'split\n'; else printf 'legacy\n'; fi
    elif [[ -f "$real" ]]; then
        printf 'split\n'
    else
        printf 'missing\n'
    fi
}

# Moves `<shared>/.env` to `<shared>/env/.env` and leaves a relative
# compatibility symlink. GID, when given, is the API container's runtime group:
# the directory and file become group-writable so the settings panel can write
# from inside the container. Run only while the backend is stopped (or right
# before it is recreated): a backend that still holds the old path would write
# through the link correctly, but the plan ties the move to a restart.
envf_migrate() {
    local shared="$1" gid="${2:-}"
    local layout
    layout="$(envf_layout "$shared")"
    case "$layout" in
        migrated) return 0 ;;
        legacy) ;;
        *) envf_err "cannot migrate .env: layout is '${layout}' in ${shared}"; return 1 ;;
    esac
    local legacy="${shared}/.env"
    legacy="$(envf_canonical "$legacy")"
    envf_with_lock "$legacy" _envf_migrate_locked "$shared" "$gid"
}

_envf_migrate_locked() {
    local shared="$1" gid="$2"
    local envdir="${shared}/env"
    ( umask 077; mkdir -p "$envdir" ) || { envf_err "cannot create ${envdir}"; return 1; }
    [[ "$(id -u)" -eq 0 ]] && chown --reference="${shared}/.env" "$envdir" 2>/dev/null || true
    if ! mv -- "${shared}/.env" "${envdir}/.env"; then
        envf_err "cannot move .env into ${envdir}"; return 1
    fi
    if ! ln -s "env/.env" "${shared}/.env"; then
        mv -- "${envdir}/.env" "${shared}/.env"
        envf_err "cannot create the compatibility link; .env left in place"; return 1
    fi
    if [[ -n "$gid" ]]; then
        if ! { chgrp "$gid" "$envdir" "${envdir}/.env" && chmod 0770 "$envdir" && chmod 0660 "${envdir}/.env"; }; then
            # Never leave a half-migrated layout behind: undo the move so the
            # caller's "layout unchanged" is true.
            rm -f -- "${shared}/.env"
            mv -- "${envdir}/.env" "${shared}/.env" \
                || { envf_err "cannot grant group ${gid} access, and moving .env back failed: it is at ${envdir}/.env"; return 2; }
            rmdir -- "$envdir" 2>/dev/null || true
            envf_err "cannot grant group ${gid} access to ${envdir}; the move was rolled back"
            return 1
        fi
        if ! { ( umask 007; : >> "${envdir}/.env.lock" ) && chgrp "$gid" "${envdir}/.env.lock" \
            && chmod 0660 "${envdir}/.env.lock"; }; then
            envf_err "warning: could not prepare ${envdir}/.env.lock for group ${gid}"
        fi
    else
        chmod 0700 "$envdir"
    fi
    sync -- "$shared" "$envdir" 2>/dev/null || true
    return 0
}

# Reverses envf_migrate (for operators who need the previous layout back).
envf_unmigrate() {
    local shared="$1"
    [[ "$(envf_layout "$shared")" == "migrated" ]] || { envf_err "${shared} is not in the migrated layout"; return 1; }
    local real="${shared}/env/.env"
    envf_with_lock "$real" _envf_unmigrate_locked "$shared"
}

_envf_unmigrate_locked() {
    local shared="$1"
    rm -f -- "${shared}/.env" || return 1
    mv -- "${shared}/env/.env" "${shared}/.env" || { ln -s "env/.env" "${shared}/.env"; return 1; }
    chmod 0600 "${shared}/.env" 2>/dev/null || true
    return 0
}
