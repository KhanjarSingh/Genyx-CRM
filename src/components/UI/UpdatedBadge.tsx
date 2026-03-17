import React from 'react';
import { Clock } from 'lucide-react';

export function UpdatedBadge({ minutesAgo = 6 }: { minutesAgo?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-dark-text-secondary">
      <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-dark-text-muted" />
      Updated {minutesAgo} min ago
    </span>
  );
}

