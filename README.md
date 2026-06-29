# LLM Wiki

> 一个为 LLM 消费而设计的结构化、人工策展的知识库。
> 由 [Andrej Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 推广。

本文档亦提供[英文版](./README-en.md)。

## 快速开始

```bash
# 1. 配置环境变量
export LLM_WIKI_PATH=/path/to/llm-wiki

# 2. 冷启动（从目标仓库构建 Wiki）
/wiki-bootstrap --repo /path/to/target-repo

# 3. 开始提问
/wiki-query "这个项目是做什么的？"
```

## 核心工作流

```text
         ┌──────────┐     ┌──────────┐     ┌──────────┐
         │  INGEST  │ ──► │  REVIEW  │ ──► │  QUERY   │
         │  摄入文档  │     │  人工审核  │     │  知识查询  │
         └──────────┘     └──────────┘     └──────────┘
               │                                 │
               └──────────┬──────────────────────┘
                          ▼
                    ┌──────────┐
                    │   LINT   │
                    │  健康检查  │
                    └──────────┘
```

## 目录结构

```
llm-wiki/
├── wiki/                       # 活的知识库
│   ├── index.md                # 全局索引 + 元数据
│   ├── log.md                  # 操作审计日志
│   ├── .wiki-config.yml        # 可配置阈值与策略
│   ├── metrics.md              # 效果度量仪表盘
│   ├── sources/                # 来源页面（flat）
│   ├── entities/               # 实体页面（flat）
│   ├── concepts/               # 概念页面（flat）
│   └── synthesis/              # 综合问答（flat）
├── raw/                        # 待摄入文档（不可变）
├── questions_pending/          # 待人工审核
├── questions_approved/         # 已审核通过
├── lint_pending/               # Lint 问题待处理
├── lint_approved/              # Lint 修复已批准
├── rejected/                   # 已拒绝条目（分层保留）
├── tools/                      # 维护脚本
│   ├── check-frontmatter.mjs   # Schema 验证
│   ├── migrate-schema.mjs      # Schema 迁移
│   ├── check-links.mjs         # WikiLink 验证
│   ├── verify-index.mjs        # Index 一致性
│   ├── generate-metrics.sh     # 度量仪表盘
│   └── cleanup-rejected.sh     # 过期拒绝清理
└── .gitleaks.toml              # 敏感信息检测配置
```

## Copilot 扩展（awesome-copilot-x/plugins/）

| 类型 | 文件 | 功能 |
|------|------|------|
| Skill | `skills/wiki-ingest/SKILL.md` | 文档摄入 |
| Skill | `skills/wiki-query/SKILL.md` | 知识查询 |
| Skill | `skills/wiki-lint/SKILL.md` | 健康检查 |
| Skill | `skills/wiki-sync/SKILL.md` | 增量同步 |
| Skill | `skills/wiki-capture/SKILL.md` | 会话知识捕获 |
| Skill | `skills/wiki-review/SKILL.md` | 人工审核 |
| Skill | `skills/wiki-bootstrap/SKILL.md` | 冷启动引导 |
| Agent | `agents/wiki-ingestor.agent.md` | Ingest 专用 Agent |
| Agent | `agents/wiki-querier.agent.md` | Query 专用 Agent |
| Agent | `agents/wiki-linter.agent.md` | Lint 专用 Agent |
| Agent | `agents/wiki-reviewer.agent.md` | Review 专用 Agent |
| Instruction | `instructions/llm-wiki-schema.instructions.md` | 页面格式规范 |
| Instruction | `instructions/wiki-context.instructions.md` | 跨会话上下文 |

## LLM Wiki vs RAG

| 维度 | RAG | LLM Wiki |
|------|-----|----------|
| **数据处理** | 原始文档，每次检索片段 | 编译为结构化页面 |
| **状态** | 无状态 | 有状态 — 知识持续累积 |
| **成本** | 每次查询便宜 | 摄入昂贵，查询便宜 |
| **最适合** | 海量变化文档 | ~100-500 篇精选资料 |

## 参考

- [Karpathy 原始 Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [llm-wiki-nocode](https://github.com/rosidotidev/llm-wiki-nocode) — 参考实现