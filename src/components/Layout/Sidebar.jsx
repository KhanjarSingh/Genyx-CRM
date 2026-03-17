import {
  Activity,
  Dumbbell,
  FileText,
  LayoutDashboard,
  PlugZap,
  Server,
  Settings,
  TrendingUp,
  Users,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { useAppConfig } from '../../context/AppConfigContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const navigation = [
  { name: 'Facility Overview', href: '/', icon: LayoutDashboard },
  { name: 'Live Activity', href: '/live-activity', icon: Activity },
  { name: 'Member Analytics', href: '/member-analytics', icon: Users },
  { name: 'Training Insights', href: '/training-quality', icon: Dumbbell },
  { name: 'Revenue & Sales', href: '/revenue-sales', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'System Health', href: '/health', icon: Server },
  { name: 'Integrations', href: '/integrations', icon: PlugZap },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Corporate Overview', href: '/corporate', icon: LayoutDashboard },
];

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { currentUser, permissionsByRole } = useAuth();
  const { branding } = useAppConfig();
  const perms = permissionsByRole[currentUser.role];
  const visibleNav = navigation.filter((item) => {
    if (perms.hiddenSidebarItems.includes(item.name)) return false;
    return perms.allowedRoutes.includes(item.href);
  });

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-full lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-dark-border shrink-0">
          <div className="flex items-center gap-3">
            {branding.logoDataUrl ? (
              <img src={branding.logoDataUrl} alt={branding.appName} className="h-8 w-auto max-w-[140px] object-contain" />
            ) : (
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-dark-text uppercase">
                {(branding.appName || 'Genyx CRM').split(' ').slice(0, 2).join(' ')}
              </h1>
            )}
          </div>
          <button
            type="button"
            className="lg:hidden -mr-2 p-2 text-gray-400 dark:text-dark-text-secondary hover:text-gray-500 dark:hover:text-dark-text"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {visibleNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gray-50 dark:bg-dark-elevated text-brand'
                      : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated hover:text-gray-900 dark:hover:text-dark-text',
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-brand' : 'text-gray-400 dark:text-dark-text-muted group-hover:text-gray-500 dark:group-hover:text-dark-text-secondary',
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
