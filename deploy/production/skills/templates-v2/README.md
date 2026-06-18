# Skills Templates V2

This directory contains generated coverage templates for the current ChengOS node set.

Old templates in `deploy/production/skills/templates` are historical and may contain stale node snapshots. These V2 templates intentionally do not embed old `inputs` / `outputs` arrays. Use the live node API as source of truth:

- `GET /api/v1/nodes/types`
- `GET /api/v1/nodes/schema/*node_type`

## Generated Workflows

| Workflow | Nodes |
| --- | --- |
| `01-chat-llm-basic.json` | `chat/input`, `ai/llm_config`, `ai/llm`, `ai/context_merge`, `ai/llm_branch`, `chat/memory`, `chat/save_reply`, `chat/output` |
| `02-agent-react-and-inspection.json` | `agent/react_agent`, `agent/react_plan`, `agent/react_execute`, `agent/react_review`, `tools/workflow_inspect`, `tools/get_execution_trace`, `tools/skill`, `tools/subflow`, `utils/preview` |
| `03-file-tools-safe-ops.json` | `io/input_text`, `tools/file_ops_hub`, `tools/view_file`, `tools/list_directory`, `tools/search_files`, `tools/file_info`, `tools/write_file`, `tools/edit_file`, `tools/delete_file`, `utils/approver` |
| `04-external-execution-tools.json` | `tools/code_js`, `tools/code_python`, `tools/code_shell`, `tools/ssh`, `tools/mcp_hub` |
| `05-http-browser-mail-schedule.json` | `utils/credential`, `tools/http`, `tools/browser`, `tools/mail`, `tools/schedule` |
| `06-document-workbench.json` | `document/create`, `document/query`, `document/format_for_llm`, `document/update_block`, `document/extract_items`, `document/ops_hub`, `document/build_llm_context`, `document/shadow_create`, `document/shadow_write`, `document/shadow_await_review`, `document/shadow_complete`, `document/apply_ops` |
| `07-table-workbench.json` | `table/query`, `table/build_llm_context`, `table/apply_record_ops` |
| `08-io-media-ocr.json` | `io/file_upload`, `io/read_file`, `io/document_to_text`, `io/ocr`, `io/speech_to_text`, `io/video_extract_audio`, `io/video_extract_frames` |
| `09-rag-knowledge-base.json` | `workspace/context`, `workspace/knowledge_base`, `ai/embedding_config`, `ai/qdrant_config`, `ai/llm_config`, `rag/chunker`, `rag/document_indexer`, `rag/retriever`, `rag/formatter`, `rag/kb_manager` |
| `10-utils-data-control.json` | `utils/smart_var`, `utils/type_cast`, `utils/to_items`, `utils/condition_router`, `utils/delay`, `utils/preview`, `utils/ui_controls_test` |
| `11-translation.json` | `io/input_text`, `ai/llm_config`, `ai/translation`, `chat/output` |

## Coverage

