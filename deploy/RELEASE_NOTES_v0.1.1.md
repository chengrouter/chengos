# ChengOS v0.1.1 Release Notes

> Release Date: 2026-08-18
> Previous Version: v0.1.0

---

## Overview

v0.1.1 is a patch release spanning two days of development across **chengflow** (backend), **chengflow-ui** (frontend), **chengapp** (desktop app), and the **chengos** meta repository. This release focuses on **chat workflow binding fixes**, **execution control improvements**, **VPS benchmark node**, **ChengApp group communication architecture**, and **release engineering enhancements**.

---

## Bug Fixes

### 1. Chat Workflow Binding (chengflow-ui)

**Files:** `ChatPreviewPanel.tsx`, `ChatInput.tsx`, `ChatPanel.tsx`, `ChatPreviewPage.tsx`

Fixed the issue where chat message input boxes in `DocumentWorkbenchPage`, `TableWorkbenchPage`, and `AIChatPage` were not correctly bound to the currently edited workflow:

- `ChatPreviewPanel` now uses `selectedWorkflowId` (state) instead of `workflowId` (prop) in all execution paths: `getActiveTabDefinition`, `resolveWorkflowDefinition`, `handleCreateConversation`, `handleClearConversation`, `handleSendMessage`
- `handleModelSelect` rewritten to look up editor tab by `selectedWorkflowId` and fall back to API calls (`getWorkflowLlmNodes` / `updateWorkflowLlmNode`) when no editor tab is found (workbench pages)
- WebSocket conversation binding updated to sync workflow ID on conversation changes

### 2. Execution Control (chengflow + chengflow-ui)

**Files:** `stopEscalation.ts`, `executionStore.ts`, `useExecutionWebSocket.ts`, `useConversationWebSocket.ts`

- **强制停止 (Force Stop):** Implemented stop escalation logic — graceful stop → force stop pipeline
- **聊天长消息恢复为直接发送:** Long chat messages now send directly instead of being queued
- **停止 Bug 修复:** Fixed execution stop not properly propagating to running workflow nodes
- **长文本转 Markdown Bug:** Fixed incorrect markdown conversion for long text content

### 3. Browser & Docs (chengflow)

- **浏览器修复:** Fixed browser tool issues in web node operations
- **Docs 帖子:** Fixed docs posting functionality

---

## New Features

### 1. VPS Benchmark Node (chengflow)

**Files:** `crates/cheng-nodes/src/nodes/builtin/tools/vps_benchmark/node.rs`, `tests/vps_script_smoke.rs`

- New `vps_benchmark` node for VPS performance testing
- Includes reverse DNS lookup, latency measurement, and bandwidth testing
- Smoke tests added in `vps_script_smoke.rs`

### 2. Chat Bubble Tools & Think Display (chengflow-ui)

**Files:** `MessageBubble.tsx`, `main.tsx`

- 聊天气泡工具: Added chat bubble action toolbar (copy, retry, edit)
- Think 显示修复: Fixed rendering of `<think>` blocks in assistant messages

### 3. Release Engineering (chengos)

**Files:** `release.sh`

- `release.sh` now tags all source repositories (`chengflow`, `chengflow-ui`, `chengapp`, `chengflow-sdk`) with unified version tag
- Source repo tag push is independent per repo — each pushed to its own remote (Gitea)
- Deploy resources synced with unified `release: vX.Y.Z` commit message

---

## Infrastructure

### i18n Updates

- New `vps_benchmark` node translation file added to `deploy/config/i18n/`
- Removed obsolete `i18n.tar.gz` archive (replaced by individual JSON files)
- Cleaned up unused `deploy/config/image/` screenshots (01-07.png, vite.svg)

### UI Build

- Full `chengflow-ui` production rebuild with updated chat workflow binding fixes
- All page components, editor layout, and execution WebSocket hooks updated

---

## Upgrade Instructions

### From v0.1.0

```bash
# Online update
./chengos.sh update

# Or manual upgrade from local build
./chengflow/build.sh --hybrid
# Transfer dist/chengos-full-linux-amd64-v0.1.1.tar.gz to server
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
- ChengApp group communication is in active development (steps 0-3 of architecture plan completed)
- VPS benchmark node is in preview — additional metrics planned

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
