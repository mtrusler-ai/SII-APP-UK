import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/db'
import { pdf } from '@react-pdf/renderer'
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'


export const runtime = 'nodejs'


const styles = StyleSheet.create({
page: { padding: 24 },
h1: { fontSize: 18, marginBottom: 8 },
item: { marginBottom: 8 },
title: { fontSize: 12, fontWeight: 700 },
meta: { fontSize: 10, color: '#555' },
body: { fontSize: 10 }
})


function Report({ items }: { items: any[] }) {
return (
<Document>
<Page size="A4" style={styles.page}>
<Text style={styles.h1}>SII‑APP‑UK — Research Report</Text>
{items.map((it, i) => (
<View key={i} style={styles.item} wrap={false}>
<Text style={styles.title}>{it.title}</Text>
<Text style={styles.meta}>{[it.source, it.url].filter(Boolean).join(' · ')}</Text>
{it.summary && <Text style={styles.body}>{it.summary}</Text>}
{it.tags?.length ? <Text style={styles.meta}>Tags: {it.tags.join(', ')}</Text> : null}
</View>
))}
</Page>
</Document>
)
}


export async function GET() {
const ideas = await prisma.idea.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
const pdfStream = await pdf(<Report items={ideas} />).toBuffer()
return new NextResponse(pdfStream, { headers: { 'content-type': 'application/pdf', 'content-disposition': 'inline; filename="report.pdf"' } })
}
