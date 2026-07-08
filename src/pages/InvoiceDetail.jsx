import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Mail, Printer, Waves } from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { invoices, company, ratePerMinute, formatINR } from '../data/mockData'

export default function InvoiceDetail() {
  const { id } = useParams()
  const invoice = invoices.find((i) => i.id === id) || invoices[0]

  return (
    <Layout>
      <Link to="/invoices" className="inline-flex items-center gap-1.5 text-[13px] text-ink-500 hover:text-ink-900 mb-4">
        <ArrowLeft size={15} /> Back to Invoices
      </Link>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-ink-900">{invoice.id}</h1>
          <p className="text-[13px] text-ink-400 mt-0.5">{invoice.period}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[13px] font-medium border border-ink-300/40 rounded-lg px-3.5 py-2 hover:bg-ink-900/[0.03]">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-1.5 text-[13px] font-medium border border-ink-300/40 rounded-lg px-3.5 py-2 hover:bg-ink-900/[0.03]">
            <Mail size={14} /> Email Invoice
          </button>
          <button className="flex items-center gap-1.5 text-[13px] font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-3.5 py-2">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-10 max-w-4xl">
        <div className="flex items-start justify-between pb-8 border-b border-ink-300/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <Waves size={18} strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-ink-900">VoiceAI Technologies Pvt. Ltd.</p>
              <p className="text-[12px] text-ink-400">GSTIN: 29VATPL5678C1ZQ</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-semibold text-ink-900 tracking-wide">TAX INVOICE</p>
            <div className="mt-2">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 border-b border-ink-300/15">
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-2">From</p>
            <p className="text-[13.5px] font-medium text-ink-900">VoiceAI Technologies Pvt. Ltd.</p>
            <p className="text-[13px] text-ink-500 mt-1 leading-relaxed">
              Level 6, Prestige Tech Park, Bengaluru, Karnataka 560103
            </p>
            <p className="text-[13px] text-ink-500 mt-1 font-num">GSTIN: 29VATPL5678C1ZQ</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-2">Bill To</p>
            <p className="text-[13.5px] font-medium text-ink-900">{company.name}</p>
            <p className="text-[13px] text-ink-500 mt-1 leading-relaxed">{company.address}</p>
            <p className="text-[13px] text-ink-500 mt-1 font-num">GSTIN: {company.gstin}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 py-6 border-b border-ink-300/15">
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Invoice Number</p>
            <p className="text-[13.5px] font-num font-medium text-ink-900 mt-1">{invoice.id}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Invoice Date</p>
            <p className="text-[13.5px] font-num font-medium text-ink-900 mt-1">01 Jul 2026</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Billing Period</p>
            <p className="text-[13.5px] font-num font-medium text-ink-900 mt-1">{invoice.period}</p>
          </div>
        </div>

        <div className="py-6 border-b border-ink-300/15">
          <p className="text-[13px] font-semibold text-ink-900 mb-3">Usage Summary</p>
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-ink-400 border-b border-ink-300/15">
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium text-right">Minutes Used</th>
                <th className="py-2 font-medium text-right">Rate/Min</th>
                <th className="py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-300/10">
                <td className="py-3 text-ink-700">Voice AI usage charges</td>
                <td className="py-3 text-right font-num text-ink-700">{invoice.minutes.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right font-num text-ink-700">₹{ratePerMinute}</td>
                <td className="py-3 text-right font-num text-ink-700">{formatINR(invoice.subtotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end py-6">
          <div className="w-72 space-y-2.5">
            <div className="flex justify-between text-[13.5px]">
              <span className="text-ink-500">Subtotal</span>
              <span className="font-num text-ink-900">{formatINR(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13.5px]">
              <span className="text-ink-500">GST @ 18%</span>
              <span className="font-num text-ink-900">{formatINR(invoice.gst)}</span>
            </div>
            <div className="h-px bg-ink-300/20" />
            <div className="flex justify-between text-[16px] font-semibold">
              <span className="text-ink-900">Grand Total</span>
              <span className="font-num text-brand-600">{formatINR(invoice.total)}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-ink-300/15 flex items-center justify-between">
          <p className="text-[11.5px] text-ink-400 max-w-md leading-relaxed">
            Usage charges are calculated based on actual voice minutes consumed. GST is charged additionally at 18% as per
            applicable Indian tax regulations.
          </p>
          <div className="text-right">
            <p className="text-[11px] text-ink-400">Payment Status</p>
            <div className="mt-1">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
