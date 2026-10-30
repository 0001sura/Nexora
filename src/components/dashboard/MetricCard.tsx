import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, UserPlus } from 'lucide-react';
import { cn, formatCurrency, formatNumber, formatPercentage, calculatePercentageChange } from '../../utils';
import { Card, Skeleton, TrendBadge } from '../ui';

export interface MetricCardData {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage';
  iconName: 'dollar' | 'users' | 'target' | 'userplus';
  description?: string;
}

const ICONS = {
  dollar: DollarSign,
  users: Users,
  target: Target,
  userplus: UserPlus,
};

const ICON_STYLES = {
  dollar: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  users: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  target: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  userplus: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

function formatValue(value: number, format: MetricCardData['format']): string {
  if (format === 'currency') return formatCurrency(value, true);
  if (format === 'percentage') return `${value.toFixed(1)}%`;
  return formatNumber(value, true);
}

interface MetricCardProps {
  data: MetricCardData;
  index?: number;
  loading?: boolean;
}

export function MetricCard({ data, index = 0, loading = false }: MetricCardProps) {
  const change = calculatePercentageChange(data.value, data.previousValue);
  const isPositive = change >= 0;
  const Icon = ICONS[data.iconName];

  if (loading) {
    return (
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-20 h-4" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Card className="group hover:border-white/15 hover:bg-white/6 transition-all duration-300 cursor-default">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{data.label}</p>
            </div>
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform duration-300 group-hover:scale-110', ICON_STYLES[data.iconName])}>
              <Icon size={18} />
            </div>
          </div>

          {/* Value */}
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {formatValue(data.value, data.format)}
            </div>
            {data.description && (
              <p className="text-xs text-gray-500 mt-1">{data.description}</p>
            )}
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2">
            <TrendBadge value={change} />
            <span className="text-xs text-gray-500">vs last period</span>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100',
          isPositive ? 'bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-500/50 to-transparent'
        )} />
      </Card>
    </motion.div>
  );
}

export const DASHBOARD_METRICS: MetricCardData[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: 168900,
    previousValue: 149600,
    format: 'currency',
    iconName: 'dollar',
    description: 'This month',
  },
  {
    id: 'users',
    label: 'Active Users',
    value: 3842,
    previousValue: 3511,
    format: 'number',
    iconName: 'users',
    description: 'Monthly active',
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: 4.82,
    previousValue: 4.31,
    format: 'percentage',
    iconName: 'target',
    description: 'Trial to paid',
  },
  {
    id: 'acquisition',
    label: 'New Customers',
    value: 358,
    previousValue: 334,
    format: 'number',
    iconName: 'userplus',
    description: 'This month',
  },
];
