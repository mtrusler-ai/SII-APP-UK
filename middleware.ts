// middleware.ts — Clerk v5 compatible

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Mark public routes here:
const isPublicRoute = createRouteMatcher([
  '/',               // home
  '/sign-in(.*)',    // Clerk sign-in
  '/sign-up(.*)',    // Clerk sign-up
  // '/ideas(.*)',    // <- uncomment if /ideas should be public
  // '/api/ideas(.*)' // <- uncomment if /api/ideas should be public
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;   // allow public routes
  auth().protect();                 // everything else requires auth
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
