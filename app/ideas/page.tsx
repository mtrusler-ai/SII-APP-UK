// app/ideas/page.tsx
'use client';

import React from 'react';

type Idea = {
  id: string;
  title: string;
  summary?: string | null;
  tags?: string[] | null;
  createdAt: string;
};

export default function IdeasPage() {
  const [q, setQ] = React.useState('');
  const [tag, setTag] = React.useState<string | null>(null);
  const [ideas, setIdeas] = React.useState<Idea[]>([]);

  React.useEffect(() => {
    fetch('/api/ideas').then(r => r.json()).then(d => setIdeas(d.ideas ?? []));
  }, []);

  const tags = Array.from(new Set(ideas.flatMap(i => i.tags ?? [])));

  const filtered = ideas.filter(i => {
    const matchesQ =
      !q ||
      i.title.toLowerCase().includes(q.toLowerCase()) ||
      (i.summary ?? '').toLowerCase().includes(q.toLowerCase());
    const matchesTag = !tag || (i.tags ?? []).includes(tag);
    return matchesQ && matchesTag;
  });

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1>Startup Ideas Index</h1>

      <input
        placeholder="Search…"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ width: '100%', padding: 10, margin: '12px 0' }}
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => setTag(null)}
          style={{ padding: '6px 10px', border: '1px solid #999', background: tag ? 'white' : '#eef' }}
        >
          All
        </button>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setTag(t)}
            style={{ padding: '6px 10px', border: '1px solid #999', background: tag === t ? '#eef' : 'white' }}
          >
            #{t}
          </button>
        ))}
      </div>

      <ul>
        {filtered.map(i => (
          <li key={i.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>{i.title}</strong>
            <div style={{ color: '#666' }}>{i.summary}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{(i.tags ?? []).map(t => `#${t}`).join(' ')}</div>
          </li>
        ))}
        {filtered.length === 0 && <p>No ideas yet.</p>}
      </ul>
    </main>
  );
}
