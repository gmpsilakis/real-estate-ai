'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAnalyze } from '@/lib/useAnalyze'
import ScoreCard from '@/components/ScoreCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import LocationSelector from '@/components/LocationSelector'
import CriteriaPanel from '@/components/CriteriaPanel'

interface CondoResult {
  name: string; location: string; score: number
  financialReturnScore: number; hoaRiskScore: number; locationScore: number
  rentalFlexibility?: string
  financialMetrics: Record<string, string | number>
  locationSignals: string[]; redFlags: string[]
  recommendation: string; summary: string
}
interface CondoData { results: CondoResult[]; marketOverview: string }

const CRITERIA = [
  { label: 'Cap Rate Target', value: '4–6% net (after HOA)', color: 'green' as const },
  { label: 'HOA Fee Threshold', value: '< 30% of gross monthly rent', color: 'amber' as const },
  { label: 'Owner-Occupancy Ratio', value: '≥ 51% for conventional financing', color: 'amber' as const },
  { label: 'Rental Cap', value: 'Building must allow ≥ 20% rentals', color: 'green' as const },
  { label: 'Reserve Fund', value: '≥ 10% of annual budget = healthy', color: 'slate' as const },
  { label: 'Special Assessments', value: 'Any pending = significant risk', color: 'red' as const },
  { label: 'Pending Litigation', value: 'Building lawsuits = avoid', color: 'red' as const },
  { label: 'Amenity Value', value: 'Gym/pool/doorman adds 5–15% rent', color: 'slate' as const },
]

export default function CondosPage() {
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')
  const [maxPrice, setMaxPrice] = useState('350000')
  const [desiredUse, setDesiredUse] = useState('long-term-rental')
  const [minBedrooms, setMinBedrooms] = useState('1')

  const { data, loading, streamText, error, analyze } = useAnalyze<CondoData>('condos')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!state) return
    analyze({ state, region, maxPrice, desiredUse, minBedrooms })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Condos</h1>
        <p className="text-sm text-slate-500 mt-0.5">Evaluate condo investment opportunities with HOA due diligence</p>
      </div>

      <CriteriaPanel title="Condo Investment Criteria Reference" items={CRITERIA} />

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
            <label className="block text-xs font-medium text-slate-600 mb-1">Intended Use</label>
            <select
              value={desiredUse} onChange={e => setDesiredUse(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="long-term-rental">Long-Term Rental</option>
              <option value="short-term-rental">Short-Term Rental (STR)</option>
              <option value="house-hack">House Hack (live + rent)</option>
              <option value="appreciation">Appreciation Play</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Bedrooms</label>
            <select
              value={minBedrooms} onChange={e => setMinBedrooms(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {['Studio','1','2','3'].map(v => <option key={v} value={v}>{v === 'Studio' ? 'Studio' : `${v} bed${v !== '1' ? 's' : ''}`}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit" disabled={loading || !state}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          <Search size={16} />
          {loading ? 'Analyzing…' : 'Analyze Condo Markets'}
        </button>
      </form>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <LoadingSpinner text="Researching condo investment markets with live data…" />
          {streamText && <pre className="mt-4 text-xs text-slate-400 bg-slate-50 rounded p-3 max-h-24 overflow-auto">{streamText.slice(-200)}</pre>}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.marketOverview && (
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <p className="text-xs text-teal-400 font-semibold uppercase tracking-wide mb-1">Condo Market Overview</p>
              <p className="text-sm text-slate-200">{data.marketOverview}</p>
            </div>
          )}
          {data.results?.map((r, i) => (
            <ScoreCard
              key={i} rank={i + 1}
              name={r.name} location={r.location} score={r.score}
              subScores={[
                { label: 'Financial', score: r.financialReturnScore },
                { label: 'HOA Risk', score: r.hoaRiskScore },
                { label: 'Location', score: r.locationScore },
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
