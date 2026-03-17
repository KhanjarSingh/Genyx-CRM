import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Menu, X, ArrowRight, Zap, AlertTriangle, Activity } from 'lucide-react';
import { Badge } from '../UI/Badge';

export function Header({ setSidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Extreme Congestion', desc: 'Squat Rack Zone > 100% capacity.', type: 'critical', icon: AlertTriangle, time: '2m ago' },
    { id: 2, title: 'Coach Outreach Suggestion', desc: 'Member "Alex P." struggling with Form.', type: 'intelligence', icon: Zap, time: '15m ago' },
    { id: 3, title: 'Hardware Alert', desc: 'Genyx Pod #04 Temperature rising.', type: 'warning', icon: Activity, time: '45m ago' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex items-center lg:hidden">
         <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
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
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-none"
            placeholder="Search members, cameras, or alerts..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              type="button" 
              className={`-m-2.5 p-2.5 transition-colors relative ${showNotifications ? 'text-emerald-600 bg-emerald-50 rounded-xl' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-[#059669] ring-2 ring-white" />
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                 <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h5 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Intelligence Feed</h5>
                    <button onClick={() => setShowNotifications(false)}><X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" /></button>
                 </div>
                 <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 hover:bg-emerald-50/30 transition-colors cursor-pointer group">
                         <div className="flex gap-4">
                            <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'critical' ? 'bg-red-50 text-red-500' : n.type === 'intelligence' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                               <n.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                               <p className="text-xs font-black text-gray-900 uppercase tracking-tight mb-0.5">{n.title}</p>
                               <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{n.desc}</p>
                               <div className="flex items-center justify-between mt-2">
                                  <span className="text-[9px] font-black text-gray-300 uppercase">{n.time}</span>
                                  <button className="text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                     View <ArrowRight className="w-3 h-3" />
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border-t border-gray-100">
                    See All System Activity
                 </button>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <button type="button" className="flex items-center gap-x-3 p-1 shrink-0">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  Admin
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
