// src/pdf/Report.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24 },
  h1: { fontSize: 18, marginBottom: 12 },
  item: { fontSize: 12, marginBottom: 6 }
});

export function Report({ items }: { items: any[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>SII-APP-UK — Research Report</Text>
        {items.map((it, i) => (
          <View key={i} style={styles.item}>
            <Text>{typeof it === 'string' ? it : JSON.stringify(it)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
