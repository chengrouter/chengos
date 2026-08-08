# Approval Reliability — Eliminate Stuck WaitingForReview

## Problem

Some approval requests remain stuck in `WaitingForReview` after the user clicks
Approve. Root causes identified:

1. **ShortTask has no pre-persistence** — the execution row does not exist when
   the approval gate calls `transition_approval_state`, so the CAS fails
   silently and the approve endpoint returns 404.
2. **`save_minimal_snapshot` clobbers approval state** — it does a blind
   `UPDATE ... SET state = $1, metadata = $2` with no guard, erasing
   `approval_context` and overwriting `waiting_for_review` with `paused`.
3. **`transition_approval_state` is UPDATE-only** — if the row is missing
   (e.g. ShortTask, lazy persistence, race), the CAS affects 0 rows and the
   approval context is never persisted.

## Changes

### 1. Pre-persist ShortTask execution record

**File:** `crates/cheng-engine/src/executor/workflow_executor/execution.rs`
**Function:** `execute_short_task_inner` (~line 813)

Add a `save_execution_record(... "running" ...)` call **before** the
`tokio::time::timeout` wrapper, mirroring what `execute_long_task` already
does at line 1009.

```rust
// Pre-persist a "running" record so the approval gate and approve endpoint
// can find the execution while the task is in flight.
if let Err(e) = self
    .save_execution_record(
        &execution_id,
        &workflow_id,
        "running",
        0,
        None,
        workflow.node_count(),
        0,
        HashMap::new(),
        options.metadata.clone(),
    )
    .await
{
    warn!(
        execution_id = %execution_id,
        error = %e,
        "ShortTask: failed to persist initial execution record; approval gate may not work"
    );
}
```

This is the **critical fix** — it eliminates the 404 path that made
ShortTask approvals intermittently stuck.

---

### 2. Make `save_minimal_snapshot` approval-preserving

**File:** `crates/cheng-storage/src/repos/execution_repo.rs`
**Function:** `save_minimal_snapshot` (~line 995)

Current code does a blind `UPDATE`:
```sql
UPDATE executions SET state = $1, metadata = $2 WHERE id = $3
```

Replace with a conditional write that preserves `waiting_for_review` state
and `approval_context`, matching the pattern already used by
`save_lightweight` (line 965) and `save_preserving_approval` (line 234):

```sql
UPDATE executions SET
  state = CASE WHEN executions.state = 'waiting_for_review'
               THEN executions.state ELSE $1 END,
  metadata = CASE WHEN executions.state = 'waiting_for_review'
                  THEN jsonb_set(
                         coalesce($2, '{}'::jsonb),
                         '{approval_context}',
                         coalesce(executions.metadata -> 'approval_context',
                                  'null'::jsonb))
                  ELSE $2 END,
  updated_at = $3,
  last_heartbeat_at = $4,
  execution_mode = $5
WHERE id = $6
```

**Also update the in-memory implementation:**
`crates/cheng-engine/src/repository.rs`, `save_minimal_snapshot` (~line 448).

Add the same guard that `save_preserving_approval` uses (line 214-234):
if the existing execution is `WaitingForReview`, preserve its state and
`approval_context` before overwriting.

---

### 3. Make `transition_approval_state` an upsert (create-if-not-exists)

**File:** `crates/cheng-storage/src/repos/execution_repo.rs`
**Function:** `transition_approval_state` (~line 286)

Current SQL is `UPDATE ... WHERE id = $1 AND ...` — if the row doesn't
exist, 0 rows are affected and the approval context is never stored.

Change to `INSERT ... ON CONFLICT DO UPDATE` with the same WHERE guards
in the DO UPDATE clause:

```sql
INSERT INTO executions (id, workflow_id, state, metadata, ...)
VALUES ($1, $7, $2, jsonb_build_object('state', $2, 'approval_context', $3), ...)
ON CONFLICT (id) DO UPDATE
SET
  state = CASE
            WHEN executions.is_deleted = true THEN executions.state
            WHEN $5::text IS NOT NULL AND executions.state != $5 THEN executions.state
            WHEN executions.state IN ('completed','failed','cancelled','timeout') THEN executions.state
            WHEN $4::text IS NOT NULL
                 AND executions.metadata -> 'approval_context' ->> 'request_id' != $4
                 THEN executions.state
            ELSE $2
          END,
  metadata = CASE ...same conditions... END,
  version = version + 1,
  updated_at = now()
```

On a **first INSERT** (no conflict), the row is created with the
`waiting_for_review` state and the full `approval_context` in metadata.
On **conflict**, the existing CAS guards apply unchanged.

This makes the approval gate self-healing: even if pre-persistence is
missing or delayed, the gate can still create the row and persist the
approval context.

**Also update the in-memory implementation:**
`crates/cheng-engine/src/repository.rs`, `transition_approval_state`
(~line 150).

Change `executions.get_mut(execution_id)` → `executions.entry(*execution_id)`,
and on first insertion create a minimal `Execution` with the target state
and approval context. Apply the same CAS guards on existing entries.

---

## Verification

After all three changes:

| Scenario | Before | After |
|---|---|---|
| ShortTask approval gate | Row missing → CAS fails → approve 404 | Pre-persisted row → CAS works → approve succeeds |
| Pause during approval | `save_minimal_snapshot` erases context | Context preserved, approve still works |
| Missing row (any mode) | `transition_approval_state` = 0 rows | Upsert creates row, context persisted |

### Test checklist

- [ ] ShortTask workflow with approval gate: approve endpoint returns 200
- [ ] ShortTask workflow with approval gate: gate receives decision via bus
- [ ] Pause execution while `WaitingForReview`: `approval_context` survives
- [ ] `transition_approval_state` on missing row: creates row with context
- [ ] `transition_approval_state` CAS guards still reject wrong `request_id`
- [ ] `transition_approval_state` CAS guards still reject terminal states
- [ ] Existing `save_preserving_approval` tests still pass
- [ ] Existing `save_lightweight` approval-preservation tests still pass
