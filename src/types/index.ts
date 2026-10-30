// ============================================================
// Core Application Types
// ============================================================

export type Theme = 'dark' | 'light';

export type CustomerStatus = 'active' | 'churned' | 'trial';
export type CustomerSegment = 'enterprise' | 'startup' | 'smb' | 'individual';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: CustomerStatus;
  segment: CustomerSegment;
  revenue: number;
  joinedAt: string;
  lastActivity: string;
  location: string;
  plan: string;
  transactions: number;
}

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type TransactionType = 'subscription' | 'one-time' | 'refund' | 'upgrade';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  date: string;
  method: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage';
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  previousRevenue: number;
  expenses: number;
  profit: number;
}

export interface UserGrowthDataPoint {
  month: string;
  newUsers: number;
  totalUsers: number;
  churned: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface FunnelStage {
  stage: string;
  visitors: number;
  conversions: number;
  rate: number;
}

export interface ActivityItem {
  id: string;
  type: 'signup' | 'payment' | 'upgrade' | 'support' | 'refund' | 'export';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  revenue: number;
  units: number;
  growth: number;
  category: string;
}

export interface GeographicData {
  country: string;
  code: string;
  revenue: number;
  users: number;
  growth: number;
}

export interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

export interface UserSettings {
  theme: Theme;
  profile: {
    name: string;
    email: string;
    company: string;
    role: string;
    timezone: string;
    avatar?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    reports: boolean;
    weeklyDigest: boolean;
  };
  dashboard: {
    defaultDateRange: '7d' | '30d' | '90d' | '12m';
    showRevenue: boolean;
    showUsers: boolean;
    showConversions: boolean;
    showAcquisition: boolean;
    compactMode: boolean;
    animationsEnabled: boolean;
  };
  appearance: {
    sidebarCollapsed: boolean;
    accentColor: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  search: string;
  status?: string;
  segment?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
}
