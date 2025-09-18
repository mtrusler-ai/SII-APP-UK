import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'


type IdeaInput = {
title: string
summary?: string
tags?: string[] | string
url?: string
source?: string
hnPoints?: number
ghStars?: number
rdScore?: number
}


export async function POST(req: Request) {
try {
const body = await req.json()
const items: IdeaInput[] = Array.isArray(body) ? body : [body]


const created: string[] = []
const updated: string[] = []
const skipped: string[] = []


for (const it of items) {
if (!it?.title || typeof it.title !== 'string') { skipped.push('(missing title)'); continue }
const tags = Array.isArray(it.tags)
? it.tags
: (typeof it.tags === 'string' ? it.tags.split(',').map(t => t.trim()).filter(Boolean) : [])


try {
const res = await prisma.idea.upsert({
where: { title: it.title },
update: {
summary: it.summary ?? undefined,
tags,
url: it.url ?? undefined,
source: it.source ?? undefined,
hnPoints: it.hnPoints ?? undefined,
ghStars: it.ghStars ?? undefined,
rdScore: it.rdScore ?? undefined,
},
create: {
title: it.title,
summary: it.summary ?? '',
tags,
url: it.url ?? null,
source: it.source ?? null,
hnPoints: it.hnPoints ?? null,
ghStars: it.ghStars ?? null,
rdScore: it.rdScore ?? null,
},
})
// simple heuristic: if summary existed before we call this update, treat as updated
updated.push(res.title)
} catch (e) {
skipped.push(it.title)
}
}


return NextResponse.json({ ok: true, created, updated, skipped })
} catch (err) {
return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
}
}
