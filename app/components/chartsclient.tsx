'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'


export default function ChartsClient() {
const [data, setData] = useState<any>({ bySource: [], byTag: [], byDay: [] })
useEffect(() => { fetch('/api/ideas/stats').then(r => r.json()).then(setData) }, [])


return (
<div className="grid gap-6 md:grid-cols-3">
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={data.byTag}>
<XAxis dataKey="tag" /><YAxis /><Tooltip />
<Bar dataKey="count" />
</BarChart>
</ResponsiveContainer>
<div className="mt-2 text-sm opacity-80">Ideas by top tags</div>
</div>
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie data={data.bySource} dataKey="count" nameKey="source" outerRadius={80} label>
{data.bySource.map((_: any, i: number) => <Cell key={i} />)}
</Pie>
<Tooltip />
</PieChart>
</ResponsiveContainer>
<div className="mt-2 text-sm opacity-80">Distribution by source</div>
</div>
<div className="h-64 md:col-span-1">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data.byDay}>
<XAxis dataKey="day" /><YAxis /><Tooltip />
<Line type="monotone" dataKey="count" />
</LineChart>
</ResponsiveContainer>
<div className="mt-2 text-sm opacity-80">Ideas per day</div>
</div>
</div>
)
}
