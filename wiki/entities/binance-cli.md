---
type: entity
id: binance-cli
title: "Binance CLI"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - cli
  - tool
  - trading
category: tool
sources:
  - binance-api-docs
related:
  - binance
status: active
schema_version: "0.1"
---

# Binance CLI

## 定义

Binance CLI 是一个基于 Node.js 的命令行工具，可直接从终端与 Binance REST API 和 WebSocket Streams 交互，适用于快速查询、调试和脚本自动化。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/sdks-tools/tools/binance-cli` 章节。

## 关键属性

- **状态**：⚠️ 未积极维护，但定期更新——可能不包含最新接口
- **环境**：Node.js（全局安装）、类 Unix（Linux、macOS）
- **功能范围**：现货、USDⓈ-M 合约、COIN-M 合约的部分 API；REST 交互 + WebSocket 数据流
- **安装**：`git clone` 后 `npm install -g`
- **典型命令**：`binance-cli time`（服务器时间）、`binance-cli book BNBUSDT`（订单簿）、`binance-cli buy -s BNBUSDT -t LIMIT -q 0.05 -p 350`（下限价买单）

> 来源：文档使用概览部分的命令示例。

## 限制

- API 和产品覆盖范围有限，可能落后于当前 API
- Binance 官方建议生产系统使用官方 SDK（JS/Python/Go/Java/PHP/Rust）而非 CLI
- 代码仓库：[github.com/binance/binance-cli](https://github.com/binance/binance-cli)

> 来源：文档中"状态"和"注意事项"章节。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
