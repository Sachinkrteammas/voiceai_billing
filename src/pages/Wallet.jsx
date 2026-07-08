import { useMemo, useState } from 'react'
import { Search, Download, WalletCards, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { walletSummary, walletTransactions, formatINR, formatINRWhole } from '../data/mockData'

const typeStyles = {
  Recharge: 'bg-success/10 text-success',
  'Usage Deduction': 'bg-danger/10 text-danger',
  Adjustment: 'bg-warning/10 text-warning',
  Refund: 'bg-brand-100 text-brand-600'
}

const healthStyles = {
  Healthy: { bg: 'bg-success/10', text: 'text-success', bar: 'bg-success' },
  Low: { bg: 'bg-warning/10', text: 'text-warning', bar: 'bg-warning' },
  Critical: { bg: 'bg-danger/10', text: 'text-danger', bar: 'bg-danger' }
}

export default function Wallet() {
  const [search, setSearch] = useState('')
  const health = healthStyles[walletSummary.health]

  const rows = useMemo(
    () =>
      walletTransactions.filter(
        (t) =>
          t.type.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink-900">Wallet</h1>
        <p className="text-[13.5px] text-ink-400 mt-1">Manage your balance and view transaction history</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-1 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-white/80 text-[12.5px] font-medium mb-2">
            <WalletCards size={15} />
            Current Balance
          </div>
          <p className="text-[24px] font-num font-semibold">{formatINR(walletSummary.currentBalance)}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            <span className="text-[12px] text-white/80">{walletSummary.health}</span>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-ink-300/20 shadow-card p-5">
          <p className="text-[12.5px] text-ink-500 font-medium">Total Recharged</p>
          <p className="mt-2 text-[19px] font-num font-semibold text-ink-900">{formatINR(walletSummary.totalRecharged)}</p>
          <p className="mt-1 text-[12px] text-ink-400">All time</p>
        </div>

        <div className="rounded-xl bg-white border border-ink-300/20 shadow-card p-5">
          <p className="text-[12.5px] text-ink-500 font-medium">Total Consumed</p>
          <p className="mt-2 text-[19px] font-num font-semibold text-ink-900">{formatINR(walletSummary.totalConsumed)}</p>
          <p className="mt-1 text-[12px] text-danger">
            {((walletSummary.totalConsumed / walletSummary.totalRecharged) * 100).toFixed(1)}% of recharged
          </p>
        </div>

        <div className="rounded-xl bg-white border border-ink-300/20 shadow-card p-5">
          <p className="text-[12.5px] text-ink-500 font-medium">Available Minutes</p>
          <p className="mt-2 text-[19px] font-num font-semibold text-ink-900">
            {walletSummary.availableMinutes.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[12px] text-ink-400">at ₹4/min</p>
        </div>

        <div className={`rounded-xl border p-5 shadow-card ${health.bg} border-transparent`}>
          <p className="text-[12.5px] text-ink-500 font-medium">Wallet Health</p>
          <p className={`mt-2 text-[19px] font-semibold ${health.text}`}>{walletSummary.health}</p>
          <div className="h-1.5 rounded-full bg-white/70 mt-3 overflow-hidden">
            <div className={`h-full rounded-full ${health.bar}`} style={{ width: `${walletSummary.healthPercent}%` }} />
          </div>
          <p className="text-[11px] text-ink-400 mt-1.5">{walletSummary.healthPercent}% remaining</p>
        </div>
      </div>

      <div className="bg-white border border-ink-300/20 rounded-xl shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-300/15">
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Transaction History</h2>
            <p className="text-[12px] text-ink-400 mt-0.5">All wallet credits and deductions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="pl-8 pr-3 py-1.5 text-[13px] rounded-lg border border-ink-300/40 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 text-[13px] font-medium border border-ink-300/40 rounded-lg px-3 py-1.5 hover:bg-ink-900/[0.03]">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="No Recharge History" description="Your wallet transactions will appear here." />
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-400 border-b border-ink-300/15">
                <th className="px-5 py-3 font-medium">Date &amp; Time</th>
                <th className="px-5 py-3 font-medium">Transaction Type</th>
                <th className="px-5 py-3 font-medium">Reference ID</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => (
                <tr key={i} className="border-b border-ink-300/10 last:border-0 hover:bg-ink-900/[0.015]">
                  <td className="px-5 py-3 text-ink-700 font-num">{t.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-[11.5px] font-medium px-2 py-0.5 rounded-md ${typeStyles[t.type]}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-500 font-num">{t.ref}</td>
                  <td
                    className={`px-5 py-3 font-num font-semibold flex items-center gap-1 ${
                      t.amount < 0 ? 'text-danger' : 'text-success'
                    }`}
                  >
                    {t.amount < 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                    {t.amount < 0 ? '-' : '+'}
                    {formatINR(Math.abs(t.amount))}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
