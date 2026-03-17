import { useMemo } from 'react';
import { Info } from 'lucide-react';

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function pillStyles(score) {
  if (score > 75) return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-600/15 dark:ring-emerald-500/25' };
  if (score >= 50) return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-800 dark:text-amber-300', ring: 'ring-amber-600/15 dark:ring-amber-500/25' };
  return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', ring: 'ring-red-600/15 dark:ring-red-500/25' };
}

export function ImpactScore({
  movementQualityImprovement = 72,
  ptConversionRate = 63,
  churnReduction = 58,
  injuryReduction = 69,
}) {
  const composite = useMemo(() => {
    const score =
      (movementQualityImprovement * 0.25) +
      (ptConversionRate * 0.25) +
      (churnReduction * 0.25) +
      (injuryReduction * 0.25);
    return Math.round(clamp(score, 0, 100));
  }, [churnReduction, injuryReduction, movementQualityImprovement, ptConversionRate]);

  const styles = pillStyles(composite);

  const breakdown = [
    { label: 'Movement quality improvement', value: movementQualityImprovement },
    { label: 'PT conversion rate', value: ptConversionRate },
    { label: 'Churn reduction', value: churnReduction },
    { label: 'Injury reduction', value: injuryReduction },
  ];

  return (
    <div className="relative group">
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${styles.bg} ${styles.text} ring-1 ${styles.ring}`}>
        <span className="text-[10px] font-black uppercase tracking-widest">Impact</span>
        <span className="font-mono font-black tabular-nums">{composite}</span>
        <Info className="w-3.5 h-3.5 opacity-70" />
      </div>

      <div className="pointer-events-none absolute right-0 top-full mt-2 w-72 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
        <div className="rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-xl dark:shadow-black/40 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/70 dark:bg-dark-bg/60 border-b border-gray-100 dark:border-dark-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-dark-text-secondary">Genyx Impact Score</span>
              <span className={`text-xs font-black tabular-nums ${styles.text}`}>{composite}/100</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-gray-500 dark:text-dark-text-secondary">{b.label}</span>
                <span className="font-mono font-black text-gray-900 dark:text-dark-text tabular-nums">{Math.round(clamp(b.value))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

