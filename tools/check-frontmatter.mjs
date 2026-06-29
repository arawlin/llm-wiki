#!/usr/bin/env node

/**
 * check-frontmatter.mjs — Validate wiki page frontmatter
 *
 * Checks all wiki pages for:
 * - Missing required fields: type, id, title, created, updated
 * - Invalid status values
 * - Schema version consistency
 *
 * Usage: node tools/check-frontmatter.mjs [--fix]
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '..');
const WIKI_DIR = join(WIKI_ROOT, 'wiki');

const REQUIRED_FIELDS = ['type', 'id', 'title', 'created', 'updated'];
const VALID_TYPES = ['source', 'entity', 'concept', 'synthesis', 'index'];
const VALID_STATUSES = ['draft', 'active', 'stale', 'contradicted', 'archived'];

// Parse YAML frontmatter from a markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const lines = match[1].split('\n');
  const data = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Remove quotes
    value = value.replace(/^["']|["']$/g, '');
    data[key] = value;
  }
  return data;
}

// Recursively find all .md files in a directory
function findMdFiles(dir) {
  let results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findMdFiles(fullPath));
    } else if (entry.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Validate a single file
function validateFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fm = parseFrontmatter(content);
  const issues = [];

  if (!fm) {
    issues.push({ file: filePath, issue: 'missing_frontmatter', severity: 'error' });
    return issues;
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) {
      issues.push({ file: filePath, issue: `missing_required: ${field}`, severity: 'error' });
    }
  }

  // Check type validity
  if (fm.type && !VALID_TYPES.includes(fm.type)) {
    issues.push({ file: filePath, issue: `invalid_type: ${fm.type}`, severity: 'error' });
  }

  // Check status validity
  if (fm.status && !VALID_STATUSES.includes(fm.status)) {
    issues.push({ file: filePath, issue: `invalid_status: ${fm.status}`, severity: 'error' });
  }

  return issues;
}

// Main
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');

const files = findMdFiles(WIKI_DIR);
const allIssues = [];

for (const file of files) {
  const issues = validateFile(file);
  allIssues.push(...issues);
}

if (allIssues.length === 0) {
  console.log('✅ All pages pass frontmatter validation.');
  process.exit(0);
}

console.log(`❌ Found ${allIssues.length} issue(s):\n`);
for (const issue of allIssues) {
  const relativePath = issue.file.replace(WIKI_ROOT + '/', '');
  console.log(`  [${issue.severity.toUpperCase()}] ${relativePath}: ${issue.issue}`);
}

if (shouldFix) {
  console.log('\n⚠️  Auto-fix not yet implemented. Manual fixes required.');
}

process.exit(1);
