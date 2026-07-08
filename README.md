# Voice AI Billing & Wallet Dashboard

A frontend-only React project for an enterprise Voice AI billing portal — wallet balance,
usage consumption, recharge, GST invoices and alert settings. Built with mock data only
(no backend); wire it up to your real APIs by replacing `src/data/mockData.js`.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Recharts (usage trend chart)
- lucide-react (icons)

## Pages

- **Dashboard** — KPI cards, usage trend chart (Today / This Week / This Month / Custom
  Range), bot-wise breakdown, sortable/searchable usage table with CSV/PDF export buttons
- **Wallet** — balance hero card, wallet health indicator, full transaction history
- **Recharge** — quick-select amounts, 5 payment methods, live GST summary, success state
- **Invoices** — invoice list + full GST tax invoice detail view (Download/Email/Print)
- **Settings** — low balance/minutes thresholds, Email/SMS/WhatsApp alert toggles

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Notes

- All data in `src/data/mockData.js` is sample data — swap it for real API calls.
- The CSV/PDF export and download buttons are UI-only placeholders; wire them to your
  backend or a client-side export library (e.g. `papaparse`, `jspdf`) as needed.
