import prisma from "../src/lib/db";
import SearchForm from "./components/SearchForm";

export default async function Page() {
  // Show recent saved ideas from DB (so page isn't empty on first open)
  const recent = await prisma.idea.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, summary: true, tags: true, score: true }
  });

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Startup Ideas Index — Research</h1>
      <p className="text-sm opacity-70 mb-6">
        Generate research-backed startup ideas automatically and persist them.
      </p>

      <SearchForm />

      {recent.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold mt-10 mb-2">Recent ideas</h2>
          <ul className="space-y-3">
            {recent.map((i) => (
              <li key={i.id} className="border rounded p-4">
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
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
