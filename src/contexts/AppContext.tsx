import React, { createContext, useContext, useEffect } from 'react';
import { useSettings, useToast } from '../hooks';
import type { UserSettings, ToastMessage } from '../types';

interface AppContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  updateProfile: (updates: Partial<UserSettings['profile']>) => void;
  updateNotifications: (updates: Partial<UserSettings['notifications']>) => void;
  updateDashboard: (updates: Partial<UserSettings['dashboard']>) => void;
  updateAppearance: (updates: Partial<UserSettings['appearance']>) => void;
  toggleTheme: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const settingsApi = useSettings();
  const toastApi = useToast();

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (settingsApi.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settingsApi.settings.theme]);

  const value: AppContextType = {
    ...settingsApi,
    ...toastApi,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
