#!/usr/bin/env node
// scripts/test-digest.mjs
//
// Reads Vitest's JSON output and prints only what you need to fix something:
// the failing test's name, where it is, and the first few lines of the error.
// Everything else -- passing tests, stack frames into node_modules, the banner
// -- is dropped.
//
//   npm run test:fails          # run the suite, print the digest
//   npm run test:fails -- rls   # only files matching "rls"
//
// Paste the digest into chat, or redirect it to a file:
//   npm run test:fails > fails.txt

import { readFileSync } from 'node:fs';

const FILE = process.env.TEST_JSON ?? '.test-results.json';
const CONTEXT_LINES = Number(process.env.DIGEST_LINES ?? 6);

let report;
try {
  report = JSON.parse(readFileSync(FILE, 'utf8'));
} catch (err) {
  console.error(`Could not read ${FILE}. Did the test run write it?`);
  console.error(err.message);
  process.exit(2);
}

const cwd = process.cwd();
const rel = (p) => (p?.startsWith(cwd) ? p.slice(cwd.length + 1) : p);

const failedFiles = (report.testResults ?? []).filter((f) =>
  (f.assertionResults ?? []).some((t) => t.status === 'failed'),
);

const total = report.numTotalTests ?? 0;
const failed = report.numFailedTests ?? 0;
const passed = report.numPassedTests ?? 0;

console.log(`${failed} failed / ${passed} passed (${total})\n`);

if (!failed) {
  console.log('Nothing to fix.');
  process.exit(0);
}

for (const file of failedFiles) {
  console.log(rel(file.name));

  for (const test of file.assertionResults) {
    if (test.status !== 'failed') continue;

    const path = [...(test.ancestorTitles ?? []), test.title].join(' > ');
    console.log(`  ${path}`);

    const message = (test.failureMessages ?? []).join('\n');
    const lines = message
      .split('\n')
      // Drop stack frames; keep the assertion and its diff.
      .filter((l) => !/^\s*(at |❯ )/.test(l))
      .filter((l) => l.trim() !== '')
      .slice(0, CONTEXT_LINES);

    for (const line of lines) console.log(`    ${line.trim()}`);
    console.log('');
  }
}

// Exit non-zero so this is usable as a CI gate too.
process.exit(1);
