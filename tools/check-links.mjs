#!/usr/bin/env node

/**
 * check-links.mjs — Validate all WikiLinks point to existing pages
 *
 * Usage: node tools/check-links.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '..');
const WIKI_DIR = join(WIKI_ROOT, 'wiki');

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

// Build set of all valid page paths
function buildPageIndex(files) {
  const index = new Set();
  for (const file of files) {
    // Convert file path to WikiLink path
    const relative = file.replace(WIKI_DIR + '/', '').replace('.md', '');
    index.add(relative);
  }
  return index;
}

// Find all WikiLinks in a file
function findWikiLinks(content) {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

// Main
const files = findMdFiles(WIKI_DIR);
const pageIndex = buildPageIndex(files);
const brokenLinks = [];

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const links = findWikiLinks(content);

  for (const link of links) {
    if (!pageIndex.has(link)) {
      const relativeFile = file.replace(WIKI_ROOT + '/', '');
      brokenLinks.push({ file: relativeFile, link });
    }
  }
}

if (brokenLinks.length === 0) {
  console.log('✅ All WikiLinks point to valid pages.');
  process.exit(0);
}

console.log(`❌ Found ${brokenLinks.length} broken WikiLink(s):\n`);
for (const { file, link } of brokenLinks) {
  console.log(`  ${file} → [[${link}]]`);
}

process.exit(1);
