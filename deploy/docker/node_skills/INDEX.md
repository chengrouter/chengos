# Node Skills Index

`node_skills/` is the staging area for node-specific Skill drafts.

These files are not runtime Skills by default. The application watches `skills/` through `SKILLS_DIR`; keeping node-specific guides here avoids registering every node guide into the global Skill catalog and reduces noise for unrelated workflows.

## Purpose

- Store complex-node Skill drafts before they are promoted.
- Keep an index of node-specific usage guides.
- Let workflow authors selectively copy or sync only the needed Skill into `skills/`.

## Promotion Rule

Only promote a node Skill into `skills/` when a workflow or agent actually needs that node guide in its active Skill set.

## Drafts

| Node | Draft Skill | Status |
|------|-------------|--------|
| `tools/http` | `skills/http-tool-guide/SKILL.md` | Existing runtime Skill; use as current template |

## Naming

Use one folder per node:

```text
node_skills/
├── INDEX.md
├── NODE_SKILL_GENERATION_PROMPT.md
└── tools-browser/
    └── SKILL.md
```

Prefer names that map clearly to node ids:

- `tools/browser` -> `tools-browser`
- `tools/ssh` -> `tools-ssh`
- `rag/document_indexer` -> `rag-document-indexer`
