# Builtin Node Index

Use this index to map a user requirement to the right builtin node category, then open only the relevant category file.

> **快速开始?** 直接阅读 [quick-reference.md](quick-reference.md) 查看所有节点表和常见模式示例。

## Categories

- [Agent](categories/agent.md): LLM calls, memory, ReAct orchestration, tool catalog, HTTP tool, subflow, skill invocation, vector config.
- [Chat](categories/chat.md): Chat input, memory, output nodes for multi-turn UI workflows.
- [Document](categories/document.md): Create, query, update, shadow editing, apply ops, LLM context building.
- [IO](categories/io.md): Text input and file upload ingestion.
- [RAG](categories/rag.md): Chunking, indexing, retrieval, knowledge base management, prompt formatting.
- [Scheduler](categories/scheduler.md): Create and manage scheduled workflow runs.
- [Table](categories/table.md): Query tables, construct LLM context, apply record ops.
- [Utils](categories/utils.md): Delay, code execution, preview, smart variables, skill credentials.
- [WebUI](categories/webui.md): Route and page layout nodes defined in source; check runtime registration before use.

## Requirement to category hints

- "做一个能自主判断并调用工具的助手": Agent
- "聊天输入输出、上下文窗口、前端消息流": Chat
- "生成/编辑文档、AI 草稿审核、写使用说明": Document
- "用户上传文件后解析并继续处理": IO
- "知识库入库和检索问答": RAG
- "定时触发某个工作流": Scheduler
- "查表、批量改表、让 LLM 看表结构": Table
- "需要脚本执行、变量模板、凭证注入": Utils
- "页面路由和布局拼装": WebUI

## 实时查询

如需确认某个节点的精确 schema，使用 `agent/workflow_inspect` 工具：

```
action: get_node_schema, node_type: "agent/llm"
action: list_node_types, category_filter: "Agent"
```

## Notes

- Category files are generated from builtin source metadata and input structs.
- The source of truth is the Rust node implementation and the runtime node registry.
- If a node is present in source but not exported or registered, treat it as implementation-dependent.
