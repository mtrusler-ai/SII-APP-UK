// middleware.ts — Clerk v5 compatible (root of repo)

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes (no auth required):
const isPublicRoute = createRouteMatcher([
  '/',               // homepage
  '/sign-in(.*)',    // Clerk sign-in
  '/sign-up(.*)',    // Clerk sign-up
  // '/ideas(.*)',    // <- uncomment if you want ideas public
  // '/api/ideas(.*)' // <- uncomment if you want the API public
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;   // allow public
  auth().protect();                 // everything else requires auth
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
