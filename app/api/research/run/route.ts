import { NextResponse } from 'next/server'
source: 'hn' as const,
hnPoints: h.points || undefined,
desc: h.story_text || h._highlightResult?.title?.value || ''
}))
}


async function fetchGitHubTrending() {
const since = process.env.GITHUB_TRENDING_SINCE || 'daily'
const html = await (await fetch(`https://github.com/trending?since=${since}`)).text()
const $ = cheerio.load(html)
const items: any[] = []
$('article.Box-row').each((_, el) => {
const repo = $(el).find('h2 a').text().trim().replace(/\s/g, '') // owner/repo
const url = 'https://github.com/' + repo
const desc = $(el).find('p').text().trim()
const starsTxt = $(el).find("[href$='stargazers']").first().text().replace(/[,\s]/g, '')
const ghStars = parseInt(starsTxt, 10) || undefined
if (repo) items.push({ title: repo, url, source: 'github' as const, ghStars, desc })
})
return items
}


async function fetchReddit() {
const id = process.env.REDDIT_CLIENT_ID
const secret = process.env.REDDIT_CLIENT_SECRET
if (!id || !secret) return []
const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
method: 'POST',
headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64') },
body: new URLSearchParams({ grant_type: 'client_credentials' })
})
const tok = await tokenRes.json()
const access = tok.access_token
if (!access) return []
const subs = ['technology', 'programming']
const items: any[] = []
for (const s of subs) {
const r = await fetch(`https://oauth.reddit.com/r/${s}/top?t=day&limit=10`, { headers: { 'authorization': `Bearer ${access}`, 'user-agent': 'sii-app-uk/1.0' } })
const j = await r.json()
for (const p of j.data?.children || []) {
const d = p.data
items.push({ title: d.title, url: d.url_overridden_by_dest || `https://reddit.com${d.permalink}`, source: 'reddit' as const, rdScore: d.score, desc: d.selftext })
}
}
return items
}


export async function POST() {
// (optional) secure with CRON_SECRET if you wire Vercel Cron
const raw = [ ...(await fetchHN()), ...(await fetchGitHubTrending()), ...(await fetchReddit()) ]


// normalize & dedupe by lowercased title
const map = new Map<string, any>()
for (const it of raw) {
if (!it.title) continue
const k = it.title.trim().toLowerCase()
if (!map.has(k)) map.set(k, it)
}


const enriched: any[] = []
for (const it of map.values()) {
const { summary, tags } = await enrich(it.title, it.desc)
enriched.push({
title: it.title,
url: it.url,
source: it.source,
hnPoints: it.hnPoints,
ghStars: it.ghStars,
rdScore: it.rdScore,
summary,
tags
})
}


await fetch(`${APP_URL}/api/research`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(enriched) })


return NextResponse.json({ ok: true, count: enriched.length })
}
