---
type: entity
id: binance-fix-api
title: "Binance FIX API"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - fix
  - trading
  - institutional
  - low-latency
category: protocol
sources:
  - binance-api-docs
related:
  - binance
  - binance-api-types-comparison
status: active
schema_version: "0.1"
---

# Binance FIX API

## 定义

Binance FIX API 是基于 FIX（Financial Information eXchange，金融信息交换）协议的低延迟订单报送接口，面向机构和专业交易系统，支持持久的 TCP/TLS 会话通信。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/sdks-tools/connectors/fix-python` 章节——"本连接器适用于高级和机构级使用场景，这些场景需要低延迟的订单报送、成交执行以及基于会话的交易工作流。"

## 关键属性

- **鉴权要求**：**仅支持 Ed25519 密钥**，不支持 HMAC 或 RSA
- **通信方式**：持久 TCP/TLS 连接，基于会话的 FIX 消息交互
- **功能范围**：现货 FIX 订单报送——下单、撤单、成交回报、订单状态更新
- **连接端点示例**：`tcp+tls://fix-oe.testnet.binance.vision:9000`（测试网）
- **会话管理**：需处理登录（Logon）、心跳（Heartbeat）、登出（Logout）等 FIX 会话生命周期

> 来源：文档 FIX Python 连接器章节的身份验证和快速开始部分。

## 消息示例

```
# 登录确认 → 等待 message_type="A" (Logon)
# 下单 → message_type="D" (New Order Single)
#   - ClOrdID (11): 客户订单ID
#   - Symbol (55): 交易对
#   - Side (54): 买卖方向
#   - OrderQty (38): 数量
#   - OrdType (40): 订单类型
#   - Price (44): 价格
#   - TimeInForce (59): 有效方式
# 成交回报 → message_type="8" (Execution Report)
```

> 来源：文档 FIX Python 连接器快速开始代码示例。

## Python FIX 连接器

- 包名：`binance-fix-connector`（PyPI）
- 核心辅助函数：`create_order_entry_session`——建立会话并提供消息创建/发送工具
- 私钥加载：`get_private_key("/path/to/private.key")`

> 来源：文档 `/sdks-tools/connectors/fix-python` 章节。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/binance-api-types-comparison]] — API 类型对比
