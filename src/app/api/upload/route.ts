// src/app/api/upload/route.ts

import { NextResponse }       from 'next/server';
import { getDocument }        from 'pdfjs-dist/legacy/build/pdf.js';
import { parse as parseCSV }  from 'csv-parse/sync';
import { extname }            from 'path';
import { createClient }       from '@supabase/supabase-js';
import { OpenAI }             from 'openai';
import { auth }               from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, detectSessionInUrl: false } }
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  const ext = extname(fileName).toLowerCase();

  if (ext === '.pdf') {
    // cast to any so disableWorker is allowed
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true,
    } as any);

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text    = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
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

      fullText += filtered + '\n\n';
    }
    return fullText;
  }

  if (ext === '.csv') {
    const raw = buffer.toString('utf8');
    try {
      const records = parseCSV(raw, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
      });
      return JSON.stringify(records, null, 2);
    } catch {
      const records = parseCSV(raw, {
        columns: false,
        skip_empty_lines: true,
        relax_column_count: true,
      });
      return records.map((r: string[]) => r.join(', ')).join('\n');
    }
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file     = formData.get('file') as File | null;
  const { userId } = await auth();

  if (!file || !userId) {
    return NextResponse.json({ message: 'Missing file or user session.' }, { status: 400 });
  }

  const buffer   = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;
  const fileType = extname(fileName).slice(1);

  let fullText: string;
  try {
    fullText = await extractText(buffer, fileName);
  } catch (err) {
    console.error('[Parse Error]', err);
    return NextResponse.json({ message: 'Failed to parse document.' }, { status: 500 });
  }

  const snippet = fullText.slice(0, 3000);
  const gptRes  = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
You are Katy, the AI Co-Pilot for construction documents.
Analyze the uploaded document and return a clear, structured breakdown.
Highlight errors, missing details, and red flags in a professional tone.
Use bullet points or lists where appropriate.
        `.trim(),
      },
      { role: 'user', content: `Analyze this document:\n\n${snippet}` },
    ],
  });

  const gptSummary = gptRes.choices[0].message?.content;
  const { error } = await supabase.from('documents').insert([{
    user_id:     userId,
    filename:    fileName,
    file_type:   fileType,
    gpt_summary: gptSummary,
    full_text:   fullText,
  }]);

  if (error) {
    console.error('[DB INSERT ERROR]', error);
    return NextResponse.json({ message: 'Database insert failed.', error }, { status: 500 });
  }

  return NextResponse.json({
    message: `File "${fileName}" analyzed and saved.`,
    analysis: gptSummary,
  });
}