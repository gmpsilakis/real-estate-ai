'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Home, Waves, Building2, Wrench } from 'lucide-react'

const nav = [
  { href: '/', label: 'Market Dashboard', icon: BarChart3, sub: 'Live Market Data' },
  { href: '/single-family', label: 'Single Family', icon: Home, sub: 'Long-term Rentals' },
  { href: '/vacation-rental', label: 'Vacation Rentals', icon: Waves, sub: 'Airbnb / STR' },
  { href: '/condos', label: 'Condos', icon: Building2, sub: 'Urban / Resort' },
  { href: '/fix-flip', label: 'Fix & Flip', icon: Wrench, sub: 'Distressed Properties' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-[#0a1628] flex flex-col z-40 shadow-2xl">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
            RE
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">InvestIQ</p>
            <p className="text-slate-400 text-[10px] leading-tight">Real Estate Research</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon, sub }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                active
                  ? 'bg-teal-600/20 border border-teal-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <Icon
                size={18}
                className={active ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}
              />
              <div>
                <p className={`text-[13px] font-medium leading-tight ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {label}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">{sub}</p>
              </div>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-[10px] text-slate-500 leading-snug">
          Powered by Claude AI + Live Web Data
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">For research purposes only.</p>
      </div>
    </aside>
  )
}
