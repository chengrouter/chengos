"""Registry metadata and archive checks for direct npm provisioning.

Invoked by lib/npm-registry.sh as `python3 -I npm_registry.py <command> ...`
(isolated mode: no user site, no script-dir imports from the working dir).
Standard library only. Every command prints `key=value` lines on success and
a single human-readable reason on stderr with a non-zero exit on refusal.

Commands
  resolve PACKUMENT PLATFORM MIN_AGE_DAYS NOW_EPOCH SELECTOR
      SELECTOR is `stable` (newest stable release at least MIN_AGE_DAYS old)
      or an exact stable version. Only `X.Y.Z` versions are candidates:
      platform builds (`X.Y.Z-linux-x64`) and channels (`-alpha.N`) are
      semver pre-releases and are never top-level versions.
  key-pem KEYS_JSON KEYID PUBLISHED_ISO
      PEM of a pinned registry key that was valid when the version was
      published (npm semantics: `expires` null or later than publication).
  check-archive TGZ TARGET
      Accepts only regular files and directories under
      `package/vendor/<TARGET>/`, plus regular top-level files (package.json,
      README, LICENSE) that are never installed.
  check-layout TARGET_DIR VERSION TARGET
      Validates the vendor layout manifest `codex-package.json`.
"""

import datetime
import json
import posixpath
import re
import stat
import sys
import tarfile

STABLE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")
KNOWN_LAYOUT_VERSIONS = {1}
MAX_MEMBERS = 10_000


def refuse(message, code=2):
    print(message, file=sys.stderr)
    sys.exit(code)


def parse_time(value):
    try:
        return datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, ValueError):
        return None


def version_key(version):
    return tuple(int(part) for part in version.split("."))


def emit(**fields):
    for key, value in fields.items():
        text = str(value)
        if "\n" in text or "\r" in text:
            refuse(f"refusing a multi-line value for {key}")
        print(f"{key}={text}")


def cmd_resolve(packument_path, platform, min_age_days, now_epoch, selector):
    with open(packument_path, encoding="utf-8") as handle:
        doc = json.load(handle)
    versions = doc.get("versions") or {}
    times = doc.get("time") or {}
    min_age = datetime.timedelta(days=float(min_age_days))
    now = datetime.datetime.fromtimestamp(int(now_epoch), tz=datetime.timezone.utc)

    def candidate(version):
        """(published, platform_version) or None when unusable."""
        if not STABLE.match(version) or version not in versions:
            return None
        platform_version = f"{version}-{platform}"
        if platform_version not in versions:
            return None
        main = parse_time(times.get(version))
        plat = parse_time(times.get(platform_version))
        if main is None or plat is None:
            return None
        return max(main, plat), platform_version

    if selector == "stable":
        chosen = None
        for version in sorted((v for v in versions if STABLE.match(v)), key=version_key, reverse=True):
            found = candidate(version)
            if found and now - found[0] >= min_age:
                chosen = (version,) + found
                break
        if chosen is None:
            refuse(f"no stable release with a {platform} build is at least {min_age_days} days old")
    else:
        if not STABLE.match(selector):
            refuse(f"'{selector}' is not an exact stable version (X.Y.Z)")
        found = candidate(selector)
        if found is None:
            refuse(f"version {selector} or its {platform} build is not published")
        chosen = (selector,) + found

    version, published, platform_version = chosen
    meta = versions[platform_version]
    dist = meta.get("dist") or {}
    integrity = dist.get("integrity", "")
    tarball = dist.get("tarball", "")
    if not integrity.startswith("sha512-") or not tarball:
        refuse(f"{platform_version} has no sha512 integrity or tarball in the registry metadata")
    if meta.get("scripts"):
        refuse(f"{platform_version} declares install scripts; the platform build is expected to have none")
    age = now - published
    emit(
        version=version,
        platform_version=platform_version,
        published=published.strftime("%Y-%m-%dT%H:%M:%SZ"),
        age_days=f"{age.total_seconds() / 86400:.1f}",
        within_window="true" if age < min_age else "false",
        tarball=tarball,
        integrity=integrity,
        attestations="present" if dist.get("attestations") else "absent",
    )
    for sig in dist.get("signatures") or []:
        keyid, value = sig.get("keyid", ""), sig.get("sig", "")
        if keyid and value and " " not in keyid and re.match(r"^[A-Za-z0-9+/=]+$", value):
            print(f"sig={keyid} {value}")


