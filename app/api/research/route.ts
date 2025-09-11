// app/api/research/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../src/lib/db";
import { findIdeas } from "../../../src/lib/ideafinder";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query ?? "").trim();
    const region = String(body.region ?? "").trim();
    const budget = String(body.budget ?? "").trim();
    const audience = String(body.audience ?? "").trim();

    if (!query) {
      return NextResponse.json({ error: "Missing 'query'." }, { status: 400 });
    }

    const ideas = await findIdeas({ query, region, budget, audience });

    // Save each idea if not already in DB (by title)
    for (const idea of ideas) {
      try {
        await prisma.idea.upsert({
          where: { title: idea.title },
          update: {
            summary: idea.summary,
            tags: idea.tags,
            score: idea.score,
            sources: idea.sources ?? []
          },
          create: {
            title: idea.title,
            summary: idea.summary,
            tags: idea.tags,
            score: idea.score,
            sources: idea.sources ?? [],
            query, region, budget, audience
          }
        });
      } catch {
        // ignore duplicates/validation errors
      }
    }

    return NextResponse.json({ ok: true, ideas }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
