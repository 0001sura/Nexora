import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getInitials, getAvatarColor } from '../../utils';
import { useApp } from '../../contexts/AppContext';
import { Breadcrumb } from '../ui';

const PAGE_TITLES: Record<string, { title: string; breadcrumbs: { label: string }[] }> = {
  '/': { title: 'Overview Dashboard', breadcrumbs: [{ label: 'Nexora' }, { label: 'Dashboard' }] },
  '/analytics': { title: 'Analytics', breadcrumbs: [{ label: 'Nexora' }, { label: 'Analytics' }] },
  '/customers': { title: 'Customers', breadcrumbs: [{ label: 'Nexora' }, { label: 'Customers' }] },
  '/transactions': { title: 'Transactions', breadcrumbs: [{ label: 'Nexora' }, { label: 'Transactions' }] },
  '/reports': { title: 'Reports', breadcrumbs: [{ label: 'Nexora' }, { label: 'Reports' }] },
  '/settings': { title: 'Settings', breadcrumbs: [{ label: 'Nexora' }, { label: 'Settings' }] },
};

interface TopNavProps {
  onMobileMenuOpen: () => void;
}

export function TopNav({ onMobileMenuOpen }: TopNavProps) {
  const { settings, toggleTheme, addToast } = useApp();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const pageInfo = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];

  const notifications = [
    { id: 1, title: 'New enterprise signup', time: '2m ago', unread: true },
    { id: 2, title: 'Monthly report ready', time: '1h ago', unread: true },
    { id: 3, title: 'Payment failed – Retry needed', time: '3h ago', unread: false },
    { id: 4, title: 'Server health: All systems operational', time: '5h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 flex items-center px-4 lg:px-6 border-b border-white/8 bg-[#0a0a14]/90 backdrop-blur-sm sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden mr-3 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Page title and breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb items={pageInfo.breadcrumbs} />
        <h1 className="text-lg font-semibold text-white truncate mt-0.5 leading-tight hidden sm:block">
          {pageInfo.title}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Search anything..."
                className="w-full h-9 px-3 rounded-lg bg-white/8 border border-white/12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => { setSearchOpen(v => !v); setSearchQuery(''); }}
          className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all', searchOpen && 'bg-white/10 text-white')}
          aria-label="Search"
        >
          {searchOpen ? <X size={16} /> : <Search size={16} />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all relative', notifOpen && 'bg-white/10 text-white')}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border border-white/12 bg-[#12121e] shadow-2xl z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/8">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <span className="text-xs text-violet-400 font-medium cursor-pointer hover:text-violet-300">Mark all read</span>
                </div>
                <div className="divide-y divide-white/5">
                  {notifications.map(n => (
                    <div key={n.id} className={cn('flex items-start gap-3 p-4 hover:bg-white/4 cursor-pointer transition-colors', n.unread && 'bg-violet-500/5')}>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />}
                      {!n.unread && <div className="w-2 h-2 mt-1.5 flex-shrink-0" />}
                      <div>
                        <p className="text-sm text-gray-200">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/8">
                  <button className="w-full text-center text-sm text-violet-400 hover:text-violet-300 py-1 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:ring-2 hover:ring-violet-500/50 transition-all', getAvatarColor(settings.profile.name))}>
          {getInitials(settings.profile.name)}
        </div>
      </div>
    </header>
  );
}
