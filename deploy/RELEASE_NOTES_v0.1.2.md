# ChengOS v0.1.2 Release Notes

> Release Date: 2026-08-22
> Previous Version: v0.1.1

---

## Overview

v0.1.2 is a patch release spanning two days of development across **chengflow** (backend), **chengflow-ui** (frontend), and **chengapp** (desktop/mobile app). This release focuses on **message compression & port schema validation**, **approval whitelist persistence fixes**, **think/tool-call rendering fixes**, **execution archive trace excerpts**, **ChengApp Android build support**, and the **web translation browser extension**.

---

## Bug Fixes

### 1. Approval Whitelist Persistence (chengflow)

**Files:** `loop_driver.rs`, `conversation.rs`, `tool_call_approval.rs`, `approval_gate.rs`

Fixed the issue where "始终允许" (always allow) approvals were silently lost mid-task, causing the approval card to reappear for actions the user had already blanket-approved:

- **Root cause:** `loop_driver` persisted the compressed-history budget by reading the entire conversation context, mutating it, and calling `conv_repo.update()` — a whole-conversation save that overwrote context another writer (the approval whitelist) had changed concurrently
- **Fix:** Replaced the whole-conversation save with `conv_repo.set_context_key()`, which patches the single key in SQL and cannot clobber other context fields
- **Whitelist API:** Exposed `APPROVAL_WHITELIST_CONTEXT_KEY` and added `Conversation::approval_whitelist_value_with()` so the approval gate can persist whitelist rules through the same single-key path
- **Session whitelist flag:** Added `session_whitelist: true` to all `ApprovalGateRequest` constructors for file_ops, workspace tools, and batch operations

### 2. Think / Tool-Call Rendering (chengflow + chengflow-ui)

**Files:** `MessageBubble.tsx`, `assistantPresentation.ts`, `executionTrace.ts`, `useMessages.ts`

- **Think 显示再次修复:** Fixed rendering of `<think>` blocks and tool-call lifecycle in assistant messages
- **Tool-call merge bug:** Fixed `mergeToolCallSteps` where two calls to the same tool both matched the same trace step, causing the second call to silently replace the first — added a `claimed` set so each step absorbs at most one lifecycle call
- **Empty output handling:** A completed tool call with no output now shows "已完成，工具未返回内容" instead of being dropped into the same bucket as a real result
- **Merge preservation:** Lifecycle events arriving without output no longer blank out existing result detail/lines/raw fields — whichever side carries the tool's output wins
- **Raw payload display:** Added `rawDisplay()` helper to show pretty-printed JSON payloads (truncated at `MAX_RAW_CHARS`) alongside structured trace lines

### 3. Presentation Recovery Race (chengflow-ui)

**Files:** `useMessages.ts`, `useMessages.recovery.test.tsx`

Fixed the race where in-flight presentation recovery was discarded or clobbered fresher data whenever `allMessages` changed (which happens constantly during WebSocket streaming):

- **Archive-first handoff:** The durable archive (detail projection) is now the primary source for persisted turns; the transient trace snapshot only covers turns without an archive reference, unavailable archives, and stepless archives (pure-reasoning turns)
- **Invariant guards:** Recovery now preserves user-expanded archives, never clobbers renderable trace content with archive-only presentations, and uses `activeConversationIdRef` instead of a cancelled flag
- **Regression tests:** Added 328-line test suite locking the four recovery invariants and the archive-first ordering

### 4. Browser & Web Node Fixes (chengflow)

**Files:** `browser/hub.rs`, `web/node.rs`, `ssh_host_key.rs`

- Minor fixes to browser tool hub and web node operations
- SSH host key verification improvements

---

## New Features

### 1. Message Compression Refactor (chengflow)

**Files:** `session_store.rs`, `conversation.rs`, `archive_policy.rs`, `node.rs`, `validator.rs`, `port_schema_validation.rs`, `workflow_port_validation.rs`

- **Compression policy refactor:** Rewrote `session_store.rs` turn projection with a new `fold_trigger_chars` field and `reduction_order` that prioritizes turns with recoverable handles (archive refs or trace keys) over handle-less turns — folding an archived turn is reversible (the model can expand it via `get_execution_trace`), while reducing a handle-less turn is lossy
- **Archive policy reasoning tiers:** Replaced `include_reasoning_summary: bool` with `ArchiveReasoningMode` enum (`None`/`Summary`/`FullBounded`), adding a `trace_excerpt_included` field to `ArchivePolicyStamp` with backward-compatible deserialization for legacy stamps
- **Port schema validation:** New `PortSchemaIndex` and `NodePortSchemas` types in `validator.rs` provide authoritative input/output JSON Schema lookups from the node registry, replacing stale editor-written snapshots. Added port introspection helpers (`port_descriptor`, `port_names`, `schema_has_port`, `schema_port_type`, `schema_port_required`, `schema_port_has_default`, `schema_accepts_dynamic_port`) in `domain/node.rs` that accept both JSON Schema and port descriptor array shapes
- **Dynamic array port support:** `schema_accepts_dynamic_port()` recognizes `x-dynamic-array` extension ports (e.g. agent `tool_0`, `tool_1` slots) so per-slot validation does not flag them as unknown
- **Test coverage:** Added 562-line `port_schema_validation.rs` integration test and 161-line `workflow_port_validation.rs` test

