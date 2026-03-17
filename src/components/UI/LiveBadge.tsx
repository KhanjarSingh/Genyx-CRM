import React from 'react';

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      LIVE
    </span>
  );
}

