---
type: concept
id: planning-doc-hierarchy
title: "项目规划文档体系：职责边界"
created: 2026-07-23
updated: 2026-07-23
tags:
  - requirements-engineering
  - documentation
  - prd
  - architecture
  - spike
  - implementation-plan
  - ddd
  - ubiquitous-language
sources: []
related:
  - concept-conventional-commits
status: active
schema_version: "0.1"
---

# 项目规划文档体系：职责边界

## 定义

项目规划文档体系是需求工程中用于分层管理"为什么做、做什么、怎么做"的五类文档及其职责边界。每类文档回答不同层次的问题，内容越层（如 PRD 中写数据库字段类型）会导致单一事实来源被破坏、同步成本升高、关注点混淆。

## 五类文档的职责

| 文档 | 核心问题 | 典型内容 | 不应包含 |
|------|---------|---------|---------|
| **Epic PRD** | 为什么做？做什么？ | 问题陈述、用户画像、核心领域概念与实体关系、业务规则、成功指标 | 字段类型、表结构、技术选型 |
| **Feature PRD** | 这个功能做什么？怎么验收？ | 用户故事、功能需求、数据需求（需记录哪些业务数据）、验收标准（Given/When/Then） | 字段类型、索引、API 路由、加密算法 |
| **Architecture Spec** | 系统怎么搭？ | 组件划分、技术栈、数据模型（表/字段/索引）、API 设计、数据流 | 用户故事、业务规则、任务排期 |
| **Technical Spike** | 某个不确定的技术点怎么解？ | 研究问题、调查计划、PoC 结果、推荐方案 | 完整实现、用户故事 |
| **Implementation Plan** | 怎么一步步做？ | 任务拆分、依赖关系、估时、排期 | 业务规则、用户故事 |

## 核心判断方法

### 内容归属判断口诀

| 内容类型 | 放哪里 | 判断口诀 |
|---------|--------|---------|
| 领域概念、实体关系（1:N 等） | Epic PRD | 删掉它，所有 feature 都受影响 → Epic |
| 用户故事、验收标准、数据需求（需存哪些业务数据） | Feature PRD | 只影响一个 feature → Feature PRD |
| 字段类型、索引、表结构、API 路由 | Architecture Spec | 换技术栈就需要改 → Arch Spec |
| 加密方案选型、ORM 选型、性能基准 | Technical Spike | 不确定怎么做，需要调研 → Spike |
| 任务拆分、估时、排期 | Implementation Plan | 怎么做、谁做、做多久 → Impl Plan |

### "换技术栈测试法"

判断一段内容是否属于实现细节的终极方法：

> 如果更换数据库（如关系型换文档型）、更换 ORM、更换框架，这句话还需要改吗？
> - 需要改 → 实现细节 → 放 Architecture Spec / Spike / Impl Plan
> - 不需要改 → 业务需求 → 放 PRD

### "业务数据需求" vs "技术实现细节"

这是最容易混淆的灰色地带。同一份数据，两种表述分属不同文档：

| 业务数据需求（→ Feature PRD） | 技术实现细节（→ Arch Spec / Spike） |
|------------------------------|-------------------------------------|
| "需记录订单状态、金额、创建时间" | "`orders.status` 为 `VARCHAR(20)`，`created_at` 加索引" |
| "需加密存储用户密钥" | "使用 AES-256-GCM，密钥通过 KMS 管理" |
| "用户和订单是 1:N 关系" | "用外键 `user_id` + `ON DELETE CASCADE`" |
| "需支持按状态筛选订单" | "`(user_id, status)` 建复合索引" |

## 常见越层错误

- ❌ Epic 中定义字段类型（如 `string id PK`）→ 越层到 Arch Spec
- ❌ Feature PRD 中写索引策略 → 越层到 Arch Spec
- ❌ PRD 中指定加密算法 → 越层到 Spike
- ✅ Epic 中定义实体和关系（如"用户 1:N 订单"）→ 正确
- ✅ Feature PRD 中写数据需求（"需记录订单状态、金额、创建时间"）→ 正确
- ✅ Architecture Spec 中写表结构和 API 端点 → 正确

## 理论依据

### DDD 统一语言（Ubiquitous Language）

Epic PRD 承担项目"统一语言文档"的角色——在进入战术设计（feature PRD）之前，先建立 bounded context 内的统一术语。核心领域概念（如"用户 vs 交易账户"的区别）应在 Epic 中一次性定义，所有 feature PRD 引用即可，避免每个 feature 形成自己的理解。

### 需求层次理论

分层需求体系中，文档有明确的职责分工：

| 层次 | 文档 | 职责 |
|------|------|------|
| 愿景层 | Epic | 定义产品是什么、为谁服务、核心领域概念 |
| 功能层 | Feature PRD | 定义某个功能做什么、怎么做 |
| 实现层 | Architecture Spec / Spike / Impl Plan | 定义具体技术方案 |

领域核心概念（如实体关系）属于愿景层，应在 Epic 中定义；字段类型属于实现层，应在 Architecture Spec 中定义。

### 过早决策（Premature Specification）

Epic 阶段定义 `passwordHash` 字段名，等于在没做技术选型时就锁定了实现细节——如果用托管认证服务，根本没有 `passwordHash` 字段；如果用 Passkey 无密码登录，连密码概念都不存在。Epic 只应规定"用户需要安全登录"，不应规定"怎么存密码"。

## 出现在

- [[concepts/conventional-commits]] — Conventional Commits（约定式提交）

## 来源

本概念提炼自 BitRes 后端平台 PRD 术语统一讨论会话（2026-07-23），经 `breakdown-epic-pm`、`breakdown-feature-prd`、`breakdown-epic-arch`、`create-technical-spike` 四个 SKILL.md 的官方定义交叉验证。核心问题起源于 Epic PRD 中"用户"和"账户"概念混用，通过 DDD 统一语言方法论完成术语统一，并在此基础上提炼出通用的文档分层职责边界框架。
