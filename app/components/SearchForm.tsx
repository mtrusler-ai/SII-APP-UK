"use client";

import { useState } from "react";

type Idea = {
  title: string;
  summary: string;
  tags: string[];
  score: number;
  sources?: string[];
};

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [budget, setBudget] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function runResearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, region, budget, audience }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setIdeas(data.ideas || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={runResearch} className="grid gap-3 sm:grid-cols-2">
        <input
          className="border rounded p-2"
          placeholder="Problem / theme (e.g., 'creator tools')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Region (optional)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Budget (optional)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Audience (optional)"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 rounded bg-black text-white py-2"
        >
          {loading ? "Researching…" : "Find Startup Ideas"}
        </button>
      </form>

      {error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : null}

      {ideas.length > 0 ? (
        <ul className="space-y-4">
          {ideas.map((i) => (
            <li key={i.title} className="border rounded p-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold">{i.title}</h3>
                <span className="text-xs opacity-60">score: {i.score}</span>
              </div>
              {i.summary ? (
                <p className="text-sm opacity-80 mt-1">{i.summary}</p>
              ) : null}
              {i.tags?.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {i.tags.map((t) => (
                    <span key={t} className="text-xs rounded bg-black/5 px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              {i.sources?.length ? (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer opacity-70">sources</summary>
                  <ul className="text-xs opacity-70 mt-1 ml-4 list-disc">
                    {i.sources.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </details>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
