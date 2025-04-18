import fs from 'fs';
import { parse as parseCSV } from 'csv-parse/sync';

const filePath = process.argv[2];
if (!filePath) {
  console.error('No file path provided');
  process.exit(1);
}

function parse(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');

  try {
    // Try with columns: true
    const records = parseCSV(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true, // ✅ Allows uneven rows
    });
    return JSON.stringify(records, null, 2);
  } catch {
    // Fallback: unstructured rows
    const records = parseCSV(raw, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true, // ✅ Also allow this here
    });
    return records.map((row) => row.join(', ')).join('\n');
  }
}

try {
  const result = parse(filePath);
  console.log(result);
} catch (err) {
  console.error(err);
  process.exit(1);
}