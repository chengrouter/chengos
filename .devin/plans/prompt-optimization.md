# Plan: LLM Prompt Size Optimization

## Goal
Reduce file_ops_hub tool prompt from ~5726 tokens by:
1. Adding detailed prompt logging to see exact content
2. Compressing tool description and schema based on findings

## Step 1: Add prompt dump logging

**File:** `crates/cheng-nodes/src/nodes/builtin/ai/llm/mod.rs`
**Location:** `execute_chat_request_at`, after `materialize_chat_request` (line ~2041)

Add this log to dump the full messages + tools as JSON:

```rust
// Dump full prompt content for debugging token usage
{
    let messages_json = serde_json::to_string_pretty(&request.messages)
        .unwrap_or_else(|e| format!("<serialize error: {}>", e));
    let tools_json = request.config.tools
        .as_ref()
        .map(|t| serde_json::to_string_pretty(t).unwrap_or_else(|e| format!("<serialize error: {}>", e)))
        .unwrap_or("null".to_string());
    tracing::info!(
        call_site = call_site,
        provider = %provider,
        model = %model,
        messages_json = %messages_json,
        tools_json = %tools_json,
        messages_count = request.messages.len(),
        "PROMPT_DUMP: full messages + tools sent to LLM"
    );
}
```

This covers BOTH paths (ai_llm_node and agent) since `execute_chat_request_at` is the unified chokepoint.

## Step 2: Analyze the dump

After running with the new logging, grep for `PROMPT_DUMP` in the logs to see:
- Exact message content (system prompt, user message, history)
- Exact tool definitions (description + JSON schema)
- Per-component token estimation

## Step 3: Compress file_ops_hub description

**File:** `crates/cheng-nodes/src/nodes/builtin/tools/file_ops/hub.rs`
**Lines:** 100-184 (description string in register_tool! macro)

Changes:
- Remove [Call Format Rules] section (3 JSON examples) — save ~400 chars
- Remove [Gotchas] section entirely (10 bullet points) — save ~1500 chars  
  (Move critical gotchas to error-response messages)
- Compress [Path Rules] from 6 rules to 2 sentences — save ~600 chars
- Compress [Related tools] to one sentence — save ~200 chars
- Compress [Approval] to one sentence — save ~300 chars
- Keep [Operations Overview] but compress each operation to one line — save ~500 chars

Expected savings: ~1250 tokens → ~400 tokens (save ~850 tokens)

## Step 4: Compress config schema

**File:** `crates/cheng-nodes/src/nodes/builtin/tools/file_ops/hub.rs`  
**Lines:** 224-515 (config properties in JSON schema)

Based on user's choice (pending — need to see dump first):
- Option A: Replace all 60 config properties with `{type:object, additionalProperties:true}` — save ~2000 tokens
- Option B: Keep ~12 critical properties with 1-3 word descriptions — save ~1500 tokens  
- Option C: Strip all descriptions, keep property names/types — save ~1000 tokens

## Step 5: Remove x-example

**File:** `crates/cheng-nodes/src/nodes/builtin/tools/file_ops/hub.rs`
**Line:** 519

Remove or shorten the `x-example` field — it gets appended to the description by `append_root_example_to_description`, adding ~30 tokens.

## Step 6: Compile and test

```bash
cd /home/cheng/works/chengos/chengflow
cargo build -p cheng-nodes
```

Then run a test workflow with file_ops_hub and check:
1. `PROMPT_DUMP` log shows the compressed prompt
2. `prompt_tokens` in the completion log is significantly reduced
3. Tool calls still work correctly (file reads/writes succeed)
