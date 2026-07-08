import { useMemo, useState } from 'react'
import { Zap, CreditCard, Smartphone, Landmark, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { quickAmounts, paymentMethods, ratePerMinute, formatINR, formatINRWhole } from '../data/mockData'

const icons = { Zap, CreditCard, Smartphone, Landmark, ShieldCheck }

export default function Recharge() {
  const [amount, setAmount] = useState(10000)
  const [method, setMethod] = useState('razorpay')
  const [success, setSuccess] = useState(false)

  const gst = useMemo(() => +(amount * 0.18).toFixed(2), [amount])
  const total = amount + gst
  const estimatedMinutes = Math.floor(amount / ratePerMinute)

  if (success) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-24 text-center bg-white border border-ink-300/20 rounded-xl shadow-card p-10">
          <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={26} className="text-success" strokeWidth={2} />
          </div>
          <h2 className="text-[18px] font-semibold text-ink-900">Recharge Successful</h2>
          <p className="text-[13.5px] text-ink-500 mt-2">
            {formatINRWhole(amount)} added to your wallet. {estimatedMinutes.toLocaleString('en-IN')} minutes credited.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 w-full bg-brand-500 hover:bg-brand-600 text-white text-[13.5px] font-medium rounded-lg py-2.5 transition-colors"
          >
            Make Another Recharge
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink-900">Recharge Wallet</h1>
        <p className="text-[13.5px] text-ink-400 mt-1">Add funds to your voice AI wallet</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5">
            <h2 className="text-[15px] font-semibold text-ink-900 mb-4">Select Recharge Amount</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`px-4 py-2 rounded-lg text-[13.5px] font-medium border transition-colors ${
                    amount === a
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-ink-300/40 text-ink-700 hover:bg-ink-900/[0.03]'
                  }`}
                >
                  ₹{a.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 font-num text-[14px]">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-ink-300/40 pl-7 pr-4 py-3 text-[15px] font-num font-medium focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
          </div>

          <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5">
            <h2 className="text-[15px] font-semibold text-ink-900 mb-4">Payment Method</h2>
            <div className="space-y-2.5">
              {paymentMethods.map((m) => {
                const Icon = icons[m.icon]
                const active = method === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                      active ? 'border-brand-400 bg-brand-50/60' : 'border-ink-300/25 hover:bg-ink-900/[0.02]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-ink-900/[0.04] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-ink-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-ink-900">{m.name}</span>
                        {m.recommended && (
                          <span className="text-[10.5px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-ink-400 mt-0.5">{m.description}</p>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active ? 'border-brand-500' : 'border-ink-300/60'
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5">
            <h2 className="text-[15px] font-semibold text-ink-900 mb-4">Summary</h2>
            <div className="space-y-2.5 text-[13.5px]">
              <div className="flex justify-between">
                <span className="text-ink-500">Recharge Amount</span>
                <span className="font-num text-ink-900">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">GST (18%)</span>
                <span className="font-num text-ink-900">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-ink-300/20 my-1" />
              <div className="flex justify-between text-[14.5px] font-semibold">
                <span className="text-ink-900">Total Payable</span>
                <span className="font-num text-ink-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-ink-900/[0.03] p-3.5">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink-500 mb-1">
                <Zap size={13} className="text-brand-500" />
                Estimated Minutes
              </div>
              <p className="text-[20px] font-num font-semibold text-brand-600">
                {estimatedMinutes.toLocaleString('en-IN')}
              </p>
              <p className="text-[11.5px] text-ink-400">at ₹{ratePerMinute} per minute</p>
            </div>

            <button
              onClick={() => setSuccess(true)}
              disabled={amount <= 0}
              className="mt-4 w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13.5px] font-medium rounded-lg py-3 transition-colors"
            >
              Recharge Wallet ₹{total.toLocaleString('en-IN')}
            </button>
            <p className="text-center text-[11px] text-ink-400 mt-2">Secured payment · Instant credit</p>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/20 p-3.5">
            <ShieldAlert size={15} className="text-warning shrink-0 mt-0.5" />
            <p className="text-[12px] text-ink-600 leading-relaxed">
              Recharge amounts are non-refundable unless otherwise specified in the service agreement.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
