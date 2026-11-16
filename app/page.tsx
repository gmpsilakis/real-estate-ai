'use client'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, MapPin, Star } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import MarketGauge from '@/components/MarketGauge'
import PriceChart from '@/components/PriceChart'
import LoadingSpinner from '@/components/LoadingSpinner'
import { US_STATES, getRegionPlaceholder } from '@/lib/states'

interface Metric { value: string; trend: 'up' | 'down' | 'neutral'; change?: string; label: string }
interface PricePoint { month: string; price: number }
interface TopMarket { city: string; reason: string; score: number; capRate: string; priceGrowth: string }

interface MarketData {
  metrics: {
    mortgageRate: Metric; medianPrice: Metric; monthOverMonth: Metric
    inventory: Metric; rentGrowth: Metric; foreclosures: Metric
  }
  priceHistory: PricePoint[]
  marketCondition: 'buyer' | 'neutral' | 'seller'
  marketScore: number
  topMarkets: TopMarket[]
  commentary: string
}

function extractJSON(raw: string): MarketData | null {
  try {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start === -1 || end === -1) return null
    return JSON.parse(raw.slice(start, end + 1))
  } catch { return null }
}

export default function DashboardPage() {
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    setStreamText('')
    setData(null)

    try {
      const res = await fetch('/api/market-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: state || undefined, region: region || undefined }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to fetch market data')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamText(accumulated)
      }

      const parsed = extractJSON(accumulated)
      if (!parsed) throw new Error('Could not parse market data. Please try again.')
      setData(parsed)
      setLastUpdated(new Date())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  }, [state, region])

  useEffect(() => { fetchData() }, []) // auto-load on mount

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Market Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">{dateStr}</p>
          {lastUpdated && (
            <p className="text-xs text-teal-600 mt-0.5">
              Market data updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Fetching…' : 'Refresh Data'}
        </button>
      </div>

      {/* Location Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <MapPin size={12} /> Market Focus (optional — leave blank for national)
        </p>
        <div className="flex gap-3 flex-wrap">
          <select
            value={state}
            onChange={e => { setState(e.target.value); setRegion('') }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All United States</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {state && (
            <input
              type="text"
              value={region}
              onChange={e => setRegion(e.target.value)}
              placeholder={getRegionPlaceholder(state)}
              className="flex-1 min-w-48 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
          {(state || region) && (
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Update
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <LoadingSpinner text="Fetching live market data via web search…" />
          {streamText && (
            <div className="mt-4 bg-slate-50 rounded-lg p-3 max-h-32 overflow-auto">
              <p className="text-xs text-slate-400 font-mono">{streamText.slice(-300)}</p>
            </div>
          )}
        </div>
      )}

      {/* Metrics Grid */}
      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            <MetricCard {...data.metrics.mortgageRate} positiveDirection="down" />
            <MetricCard {...data.metrics.medianPrice} />
            <MetricCard {...data.metrics.monthOverMonth} />
            <MetricCard {...data.metrics.inventory} positiveDirection="down" />
            <MetricCard {...data.metrics.rentGrowth} />
            <MetricCard {...data.metrics.foreclosures} positiveDirection="down" />
          </div>

          {/* Chart + Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <div className="lg:col-span-2">
              <PriceChart data={data.priceHistory} />
            </div>
            <div>
              <MarketGauge score={data.marketScore} condition={data.marketCondition} />
            </div>
          </div>

          {/* Top Markets */}
          {data.topMarkets && data.topMarkets.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Star size={14} className="text-amber-500" />
                Top Markets to Invest Right Now
                {state && <span className="text-slate-400 font-normal">— {region || state}</span>}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.topMarkets.map((m, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3 hover:border-teal-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{m.city}</p>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${m.score >= 7 ? 'bg-emerald-100 text-emerald-700' : m.score >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {m.score}/10
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-[11px] text-slate-500">Cap: <b className="text-slate-700">{m.capRate}</b></span>
                      <span className="text-[11px] text-slate-500">Growth: <b className="text-emerald-600">{m.priceGrowth}</b></span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{m.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commentary */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">AI Market Commentary</p>
            <p className="text-sm leading-relaxed text-slate-200">{data.commentary}</p>
          </div>
        </>
      )}
    </div>
  )
}
