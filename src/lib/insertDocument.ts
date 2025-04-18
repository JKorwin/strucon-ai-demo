import { createClient } from '@supabase/supabase-js';

type InsertPayload = {
  user_id: string;
  filename: string;
  file_type: string;
  gpt_summary: string | null;
  full_text: string;
};

export async function insertDocument(payload: InsertPayload, token: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { error } = await supabase.from('documents').insert(payload);

  if (error) {
    console.error('[DB INSERT ERROR]', error);
    throw new Error('Supabase insert failed');
  }

  return true;
}