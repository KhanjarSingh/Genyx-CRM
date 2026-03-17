import { useState } from 'react';
import { Bell, Search, User, Menu, HelpCircle } from 'lucide-react';
import { LocationSwitcher } from './LocationSwitcher';
import { ImpactScore } from '../layout/ImpactScore';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { resetTooltipsSeen } from '../UI/OnboardingTooltip';

export function Header({ setSidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser } = useAuth();
  const { currentLocation } = useLocation();
  const { unreadCount } = useNotifications();

  const roleBadge = (role) => {
    const cfg = {
      executive: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-purple-100 dark:border-purple-900/40',
      facility_manager: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-900/40',
      head_coach: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border-teal-100 dark:border-teal-900/40',
      trainer: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40',
      front_desk: 'bg-gray-100 text-gray-700 dark:bg-dark-elevated dark:text-dark-text-secondary border-gray-200 dark:border-dark-border',
    };
    const label = role.replace('_', ' ');
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${cfg[role] || cfg.front_desk}`}>
        {label}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-4 shadow-sm dark:shadow-dark-bg/50 sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center lg:hidden">
         <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-dark-text-secondary"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 dark:text-dark-text-muted"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 dark:text-dark-text bg-transparent placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:ring-0 sm:text-sm outline-none"
            placeholder="Search members, cameras, or alerts..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <LocationSwitcher />
          <ImpactScore />

          <button
            onClick={() => {
              resetTooltipsSeen();
              // let the current page show its tooltip again immediately
              window.dispatchEvent(new Event('storage'));
            }}
            type="button"
            className="-m-2.5 p-2.5 transition-colors relative text-gray-400 dark:text-dark-text-muted hover:text-gray-500 dark:hover:text-dark-text-secondary"
            title="Take a tour"
          >
            <span className="sr-only">Take a tour</span>
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            type="button"
            className={`-m-2.5 p-2.5 transition-colors relative ${showNotifications ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl' : 'text-gray-400 dark:text-dark-text-muted hover:text-gray-500 dark:hover:text-dark-text-secondary'}`}
          >
            <span className="sr-only">Open notification center</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-surface" />
            )}
          </button>

          <NotificationCenter open={showNotifications} onClose={() => setShowNotifications(false)} />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-dark-border" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <button type="button" className="flex items-center gap-x-3 p-1 shrink-0">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-dark-elevated flex items-center justify-center border border-gray-200 dark:border-dark-border">
                <User className="h-5 w-5 text-gray-500 dark:text-dark-text-secondary" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="flex flex-col leading-tight" aria-hidden="true">
                  <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-dark-text-secondary">
                    {currentLocation?.name}
                  </span>
                </span>
              </span>
            </button>
            <div className="hidden lg:block">
              {roleBadge(currentUser.role)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
