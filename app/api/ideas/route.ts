import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/db'

export const dynamic = 'force-dynamic'

function toInt(value: string | null, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  const tag = searchParams.get('tag')?.trim() || ''
  const page = toInt(searchParams.get('page'), 1)
  const limit = Math.min(toInt(searchParams.get('limit'), 20), 100)
  const skip = (page - 1) * limit

  const where: any = { AND: [] as any[] }
  if (q) where.AND.push({ OR: [
    { title: { contains: q, mode: 'insensitive' } },
    { summary: { contains: q, mode: 'insensitive' } },
  ]})
  if (tag) where.AND.push({ tags: { has: tag } })
  if (!where.AND.length) delete where.AND

  const [items, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: { id: true, title: true, summary: true, tags: true, url: true, createdAt: true },
    }),
    prisma.idea.count({ where }),
  ])

  const hasNextPage = skip + items.length < total
  return NextResponse.json({ items, page, limit, total, hasNextPage })
}
