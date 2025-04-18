import fs from 'fs';
import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';

const { getDocument } = pdfjs;

const filePath = process.argv[2];
if (!filePath) {
  console.error('No file path provided');
  process.exit(1);
}

async function parsePDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) => {
        if ('str' in item) return item.str;
        return '';
      })
      .join(' ');

    const filtered = text
      .split('\n')
      .filter(line =>
        !line.includes('FoxitSansBold.pfb') &&
        !line.includes('FoxitSans.pfb') &&
        !line.toLowerCase().includes('standard font') &&
        line.trim().length > 0
      )
      .join('\n');

    fullText += filtered + '\n';
  }

  return fullText;
}

parsePDF(filePath)
  .then(text => console.log(text))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });