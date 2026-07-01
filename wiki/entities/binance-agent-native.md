---
type: entity
id: binance-agent-native
title: "Binance Agent 原生"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - ai
  - agent
  - llm
  - mcp
category: platform
sources:
  - binance-api-docs
related:
  - llms-txt-standard
  - binance-skills-hub
status: active
schema_version: "0.1"
---

# Binance Agent 原生

## 定义

Binance Agent 原生是 Binance 面向 AI Agent 和 LLM 工具的文档与集成基础设施，包括 `llms.txt` 文档索引、Agent REST API（结构化 JSON 端点）和 MCP Server（Model Context Protocol 服务器），使 AI Agent 能以程序化方式发现、理解和调用 Binance API。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/agent-native/overview` 章节——"Binance API 从设计上即对 Agent 友好。无论你在构建自动化交易机器人、AI 驱动的助手，还是自动化工作流……"

## 关键属性

### 三个核心组件

1. **llms.txt / llms-full.txt**：面向 LLM 的文档索引——`llms.txt` 为摘要（标题+描述+链接），`llms-full.txt` 为全量文档合并文件。遵循 [llmstxt.org](https://llmstxt.org/) 拟议标准。
2. **Agent REST API**：针对程序化和 Agent 驱动访问优化的结构化端点，返回 JSON 而非 Markdown，支持过滤查询。
3. **MCP Server**：Model Context Protocol 服务器，无缝集成 Claude Code、Cursor 等兼容 MCP 的 IDE 和工具。

> 来源：文档 `/agent-native/overview` 核心组件章节和 `/agent-native/llms-txt` 章节。

### llms.txt 使用示例

```bash
# 摘要 — 文档标题、描述和链接
curl -s https://developers.binance.com/zh-CN/docs/llms.txt

# 完整内容 — 单个文件中的完整文档
curl -s https://developers.binance.com/zh-CN/docs/llms-full.txt
```

```python
# LangChain 集成
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://developers.binance.com/zh-CN/docs/llms-full.txt")
docs = loader.load()
```

> 来源：文档 `/agent-native/llms-txt` 章节的代码示例。

### 何时用 llms.txt vs 其他选项

- **llms.txt**：快速让 LLM 了解所有可用文档，或将完整文档加载到上下文
- **Agent REST API**：需要结构化 JSON 数据、过滤查询或程序化访问
- **MCP Server**：使用 Claude Code、Cursor 或其他兼容 MCP 的 IDE

> 来源：文档 `/agent-native/llms-txt` 章节"何时使用 llms.txt 与其他选项"。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/llms-txt-standard]] — llms.txt 标准
