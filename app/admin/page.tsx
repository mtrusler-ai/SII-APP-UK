'use client'
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'
import { useState } from 'react'


export default function AdminPage() {
const { user } = useUser()
const [status, setStatus] = useState<string>('idle')


const isAdmin = !!user?.publicMetadata?.role && user.publicMetadata.role === 'admin'


async function run() {
setStatus('running')
const r = await fetch('/api/research/run', { method: 'POST' })
const j = await r.json()
setStatus('done: ' + JSON.stringify(j))
}


return (
<main className="card space-y-3">
<h1 className="text-xl font-semibold">Admin</h1>
<SignedOut>
<p>Please sign in.</p>
</SignedOut>
<SignedIn>
{!isAdmin && <p>You are signed in but not an admin.</p>}
{isAdmin && (
<div className="space-y-2">
<button onClick={run} className="px-3 py-2 bg-white/10 rounded">Run Research</button>
<div className="opacity-80 text-sm">Status: {status}</div>
</div>
)}
</SignedIn>
</main>
)
}
