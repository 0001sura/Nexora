import type { Customer, Transaction, RevenueDataPoint, UserGrowthDataPoint, TrafficSource, FunnelStage, ActivityItem, Product, GeographicData } from '../types';

// ============================================================
// CUSTOMERS
// ============================================================
export const mockCustomers: Customer[] = [
  { id: 'c001', name: 'Aria Patel', email: 'aria.patel@techcorp.io', status: 'active', segment: 'enterprise', revenue: 48200, joinedAt: '2024-01-15', lastActivity: '2026-10-28', location: 'San Francisco, US', plan: 'Enterprise Pro', transactions: 24 },
  { id: 'c002', name: 'Marcus Chen', email: 'mchen@startupx.com', status: 'active', segment: 'startup', revenue: 12400, joinedAt: '2024-03-02', lastActivity: '2026-10-27', location: 'Austin, US', plan: 'Growth', transactions: 12 },
  { id: 'c003', name: 'Sofia Andersson', email: 's.andersson@nordic.se', status: 'trial', segment: 'smb', revenue: 0, joinedAt: '2026-10-15', lastActivity: '2026-10-29', location: 'Stockholm, SE', plan: 'Trial', transactions: 0 },
  { id: 'c004', name: 'James Okafor', email: 'james@financegroup.ng', status: 'active', segment: 'enterprise', revenue: 72100, joinedAt: '2023-11-08', lastActivity: '2026-10-26', location: 'Lagos, NG', plan: 'Enterprise Pro', transactions: 36 },
  { id: 'c005', name: 'Elena Vasquez', email: 'evasquez@pixelmedia.mx', status: 'churned', segment: 'smb', revenue: 4200, joinedAt: '2024-06-20', lastActivity: '2026-08-14', location: 'Mexico City, MX', plan: 'Starter', transactions: 6 },
  { id: 'c006', name: 'Noah Williams', email: 'noah.w@cloudnine.io', status: 'active', segment: 'startup', revenue: 18900, joinedAt: '2024-02-14', lastActivity: '2026-10-29', location: 'London, UK', plan: 'Growth', transactions: 18 },
  { id: 'c007', name: 'Priya Sharma', email: 'priya@dataminds.in', status: 'active', segment: 'enterprise', revenue: 94500, joinedAt: '2023-08-30', lastActivity: '2026-10-28', location: 'Bangalore, IN', plan: 'Enterprise Ultra', transactions: 48 },
  { id: 'c008', name: 'Lucas Fernandez', email: 'l.fernandez@agencia.ar', status: 'trial', segment: 'individual', revenue: 0, joinedAt: '2026-10-20', lastActivity: '2026-10-29', location: 'Buenos Aires, AR', plan: 'Trial', transactions: 0 },
  { id: 'c009', name: 'Aisha Kone', email: 'aisha@buildit.fr', status: 'active', segment: 'smb', revenue: 8700, joinedAt: '2024-09-11', lastActivity: '2026-10-25', location: 'Paris, FR', plan: 'Starter', transactions: 9 },
  { id: 'c010', name: 'Kenji Nakamura', email: 'k.nakamura@zentech.jp', status: 'active', segment: 'enterprise', revenue: 61200, joinedAt: '2024-01-03', lastActivity: '2026-10-28', location: 'Tokyo, JP', plan: 'Enterprise Pro', transactions: 30 },
  { id: 'c011', name: 'Hannah Schmidt', email: 'h.schmidt@berlinlab.de', status: 'churned', segment: 'startup', revenue: 7200, joinedAt: '2024-07-22', lastActivity: '2026-09-01', location: 'Berlin, DE', plan: 'Growth', transactions: 8 },
  { id: 'c012', name: 'Omar Hassan', email: 'omar@arabtech.ae', status: 'active', segment: 'smb', revenue: 15300, joinedAt: '2024-04-18', lastActivity: '2026-10-27', location: 'Dubai, AE', plan: 'Growth', transactions: 15 },
  { id: 'c013', name: 'Chloe Dubois', email: 'chloe.dubois@monentreprise.fr', status: 'active', segment: 'individual', revenue: 2100, joinedAt: '2025-01-10', lastActivity: '2026-10-20', location: 'Lyon, FR', plan: 'Starter', transactions: 3 },
  { id: 'c014', name: 'Raj Krishnamurthy', email: 'raj@techwave.sg', status: 'active', segment: 'enterprise', revenue: 83400, joinedAt: '2023-10-05', lastActivity: '2026-10-29', location: 'Singapore, SG', plan: 'Enterprise Ultra', transactions: 42 },
  { id: 'c015', name: 'Valentina Russo', email: 'v.russo@crescita.it', status: 'trial', segment: 'startup', revenue: 0, joinedAt: '2026-10-22', lastActivity: '2026-10-28', location: 'Milan, IT', plan: 'Trial', transactions: 0 },
  { id: 'c016', name: 'Daniel Park', email: 'dpark@seoulstartup.kr', status: 'active', segment: 'startup', revenue: 22800, joinedAt: '2024-05-30', lastActivity: '2026-10-26', location: 'Seoul, KR', plan: 'Growth', transactions: 22 },
  { id: 'c017', name: 'Fatima Al-Rashid', email: 'fatima@riyadhbiz.sa', status: 'active', segment: 'enterprise', revenue: 58900, joinedAt: '2024-02-28', lastActivity: '2026-10-27', location: 'Riyadh, SA', plan: 'Enterprise Pro', transactions: 28 },
  { id: 'c018', name: 'Tyler Brooks', email: 'tyler@greenventures.ca', status: 'churned', segment: 'smb', revenue: 5600, joinedAt: '2024-08-15', lastActivity: '2026-09-20', location: 'Toronto, CA', plan: 'Starter', transactions: 7 },
  { id: 'c019', name: 'Nadia Petrov', email: 'nadia@moskovtech.ru', status: 'active', segment: 'smb', revenue: 9800, joinedAt: '2024-11-25', lastActivity: '2026-10-24', location: 'Moscow, RU', plan: 'Growth', transactions: 11 },
  { id: 'c020', name: 'Ethan Goldberg', email: 'ethan@nyventure.us', status: 'active', segment: 'enterprise', revenue: 105000, joinedAt: '2023-06-14', lastActivity: '2026-10-29', location: 'New York, US', plan: 'Enterprise Ultra', transactions: 54 },
];

