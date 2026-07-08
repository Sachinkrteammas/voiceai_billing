import { useState } from 'react'
import { Bell, Save, CheckCircle2 } from 'lucide-react'
import Layout from '../components/Layout'
import { alertSettingsDefault } from '../data/mockData'

const balancePresets = [2000, 5000, 10000, 20000]

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${
      checked ? 'bg-brand-500' : 'bg-ink-300/50'
    }`}
  >
    <span
      className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
        checked ? 'translate-x-[21px]' : 'translate-x-[3px]'
      }`}
    />
  </button>
)

export default function Settings() {
  const [settings, setSettings] = useState(alertSettingsDefault)
  const [saved, setSaved] = useState(false)

  const update = (patch) => {
    setSettings((s) => ({ ...s, ...patch }))
    setSaved(false)
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink-900">Settings</h1>
        <p className="text-[13.5px] text-ink-400 mt-1">Configure low balance alerts and notification preferences</p>
      </div>

      <div className="max-w-5xl space-y-5">
        <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
              <Bell size={16} className="text-warning" />
            </div>
            <div>
              <h2 className="text-[14.5px] font-semibold text-ink-900">Low Balance Alert System</h2>
              <p className="text-[12px] text-ink-400">Get notified before your wallet runs low</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-[12.5px] font-medium text-ink-500">Alert when Balance Below</label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 font-num text-[13px]">₹</span>
                <input
                  type="number"
                  value={settings.balanceBelow}
                  onChange={(e) => update({ balanceBelow: Number(e.target.value) })}
                  className="w-full rounded-lg border border-ink-300/40 pl-7 pr-3 py-2.5 text-[13.5px] font-num focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <p className="text-[11.5px] text-ink-400 mt-1">Current: ₹{settings.balanceBelow.toLocaleString('en-IN')} remaining</p>
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-ink-500">Alert when Minutes Below</label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  value={settings.minutesBelow}
                  onChange={(e) => update({ minutesBelow: Number(e.target.value) })}
                  className="w-full rounded-lg border border-ink-300/40 pl-3 pr-10 py-2.5 text-[13.5px] font-num focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-[12px]">min</span>
              </div>
              <p className="text-[11.5px] text-ink-400 mt-1">Current: {settings.minutesBelow} minutes remaining</p>
            </div>
            <div>
              <label className="text-[12.5px] font-medium text-ink-500">Quick Presets — Balance</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {balancePresets.map((p) => (
                  <button
                    key={p}
                    onClick={() => update({ balanceBelow: p })}
                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${
                      settings.balanceBelow === p
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'border-ink-300/40 text-ink-700 hover:bg-ink-900/[0.03]'
                    }`}
                  >
                    ₹{p.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 items-start">
          <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-6">
            <h2 className="text-[14.5px] font-semibold text-ink-900 mb-4">Notification Channels</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-ink-300/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 text-[13px]">✉</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-medium text-ink-900">Email Alerts</span>
                      <span className="text-[10.5px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[12px] text-ink-400 mt-0.5">Receive alerts on your registered email address</p>
                  </div>
                </div>
                <Toggle checked={settings.email} onChange={(v) => update({ email: v })} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-ink-300/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ink-900/[0.04] flex items-center justify-center text-ink-600 text-[13px]">📱</div>
                  <div>
                    <span className="text-[13.5px] font-medium text-ink-900">SMS Alerts</span>
                    <p className="text-[12px] text-ink-400 mt-0.5">Receive alerts via SMS on your mobile number</p>
                  </div>
                </div>
                <Toggle checked={settings.sms} onChange={(v) => update({ sms: v })} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-ink-300/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 text-[13px]">💬</div>
                  <div>
                    <span className="text-[13.5px] font-medium text-ink-900">WhatsApp Alerts</span>
                    <p className="text-[12px] text-ink-400 mt-0.5">Receive alerts on WhatsApp</p>
                  </div>
                </div>
                <Toggle checked={settings.whatsapp} onChange={(v) => update({ whatsapp: v })} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-6">
            <h2 className="text-[14.5px] font-semibold text-ink-900 mb-4">Contact Details</h2>
            <div className="space-y-5">
              <div>
                <label className="text-[12.5px] font-medium text-ink-500">Email Address</label>
                <input
                  type="email"
                  value={settings.emailAddress}
                  onChange={(e) => update({ emailAddress: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-[12.5px] font-medium text-ink-500">Mobile Number</label>
                <input
                  type="text"
                  value={settings.mobile}
                  onChange={(e) => update({ mobile: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-[13.5px] font-num focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(true)}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-[13.5px] font-medium rounded-lg px-5 py-2.5 transition-colors"
          >
            <Save size={15} /> Save Settings
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-[13px] text-success font-medium">
              <CheckCircle2 size={15} /> Alert Updated
            </span>
          )}
        </div>
      </div>
    </Layout>
  )
}
