// app/api/ideas/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ ideas });
}
