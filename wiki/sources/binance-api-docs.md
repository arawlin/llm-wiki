---
type: source
id: binance-api-docs
title: "Binance 开发者文档"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - api
  - cryptocurrency
  - trading
  - web3
authors: []
published: 2026-06-01
entities_extracted:
  - binance
  - binance-web3-wallet
  - binance-skills-hub
  - binance-cli
  - binance-fix-api
  - binance-sbe
  - binance-agent-native
concepts_extracted:
  - binance-api-authentication
  - binance-rate-limiting
  - binance-api-types-comparison
  - llms-txt-standard
  - binance-web3-multi-chain-provider
  - agentic-wallet-skills
  - binance-request-signing-payload
status: active
schema_version: "0.1"
---

# Binance 开发者文档

## 摘要

Binance 开发者文档是 Binance 交易所面向开发者的核心 API 参考文档，覆盖 REST API、WebSocket API、WebSocket Streams、FIX API 和 SBE（Simple Binary Encoding）五种 API 类型。文档涵盖市场数据访问、账户操作、高级交易、流式传输以及低延迟集成——支持从简单脚本到专业交易系统的全场景开发。

> 来源：`raw/binance-api-doc-llms-full.txt`，从 `https://developers.binance.com/zh-CN/docs/llms-full.txt` 下载的完整 LLM 文档。

## 关键要点

1. **五种 API 类型**：REST（同步请求-响应）、WebSocket API（双向请求-响应）、WebSocket Streams（单向数据推送）、FIX（金融信息交换协议，机构级）、SBE（简单二进制编码，超低延迟）。
2. **三种签名鉴权**：HMAC-SHA256（对称）、RSA-PKCS#8（非对称）、Ed25519（推荐，最佳性能与安全性）。签名 payload 为 `参数=取值` 按 `&` 拼接后经百分比编码。
3. **双层限频**：IP 级别（`/api/*` 权重，违规封禁 2 分钟~3 天）和账户级别（下单频率 `ORDERS` 限制）。WebSocket 连接限 5 msg/s，单连接最多 1024 Streams。
4. **Agent 原生设计**：提供 `llms.txt` / `llms-full.txt`（面向 LLM 的文档索引）、Agent REST API（结构化 JSON）、MCP Server（Model Context Protocol 集成）。
5. **Binance Skills Hub**：开源 AI Agent 技能市场，8 个已发布 Wallet Skills（代币查询、安全审计、市场排行、Meme 追踪、交易信号等）+ Agentic Wallet Skill（读写链上操作）。
6. **Web3 多链钱包**：通过 `window.binancew3w` 注入，支持 EVM、Solana、Bitcoin、TON、Cosmos、Sui、Aptos、Movement、Avail、Tron 等十余条链的统一 Provider API。
7. **SDK 多语言覆盖**：官方积极维护：JavaScript/TypeScript（`@binance/spot`）、Python（`binance-sdk-spot`）、Go、Java、PHP、Rust。遗留版本：Ruby、.NET。

## 提及的实体

- [[entities/binance]] — Binance 交易平台
- [[entities/binance-web3-wallet]] — Binance Web3 钱包
- [[entities/binance-skills-hub]] — AI Agent 技能市场
- [[entities/binance-cli]] — 命令行工具
- [[entities/binance-fix-api]] — FIX 协议接入
- [[entities/binance-sbe]] — Simple Binary Encoding
- [[entities/binance-agent-native]] — Agent 原生设计

## 引入的概念

- [[concepts/binance-api-authentication]] — API 鉴权与签名
- [[concepts/binance-rate-limiting]] — 速率限制与可靠性
- [[concepts/binance-api-types-comparison]] — API 类型对比
- [[concepts/llms-txt-standard]] — llms.txt 标准
- [[concepts/binance-web3-multi-chain-provider]] — 多链钱包 Provider 模式
- [[concepts/agentic-wallet-skills]] — Agentic 钱包技能
- [[concepts/binance-request-signing-payload]] — 请求签名 payload 构建
