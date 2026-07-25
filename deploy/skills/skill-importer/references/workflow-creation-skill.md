# 工作流创建技能（Workflow Creation Skill）

> 把「用户一句话需求」变成「可运行的 ChengOS 工作流」的标准操作流程（SOP）。
> 按这个流程做，可以避开端口名错配、节点类型拼错、连线断开等常见坑。

---

## 适用场景

- 用户说「帮我创建一个 XX 工作流」时
- 需要编排多个节点完成一个自动化流程时
- 参考模板工作流改造为新工作流时

---

## 标准操作流程（SOP）

```
① 理解需求 → ② 查模板 → ③ 查节点 schema → ④ 设计架构
→ ⑤ 验证草稿图 → ⑥ 结构化创建并导入 → ⑦ 解释确认
```

> **重要变化**：不再手写 `workflow.json` 再导入。改用
> `tools_import_workflow` 的**结构化创建模式**：你只提供节点（每个带唯一
> `key` 与 `nodeType`）和连线（`sourceKey`/`sourcePort`/`targetKey`/
> `targetPort`），工具会**对照实时节点 schema 校验**、自动生成所有 UUID，
> 只有校验通过才写入。手写规范 JSON（`content`）仍作为高级回退保留。

---

### 步骤 ①：理解用户需求

从用户的一句话中提取：

| 要素 | 示例（翻译工作流） |
|------|-------------------|
| **核心任务** | 翻译文本 |
| **输入** | 用户在聊天中输入的文本 |
| **输出** | 翻译后的文本，显示在聊天中 |
| **特殊要求** | 无（或：支持多语言、保留格式等） |

**输出**：一句话概括这个工作流要做什么。

---

### 步骤 ②：查模板工作流（如果有提供模板 ID）

```
tools_workflow_inspect(action="get_workflow", workflow_id="<模板ID>")
```

**目的**：
- 了解 ChengOS 工作流的 JSON 结构规范
- 学习常见节点的搭配模式（如 `chat/input` → 核心处理 → `chat/output`）
- 参考模板的连线方式和配置写法

**⚠️ 注意**：
- 模板仅供参考结构，**不要假设模板里的节点类型一定适用于新需求**
- 模板 ID 是引用，必须实际查询后才知道内容，不能凭 ID 猜测
- 如果用户没提供模板 ID，跳过此步

---

### 步骤 ③：查询节点 Schema（关键防坑步骤 ⭐）

**这是最容易踩坑的环节。在确定用哪些节点之前，必须先查 schema。**

#### 3.1 找到候选节点

```
# 按关键词模糊搜索节点类型
tools_workflow_inspect(action="list_node_types", node_filter="translation")
tools_workflow_inspect(action="list_node_types", node_filter="chat")
```

**⚠️ 常见坑**：用户说「翻译」，你可能直接想到用 `ai/llm`（通用 LLM 节点）来翻译。
**但系统里可能有专用的 `ai/translation` 节点**，功能更强、配置更简单。
**→ 所以一定要先搜，不要想当然。**

#### 3.2 查每个候选节点的详细 Schema

```
tools_workflow_inspect(action="get_node_schema", node_type="ai/translation")
tools_workflow_inspect(action="get_node_schema", node_type="chat/input")
tools_workflow_inspect(action="get_node_schema", node_type="chat/output")
```

**必须记录的信息**：
- 节点的确切 `node_type` 字符串（大小写、斜杠位置都要精确）
- 输入端口的**精确名称**（如 `text` 还是 `input` 还是 `user_message`？）
- 输入端口的**数据类型**（如 `UserMessage` 还是 `str`？）
- 输出端口的**精确名称**和**数据类型**
- 哪些配置项是必填的、哪些有默认值

#### 3.3 用 list_ports 快速确认端口（推荐）

```
tools_workflow_inspect(action="list_ports", node_type="ai/translation")
```

返回精简的端口列表（名称/类型/是否必填），不需要完整 schema，适合快速确认连线。

---

### 步骤 ④：设计工作流架构

根据查到的节点信息，设计：

1. **需要哪些节点**（列出每个节点的 `node_type` 和自定义 `id`）
2. **节点之间怎么连线**（源端口 → 目标端口）
3. **每个节点的配置项**（只写需要改的，保留默认值的不用写）

**设计原则**：

| 原则 | 说明 |
|------|------|
| **专用节点优先** | 有 `ai/translation` 就别用 `ai/llm` 凑合 |
| **最小可用** | 先搭最简流程跑通，再按需加节点 |
| **端口类型匹配** | 输出端口类型必须和输入端口类型兼容 |
| **入口出口标配** | 对话型工作流一般以 `chat/input` 开头、`chat/output` 结尾 |

---

### 步骤 ⑤：验证草稿图（防坑检查 ⭐）

在写入之前，用 `validate_workflow` 让引擎按**实时 schema** 校验你的草稿图。
它是**只读**的，不会创建任何东西：

```
tools_workflow_inspect(
  action="validate_workflow",
  definition={
    "nodes": [
      {"nodeId": "n1", "nodeType": "chat/input"},
      {"nodeId": "n2", "nodeType": "ai/translation"},
      {"nodeId": "n3", "nodeType": "chat/output"}
    ],
    "edges": [
      {"sourceNode":"n1","sourcePort":"user_message","targetNode":"n2","targetPort":"text"},
      {"sourceNode":"n2","sourcePort":"context","targetNode":"n3","targetPort":"context"}
    ]
  }
)
```

返回 `ValidationReport`：`valid`（是否可写入）、`errors`（硬错误，必须修）、
`warnings`（如端口类型不匹配，建议关注）。每条诊断都带机器可读 `code`。
`status:"ok"` 表示校验完成——即使 `valid` 为 false 也是 ok，只有工具/仓储
故障才会是 `status:"error"`。

