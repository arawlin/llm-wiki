---
type: entity
id: binance-skills-hub
title: "Binance Skills Hub"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - ai
  - agent
  - skills
  - mcp
category: platform
sources:
  - binance-api-docs
related:
  - agentic-wallet-skills
  - binance-agent-native
status: active
schema_version: "0.1"
---

# Binance Skills Hub

## 定义

Binance Skills Hub 是一个开放的 AI Agent 技能市场，将 Binance Web3 的链上能力封装为框架无关的、LLM 可直接调用的技能模块。托管于 GitHub [binance-skills-hub](https://github.com/binance/binance-skills-hub)。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/sdks-tools/tools/skills-hub` 章节——"Binance Skills Hub 是一个开放的 AI Agent 技能市场，可让任何 LLM 驱动的 Agent 原生访问币安加密能力。"

## 关键属性

- **标准**：遵循 MCP（Model Context Protocol）标准，任何兼容 MCP 的 Agent 无需自定义集成代码即可发现并调用
- **框架无关**：支持 Claude Code、LangChain、CrewAI、OpenClaw 及自定义 Agent 架构
- **技能分类**：
  - **只读**：行情查询、钱包余额、代币信息、热门代币、聪明钱动态、DeFi 协议数据、交易信号
  - **读写**：通过 Agentic Wallet 执行链上操作（代币转账、兑换、限价单）
- **环境要求**：Node.js 22+；通过适配器支持 Python Agent
- **安装方式**：`npx skills add https://github.com/binance/binance-skills-hub`

> 来源：文档 `/sdks-tools/tools/skills-hub` 章节。

## 已发布技能（8 个）

| 技能 | 类型 | 能力 |
|------|------|------|
| `query-token-info` | Read | 代币搜索、元数据、实时行情、K 线（BSC/Base/Solana） |
| `query-token-audit` | Read | 安全审计：风险评分、蜜罐检测、合约验证 |
| `query-address-info` | Read | 钱包地址持仓查询，含价格与余额 |
| `crypto-market-rank` | Read | 多维度市场排行榜（热度/聪明钱流入/Meme/交易者PnL） |
| `meme-rush` | Read | Meme 代币生命周期追踪 + AI 叙事话题发现 |
| `trading-signal` | Read | 链上聪明钱交易信号（Solana/BSC） |
| `binance-tokenized-securities-info` | Read | Ondo Finance 代币化美股链上数据 |
| `binance-agentic-wallet` | Read+Write | 钱包管理、代币转账、市价兑换、限价单 |

> 来源：文档 `/products/wallet-skills/supported-skills` 章节。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/agentic-wallet-skills]] — Agentic 钱包技能
