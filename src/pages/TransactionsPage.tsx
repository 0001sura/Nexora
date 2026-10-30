import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { mockTransactions } from '../data/mockData';
import type { Transaction, TransactionStatus } from '../types';
import { Card, Badge, Button, Modal, EmptyState } from '../components/ui';
import { formatCurrency, formatDate, cn, exportToCSV } from '../utils';
import { useApp } from '../contexts/AppContext';
import { useDebounce, usePagination } from '../hooks';

const STATUS_BADGE: Record<TransactionStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'neutral',
};

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<keyof Transaction>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = mockTransactions;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(t =>
        t.customerName.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (typeFilter !== 'all') result = result.filter(t => t.type === typeFilter);
    result = [...result].sort((a, b) => {
      const va = a[sortKey] as string | number;
      const vb = b[sortKey] as string | number;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [debouncedSearch, statusFilter, typeFilter, sortKey, sortDir]);

  const { page, totalPages, paginatedItems, goToPage, nextPage, prevPage, hasNext, hasPrev } = usePagination(filtered, PAGE_SIZE);

  const handleSort = (key: keyof Transaction) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ col }: { col: keyof Transaction }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-600" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-violet-400" /> : <ChevronDown size={12} className="text-violet-400" />;
  };

  const handleExport = () => {
    const data = filtered.map(t => ({
      id: t.id,
      customer: t.customerName,
      email: t.customerEmail,
      amount: t.amount,
      status: t.status,
      type: t.type,
      description: t.description,
      date: t.date,
      method: t.method,
    }));
    exportToCSV(data as Record<string, unknown>[], 'transactions');
    addToast({ type: 'success', title: 'CSV exported', description: `${filtered.length} transactions downloaded` });
  };

  // Summary cards
  const totalRevenue = filtered.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const pendingAmount = filtered.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const failedCount = filtered.filter(t => t.status === 'failed').length;
  const refundAmount = filtered.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-500">{mockTransactions.length} total transactions</p>
        <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Collected', value: formatCurrency(totalRevenue), color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending', value: formatCurrency(pendingAmount), color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Failed', value: `${failedCount} txns`, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Refunded', value: formatCurrency(refundAmount), color: 'text-gray-400', bg: 'bg-white/5 border-white/10' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className={cn('border', item.bg)}>
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={cn('text-xl font-bold', item.color)}>{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by customer, email, or description..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all"
              aria-label="Search transactions"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={12} /></button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#1a1a2e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#1a1a2e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="subscription">Subscription</option>
              <option value="one-time">One-time</option>
              <option value="upgrade">Upgrade</option>
              <option value="refund">Refund</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No transactions found"
            description="Try adjusting your search or filter criteria"
            action={<Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}>Clear filters</Button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/8">
                    {[
                      { key: 'id', label: 'ID' },
                      { key: 'customerName', label: 'Customer' },
                      { key: 'amount', label: 'Amount' },
                      { key: 'status', label: 'Status' },
                      { key: 'type', label: 'Type' },
                      { key: 'method', label: 'Method' },
                      { key: 'date', label: 'Date' },
                      { key: null, label: '' },
                    ].map(col => (
                      <th
                        key={col.label}
                        className={cn('text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-4 px-6', col.key && 'cursor-pointer hover:text-gray-300 select-none')}
                        onClick={() => col.key && handleSort(col.key as keyof Transaction)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.key && <SortIcon col={col.key as keyof Transaction} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  <AnimatePresence mode="popLayout">
                    {paginatedItems.map((tx, i) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-white/2 transition-colors group"
                      >
                        <td className="py-4 px-6 text-gray-500 font-mono text-xs">{tx.id}</td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-gray-200 group-hover:text-white transition-colors">{tx.customerName}</p>
                            <p className="text-xs text-gray-500">{tx.customerEmail}</p>
                          </div>
                        </td>
                        <td className={cn('py-4 px-6 font-bold text-lg', tx.type === 'refund' ? 'text-rose-400' : 'text-white')}>
                          {tx.type === 'refund' ? '-' : ''}{formatCurrency(tx.amount)}
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={STATUS_BADGE[tx.status]} dot size="sm">
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-medium text-gray-400 capitalize">{tx.type}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-xs">{tx.method}</td>
                        <td className="py-4 px-6 text-gray-400 text-xs">{formatDate(tx.date, 'medium')}</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                            aria-label={`View transaction ${tx.id}`}
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} transactions
              </p>
              <div className="flex items-center gap-1">
                <button onClick={prevPage} disabled={!hasPrev} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Previous page">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => goToPage(pageNum)} className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-all', pageNum === page ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10')}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={nextPage} disabled={!hasNext} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Next page">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Transaction Detail Modal */}
      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title="Transaction Details" size="md">
        {selectedTx && (
          <div className="p-6 space-y-4">
            <div className={cn('p-4 rounded-xl border text-center',
              selectedTx.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' :
              selectedTx.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' :
              selectedTx.status === 'failed' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/10'
            )}>
              <p className="text-xs text-gray-400 mb-1">Amount</p>
              <p className={cn('text-3xl font-bold',
                selectedTx.status === 'completed' ? 'text-emerald-400' :
                selectedTx.status === 'pending' ? 'text-amber-400' :
                selectedTx.status === 'failed' ? 'text-rose-400' : 'text-gray-300'
              )}>
                {selectedTx.type === 'refund' ? '-' : ''}{formatCurrency(selectedTx.amount)}
              </p>
              <Badge variant={STATUS_BADGE[selectedTx.status]} dot className="mt-2">
                {selectedTx.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Transaction ID', value: selectedTx.id },
                { label: 'Customer', value: selectedTx.customerName },
                { label: 'Email', value: selectedTx.customerEmail },
                { label: 'Type', value: selectedTx.type },
                { label: 'Payment Method', value: selectedTx.method },
                { label: 'Date', value: formatDate(selectedTx.date, 'long') },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white break-all">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-white/4 border border-white/8">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm font-medium text-white">{selectedTx.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
