// middleware.ts (Clerk v5 style)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/ideas(.*)', // keep public if your app needs it; otherwise remove
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // allow public pages
  }
  auth().protect(); // require auth for everything else
});

export const config = {
  matcher: [
    // Run this middleware on all routes except static files and _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    // And on API routes
    '/(api|trpc)(.*)',
  ],
};
