import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Download, Mail } from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { invoices, formatINR } from '../data/mockData'

export default function Invoices() {
  const [search, setSearch] = useState('')

  const totalInvoiced = invoices.reduce((a, i) => a + i.total, 0)
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((a, i) => a + i.total, 0)
  const pending = totalInvoiced - totalPaid

  const rows = useMemo(
    () => invoices.filter((i) => i.id.toLowerCase().includes(search.toLowerCase()) || i.period.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink-900">Invoices</h1>
        <p className="text-[13.5px] text-ink-400 mt-1">GST-compliant tax invoices for all billing periods</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5">
          <p className="text-[12.5px] text-ink-500 font-medium">Total Invoiced</p>
          <p className="mt-2 text-[20px] font-num font-semibold text-ink-900">{formatINR(totalInvoiced)}</p>
        </div>
        <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5">
          <p className="text-[12.5px] text-ink-500 font-medium">Total Paid</p>
          <p className="mt-2 text-[20px] font-num font-semibold text-success">{formatINR(totalPaid)}</p>
        </div>
        <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5">
          <p className="text-[12.5px] text-ink-500 font-medium">Pending Amount</p>
          <p className="mt-2 text-[20px] font-num font-semibold text-warning">{formatINR(pending)}</p>
        </div>
      </div>

      <div className="bg-white border border-ink-300/20 rounded-xl shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-300/15">
          <h2 className="text-[15px] font-semibold text-ink-900">Invoice History</h2>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="pl-8 pr-3 py-1.5 text-[13px] rounded-lg border border-ink-300/40 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 w-56"
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="No Invoices Available" description="Invoices are generated at the end of each billing cycle." />
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-400 border-b border-ink-300/15">
                <th className="px-5 py-3 font-medium">Invoice No.</th>
                <th className="px-5 py-3 font-medium">Billing Period</th>
                <th className="px-5 py-3 font-medium">Minutes</th>
                <th className="px-5 py-3 font-medium">Subtotal</th>
                <th className="px-5 py-3 font-medium">GST (18%)</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => (
                <tr key={inv.id} className="border-b border-ink-300/10 last:border-0 hover:bg-ink-900/[0.015]">
                  <td className="px-5 py-3 font-num font-medium text-ink-900">
                    <Link to={`/invoices/${inv.id}`} className="hover:text-brand-600">
                      {inv.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-700">{inv.period}</td>
                  <td className="px-5 py-3 font-num text-ink-700">{inv.minutes.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 font-num text-ink-700">{formatINR(inv.subtotal)}</td>
                  <td className="px-5 py-3 font-num text-ink-500">{formatINR(inv.gst)}</td>
                  <td className="px-5 py-3 font-num font-semibold text-ink-900">{formatINR(inv.total)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-ink-400">
                      <Link to={`/invoices/${inv.id}`} className="hover:text-brand-600 p-1">
                        <Eye size={15} />
                      </Link>
                      <button className="hover:text-brand-600 p-1">
                        <Download size={15} />
                      </button>
                      <button className="hover:text-brand-600 p-1">
                        <Mail size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="text-[11.5px] text-ink-400 px-5 py-4 border-t border-ink-300/15">
          Usage charges are calculated based on actual voice minutes consumed. GST is charged additionally at 18% as per
          applicable Indian tax regulations.
        </p>
      </div>
    </Layout>
  )
}
