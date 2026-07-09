---
name: cli-chat-trace-details-progress
description: CLI chat tool-details trace feature — all 7 steps done+tested 2026-07-07, plus 5 review fixes
metadata:
  type: project
---

Plan `docs/cli-chat-tool-details-development-plan.md` (structured assistant trace in `cheng-cli` chat TUI): all 7 steps implemented and tested green 2026-07-07 (179 lib tests pass, no warnings).

What landed:
- `events.rs`: `StreamStart.node_type`; `NodeComplete`/`NodeFailed` gained `node_id`/`state`/`outputs`/`error`/`duration_ms` (backward-compatible decode).
- `tui.rs`: `Message::Assistant(AssistantMessage{content,trace})`; removed `Message::Tool` (trace always gets a structured home via `ensure_current_assistant`); `TraceItem`/`TraceSummary`/`TraceDetail`/`TraceStatus`/`RowAction`; `DisplayRow.action`.
- New `tui/trace.rs`: trace builders + correlation + expansion state.
- `tui/render.rs`: renders collapsed `›`/expanded `˅` trace rows with bounded previews; `RowAction::ToggleTrace` only on summary rows; transcript/markdown include compact summaries (never expanded bodies).
- Click-to-expand (down records candidate only, first drag promotes to selection — no flicker) + `/details [on|off|status]` local command.

5 review fixes applied same day:
1. `record_tool_node_complete` captures `trace_id_for_node` ONCE before the loop; only the first item (ToolResult) enriches, FileRead always appends (was: FileRead overwrote the ToolResult line).
2. Multi-turn split: `assistant_turn_finalized`+`pending_new_assistant_turn`; `note_stream_start(node_type)` opens a new `AssistantMessage` when an LLM/agent StreamStart follows a finalized turn with activity. Tool streams never split.
3. Tool-call correlation keyed by payload `tool_call_id` (fallback node_id) via `tool_call_key()` — upstream sends it at `ai/llm/mod.rs:~1980`. Was keyed by stream node_id → concurrent calls overlapped.
5. Click no longer enters drag/selection on mouse-down; only on first Drag event.

See [[terminal-cli-steps-6-8-progress]]. User (tianchengzd) runs builds — see [[run-builds-tests-self]].
