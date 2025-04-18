// src/app/api/upload/route.ts

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Fake delay to simulate processing time
  await new Promise((res) => setTimeout(res, 1000));

  return NextResponse.json({
    success: true,
    message: 'File uploaded and analyzed',
    result: {
      mockInsights: [
        { type: 'summary', text: 'This document contains project specs and budget data.' },
        { type: 'recommendation', text: 'Consider optimizing the HVAC cost section.' },
      ],
    },
  });
}