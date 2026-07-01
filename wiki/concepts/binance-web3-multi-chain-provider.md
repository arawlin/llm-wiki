---
type: concept
id: binance-web3-multi-chain-provider
title: "Binance Web3 多链钱包 Provider 模式"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - web3
  - wallet
  - multi-chain
  - provider-pattern
sources:
  - binance-api-docs
related:
  - entities/binance-web3-wallet
  - agentic-wallet-skills
status: active
schema_version: "0.1"
---

# Binance Web3 多链钱包 Provider 模式

## 定义

Binance Web3 Wallet 通过统一的 `window.binancew3w` 全局注入对象，为十余条异构区块链提供各自的 Provider API，使 dApp 能以一致的模式连接和操作不同链上的资产。

> 来源：`raw/binance-api-doc-llms-full.txt`，各链 Provider 文档章节——EVM (`/products/web3-connect/evm-compatible-provider`)、Bitcoin (`/products/web3-connect/bitcoin-provider`)、TON (`/products/web3-connect/ton-provider`)、Cosmos (`/products/web3-connect/cosmos-provider`)、Solana、Sui、Aptos 等。

## 核心思想

### 统一注入 + 链适配器模式

```
window.binancew3w
├── ethereum        → EVM 兼容链 (EIP-1193)
├── bitcoin         → Bitcoin (Unisat-like API)
├── keplr           → Cosmos (Keplr-compatible)
├── tonconnect      → TON (TonConnect protocol)
├── solana          → Solana (Wallet Standard)
├── sui             → Sui (Wallet Standard / dApp Kit)
├── aptos           → Aptos (AIP-62 Wallet Standard)
└── ...
```

> 来源：各 Provider 文档的 Provider Detection 代码示例。

### 两种桥接方式（TON 为例）

TON 的 Provider 展示了多链钱包的典型桥接架构：

1. **JS Bridge API**：dApp 在钱包浏览器内打开时使用——直接访问 `window.binancew3w.tonconnect`
2. **HTTP Bridge API**：dApp 在钱包外打开时使用——通过 HTTP 桥接服务器中转加密消息

> 来源：文档 `/products/web3-connect/ton-provider`——"When the dapp is opened in the Binance Web3 Wallet browser, the window.binancew3w object will be injected" 和 HTTP Bridge API 章节。

### 检测辅助工具

```ts
import { isInBinance } from "@binance/w3w-utils";
isInBinance(); // 判断 dApp 是否在 Binance Web3 Wallet 浏览器中

// 或直接检测
window.ethereum.isBinance; // boolean
```

> 来源：文档 EVM Provider 的 Utility 章节。

### 深度链接生成

```ts
import { getDeeplink } from '@binance/w3w-utils'
getDeeplink(url, defaultChainId) // 返回 { bnc: deeplink, http: universalLink }
```

引导用户在 Binance dApp 浏览器中打开你的 dApp。

> 来源：文档 EVM Provider 的 `getDeeplink` 部分。

### 前端框架集成矩阵

| 框架/工具 | 包名 | 用途 |
|-----------|------|------|
| RainbowKit v2 | `@binance/w3w-rainbow-connector-v2` | React 钱包连接 UI |
| wagmi v2 | `@binance/w3w-wagmi-connector-v2` | React Hooks 钱包管理 |
| BlockNative | `@binance/w3w-blocknative-connector` | 多钱包聚合 |
| TronWeb | `@tronweb3/tronwallet-adapter-binance` | Tron 链适配 |

> 来源：文档 EVM、Tron 等 Provider 文档的安装和集成代码示例。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[entities/binance-web3-wallet]] — Binance Web3 Wallet 实体
