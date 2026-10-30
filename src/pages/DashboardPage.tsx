import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Plus, RefreshCw, Calendar } from 'lucide-react';
import { MetricCard, DASHBOARD_METRICS } from '../components/dashboard/MetricCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { TopProducts } from '../components/dashboard/TopProducts';
import { RevenueChart, UserGrowthChart, TrafficSourceChart } from '../components/charts';
import { Card, Button, Badge, Tabs } from '../components/ui';
import {
  revenueData, userGrowthData, trafficSources, activityFeed, topProducts, mockTransactions,
} from '../data/mockData';
import { formatCurrency, formatDate, cn } from '../utils';

const DATE_TABS = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'neutral',
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  
  const recentTransactions = mockTransactions.slice(0, 6);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm">Welcome back, have a great day 👋</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs tabs={DATE_TABS} activeTab={dateRange} onChange={setDateRange} className="text-xs" />
          <Button variant="outline" size="sm" icon={<Download size={14} />} className="ml-1">
            Export
          </Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            New Report
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {DASHBOARD_METRICS.map((metric, i) => (
          <MetricCard key={metric.id} data={metric} index={i} />
        ))}
      </div>

      {/* Revenue Chart + Traffic Source */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Revenue Overview</h2>
                <p className="text-sm text-gray-500 mt-0.5">Monthly revenue trends</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartType('area')}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', chartType === 'area' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white')}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', chartType === 'bar' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white')}
                >
                  Bar
                </button>
              </div>
            </div>
            <RevenueChart data={revenueData} showExpenses={false} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Traffic Sources</h2>
                <p className="text-sm text-gray-500 mt-0.5">Acquisition channels</p>
              </div>
            </div>
            <TrafficSourceChart data={trafficSources} />
            <div className="space-y-2 mt-4">
              {trafficSources.map(source => (
                <div key={source.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-gray-400">{source.name}</span>
                  </div>
                  <span className="font-semibold text-gray-200">{source.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Customer Growth + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Customer Growth</h2>
                <p className="text-sm text-gray-500 mt-0.5">Total users over time</p>
              </div>
              <Badge variant="purple" dot>Live</Badge>
            </div>
            <UserGrowthChart data={userGrowthData} showChurned={false} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Activity Feed</h2>
                <p className="text-sm text-gray-500 mt-0.5">Recent events</p>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors" aria-label="Refresh activity">
                <RefreshCw size={14} />
              </button>
            </div>
            <ActivityFeed items={activityFeed} maxItems={5} />
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-3"
        >
          <Card padding="none">
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
                <p className="text-sm text-gray-500 mt-0.5">Latest payment activity</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/transactions'}>View all</Button>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-6">Customer</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/2 transition-colors group">
                      <td className="py-3.5 px-6">
                        <div>
                          <p className="font-medium text-gray-200 group-hover:text-white transition-colors">{tx.customerName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">{tx.description}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-white">{formatCurrency(tx.amount)}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant={STATUS_BADGE[tx.status]} dot size="sm">
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-6 text-gray-500 text-xs">{formatDate(tx.date, 'short')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="xl:col-span-2"
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Top Products</h2>
                <p className="text-sm text-gray-500 mt-0.5">By revenue this month</p>
              </div>
            </div>
            <TopProducts products={topProducts} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