### 2. Execution Archive Trace Excerpts (chengflow)

**Files:** `execution_archive_builder.rs`, `loop_driver.rs`, `types.rs`

- **Per-step trace excerpts:** The execution archive now captures a bounded, human-facing trace excerpt for each archived step — the trace lines that appeared since the previous archive write
- **Cursor tracking:** Added `trace_archived_cursor` field to `ReactContext` to track byte offset into `trace` already handed to the archive; advanced unconditionally at each archive write point so a step that archives nothing does not push its lines onto the next step
- **Byte budget safety:** The excerpt is display-only garnish — when the byte budget cannot absorb it, the excerpt is dropped (not the step), preserving the structured step's place in the archive

### 3. Approval Auto-Confirm Client Cache (chengflow-ui)

**Files:** `approvalAutoConfirm.ts`, `ApprovalCard.tsx`, `ApprovalCard.test.tsx`

- **Client-side always-allow memory:** Added `sessionStorage`-backed client cache as a second line of defence behind the backend's conversation-level approval whitelist
- **Risk-level guard:** Refuses to replay an approval when the incoming request is riskier than what was approved (e.g. a medium-risk "always allow" cannot silently clear a critical-risk request sharing the same action name)
- **Session-scoped:** Rules live in `sessionStorage` — closing the tab forgets everything, so a blanket approval can never outlive the working session
- **Test coverage:** Added ApprovalCard test suite covering auto-confirm happy path and risk-level escalation guard

### 4. ChengApp Android Build (chengapp)

**Files:** `src-tauri/gen/android/`, `lib.rs`, `main.rs`, `chat.rs`, `translate.rs`, `auth_login.rs`, `lan.rs`, `tauri.ts`

- **Android project scaffold:** Full Tauri Android build configuration — Gradle wrapper, `build.gradle.kts`, AndroidManifest, launcher icons (mdpi→xxxhdpi), Kotlin `MainActivity`, `BuildTask.kt`, and `RustPlugin.kt`
- **Platform-conditional modules:** Desktop-only modules (`group_agent_worker`, `lan_worker`, mDNS discovery, single-instance `Emitter`) are now `#[cfg(desktop)]`-gated; mobile reaches groups through the hosted Coordinator instead of a local server
- **Mobile sandbox root:** Added `app_private_root()` for mobile builds that resolves the app-private data directory as the only writable workspace root, with `resolve_sandbox_root()` dispatching to the correct validator per platform
- **Windows escape tests:** Added `#[cfg(windows)]` junction/symlink canonicalization tests for sandbox root validation
- **Module extraction:** Extracted 891 lines from `main.rs` into `lib.rs` to enable Tauri mobile builds (which require a `lib` target)

### 5. Web Translation Browser Extension (chengapp)

**Files:** `extensions/cheng-translate/`, `translate.rs`, `TranslatePage.tsx`, `web-translation-extension-plan.md`, `android-windows-support-plan.md`

- **Chrome extension:** New `cheng-translate` extension with manifest, background service worker, content script (floating selection trigger), side panel UI (sidebar.html/css/js), and API/storage/page libraries
- **Selection translation:** Content script injects a floating button on text selection; background worker performs the API call (content scripts cannot call the translate endpoint directly due to origin restrictions)
- **Page translation:** Side panel handles whole-page translation with progress polling
- **Backend:** 2196-line `translate.rs` Tauri module implementing the translation job pipeline
- **Planning docs:** Added `web-translation-extension-plan.md` (180 lines) and `android-windows-support-plan.md` (556 lines)

### 6. Responsive Sidebar (chengapp)

**Files:** `ChatShell.tsx`, `AgentChatPage.tsx`, `LanPage.tsx`, `ProductPage.tsx`

- **Shared sidebar state:** Extracted `useResponsiveSidebar` hook into `ChatShell` so all three chat surfaces (AgentChat, LAN, Product) agree on when there is no room for a sidebar
- **Auto-collapse:** Sidebar automatically collapses on narrow screens

---

## Infrastructure

### i18n Updates

- Added `common.clipboardUnavailable` and `translate.copyFailed` translations (en/zh) for clipboard access error handling

### CLI / TUI

**Files:** `cheng-cli/Cargo.toml`, `api.rs`, `tui/app.rs`, `locales/en.toml`, `locales/zh.toml`

- CLI dependencies and API client updated for new workflow/port validation endpoints
- TUI app module updated with new command support
- Locale strings updated

### Local Executor

**Files:** `cheng-local-executor/Cargo.toml`, `config.rs`, `executor.rs`, `lib.rs`

- Configuration and executor updated to support port schema validation index

---

## Upgrade Instructions

### From v0.1.1

```bash
# Online update
./chengos.sh update

# Or manual upgrade from local build
./chengflow/build.sh --hybrid
# Transfer dist/chengos-full-linux-amd64-v0.1.2.tar.gz to server
./chengos.sh update
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

- Node preset UI selection panel is still under development
- Routing shortcut UI toggle is not yet complete
- ChengApp Android build is functional but not yet published to app stores
- Web translation extension is in preview — additional language pairs and UI refinements planned
- Port schema validation is opt-in via `PortSchemaIndex` — callers without registry access skip per-slot checks

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
