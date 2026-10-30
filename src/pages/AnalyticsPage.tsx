import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Users, Target, Globe } from 'lucide-react';
import { RevenueChart, UserGrowthChart, RevenueBarChart, ConversionFunnelChart, GeographicChart, TrafficSourceChart } from '../components/charts';
import { Card, Button, Tabs, TrendBadge } from '../components/ui';
import { revenueData, userGrowthData, trafficSources, conversionFunnel, geographicData } from '../data/mockData';
import { formatCurrency, formatNumber } from '../utils';
import { useApp } from '../contexts/AppContext';

const TIME_RANGE_TABS = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '12m', label: '12 Months' },
];

const SECTION_TABS = [
  { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={14} /> },
  { id: 'users', label: 'Users', icon: <Users size={14} /> },
  { id: 'conversion', label: 'Conversion', icon: <Target size={14} /> },
  { id: 'geographic', label: 'Geographic', icon: <Globe size={14} /> },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [section, setSection] = useState('revenue');
  const [compareMode, setCompareMode] = useState(false);
  const { addToast } = useApp();

  const summaryMetrics = [
    { label: 'Total Revenue', value: formatCurrency(168900), change: 12.9 },
    { label: 'Avg Revenue/User', value: '$43.95', change: 8.4 },
    { label: 'Revenue Growth', value: '+12.9%', change: 2.3 },
    { label: 'Churn Rate', value: '0.83%', change: -0.12 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Analyze your business performance in detail</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs tabs={TIME_RANGE_TABS} activeTab={timeRange} onChange={setTimeRange} />
          <Button
            variant={compareMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setCompareMode(v => !v)}
          >
            Compare
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => addToast({ type: 'success', title: 'Report exported', description: 'Analytics data downloaded as CSV' })}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card>
              <p className="text-xs text-gray-500 font-medium mb-2">{m.label}</p>
              <p className="text-2xl font-bold text-white mb-1">{m.value}</p>
              <TrendBadge value={m.change} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Tabs tabs={SECTION_TABS} activeTab={section} onChange={setSection} />
      </div>

      {/* Revenue Section */}
      {section === 'revenue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-white">Revenue Trend</h2>
                  <span className="text-xs text-gray-500">Area chart</span>
                </div>
                <RevenueChart data={revenueData} showExpenses={compareMode} />
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-white">Period Comparison</h2>
                  <span className="text-xs text-gray-500">Current vs previous</span>
                </div>
                <RevenueBarChart data={revenueData} />
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-white">Revenue Breakdown</h2>
                <span className="text-xs text-gray-500">Monthly detail</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Month', 'Revenue', 'Previous', 'Change', 'Expenses', 'Profit'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {revenueData.map(row => {
                      const change = ((row.revenue - row.previousRevenue) / row.previousRevenue) * 100;
                      return (
                        <tr key={row.month} className="hover:bg-white/2 transition-colors">
                          <td className="py-3 pr-6 font-medium text-gray-200">{row.month}</td>
                          <td className="py-3 pr-6 text-white font-semibold">{formatCurrency(row.revenue)}</td>
                          <td className="py-3 pr-6 text-gray-400">{formatCurrency(row.previousRevenue)}</td>
                          <td className="py-3 pr-6">
                            <TrendBadge value={change} />
                          </td>
                          <td className="py-3 pr-6 text-gray-400">{formatCurrency(row.expenses)}</td>
                          <td className="py-3 pr-6 text-emerald-400 font-semibold">{formatCurrency(row.profit)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Users Section */}
      {section === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <h2 className="text-base font-semibold text-white mb-6">User Growth Trend</h2>
                <UserGrowthChart data={userGrowthData} showChurned={true} />
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card>
                <h2 className="text-base font-semibold text-white mb-4">Traffic Sources</h2>
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <h2 className="text-base font-semibold text-white mb-6">User Growth Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Month', 'New Users', 'Total Users', 'Churned', 'Net Growth', 'Churn Rate'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {userGrowthData.map(row => {
                      const netGrowth = row.newUsers - row.churned;
                      const churnRate = ((row.churned / row.totalUsers) * 100).toFixed(2);
                      return (
                        <tr key={row.month} className="hover:bg-white/2 transition-colors">
                          <td className="py-3 pr-6 font-medium text-gray-200">{row.month}</td>
                          <td className="py-3 pr-6 text-emerald-400 font-semibold">+{formatNumber(row.newUsers)}</td>
                          <td className="py-3 pr-6 text-white">{formatNumber(row.totalUsers)}</td>
                          <td className="py-3 pr-6 text-rose-400">-{formatNumber(row.churned)}</td>
                          <td className="py-3 pr-6">
                            <TrendBadge value={netGrowth} suffix="" />
                          </td>
                          <td className="py-3 pr-6 text-gray-400">{churnRate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Conversion Section */}
      {section === 'conversion' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <h2 className="text-base font-semibold text-white mb-6">Conversion Funnel</h2>
                <ConversionFunnelChart data={conversionFunnel} />
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card>
                <h2 className="text-base font-semibold text-white mb-6">Funnel Breakdown</h2>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, i) => (
                    <div key={stage.stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">{stage.stage}</p>
                          <p className="text-xs text-gray-500">{formatNumber(stage.conversions)} visitors</p>
                        </div>
                      </div>
                      {i > 0 && (
                        <span className="text-sm font-semibold text-violet-400">{stage.rate}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* Geographic Section */}
      {section === 'geographic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <h2 className="text-base font-semibold text-white mb-6">Revenue by Country</h2>
                <GeographicChart data={geographicData} />
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card>
                <h2 className="text-base font-semibold text-white mb-6">Geographic Detail</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/8">
                        {['Country', 'Revenue', 'Users', 'Growth'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/4">
                      {geographicData.map(geo => (
                        <tr key={geo.country} className="hover:bg-white/2 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getFlag(geo.code)}</span>
                              <span className="text-gray-200 font-medium">{geo.country}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-white font-semibold">{formatCurrency(geo.revenue, true)}</td>
                          <td className="py-3 pr-4 text-gray-400">{formatNumber(geo.users)}</td>
                          <td className="py-3 pr-4">
                            <TrendBadge value={geo.growth} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

function getFlag(code: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸', GB: '🇬🇧', IN: '🇮🇳', DE: '🇩🇪', JP: '🇯🇵',
    SG: '🇸🇬', FR: '🇫🇷', CA: '🇨🇦', AU: '🇦🇺', AE: '🇦🇪',
  };
  return flags[code] ?? '🌍';
}
