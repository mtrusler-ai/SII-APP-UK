'use client'
export default function PurchaseButton() {
async function buy() {
const r = await fetch('/api/stripe/create-checkout-session', { method: 'POST' })
const j = await r.json()
if (j.url) window.location.href = j.url
}
return <button className="px-3 py-2 bg-white/10 rounded" onClick={buy}>Upgrade to Pro</button>
}
