---
type: concept
id: binance-api-types-comparison
title: "Binance API 类型对比"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - api
  - architecture
  - rest
  - websocket
  - fix
  - sbe
sources:
  - binance-api-docs
related:
  - entities/binance
  - entities/binance-fix-api
  - entities/binance-sbe
  - binance-rate-limiting
status: active
schema_version: "0.1"
---

# Binance API 类型对比

## 定义

Binance 提供的五种 API 形式及其在延迟、吞吐、运维复杂度和适用场景方面的差异化定位。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/introduction` 章节——"不同 API 类型在延迟、吞吐、运维复杂度和客户端设计方面各有取舍。具体产品文档会说明何时更适合使用某种接口。"

## 核心思想

### 五种 API 类型全景

| API 类型 | 通信模式 | 延迟 | 复杂度 | 适用场景 |
|----------|----------|------|--------|----------|
| **REST API** | 请求-响应（HTTP） | 中 | 低 | 通用集成、账户管理、历史数据 |
| **WebSocket API** | 双向请求-响应（WS） | 低 | 中 | 实时交易、订单状态推送 |
| **WebSocket Streams** | 单向数据推送（WS） | 低 | 中 | 实时行情、K 线、深度数据 |
| **FIX API** | 会话式（TCP/TLS） | 极低 | 高 | 机构交易、低延迟订单报送 |
| **SBE** | 二进制编码响应 | 极低 | 高 | 超低延迟解码、高频数据消费 |

> 来源：文档 `/introduction` API 类型章节；各连接器/SBE 文档的性能定位说明。

### 选择决策树

```
需要什么？
├── 同步查询/管理操作 → REST API
├── 实时数据推送（单向） → WebSocket Streams
│   └── 注意：单连接最多 1024 Streams
├── 实时双向交互（下单+接收更新） → WebSocket API
├── 机构级/超低延迟交易 → FIX API
│   └── 仅支持 Ed25519 密钥
└── 极致解码性能/高频消费 → SBE
    └── 通用场景不推荐，REST/WS 更易用
```

> 来源：综合各文档章节的产品定位推断（confidence: high）。

### 数据来源时效性层级

Binance 内部数据源按更新速度排序：

1. **撮合引擎**（最新）— 实时交易数据
2. **缓存**（内部或外部）— 近实时数据
3. **数据库**（最慢）— 历史/持久化数据

部分接口标注多数据源如 `缓存 => 数据库`，表示先从缓存查询，无数据时回退到数据库。

> 来源：文档基本信息章节的"数据来源"部分。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[entities/binance-fix-api]] — FIX API 实体
- [[entities/binance-sbe]] — SBE 实体
- [[concepts/binance-rate-limiting]] — 速率限制
