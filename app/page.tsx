// app/page.tsx
import prisma from "../src/lib/db";

export default async function Page() {
  // If Prisma schema has an Idea model, list a few ideas.
  // Adjust to your actual model names if different.
  try {
    const ideas = await prisma.idea.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Startup Ideas Index</h1>

        {ideas.length === 0 ? (
          <p className="text-sm opacity-70">
            No ideas yet. Your app is live and connected to the database. Seed it
            (or add a form) to create ideas.
          </p>
        ) : (
          <ul className="space-y-3">
            {ideas.map((i) => (
              <li key={i.id} className="rounded border p-4">
                <h2 className="font-semibold">{i.title}</h2>
                {i.summary ? (
                  <p className="text-sm opacity-80 mt-1">{i.summary}</p>
                ) : null}
                <p className="text-xs opacity-60 mt-2">
                  Created {new Date(i.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  } catch (err) {
    // If the table/model isn't there yet, show an informative message.
    return (
      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Startup Ideas Index</h1>
        <p className="text-sm opacity-80">
          App is live, but the Prisma query failed. Make sure your Prisma schema
          is deployed and the model name matches.
        </p>
        <pre className="mt-4 p-4 rounded bg-black/10 text-xs overflow-auto">
{String(err)}
        </pre>
      </main>
    );
  }
}
