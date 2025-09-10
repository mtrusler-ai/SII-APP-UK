export default function Home() {
  return (
    <main className="container">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Deployment OK ✅</h1>
        <p className="text-cyan-200/80 mb-4">
          Next.js 14 + Prisma starter is live.
        </p>
        <ul className="list-disc list-inside text-sm text-cyan-200/80 space-y-1 mb-4">
          <li>Root Directory is repo root.</li>
          <li>Build Command is <span className="code">npm run vercel-build</span>.</li>
          <li><span className="code">DATABASE_URL</span> must be set in Vercel for Prisma.</li>
        </ul>
        <a className="btn" href="/api/health">Check /api/health</a>
      </div>
    </main>
  );
}
