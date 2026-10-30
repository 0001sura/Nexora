# nexora-analytics-dashboard

**Nexora** is a premium SaaS analytics dashboard built as a production-quality frontend application. Monitor revenue, customers, sales performance, conversions, and business growth with a beautifully designed interface.

![Nexora Analytics Dashboard](./preview.png)

---

## ✨ Features

### Pages & Functionality
- **Overview Dashboard** — KPI metrics, revenue charts, customer growth, traffic sources, recent transactions, activity feed, top products
- **Analytics** — Detailed revenue trends, user acquisition, conversion funnel, geographic breakdown with period comparison
- **Customers** — Full CRUD table with search, sort, filter, pagination, customer detail panel, and form validation
- **Transactions** — Transaction table with status indicators, detail modal, CSV export
- **Reports** — Date-range filtered reports, selectable metrics, revenue tables, printable layout, CSV download
- **Settings** — Profile form, theme switching (dark/light), notification preferences, dashboard customization — all persisted

### Technical Highlights
- 🎨 Premium dark UI with violet accent, glassmorphism, subtle gradients
- ⚡ Smooth page transitions and micro-animations (Framer Motion)
- 📊 Interactive charts (Recharts) — area, line, bar, donut, funnel
- 🔍 Real-time search with debouncing
- ✅ Form validation with React Hook Form + Zod
- 💾 Persistent settings via localStorage
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible: semantic HTML, ARIA attributes, keyboard navigation
- 🖨️ Print-friendly report layout
- 📥 CSV export for transactions and reports
- 🔔 Toast notification system
- ⚠️ Confirmation dialogs for destructive actions

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 7 | Type safety |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animations |
| Recharts | 2 | Data visualization |
| React Router | 7 | Client-side routing |
| React Hook Form | 7 | Form handling |
| Zod | 3 | Schema validation |
| Lucide React | — | Icons |
| date-fns | 4 | Date formatting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexora-analytics-dashboard.git
cd nexora-analytics-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production bundle will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite — click **Deploy**

For client-side routing support, create a `vercel.json` in the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

Create a `_redirects` file in the `public/` folder:
```
/*  /index.html  200
```

### Manual Deployment (any static host)

```bash
npm run build
# Upload the `dist/` folder to your hosting service
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # AppShell, Sidebar, TopNav
│   ├── charts/       # All Recharts chart components
│   ├── dashboard/    # MetricCard, ActivityFeed, TopProducts
│   └── ui/           # Button, Badge, Modal, Toast, etc.
├── pages/
│   ├── DashboardPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── CustomersPage.tsx
│   ├── TransactionsPage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── contexts/         # AppContext (settings + toasts)
├── hooks/            # useLocalStorage, useDebounce, usePagination, etc.
├── data/             # mockData.ts (customers, transactions, metrics)
├── types/            # TypeScript interfaces
├── utils/            # Formatting, CSV export, utilities
└── styles/           # Global CSS
```

---

## ⚙️ Environment Variables

This project has no required environment variables — it uses local mock data.

For connecting to a real backend, you would add:

```env
VITE_API_URL=https://your-api.com
VITE_API_KEY=your_api_key
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## ⚠️ Disclaimer

This is a **frontend demonstration** with realistic mock data. No real payment processors, live analytics APIs, or remote databases are connected. All data is generated locally and resets between sessions (except localStorage settings).
