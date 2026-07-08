// ---- Company / account context ----
export const company = {
  name: 'Acme Corp Pvt. Ltd.',
  gstin: '27AAECA1234B1Z5',
  plan: 'Active Plan',
  address: '4th Floor, Cyber Towers, Hitech City, Hyderabad, Telangana 500081',
  email: 'billing@acmecorp.in',
  phone: '+91 98765 43210'
}

export const bots = [
  { id: 'all', name: 'All Bots' },
  { id: 'sales', name: 'SalesBot Pro' },
  { id: 'support', name: 'SupportBot' },
  { id: 'leadgen', name: 'LeadGen AI' }
]

export const ratePerMinute = 4

// ---- Dashboard summary ----
export const summary = {
  walletBalance: 48320,
  availableMinutes: 12080,
  monthUsageMinutes: 2450,
  currentBilling: 9800,
  daysRemaining: 18,
  lowBalanceThreshold: 5000
}

// ---- Daily usage (used by Dashboard chart + table) ----
const botCycle = ['SalesBot Pro', 'SupportBot', 'SalesBot Pro', 'LeadGen AI']
export const dailyUsage = Array.from({ length: 17 }).map((_, i) => {
  const day = i + 1
  const minutes = [120, 95, 160, 85, 210, 130, 175, 100, 190, 165, 220, 150, 260, 205, 175, 140, 190][i]
  const bot = botCycle[i % botCycle.length]
  const usageCost = minutes * ratePerMinute
  const gst = +(usageCost * 0.18).toFixed(2)
  const total = +(usageCost + gst).toFixed(2)
  return {
    date: `${String(day).padStart(2, '0')} Jun 2026`,
    day,
    bot,
    minutes,
    rate: ratePerMinute,
    usageCost,
    gst,
    total
  }
})

// ---- Bot-wise breakdown ----
export const botBreakdown = [
  { name: 'SalesBot Pro', minutes: 1180, cost: 4720, allocation: 55 },
  { name: 'SupportBot', minutes: 690, cost: 2760, allocation: 25 },
  { name: 'LeadGen AI', minutes: 580, cost: 2320, allocation: 20 }
]

// ---- Wallet ----
export const walletSummary = {
  currentBalance: 48320,
  totalRecharged: 85000,
  totalConsumed: 36680,
  availableMinutes: 12080,
  health: 'Healthy', // Healthy | Low | Critical
  healthPercent: 56.8
}

export const walletTransactions = [
  { date: '17 Jun 2026 09:15 AM', type: 'Usage Deduction', ref: 'USG-2026-06-17-001', amount: -896.80, status: 'Completed' },
  { date: '16 Jun 2026 08:42 AM', type: 'Usage Deduction', ref: 'USG-2026-06-16-001', amount: -967.60, status: 'Completed' },
  { date: '15 Jun 2026 11:30 AM', type: 'Recharge', ref: 'RCH-2026-06-15-007', amount: 25000, status: 'Completed' },
  { date: '15 Jun 2026 08:20 AM', type: 'Usage Deduction', ref: 'USG-2026-06-15-001', amount: -1132.80, status: 'Completed' },
  { date: '14 Jun 2026 08:55 AM', type: 'Usage Deduction', ref: 'USG-2026-06-14-001', amount: -1321.60, status: 'Completed' },
  { date: '13 Jun 2026 09:05 AM', type: 'Usage Deduction', ref: 'USG-2026-06-13-001', amount: -1463.20, status: 'Completed' },
  { date: '10 Jun 2026 02:00 PM', type: 'Adjustment', ref: 'ADJ-2026-06-10-001', amount: 500, status: 'Completed' },
  { date: '05 Jun 2026 10:00 AM', type: 'Recharge', ref: 'RCH-2026-06-05-003', amount: 10000, status: 'Completed' },
  { date: '01 Jun 2026 11:00 AM', type: 'Refund', ref: 'REF-2026-06-01-001', amount: 1500, status: 'Completed' }
]

// ---- Recharge ----
export const quickAmounts = [5000, 10000, 25000, 50000, 100000]
export const paymentMethods = [
  { id: 'razorpay', name: 'Razorpay', description: 'Cards, UPI, Netbanking & more', recommended: true, icon: 'Zap' },
  { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex, RuPay', icon: 'CreditCard' },
  { id: 'upi', name: 'UPI', description: 'GPay, PhonePe, BHIM & any UPI app', icon: 'Smartphone' },
  { id: 'bank', name: 'Bank Transfer / NEFT', description: 'NEFT, RTGS, IMPS to our account', icon: 'Landmark' },
  { id: 'manual', name: 'Manual Admin Credit', description: 'Offline payment — contact support', icon: 'ShieldCheck' }
]

// ---- Invoices ----
export const invoices = [
  { id: 'INV-2026-0006', period: '1 Jun – 17 Jun 2026', minutes: 2450, subtotal: 9800, gst: 1764.00, total: 11564.00, status: 'Pending' },
  { id: 'INV-2026-0005', period: '1 May – 31 May 2026', minutes: 6820, subtotal: 27280, gst: 4910.40, total: 32190.40, status: 'Paid' },
  { id: 'INV-2026-0004', period: '1 Apr – 30 Apr 2026', minutes: 5940, subtotal: 23760, gst: 4276.80, total: 28036.80, status: 'Paid' },
  { id: 'INV-2026-0003', period: '1 Mar – 31 Mar 2026', minutes: 4210, subtotal: 16840, gst: 3031.20, total: 19871.20, status: 'Paid' },
  { id: 'INV-2026-0002', period: '1 Feb – 28 Feb 2026', minutes: 3800, subtotal: 15200, gst: 2736.00, total: 17936.00, status: 'Partially Paid' },
  { id: 'INV-2026-0001', period: '1 Jan – 31 Jan 2026', minutes: 3200, subtotal: 12800, gst: 2304.00, total: 15104.00, status: 'Paid' }
]

// ---- Alert settings ----
export const alertSettingsDefault = {
  balanceBelow: 5000,
  minutesBelow: 500,
  email: true,
  sms: false,
  whatsapp: true,
  emailAddress: company.email,
  mobile: company.phone
}

// ---- helpers ----
export const formatINR = (value) =>
  '₹' + Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatINRWhole = (value) => '₹' + Number(value).toLocaleString('en-IN')
