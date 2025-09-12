import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/db'


export async function GET() {
const latest = await prisma.idea.findMany({ orderBy: { createdAt: 'desc' }, take: 500 })


const bySource = Object.values(latest.reduce((acc: any, it) => {
const k = it.source || 'unknown'
acc[k] = acc[k] || { source: k, count: 0 }
acc[k].count++
return acc
}, {}))


const tagCounts: Record<string, number> = {}
for (const it of latest) for (const t of it.tags) tagCounts[t] = (tagCounts[t]||0)+1
const byTag = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([tag, count]) => ({ tag, count }))


const byDayMap: Record<string, number> = {}
for (const it of latest) {
const d = new Date(it.createdAt)
const day = d.toISOString().slice(0,10)
byDayMap[day] = (byDayMap[day]||0)+1
}
const byDay = Object.entries(byDayMap).sort(([a],[b])=>a.localeCompare(b)).map(([day,count])=>({ day, count }))


return NextResponse.json({ bySource, byTag, byDay })
}
