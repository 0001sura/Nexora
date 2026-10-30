import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, Users, CreditCard, FileText, Settings,
  ChevronLeft, ChevronRight, Zap, Bell, HelpCircle, LogOut, X,
} from 'lucide-react';
import { cn, getInitials, getAvatarColor } from '../../utils';
import { useApp } from '../../contexts/AppContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { path: '/customers', label: 'Customers', icon: <Users size={18} /> },
  { path: '/transactions', label: 'Transactions', icon: <CreditCard size={18} /> },
  { path: '/reports', label: 'Reports', icon: <FileText size={18} /> },
];

const bottomItems: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isOpen, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const { settings } = useApp();
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-white/8', !isOpen && 'justify-center')}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">Nexora</span>
                <span className="block text-[10px] text-violet-400 font-medium -mt-0.5 whitespace-nowrap">Analytics Platform</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Desktop collapse button */}
        <button
          onClick={onToggle}
          className={cn('hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-all ml-auto flex-shrink-0', !isOpen && 'hidden')}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.path} item={item} collapsed={!isOpen} onClick={onMobileClose} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <div className={cn('flex items-center gap-3 px-3 py-2 text-xs text-gray-600 font-medium uppercase tracking-widest', !isOpen && 'hidden')}>
          Support
        </div>
        <SidebarLink icon={<HelpCircle size={18} />} label="Help Center" collapsed={!isOpen} />
        {bottomItems.map(item => (
          <NavItem key={item.path} item={item} collapsed={!isOpen} onClick={onMobileClose} />
        ))}
      </div>

      {/* User Profile */}
      <div className={cn('p-4 border-t border-white/8', !isOpen && 'flex justify-center')}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0', getAvatarColor(settings.profile.name))}>
              {getInitials(settings.profile.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{settings.profile.name}</p>
              <p className="text-xs text-gray-500 truncate">{settings.profile.role}</p>
            </div>
            <button className="text-gray-500 hover:text-rose-400 transition-colors flex-shrink-0" aria-label="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white', getAvatarColor(settings.profile.name))}>
            {getInitials(settings.profile.name)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 240 : 68 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="hidden lg:flex flex-col h-screen bg-[#0d0d1a] border-r border-white/8 flex-shrink-0 relative z-20"
      >
        <SidebarContent />
        {/* Collapsed expand button */}
        {!isOpen && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-violet-600 border border-violet-500 flex items-center justify-center text-white shadow-lg hover:bg-violet-500 transition-colors z-30"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={12} />
          </button>
        )}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[240px] bg-[#0d0d1a] border-r border-white/8"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ item, collapsed, onClick }: { item: NavItem; collapsed: boolean; onClick?: () => void }) {
  const location = useLocation();
  const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative',
        isActive
          ? 'bg-violet-600/20 text-violet-300 border border-violet-500/25'
          : 'text-gray-400 hover:text-white hover:bg-white/6',
        collapsed && 'justify-center px-0 w-10 mx-auto'
      )}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
    >
      <span className={cn('flex-shrink-0', isActive ? 'text-violet-400' : 'text-current')}>
        {item.icon}
      </span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {isActive && !collapsed && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-violet-600/10 rounded-xl -z-10"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </NavLink>
  );
}

function SidebarLink({ icon, label, collapsed }: { icon: React.ReactNode; label: string; collapsed: boolean }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/6 transition-all duration-200',
        collapsed && 'justify-center px-0 w-10 mx-auto'
      )}
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
