// middleware.ts — Clerk v5 style

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// List routes that should NOT require auth.
// Add or remove items to suit your app.
const isPublicRoute = createRouteMatcher([
  '/',               // home
  '/sign-in(.*)',    // Clerk sign-in
  '/sign-up(.*)',    // Clerk sign-up
  // '/ideas(.*)',    // <- uncomment if Ideas page should be public
  // '/api/ideas(.*)' // <- uncomment if ideas API should be public
])

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    // Public: allow through
    return
  }
  // Private: require a signed-in user
  auth().protect()
})

// Tell Next which paths should be checked by the middleware.
// This matcher skips static files and _next assets.
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
}
