---
name: feedback-default-serves-high-frequency-case
description: Defaults should serve the high-frequency scenario; make the rare case the opt-in flag
metadata:
  type: feedback
---

When adding a boolean flag that toggles output verbosity/size, the DEFAULT must be the high-frequency scenario and the rare case must be the explicit opt-in.

**Why:** A zero-knowledge caller (esp. an LLM agent) gets the default. If the default is the expensive path, callers pay the cost (token explosion) unless they somehow know to ask for the cheap one — which they don't. In `tools/workflow_inspect`, `list_node_types` returns ~111 nodes; full projection ≈8000 tokens vs compact ≈2000.

**How to apply:** Prefer `verbose: bool = false` (default compact, opt into full) over `compact: bool = false` (default full, opt into compact). Related: [[feedback-propose-better-path]].
