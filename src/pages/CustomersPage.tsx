import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Edit2, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockCustomers } from '../data/mockData';
import type { Customer, CustomerStatus, CustomerSegment } from '../types';
import { Card, Badge, Button, Input, Select, Modal, ConfirmDialog, EmptyState } from '../components/ui';
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn, generateId } from '../utils';
import { useApp } from '../contexts/AppContext';
import { useDebounce, usePagination } from '../hooks';

const STATUS_BADGE: Record<CustomerStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  trial: 'warning',
  churned: 'neutral',
};

const SEGMENT_BADGE: Record<CustomerSegment, 'purple' | 'info' | 'neutral' | 'success'> = {
  enterprise: 'purple',
  startup: 'info',
  smb: 'neutral',
  individual: 'success',
};

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  status: z.enum(['active', 'trial', 'churned']),
  segment: z.enum(['enterprise', 'startup', 'smb', 'individual']),
  plan: z.string().min(1, 'Plan is required'),
  location: z.string().min(2, 'Location is required'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomersPage() {
  const { addToast } = useApp();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [sortKey, setSortKey] = useState<keyof Customer>('revenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const PAGE_SIZE = 8;

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = customers;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (segmentFilter !== 'all') result = result.filter(c => c.segment === segmentFilter);
    result = [...result].sort((a, b) => {
      const va = a[sortKey] as string | number;
      const vb = b[sortKey] as string | number;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [customers, debouncedSearch, statusFilter, segmentFilter, sortKey, sortDir]);

  const { page, totalPages, paginatedItems, goToPage, nextPage, prevPage, hasNext, hasPrev } = usePagination(filtered, PAGE_SIZE);

  const handleSort = (key: keyof Customer) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ col }: { col: keyof Customer }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-600" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-violet-400" /> : <ChevronDown size={12} className="text-violet-400" />;
  };

  const handleDelete = (customer: Customer) => {
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
    addToast({ type: 'success', title: 'Customer deleted', description: `${customer.name} has been removed` });
  };

  const CustomerForm = ({ customer, onClose }: { customer?: Customer; onClose: () => void }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormData>({
      resolver: zodResolver(customerSchema),
      defaultValues: customer ? {
        name: customer.name,
        email: customer.email,
        status: customer.status,
        segment: customer.segment,
        plan: customer.plan,
        location: customer.location,
      } : { status: 'trial', segment: 'startup', plan: 'Trial', location: '' },
    });

    const onSubmit = (data: CustomerFormData) => {
      if (customer) {
        setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, ...data } : c));
        addToast({ type: 'success', title: 'Customer updated', description: `${data.name}'s profile has been updated` });
      } else {
        const newCustomer: Customer = {
          ...data, id: generateId('c'), revenue: 0, joinedAt: new Date().toISOString().split('T')[0],
          lastActivity: new Date().toISOString().split('T')[0], transactions: 0,
        };
        setCustomers(prev => [newCustomer, ...prev]);
        addToast({ type: 'success', title: 'Customer created', description: `${data.name} has been added` });
      }
      onClose();
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
          <Input label="Email" placeholder="jane@company.com" error={errors.email?.message} {...register('email')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'trial', label: 'Trial' },
              { value: 'churned', label: 'Churned' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
          <Select
            label="Segment"
            options={[
              { value: 'enterprise', label: 'Enterprise' },
              { value: 'startup', label: 'Startup' },
              { value: 'smb', label: 'SMB' },
              { value: 'individual', label: 'Individual' },
            ]}
            error={errors.segment?.message}
            {...register('segment')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Plan"
            options={[
              { value: 'Trial', label: 'Trial' },
              { value: 'Starter', label: 'Starter ($299/mo)' },
              { value: 'Growth', label: 'Growth ($799/mo)' },
              { value: 'Enterprise Pro', label: 'Enterprise Pro ($2,499/mo)' },
              { value: 'Enterprise Ultra', label: 'Enterprise Ultra ($4,999/mo)' },
            ]}
            error={errors.plan?.message}
            {...register('plan')}
          />
          <Input label="Location" placeholder="San Francisco, US" error={errors.location?.message} {...register('location')} />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{customer ? 'Save Changes' : 'Create Customer'}</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{customers.length} total customers in your database</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or location..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all"
              aria-label="Search customers"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={12} />
              </button>
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
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="churned">Churned</option>
            </select>
            <select
              value={segmentFilter}
              onChange={e => setSegmentFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#1a1a2e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all"
              aria-label="Filter by segment"
            >
              <option value="all">All Segments</option>
              <option value="enterprise">Enterprise</option>
              <option value="startup">Startup</option>
              <option value="smb">SMB</option>
              <option value="individual">Individual</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="No customers found"
            description="Try adjusting your search or filter criteria"
            action={<Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); setSegmentFilter('all'); }}>Clear filters</Button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/8">
                    {[
                      { key: 'name', label: 'Customer' },
                      { key: 'status', label: 'Status' },
                      { key: 'segment', label: 'Segment' },
                      { key: 'plan', label: 'Plan' },
                      { key: 'revenue', label: 'Revenue' },
                      { key: 'joinedAt', label: 'Joined' },
                      { key: null, label: 'Actions' },
                    ].map(col => (
                      <th
                        key={col.label}
                        className={cn(
                          'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-4 px-6',
                          col.key && 'cursor-pointer hover:text-gray-300 select-none'
                        )}
                        onClick={() => col.key && handleSort(col.key as keyof Customer)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.key && <SortIcon col={col.key as keyof Customer} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  <AnimatePresence mode="popLayout">
                    {paginatedItems.map((customer, i) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-white/2 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0', getAvatarColor(customer.name))}>
                              {getInitials(customer.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-200 group-hover:text-white transition-colors">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={STATUS_BADGE[customer.status]} dot size="sm">
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={SEGMENT_BADGE[customer.segment]} size="sm">
                            {customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{customer.plan}</td>
                        <td className="py-4 px-6 font-semibold text-white">{formatCurrency(customer.revenue)}</td>
                        <td className="py-4 px-6 text-gray-400 text-xs">{formatDate(customer.joinedAt, 'short')}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setDetailCustomer(customer)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                              aria-label={`View ${customer.name}`}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => setEditCustomer(customer)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                              aria-label={`Edit ${customer.name}`}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteCustomer(customer)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                              aria-label={`Delete ${customer.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} customers
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevPage}
                  disabled={!hasPrev}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-all', p === page ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10')}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  disabled={!hasNext}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Customer" size="lg">
        <CustomerForm onClose={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editCustomer} onClose={() => setEditCustomer(null)} title="Edit Customer" size="lg">
        {editCustomer && <CustomerForm customer={editCustomer} onClose={() => setEditCustomer(null)} />}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailCustomer} onClose={() => setDetailCustomer(null)} title="Customer Details" size="lg">
        {detailCustomer && (
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white', getAvatarColor(detailCustomer.name))}>
                {getInitials(detailCustomer.name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{detailCustomer.name}</h3>
                <p className="text-gray-400 text-sm">{detailCustomer.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={STATUS_BADGE[detailCustomer.status]} dot size="sm">{detailCustomer.status}</Badge>
                  <Badge variant={SEGMENT_BADGE[detailCustomer.segment]} size="sm">{detailCustomer.segment}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Plan', value: detailCustomer.plan },
                { label: 'Location', value: detailCustomer.location },
                { label: 'Revenue', value: formatCurrency(detailCustomer.revenue) },
                { label: 'Transactions', value: detailCustomer.transactions.toString() },
                { label: 'Joined', value: formatDate(detailCustomer.joinedAt, 'long') },
                { label: 'Last Active', value: formatDate(detailCustomer.lastActivity, 'long') },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" icon={<Edit2 size={14} />} onClick={() => { setDetailCustomer(null); setEditCustomer(detailCustomer); }}>Edit Customer</Button>
              <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => { setDetailCustomer(null); setDeleteCustomer(detailCustomer); }}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={() => deleteCustomer && handleDelete(deleteCustomer)}
        title={`Delete ${deleteCustomer?.name}?`}
        description="This action cannot be undone. The customer and all associated data will be permanently removed."
        confirmLabel="Delete Customer"
        variant="danger"
      />
    </div>
  );
}
