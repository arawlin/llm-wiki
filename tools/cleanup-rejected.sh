#!/bin/bash
# cleanup-rejected.sh — Purge expired rejected items based on retention policy
#
# Retention policy (from wiki-review Skill):
#   Duplicate:     1 day
#   Low quality:   7 days
#   Outdated:      30 days
#   Contradiction: Permanent (never purge)
#
# Usage: ./tools/cleanup-rejected.sh [--dry-run]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WIKI_ROOT="$(dirname "$SCRIPT_DIR")"
REJECTED_DIR="$WIKI_ROOT/rejected"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "[DRY-RUN] No files will be deleted."
fi

if [[ ! -d "$REJECTED_DIR" ]]; then
    echo "No rejected/ directory found. Nothing to clean up."
    exit 0
fi

NOW=$(date +%s)
PURGED=0

# Process each rejected file
find "$REJECTED_DIR" -name "*.md" -not -path "*/permanent/*" | while read -r file; do
    # Extract reason from frontmatter
    reason=$(grep -oP 'reason:\s*"\K[^"]+' "$file" 2>/dev/null || echo "unknown")
    reviewed_at=$(grep -oP 'reviewed_at:\s*\K[0-9-]+' "$file" 2>/dev/null || echo "")

    if [[ -z "$reviewed_at" ]]; then
        # Fall back to file mtime
        file_time=$(stat -f %m "$file" 2>/dev/null || stat -c %Y "$file" 2>/dev/null)
    else
        file_time=$(date -j -f "%Y-%m-%d" "$reviewed_at" +%s 2>/dev/null || date -d "$reviewed_at" +%s 2>/dev/null)
    fi

    age_days=$(( (NOW - file_time) / 86400 ))

    # Determine retention period
    case "$reason" in
        duplicate|duplicate_content)
            retention=1 ;;
        low_quality|insufficient_evidence)
            retention=7 ;;
        outdated|wrong_scope)
            retention=30 ;;
        *)
            retention=30 ;;  # Default: 30 days
    esac

    if [[ $age_days -gt $retention ]]; then
        echo "🗑️  Purging: $file (reason=$reason, age=${age_days}d, retention=${retention}d)"
        if [[ "$DRY_RUN" == false ]]; then
            rm "$file"
        fi
        PURGED=$((PURGED + 1))
    fi
done

echo ""
echo "Purged $PURGED expired rejected item(s)."
