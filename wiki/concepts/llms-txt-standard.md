---
type: concept
id: llms-txt-standard
title: "llms.txt 标准"
created: 2026-07-01
updated: 2026-07-01
tags:
  - ai
  - llm
  - documentation
  - web-standard
  - agent
sources:
  - binance-api-docs
related:
  - entities/binance-agent-native
status: active
schema_version: "0.1"
---

# llms.txt 标准

## 定义

`llms.txt` 是 [llmstxt.org](https://llmstxt.org/) 提出的一项拟议 Web 标准，旨在使网站内容对大语言模型（LLM）更易于访问。类似于 `robots.txt` 告知爬虫哪些内容可抓取，`llms.txt` 告知 AI 工具有哪些文档可用及如何获取。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/agent-native/llms-txt` 章节——"llms.txt 是一项拟议标准，旨在使网站内容对大语言模型更易于访问。与用于网络爬虫的 robots.txt 类似，llms.txt 告知 AI 工具有哪些文档可用以及如何访问这些文档。"

## 核心思想

### 两种文件格式

| 文件 | 内容 | 用途 |
|------|------|------|
| `llms.txt` | 摘要索引——文档标题、描述和 URL 的结构化列表 | 快速让 LLM 了解文档结构 |
| `llms-full.txt` | 完整内容——所有文档合并为单一 Markdown 文件 | 将完整文档加载到 LLM 上下文窗口 |

> 来源：文档 `/agent-native/llms-txt` 文件表格。

### llms.txt 格式示例

```markdown
# Binance API Documentation

> Comprehensive API documentation for Binance trading platform.

## Spot Trading

- [Changelog](/docs/spot-trading/1.changelog): Spot Trading API changelog
- [README](/docs/spot-trading/2.readme): Getting started with Spot Trading API

## Derivatives Trading

- [Change Log](/docs/derivatives/change-log): Derivatives API changelog
```

> 来源：文档 `/agent-native/llms-txt` 格式章节。

### 集成模式

```
用途场景 → 选择方案：
├── 快速了解文档结构 → llms.txt
├── 深度上下文加载 → llms-full.txt
├── 结构化查询/过滤 → Agent REST API
└── IDE 内无缝集成 → MCP Server (Claude Code, Cursor)
```

### LangChain 集成

```python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://developers.binance.com/zh-CN/docs/llms-full.txt")
docs = loader.load()
```

> 来源：文档 `/agent-native/llms-txt` LangChain 示例。

## 相关概念

- [[entities/binance-agent-native]] — Binance 的 Agent 原生实现

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