// ============================================================
// TRANSACTIONS
// ============================================================
export const mockTransactions: Transaction[] = [
  { id: 't001', customerId: 'c020', customerName: 'Ethan Goldberg', customerEmail: 'ethan@nyventure.us', amount: 4999, status: 'completed', type: 'subscription', description: 'Enterprise Ultra – Monthly', date: '2026-10-29', method: 'Visa •••• 4242' },
  { id: 't002', customerId: 'c007', customerName: 'Priya Sharma', customerEmail: 'priya@dataminds.in', amount: 4999, status: 'completed', type: 'subscription', description: 'Enterprise Ultra – Monthly', date: '2026-10-28', method: 'Mastercard •••• 8888' },
  { id: 't003', customerId: 'c014', customerName: 'Raj Krishnamurthy', customerEmail: 'raj@techwave.sg', amount: 4999, status: 'completed', type: 'subscription', description: 'Enterprise Ultra – Monthly', date: '2026-10-28', method: 'Amex •••• 3737' },
  { id: 't004', customerId: 'c001', customerName: 'Aria Patel', customerEmail: 'aria.patel@techcorp.io', amount: 2499, status: 'completed', type: 'subscription', description: 'Enterprise Pro – Monthly', date: '2026-10-27', method: 'Visa •••• 4242' },
  { id: 't005', customerId: 'c004', customerName: 'James Okafor', customerEmail: 'james@financegroup.ng', amount: 2499, status: 'pending', type: 'subscription', description: 'Enterprise Pro – Monthly', date: '2026-10-27', method: 'Bank Transfer' },
  { id: 't006', customerId: 'c010', customerName: 'Kenji Nakamura', customerEmail: 'k.nakamura@zentech.jp', amount: 2499, status: 'completed', type: 'subscription', description: 'Enterprise Pro – Monthly', date: '2026-10-26', method: 'Visa •••• 9191' },
  { id: 't007', customerId: 'c017', customerName: 'Fatima Al-Rashid', customerEmail: 'fatima@riyadhbiz.sa', amount: 2499, status: 'completed', type: 'subscription', description: 'Enterprise Pro – Monthly', date: '2026-10-26', method: 'Mastercard •••• 5555' },
  { id: 't008', customerId: 'c002', customerName: 'Marcus Chen', customerEmail: 'mchen@startupx.com', amount: 799, status: 'completed', type: 'subscription', description: 'Growth – Monthly', date: '2026-10-25', method: 'Visa •••• 3311' },
  { id: 't009', customerId: 'c006', customerName: 'Noah Williams', customerEmail: 'noah.w@cloudnine.io', amount: 799, status: 'completed', type: 'subscription', description: 'Growth – Monthly', date: '2026-10-25', method: 'PayPal' },
  { id: 't010', customerId: 'c016', customerName: 'Daniel Park', customerEmail: 'dpark@seoulstartup.kr', amount: 799, status: 'completed', type: 'subscription', description: 'Growth – Monthly', date: '2026-10-24', method: 'Visa •••• 7722' },
  { id: 't011', customerId: 'c012', customerName: 'Omar Hassan', customerEmail: 'omar@arabtech.ae', amount: 799, status: 'pending', type: 'subscription', description: 'Growth – Monthly', date: '2026-10-24', method: 'Bank Transfer' },
  { id: 't012', customerId: 'c019', customerName: 'Nadia Petrov', customerEmail: 'nadia@moskovtech.ru', amount: 799, status: 'completed', type: 'subscription', description: 'Growth – Monthly', date: '2026-10-23', method: 'Mastercard •••• 6644' },
  { id: 't013', customerId: 'c009', customerName: 'Aisha Kone', customerEmail: 'aisha@buildit.fr', amount: 299, status: 'completed', type: 'subscription', description: 'Starter – Monthly', date: '2026-10-23', method: 'Visa •••• 2200' },
  { id: 't014', customerId: 'c013', customerName: 'Chloe Dubois', customerEmail: 'chloe.dubois@monentreprise.fr', amount: 299, status: 'completed', type: 'subscription', description: 'Starter – Monthly', date: '2026-10-22', method: 'Mastercard •••• 1122' },
  { id: 't015', customerId: 'c005', customerName: 'Elena Vasquez', customerEmail: 'evasquez@pixelmedia.mx', amount: 299, status: 'refunded', type: 'refund', description: 'Starter – Refund', date: '2026-10-21', method: 'Visa •••• 8877' },
  { id: 't016', customerId: 'c011', customerName: 'Hannah Schmidt', customerEmail: 'h.schmidt@berlinlab.de', amount: 799, status: 'failed', type: 'subscription', description: 'Growth – Payment Failed', date: '2026-10-20', method: 'Visa •••• 4433' },
  { id: 't017', customerId: 'c007', customerName: 'Priya Sharma', customerEmail: 'priya@dataminds.in', amount: 1500, status: 'completed', type: 'upgrade', description: 'Enterprise Pro → Ultra Upgrade', date: '2026-10-19', method: 'Amex •••• 6600' },
  { id: 't018', customerId: 'c020', customerName: 'Ethan Goldberg', customerEmail: 'ethan@nyventure.us', amount: 9999, status: 'completed', type: 'one-time', description: 'Premium Onboarding Package', date: '2026-10-18', method: 'Wire Transfer' },
  { id: 't019', customerId: 'c001', customerName: 'Aria Patel', customerEmail: 'aria.patel@techcorp.io', amount: 2499, status: 'completed', type: 'subscription', description: 'Enterprise Pro – Monthly', date: '2026-09-27', method: 'Visa •••• 4242' },
  { id: 't020', customerId: 'c018', customerName: 'Tyler Brooks', customerEmail: 'tyler@greenventures.ca', amount: 299, status: 'refunded', type: 'refund', description: 'Starter – Cancellation Refund', date: '2026-09-20', method: 'Visa •••• 9900' },
];

