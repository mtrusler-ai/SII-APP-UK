import { prisma } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>

function paramOf(sp: SearchParams, key: string) {
  const v = sp?.[key]
  return typeof v === 'string' ? v : (Array.isArray(v) ? v[0] : '')
}

function toInt(v: string, fallback: number) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export default async function IdeasPage({ searchParams }: { searchParams?: SearchParams }) {
  const q = paramOf(searchParams ?? {}, 'q').trim()
  const tag = paramOf(searchParams ?? {}, 'tag').trim()
  const page = toInt(paramOf(searchParams ?? {}, 'page'), 1)
  const limit = Math.min(toInt(paramOf(searchParams ?? {}, 'limit'), 20), 100)
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
  const hasNext = skip + items.length < total

  // Suggest chips from tags on the current page (MVP)
  const chipSet = new Set<string>()
  items.forEach(i => (i.tags ?? []).forEach(t => chipSet.add(t)))
  const chips = Array.from(chipSet).slice(0, 12)

  const qs = (next: Partial<Record<string, string | number>>) => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (tag) p.set('tag', tag)
    p.set('limit', String(limit))
    p.set('page', String(next.page ?? page))
    return `?${p.toString()}`
  }

  return (
    <main className="space-y-6">
      <section className="card">
        <h1 className="text-xl font-semibold mb-3">Ideas</h1>
        <form className="flex gap-2 items-center">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or summary…"
            className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/10"
          />
          <input
            name="tag"
            defaultValue={tag}
            placeholder="Tag (single)"
            className="w-40 px-3 py-2 rounded bg-white/10 border border-white/10"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            Search
          </button>
          <Link href="/ideas" className="px-3 py-2 rounded bg-white/5 border border-white/10">Reset</Link>
        </form>

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map(c => (
              <Link
                key={c}
                href={`?${new URLSearchParams({ q, tag: c, page: '1', limit: String(limit) })}`}
                className={`px-2 py-1 rounded text-sm border ${c === tag ? 'bg-white/20' : 'bg-white/10'} border-white/10`}
              >
                #{c}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <ul className="space-y-4">
          {items.map(it => (
            <li key={it.id} className="border-b border-white/10 pb-4 last:border-none last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-medium">
                  {it.url ? (
                    <a href={it.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {it.title}
                    </a>
                  ) : it.title}
                </h3>
                <span className="text-xs opacity-70">
                  {new Date(it.createdAt).toLocaleString()}
                </span>
              </div>
              {it.summary && <p className="opacity-80 mt-1">{it.summary}</p>}
              {it.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {it.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10">#{t}</span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mt-6">
          <span className="opacity-70 text-sm">
            Showing {skip + 1}–{skip + items.length} of {total}
          </span>
          <div className="flex gap-2">
            <Link
              href={qs({ page: Math.max(1, page - 1) })}
              className={`px-3 py-2 rounded bg-white/10 border border-white/10 ${page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-white/20'}`}
            >
              ← Prev
            </Link>
            <Link
              href={qs({ page: page + 1 })}
              className={`px-3 py-2 rounded bg-white/10 border border-white/10 ${hasNext ? 'hover:bg-white/20' : 'pointer-events-none opacity-40'}`}
            >
              Next →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
