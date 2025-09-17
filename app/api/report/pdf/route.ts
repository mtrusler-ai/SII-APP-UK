// app/api/report/pdf/route.ts
import { NextResponse } from 'next/server';
import { renderToReadableStream } from '@react-pdf/renderer';
import { Report } from '@/pdf/Report';

export const runtime = 'nodejs'; // ensure Node runtime for streaming

export async function POST(req: Request) {
  try {
    const { items = [] } = await req.json();
    const stream = await renderToReadableStream(<Report items={items} />);
    return new NextResponse(stream as unknown as ReadableStream, {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
