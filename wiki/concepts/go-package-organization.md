---
type: concept
id: go-package-organization
title: "Go 包结构组织：按行为而非分层"
created: 2026-08-01
updated: 2026-08-01
tags:
  - go
  - package
  - architecture
  - project-structure
  - best-practice
  - yagni
  - design
sources: []
related:
  - concept-planning-doc-hierarchy
status: active
schema_version: "0.1"
last_reviewed: 2026-08-01
---

# Go 包结构组织：按行为而非分层

## 定义

Go 服务应用的组织原则：**包按行为/领域（behavior/domain）划分，不按技术分层（layer）划分**；同一包内部用"文件分关注点"（file-per-concern）组织。将"消费者/处理器/存储"之类的分层拆成独立包是 Java 式分层思想移植到 Go 的反模式——它强迫共享类型导出并寄居在某个语义不当的包中，且每次改类型签名都要跨包动刀。

## 核心原则

1. **包按行为组织，不按分层**。`consumer/`（Kafka 层）、`handlers/`（逻辑层）、`store/`（DB 层）即 package-per-layer 反模式。分层拆包的直接后果：共享类型必须导出、且被迫住在"随便"的包里；跨包改签名的成本高。
2. **同包内用文件分关注点，而不是包分关注点**。最强先例是标准库 `net/http`：`server.go` / `client.go` / `transport.go` / `cookie.go` 全在**一个包**——服务端、客户端、传输层若按分层拆包就是 `http/server/`、`http/client/`、`http/transport/`，标准库没有这么做。`database/sql` 同理。共享未导出辅助代码、互相调用的组件必须同包。
3. **不要为"单个函数/胶水"建包**。一个包只有一个函数（如仅一个 row loader）是明显的过度拆分信号，支付了 import 税却无回报。
4. **复用测试（YAGNI）**：`internal/` 内无外部消费者的代码不预先拆包。判断标准：这个包会被本包之外的地方 import 吗？不会 → 不拆。未来出现真实复用需求时再拆，`internal/` 内拆分成本极低。
5. **扩展性是契约层的属性，不是包边界的属性**。O(1) 扩展性来自 registry 模式 + key 约定 + 稳定的接口签名（如 `map[string]Handler` + `mode.status` key），与"某部分是不是独立包"无关。契约层（命名、API、事件格式）要设计扩展性；实现层（internal/ 内部代码）遵循 YAGNI。
6. **共享类型决定依赖方向，防止 import cycle**。当消费循环与处理器共享核心类型（DTO）且互相调用时，把它们拆成两个包必然产生"root → handlers → root"的循环依赖（Go 不允许）。消除环的正确手段是**类型归属**（全部同包，或类型放被依赖方），而不是再拆第三个包。

## 判断方法

| 测试 | 判定 |
|------|------|
| 复用测试 | 该代码会被本包外 import 吗？不会 → 不拆包 |
| 类型共享测试 | 多个"层"共享 DTO 且互相调用？是 → 单包 + 文件分关注点 |
| 包体量测试 | 包内只有一个函数/一个文件？是 → 过度拆分，合并 |
| 契约 vs 实现 | 是公开契约（API/事件/命名）→ 设计扩展性；是实现层（internal/）→ YAGNI |

## 应用示例：ResultReconciler 单包方案

对一个"消费循环 + 5 类 handler + PG 状态写回"的紧凑单元，推荐单包：

```text
internal/control/reconciler/
├── types.go          // 共享 DTO（ReconcileScope/ReconcileEvent/SyncStateRow）+ loader
├── registry.go       // Handler 类型 + HandlerRegistry + Dispatch（契约层，可导出）
├── consumer.go       // 消费循环
├── backfill.go       // 回填 lane handler
├── incremental.go    // 增量 lane handler
├── consumer_test.go  // 集成测试（kfake/testcontainers）
└── handlers_test.go  // 单测（pgxmock）
```

对比的反例：

- **三包拆分**（`consumer/` + `handlers/` + `store/`）：分层反模式；`store/` 只有 1 个函数；类型被迫寄居 `handlers/`。
- **handlers 子包 + 类型在根包**：`consumer.go`（root）调用 `handlers.Dispatch`，而 `handlers` 的签名依赖 root 的 DTO → import cycle，编译不过。spike 草稿布局常见此隐患，需在落地前钉死"类型住在哪"。

## 相关概念

- [[concepts/planning-doc-hierarchy]] — 项目规划文档体系：职责边界（契约层设计扩展性、实现层遵循 YAGNI 的分层原则）

## 出现在

- 本概念源自 2026-08-01 ex-server-1 骨架实现计划 TASK-009（reconciler 包结构）评审讨论

## 来源

本概念提炼自 2026-08-01 ex-server-1 骨架实现计划 TASK-009（reconciler 包结构）评审讨论。评审发现 plan 的 `consumer/`+`handlers/`+`store/` 三包拆分偏离 spike 收敛布局，且 spike 原布局（`handlers/` 子包 + 类型在根 `syncstate.go`）存在隐藏的 import cycle（root 依赖 handlers 调 Dispatch，handlers 依赖 root 用 DTO），据此归纳出"包按行为不按分层、文件分关注点、单函数包为过度拆分、YAGNI 复用测试"的业界共识。

- 本会话讨论（2026-08-01）：ex-server-1 骨架实现计划 TASK-009 评审
- `docs/spikes/v1-result-reconciler-implementation-spike.md` T4.1–T4.2（消费循环、handler registry、包结构草稿）
- 外部引用：Dave Cheney《Package names》、Kat Zien《How Do You Structure Go Apps》、Go 标准库 `net/http` / `database/sql`、Effective Go [unverified — 会话中引用，未逐一核对原文链接]
