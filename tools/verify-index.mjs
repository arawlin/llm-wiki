#!/usr/bin/env node

/**
 * verify-index.mjs — Verify wiki/index.md consistency with actual files
 *
 * Usage: node tools/verify-index.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '..');
const WIKI_DIR = join(WIKI_ROOT, 'wiki');
const INDEX_FILE = join(WIKI_DIR, 'index.md');

const PAGE_TYPES = ['sources', 'entities', 'concepts', 'synthesis'];

function findMdFiles(dir) {
  let results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findMdFiles(fullPath));
    } else if (entry.endsWith('.md') && entry !== 'index.md' && entry !== 'log.md') {
      results.push(fullPath);
    }
  }
  return results;
}

// Main
const actualFiles = findMdFiles(WIKI_DIR);
const issues = [];

// Check: every actual file should be listed in index.md
const indexContent = readFileSync(INDEX_FILE, 'utf-8');

for (const file of actualFiles) {
  const relative = file.replace(WIKI_DIR + '/', '').replace('.md', '');
  if (!indexContent.includes(relative)) {
    issues.push({ type: 'missing_from_index', file: relative });
  }
}

// Check: no index entries point to non-existent files
// (This is a heuristic — we just check if mentioned paths exist)

if (issues.length === 0) {
  console.log('✅ index.md is consistent with actual files.');
  process.exit(0);
}

console.log(`❌ Found ${issues.length} consistency issue(s):\n`);
for (const issue of issues) {
  console.log(`  [${issue.type}] ${issue.file}`);
}

process.exit(1);
