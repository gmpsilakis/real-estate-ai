'use client'

interface MarketGaugeProps {
  score: number // 0–100
  condition: 'buyer' | 'neutral' | 'seller'
}

export default function MarketGauge({ score, condition }: MarketGaugeProps) {
  // Clamp score
  const s = Math.max(0, Math.min(100, score))

  // SVG arc math for a 180° semicircle
  const cx = 100, cy = 100, r = 80
  const needleAngle = -180 + (s / 100) * 180 // degrees: -180 = left, 0 = right
  const rad = (needleAngle * Math.PI) / 180
  const nx = cx + r * Math.cos(rad)
  const ny = cy + r * Math.sin(rad)

  const labelColor =
    condition === 'buyer' ? 'text-blue-600' : condition === 'seller' ? 'text-orange-500' : 'text-slate-600'
  const labelText =
    condition === 'buyer' ? "Buyer's Market" : condition === 'seller' ? "Seller's Market" : 'Neutral Market'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">Market Conditions</h3>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 110" className="w-52">
          {/* Background arc segments */}
          {/* Buyer zone: -180° to -60° (red) */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 20.7"
            fill="none" stroke="#3b82f6" strokeWidth="14" strokeLinecap="round" opacity="0.25"
          />
          {/* Neutral zone: -60° to 60° */}
          <path
            d="M 60 20.7 A 80 80 0 0 1 140 20.7"
            fill="none" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" opacity="0.25"
          />
          {/* Seller zone: 60° to 0° */}
          <path
            d="M 140 20.7 A 80 80 0 0 1 180 100"
            fill="none" stroke="#f97316" strokeWidth="14" strokeLinecap="round" opacity="0.25"
          />

          {/* Needle */}
          <line
            x1={cx} y1={cy}
            x2={nx} y2={ny}
            stroke="#1e293b" strokeWidth="3" strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="5" fill="#1e293b" />
          <circle cx={cx} cy={cy} r="2.5" fill="white" />

          {/* Labels */}
          <text x="14" y="115" fill="#3b82f6" fontSize="8" fontWeight="600">Buyer</text>
          <text x="83" y="115" fill="#64748b" fontSize="8" fontWeight="600">Neutral</text>
          <text x="154" y="115" fill="#f97316" fontSize="8" fontWeight="600">Seller</text>
        </svg>

        <div className="mt-2 text-center">
          <span className={`text-lg font-bold ${labelColor}`}>{labelText}</span>
          <p className="text-xs text-slate-400 mt-0.5">Market score: {s}/100</p>
        </div>
      </div>
    </div>
  )
}
