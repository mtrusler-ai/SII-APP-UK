import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/ideas',
    '/api/health',
    '/api/ideas(.*)',
    '/api/ideas/stats',
    '/api/research/run',
    '/api/stripe/(.*)',
    '/api/research',
    '/api/report/pdf',
    '/admin',
    '/checkout/(.*)',
  ],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api)(.*)'],
}
