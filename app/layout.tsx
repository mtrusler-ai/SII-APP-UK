import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'


export const metadata: Metadata = {
title: 'SII App UK',
description: 'Next.js 14 + Prisma + Clerk + Stripe',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen p-6">
<ClerkProvider>
<div className="max-w-5xl mx-auto">{children}</div>
</ClerkProvider>
</body>
</html>
)
}
