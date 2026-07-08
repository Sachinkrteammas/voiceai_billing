import { ChevronDown } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="h-11 border-b border-ink-300/20 bg-white flex items-center px-5 justify-between">
      <span className="text-[11px] font-medium text-ink-400 border border-ink-300/40 rounded px-1.5 py-0.5">
        Beta
      </span>
      <button className="flex items-center gap-1.5 text-[13px] font-medium text-ink-700 hover:text-ink-900">
        Voice AI Billing Dashboard
        <ChevronDown size={14} className="text-ink-400" />
      </button>
      <span className="w-10" />
    </header>
  )
}
