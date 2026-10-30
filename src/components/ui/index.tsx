import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';

// ============================================================
// Button
// ============================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', loading = false, icon, iconPosition = 'left',
  className, children, disabled, ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const variants = {
    primary: 'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 shadow-lg shadow-violet-500/20',
    secondary: 'bg-white/10 text-white hover:bg-white/20 active:bg-white/5 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/5',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-lg shadow-rose-500/20',
    outline: 'border border-white/20 text-gray-300 hover:border-white/40 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && iconPosition === 'left' && <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      )}
    </button>
  );
});
Button.displayName = 'Button';

// ============================================================
// Badge
// ============================================================
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', size = 'sm', dot = false, children, className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    neutral: 'bg-white/10 text-gray-400 border-white/15',
    purple: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-blue-400',
    neutral: 'bg-gray-400',
    purple: 'bg-violet-400',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border font-medium', variants[variant], sizes[size], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

// ============================================================
// Input
// ============================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label, error, icon, iconRight, hint, className, id, ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
            error ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-white/10 hover:border-white/20',
            icon && 'pl-9',
            iconRight && 'pr-9',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
});
Input.displayName = 'Input';

// ============================================================
// Select
// ============================================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label, error, options, className, id, ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-[#1a1a2e] px-3 py-2.5 text-sm text-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
          error ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';

// ============================================================
// Card
// ============================================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = false, onClick, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm',
        hover && 'hover:border-white/15 hover:bg-white/6 cursor-pointer transition-all duration-200',
        onClick && 'cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================
// Skeleton
// ============================================================
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-white/8', className)} />
  );
}

// ============================================================
// Spinner
// ============================================================
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={cn('border-2 border-violet-400 border-t-transparent rounded-full animate-spin', sizes[size], className)} />
  );
}

// ============================================================
// Divider
// ============================================================
export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-white/8', className)} />;
}

// ============================================================
// Toggle
// ============================================================
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({ checked, onChange, label, description, disabled, id }: ToggleProps) {
  const toggleId = id || `toggle-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && <label htmlFor={toggleId} className="text-sm font-medium text-gray-200 cursor-pointer">{label}</label>}
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
          checked ? 'bg-violet-600' : 'bg-white/15',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <motion.span
          animate={{ x: checked ? 22 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="inline-block h-4 w-4 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}

// ============================================================
// Textarea
// ============================================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label, error, className, id, ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
          error ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

// ============================================================
// EmptyState
// ============================================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-200 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ============================================================
// Toast Container
// ============================================================
interface ToastProps {
  toasts: import('../../types').ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: import('../../types').ToastMessage; onRemove: (id: string) => void }) {
  const colors = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    error: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    info: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  React.useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-sm bg-gray-900/90',
        colors[toast.type]
      )}
    >
      <span className="text-sm font-bold mt-0.5">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.description && <p className="text-xs text-gray-400 mt-0.5">{toast.description}</p>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ============================================================
// Modal
// ============================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn('relative w-full rounded-2xl border border-white/10 bg-[#12121e] shadow-2xl', sizes[size])}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-white/8">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// ConfirmDialog
// ============================================================
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger' }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// Tabs
// ============================================================
interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'text-white bg-violet-600 shadow-lg shadow-violet-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Breadcrumb
// ============================================================
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-600">/</span>}
          <span className={cn(i === items.length - 1 ? 'text-gray-200 font-medium' : 'hover:text-gray-300 cursor-pointer')}>
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

// ============================================================
// TrendBadge
// ============================================================
export function TrendBadge({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const isPositive = value >= 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
      isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
    )}>
      {isPositive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}
