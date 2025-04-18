import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID!;

export async function POST(req: NextRequest) {
  try {
    const { threadId, message } = await req.json();
    const thread = threadId || (await createThread());

    // Add user message to the thread
    await fetch(`https://api.openai.com/v1/threads/${thread}/messages`, {
      method: 'POST',
      headers: openAIHeaders(),
      body: JSON.stringify({ role: 'user', content: message }),
    });

    // Start a run with the assistant
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread}/runs`, {
      method: 'POST',
      headers: openAIHeaders(),
      body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
    });

    if (!runRes.ok) {
      const errorText = await runRes.text();
      console.error('[Foreman] Failed to create run:', runRes.status, errorText);
      return NextResponse.json({ error: 'Failed to create Assistant run.' }, { status: 500 });
    }

    const run = await runRes.json();
    console.log('[Foreman] Run response:', run);

    if (!run.id) {
      console.error('[Foreman] Run creation returned no ID:', run);
      return NextResponse.json({ error: 'Assistant run was not initialized properly.' }, { status: 500 });
    }

    const completedRun = await pollRun(thread, run.id);

    // Get assistant messages
    const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread}/messages`, {
      headers: openAIHeaders(),
    });

    const messagesData = await messagesRes.json();
    const lastMessage = messagesData.data
      .filter((m: any) => m.role === 'assistant')
      .pop();

    return NextResponse.json({
      threadId: thread,
      response: lastMessage?.content?.[0]?.text?.value ?? 'No response.',
    });
  } catch (err: any) {
    console.error('[Foreman API Failure]', err);
    return NextResponse.json({ error: 'Foreman had a backend failure.' }, { status: 500 });
  }
}

function openAIHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'OpenAI-Beta': 'assistants=v2',
  };
}

async function createThread(): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: openAIHeaders(),
  });

  const data = await res.json();
  return data.id;
}

async function pollRun(threadId: string, runId: string) {
  let attempts = 0;
  const maxAttempts = 60;
  let delay = 1000;

  console.log(`[Foreman] Starting to poll run ${runId} on thread ${threadId}`);

  while (attempts < maxAttempts) {
    const start = Date.now();
    const res = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      { headers: openAIHeaders() }
    );

    const data = await res.json();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);

    console.log(
      `[Foreman] Attempt ${attempts + 1}/${maxAttempts} – Status: ${data.status} (${elapsed}s)`
    );

    if (data.status === 'completed') return data;
    if (data.status === 'failed' || data.status === 'cancelled') {
      throw new Error(`Run failed with status: ${data.status}`);
    }

    await new Promise((res) => setTimeout(res, delay));
    attempts++;
  }

  throw new Error('Assistant run polling timed out');
}