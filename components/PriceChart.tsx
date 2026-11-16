'use client'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, TooltipProps,
} from 'recharts'

interface DataPoint { month: string; price: number }

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-slate-500 text-xs">{label}</p>
      <p className="font-semibold text-slate-900">
        ${(payload[0].value ?? 0).toLocaleString()}
      </p>
    </div>
  )
}

export default function PriceChart({ data }: { data: DataPoint[] }) {
  if (!data?.length) return null

  const formatted = data.map(d => ({
    month: d.month,
    price: d.price,
  }))

  const minVal = Math.min(...formatted.map(d => d.price))
  const domain: [number, number] = [Math.floor(minVal * 0.97), Math.ceil(Math.max(...formatted.map(d => d.price)) * 1.01)]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Median Home Price — 12 Month Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={domain}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0d9488"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#0d9488' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
