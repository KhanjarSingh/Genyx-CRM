import React, { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { DatePresets, useDateContext } from '../../context/DateContext';

const PRESETS = ['Today', '7D', '30D', 'This Month', 'Last Quarter', 'Custom'] as const;

function toInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function fromInputValue(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function DateRangePicker() {
  const { selectedRange, setSelectedRange } = useDateContext();
  const [customFrom, setCustomFrom] = useState(() => toInputValue(selectedRange.start));
  const [customTo, setCustomTo] = useState(() => toInputValue(selectedRange.end));

  const isCustom = selectedRange.preset === 'Custom';

  const label = useMemo(() => {
    const start = selectedRange.start.toLocaleDateString();
    const end = selectedRange.end.toLocaleDateString();
    return `${selectedRange.preset}: ${start} – ${end}`;
  }, [selectedRange]);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    if (p === 'Custom') {
      const base = DatePresets.getPresetRange('Custom');
      setSelectedRange(base);
      setCustomFrom(toInputValue(base.start));
      setCustomTo(toInputValue(base.end));
      return;
    }
    const next = DatePresets.getPresetRange(p);
    setSelectedRange(next);
  };

  const applyCustom = (fromStr: string, toStr: string) => {
    const start = fromInputValue(fromStr);
    const end = fromInputValue(toStr);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    setSelectedRange({ start, end, preset: 'Custom' });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 shadow-sm">
        <Calendar className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
        <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-dark-text-secondary whitespace-nowrap">
          {label}
        </span>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => applyPreset(p)}
            className={`h-8 rounded-full border px-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
              selectedRange.preset === p
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-elevated'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => {
              const v = e.target.value;
              setCustomFrom(v);
              applyCustom(v, customTo);
            }}
            className="h-9 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-3 text-xs font-bold text-gray-900 dark:text-dark-text"
          />
          <span className="text-xs font-black text-gray-300 dark:text-dark-text-muted">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => {
              const v = e.target.value;
              setCustomTo(v);
              applyCustom(customFrom, v);
            }}
            className="h-9 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-3 text-xs font-bold text-gray-900 dark:text-dark-text"
          />
        </div>
      )}
    </div>
  );
}

