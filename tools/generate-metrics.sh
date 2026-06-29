#!/bin/bash
# generate-metrics.sh — Generate wiki metrics dashboard
#
# Extracts data from log.md, index.md, Git history, and directory counts.
# Outputs: wiki/metrics.md (human-readable) + wiki/metrics.json (machine-readable)
#
# Usage: ./tools/generate-metrics.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WIKI_ROOT="$(dirname "$SCRIPT_DIR")"
WIKI_DIR="$WIKI_ROOT/wiki"
LOG_FILE="$WIKI_DIR/log.md"
INDEX_FILE="$WIKI_DIR/index.md"
METRICS_MD="$WIKI_DIR/metrics.md"
METRICS_JSON="$WIKI_DIR/metrics.json"

TODAY=$(date +%Y-%m-%d)

# ── Helper: count files in a directory ──
count_files() {
    local dir="$WIKI_ROOT/$1"
    if [[ -d "$dir" ]]; then
        find "$dir" -name "*.md" -not -name "index.md" -not -name "log.md" 2>/dev/null | wc -l | tr -d ' '
    else
        echo 0
    fi
}

# ── Collect metrics ──

# Page counts
SOURCES=$(count_files "wiki/sources")
ENTITIES=$(count_files "wiki/entities")
CONCEPTS=$(count_files "wiki/concepts")
SYNTHESIS=$(count_files "wiki/synthesis")
TOTAL_PAGES=$((SOURCES + ENTITIES + CONCEPTS + SYNTHESIS))

# Pending / approved counts
PENDING=$(count_files "questions_pending")
APPROVED=$(count_files "questions_approved")
LINT_PENDING=$(count_files "lint_pending")
LINT_APPROVED=$(count_files "lint_approved")
REJECTED=$(count_files "rejected")

# Git stats
cd "$WIKI_ROOT"
COMMITS_TOTAL=$(git rev-list --count HEAD 2>/dev/null || echo 0)
COMMITS_WEEK=$(git rev-list --count --since="7 days ago" HEAD 2>/dev/null || echo 0)

# Ingest frequency (operations this week from log)
INGEST_WEEK=$(grep -c '"op":"ingest"' "$LOG_FILE" 2>/dev/null || echo 0)
QUERY_WEEK=$(grep -c '"op":"query"' "$LOG_FILE" 2>/dev/null || echo 0)
REVIEW_WEEK=$(grep -c '"op":"review"' "$LOG_FILE" 2>/dev/null || echo 0)

# Query deposit rate
QUERY_TOTAL=$(grep -c '"op":"query"' "$LOG_FILE" 2>/dev/null || echo 0)
DEPOSIT_RATE="N/A"
if [[ $QUERY_TOTAL -gt 0 ]]; then
    DEPOSIT_RATE=$(awk "BEGIN {printf \"%.0f\", ($APPROVED / $QUERY_TOTAL) * 100}")
fi

# ── Write metrics.md ──
cat > "$METRICS_MD" << EOF
---
type: index
id: wiki-metrics
title: "Wiki Metrics Dashboard"
created: $TODAY
updated: $TODAY
---

# Wiki Metrics — $TODAY

## 过程健康度（Process Health）

| 指标 | 值 |
|------|----|
| Wiki 总页面数 | $TOTAL_PAGES |
| 本周 Ingest 次数 | $INGEST_WEEK |
| 净知识增长率 | $COMMITS_WEEK commits/周 |

## 结果有效性（Outcome Effectiveness）

| 指标 | 值 |
|------|----|
| Query 沉淀率 | ${DEPOSIT_RATE}% |
| 待审核条目 | $PENDING |
| Lint 待处理 | $LINT_PENDING |

## 页面分布

| 类型 | 数量 |
|------|------|
| Sources | $SOURCES |
| Entities | $ENTITIES |
| Concepts | $CONCEPTS |
| Synthesis | $SYNTHESIS |
| **Total** | **$TOTAL_PAGES** |

---

*自动生成于 $TODAY — 运行 \`tools/generate-metrics.sh\` 更新*
EOF

# ── Write metrics.json ──
cat > "$METRICS_JSON" << EOF
{
  "generated": "$TODAY",
  "process_health": {
    "total_pages": $TOTAL_PAGES,
    "ingest_this_week": $INGEST_WEEK,
    "commits_this_week": $COMMITS_WEEK,
    "total_commits": $COMMITS_TOTAL
  },
  "outcome_effectiveness": {
    "query_total": $QUERY_TOTAL,
    "approved_total": $APPROVED,
    "deposit_rate_pct": "$DEPOSIT_RATE",
    "pending_review": $PENDING,
    "lint_pending": $LINT_PENDING,
    "lint_approved": $LINT_APPROVED,
    "rejected_total": $REJECTED
  },
  "page_distribution": {
    "sources": $SOURCES,
    "entities": $ENTITIES,
    "concepts": $CONCEPTS,
    "synthesis": $SYNTHESIS
  }
}
EOF

echo "✅ Metrics generated:"
echo "   $METRICS_MD"
echo "   $METRICS_JSON"
echo ""
echo "   Pages: $TOTAL_PAGES | Pending: $PENDING | Lint: $LINT_PENDING"
