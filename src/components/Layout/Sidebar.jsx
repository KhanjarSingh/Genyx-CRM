import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Dumbbell, 
  TrendingUp, 
  FileText, 
  Server, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

const navigation = [
  { name: 'Facility Overview', href: '/', icon: LayoutDashboard },
  { name: 'Live Activity', href: '/live-activity', icon: Activity },
  { name: 'Member Analytics', href: '/member-analytics', icon: Users },
  { name: 'Training Intelligence', href: '/training-quality', icon: Dumbbell },
  { name: 'Revenue & Sales', href: '/revenue-sales', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'System Health', href: '/health', icon: Server },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

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
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-full lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            GENYX <span className="text-[#059669]">CRM</span>
          </h1>
          <button 
            type="button" 
            className="lg:hidden -mr-2 p-2 text-gray-400 hover:text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gray-50 text-[#059669]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-[#059669]' : 'text-gray-400 group-hover:text-gray-500',
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
