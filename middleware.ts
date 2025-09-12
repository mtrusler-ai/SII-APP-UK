import { clerkMiddleware } from '@clerk/nextjs/server'


export default clerkMiddleware({
publicRoutes: [
'/',
'/ideas',
'/api/health',
'/api/ideas(.*)',
'/api/research', // write route is also gated inside handler
'/api/report/pdf',
'/checkout/(.*)'
],
})


export const config = {
matcher: ['/((?!.*\..*|_next).*)', '/', '/(api)(.*)'],
}
