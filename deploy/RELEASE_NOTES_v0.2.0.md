# ChengOS v0.2.0 Release Notes

> Release Date: 2026-09-20
> Previous Version: v0.1.2

---

## Overview

v0.2.0 is a packaging and deployment release. Its headline is that ChengOS now
ships **real installers** instead of a source checkout: a **desktop application**
with an embedded engine, an **Android mobile app**, and native **`.deb` / `.rpm`**
packages for Linux (plus **`.msi`** on Windows). Alongside the installers, this
release hardens the self-hosted deployment path — a Cloudflare Tunnel origin, a
configurable trusted-proxy set and listen interface, and a `chengos.sh doctor`
diagnostic — and unifies every component under a single `0.2.0` version.

---

## New Features

### 1. Desktop Application — ChengFlow Desktop (chengflow-ui)

**Files:** `src-tauri/tauri.conf.json`, `scripts/build-desktop.sh`, `scripts/fetch-desktop-deps.py`, `.github/workflows/desktop.yml`

- **Self-contained desktop app:** The visual workflow editor and its execution engine now run on the user's own machine with an **embedded PostgreSQL** database — no server to deploy and no account required
- **Native packages:** Tauri bundles `deb`, `rpm`, and `msi` targets; the Linux build is produced by `scripts/build-desktop.sh` and the Windows MSI by the builder VM
- **Pinned dependencies:** `fetch-desktop-deps.py` stages PostgreSQL and ffmpeg/ffprobe, each pinned by exact URL **and** SHA-256, so a bundle is reproducible and a corrupt cache entry is re-downloaded and re-verified
- **Checksummed output:** `build-desktop.sh --output <dir>` collects the produced packages together with a `.sha256` per file and a `desktop-resources-manifest.json`
- **CI packaging:** `.github/workflows/desktop.yml` builds on `ubuntu-22.04` and `windows-latest`, verifies the bundled PostgreSQL actually starts (`full_postgres_lifecycle`), and uploads the `deb` / `rpm` / `msi` artifacts

### 2. Mobile Application — ChengApp for Android (chengapp)

**Files:** `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/gen/android/`, `scripts/android-dev.sh`

- **Android build support:** Full Tauri Android project (Gradle wrapper, `build.gradle.kts`, AndroidManifest, launcher icons mdpi→xxxhdpi, Kotlin `MainActivity`) with `minSdkVersion 24`
- **Mobile entry point:** `src-tauri` is now a `staticlib` / `cdylib` / `rlib` crate so the Android activity can load it and call `chengapp_lib::run` through `#[tauri::mobile_entry_point]`
- **Platform-conditional modules:** Desktop-only modules (mDNS discovery, single-instance `Emitter`, local server binding) are `#[cfg(desktop)]`-gated; mobile reaches groups through the hosted Coordinator instead of a local server
- **Build / sign / install helper:** `scripts/android-dev.sh` builds the release APK, signs it (Gradle keystore, falling back to the debug keystore), installs it, and launches it on the emulator
- **Release builds strip symbols:** `[profile.release] strip = "symbols"` keeps the Android `.so` from carrying ~10MB of DWARF that nothing on a device reads

### 3. ChengApp Desktop Client (chengapp)

**Files:** `src-tauri/tauri.conf.json`, `scripts/tauri-env.mjs`, `build.sh`

- **Linux packages:** `deb` and `rpm` bundles with a shared `linux/chengapp.desktop` template
- **Windows installer:** WiX MSI with `en-US` and `zh-CN` languages
- **Build environment wrapper:** `scripts/tauri-env.mjs` sets the client build environment (`CHENGAPP_CHENGID_URL`, and `WEBKIT_DISABLE_DMABUF_RENDERER` on Linux) and forwards `--bundles deb,rpm` and friends to the Tauri CLI
- **Server bundle:** `build.sh --bundle` assembles the Coordinator binaries, ChengID web pages, migrations, and deploy assets into a versioned `chengapp-linux-amd64-vX.Y.Z.tar.gz` with a `.sha256`

### 4. Deployment Hardening (deploy)

**Files:** `deploy/chengos.sh`, `deploy/README.md`, `deploy/HARDENING.md`, `.github/workflows/release-checks.yml`

- **`chengos.sh doctor`:** New diagnostic command that inspects an installed system and reports configuration problems before they become outages
- **Cloudflare Tunnel origin:** Added a supported path for fronting the origin with a Cloudflare Tunnel, closing the native servers' scan hole and wiring the Cloudflare edge
- **Configurable edge:** The trusted-proxy set and the listen interface are now configurable rather than hard-coded
- **Native installs no longer expose the API directly:** The API is bound behind the edge instead of being reachable on the public interface
- **Release gates & migration checks:** Cloud trial runtime config, release gates, and migration checks added to the release contract

### 5. Version Unification & Port Change

**Files:** `VERSION`, `release.sh`, `scripts/check-release-consistency.sh`

- **Single version source:** `VERSION` is authoritative and `release.sh` synchronizes the Cargo workspace versions and tags every source repository (`chengflow`, `chengflow-ui`, `chengapp`, `chengflow-sdk`) with the same release tag
- **Backend port:** The backend port is now **19225**

---

## Infrastructure

### Release Contract

- `scripts/check-release-consistency.sh` validates that `VERSION`, the Cargo manifests, and the tag agree before a release is cut
- The native archive now requires `ui-server`, `app-server`, and `http-hardening` to be present, so a bundle that silently lacks a component fails the gate instead of failing at runtime

### CI

- `.github/workflows/desktop.yml` packages the desktop app on demand and on `v*` tags
- `release-checks.yml` validates the release contract

---

## Upgrade Instructions

### From v0.1.2

```bash
# Online update
./chengos.sh update

# Or manual upgrade from local build
./chengflow/build.sh --hybrid
# Transfer dist/chengos-full-linux-amd64-v0.2.0.tar.gz to server
./chengos.sh update
```

### Desktop Application

```bash
# Linux (.deb / .rpm)
cd chengflow-ui
bash scripts/build-desktop.sh --bundles deb,rpm --output ../output/desktop/linux

# Windows: build the MSI inside the builder VM (build-desktop-windows.ps1)
```

### Mobile Application (Android)

```bash
cd chengapp
./scripts/android-dev.sh          # build + sign + install + launch
./scripts/android-dev.sh build    # build only
```

### Fresh Install

```bash
# Native binary mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash -s -- --mode native

# Docker mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash
```

---

## Known Limitations

- macOS desktop packaging is out of scope until there is a signing identity and a notarization step
- ChengApp Android build is functional but not yet published to app stores
- The Windows desktop MSI is built inside the builder VM rather than cross-compiled from Linux
- Node preset UI selection panel is still under development
- Routing shortcut UI toggle is not yet complete

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
