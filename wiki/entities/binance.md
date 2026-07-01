---
type: entity
id: binance
title: "Binance"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - cryptocurrency
  - exchange
  - trading
  - api
category: platform
sources:
  - binance-api-docs
related:
  - binance-api-authentication
  - binance-rate-limiting
  - binance-api-types-comparison
status: active
schema_version: "0.1"
---

# Binance

## 定义

Binance（币安）是全球最大的加密货币交易所之一，提供现货、合约、杠杆、质押等多种交易产品，并通过多层 API 体系向开发者开放程序化访问能力。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/introduction` 章节。

## 关键属性

- **API 类型**：REST API、WebSocket API、WebSocket Streams、FIX API、SBE
- **鉴权方式**：HMAC-SHA256、RSA（PKCS#8）、Ed25519（推荐）
- **环境支持**：Production（真实交易）、Testnet（免资金测试）、Demo（模拟环境）——不同产品支持程度不一
- **限频策略**：IP 级别权重 + 账户级别下单频率双重限制
- **数据来源层级**：撮合引擎（最新）> 缓存 > 数据库

> 来源：文档 `/products/wallet/general-info` 章节——"系统一共有3个数据来源，按照更新速度的先后排序。排在前面的数据最新，在后面就有可能存在延迟。"

## 开发者资源

- **官方 SDK**：JavaScript/TypeScript（`@binance/spot`）、Python（`binance-sdk-spot`）、Go、Java、PHP、Rust（积极维护）；Ruby、.NET（遗留版本）
- **开发者工具**：[[entities/binance-cli]]、非对称密钥生成器、Postman Collections
- **Agent 原生**：[[entities/binance-agent-native]]——llms.txt、Agent REST API、MCP Server
- **Skills Hub**：[[entities/binance-skills-hub]]——8+ AI Agent 可调用技能

> 来源：文档 `/sdks-tools/overview` 和 `/agent-native/overview` 章节。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
