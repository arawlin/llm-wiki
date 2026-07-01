---
type: concept
id: binance-api-authentication
title: "Binance API 鉴权与签名"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - api
  - authentication
  - security
  - cryptography
sources:
  - binance-api-docs
related:
  - binance
  - binance-request-signing-payload
  - binance-api-types-comparison
status: active
schema_version: "0.1"
---

# Binance API 鉴权与签名

## 定义

Binance API 的请求鉴权体系，包括鉴权类型分级（NONE / TRADE / USER_DATA 等）、三种签名算法（HMAC-SHA256 / RSA / Ed25519）以及时间同步安全机制（timestamp + recvWindow）。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/products/wallet/general-info` 请求鉴权类型和签名示例章节。

## 核心思想

### 鉴权类型六级

| 类型 | 描述 | 需要签名 |
|------|------|----------|
| `NONE` | 公共接口，无需鉴权 | 否 |
| `TRADE` | 交易接口 | 是 |
| `MARGIN` | 杠杆接口 | 是 |
| `USER_DATA` | 用户数据接口 | 是 |
| `USER_STREAM` | 用户数据流 | 否（仅需 API-Key） |
| `MARKET_DATA` | 市场数据 | 否（仅需 API-Key） |

> 来源：文档基本信息章节的鉴权类型表格。

### 三种签名算法对比

| 属性 | HMAC-SHA256 | RSA | Ed25519 |
|------|-------------|-----|---------|
| 密钥类型 | 对称（共享 Secret） | 非对称（PKCS#8） | 非对称（推荐） |
| 签名大小写 | **不区分** | **大小写敏感** | **大小写敏感** |
| 签名输出 | Hex 字符串 | Base64（需 URL 编码） | Base64（需 URL 编码） |
| 性能 | 快 | 较慢 | **最佳** |
| 适用场景 | 通用 REST/WebSocket | 通用 REST/WebSocket | 通用 + FIX API（强制） |

> 来源：文档三种签名类型的示例章节——"我们强烈建议使用 Ed25519 API keys，因为它在所有受支持的 API key 类型中提供最佳性能和安全性。"

### 时间同步安全

```
serverTime = getCurrentTime()
if (timestamp < (serverTime + 1 second) && (serverTime - timestamp) <= recvWindow) {
    // 处理请求
} else {
    // 拒绝请求（错误码 -1021 INVALID_TIMESTAMP）
}
```

- `timestamp`：毫秒级 UNIX 时间戳（必须）
- `recvWindow`：请求有效期（毫秒），最大 60000（60 秒），**不推荐超过 5 秒**

> 来源：文档基本信息章节的"时间同步安全"代码逻辑。

### 签名 payload 构建通用流程

1. 将参数格式化为 `参数=取值` 对，用 `&` 连接
2. 对非 ASCII 字符进行百分比编码（percent-encoding）
3. 使用对应算法对 payload 签名
4. HMAC → Hex 输出；RSA/Ed25519 → Base64 → 百分比编码
5. 将 `signature` 参数附加到 query string

> 来源：文档三种签名类型的"第一步/第二步/第三步"分步说明。

## 相关概念

- [[concepts/binance-request-signing-payload]] — 签名 payload 构建细节
- [[entities/binance-fix-api]] — FIX API 仅支持 Ed25519

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