// ============================================================
// REVENUE DATA
// ============================================================
export const revenueData: RevenueDataPoint[] = [
  { month: 'Nov', revenue: 89400, previousRevenue: 71200, expenses: 42000, profit: 47400 },
  { month: 'Dec', revenue: 102300, previousRevenue: 78900, expenses: 46000, profit: 56300 },
  { month: 'Jan', revenue: 94100, previousRevenue: 89400, expenses: 44000, profit: 50100 },
  { month: 'Feb', revenue: 108700, previousRevenue: 102300, expenses: 49000, profit: 59700 },
  { month: 'Mar', revenue: 118200, previousRevenue: 94100, expenses: 52000, profit: 66200 },
  { month: 'Apr', revenue: 125600, previousRevenue: 108700, expenses: 54000, profit: 71600 },
  { month: 'May', revenue: 132400, previousRevenue: 118200, expenses: 57000, profit: 75400 },
  { month: 'Jun', revenue: 141800, previousRevenue: 125600, expenses: 60000, profit: 81800 },
  { month: 'Jul', revenue: 138200, previousRevenue: 132400, expenses: 58000, profit: 80200 },
  { month: 'Aug', revenue: 149600, previousRevenue: 141800, expenses: 63000, profit: 86600 },
  { month: 'Sep', revenue: 157300, previousRevenue: 138200, expenses: 66000, profit: 91300 },
  { month: 'Oct', revenue: 168900, previousRevenue: 149600, expenses: 70000, profit: 98900 },
];