| Node | Covered By | Note |
| --- | --- | --- |
| `agent/react_agent` | `02-agent-react-and-inspection` |  |
| `agent/react_execute` | `02-agent-react-and-inspection` |  |
| `agent/react_plan` | `02-agent-react-and-inspection` |  |
| `agent/react_review` | `02-agent-react-and-inspection` |  |
| `ai/context_merge` | `01-chat-llm-basic` |  |
| `ai/embedding_config` | `09-rag-knowledge-base` |  |
| `ai/llm` | `01-chat-llm-basic` |  |
| `ai/llm_branch` | `01-chat-llm-basic` |  |
| `ai/llm_config` | `01-chat-llm-basic`, `09-rag-knowledge-base`, `11-translation` |  |
| `ai/qdrant_config` | `09-rag-knowledge-base` |  |
| `ai/translation` | `11-translation` |  |
| `chat/input` | `01-chat-llm-basic` |  |
| `chat/memory` | `01-chat-llm-basic` |  |
| `chat/output` | `01-chat-llm-basic`, `11-translation` |  |
| `chat/save_reply` | `01-chat-llm-basic` |  |
| `document/apply_ops` | `06-document-workbench` |  |
| `document/build_llm_context` | `06-document-workbench` |  |
| `document/create` | `06-document-workbench` |  |
| `document/extract_items` | `06-document-workbench` |  |
| `document/format_for_llm` | `06-document-workbench` |  |
| `document/ops_hub` | `06-document-workbench` |  |
| `document/query` | `06-document-workbench` |  |
| `document/shadow_await_review` | `06-document-workbench` |  |
| `document/shadow_complete` | `06-document-workbench` |  |
| `document/shadow_create` | `06-document-workbench` |  |
| `document/shadow_write` | `06-document-workbench` |  |
| `document/update_block` | `06-document-workbench` |  |
| `io/document_to_text` | `08-io-media-ocr` |  |
| `io/file_upload` | `08-io-media-ocr` |  |
| `io/input_text` | `03-file-tools-safe-ops`, `11-translation` |  |
| `io/ocr` | `08-io-media-ocr` |  |
| `io/read_file` | `08-io-media-ocr` |  |
| `io/speech_to_text` | `08-io-media-ocr` |  |
| `io/video_extract_audio` | `08-io-media-ocr` |  |
| `io/video_extract_frames` | `08-io-media-ocr` |  |
| `rag/chunker` | `09-rag-knowledge-base` |  |
| `rag/document_indexer` | `09-rag-knowledge-base` |  |
| `rag/formatter` | `09-rag-knowledge-base` |  |
| `rag/kb_manager` | `09-rag-knowledge-base` |  |
| `rag/retriever` | `09-rag-knowledge-base` |  |
| `table/apply_record_ops` | `07-table-workbench` |  |
| `table/build_llm_context` | `07-table-workbench` |  |
| `table/query` | `07-table-workbench` |  |
| `tools/browser` | `05-http-browser-mail-schedule` |  |
| `tools/code_js` | `04-external-execution-tools` | env-gated |
| `tools/code_python` | `04-external-execution-tools` | env-gated |
| `tools/code_shell` | `04-external-execution-tools` |  |
| `tools/delete_file` | `03-file-tools-safe-ops` |  |
| `tools/edit_file` | `03-file-tools-safe-ops` |  |
| `tools/file_info` | `03-file-tools-safe-ops` |  |
| `tools/file_ops_hub` | `03-file-tools-safe-ops` |  |
| `tools/get_execution_trace` | `02-agent-react-and-inspection` |  |
| `tools/http` | `05-http-browser-mail-schedule` |  |
| `tools/list_directory` | `03-file-tools-safe-ops` |  |
| `tools/mail` | `05-http-browser-mail-schedule` |  |
| `tools/mcp_hub` | `04-external-execution-tools` |  |
| `tools/schedule` | `05-http-browser-mail-schedule` |  |
| `tools/search_files` | `03-file-tools-safe-ops` |  |
| `tools/skill` | `02-agent-react-and-inspection` |  |
| `tools/ssh` | `04-external-execution-tools` |  |
| `tools/subflow` | `02-agent-react-and-inspection` |  |
| `tools/view_file` | `03-file-tools-safe-ops` |  |
| `tools/workflow_inspect` | `02-agent-react-and-inspection` |  |
| `tools/write_file` | `03-file-tools-safe-ops` |  |
| `utils/approver` | `03-file-tools-safe-ops` |  |
| `utils/condition_router` | `10-utils-data-control` |  |
| `utils/credential` | `05-http-browser-mail-schedule` |  |
| `utils/delay` | `10-utils-data-control` |  |
| `utils/preview` | `02-agent-react-and-inspection`, `10-utils-data-control` |  |
| `utils/smart_var` | `10-utils-data-control` |  |
| `utils/to_items` | `10-utils-data-control` |  |
| `utils/type_cast` | `10-utils-data-control` |  |
| `utils/ui_controls_test` | `10-utils-data-control` | dev-only |
| `workspace/context` | `09-rag-knowledge-base` |  |
| `workspace/knowledge_base` | `09-rag-knowledge-base` |  |

## Excluded Nodes

| Node | Reason |
| --- | --- |
| `agent/memory_postgres` | Declared in source but not registered in the default runtime inventory |
| `agent/memory_redis` | Declared in source but not registered in the default runtime inventory |
| `agent/memory_window` | Declared in source but not registered in the default runtime inventory |
| `ui/content` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/footer` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/header` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/left_sidebar` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/page_root` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/rbac_guard` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/right_sidebar` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/route` | UI module is currently disabled in `builtin/mod.rs` |
| `ui/top_nav` | UI module is currently disabled in `builtin/mod.rs` |
