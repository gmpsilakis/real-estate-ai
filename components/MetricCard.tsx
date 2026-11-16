import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  change?: string
  trend: 'up' | 'down' | 'neutral'
  positiveDirection?: 'up' | 'down' // which direction is "good" for this metric
}

export default function MetricCard({
  label, value, change, trend, positiveDirection = 'up',
}: MetricCardProps) {
  const isPositive = trend === positiveDirection
  const isNeutral = trend === 'neutral'

  const trendColor = isNeutral
    ? 'text-slate-400'
    : isPositive
    ? 'text-emerald-500'
    : 'text-red-400'

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1 leading-tight">{value}</p>
      {change && (
        <div className={`flex items-center gap-1 mt-1.5 ${trendColor}`}>
          <TrendIcon size={13} />
          <span className="text-xs font-medium">{change}</span>
        </div>
      )}
      {!change && trend !== 'neutral' && (
        <div className={`flex items-center gap-1 mt-1.5 ${trendColor}`}>
          <TrendIcon size={13} />
          <span className="text-xs font-medium capitalize">{trend}</span>
        </div>
      )}
    </div>
  )
}