> 也可以 `validate_workflow(workflow_id="<已存在的工作流ID>")` 用同一套规则
> 诊断一个已保存的工作流。

**硬错误代码（部分）**：`UNKNOWN_NODE_TYPE`、`INVALID_SOURCE_PORT`、
`INVALID_TARGET_PORT`、`MISSING_EDGE_ENDPOINT`、`DUPLICATE_NODE_ID`、
`CYCLE_DETECTED`、`CONTAINER_ENDPOINT_UNSUPPORTED`。

人工自检清单（仍然有用）：

```
□ 每条 edge 的 sourcePort 在源节点的 outputs 中存在？
□ 每条 edge 的 targetPort 在目标节点的 inputs 中存在？
□ 端口数据类型兼容？（不兼容会给出 PORT_TYPE_MISMATCH 警告）
□ 所有必填输入端口都有数据来源？
□ node key / nodeId 在 workflow 内唯一？
□ nodeType 字符串拼写正确（含斜杠）？
```

**⚠️ 最常见的 3 个踩坑场景**：

| 坑 | 症状 | 解决 |
|----|------|------|
| 端口名拼错 | 连线无效 / 运行报错 | 以 `get_node_schema` 返回为准 |
| 类型不匹配 | 数据传了但节点收不到 | 查端口类型，必要时加转换节点 |
| 想当然用通用节点 | 功能简陋 / 配置复杂 | 先 `list_node_types` 搜专用节点 |

---

### 步骤 ⑥：结构化创建并导入（一步完成校验+组装+写入）

用 `tools_import_workflow` 的**结构化创建模式**。你只描述图，工具负责校验、
生成所有 UUID、组装规范 `WorkflowFileV1` 并导入：

```
tools_import_workflow(
  workflow_key="translation-workflow",   // 小写 kebab-case
  name="翻译工作流",
  description="把用户输入翻译为中文",
  nodes=[
    {"key":"in",  "nodeType":"chat/input"},
    {"key":"tr",  "nodeType":"ai/translation"},
    {"key":"out", "nodeType":"chat/output"}
  ],
  edges=[
    {"sourceKey":"in","sourcePort":"user_message","targetKey":"tr","targetPort":"text"},
    {"sourceKey":"tr","sourcePort":"context","targetKey":"out","targetPort":"context"}
  ]
)
```

**关键规则**：
- 节点用**临时 `key`**（如 `in`/`tr`/`out`）互相引用，`key` 在请求内唯一、
  不会被持久化；工具会把它们解析成生成的 UUID。**不要自己编 UUID**。
- 只写需要自定义的 `config`；位置/名称可省略，工具会给出默认值。
- **校验失败 = 什么都不写**：返回 `error_code="VALIDATION_FAILED"` 和完整
  `validation` 报告，据此修正后重试。
- 成功后返回 `workflow_id`、`outcome`（created/updated/unchanged）、
  `node_ids`（key→生成的 UUID 映射）。记录 `workflow_id`。
- **文件写入成功 ≠ 导入成功**，只有此工具返回成功才是真的成功。

> **高级回退（legacy import）**：若你已有完整规范 JSON，可改传
> `content=<canonical WorkflowFileV1 字符串>`（顶层含 `name` 与嵌套
> `definition`，camelCase）。**不要**把 `content` 与结构化字段混用——会被拒绝
> （`AMBIGUOUS_REQUEST`）。绝不要再用扁平 snake_case（`node_type`/`source_port`）
> ——规范解码器会拒绝它。

---

### 步骤 ⑦：向用户解释并确认

导入成功后，向用户汇报：

1. **工作流概览**：节点列表 + 数据流图
2. **连线说明**：每条线从哪到哪、传什么数据
3. **关键配置**：改了哪些默认配置、为什么改
4. **使用方式**：用户怎么用这个工作流
5. **可扩展点**：后续可以怎么增强

---

## 速查：常用节点模式

### 对话型工作流（最常见）

```
chat/input → [处理节点] → chat/output
```

入口和出口标配：
- `chat/input`：输出端口 `user_message`（类型 `UserMessage`）
- `chat/output`：输入端口 `context`（类型 `AgentContext`）

### 带记忆的多轮对话

```
chat/input → chat/memory → [处理节点] → chat/output
```

### 带保存的回复

```
[处理节点] → chat/save_reply → chat/output
```

---

## 速查：本次创建翻译工作流的实战记录

### 踩坑过程

| 步骤 | 第一次的做法 | 问题 | 修正 |
|------|-------------|------|------|
| 选节点 | 直接用 `ai/llm`（通用 LLM） | 功能简陋，要手写翻译 prompt | 用户指出有专用节点，改用 `ai/translation` |
| 查端口 | 凭经验猜端口名 | 可能猜错 | 用 `get_node_schema` 实际查询确认 |
| 连线 | 把 `user_message` 直接连到 `text` | 类型 `UserMessage` vs `str` 需确认 | 查 schema 确认 `ai/translation` 的 `text` 端口能接收 |

### 最终方案

```
chat/input ──user_message──→ ai/translation ──context──→ chat/output
```

- 3 个节点，2 条连线
- `ai/translation` 默认配置即可工作（auto 检测语言 → 翻译为中文）
- 可选扩展：术语表、多引擎、风格切换、长文档 Artifact

---

## 核心心法

> **先查再做，不要想当然。**
>
> 节点类型要搜了才知道有没有专用的；
> 端口名要查了才能确认拼写；
> 类型要看了才能确认兼容。
>
> 每一步查询，都是在为后面的顺利铺路。

---

*Skill 版本：2.0 · 结构化创建 + 图校验（validate_workflow / 结构化 import）*
