# Migration policy

Toolchain: `sqlx migrate` (embedded via `sqlx::migrate!` at build time).

Rules:

1. `skill-registry migrate` is the **only** command that applies migrations.
   `serve` verifies the applied migration set matches the binary's embedded
   set and refuses to start on mismatch (`MIGRATION_MISMATCH`); it never
   mutates schema silently.
2. Migrations are append-only and immutable once merged. Never edit an
   applied migration; add a new one.
3. File naming: `<UTC timestamp>_<snake_case_description>.sql`.
4. Every migration file MUST start with a header comment stating:
   - `-- compatibility:` `backward-compatible` | `data-changing` |
     `coordinated-deploy` (old binary cannot run against the new schema)
   - `-- notes:` operational notes (locks taken, expected duration, rollback
     strategy).
5. `backward-compatible` migrations may be applied before the new binary is
   deployed. `coordinated-deploy` migrations require stopping the old binary
   first; call this out in the release notes.
6. Destructive changes (dropping columns/tables) ship in two releases:
   release N stops using the object, release N+1 drops it.
