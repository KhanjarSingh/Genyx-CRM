import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ComparisonMode = 'off' | 'previous_period' | 'same_period_last_year' | 'custom';

export type SelectedRange = {
  start: Date;
  end: Date;
  preset: string;
};

export type DateRange = { start: Date; end: Date };

type DateContextValue = {
  selectedRange: SelectedRange;
  setSelectedRange: React.Dispatch<React.SetStateAction<SelectedRange>>;
  comparisonMode: ComparisonMode;
  setComparisonMode: React.Dispatch<React.SetStateAction<ComparisonMode>>;
  comparisonRange: DateRange | null;
  setComparisonRange: React.Dispatch<React.SetStateAction<DateRange | null>>;
};

const DateContext = createContext<DateContextValue | null>(null);

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function daysBetweenInclusive(start: Date, end: Date) {
  const a = startOfDay(start).getTime();
  const b = startOfDay(end).getTime();
  const diff = Math.round((b - a) / (24 * 60 * 60 * 1000));
  return diff + 1;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function addYears(d: Date, years: number) {
  const x = new Date(d);
  x.setFullYear(x.getFullYear() + years);
  return x;
}

function getPresetRange(preset: string): SelectedRange {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (preset === 'Today') return { start: todayStart, end: todayEnd, preset };
  if (preset === '7D') return { start: startOfDay(addDays(now, -6)), end: todayEnd, preset };
  if (preset === '30D') return { start: startOfDay(addDays(now, -29)), end: todayEnd, preset };
  if (preset === 'This Month') {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: startOfDay(s), end: endOfDay(e), preset };
  }
  if (preset === 'Last Quarter') {
    const q = Math.floor(now.getMonth() / 3);
    const startMonth = (q - 1) * 3;
    const year = startMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const sm = (startMonth + 12) % 12;
    const s = new Date(year, sm, 1);
    const e = new Date(year, sm + 3, 0);
    return { start: startOfDay(s), end: endOfDay(e), preset };
  }

  // Custom falls back to last 7 days initially
  return { start: startOfDay(addDays(now, -6)), end: todayEnd, preset: 'Custom' };
}

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedRange, setSelectedRange] = useState<SelectedRange>(() => getPresetRange('30D'));
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('off');
  const [comparisonRange, setComparisonRange] = useState<DateRange | null>(null);

  useEffect(() => {
    if (comparisonMode === 'off') {
      setComparisonRange(null);
      return;
    }

    if (comparisonMode === 'custom') return;

    const days = daysBetweenInclusive(selectedRange.start, selectedRange.end);
    if (comparisonMode === 'previous_period') {
      const end = endOfDay(addDays(selectedRange.start, -1));
      const start = startOfDay(addDays(end, -(days - 1)));
      setComparisonRange({ start, end });
      return;
    }

    if (comparisonMode === 'same_period_last_year') {
      setComparisonRange({
        start: startOfDay(addYears(selectedRange.start, -1)),
        end: endOfDay(addYears(selectedRange.end, -1)),
      });
    }
  }, [comparisonMode, selectedRange.end, selectedRange.start]);

  const value = useMemo<DateContextValue>(
    () => ({
      selectedRange,
      setSelectedRange,
      comparisonMode,
      setComparisonMode,
      comparisonRange,
      setComparisonRange,
    }),
    [comparisonMode, comparisonRange, selectedRange]
  );

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}

export function useDateContext() {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error('useDateContext must be used within a DateProvider');
  return ctx;
}

export const DatePresets = {
  getPresetRange,
};

