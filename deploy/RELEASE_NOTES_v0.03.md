# ChengOS v0.03 Release Notes

> Release Date: 2026-08-02
> Previous Version: v0.02

---

## Overview

v0.03 is the third preview release of ChengOS. This update spans three days of development across three repositories (**chengos**, **chengflow**, **chengflow-ui**), focusing on **agent strategy overhaul**, **ReAct pipeline improvements**, **file operations enhancement**, **LLM routing node upgrades**, **workflow template library**, **node presets & routing shortcuts**, and **UI rendering improvements**.

---

## New Features

### 1. Node Presets System

Added global node preset configuration (`presets.yaml`) providing pre-defined configuration profiles for common nodes:

- **Preset categories**: `preset_types` classification (e.g. Tool nodes, AI nodes) with hierarchical display in UI
- **Config patch**: Each preset applies a shallow merge via `config_patch` to the target node configuration
- **Risk levels**: `low` / `medium` / `high` risk marking; high-risk presets are hidden from LLM by default
- **LLM visibility**: `llm_visible` field controls whether presets are discoverable by ReAct Agent during tool discovery
- **Built-in presets**:
  - `code-safe-mode` — Code execution safe mode (no writes, strict sandbox)
  - `code-full-access` — Code execution full access mode (writes allowed, no sandbox)
  - `search-strict` — Search strict match mode (exact match, max 10 results)
  - `agent-deep-think` — Agent deep thinking mode (30 iterations, deep reasoning)
- **Layered override**: Global presets in `CHENG_GLOBAL_CONFIG_DIR/presets.yaml`, workspace-level overrides by same ID

### 2. Routing Shortcuts

Added global routing shortcut configuration (`shortcuts.yaml`) for LLM branch nodes (`ai/llm_branch`):

- **Built-in shortcuts**:
  - `Need Tools` — Route to tool branch (`need_tools: true`, persistent)
  - `Search` — Route to search action (`action.name: search`, one-shot)
  - `Deep Think` — Enable deep reasoning mode (`reasoning.mode: deep`, 20 steps, persistent)
  - `Memory` — Route to memory write branch (`memory: true`, persistent)
- **Routing modes**: `once` (auto-clear after next turn) / `always` (persistent until manually cleared)
- **Layered override**: Global shortcuts in `CHENG_GLOBAL_CONFIG_DIR/shortcuts.yaml`, workspace-level overrides by same name

### 3. Workflow Template Library

9 pre-built workflow templates auto-installed to new workspaces on system startup:

| Template | Description |
|----------|-------------|
| `main-chat` | Main chat workflow with conditional routing to three sub-workflows (memory chat / no-memory chat / tool agent) |
| `memory-chat` | Chat workflow with conversation memory, configurable window size and history search |
| `no-memory-chat` | Lightweight stateless single-turn chat for Q&A and one-shot tasks |
| `http-tools` | Chat workflow with HTTP request capability; LLM can construct and send HTTP requests |
| `scheduled-task` | Chat workflow with scheduled task management via natural language |
| `skills-run` | Chat workflow with skill execution; LLM can discover and run installed skills |
| `tools-user` | ReAct agent workflow with file operation tools (read/write/edit in sandbox) |
| `skills-importer` | Skill import workflow from repo/URL/text, generates skill packages |
| `create-workflow` | Workflow creation agent that generates complete workflow definitions from natural language |

Templates were reorganized from flat JSON files into a directory structure (`template.json` + `workflow.json` per template).

### 4. LLM Branch Node Enhancement

`ai/llm_branch` node fully upgraded with flexible routing logic:

- **Multiple match operators**: `Truthy` (default), `Exists`, `Equals`, `NotEquals`, `Contains`, `GreaterThan`, `LessThan`
- **Nested field paths**: `field_name` supports dot notation (e.g. `action.name`) for nested JSON access
- **Schema hint generation**: Auto-generates JSON Schema and system prompt fragments from `branch_fields`
- **Enhanced fallback metadata**: `context_out` carries failure reason and attempted field list on routing failure

---

## Agent Strategy Overhaul (chengflow)

### ReAct Pipeline Improvements

- **Plan protocol refactor** (`plan/protocol.rs`): Rewrote the LLM response parsing protocol with stricter JSON parsing, format repair, and checkpoint handling
- **Prompt optimization** (`plan/prompt.rs`): Reworked system prompt construction with budget-aware token management and first-turn token reduction
- **Budget snapshot** (`plan/budget_snapshot.rs`): New module for tracking token budget consumption across agent iterations
- **Reminder policy** (`reminder_policy.rs`): Redesigned reminder injection logic to reduce redundant context in long conversations
- **Loop driver** (`agent/loop_driver.rs`): Improved loop detection, ambiguous completion confirmation, and tool dispatch flow
- **Assessment** (`agent/assessment.rs`): Enhanced completion detection and loop-failure diagnosis
- **Finalization** (`agent/finalization.rs`): Refined final answer extraction and trace durability
- **Tool adapter** (`agent/tools/adapter.rs`): Expanded tool discovery, schema generation, and LLM-visible tool exposure control
- **Types** (`strategy/types.rs`): Extended `AgentContext`, `AgentLimits`, and observation types for the new protocol
- **Observation builder** (`observation.rs`): Improved observation message construction with metadata-first inline cleanup
- **Compaction** (`compaction/executor.rs`, `compaction/mod.rs`): Enhanced context compaction for long-running agent sessions

### Agent Think/Tools Mode Rendering

