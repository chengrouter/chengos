"""Registry metadata and archive checks for direct npm provisioning.

Invoked by lib/npm-registry.sh as `python3 -I npm_registry.py <command> ...`
(isolated mode: no user site, no script-dir imports from the working dir).
Standard library only. Every command prints `key=value` lines on success and
a single human-readable reason on stderr with a non-zero exit on refusal.

Commands
  resolve PACKUMENT PLATFORM MIN_AGE_DAYS NOW_EPOCH SELECTOR
      Resolve an npm package whose top-level version has a platform build.
      SELECTOR is `stable` or an exact stable version (`X.Y.Z`).
  resolve-package PACKUMENT NAME MIN_AGE_DAYS NOW_EPOCH SELECTOR OS CPU
      Resolve a platform-specific npm package and verify its OS/CPU metadata.
  key-pem KEYS_JSON KEYID PUBLISHED_ISO
      Return a pinned registry key valid when the version was published.
  check-archive TGZ TARGET
      Validate the Codex vendor archive layout before extraction.
  check-layout TARGET_DIR VERSION TARGET
      Validate the Codex vendor layout manifest `codex-package.json`.
  check-claude-archive TGZ NAME VERSION
      Accept only Claude's native binary and the package metadata files, and
      verify the package identity and version before extraction.
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


def cmd_resolve_package(packument_path, name, min_age_days, now_epoch, selector, os_name, cpu):
    with open(packument_path, encoding="utf-8") as handle:
        doc = json.load(handle)
    versions = doc.get("versions") or {}
    times = doc.get("time") or {}
    min_age = datetime.timedelta(days=float(min_age_days))
    now = datetime.datetime.fromtimestamp(int(now_epoch), tz=datetime.timezone.utc)

    def candidate(version):
        if not STABLE.match(version) or version not in versions:
            return None
        return parse_time(times.get(version))

    if selector == "stable":
        selected = None
        for version in sorted((v for v in versions if STABLE.match(v)), key=version_key, reverse=True):
            published = candidate(version)
            if published is not None and now - published >= min_age:
                selected = (version, published)
                break
        if selected is None:
            refuse(f"no {name} release is at least {min_age_days} days old")
    else:
        if not STABLE.match(selector):
            refuse(f"'{selector}' is not an exact stable version (X.Y.Z)")
        published = candidate(selector)
        if published is None:
            refuse(f"version {selector} of {name} is not published")
        selected = (selector, published)

    version, published = selected
    meta = versions[version]
    if meta.get("name") != name:
        refuse(f"registry entry {version} has unexpected package name {meta.get('name')!r}")
    if os_name not in (meta.get("os") or []):
        refuse(f"{name}@{version} does not declare the required OS {os_name}")
    if cpu not in (meta.get("cpu") or []):
        refuse(f"{name}@{version} does not declare the required CPU {cpu}")
    if meta.get("scripts"):
        refuse(f"{name}@{version} declares install scripts; they are never run")
    dist = meta.get("dist") or {}
    integrity = dist.get("integrity", "")
    tarball = dist.get("tarball", "")
    if not integrity.startswith("sha512-") or not tarball:
        refuse(f"{name}@{version} has no sha512 integrity or tarball in the registry metadata")
    age = now - published
    emit(
        version=version,
        platform_version=version,
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


def cmd_check_claude_archive(tgz_path, name, version):
    allowed = {
        "package/claude",
        "package/package.json",
        "package/README.md",
        "package/LICENSE.md",
    }
    seen = set()
    binary = False
    with tarfile.open(tgz_path, "r:gz") as archive:
        for member in archive:
            if len(seen) >= 16:
                refuse("Claude archive has too many entries")
            raw = member.name
            norm = posixpath.normpath(raw)
            if raw.startswith("/") or norm.startswith("..") or "/../" in f"/{raw}/":
                refuse(f"unsafe path in Claude archive: {raw}")
            if norm == "package" and member.isdir():
                continue
            if norm not in allowed or not member.isreg():
                refuse(f"unexpected entry in Claude archive: {raw}")
            if member.mode & (stat.S_ISUID | stat.S_ISGID | stat.S_ISVTX):
                refuse(f"Claude archive entry carries special mode bits: {raw}")
            if norm in seen:
                refuse(f"duplicate Claude archive entry: {raw}")
            seen.add(norm)
            if norm == "package/claude":
                if member.size < 1024 * 1024 or member.size > 400 * 1024 * 1024:
                    refuse("Claude binary has an implausible size")
                if not member.mode & 0o111:
                    refuse("Claude binary is not marked executable in the archive")
                binary = True
            elif norm == "package/package.json":
                content = archive.extractfile(member)
                try:
                    package = json.load(content)
                except (OSError, ValueError, TypeError):
                    refuse("unreadable Claude package.json")
                if package.get("name") != name or package.get("version") != version:
                    refuse("Claude archive package identity does not match the selected release")
    if not binary or seen != allowed:
        refuse("Claude archive is missing the native binary or expected package metadata")
    emit(entries=len(seen), binary="package/claude")


COMMANDS = {
    "resolve": (cmd_resolve, 5),
    "resolve-package": (cmd_resolve_package, 7),
    "check-claude-archive": (cmd_check_claude_archive, 3),
    "key-pem": (cmd_key_pem, 3),
    "check-archive": (cmd_check_archive, 2),
    "check-layout": (cmd_check_layout, 3),
}


def main(argv):
    if len(argv) < 2 or argv[1] not in COMMANDS:
        refuse("usage: npm_registry.py {resolve|resolve-package|key-pem|check-archive|check-layout|check-claude-archive} ...", 1)
    func, arity = COMMANDS[argv[1]]
    if len(argv) - 2 != arity:
        refuse(f"{argv[1]} takes {arity} arguments", 1)
    try:
        func(*argv[2:])
    except (OSError, ValueError, tarfile.TarError) as exc:
        refuse(f"{argv[1]} failed: {exc}")


if __name__ == "__main__":
    main(sys.argv)
