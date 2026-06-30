---
type: index
id: wiki-index
title: "LLM Wiki — 索引"
created: 2026-06-29
updated: 2026-06-29
last_commit: null
schema_version: "0.1"
last_commit: null
freshness_policy:
  source: 30
  synthesis: 60
  entity: 90
  concept: 180
deprecated_fields: []
---

# LLM Wiki 索引

> 全局索引页面，维护 Wiki 元数据和目录。

## Schema 版本

- **当前版本**：`0.1`
- **废弃字段**：无

## Freshness 策略

| 页面类型 | 复查周期（天） | 说明 |
|----------|---------------|------|
| `source` | 30 | 来源页面，需频繁复查 |
| `synthesis` | 60 | 综合问答，中频复查 |
| `entity` | 90 | 实体页面，低频复查 |
| `concept` | 180 | 概念页面，最低频复查 |

## 页面目录

### Sources（来源）

- [[sources/redpanda-console-technical-summary]] — Redpanda Console 技术知识总结（2026-06-29）

<!-- LLM: 按 tags 分组列出所有 sources 页面 -->

### Entities（实体）

- [[entities/redpanda-console]] — Redpanda Console | tags: redpanda, kafka, web-ui, dev-tools, observability

<!-- LLM: 按 tags 分组列出所有 entities 页面 -->

### Concepts（概念）

- [[concepts/console-deserialization-matrix]] — 消息反序列化能力矩阵 | tags: redpanda-console, serialization, kafka
- [[concepts/console-docker-compose-config-injection]] — Docker Compose 配置注入模式 | tags: redpanda-console, docker-compose, configuration

<!-- LLM: 按 tags 分组列出所有 concepts 页面 -->

### Synthesis（综合）

<!-- LLM: 按 tags 分组列出所有 synthesis 页面 -->

---

*此文件由 LLM 自动维护，请勿手动编辑目录部分。*
