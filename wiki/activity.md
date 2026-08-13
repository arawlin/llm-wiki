# Wiki Activity — 完整操作历史

> LLM Wiki 跨会话上下文桥梁的完整历史归档（2026-06-29 起）。
> 由 user memory `wiki-activity.md`（精简热缓存）指针引用；本文件 git 追踪，不占用 user memory 预算。
> 由 `/wiki-capture`、`/wiki-ingest`、`/wiki-review` 操作沉淀；最新 5 条的精简版见 `/memories/wiki-activity.md`。

## 最近更新（完整历史，倒序）

<!-- LLM: append after each operation; keep user memory copy trimmed to latest 5 -->- [2026-08-13] Wiki capture (买卖策略模型): 2 concepts（trade-signal-model + weight-vs-position）→ 直接写入 `wiki/concepts/`（用户拍板绕过 pending/review）；来源 GmgnTwitterTGAlert 会话 + context7 调研- [2026-08-01] Wiki ingest: 1 concept（Go 包结构组织）← `questions_approved/`，写入 `wiki/concepts/`
- [2026-08-01] Wiki review: 1 approved（Go 包结构组织, high confidence）→ `questions_approved/`，pending 清零
- [2026-08-01] Wiki capture (Go 包结构业界共识): 1 concept → `questions_pending/`（1 pending review）
- [2026-07-31] Wiki ingest: 2 concepts（OAuth 回调流程）← `questions_approved/`，写入 `wiki/concepts/`
- [2026-07-31] Wiki review: 2 approved（OAuth 回调流程, high confidence）→ `questions_approved/`，pending 清零
- [2026-07-31] Wiki capture (OAuth 回调流程): 2 concepts → `questions_pending/`（2 pending review）
- [2026-07-23] Wiki ingest: 1 concept（项目规划文档体系）← `questions_approved/`，写入 `wiki/concepts/`
- [2026-07-23] Wiki review: 1 approved（concept-planning-doc-hierarchy, high confidence）→ `questions_approved/`，pending 清零
- [2026-07-23] Wiki capture (项目规划文档体系): 1 concept → `questions_pending/`（1 pending review）
- [2026-07-01] Wiki cleanup: 删除 6 个概念页面（端点参数表/Stream 列表等参考数据），保留 7 个核心知识页面
- [2026-07-01] Wiki ingest: 1 concept（Conventional Commits）← `questions_approved/`，写入 `wiki/concepts/`
- [2026-07-01] Wiki review: 1 approved（concept-conventional-commits, high confidence）→ `questions_approved/`，pending 清零
- [2026-07-01] Wiki capture (Conventional Commits): 1 concept + 1 decision → `questions_pending/`（2 pending review）
- [2026-07-01] Wiki ingest: 1 source + 7 entity + 7 concept（Binance API 文档 —— API 类型、鉴权、限频、Web3 钱包、Skills Hub、Agent 原生、SBE/FIX）
- [2026-06-29] Wiki ingest: 1 source + 1 entity + 2 concepts（Redpanda Console 技术总结，已移除 ex-server-1 内容）
- [2026-06-29] Wiki review: 3 approved（batch, all high confidence）→ `questions_approved/`，pending 清零
- [2026-06-29] Wiki capture (Redpanda Console): 1 entity + 2 concepts → `questions_pending/`（3 pending review）
- [2026-06-29] Wiki review: 2 rejected（非知识性内容）→ `rejected/`，pending 清零
- [2026-06-29] Wiki capture (Redpanda 技术知识): 1 decision + 1 concept → `questions_pending/`（2 pending review）
- [2026-06-29] Wiki capture (Redpanda): 2 decisions + 2 concepts → `.wiki-capture/`（4 pending review）
- [2026-06-29] Wiki initialized — 0 pages, 0 pending, 0 lint issues.
