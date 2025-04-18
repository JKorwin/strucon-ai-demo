#!/usr/bin/env node
// scripts/parsePDF.cjs

const fs = require('fs');
// Pull in the main PDF.js entry — it exports getDocument, GlobalWorkerOptions, etc.
const pdfjs = require('pdfjs-dist');

// Turn off all workers (no fake‑worker/canvas loading)
pdfjs.GlobalWorkerOptions.disableWorker = true;

const { getDocument } = pdfjs;
const filePath = process.argv[2];

if (!filePath) {
  console.error('No file path provided');
  process.exit(1);
}

;(async () => {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = getDocument({ data });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text    = content.items.map(item => item.str || '').join(' ');

      const filtered = text
        .split('\n')
        .filter(line =>
          !line.includes('FoxitSansBold.pfb') &&
          !line.includes('FoxitSans.pfb') &&
          !line.toLowerCase().includes('standard font') &&
          line.trim().length > 0
        )
        .join('\n');

      fullText += filtered + '\n\n';
    }

    console.log(fullText);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();