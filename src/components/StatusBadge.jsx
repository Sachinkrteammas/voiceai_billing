import { CheckCircle2, Clock3, CircleDot } from 'lucide-react'

const styles = {
  Paid: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle2 },
  Completed: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle2 },
  Pending: { bg: 'bg-warning/10', text: 'text-warning', icon: Clock3 },
  'Partially Paid': { bg: 'bg-brand-100', text: 'text-brand-600', icon: CircleDot }
}

export default function StatusBadge({ status }) {
  const style = styles[status] || styles.Pending
  const Icon = style.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${style.bg} ${style.text}`}
    >
      <Icon size={12.5} strokeWidth={2.4} />
      {status}
    </span>
  )
}
