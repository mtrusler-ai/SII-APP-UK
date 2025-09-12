import { prisma } from '@/src/lib/db'


export const dynamic = 'force-dynamic'


export default async function IdeasPage({ searchParams }: { searchParams: { q?: string, tag?: string, page?: string } }) {
const q = (searchParams.q || '').trim()
const tag = (searchParams.tag || '').trim()
const page = Math.max(1, parseInt(searchParams.page || '1', 10))
const limit = 20


const where: any = {}
if (q) where.OR = [ { title: { contains: q, mode: 'insensitive' }}, { summary: { contains: q, mode: 'insensitive' }} ]
if (tag) where.tags = { has: tag }


const [ideas, total] = await Promise.all([
prisma.idea.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page-1)*limit, take: limit }),
prisma.idea.count({ where })
])
const totalPages = Math.max(1, Math.ceil(total/limit))


return (
<main className="space-y-4">
<div className="card">
<form action="/ideas" method="get" className="flex gap-2 items-center">
<input className="px-3 py-2 rounded bg-white/10 flex-1" type="text" name="q" defaultValue={q} placeholder="Search title or summary..." />
<input className="px-3 py-2 rounded bg-white/10 w-48" type="text" name="tag" defaultValue={tag} placeholder="Filter by tag (e.g. ai)" />
<button className="px-3 py-2 rounded bg-white/20" type="submit">Apply</button>
</form>
</div>


<StatsPanel />


<div className="grid gap-3">
{ideas.map((it) => (
<article key={it.id} className="card">
<div className="flex items-center justify-between gap-3">
<h3 className="text-lg font-semibold">{it.title}</h3>
{it.url && <a className="text-sm underline" href={it.url} target="_blank" rel="noreferrer">Source ↗</a>}
</div>
{it.summary && <p className="opacity-80 mt-1">{it.summary}</p>}
<div className="flex flex-wrap gap-2 mt-2">
{it.tags.map(t => (<span key={t} className="px-2 py-1 bg-white/10 rounded text-xs">{t}</span>))}
</div>
<div className="text-xs opacity-70 mt-2">{new Date(it.createdAt).toLocaleString()}</div>
</article>
))}
</div>


<div className="card flex items-center justify-between">
<span>Page {page} / {totalPages}</span>
<div className="flex gap-2">
{page>1 && <Link className="px-3 py-2 bg-white/10 rounded" href={`/ideas?page=${page-1}&q=${encodeURIComponent(q)}&tag=${encodeURIComponent(tag)}`}>← Prev</Link>}
{page<totalPages && <Link className="px-3 py-2 bg-white/10 rounded" href={`/ideas?page=${page+1}&q=${encodeURIComponent(q)}&tag=${encodeURIComponent(tag)}`}>Next →</Link>}
</div>
</div>
</main>
)
}


function StatsPanel() {
// client-fetch chart data
return (
<div className="card">
<h4 className="font-semibold mb-2">Insights</h4>
<ChartsClient />
<a className="inline-block mt-3 px-3 py-2 bg-white/10 rounded" href="/api/report/pdf" target="_blank">Download PDF Report</a>
</div>
)
}


function ChartsClient() { return <div className="opacity-80 text-sm">Loading charts… (client)</div> }
