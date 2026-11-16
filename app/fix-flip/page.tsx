'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAnalyze } from '@/lib/useAnalyze'
import ScoreCard from '@/components/ScoreCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import LocationSelector from '@/components/LocationSelector'
import CriteriaPanel from '@/components/CriteriaPanel'

interface FFResult {
  name: string; location: string
  flipRisk: 'Low' | 'Medium' | 'High'
  estimatedArv: string; maxOfferPrice: string
  rehabCategory: string; estimatedRehabCost: string
  projectedNetProfit: string; projectedRoi: string; holdPeriodEstimate: string
  dealBreakdown?: { estimatedArv: number; purchasePrice: number; rehabCost: number; holdingCosts: number; sellingCosts: number; netProfit: number }
  distressedSignals: string[]; redFlags: string[]
  summary: string
}
interface FFData { results: FFResult[]; marketOverview: string }

const CRITERIA = [
  { label: '2025 MAO Formula', value: '(ARV × 65%) − Rehab Costs', color: 'green' as const },
  { label: 'Minimum Net Profit', value: '≥ $25,000 or ≥ 15% of ARV', color: 'green' as const },
  { label: 'Rehab Budget', value: 'Cosmetic ≤$30k · Mid $30–80k · Full $80k+', color: 'amber' as const },
  { label: 'Holding Costs', value: '~1% of purchase price per month', color: 'slate' as const },
  { label: 'Selling Costs', value: '6–8% of ARV (agent + closing)', color: 'slate' as const },
  { label: 'Days on Market', value: '< 30 DOM = fast-moving market', color: 'green' as const },
  { label: 'Price Growth Required', value: '≥ 3% YoY appreciation preferred', color: 'amber' as const },
  { label: 'Red Flag: ARV Risk', value: 'Comps spread > 15% = avoid', color: 'red' as const },
]

export default function FixFlipPage() {
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')
  const [maxBudget, setMaxBudget] = useState('300000')
  const [rehabTolerance, setRehabTolerance] = useState('mid')
  const [targetProfit, setTargetProfit] = useState('30000')

  const { data, loading, streamText, error, analyze } = useAnalyze<FFData>('fix-flip')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!state) return
    analyze({ state, region, maxBudget, rehabTolerance, targetProfit })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Fix &amp; Flip</h1>
        <p className="text-sm text-slate-500 mt-0.5">Identify distressed markets with strong flip profit potential</p>
      </div>

      <CriteriaPanel title="Fix & Flip Criteria Reference" items={CRITERIA} />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 space-y-4">
        <LocationSelector
          state={state} region={region}
          onStateChange={setState} onRegionChange={setRegion}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">All-In Budget ($)</label>
            <input
              type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)}
              min="50000" step="10000"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Rehab Tolerance</label>
            <select
              value={rehabTolerance} onChange={e => setRehabTolerance(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="cosmetic">Cosmetic (≤ $30k)</option>
              <option value="mid">Mid-Level ($30–80k)</option>
              <option value="full">Full Gut ($80k+)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Target Net Profit ($)</label>
            <input
              type="number" value={targetProfit} onChange={e => setTargetProfit(e.target.value)}
              min="5000" step="5000"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <button
          type="submit" disabled={loading || !state}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          <Search size={16} />
          {loading ? 'Analyzing…' : 'Find Flip Opportunities'}
        </button>
      </form>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <LoadingSpinner text="Searching for fix & flip opportunities with live data…" />
          {streamText && <pre className="mt-4 text-xs text-slate-400 bg-slate-50 rounded p-3 max-h-24 overflow-auto">{streamText.slice(-200)}</pre>}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.marketOverview && (
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <p className="text-xs text-teal-400 font-semibold uppercase tracking-wide mb-1">Fix &amp; Flip Market Overview</p>
              <p className="text-sm text-slate-200">{data.marketOverview}</p>
            </div>
          )}
          {data.results?.map((r, i) => (
            <ScoreCard
              key={i} rank={i + 1}
              name={r.name} location={r.location} score={0}
              flipRisk={r.flipRisk}
              metrics={{
                'ARV': r.estimatedArv,
                'Max Offer': r.maxOfferPrice,
                'Rehab Category': r.rehabCategory,
                'Est. Rehab Cost': r.estimatedRehabCost,
                'Projected Profit': r.projectedNetProfit,
                'Projected ROI': r.projectedRoi,
                'Hold Period': r.holdPeriodEstimate,
              }}
              dealBreakdown={r.dealBreakdown}
              signals={r.distressedSignals ?? []}
              redFlags={r.redFlags ?? []}
              recommendation={r.flipRisk === 'Low' ? 'Buy' : r.flipRisk === 'Medium' ? 'Caution' : 'Avoid'}
              summary={r.summary}
            />
          ))}
        </div>
      )}
    </div>
  )
}
