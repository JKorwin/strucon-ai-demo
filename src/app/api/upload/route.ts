import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { writeFileSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { tmpdir } from 'os';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const execFileAsync = promisify(execFile);

// Initialize Supabase with your SERVICE ROLE key (server‑only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, detectSessionInUrl: false } }
);

async function extractTextViaChildProcess(buffer: Buffer, fileName: string): Promise<string> {
  const ext = extname(fileName).toLowerCase();
  const tempFilePath = join(tmpdir(), `temp-${Date.now()}${ext}`);
  writeFileSync(tempFilePath, buffer);

  const scriptMap: Record<string, string> = {
    '.pdf': 'scripts/parsePDF.mjs',
    '.csv': 'scripts/parseCSV.mjs',
  };
  const script = scriptMap[ext];
  if (!script) throw new Error(`Unsupported file type: ${ext}`);

  try {
    const { stdout } = await execFileAsync('node', [join(process.cwd(), script), tempFilePath]);
    return stdout;
  } catch (err) {
    console.error('Child process failed:', err);
    throw new Error('Document parsing failed');
  } finally {
    unlinkSync(tempFilePath);
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const { userId, getToken } = await auth();
  const token = await getToken(); 

  if (!file || !userId || !token) {
    return NextResponse.json({ message: 'Missing file or user session.' }, { status: 400 });
  }

  // read & parse
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = file.name;
  const fileType = extname(fileName).slice(1);

  const fullText = await extractTextViaChildProcess(buffer, fileName);
  const snippet = fullText.slice(0, 3000);

  // call OpenAI
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
You are Katy, the AI Co-Pilot for construction documents.
Analyze the uploaded document (PDF or CSV) and return a clear, structured breakdown...
`.trim(),
      },
      {
        role: 'user',
        content: `Analyze this document and summarize any errors or flags:\n\n${snippet}`,
      },
    ],
  });
  const gptSummary = res.choices[0].message?.content;

  // insert with service-role key (no more JWSInvalidSignature)
  const { error } = await supabaseAdmin
    .from('documents')
    .insert([{
      user_id:   userId,
      filename:  fileName,
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