import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Rocket } from 'lucide-react';
import { Button } from '../UI/Button';

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem('setupProgress') || '{}');
  } catch {
    return {};
  }
}

const ITEMS = [
  { key: 'facility', label: 'Facility Profile' },
  { key: 'zones', label: 'Zones' },
  { key: 'members', label: 'Members' },
  { key: 'staff', label: 'Staff' },
  { key: 'alerts', label: 'Alerts' },
];

export function SetupChecklist({ onResume }) {
  const [open, setOpen] = useState(true);
  const progress = readProgress();

  const doneCount = useMemo(() => ITEMS.filter(i => progress[i.key]).length, [progress]);
  const allDone = doneCount === ITEMS.length || localStorage.getItem('setupComplete') === 'true';

  if (allDone) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[360px] max-w-[calc(100vw-40px)]">
      <div className="rounded-3xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl dark:shadow-black/40 overflow-hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-elevated"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Setup Checklist</p>
              <p className="text-sm font-black text-gray-900 dark:text-dark-text">
                {doneCount} of {ITEMS.length} setup steps complete
              </p>
            </div>
          </div>
          {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
        </button>

        {open && (
          <div className="px-5 pb-5">
            <div className="mt-2 space-y-2">
              {ITEMS.map((i) => (
                <div key={i.key} className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-dark-border px-4 py-3 bg-gray-50/30 dark:bg-dark-bg/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${progress[i.key] ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-dark-text-muted'}`} />
                    <span className="text-sm font-bold text-gray-700 dark:text-dark-text-secondary">{i.label}</span>
                  </div>
                  {progress[i.key] && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Done</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                className="h-10 flex-1 text-[11px] font-black uppercase tracking-widest"
                onClick={() => onResume?.()}
              >
                Resume Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

