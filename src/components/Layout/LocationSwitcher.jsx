import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from '../../context/LocationContext';
import { MapPin, ChevronDown, Check, Search } from 'lucide-react';

export function LocationSwitcher() {
  const { currentLocation, allLocations, setLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group locations by region
  const groupedLocations = allLocations.reduce((acc, loc) => {
    if (!acc[loc.region]) {
      acc[loc.region] = [];
    }
    acc[loc.region].push(loc);
    return acc;
  }, {});

  // Filter based on search query
  const filteredGroups = Object.entries(groupedLocations).reduce((acc, [region, locations]) => {
    const filteredLocs = locations.filter(loc =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredLocs.length > 0) {
      acc[region] = filteredLocs;
    }
    return acc;
  }, {});

  const handleSelect = (id) => {
    setLocation(id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="flex flex-col items-start translate-y-0.5">
           <span className="text-[9px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest leading-none">Current Facility</span>
           <span className="text-sm font-black text-gray-900 dark:text-dark-text leading-tight truncate max-w-[140px] sm:max-w-[200px]">{currentLocation?.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-dark-text-muted ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl dark:shadow-black/40 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
           <div className="p-3 border-b border-gray-50 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
               <input
                 type="text"
                 placeholder="Search facilities..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white dark:bg-dark-input border border-gray-200 dark:border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-300 dark:focus:border-brand focus:ring-1 focus:ring-emerald-300 dark:focus:ring-brand/30 transition-all font-medium text-gray-900 dark:text-dark-text"
               />
             </div>
           </div>

           <div className="max-h-[320px] overflow-y-auto p-2">
             {Object.keys(filteredGroups).length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500 dark:text-dark-text-secondary">No facilities found.</div>
             ) : (
                Object.entries(filteredGroups).map(([region, locations]) => (
                  <div key={region} className="mb-2 last:mb-0">
                    <div className="px-3 py-1.5 text-[10px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest sticky top-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur z-10">
                      {region} Region
                    </div>
                    <div>
                      {locations.map(loc => (
                        <button
                          key={loc.id}
                          onClick={() => handleSelect(loc.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${currentLocation?.id === loc.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-700 dark:text-dark-text-secondary'}`}
                        >
                           <div className="flex flex-col">
                              <span className={`text-xs font-bold ${currentLocation?.id === loc.id ? 'text-emerald-800 dark:text-emerald-300' : 'text-gray-900 dark:text-dark-text'}`}>{loc.name}</span>
                              <span className="text-[10px] text-gray-500 dark:text-dark-text-muted">{loc.memberCount} members</span>
                           </div>
                           {currentLocation?.id === loc.id && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
             )}
           </div>
           <div className="p-2 border-t border-gray-50 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50">
              <button
                onClick={() => {
                   window.location.href = '/corporate';
                   setIsOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-brand text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-brand/90 transition-colors shadow-sm"
              >
                 View Corporate Rollup
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
