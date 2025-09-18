// src/lib/ideafinder.ts
// Research engine that can use OpenAI if OPENAI_API_KEY is set,
// otherwise falls back to a heuristic generator.

type IdeaCandidate = {
  title: string;
  summary: string;
  tags: string[];
  score: number;            // simple ranking score
  sources?: string[];       // optional source/notes
};

type ResearchParams = {
  query: string;
  region?: string;
  budget?: string;
  audience?: string;
};

function heuristicIdeas({ query, region, budget, audience }: ResearchParams): IdeaCandidate[] {
  const base = (s?: string) => (s ? ` ${s.trim()}` : "");
  const contexts = [
    `AI tools for${base(audience)} in${base(region)}`,
    `Marketplaces around "${query}"`,
    `B2B SaaS for${base(audience)} solving "${query}"`,
    `Data platform for${base(audience)} in${base(region)}`
  ];

  // small idea bank:
  const ideas = contexts.map((c, i) => {
    const title = `${query[0]?.toUpperCase()}${query.slice(1)} — ${["Assistant", "Hub", "Copilot", "OS"][i % 4]}`;
    const tags = [query.toLowerCase(), region?.toLowerCase() ?? "global", audience?.toLowerCase() ?? "general"];
    const score = Math.round(65 + Math.random() * 30);
    return {
      title,
      summary: `A ${budget || "lean"} ${c}. Monetize via subscription + usage-based pricing.`,
      tags,
      score,
      sources: [`Generated heuristically at ${new Date().toISOString()}`]
    };
  });

  // sort by score desc:
  ideas.sort((a, b) => b.score - a.score);
  return ideas;
}

async function openAiIdeas(params: ResearchParams): Promise<IdeaCandidate[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return heuristicIdeas(params);

  const prompt = `
You are a startup-ideas analyst. Given:
- query: ${params.query}
- region: ${params.region ?? "any"}
- budget: ${params.budget ?? "any"}
- audience: ${params.audience ?? "any"}

Return 6 startup ideas as JSON array under key "ideas". Each idea has:
{ "title": string, "summary": string, "tags": string[], "score": number (70-95), "sources": string[] (short notes) }
Return ONLY valid JSON.

Example:
{ "ideas": [ { "title": "...", "summary": "...", "tags": ["..."], "score": 88, "sources": ["..."] } ] }
  `.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  if (!res.ok) {
    // fall back if API fails
    return heuristicIdeas(params);
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(text);
    const ideas = Array.isArray(parsed?.ideas) ? parsed.ideas : [];
    const clean: IdeaCandidate[] = ideas
      .filter((x: any) => x?.title && x?.summary)
      .map((x: any) => ({
        title: String(x.title),
        summary: String(x.summary),
        tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
        score: Number.isFinite(x.score) ? x.score : 80,
        sources: Array.isArray(x.sources) ? x.sources.map(String) : []
      }));
    return clean.length ? clean : heuristicIdeas(params);
  } catch {
    return heuristicIdeas(params);
  }
}

export async function findIdeas(params: ResearchParams): Promise<IdeaCandidate[]> {
  return openAiIdeas(params); // automatically falls back to heuristic if no API key or error
}
