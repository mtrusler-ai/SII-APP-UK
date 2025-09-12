import Link from 'next/link'


export default function Page() {
return (
<main className="card space-y-3">
<h1 className="text-2xl font-semibold">SII‑APP‑UK</h1>
<p className="opacity-80">Production‑grade research app is live.</p>
<div className="flex gap-3 mt-2">
<Link className="px-3 py-2 rounded bg-white/10" href="/ideas">Browse Ideas</Link>
<Link className="px-3 py-2 rounded bg-white/10" href="/admin">Admin</Link>
<Link className="px-3 py-2 rounded bg-white/10" href="/sign-in">Sign In</Link>
</div>
<a className="inline-block mt-2 px-3 py-2 rounded bg-white/10" href="/api/health">Check /api/health</a>
</main>
)
}