def cmd_key_pem(keys_path, keyid, published_iso):
    with open(keys_path, encoding="utf-8") as handle:
        keys = json.load(handle).get("keys") or []
    published = parse_time(published_iso)
    if published is None:
        refuse("unreadable publication time")
    for key in keys:
        if key.get("keyid") != keyid:
            continue
        if key.get("keytype") != "ecdsa-sha2-nistp256":
            refuse(f"pinned key {keyid} has an unsupported type", 3)
        expires = key.get("expires")
        if expires is not None:
            limit = parse_time(expires)
            if limit is None or published >= limit:
                refuse(f"pinned key {keyid} had expired when this version was published", 3)
        body = key.get("key", "")
        if not re.match(r"^[A-Za-z0-9+/=]+$", body):
            refuse(f"pinned key {keyid} is malformed", 3)
        lines = [body[i:i + 64] for i in range(0, len(body), 64)]
        print("-----BEGIN PUBLIC KEY-----")
        print("\n".join(lines))
        print("-----END PUBLIC KEY-----")
        return
    refuse(f"signature key {keyid} is not pinned", 3)


def cmd_check_archive(tgz_path, target):
    prefix = f"package/vendor/{target}/"
    seen = 0
    entrypoint = False
    with tarfile.open(tgz_path, "r:gz") as archive:
        for member in archive:
            seen += 1
            if seen > MAX_MEMBERS:
                refuse("archive has too many entries")
            name = member.name
            norm = posixpath.normpath(name)
            if name.startswith("/") or norm.startswith("..") or "/../" in f"/{name}/":
                refuse(f"unsafe path in archive: {name}")
            if not (member.isreg() or member.isdir()):
                refuse(f"archive entry is not a regular file or directory: {name}")
            if member.mode & (stat.S_ISUID | stat.S_ISGID | stat.S_ISVTX):
                refuse(f"archive entry carries setuid/setgid/sticky bits: {name}")
            if norm in ("package", "package/vendor", f"package/vendor/{target}") and member.isdir():
                continue
            # Top-level package files (package.json, README, LICENSE) are
            # validated like everything else but never installed: only the
            # vendor target directory is moved into place.
            if posixpath.dirname(norm) == "package" and member.isreg():
                continue
            if not (norm + "/").startswith(prefix) and not norm.startswith(prefix):
                refuse(f"unexpected archive entry outside the {target} vendor directory: {name}")
            if norm == f"{prefix}bin/codex" and member.isreg():
                entrypoint = True
    if not entrypoint:
        refuse(f"archive has no {prefix}bin/codex")
    emit(entries=seen)


def cmd_check_layout(target_dir, version, target):
    try:
        with open(posixpath.join(target_dir, "codex-package.json"), encoding="utf-8") as handle:
            manifest = json.load(handle)
    except (OSError, ValueError) as exc:
        refuse(f"unreadable codex-package.json: {exc}")
    layout = manifest.get("layoutVersion")
    if layout not in KNOWN_LAYOUT_VERSIONS:
        refuse(f"unknown vendor layoutVersion {layout!r}; this installer knows {sorted(KNOWN_LAYOUT_VERSIONS)}")
    for field, want in (("version", version), ("target", target), ("entrypoint", "bin/codex")):
        if manifest.get(field) != want:
            refuse(f"codex-package.json {field} is {manifest.get(field)!r}, expected {want!r}")
    emit(
        layout_version=layout,
        resources_dir=manifest.get("resourcesDir", ""),
        path_dir=manifest.get("pathDir", ""),
    )


COMMANDS = {
    "resolve": (cmd_resolve, 5),
    "key-pem": (cmd_key_pem, 3),
    "check-archive": (cmd_check_archive, 2),
    "check-layout": (cmd_check_layout, 3),
}


def main(argv):
    if len(argv) < 2 or argv[1] not in COMMANDS:
        refuse("usage: npm_registry.py {resolve|key-pem|check-archive|check-layout} ...", 1)
    func, arity = COMMANDS[argv[1]]
    if len(argv) - 2 != arity:
        refuse(f"{argv[1]} takes {arity} arguments", 1)
    try:
        func(*argv[2:])
    except (OSError, ValueError, tarfile.TarError) as exc:
        refuse(f"{argv[1]} failed: {exc}")


if __name__ == "__main__":
    main(sys.argv)
