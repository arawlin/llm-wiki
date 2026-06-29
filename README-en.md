# LLM Wiki

> A structured, human-curated knowledge base designed for LLM consumption.
> Popularized by [Andrej Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

This document is also available in [Chinese](./README.md).

## Quick Start

```bash
# 1. Configure environment variable
export LLM_WIKI_PATH=/path/to/llm-wiki

# 2. Bootstrap from a target repo
/wiki-bootstrap --repo /path/to/target-repo

# 3. Start querying
/wiki-query "What is this project about?"
```

## Core Workflow

```text
         ┌──────────┐     ┌──────────┐     ┌──────────┐
         │  INGEST  │ ──► │  REVIEW  │ ──► │  QUERY   │
         │ Documents │     │  Human   │     │  Answer  │
         └──────────┘     └──────────┘     └──────────┘
               │                                 │
               └──────────┬──────────────────────┘
                          ▼
                    ┌──────────┐
                    │   LINT   │
                    │  Health  │
                    └──────────┘
```

## Directory Structure

```
llm-wiki/
├── wiki/                       # Living knowledge base
│   ├── index.md                # Global index + metadata
│   ├── log.md                  # Audit log (JSON Lines)
│   ├── .wiki-config.yml        # Configurable thresholds
│   ├── metrics.md              # Metrics dashboard
│   ├── sources/                # Source pages (flat)
│   ├── entities/               # Entity pages (flat)
│   ├── concepts/               # Concept pages (flat)
│   └── synthesis/              # Synthesized Q&A (flat)
├── raw/                        # Documents awaiting ingestion
├── questions_pending/          # Awaiting human review
├── questions_approved/         # Reviewed and approved
├── lint_pending/               # Lint issues pending
├── lint_approved/              # Lint fixes approved
├── rejected/                   # Rejected entries (tiered retention)
├── contradictions_pending/     # Contradictions flagged
├── tools/                      # Maintenance scripts
│   ├── check-frontmatter.mjs   # Schema validation
│   ├── migrate-schema.mjs      # Schema migration
│   ├── check-links.mjs         # WikiLink validation
│   ├── verify-index.mjs        # Index consistency
│   ├── generate-metrics.sh     # Metrics dashboard
│   └── cleanup-rejected.sh     # Expired rejection cleanup
└── .gitleaks.toml              # Secret detection config
```

## Copilot Extensions (awesome-copilot-x/plugins/)

| Type | File | Purpose |
|------|------|---------|
| Skill | `skills/wiki-ingest/SKILL.md` | Document ingestion |
| Skill | `skills/wiki-query/SKILL.md` | Knowledge query |
| Skill | `skills/wiki-lint/SKILL.md` | Health check |
| Skill | `skills/wiki-sync/SKILL.md` | Incremental sync |
| Skill | `skills/wiki-capture/SKILL.md` | Session knowledge capture |
| Skill | `skills/wiki-review/SKILL.md` | Human review |
| Skill | `skills/wiki-bootstrap/SKILL.md` | Cold-start bootstrap |
| Agent | `agents/wiki-ingestor.agent.md` | Ingest agent |
| Agent | `agents/wiki-querier.agent.md` | Query agent |
| Agent | `agents/wiki-linter.agent.md` | Lint agent |
| Agent | `agents/wiki-reviewer.agent.md` | Review agent |
| Instruction | `instructions/llm-wiki-schema.instructions.md` | Page format spec |
| Instruction | `instructions/wiki-context.instructions.md` | Cross-session context |

## LLM Wiki vs RAG

| Dimension | RAG | LLM Wiki |
|-----------|-----|----------|
| **Data** | Raw documents, chunked at query time | Compiled into structured pages |
| **State** | Stateless | Stateful — knowledge accumulates |
| **Cost** | Cheap per query | Expensive ingest, cheap query |
| **Best for** | Massive changing doc sets | ~100–500 curated sources |

## References

- [Karpathy's Original Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [llm-wiki-nocode](https://github.com/rosidotidev/llm-wiki-nocode) — Reference implementation
