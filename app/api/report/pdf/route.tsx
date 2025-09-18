import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { renderToStream } from '@react-pdf/renderer'

export const runtime = 'nodejs' // @react-pdf needs Node runtime
export const dynamic = 'force-dynamic'

const styles = StyleSheet.create({
  page: { padding: 24 },
  h1: { fontSize: 18, marginBottom: 8 },
  h2: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  p: { fontSize: 10, marginBottom: 4 }
})

function Report({ items }: { items: Array<{ title: string; summary?: string | null; url?: string | null }> }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>SII-APP-UK — Research Report</Text>
        <Text style={styles.p}>Total ideas: {items.length}</Text>
        <Text style={styles.h2}>Ideas</Text>
        {items.map((it, idx) => (
          <View key={idx} wrap={false}>
            <Text style={styles.p}>• {it.title}</Text>
            {it.summary ? <Text style={styles.p}>  {it.summary}</Text> : null}
            {it.url ? <Text style={styles.p}>  {it.url}</Text> : null}
          </View>
        ))}
      </Page>
    </Document>
  )
}

export async function GET() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { title: true, summary: true, url: true },
  })

  const stream = await renderToStream(<Report items={ideas} />)
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="research-report.pdf"',
    },
  })
}
