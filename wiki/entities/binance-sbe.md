---
type: entity
id: binance-sbe
title: "Binance SBE（Simple Binary Encoding）"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - sbe
  - binary-encoding
  - low-latency
  - serialization
category: protocol
sources:
  - binance-api-docs
related:
  - binance
  - binance-api-types-comparison
status: active
schema_version: "0.1"
---

# Binance SBE（Simple Binary Encoding）

## 定义

SBE（Simple Binary Encoding，简单二进制编码）是 Binance 提供的超低延迟数据编码格式，用于对性能敏感的 API 响应传输。Binance 为 Rust、Java、C++ 提供 SBE 解码器参考实现和示例应用。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/introduction` 章节——"SBE（Simple Binary Encoding）——不同 API 类型在延迟、吞吐、运维复杂度和客户端设计方面各有取舍。"

## 关键属性

- **定位**：仅在需要二进制传输效率或低延迟时才考虑——通用场景建议 REST/WebSocket
- **工作流**：从 STDIN 读取 SBE 编码载荷 → 解码 → 人类可读格式（YAML 或 JSON）输出到 STDOUT
- **SBE 模式**：基于 [Simple Binary Encoding (SBE)](https://github.com/aeron-io/simple-binary-encoding) 标准，从 Binance 官方模式文件生成解码器

> 来源：文档各 SBE 示例应用章节。

## 参考实现（3 种语言）

| 语言 | 输出格式 | 仓库 |
|------|----------|------|
| Rust | YAML | [binance-sbe-rust-sample-app](https://github.com/binance/binance-sbe-rust-sample-app) |
| Java | YAML | [binance-sbe-java-sample-app](https://github.com/binance/binance-sbe-java-sample-app) |
| C++ | JSON | [binance-sbe-cpp-sample-app](https://github.com/binance/binance-sbe-cpp-sample-app) |

> 来源：文档 SBE 示例应用各章节。

## 典型 SBE REST 请求

```bash
curl -H "Accept: application/sbe" -H "X-MBX-SBE: 3:1" \
  "https://api.binance.com/api/v3/exchangeInfo" \
  | ./target/debug/sbe-sample-app
```

- `Accept: application/sbe` 请求 SBE 编码响应
- `X-MBX-SBE: 3:1` 指定 SBE schema 版本
- 示例应用本身不执行请求签名，仅解码响应

> 来源：文档 SBE Rust 示例应用使用示例。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/binance-api-types-comparison]] — API 类型对比
