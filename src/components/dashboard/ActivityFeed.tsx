import { motion } from 'framer-motion';
import { UserPlus, CreditCard, TrendingUp, CheckCircle, RefreshCw, Download } from 'lucide-react';
import type { ActivityItem } from '../../types';
import { formatRelativeTime, cn } from '../../utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  UserPlus: <UserPlus size={14} />,
  CreditCard: <CreditCard size={14} />,
  TrendingUp: <TrendingUp size={14} />,
  CheckCircle: <CheckCircle size={14} />,
  RefreshCw: <RefreshCw size={14} />,
  Download: <Download size={14} />,
};

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({ items, maxItems = 6 }: ActivityFeedProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-white/6" />
      
      <div className="space-y-0">
        {displayItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="relative flex items-start gap-4 pb-5 last:pb-0 group"
          >
            {/* Icon */}
            <div className={cn(
              'relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-200 group-hover:scale-110',
              'bg-[#0d0d1a] border-white/10',
              item.color
            )}>
              {ICON_MAP[item.icon]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
