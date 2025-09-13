import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/ideas',
    '/api/health',
    '/api/ideas(.*)',
    '/api/research',
    '/api/report/pdf',
    '/checkout/(.*)',
  ],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api)(.*)'],
}
