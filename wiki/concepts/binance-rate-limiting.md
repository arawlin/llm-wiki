---
type: concept
id: binance-rate-limiting
title: "Binance 速率限制与可靠性"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - api
  - rate-limiting
  - reliability
  - throttling
sources:
  - binance-api-docs
related:
  - binance
  - binance-api-types-comparison
status: active
schema_version: "0.1"
---

# Binance 速率限制与可靠性

## 定义

Binance API 实施的限频和反滥用机制，包括 IP 级别权重限制、账户级别下单频率限制和 WebSocket 连接限制，以及违反限制后的惩罚策略（429 → 418 封禁链）。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/products/wallet/general-info` 访问限制章节。

## 核心思想

### 双层限频体系

| 层级 | 粒度 | 头信息 | 违规后果 |
|------|------|--------|----------|
| **IP 级别** | 所有请求权重 | `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` | 429 → 418 封禁（2 分钟~3 天） |
| **账户级别** | 下单次数 | `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` | 429（不含 `Retry-After` 头） |

> `/api/*` 和 `/sapi/*` 采用两套独立的限频规则。

> 来源：文档访问限制章节的 IP 访问限制和下单频率限制部分。

### 429 → 418 封禁链

```
正常请求 → 超限 → 429 (含 Retry-After 秒数)
       ↓ 继续违规
     418 (IP 被封禁, 含 Retry-After 直到解封)
       ↓ 频繁违规
     封禁时间递增: 2分钟 → ... → 最长 3 天
```

> 来源：文档——"收到429后仍然继续违反访问限制，会被封禁IP，并收到418错误码"，"频繁违反限制，封禁时间会逐渐延长，从最短2分钟到最长3天。"

### WebSocket 连接限制

- **消息速率**：每秒最多 5 个消息（订阅、取消订阅、JSON 消息）
- **订阅上限**：单连接最多 1024 个 Streams
- **连接频率**：每 IP 每 5 分钟最多 300 次连接请求
- 超限后果：连接断开 → 重复违规 → IP 屏蔽

> 来源：文档 WEB SOCKET 连接限制章节。

### 生产环境集成建议

1. 了解每个接口的请求权重（越消耗资源的接口权重越大）
2. 实现重试与退避策略（exponential backoff）
3. 连接健康检查与自动重连
4. 监控 API 错误和服务降级
5. **优先使用 WebSocket 获取实时数据，减少 REST 轮询压力**

> 来源：文档访问限制章节的提示——"建议您尽可能多地使用websocket消息获取相应数据，以减少请求带来的访问限制压力。"

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/binance-api-types-comparison]] — API 类型对比
