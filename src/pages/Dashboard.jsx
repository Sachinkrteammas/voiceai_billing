import { useEffect,useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Search, Download, FileDown, ArrowUpDown } from 'lucide-react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import DateFilter from '../components/DateFilter'
import EmptyState from '../components/EmptyState'
import { dailyUsage, botBreakdown, bots, summary, formatINR, formatINRWhole } from '../data/mockData'
import {
  getSummary,
  getDailyUsage,
  getBotBreakdown,
  getDailyBreakdown,
  getCalls,
} from "../services/dashboardApi";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



export default function Dashboard() {
  const [range, setRange] = useState('Today')
  const [customRange, setCustomRange] = useState({ from: '', to: '' })
  const [botFilter, setBotFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('day')
  const [sortAsc, setSortAsc] = useState(true)

  const [summary1, setSummary] = useState({});
    const [dailyUsage1, setDailyUsage] = useState([]);
    const [botBreakdown1, setBotBreakdown] = useState([]);
    const [dailyBreakdown1, setDailyBreakdown] = useState([]);
    const [calls1, setCalls] = useState([]);
    const [loading, setLoading] = useState(false);

const getDateRange = () => {
  const today = new Date();

  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  if (range === "Today") {
    return {
      from: format(today),
      to: format(today),
    };
  }

  if (range === "This Week") {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    return {
      from: format(start),
      to: format(today),
    };
  }

  if (range === "This Month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      from: format(start),
      to: format(today),
    };
  }

  if (
    range === "Custom Range" &&
    customRange.from &&
    customRange.to
  ) {
    return {
      from: customRange.from,
      to: customRange.to,
    };
  }

  return {
    from: format(today),
    to: format(today),
  };
};

const loadDashboard = async () => {
  try {
    setLoading(true);

    const { from, to } = getDateRange();


    const [
      summaryRes,
      usageRes,
      botRes,
      breakdownRes,
      callsRes,
    ] = await Promise.all([
      getSummary(from, to),
      getDailyUsage(from, to),
      getBotBreakdown(from, to),
      getDailyBreakdown(from, to),
      getCalls(from, to),
    ]);

    setSummary(summaryRes.data);
    setDailyUsage(usageRes.data);
    setBotBreakdown(botRes.data);
    setDailyBreakdown(breakdownRes.data);
    setCalls(callsRes.data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    loadDashboard();
}, [range,customRange]);

const rangeLabel = useMemo(() => {
  const { from, to } = getDateRange();

  if (from === to) {
    return from;
  }

  return `${from} - ${to}`;
}, [range, customRange]);

  const filteredByRange = useMemo(() => {
    if (range === 'Today') return dailyUsage1.slice(-1)
    if (range === 'This Week') return dailyUsage1.slice(-7)
    if (range === 'Custom Range') {
      if (!customRange.from || !customRange.to) return []
      return dailyUsage1
    }
    return dailyUsage1
  }, [dailyUsage1, range, customRange])

  const rows = useMemo(() => {
    let data = filteredByRange.filter((r) => (botFilter === 'all' ? true : r.bot === bots.find((b) => b.id === botFilter)?.name))
    if (search) {
      data = data.filter(
        (r) => r.bot.toLowerCase().includes(search.toLowerCase()) || r.date.toLowerCase().includes(search.toLowerCase())
      )
    }
    data = [...data].sort((a, b) => {
      const dir = sortAsc ? 1 : -1
      if (a[sortKey] < b[sortKey]) return -1 * dir
      if (a[sortKey] > b[sortKey]) return 1 * dir
      return 0
    })
    return data
  }, [filteredByRange, botFilter, search, sortKey, sortAsc])

  const totals = rows.reduce(
    (acc, r) => ({
      minutes: acc.minutes + r.minutes,
      usageCost: acc.usageCost + r.usageCost,
      gst: acc.gst + r.gst,
      total: acc.total + r.total
    }),
    { minutes: 0, usageCost: 0, gst: 0, total: 0 }
  )

  const totalUsageCost = filteredByRange.reduce((a, r) => a + r.usageCost, 0)
  const totalGst = filteredByRange.reduce((a, r) => a + r.gst, 0)
  const totalMinutes = filteredByRange.reduce((a, r) => a + r.minutes, 0)

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

const downloadExcel = () => {
  const data = dailyBreakdown1.map((r) => ({
    Date: r.date,
    Bot: r.bot,
    "Minutes Used": r.minutes,
    "Rate/Min": r.rate,
    "Usage Cost": r.usage_cost,
    GST: r.gst,
    "Total Charge": r.total_charge,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Breakdown");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Daily_Breakdown.xlsx");
};

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-ink-900">Dashboard</h1>
          <p className="text-[13.5px] text-ink-400 mt-1">Voice usage &amp; billing — {rangeLabel}</p>
        </div>
        <DateFilter value={range} onChange={setRange} customRange={customRange} onCustomRangeChange={setCustomRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Minutes"
            value={summary1.totalMinutes || 0}
            caption={`Calls`}
          />

          <StatCard
            label="Usage Cost"
            value={formatINR(summary1.usageCost || 0)}
            caption="excl. GST"
          />

          <StatCard
            label="GST (18%)"
            value={formatINR(summary1.gst || 0)}
            caption="IGST applicable"
          />

          <StatCard
            label="Total Charge"
            value={formatINR(summary1.totalCharge || 0)}
            caption="incl. GST"
            captionTone="success"
            highlight
          />
        </div>

{/*       <div className="grid grid-cols-4 gap-4 mb-6"> */}
{/*         <StatCard label="Wallet Balance" value={formatINRWhole(summary.walletBalance)} /> */}
{/*         <StatCard label="Available Minutes" value={summary.availableMinutes.toLocaleString('en-IN')} /> */}
{/*         <StatCard label="This Month Usage" value={`${summary.monthUsageMinutes.toLocaleString('en-IN')} min`} /> */}
{/*         <StatCard */}
{/*           label="Low Balance Threshold" */}
{/*           value={formatINRWhole(summary.lowBalanceThreshold)} */}
{/*           caption="Alert trigger point" */}
{/*         /> */}
{/*       </div> */}

      {/* Chart */}
      <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5 mb-6">
        <h2 className="text-[15px] font-semibold text-ink-900 mb-1">Daily Usage — {rangeLabel}</h2>
        <p className="text-[12.5px] text-ink-400 mb-4">Minutes consumed vs cost generated</p>
        {filteredByRange.length === 0 ? (
          <EmptyState title="No Usage Yet" description="No usage data found for the selected date range." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyUsage1} barGap={4}>
              <CartesianGrid vertical={false} stroke="#EEEFF4" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8E8FA6' }} tickLine={false} axisLine={{ stroke: '#EEEFF4' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8E8FA6' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #EEEFF4' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                verticalAlign="bottom"
                height={30}
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span className="text-[12px] text-ink-500">{v}</span>}
              />
              <Bar dataKey="minutes" name="Minutes Used" fill="#5B4FE8" radius={[3, 3, 0, 0]} maxBarSize={18} />
              <Bar dataKey="usageCost" name="Cost (₹)" fill="#0F9D58" radius={[3, 3, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bot-wise breakdown */}
      <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-5 mb-6">
        <h2 className="text-[15px] font-semibold text-ink-900 mb-4">Bot-wise Breakdown</h2>
        <div className="space-y-4">
          {botBreakdown1.map((bot) => (
            <div key={bot.name}>
              <div className="flex items-center justify-between text-[13px] mb-1.5">
                <span className="font-medium text-ink-700">{bot.name}</span>
                <span className="font-num text-ink-500">
                  {bot.minutes.toLocaleString('en-IN')} min · {formatINRWhole(bot.cost)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-ink-900/[0.05] overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${bot.allocation}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage table */}
      <div className="bg-white border border-ink-300/20 rounded-xl shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-300/15">
          <h2 className="text-[15px] font-semibold text-ink-900">Daily Breakdown</h2>
          <div className="flex items-center gap-2">
{/*             <div className="relative"> */}
{/*               <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" /> */}
{/*               <input */}
{/*                 value={search} */}
{/*                 onChange={(e) => setSearch(e.target.value)} */}
{/*                 placeholder="Search..." */}
{/*                 className="pl-8 pr-3 py-1.5 text-[13px] rounded-lg border border-ink-300/40 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 w-40" */}
{/*               /> */}
{/*             </div> */}
{/*             <select */}
{/*               value={botFilter} */}
{/*               onChange={(e) => setBotFilter(e.target.value)} */}
{/*               className="text-[13px] rounded-lg border border-ink-300/40 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-200" */}
{/*             > */}
{/*               {bots.map((b) => ( */}
{/*                 <option key={b.id} value={b.id}> */}
{/*                   {b.name} */}
{/*                 </option> */}
{/*               ))} */}
{/*             </select> */}
            <button onClick={downloadExcel} className="flex items-center gap-1.5 text-[13px] font-medium border border-ink-300/40 rounded-lg px-3 py-1.5 hover:bg-ink-900/[0.03]">
              <Download size={14} /> CSV
            </button>
            <button className="flex items-center gap-1.5 text-[13px] font-medium border border-ink-300/40 rounded-lg px-3 py-1.5 hover:bg-ink-900/[0.03]">
              <FileDown size={14} /> PDF
            </button>
          </div>
        </div>

        {dailyBreakdown1.length === 0 ? (
          <EmptyState title="No Usage Yet" description="No usage records match your current filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-ink-400 border-b border-ink-300/15">
                  {[
                    ['date', 'Date'],
                    ['bot', 'Bot'],
                    ['minutes', 'Minutes Used'],
                    ['rate', 'Rate/Min'],
                    ['usageCost', 'Usage Cost'],
                    ['gst', 'GST (18%)'],
                    ['total', 'Total Charge']
                  ].map(([key, label]) => (
                    <th key={key} className="px-5 py-3 font-medium">
                      <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-ink-700">
                        {label} <ArrowUpDown size={12} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dailyBreakdown1.map((r, i) => (
                  <tr key={i} className="border-b border-ink-300/10 last:border-0 hover:bg-ink-900/[0.015]">
                    <td className="px-5 py-3 text-ink-700">{r.date}</td>
                    <td className="px-5 py-3">
                      <span className="inline-block bg-brand-50 text-brand-600 text-[11.5px] font-medium px-2 py-0.5 rounded-md">
                        {r.bot}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-num text-ink-700">{r.minutes}</td>
                    <td className="px-5 py-3 font-num text-ink-500">₹{r.rate}/min</td>
                    <td className="px-5 py-3 font-num text-ink-700">{formatINRWhole(r.usage_cost)}</td>
                    <td className="px-5 py-3 font-num text-ink-500">{formatINR(r.gst)}</td>
                    <td className="px-5 py-3 font-num font-semibold text-ink-900">{formatINR(r.total_charge)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-ink-900/[0.02] font-semibold">
                  <td className="px-5 py-3 text-ink-700" colSpan={2}>
                    Total
                  </td>
                  <td className="px-5 py-3 font-num text-ink-900">{summary1.totalMinutes}</td>
                  <td className="px-5 py-3" />
                  <td className="px-5 py-3 font-num text-ink-900">{formatINRWhole(summary1.usageCost)}</td>
                  <td className="px-5 py-3 font-num text-ink-900">{formatINR(summary1.gst)}</td>
                  <td className="px-5 py-3 font-num text-ink-900">{formatINR(summary1.totalCharge)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11.5px] text-ink-400 mt-4 leading-relaxed">
        Usage charges are calculated based on actual voice minutes consumed. GST is charged additionally at 18% as per
        applicable Indian tax regulations. Voice usage data is synced from the integrated calling platform and may have a
        short synchronization delay.
      </p>
    </Layout>
  )
}