// ============================================================
// USER GROWTH DATA
// ============================================================
export const userGrowthData: UserGrowthDataPoint[] = [
  { month: 'Nov', newUsers: 142, totalUsers: 1420, churned: 18 },
  { month: 'Dec', newUsers: 168, totalUsers: 1570, churned: 21 },
  { month: 'Jan', newUsers: 134, totalUsers: 1683, churned: 25 },
  { month: 'Feb', newUsers: 189, totalUsers: 1847, churned: 19 },
  { month: 'Mar', newUsers: 224, totalUsers: 2052, churned: 22 },
  { month: 'Apr', newUsers: 201, totalUsers: 2231, churned: 28 },
  { month: 'May', newUsers: 247, totalUsers: 2450, churned: 24 },
  { month: 'Jun', newUsers: 278, totalUsers: 2704, churned: 31 },
  { month: 'Jul', newUsers: 256, totalUsers: 2929, churned: 35 },
  { month: 'Aug', newUsers: 312, totalUsers: 3206, churned: 29 },
  { month: 'Sep', newUsers: 334, totalUsers: 3511, churned: 27 },
  { month: 'Oct', newUsers: 358, totalUsers: 3842, churned: 32 },
];

// ============================================================
// TRAFFIC SOURCES
// ============================================================
export const trafficSources: TrafficSource[] = [
  { name: 'Organic Search', value: 38, color: '#6366f1' },
  { name: 'Direct', value: 24, color: '#8b5cf6' },
  { name: 'Paid Ads', value: 18, color: '#a78bfa' },
  { name: 'Social Media', value: 12, color: '#c4b5fd' },
  { name: 'Referral', value: 8, color: '#ddd6fe' },
];

// ============================================================
// CONVERSION FUNNEL
// ============================================================
export const conversionFunnel: FunnelStage[] = [
  { stage: 'Visitors', visitors: 42800, conversions: 42800, rate: 100 },
  { stage: 'Sign-Ups', visitors: 42800, conversions: 8940, rate: 20.9 },
  { stage: 'Trial Start', visitors: 8940, conversions: 3720, rate: 41.6 },
  { stage: 'Demo Request', visitors: 3720, conversions: 1280, rate: 34.4 },
  { stage: 'Paid Customer', visitors: 1280, conversions: 642, rate: 50.2 },
];

