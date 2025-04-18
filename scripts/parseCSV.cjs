#!/usr/bin/env node
// scripts/parseCSV.cjs

const fs = require('fs');
const parseSync = require('csv-parse/sync').parse;

const filePath = process.argv[2];
if (!filePath) {
  console.error('No file path provided');
  process.exit(1);
}

try {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let output;

  try {
    // First attempt: parse with headers
    output = JSON.stringify(parseSync(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    }), null, 2);
  } catch {
    // Fallback: parse rows only
    output = parseSync(raw, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true,
    }).map(row => row.join(', ')).join('\n');
  }

  console.log(output);
} catch (err) {
  console.error(err);
  process.exit(1);
}