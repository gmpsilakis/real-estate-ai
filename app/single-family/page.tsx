'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAnalyze } from '@/lib/useAnalyze'
import ScoreCard from '@/components/ScoreCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import LocationSelector from '@/components/LocationSelector'
import CriteriaPanel from '@/components/CriteriaPanel'

interface SFResult {
  name: string; location: string; score: number
  financialScore: number; locationScore: number; riskScore: number
  financialMetrics: Record<string, string | number>
  locationSignals: string[]; redFlags: string[]
  recommendation: string; summary: string
}
interface SFData { results: SFResult[]; marketOverview: string }

const CRITERIA = [
  { label: 'Cap Rate Target', value: '5–8% (4–5% in competitive markets)', color: 'green' as const },
  { label: 'Cash-on-Cash', value: '≥ 6% after financing', color: 'green' as const },
  { label: 'Price-to-Rent Ratio', value: '≤ 15 excellent; 16–20 OK; > 20 = warning', color: 'amber' as const },
  { label: 'Gross Rent Multiplier', value: '≤ 12', color: 'green' as const },
  { label: 'Vacancy Rate', value: '< 8% for the area', color: 'green' as const },
  { label: 'Property Age', value: 'Built after 1980 preferred', color: 'slate' as const },
  { label: 'Bedrooms', value: '3+ for best tenant stability', color: 'slate' as const },
  { label: 'Red Flag: P/R Ratio', value: '> 22 = avoid', color: 'red' as const },
]

export default function SingleFamilyPage() {
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')
  const [maxPrice, setMaxPrice] = useState('400000')
  const [minCapRate, setMinCapRate] = useState('5')
  const [minBedrooms, setMinBedrooms] = useState('3')

  const { data, loading, streamText, error, analyze } = useAnalyze<SFData>('single-family')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!state) return
    analyze({ state, region, maxPrice, minCapRate, minBedrooms })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Single Family Homes</h1>
        <p className="text-sm text-slate-500 mt-0.5">Identify long-term rental properties with strong cash flow</p>
      </div>

      <CriteriaPanel title="Investment Criteria Reference" items={CRITERIA} />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 space-y-4">
        <LocationSelector
          state={state} region={region}
          onStateChange={setState} onRegionChange={setRegion}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Max Purchase Price ($)</label>
            <input
              type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              min="50000" step="10000"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Cap Rate (%)</label>
            <input
              type="number" value={minCapRate} onChange={e => setMinCapRate(e.target.value)}
              min="1" max="20" step="0.5"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Bedrooms</label>
            <select
              value={minBedrooms} onChange={e => setMinBedrooms(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {['2','3','4','5+'].map(v => <option key={v} value={v}>{v} beds</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit" disabled={loading || !state}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          <Search size={16} />
          {loading ? 'Analyzing…' : 'Analyze Markets'}
        </button>
      </form>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <LoadingSpinner text="Searching for single-family markets with live data…" />
          {streamText && <pre className="mt-4 text-xs text-slate-400 bg-slate-50 rounded p-3 max-h-24 overflow-auto">{streamText.slice(-200)}</pre>}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.marketOverview && (
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <p className="text-xs text-teal-400 font-semibold uppercase tracking-wide mb-1">Market Overview</p>
              <p className="text-sm text-slate-200">{data.marketOverview}</p>
            </div>
          )}
          {data.results?.map((r, i) => (
            <ScoreCard
              key={i} rank={i + 1}
              name={r.name} location={r.location} score={r.score}
              subScores={[
                { label: 'Financial', score: r.financialScore },
                { label: 'Location', score: r.locationScore },
                { label: 'Risk', score: r.riskScore },
              ]}
              metrics={r.financialMetrics}
              signals={r.locationSignals ?? []}
              redFlags={r.redFlags ?? []}
              recommendation={r.recommendation}
              summary={r.summary}
            />
          ))}
        </div>
      )}
    </div>
  )
}
