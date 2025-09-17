'use client'

import { useState } from 'react'

export default function RunResearchButton() {
  const [busy, setBusy] = useState(false)
  const [out, setOut] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  async function run() {
    setBusy(true); setErr(null); setOut(null)
    try {
      const res = await fetch('/api/research/run', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || data?.ok === false) throw new Error(data?.error || `HTTP ${res.status}`)
      setOut(data)
    } catch (e:any) {
      setErr(e.message || 'Failed to run research')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={run}
        disabled={busy}
        className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/10 disabled:opacity-50"
      >
        {busy ? 'Running…' : 'Run Research'}
      </button>

      {err && <pre className="text-red-300 text-sm bg-white/5 p-3 rounded border border-red-400/30">{err}</pre>}
      {out && (
        <pre className="text-xs bg-white/5 p-3 rounded border border-white/10 overflow-auto max-h-64">
{JSON.stringify(out, null, 2)}
        </pre>
      )}
    </div>
  )
}
