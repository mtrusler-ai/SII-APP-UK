import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type IdeaInput = {
  title: string
  summary?: string
  tags?: string[]
  url?: string
}

export async function POST(req: Request) {
  try {
    const { query = 'automation', region, budget, audience } = await req.json().catch(() => ({}))

    // Try dynamic import of a generator if present; otherwise use empty list.
    let ideas: IdeaInput[] = []
    try {
      // If you have src/lib/ideafinder.ts exporting findIdeas, we’ll use it.
      const mod = await import('@/lib/ideafinder')
      if (typeof (mod as any).findIdeas === 'function') {
        ideas = await (mod as any).findIdeas({ query, region, budget, audience })
      }
    } catch {
      // no-op: generator not present – proceed with empty list
    }

    // Normalize
    const normalized: IdeaInput[] = (ideas || []).map((x: any) => ({
      title: String(x?.title || '').trim(),
      summary: x?.summary ? String(x.summary) : undefined,
      tags: Array.isArray(x?.tags) ? x.tags.map(String).slice(0, 50) : undefined,
      url: x?.url ? String(x.url) : undefined,
    })).filter(i => i.title)

    // Persist idempotently
    const created: string[] = []
    const updated: string[] = []
    const skipped: string[] = []

    for (const it of normalized) {
      try {
        const res = await prisma.idea.upsert({
          where: { title: it.title },
          update: {
            summary: it.summary ?? undefined,
            tags: it.tags ?? undefined,
            url: it.url ?? undefined,
          },
          create: {
            title: it.title,
            summary: it.summary ?? '',
            tags: it.tags ?? [],
            url: it.url ?? null,
          },
        })
        updated.push(res.title)
      } catch {
        skipped.push(it.title)
      }
    }

    return NextResponse.json({ ok: true, created, updated, skipped, count: normalized.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
