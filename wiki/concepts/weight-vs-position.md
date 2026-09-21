---
type: concept
id: weight-vs-position
title: "权重只排序、不直接定仓位（信号-决策-执行分层）"
created: 2026-08-13
updated: 2026-08-13
tags:
  - trading
  - risk-management
  - position-sizing
  - architecture
  - decision
sources: []
related:
  - trade-signal-model
status: active
schema_version: "0.1"
last_reviewed: 2026-08-13
---

# 权重只排序、不直接定仓位（信号-决策-执行分层）

## 定义

交易辅助系统的一条架构决策：**信号层（买卖权重评分）只负责标的排序与优先级，绝不直接映射为下单仓位**。仓位大小由独立的、固定的风控规则决定。信号 → 决策 → 执行三层职责分离，任何一层不得越权。

## 决策背景

原始诉求是「用 track 数据生成买卖权重来指导应该买哪个 token、买卖多少」。讨论后修正为：权重回答「买不买 / 优先级多高」，仓位回答「买多少」，后者不由前者直接决定。理由：

1. **信号强度 ≠ 安全仓位**：强信号可能是高波动、低流动性的标的（meme 币常态），直接按信号强度放大会放大尾部风险。
2. **信号有延迟与噪声**：跟随者看到 SM 买入时可能已在半山腰；单笔信号正确率不足以支撑大仓位。
3. **可回测性**：固定风控规则让 P&L 归因清晰（是选标的的功劳还是仓位管理的功劳可以分开评估），便于用真实结果反哺钱包信用分。

## 核心原则

### 三层分离

```mermaid
flowchart LR
    A[信号层<br/>Score 排序] --> B[候选池 top-N]
    B --> C[决策层<br/>人工/规则闸门]
    C --> D[执行层<br/>固定风控仓位]
```

1. **信号层**：加权净资金流评分（见 `trade-signal-model`），输出候选池排序 + 结构化信号（buy/sell pressure、冲突告警）。
2. **决策层**：人工确认或规则闸门（如「有冲突告警一律否决」）。
3. **执行层**：仓位由固定规则控制，与信号强度解耦。

### 执行层固定风控规则

- 单 token 仓位上限（如总资金 5–10%）
- 分批建仓（首仓 1/3，确认后加仓）
- 每日/单笔亏损熔断（circuit breaker）
- 冷却期（cooldown）防 FOMO 追高
- 滑点保护（slippage limit）
- 纸面交易（paper trading）先行，真实 P&L 反哺信号权重

## 判断方法

| 问题 | 判定 |
|------|------|
| 信号强 → 仓位大？ | ❌ 仓位由固定上限 + 分批规则决定 |
| 信号弱 → 不关注？ | ✅ 权重只做排序，低优先级 ≠ 否决 |
| 冲突告警（喊单者在卖）→ ？ | ✅ 决策层闸门直接否决，不进入执行层 |
| 权重可持续优化吗？ | ✅ 靠 paper trading 记录每信号 entry/exit/P&L，反哺钱包信用分 |

## 相关概念

- [[concepts/trade-signal-model]] — 买卖策略模型（评分公式、信号共振、落地架构）

## 出现在

- GmgnTwitterTGAlert 会话（2026-08-13）：对「用权重指导买卖多少」原始诉求的架构修正

## 来源

- context7: /bscsmartdev/polymarket-copy-trading-bot（position limits、daily loss limit、cooldown、circuit breaker、paper trading 先行的业界实践佐证）
