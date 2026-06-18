# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

`chengos` is a meta-workspace holding **two independently versioned subprojects** that
together make up the Cheng Workflow (ChengOS) product — a visual, node-based workflow
system for AI-powered data processing.

| Directory       | Stack                              | Role                                                              |
| --------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `chengflow/`    | Rust (Cargo workspace)             | Backend: DAG workflow engine, REST + WebSocket API, node system  |
| `chengflow-ui/` | React 18 + TypeScript + Vite       | Frontend: React Flow visual editor, runtime page renderer        |

**Each subproject is its own git repository** (`chengflow/.git`, `chengflow-ui/.git`),
each with its own commit history. The top-level `chengos` directory is also a git repo
but is essentially empty — it is not a parent that tracks the two. Run git commands from
*inside* the subproject you are changing, not from the root. There are no git submodules.

**Each subproject has its own detailed `CLAUDE.md`** — read `chengflow/CLAUDE.md` or
`chengflow-ui/CLAUDE.md` for crate/module layout, architecture, conventions, and the full
command set. This root file only covers what spans both.

## How the two halves connect

- The frontend talks to the backend over HTTP + WebSocket.
- In dev, the Vite server (`chengflow-ui` on `http://localhost:5173`) proxies `/api`,
  `/ws`, and related paths to the Rust backend on `http://localhost:3000`
  (see `chengflow-ui/vite.config.ts`). The old Express server on `:4000` is deprecated.
- Node UI is schema-driven: backend node definitions emit JSON Schema with `x-*` UI
  extensions, which the frontend's Field Control Registry turns into form controls.
  Changes to a node's inputs/outputs on the backend surface automatically in the UI.
- i18n spans both: the backend (`chengctl`) extracts/translates node-definition strings;
  the frontend loads those as dynamic bundles. Keep both sides in mind when touching
  node labels/descriptions.

## Running the full stack locally

Start the backend first, then the frontend:

```bash
# Terminal 1 — backend (from chengflow/)
cargo run -p cheng-api          # listens on :3000

# Terminal 2 — frontend (from chengflow-ui/)
pnpm dev                        # serves :5173, proxies to :3000
```

Note: `chengflow-ui` `pnpm build` runs `gen:pages`, which calls the backend to render
static pages — the backend must be running or that step fails/skips.

## Common commands (detail lives in the subproject CLAUDE.md files)

Backend (`chengflow/`): `cargo build`, `cargo test`, `cargo fmt`, `cargo clippy`;
single test via `cargo test <name>`; per-crate via `-p <crate>`.

Frontend (`chengflow-ui/`): `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`,
`pnpm type-check`; single test file via `pnpm test -- src/path/to/file.test.ts`.

## Working conventions

- Confine a change to one subproject when you can; a cross-cutting change (e.g. a node's
  schema) means editing Rust in `chengflow/` *and* the corresponding UI handling in
  `chengflow-ui/`, and committing in each repo separately.
- Do not create documentation/`*.md` files unless explicitly asked (the backend CLAUDE.md
  states this as a hard rule; apply it across the workspace).
