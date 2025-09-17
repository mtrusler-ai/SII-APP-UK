// app/admin/page.tsx
'use client';

export default function AdminPage() {
  async function runResearch() {
    await fetch('/api/research/run', { method: 'POST' });
    alert('Research started (check logs for progress).');
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Admin</h1>
      <button onClick={runResearch} style={{ padding: '10px 16px' }}>
        Run Research
      </button>
    </main>
  );
}
