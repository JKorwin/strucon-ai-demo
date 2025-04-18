import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse';
import { parse } from 'csv-parse/sync';
import { extname } from 'path';
import { auth } from '@clerk/nextjs/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, detectSessionInUrl: false } }
);

async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  const ext = extname(fileName).toLowerCase();

  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === '.csv') {
    const text = buffer.toString('utf8');
    const records = parse(text, { columns: false, skip_empty_lines: true });
    return records.map((row: string[]) => row.join(', ')).join('\n');
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const { userId } = await auth();

  if (!file || !userId) {
    return NextResponse.json({ message: 'Missing file or user session.' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = file.name;
  const fileType = extname(fileName).slice(1);

  let fullText = '';
  try {
    fullText = await extractText(buffer, fileName);
  } catch (err) {
    console.error('[Parse Error]', err);
    return NextResponse.json({ message: 'Failed to parse document.' }, { status: 500 });
  }

  const snippet = fullText.slice(0, 3000);

  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
You are Katy, the AI Co-Pilot for construction documents.
Analyze the uploaded document (PDF or CSV) and return a clear, structured breakdown.
Highlight errors, missing details, and red flags in a professional tone.
Use bullet points or lists where appropriate.
        `.trim(),
      },
      {
        role: 'user',
        content: `Analyze this document and summarize any errors or flags:\n\n${snippet}`,
      },
    ],
  });

  const gptSummary = gptResponse.choices[0].message?.content;

  const { error } = await supabase.from('documents').insert([{
    user_id: userId,
    filename: fileName,
    file_type: fileType,
    gpt_summary: gptSummary,
    full_text: fullText,
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