// ============================================================
// ACTIVITY FEED
// ============================================================
export const activityFeed: ActivityItem[] = [
  { id: 'a1', type: 'signup', title: 'New trial signup', description: 'Valentina Russo started a free trial', timestamp: '2026-10-29T14:52:00Z', icon: 'UserPlus', color: 'text-emerald-400' },
  { id: 'a2', type: 'payment', title: 'Payment received', description: 'Ethan Goldberg paid $4,999 (Enterprise Ultra)', timestamp: '2026-10-29T13:18:00Z', icon: 'CreditCard', color: 'text-violet-400' },
  { id: 'a3', type: 'upgrade', title: 'Plan upgrade', description: 'Priya Sharma upgraded to Enterprise Ultra', timestamp: '2026-10-29T12:04:00Z', icon: 'TrendingUp', color: 'text-blue-400' },
  { id: 'a4', type: 'support', title: 'Support ticket resolved', description: 'Ticket #4821 closed — 98% CSAT score', timestamp: '2026-10-29T11:30:00Z', icon: 'CheckCircle', color: 'text-emerald-400' },
  { id: 'a5', type: 'signup', title: 'New trial signup', description: 'Lucas Fernandez started a free trial', timestamp: '2026-10-29T10:15:00Z', icon: 'UserPlus', color: 'text-emerald-400' },
  { id: 'a6', type: 'refund', title: 'Refund processed', description: 'Elena Vasquez refund of $299 processed', timestamp: '2026-10-28T16:42:00Z', icon: 'RefreshCw', color: 'text-amber-400' },
  { id: 'a7', type: 'payment', title: 'Payment received', description: 'Raj Krishnamurthy paid $4,999 (Enterprise Ultra)', timestamp: '2026-10-28T15:22:00Z', icon: 'CreditCard', color: 'text-violet-400' },
  { id: 'a8', type: 'export', title: 'Report generated', description: 'Monthly revenue report exported as CSV', timestamp: '2026-10-28T11:00:00Z', icon: 'Download', color: 'text-cyan-400' },
];

// ============================================================
// TOP PRODUCTS
// ============================================================
export const topProducts: Product[] = [
  { id: 'p1', name: 'Enterprise Ultra', revenue: 312400, units: 62, growth: 18.2, category: 'Subscription' },
  { id: 'p2', name: 'Enterprise Pro', revenue: 224820, units: 90, growth: 12.7, category: 'Subscription' },
  { id: 'p3', name: 'Growth Plan', revenue: 89520, units: 112, growth: 9.4, category: 'Subscription' },
  { id: 'p4', name: 'Starter Plan', revenue: 31884, units: 107, growth: 4.8, category: 'Subscription' },
  { id: 'p5', name: 'Onboarding Package', revenue: 49995, units: 5, growth: 33.1, category: 'One-time' },
];

// ============================================================
// GEOGRAPHIC DATA
// ============================================================
export const geographicData: GeographicData[] = [
  { country: 'United States', code: 'US', revenue: 189400, users: 1240, growth: 14.2 },
  { country: 'United Kingdom', code: 'GB', revenue: 84200, users: 432, growth: 11.8 },
  { country: 'India', code: 'IN', revenue: 72100, users: 388, growth: 28.4 },
  { country: 'Germany', code: 'DE', revenue: 61800, users: 298, growth: 9.7 },
  { country: 'Japan', code: 'JP', revenue: 58400, users: 246, growth: 7.3 },
  { country: 'Singapore', code: 'SG', revenue: 54200, users: 198, growth: 22.1 },
  { country: 'France', code: 'FR', revenue: 42100, users: 187, growth: 8.9 },
  { country: 'Canada', code: 'CA', revenue: 38700, users: 164, growth: 6.2 },
  { country: 'Australia', code: 'AU', revenue: 34500, users: 142, growth: 15.8 },
  { country: 'UAE', code: 'AE', revenue: 31200, users: 118, growth: 31.4 },
];
