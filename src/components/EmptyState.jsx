import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="w-11 h-11 rounded-full bg-ink-900/[0.04] flex items-center justify-center mb-3">
        <Inbox size={19} className="text-ink-400" strokeWidth={1.8} />
      </div>
      <p className="text-[14px] font-medium text-ink-700">{title}</p>
      {description && <p className="text-[12.5px] text-ink-400 mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
