'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

interface CriteriaPanelProps {
  title: string
  items: Array<{ label: string; value: string; color?: 'green' | 'amber' | 'red' | 'slate' }>
}

export default function CriteriaPanel({ title, items }: CriteriaPanelProps) {
  const [open, setOpen] = useState(false)

  const colorClass = {
    green: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
    red: 'text-red-700 bg-red-50 border-red-200',
    slate: 'text-slate-700 bg-slate-50 border-slate-200',
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info size={14} className="text-teal-500" />
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map(({ label, value, color = 'slate' }) => (
            <div key={label} className={`rounded-lg border px-3 py-2 ${colorClass[color]}`}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <p className="text-xs mt-0.5 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
