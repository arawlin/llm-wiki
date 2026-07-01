---
type: entity
id: binance-web3-wallet
title: "Binance Web3 Wallet"
created: 2026-07-01
updated: 2026-07-01
tags:
  - binance
  - web3
  - wallet
  - multi-chain
  - mpc
category: platform
sources:
  - binance-api-docs
related:
  - binance-web3-multi-chain-provider
  - agentic-wallet-skills
status: active
schema_version: "0.1"
---

# Binance Web3 Wallet

## 定义

Binance Web3 Wallet 是基于 MPC（Multi-Party Computation，多方计算）密码学标准构建的去中心化钱包，集成在 Binance App 中，为 dApp 提供多链连接、交易签名和资产管理能力。

> 来源：`raw/binance-api-doc-llms-full.txt`，文档 `/products/web3-connect/introduction` 章节——"The Binance Wallet is built on the latest multi-party computation (MPC) cryptographic standard, providing unmatched security."

## 关键属性

- **安全模型**：MPC 多方计算——私钥分片存储，每方仅持有自己的密钥片段
- **注入方式**：`window.binancew3w` 全局对象，包含各链 Provider（`ethereum`、`bitcoin`、`keplr`、`tonconnect`、`solana` 等）
- **支持区块链**：EVM（BSC、Ethereum 等）、Solana、Bitcoin、TON、Cosmos、Sui、Aptos、Movement、Avail、Tron
- **附加功能**：生物识别认证、Wallet Connect 支持、SoulBound Token（SBT）、Binance 账户到 Web3 钱包的资金划转
- **SDK 集成**：RainbowKit v2、wagmi v2、BlockNative（@web3-onboard）、TronWeb、Aptos Wallet Adapter、Solana Wallet Adapter

> 来源：文档 `/products/web3-connect/evm-compatible-provider`、`/products/web3-connect/bitcoin-provider` 等各链 Provider 章节。

## 多链 Provider 检测模式

```
// EVM
window.binancew3w.ethereum

// Bitcoin
window.binancew3w.bitcoin

// Cosmos (Keplr-compatible)
window.binancew3w.keplr

// TON
window.binancew3w.tonconnect

// Solana (Wallet Standard)
// 自动通过 Wallet Adapter 检测

// Sui (Wallet Standard)
// 通过 @mysten/dapp-kit 自动检测
```

> 来源：各 Provider 文档章节中的 Provider Detection 代码示例。

## 出现在

- [[sources/binance-api-docs]] — Binance 开发者文档
- [[concepts/binance-web3-multi-chain-provider]] — 多链钱包 Provider 模式
