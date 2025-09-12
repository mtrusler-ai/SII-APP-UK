import { NextResponse } from 'next/server'
import Stripe from 'stripe'


export const runtime = 'nodejs'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })


export async function POST() {
try {
const price = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!
const url = process.env.NEXT_PUBLIC_APP_URL!
const session = await stripe.checkout.sessions.create({
mode: 'subscription',
line_items: [{ price, quantity: 1 }],
success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${url}/checkout/cancel`,
allow_promotion_codes: true
})
return NextResponse.json({ id: session.id, url: session.url })
} catch (e: any) {
return NextResponse.json({ error: e.message }, { status: 500 })
}
}
