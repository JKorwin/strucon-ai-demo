// src/app/api/upload/route.ts
export const runtime = 'nodejs';

import { NextResponse }      from 'next/server';
import { execFile }         from 'child_process';
import { promisify }        from 'util';
import { writeFileSync,
         unlinkSync }       from 'fs';
import { join, extname }    from 'path';
import { tmpdir }           from 'os';
import { createClient }     from '@supabase/supabase-js';
import { OpenAI }           from 'openai';
import { auth }             from '@clerk/nextjs/server';

const execFileAsync = promisify(execFile);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, detectSessionInUrl: false } }
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractTextViaChildProcess(buffer: Buffer, fileName: string): Promise<string> {
  const ext = extname(fileName).toLowerCase();
  const tmpFile = join(tmpdir(), `tmp-${Date.now()}${ext}`);
  writeFileSync(tmpFile, buffer);

  const script = ext === '.pdf'
    ? 'scripts/parsePDF.cjs'
    : 'scripts/parseCSV.cjs';

  try {
    const { stdout } = await execFileAsync('node', [join(process.cwd(), script), tmpFile]);
    return stdout;
  } finally {
    unlinkSync(tmpFile);
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file     = formData.get('file') as File | null;
  const { userId } = await auth();

  if (!file || !userId) {
    return NextResponse.json({ message: 'Missing file or session' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let fullText: string;
  try {
    fullText = await extractTextViaChildProcess(buffer, file.name);
  } catch (e) {
    console.error('[Parse Error]', e);
    return NextResponse.json({ message: 'Parsing failed' }, { status: 500 });
  }

  const snippet = fullText.slice(0, 3000);
  const gptRes  = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
You are Katy, the AI Co-Pilot for construction docs.
Analyze the uploaded doc and give a clear, structured breakdown.
Highlight errors, missing details, and red flags.
Use bullet points or lists; be direct and professional.
        `.trim(),
      },
      { role: 'user', content: snippet },
    ],
  });

  const summary = gptRes.choices[0].message?.content;
  const { error } = await supabase.from('documents').insert([{
    user_id:     userId,
    filename:    file.name,
    file_type:   extname(file.name).slice(1),
    gpt_summary: summary,
    full_text:   fullText,
  }]);

  if (error) {
    console.error('[DB ERROR]', error);
    return NextResponse.json({ message: 'DB insert failed' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Saved!', analysis: summary });
}