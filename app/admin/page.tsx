import { Suspense } from 'react'
import RunResearchButton from './runner.client'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <main className="card space-y-4">
      <h1 className="text-xl font-semibold">Admin</h1>
      <p className="opacity-80">Trigger the research pipeline and populate the database.</p>

      <SignedIn>
        <Suspense fallback={<p>Loading…</p>}>
          <RunResearchButton />
        </Suspense>
      </SignedIn>

      <SignedOut>
        <div className="opacity-80">
          You must sign in to run research. <SignInButton />
        </div>
      </SignedOut>
    </main>
  )
}
