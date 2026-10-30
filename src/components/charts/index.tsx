import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatCurrency, formatNumber } from '../../utils';
import type { RevenueDataPoint, UserGrowthDataPoint, TrafficSource, FunnelStage, GeographicData } from '../../types';

// ============================================================
// Custom Tooltip — plain props interface avoids recharts TS issues
// ============================================================
interface TooltipEntry {
  color?: string;
  name?: string | number;
  value?: string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  formatter?: (value: number, name: string) => string;
}

function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-[#1a1a2e] p-3 shadow-2xl text-xs">
      {label != null && <p className="text-gray-400 font-medium mb-2">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400">{String(entry.name ?? '')}:</span>
          <span className="text-white font-semibold">
            {formatter
              ? formatter(Number(entry.value ?? 0), String(entry.name ?? ''))
              : String(entry.value ?? '')}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Revenue Chart
// ============================================================
interface RevenueChartProps {
  data: RevenueDataPoint[];
  showExpenses?: boolean;
}

export function RevenueChart({ data, showExpenses = false }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v: number | string) => formatCurrency(Number(v), true)} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
        <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, stroke: '#6366f1', strokeWidth: 2, fill: '#1a1a2e' }} />
        {showExpenses && <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4, stroke: '#f43f5e', strokeWidth: 2, fill: '#1a1a2e' }} />}
        {showExpenses && <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} fill="url(#profitGrad)" dot={false} activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#1a1a2e' }} />}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// User Growth Chart
// ============================================================
interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
  showChurned?: boolean;
}

export function UserGrowthChart({ data, showChurned = false }: UserGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="totalUsersGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
        <Tooltip content={<CustomTooltip formatter={(v) => formatNumber(v)} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
        <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: '#1a1a2e' }} />
        <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#22d3ee" strokeWidth={2} strokeDasharray="4 2" dot={false} activeDot={{ r: 4, stroke: '#22d3ee', strokeWidth: 2, fill: '#1a1a2e' }} />
        {showChurned && <Line type="monotone" dataKey="churned" name="Churned" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="3 3" dot={false} activeDot={{ r: 3, stroke: '#f43f5e', strokeWidth: 2, fill: '#1a1a2e' }} />}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Traffic Source Donut Chart
// ============================================================
interface TrafficChartProps {
  data: TrafficSource[];
}

export function TrafficSourceChart({ data }: TrafficChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0];
            return (
              <div className="rounded-xl border border-white/15 bg-[#1a1a2e] p-3 shadow-2xl text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Bar Chart (Revenue Comparison)
// ============================================================
interface RevenueBarChartProps {
  data: RevenueDataPoint[];
}

export function RevenueBarChart({ data }: RevenueBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v: number | string) => formatCurrency(Number(v), true)} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
        <Tooltip content={<CustomTooltip formatter={(v) => formatCurrency(v)} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
        <Bar dataKey="revenue" name="Current Period" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="previousRevenue" name="Previous Period" fill="rgba(99,102,241,0.25)" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Funnel Chart
// ============================================================
interface ConversionFunnelProps {
  data: FunnelStage[];
}

export function ConversionFunnelChart({ data }: ConversionFunnelProps) {
  const maxValue = data[0]?.visitors ?? 1;
  
  return (
    <div className="space-y-2">
      {data.map((stage, i) => {
        const width = (stage.conversions / maxValue) * 100;
        const colors = ['#6366f1', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'];
        
        return (
          <div key={stage.stage} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">{stage.stage}</span>
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold">{formatNumber(stage.conversions)}</span>
                {i > 0 && <span className="text-gray-500">{stage.rate}%</span>}
              </div>
            </div>
            <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center px-3"
                style={{ width: `${width}%`, backgroundColor: colors[i] + '33', borderLeft: `3px solid ${colors[i]}` }}
              >
                <span className="text-xs font-medium text-white/80 truncate">{stage.stage}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Geographic Bar Chart
// ============================================================
interface GeoChartProps {
  data: GeographicData[];
}

export function GeographicChart({ data }: GeoChartProps) {
  return (
    <div className="space-y-3">
      {data.slice(0, 8).map((item, i) => {
        const maxRevenue = data[0].revenue;
        const width = (item.revenue / maxRevenue) * 100;
        
        return (
          <div key={item.country} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-4 font-medium">{i + 1}</span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium">{item.country}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{formatCurrency(item.revenue, true)}</span>
                  <span className={item.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
