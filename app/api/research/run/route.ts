import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

// Update with your own fetch functions or replace these with empty arrays.
async function fetchHN() {
  const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page');
  const data = await res.json();
  return (data.hits || []).map((h: any) => ({
    title: h.title,
    url: h.url,
    source: 'hn' as const,
    hnPoints: h.points ?? undefined,
    desc: h.story_text || h._highlightResult?.title?.value || '',
  }));
}

async function fetchGitHubTrending() {
  // This is a placeholder. Implement your scraping or API call here.
  return [];
}

async function fetchReddit() {
  // This is a placeholder. Implement your Reddit API call here if you have credentials.
  return [];
}

// Optional: summarise and tag each idea using an AI service.
async function enrich(title: string, desc: string) {
  return { summary: '', tags: [] as string[] };
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export async function POST() {
  // 1) gather data from all sources
  const raw = [
    ...(await fetchHN()),
    ...(await fetchGitHubTrending()),
    ...(await fetchReddit()),
  ];

  // 2) deduplicate by case-insensitive title
  const map = new Map<string, any>();
  for (const it of raw) {
    const key = it.title.trim().toLowerCase();
    if (!map.has(key)) map.set(key, it);
  }

  // 3) enrich with summaries and tags
  const enriched = [];
  for (const it of map.values()) {
    const { summary, tags } = await enrich(it.title, it.desc);
    enriched.push({ ...it, summary, tags });
  }

  // 4) persist via the /api/research endpoint (batch upsert)
  await fetch(`${APP_URL}/api/research`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(enriched),
  });

  return NextResponse.json({ ok: true, count: enriched.length });
}
