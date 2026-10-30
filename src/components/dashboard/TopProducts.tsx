import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency, formatPercentage, cn } from '../../utils';

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const maxRevenue = products[0]?.revenue ?? 1;

  return (
    <div className="space-y-4">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="group"
        >
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-xs text-gray-600 font-mono w-4">{i + 1}</span>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{product.name}</p>
                <p className="text-xs text-gray-500">{product.units} units · {product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{formatCurrency(product.revenue, true)}</p>
                <span className={cn('text-xs font-semibold', product.growth >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {product.growth >= 0 ? '+' : ''}{product.growth}%
                </span>
              </div>
            </div>
          </div>
          <div className="ml-7 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
