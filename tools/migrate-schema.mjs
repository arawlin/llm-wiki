#!/usr/bin/env node

/**
 * migrate-schema.mjs — Schema migration script
 *
 * Handles mechanical schema changes: rename fields, add defaults.
 * Semantic changes (body rewrites) must be done by LLM + human review.
 *
 * Usage: node tools/migrate-schema.mjs --from <version> --to <version> [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WIKI_ROOT = resolve(__dirname, '..');
const WIKI_DIR = join(WIKI_ROOT, 'wiki');

// Migration rules registry
// Each rule: { fromVersion, toVersion, fieldMap: { oldName: newName }, defaults: { field: value } }
const MIGRATIONS = {
  // Example: when upgrading from 0.1 to 0.2
  // '0.1->0.2': {
  //   fieldMap: {},
  //   defaults: { 'new_field': 'default_value' }
  // }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: false, from: null, to: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from') opts.from = args[++i];
    if (args[i] === '--to') opts.to = args[++i];
    if (args[i] === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

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

function migrateFile(filePath, migration, dryRun) {
  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    console.log(`  ⚠️  ${filePath}: no frontmatter, skipping`);
    return { file: filePath, changed: false };
  }

  let frontmatter = match[1];
  let changed = false;

  // Apply field renames
  if (migration.fieldMap) {
    for (const [oldName, newName] of Object.entries(migration.fieldMap)) {
      const regex = new RegExp(`^${oldName}:`, 'm');
      if (regex.test(frontmatter)) {
        frontmatter = frontmatter.replace(regex, `${newName}:`);
        changed = true;
        console.log(`  ↻  ${filePath}: renamed ${oldName} → ${newName}`);
      }
    }
  }

  // Apply default values for new fields
  if (migration.defaults) {
    for (const [field, value] of Object.entries(migration.defaults)) {
      const regex = new RegExp(`^${field}:`, 'm');
      if (!regex.test(frontmatter)) {
        // Add before the first optional field or at the end
        frontmatter = frontmatter.trimEnd() + `\n${field}: ${value}`;
        changed = true;
        console.log(`  +  ${filePath}: added default ${field}: ${value}`);
      }
    }
  }

  if (changed && !dryRun) {
    const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${frontmatter}\n---`);
    writeFileSync(filePath, newContent, 'utf-8');
  }

  return { file: filePath, changed };
}

// Main
const opts = parseArgs();

if (!opts.from || !opts.to) {
  console.error('Usage: node tools/migrate-schema.mjs --from <version> --to <version> [--dry-run]');
  process.exit(1);
}

const migrationKey = `${opts.from}->${opts.to}`;
const migration = MIGRATIONS[migrationKey];

if (!migration) {
  console.error(`No migration defined for ${migrationKey}`);
  console.log('Available migrations:', Object.keys(MIGRATIONS).join(', ') || '(none)');
  process.exit(1);
}

console.log(`Migrating schema: ${opts.from} → ${opts.to}`);
if (opts.dryRun) console.log('(dry-run mode — no files will be modified)\n');

const files = findMdFiles(WIKI_DIR);
let changedCount = 0;

for (const file of files) {
  const result = migrateFile(file, migration, opts.dryRun);
  if (result.changed) changedCount++;
}

console.log(`\n${opts.dryRun ? '[DRY-RUN] ' : ''}Migration complete: ${changedCount} file(s) changed.`);
