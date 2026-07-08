export default function StatCard({ label, value, caption, captionTone = 'muted', highlight = false }) {
  const toneClass =
    captionTone === 'success' ? 'text-success' : captionTone === 'danger' ? 'text-danger' : 'text-ink-400'

  return (
    <div
      className={`rounded-xl border p-5 shadow-card ${
        highlight ? 'bg-brand-50/60 border-brand-200' : 'bg-white border-ink-300/20'
      }`}
    >
      <p className="text-[12.5px] text-ink-500 font-medium">{label}</p>
      <p className={`mt-2 text-[22px] font-num font-semibold ${highlight ? 'text-brand-700' : 'text-ink-900'}`}>
        {value}
      </p>
      {caption && <p className={`mt-1 text-[12px] ${toneClass}`}>{caption}</p>}
    </div>
  )
}
