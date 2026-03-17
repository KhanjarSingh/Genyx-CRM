import React from 'react';
import type { ComparisonMode } from '../../context/DateContext';
import { useDateContext } from '../../context/DateContext';

const OPTIONS: { id: ComparisonMode; label: string }[] = [
  { id: 'off', label: 'Off' },
  { id: 'previous_period', label: 'Previous Period' },
  { id: 'same_period_last_year', label: 'Same Period Last Year' },
  { id: 'custom', label: 'Custom' },
];

export function ComparisonSelect() {
  const { comparisonMode, setComparisonMode } = useDateContext();

  return (
    <select
      value={comparisonMode}
      onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
      className="h-9 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-dark-text"
    >
      {OPTIONS.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