- **WebSocket events** (`cheng-api/src/ws/events.rs`): Restructured event payload to separate think-mode and tools-mode traces
- **CLI tool summary** (`cheng-cli/src/tool_summary.rs`): New module for summarizing tool usage in CLI output
- **TUI trace rendering** (`cheng-cli/src/tui/trace.rs`, `tui/app.rs`): Improved trace display with think/tools mode visualization
- **Coherence metrics** (`cheng-core/src/services/coherence_metrics.rs`): New metrics for tracking agent coherence across turns
- **Agent completion loop tests** (`tests/agent_completion_loop.rs`): New test suite for loop detection and completion behavior

### Routing Node Debugging

- **Condition router** (`utils/condition_router.rs`): Reworked condition evaluation logic with improved error handling
- **Sub-flow tools** (`tools/sub_flow.rs`, `tools/batch_sub_flow.rs`): Enhanced sub-workflow invocation with better context passing
- **Workflow REST API** (`rest/handlers/workflow/mod.rs`, `rest/routes.rs`): New endpoints for workflow management
- **Workflow file import** (`cheng-storage/src/workflow_file_import/service.rs`): Improved import validation and error reporting

---

## File Operations Enhancement (chengflow)

- **`view_file`** (`cheng-file-ops/src/view_file.rs`): Large file preview support with configurable line limits and syntax-aware truncation
- **`list_directory`** (`cheng-file-ops/src/list_directory.rs`): Enhanced directory listing with metadata, sorting, and filtering
- **File ops dispatch** (`cheng-file-ops/src/dispatch.rs`): Reworked dispatch logic for unified file operation handling
- **File ops spec** (`cheng-file-ops/src/spec.rs`): New specification module for file operation parameters
- **File ops validation** (`cheng-file-ops/src/validation.rs`): Enhanced input validation for file operations
- **Hub description** (`file_ops/hub_description.rs`): New module for generating tool descriptions exposed to LLM
- **Regression tests** (`call_corpus_regression.rs`): New regression test corpus for file operation calls

---

## LLM Provider & Chat Improvements (chengflow)

- **Anthropic provider** (`cheng-llm/src/providers/anthropic.rs`): Improved response parsing and error handling
- **LLM module** (`ai/llm/mod.rs`): Enhanced LLM node configuration and context merge logic
- **Chat history projection** (`chat/history_projection.rs`): Improved history windowing and projection for multi-turn conversations
- **Session store** (`chat/session_store.rs`): Enhanced session persistence with better history management
- **Demo mode middleware** (`cheng-api/src/middleware/demo_mode.rs`): New demo mode middleware for API
- **LLM REST handler** (`cheng-api/src/rest/handlers/llm/mod.rs`): New REST endpoints for LLM interaction

---

## UI Improvements (chengflow-ui)

- **Agent think/tools mode rendering**: `MessageBubble`, `useConversationWebSocket`, `assistantPresentation`, `executionTrace` utils updated to render agent thinking steps and tool usage in chat UI
- **Stream chunk routing**: `streamChunkRouting` test updated for new event protocol
- **Conversation types** (`types/conversation.ts`): Extended type definitions for think/tools mode support
- **ChatInput** (`ChatInput.tsx`): Routing toolbar integration for LLM branch shortcuts
- **i18n** (`i18n.ts`): New translation keys for routing features
- **Full UI asset rebuild**: All production JS/CSS assets rebuilt with latest frontend changes

---

## Configuration & Deployment (chengos)

- **Global config directory**: `CHENG_GLOBAL_CONFIG_DIR` manages `shortcuts.yaml` and `presets.yaml`; Docker mode defaults to `/app/config`, native mode auto-detects install directory
- **Layered config system**: Global config → workspace config, same ID/name overrides supported
- **Template auto-install**: System detects `TEMPLATE_WORKFLOWS_DIR` on startup and auto-installs templates to new workspaces
- **README updated**: Updated with latest deployment instructions and screenshots
- **Deployment images**: Updated config images for documentation

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `CHENG_GLOBAL_CONFIG_DIR` | Auto-detected | Global config directory (`shortcuts.yaml` / `presets.yaml`); introduced in v0.02, content added in v0.03 |
| `TEMPLATE_WORKFLOWS_DIR` | Auto-detected | Workflow template directory; introduced in v0.02, 9 templates added in v0.03 |

> No new environment variables; both were defined in v0.02 and populated with actual content in v0.03.

---

## Upgrade Instructions

### From v0.02

```bash
# Download latest build
./chengos.sh update

# Or manual upgrade
./build.sh --hybrid
# Then transfer dist/chengos-full-linux-amd64.tar.gz to server and run chengos.sh update
```

After upgrade, new `presets.yaml` and `shortcuts.yaml` are deployed to the global config directory, and 9 workflow templates are installed to new workspaces. Existing workspaces are unaffected; templates can be imported manually.

### Fresh Install

```bash
# Docker mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash

# Native binary mode
curl -fsSL https://raw.githubusercontent.com/chengrouter/chengos/main/deploy/chengos.sh | bash -s -- --mode native
```

After installation, edit `.env` to configure database password and secret key, then start:

```bash
./chengos.sh start
```

---

## Known Limitations

- Node preset UI selection panel is still under development; currently managed via config files
- Routing shortcut UI toggle is not yet complete; currently used via API and config files
- Workflow templates are read-only sources; user copies created from templates have no update association with the source template
- `presets.yaml` `config_patch` uses shallow merge; deep merge of nested objects is not supported

---

## Feedback

- GitHub Issues: https://github.com/chengrouter/chengos/issues
- Community: ChengHub
