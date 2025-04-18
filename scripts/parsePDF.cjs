#!/usr/bin/env node
// scripts/parsePDF.cjs

const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

// Turn off all PDF.js workers so it never tries to load pdf.worker.js or canvas
pdfjs.GlobalWorkerOptions.disableWorker = true;

const { getDocument } = pdfjs;
const filePath = process.argv[2];

if (!filePath) {
  console.error('No file path provided');
  process.exit(1);
}

(async () => {
  try {
    // Read the file into a Buffer
    const data = new Uint8Array(fs.readFileSync(filePath));
    // Parse with PDF.js entirely in‑process
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