import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Layout, Palette, Shield, Save, Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input, Select, Toggle, Tabs, Divider } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { cn, getInitials, getAvatarColor } from '../utils';

const SECTION_TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={14} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
  { id: 'dashboard', label: 'Dashboard', icon: <Layout size={14} /> },
];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ACCENT_COLORS = [
  { id: '#6366f1', label: 'Violet', class: 'bg-violet-500' },
  { id: '#3b82f6', label: 'Blue', class: 'bg-blue-500' },
  { id: '#10b981', label: 'Emerald', class: 'bg-emerald-500' },
  { id: '#f59e0b', label: 'Amber', class: 'bg-amber-500' },
  { id: '#ec4899', label: 'Pink', class: 'bg-pink-500' },
  { id: '#06b6d4', label: 'Cyan', class: 'bg-cyan-500' },
];

export default function SettingsPage() {
  const { settings, updateProfile, updateNotifications, updateDashboard, updateAppearance, toggleTheme, addToast } = useApp();
  const [activeSection, setActiveSection] = useState('profile');

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: settings.profile.name,
      email: settings.profile.email,
      company: settings.profile.company || '',
      role: settings.profile.role,
      timezone: settings.profile.timezone,
    },
  });

  const onProfileSave = (data: ProfileFormData) => {
    updateProfile(data);
    addToast({ type: 'success', title: 'Profile updated', description: 'Your profile information has been saved' });
  };

  const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <p className="text-sm text-gray-500">Manage your account settings and preferences</p>

      {/* Section Tabs */}
      <Tabs tabs={SECTION_TABS} activeTab={activeSection} onChange={setActiveSection} className="flex-wrap" />

      <div className="max-w-3xl">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <Section title="Avatar" description="Your profile avatar is auto-generated from your name">
                <div className="flex items-center gap-4">
                  <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white', getAvatarColor(settings.profile.name))}>
                    {getInitials(settings.profile.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{settings.profile.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{settings.profile.email}</p>
                    <Button variant="outline" size="sm" icon={<Camera size={14} />} disabled>
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </Section>
            </Card>

            <Card>
              <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
                <Section title="Personal Information" description="Update your name, email, and professional details">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" placeholder="Alex Morgan" error={errors.name?.message} {...register('name')} />
                    <Input label="Email Address" placeholder="alex@nexora.io" error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Company" placeholder="Nexora Inc." {...register('company')} />
                    <Select
                      label="Role"
                      options={[
                        { value: 'Admin', label: 'Admin' },
                        { value: 'Manager', label: 'Manager' },
                        { value: 'Analyst', label: 'Analyst' },
                        { value: 'Viewer', label: 'Viewer' },
                      ]}
                      error={errors.role?.message}
                      {...register('role')}
                    />
                  </div>
                  <Select
                    label="Timezone"
                    options={[
                      { value: 'America/New_York', label: 'Eastern Time (ET)' },
                      { value: 'America/Chicago', label: 'Central Time (CT)' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                      { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
                      { value: 'Europe/Paris', label: 'Central European Time (CET)' },
                      { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
                      { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
                      { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
                    ]}
                    error={errors.timezone?.message}
                    {...register('timezone')}
                  />
                </Section>
                <div className="flex justify-end pt-2">
                  <Button type="submit" icon={<Save size={14} />} disabled={!isDirty}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            <Card>
              <Section title="Security" description="Manage your account security settings">
                <div className="space-y-3">
                  <Button variant="outline" size="sm" icon={<Shield size={14} />}>
                    Change Password
                  </Button>
                  <p className="text-xs text-gray-500">Two-factor authentication is not enabled</p>
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
              </Section>
            </Card>
          </motion.div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="space-y-6">
              <Section title="Notification Channels" description="Choose how you want to be notified">
                <div className="space-y-5">
                  <Toggle
                    id="notif-email"
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={settings.notifications.email}
                    onChange={v => updateNotifications({ email: v })}
                  />
                  <Divider />
                  <Toggle
                    id="notif-push"
                    label="Push Notifications"
                    description="Browser push notifications"
                    checked={settings.notifications.push}
                    onChange={v => updateNotifications({ push: v })}
                  />
                  <Divider />
                  <Toggle
                    id="notif-marketing"
                    label="Marketing Emails"
                    description="Product updates, tips, and news"
                    checked={settings.notifications.marketing}
                    onChange={v => updateNotifications({ marketing: v })}
                  />
                  <Divider />
                  <Toggle
                    id="notif-reports"
                    label="Automated Reports"
                    description="Get scheduled reports delivered to your inbox"
                    checked={settings.notifications.reports}
                    onChange={v => {
                      updateNotifications({ reports: v });
                      addToast({
                        type: v ? 'success' : 'info',
                        title: v ? 'Reports enabled' : 'Reports disabled',
                        description: v ? 'You\'ll receive automated reports' : 'Automated reports turned off',
                      });
                    }}
                  />
                  <Divider />
                  <Toggle
                    id="notif-digest"
                    label="Weekly Digest"
                    description="A summary of your week's performance every Monday"
                    checked={settings.notifications.weeklyDigest}
                    onChange={v => updateNotifications({ weeklyDigest: v })}
                  />
                </div>
              </Section>
            </Card>
          </motion.div>
        )}

        {/* Appearance Section */}
        {activeSection === 'appearance' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <Section title="Color Theme" description="Switch between dark and light mode">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'dark', label: 'Dark Mode', preview: 'bg-[#0a0a14]', textColor: 'text-white' },
                    { id: 'light', label: 'Light Mode', preview: 'bg-gray-100', textColor: 'text-gray-900' },
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        if (settings.theme !== theme.id) {
                          toggleTheme();
                          addToast({ type: 'success', title: `${theme.label} enabled`, description: 'Theme preference saved' });
                        }
                      }}
                      className={cn(
                        'relative p-4 rounded-xl border-2 transition-all text-left',
                        settings.theme === theme.id ? 'border-violet-500 shadow-lg shadow-violet-500/20' : 'border-white/10 hover:border-white/20'
                      )}
                      aria-pressed={settings.theme === theme.id}
                    >
                      <div className={cn('w-full h-16 rounded-lg mb-3', theme.preview)}>
                        <div className="flex gap-1 p-2">
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-200">{theme.label}</span>
                        {settings.theme === theme.id && (
                          <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Section>
            </Card>

            <Card>
              <Section title="Accent Color" description="Customize the primary accent color">
                <div className="flex items-center gap-3 flex-wrap">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color.id}
                      onClick={() => {
                        updateAppearance({ accentColor: color.id });
                        addToast({ type: 'success', title: 'Accent color updated', description: `${color.label} accent applied` });
                      }}
                      className={cn(
                        'w-10 h-10 rounded-xl transition-all hover:scale-110 border-2',
                        color.class,
                        settings.appearance.accentColor === color.id ? 'border-white scale-110' : 'border-transparent'
                      )}
                      aria-label={`${color.label} accent color`}
                      title={color.label}
                    />
                  ))}
                </div>
              </Section>
            </Card>
          </motion.div>
        )}

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="space-y-6">
              <Section title="Default Date Range" description="Set the default time period when opening the dashboard">
                <Select
                  options={[
                    { value: '7d', label: 'Last 7 Days' },
                    { value: '30d', label: 'Last 30 Days' },
                    { value: '90d', label: 'Last 90 Days' },
                    { value: '12m', label: 'Last 12 Months' },
                  ]}
                  value={settings.dashboard.defaultDateRange}
                  onChange={e => updateDashboard({ defaultDateRange: e.target.value as '7d' | '30d' | '90d' | '12m' })}
                />
              </Section>

              <Divider />

              <Section title="Visible Metric Cards" description="Choose which metrics appear on the dashboard overview">
                <div className="space-y-4">
                  <Toggle id="show-revenue" label="Total Revenue" checked={settings.dashboard.showRevenue} onChange={v => updateDashboard({ showRevenue: v })} />
                  <Toggle id="show-users" label="Active Users" checked={settings.dashboard.showUsers} onChange={v => updateDashboard({ showUsers: v })} />
                  <Toggle id="show-conversion" label="Conversion Rate" checked={settings.dashboard.showConversions} onChange={v => updateDashboard({ showConversions: v })} />
                  <Toggle id="show-acquisition" label="New Customers" checked={settings.dashboard.showAcquisition} onChange={v => updateDashboard({ showAcquisition: v })} />
                </div>
              </Section>

              <Divider />

              <Section title="Interface Options">
                <div className="space-y-4">
                  <Toggle
                    id="compact-mode"
                    label="Compact Mode"
                    description="Reduce spacing for a denser layout"
                    checked={settings.dashboard.compactMode}
                    onChange={v => { updateDashboard({ compactMode: v }); addToast({ type: 'info', title: v ? 'Compact mode on' : 'Compact mode off' }); }}
                  />
                  <Toggle
                    id="animations"
                    label="Enable Animations"
                    description="Smooth transitions and animated elements"
                    checked={settings.dashboard.animationsEnabled}
                    onChange={v => { updateDashboard({ animationsEnabled: v }); addToast({ type: 'info', title: v ? 'Animations enabled' : 'Animations disabled' }); }}
                  />
                </div>
              </Section>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
