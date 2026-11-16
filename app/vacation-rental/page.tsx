'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAnalyze } from '@/lib/useAnalyze'
import ScoreCard from '@/components/ScoreCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import LocationSelector from '@/components/LocationSelector'
import CriteriaPanel from '@/components/CriteriaPanel'

interface VRResult {
  name: string; location: string; score: number
  airbnbViability?: string
  strRegulationScore?: number
  regulationSummary?: string
  financialMetrics: Record<string, string | number>
  demandDrivers: string[]; redFlags: string[]
  recommendation: string; summary: string
}
interface VRData { results: VRResult[]; marketOverview: string }

const CRITERIA = [
  { label: 'Gross Rental Yield', value: '≥ 8% (10%+ in top STR markets)', color: 'green' as const },
  { label: 'Occupancy Rate', value: '≥ 65% annual; 75%+ = excellent', color: 'green' as const },
  { label: 'RevPAR Target', value: 'Benchmark vs. comp set on AirDNA', color: 'slate' as const },
  { label: 'ADR (Avg Daily Rate)', value: 'Must support expenses + 20% margin', color: 'amber' as const },
  { label: 'STR Regulation Score', value: '≥ 60 = safe; < 40 = high risk', color: 'amber' as const },
  { label: 'Seasonality Risk', value: 'Prefer < 3 month dead season', color: 'slate' as const },
  { label: 'Platform Fees', value: 'Budget 15–20% of revenue for mgmt', color: 'slate' as const },
  { label: 'Red Flag: Regulation', value: 'Primary residence required = avoid', color: 'red' as const },
]

export default function VacationRentalPage() {
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')
  const [maxPrice, setMaxPrice] = useState('500000')
  const [destinationType, setDestinationType] = useState('beach')
  const [propertyType, setPropertyType] = useState('house')
  const [bedrooms, setBedrooms] = useState('3')

  const { data, loading, streamText, error, analyze } = useAnalyze<VRData>('vacation-rental')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!state) return
    analyze({ state, region, maxPrice, destinationType, propertyType, bedrooms })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Vacation Rentals / Airbnb</h1>
        <p className="text-sm text-slate-500 mt-0.5">Find short-term rental markets with strong STR performance</p>
      </div>

      <CriteriaPanel title="STR Investment Criteria Reference" items={CRITERIA} />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 space-y-4">
        <LocationSelector
          state={state} region={region}
          onStateChange={setState} onRegionChange={setRegion}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Max Purchase Price ($)</label>
            <input
              type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              min="50000" step="10000"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Destination Type</label>
            <select
              value={destinationType} onChange={e => setDestinationType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {[['beach','Beach / Coastal'],['mountain','Mountain / Ski'],['urban','Urban / City'],['theme-park','Theme Park / Family'],['lake','Lake / Waterfront'],['desert','Desert / Southwest']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Property Type</label>
            <select
              value={propertyType} onChange={e => setPropertyType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {[['house','House / Single Family'],['cabin','Cabin / Chalet'],['condo','Condo / Apartment'],['beach-cottage','Beach Cottage'],['townhouse','Townhouse']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Bedrooms</label>
            <select
              value={bedrooms} onChange={e => setBedrooms(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {['1','2','3','4','5+'].map(v => <option key={v} value={v}>{v} bed{v !== '1' ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit" disabled={loading || !state}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          <Search size={16} />
          {loading ? 'Analyzing…' : 'Analyze STR Markets'}
        </button>
      </form>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <LoadingSpinner text="Researching short-term rental markets with live data…" />
          {streamText && <pre className="mt-4 text-xs text-slate-400 bg-slate-50 rounded p-3 max-h-24 overflow-auto">{streamText.slice(-200)}</pre>}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.marketOverview && (
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <p className="text-xs text-teal-400 font-semibold uppercase tracking-wide mb-1">STR Market Overview</p>
              <p className="text-sm text-slate-200">{data.marketOverview}</p>
            </div>
          )}
          {data.results?.map((r, i) => (
            <ScoreCard
              key={i} rank={i + 1}
              name={r.name} location={r.location} score={r.score}
              metrics={r.financialMetrics}
              airbnbViability={r.airbnbViability as 'Green' | 'Yellow' | 'Red' | undefined}
              strRegulationScore={r.strRegulationScore}
              regulationSummary={r.regulationSummary}
              signals={r.demandDrivers ?? []}
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
