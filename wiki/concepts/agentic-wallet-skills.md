---
type: concept
id: agentic-wallet-skills
title: "Agentic Wallet Skills（AI Agent 钱包技能）"
created: 2026-07-01
updated: 2026-07-01
tags:
  - ai
  - agent
  - wallet
  - skills
  - mcp
  - cryptocurrency
sources:
  - binance-api-docs
related:
  - entities/binance-skills-hub
  - entities/binance-web3-wallet
  - entities/binance-agent-native
status: active
schema_version: "0.1"
---

# Agentic Wallet Skills（AI Agent 钱包技能）

## 定义

Agentic Wallet Skills 是一种将加密钱包操作封装为 AI Agent 可直接通过自然语言调用的可组合模块的设计范式。Binance Skills Hub 是该范式的典型实现——将代币查询、安全审计、市场分析、链上交易等能力拆分为独立技能，遵循 MCP（Model Context Protocol）标准。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/products/wallet-skills/overview`——"传统 API 需要开发者手动解析意图、调用接口、处理错误。Skills 把这些封装为 AI 可直接理解的模块：用自然语言意图触发，不需要写 API 调用。"

## 核心思想

### Skills vs 传统 API

| 维度 | 传统 API | Skills |
|------|----------|--------|
| 触发方式 | 手动编写 API 调用代码 | 自然语言意图 |
| 错误处理 | 开发者自行处理 | 技能内部封装 |
| 组合性 | 需要编排代码 | 可组合，自然语言级串联 |
| 环境兼容 | 特定 SDK | Claude、ChatGPT、Copilot 等通用 |

> 来源：文档 `/products/wallet-skills/overview`——"每个 Skill 是一个独立能力模块，可单独集成，也可组合使用。"

### 技能分层架构

```
AI Agent (Claude / ChatGPT / Copilot)
    │ 自然语言: "帮我查一下这个代币是否安全，然后买 0.1 BNB"
    ▼
MCP Server (Model Context Protocol)
    │ 技能发现 + 路由
    ▼
┌─────────────────────────────────────────────┐
│  Read Skills (只读)          Write Skills     │
│  ├─ query-token-audit       └─ agentic-wallet │
│  │   (安全审计: LOW/MED/HIGH风险)  (转账/兑换/限价单) │
│  └─ 返回: 风险 LOW, 税率 0%                   │
│         ↓ 自然语言级串联                       │
│     agentic-wallet.swap(0.1 BNB → TOKEN)     │
└─────────────────────────────────────────────┘
```

> 来源：综合 Skills Hub 文档的 8 个技能描述（confidence: medium，架构关系源自文档明确陈述的技能分类和能力边界）。

### 技能链覆盖

| 链 | 支持技能数 | 典型技能 |
|----|-----------|---------|
| BSC | 7 | query-token-info, query-token-audit, trading-signal, agentic-wallet... |
| Solana | 6 | meme-rush, query-token-info, trading-signal, agentic-wallet... |
| Base | 6 | query-token-info, crypto-market-rank, agentic-wallet... |
| Ethereum | 2 | query-token-audit, binance-tokenized-securities-info |

> 来源：各技能的"支持链"字段汇总（文档 `/products/wallet-skills/supported-skills` 章节）。

### 只读 vs 读写边界

- **只读技能**：无需钱包连接，Agent 可直接查询链上数据
- **读写技能**（`binance-agentic-wallet`）：需用户授权钱包连接，执行链上写操作
- 安全边界：写操作需显式用户确认，不可静默执行 [unverified]——文档未明确说明确认机制，但从 MCP 标准推断需要 human-in-the-loop

> 来源：文档技能表格的"需要钱包连接"列。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[entities/binance-skills-hub]] — Binance Skills Hub 实体
