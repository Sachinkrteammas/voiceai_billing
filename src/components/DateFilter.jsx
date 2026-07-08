import { useState } from 'react'
import { CalendarRange, ChevronDown } from 'lucide-react'

const tabs = ['Today', 'This Week', 'This Month']

export default function DateFilter({ value, onChange, customRange, onCustomRangeChange }) {
  const [open, setOpen] = useState(false)

  const isCustom = value === 'Custom Range'

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-ink-900/[0.03] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              onChange(tab)
              setOpen(false)
            }}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              value === tab ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={() => {
            onChange('Custom Range')
            setOpen((o) => !o)
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            isCustom ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-900'
          }`}
        >
          <CalendarRange size={14} />
          Custom Range
          <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && isCustom && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-ink-300/25 rounded-xl shadow-lg p-4 z-20">
          <p className="text-[12.5px] font-semibold text-ink-700 mb-3">Custom Date Range</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11.5px] text-ink-400">From</label>
              <input
                type="date"
                value={customRange.from}
                onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink-300/40 px-2.5 py-1.5 text-[13px] font-num focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <div>
              <label className="text-[11.5px] text-ink-400">To</label>
              <input
                type="date"
                value={customRange.to}
                onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink-300/40 px-2.5 py-1.5 text-[13px] font-num focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white text-[13px] font-medium rounded-lg py-2 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => {
                onCustomRangeChange({ from: '', to: '' })
                onChange('This Month')
                setOpen(false)
              }}
              className="flex-1 border border-ink-300/40 text-ink-600 text-[13px] font-medium rounded-lg py-2 hover:bg-ink-900/[0.03] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
