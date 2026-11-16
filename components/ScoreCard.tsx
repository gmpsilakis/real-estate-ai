'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

function scoreColor(score: number) {
  if (score >= 7) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-500' }
  if (score >= 5) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-500' }
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-500' }
}

function recColor(rec: string) {
  if (rec?.toLowerCase().includes('strong buy')) return 'bg-emerald-500 text-white'
  if (rec?.toLowerCase().includes('buy')) return 'bg-teal-500 text-white'
  if (rec?.toLowerCase().includes('caution') || rec?.toLowerCase().includes('neutral')) return 'bg-amber-500 text-white'
  return 'bg-red-500 text-white'
}

interface SubScore { label: string; score: number }

interface ScoreCardProps {
  rank: number
  name: string
  location: string
  score: number
  subScores?: SubScore[]
  metrics: Record<string, string | number>
  signals: string[]
  redFlags: string[]
  recommendation: string
  summary: string
  // vacation rental specific
  airbnbViability?: 'Green' | 'Yellow' | 'Red' | string
  strRegulationScore?: number
  regulationSummary?: string
  // fix & flip specific
  flipRisk?: 'Low' | 'Medium' | 'High' | string
  dealBreakdown?: { estimatedArv: number; purchasePrice: number; rehabCost: number; holdingCosts: number; sellingCosts: number; netProfit: number }
}

export default function ScoreCard({
  rank, name, location, score, subScores, metrics, signals, redFlags,
  recommendation, summary, airbnbViability, strRegulationScore, regulationSummary,
  flipRisk, dealBreakdown,
}: ScoreCardProps) {
  const [expanded, setExpanded] = useState(rank === 1)
  const c = scoreColor(score)

  const airbnbColor = airbnbViability === 'Green'
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : airbnbViability === 'Yellow'
    ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-red-100 text-red-700 border-red-200'

  const riskColor = flipRisk === 'Low'
    ? 'bg-emerald-100 text-emerald-700'
    : flipRisk === 'Medium'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700'

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      {/* Header */}
      <div
        className="flex items-start justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-full ${c.badge} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
            {rank}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 leading-tight">{name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{location}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {score > 0 && (
                <span className={`text-xs font-bold ${c.text}`}>Score: {score}/10</span>
              )}
              {flipRisk && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColor}`}>
                  {flipRisk} Risk
                </span>
              )}
              {airbnbViability && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${airbnbColor}`}>
                  Airbnb: {airbnbViability}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recColor(recommendation)}`}>
                {recommendation}
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-200/60 pt-3">
          {/* Sub-scores */}
          {subScores && subScores.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {subScores.map(ss => {
                const sc = scoreColor(ss.score)
                return (
                  <div key={ss.label} className="bg-white rounded-lg border border-slate-200 p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{ss.label}</p>
                    <p className={`text-lg font-bold ${sc.text}`}>{ss.score}/10</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* STR Regulation Score */}
          {strRegulationScore !== undefined && (
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-slate-700">STR Regulation Score</p>
                <span className={`text-sm font-bold ${strRegulationScore >= 80 ? 'text-emerald-600' : strRegulationScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {strRegulationScore}/100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${strRegulationScore >= 80 ? 'bg-emerald-500' : strRegulationScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${strRegulationScore}%` }}
                />
              </div>
              {regulationSummary && (
                <p className="text-xs text-slate-600 mt-1.5">{regulationSummary}</p>
              )}
            </div>
          )}

          {/* Metrics */}
          {Object.keys(metrics).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Financial Metrics</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(metrics).map(([key, val]) => (
                  <div key={key} className="bg-white rounded-lg border border-slate-200 p-2.5">
                    <p className="text-[10px] text-slate-400 leading-tight capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deal Breakdown (Fix & Flip) */}
          {dealBreakdown && (
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Deal Math</p>
              <div className="space-y-1.5">
                {([
                  ['ARV', dealBreakdown.estimatedArv, false],
                  ['− Purchase Price', dealBreakdown.purchasePrice, true],
                  ['− Rehab Cost', dealBreakdown.rehabCost, true],
                  ['− Holding Costs', dealBreakdown.holdingCosts, true],
                  ['− Selling Costs', dealBreakdown.sellingCosts, true],
                ] as [string, number, boolean][]).map(([label, val, neg]) => (
                  <div key={label} className="flex justify-between text-xs text-slate-600">
                    <span>{label}</span>
                    <span className={neg ? 'text-red-500' : ''}>${val.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm font-bold">
                  <span>= Net Profit</span>
                  <span className={dealBreakdown.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    ${dealBreakdown.netProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Signals */}
          {signals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Green Flags</p>
              <div className="space-y-1">
                {signals.map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {redFlags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertTriangle size={12} /> Red Flags
              </p>
              <div className="space-y-1">
                {redFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <XCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-white/60 rounded-lg p-3 border border-slate-200/60">
            <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}
