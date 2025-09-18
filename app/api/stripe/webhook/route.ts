import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'


export const runtime = 'nodejs'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })


export async function POST(req: Request) {
const body = await req.text() // raw body
const sig = (await headers()).get('stripe-signature')
const secret = process.env.STRIPE_WEBHOOK_SECRET!


let event: Stripe.Event
try {
event = stripe.webhooks.constructEvent(body, sig!, secret)
} catch (err: any) {
return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
}


if (event.type === 'checkout.session.completed') {
const s = event.data.object as Stripe.Checkout.Session
const email = s.customer_details?.email
const customerId = typeof s.customer === 'string' ? s.customer : s.customer?.id
if (email) {
await prisma.user.upsert({
where: { email },
update: { stripeId: customerId || undefined, plan: 'pro', planStatus: 'active' },
create: { email, clerkId: `unknown:${email}`, isAdmin: false, stripeId: customerId || undefined, plan: 'pro', planStatus: 'active' }
})
}
}


return NextResponse.json({ received: true })
}
