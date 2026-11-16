'use client'
import { US_STATES, getRegionPlaceholder } from '@/lib/states'

interface Props {
  state: string; region: string
  onStateChange: (s: string) => void
  onRegionChange: (r: string) => void
  required?: boolean
}

export default function LocationSelector({ state, region, onStateChange, onRegionChange, required }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          State {required && <span className="text-red-400">*</span>}
        </label>
        <select
          value={state}
          onChange={e => { onStateChange(e.target.value); onRegionChange('') }}
          required={required}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Select a state…</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Metro / Region <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          value={region}
          onChange={e => onRegionChange(e.target.value)}
          placeholder={state ? getRegionPlaceholder(state) : 'Select a state first'}
          disabled={!state}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
    </div>
  )
}
