import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Calendar, BarChart2, DollarSign, Users, Target } from 'lucide-react';
import { RevenueChart, UserGrowthChart, RevenueBarChart } from '../components/charts';
import { Card, Button, Tabs, TrendBadge } from '../components/ui';
import { revenueData, userGrowthData, mockTransactions, mockCustomers } from '../data/mockData';
import { formatCurrency, formatNumber, formatDate, exportToCSV, cn } from '../utils';
import { useApp } from '../contexts/AppContext';

const DATE_RANGES = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

const METRIC_OPTIONS = [
  { id: 'revenue', label: 'Revenue', icon: <DollarSign size={14} /> },
  { id: 'users', label: 'Users', icon: <Users size={14} /> },
  { id: 'conversions', label: 'Conversions', icon: <Target size={14} /> },
];

export default function ReportsPage() {
  const { addToast } = useApp();
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'users']);

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const summaryData = [
    { label: 'Total Revenue', value: formatCurrency(168900), change: 12.9, icon: <DollarSign size={18} />, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { label: 'New Customers', value: '358', change: 7.2, icon: <Users size={18} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Conversion Rate', value: '4.82%', change: 11.8, icon: <Target size={18} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Avg Order Value', value: '$1,248', change: 5.4, icon: <BarChart2 size={18} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ];

  const handleExportCSV = () => {
    const reportData = revenueData.map(row => ({
      month: row.month,
      revenue: row.revenue,
      previous_revenue: row.previousRevenue,
      change_pct: (((row.revenue - row.previousRevenue) / row.previousRevenue) * 100).toFixed(1),
      expenses: row.expenses,
      profit: row.profit,
    }));
    exportToCSV(reportData as Record<string, unknown>[], 'nexora-revenue-report');
    addToast({ type: 'success', title: 'Report exported', description: 'Revenue report downloaded as CSV' });
  };

  const handlePrint = () => {
    window.print();
    addToast({ type: 'info', title: 'Print dialog opened', description: 'Use your browser\'s print function' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 print:hidden">Generate and download business reports</p>
        </div>
        <div className="flex items-center gap-2 print:hidden flex-wrap">
          <Tabs tabs={DATE_RANGES} activeTab={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={handlePrint}>Print</Button>
          <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>

      {/* Metric Selector */}
      <Card padding="sm" className="print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Include in report:</span>
          {METRIC_OPTIONS.map(metric => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                selectedMetrics.includes(metric.id)
                  ? 'bg-violet-600/20 text-violet-300 border-violet-500/30'
                  : 'text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
              )}
            >
              {metric.icon}
              {metric.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0', item.color)}>
                  {item.icon}
                </div>
                <TrendBadge value={item.change} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {selectedMetrics.includes('revenue') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white">Revenue Trend</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Monthly performance</p>
                </div>
                <span className="text-xs text-gray-500">{dateRange}</span>
              </div>
              <RevenueChart data={revenueData} showExpenses />
            </Card>
          </motion.div>
        )}
        {selectedMetrics.includes('users') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white">User Acquisition</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Growth by month</p>
                </div>
                <span className="text-xs text-gray-500">{dateRange}</span>
              </div>
              <UserGrowthChart data={userGrowthData} showChurned />
            </Card>
          </motion.div>
        )}
        {selectedMetrics.includes('conversions') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="xl:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-white">Revenue Comparison</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Current vs previous period</p>
                </div>
              </div>
              <RevenueBarChart data={revenueData} />
            </Card>
          </motion.div>
        )}
      </div>

      {/* Monthly Summary Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Monthly Revenue Report</h2>
          <Button variant="ghost" size="sm" icon={<Download size={14} />} onClick={handleExportCSV} className="print:hidden">
            Download
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Month', 'Revenue', 'Previous', 'Change', 'Expenses', 'Profit', 'Margin'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {revenueData.map(row => {
                const change = ((row.revenue - row.previousRevenue) / row.previousRevenue) * 100;
                const margin = ((row.profit / row.revenue) * 100).toFixed(1);
                return (
                  <tr key={row.month} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-6 font-semibold text-gray-200">{row.month}</td>
                    <td className="py-3 pr-6 text-white font-bold">{formatCurrency(row.revenue)}</td>
                    <td className="py-3 pr-6 text-gray-400">{formatCurrency(row.previousRevenue)}</td>
                    <td className="py-3 pr-6"><TrendBadge value={change} /></td>
                    <td className="py-3 pr-6 text-rose-400">{formatCurrency(row.expenses)}</td>
                    <td className="py-3 pr-6 text-emerald-400 font-semibold">{formatCurrency(row.profit)}</td>
                    <td className="py-3 pr-6 text-violet-400 font-semibold">{margin}%</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-white/15 font-bold">
                <td className="py-3 pr-6 text-white">Totals</td>
                <td className="py-3 pr-6 text-white">{formatCurrency(revenueData.reduce((s, r) => s + r.revenue, 0))}</td>
                <td className="py-3 pr-6 text-gray-400">{formatCurrency(revenueData.reduce((s, r) => s + r.previousRevenue, 0))}</td>
                <td className="py-3 pr-6"><TrendBadge value={12.9} /></td>
                <td className="py-3 pr-6 text-rose-400">{formatCurrency(revenueData.reduce((s, r) => s + r.expenses, 0))}</td>
                <td className="py-3 pr-6 text-emerald-400">{formatCurrency(revenueData.reduce((s, r) => s + r.profit, 0))}</td>
                <td className="py-3 pr-6 text-violet-400">58.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Transactions Summary */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Transaction Summary</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-gray-400">Completed: {mockTransactions.filter(t => t.status === 'completed').length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-gray-400">Pending: {mockTransactions.filter(t => t.status === 'pending').length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-rose-400 rounded-full" />
              <span className="text-gray-400">Failed: {mockTransactions.filter(t => t.status === 'failed').length}</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Customer', 'Amount', 'Status', 'Type', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {mockTransactions.slice(0, 8).map(tx => (
                <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-6">
                    <p className="font-medium text-gray-200">{tx.customerName}</p>
                    <p className="text-xs text-gray-500">{tx.customerEmail}</p>
                  </td>
                  <td className="py-3 pr-6 font-bold text-white">{formatCurrency(tx.amount)}</td>
                  <td className="py-3 pr-6">
                    <span className={cn('text-xs font-semibold capitalize',
                      tx.status === 'completed' ? 'text-emerald-400' :
                      tx.status === 'pending' ? 'text-amber-400' :
                      tx.status === 'failed' ? 'text-rose-400' : 'text-gray-400'
                    )}>● {tx.status}</span>
                  </td>
                  <td className="py-3 pr-6 text-gray-400 capitalize text-xs">{tx.type}</td>
                  <td className="py-3 pr-6 text-gray-400 text-xs">{formatDate(tx.date, 'medium')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
