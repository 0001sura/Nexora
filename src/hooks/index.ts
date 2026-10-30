import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserSettings, ToastMessage } from '../types';

// ============================================================
// useLocalStorage
// ============================================================
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// ============================================================
// useDebounce
// ============================================================
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================
// useMediaQuery
// ============================================================
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// ============================================================
// useToast
// ============================================================
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id, duration: toast.duration ?? 4000 };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ============================================================
// useSettings
// ============================================================
const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  profile: {
    name: 'Alex Morgan',
    email: 'alex.morgan@nexora.io',
    company: 'Nexora Inc.',
    role: 'Admin',
    timezone: 'America/New_York',
  },
  notifications: {
    email: true,
    push: true,
    marketing: false,
    reports: true,
    weeklyDigest: true,
  },
  dashboard: {
    defaultDateRange: '30d',
    showRevenue: true,
    showUsers: true,
    showConversions: true,
    showAcquisition: true,
    compactMode: false,
    animationsEnabled: true,
  },
  appearance: {
    sidebarCollapsed: false,
    accentColor: '#6366f1',
  },
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('nexora-settings', DEFAULT_SETTINGS);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  const updateProfile = useCallback((updates: Partial<UserSettings['profile']>) => {
    setSettings(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
  }, [setSettings]);

  const updateNotifications = useCallback((updates: Partial<UserSettings['notifications']>) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, ...updates } }));
  }, [setSettings]);

  const updateDashboard = useCallback((updates: Partial<UserSettings['dashboard']>) => {
    setSettings(prev => ({ ...prev, dashboard: { ...prev.dashboard, ...updates } }));
  }, [setSettings]);

  const updateAppearance = useCallback((updates: Partial<UserSettings['appearance']>) => {
    setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, ...updates } }));
  }, [setSettings]);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, [setSettings]);

  return {
    settings,
    updateSettings,
    updateProfile,
    updateNotifications,
    updateDashboard,
    updateAppearance,
    toggleTheme,
  };
}

// ============================================================
// usePagination
// ============================================================
export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, Math.ceil(items.length / pageSize))));
  }, [items.length, pageSize]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  useEffect(() => { setPage(1); }, [items.length]);

  return { page, totalPages, paginatedItems, goToPage, nextPage, prevPage, hasNext: page < totalPages, hasPrev: page > 1 };
}

// ============================================================
// useClickOutside
// ============================================================
export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [callback]);

  return ref;
}
