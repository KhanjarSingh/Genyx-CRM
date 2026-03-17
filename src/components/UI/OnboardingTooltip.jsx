import { useEffect, useMemo, useState } from 'react';

import { X } from 'lucide-react';
import { useLocation as useRouterLocation } from 'react-router-dom';

const TOOLTIP_TEXT = {
  '/': 'Your Facility Overview a live snapshot of everything happening in your gym right now.',
  '/live-activity': 'Monitor all zones in real time. Camera feeds update every 5 seconds and automatically flag form issues.',
  '/member-analytics': 'Your full member directory with AI-tracked form scores, churn risk, and visit patterns.',
  '/training-quality': 'The Exercise Quality Index ranks your most-performed movements by coaching quality with dollar values attached.',
  '/revenue-sales': 'Track MRR, manage AI-generated PT leads, and see the direct revenue impact of Genyx.',
};

function loadSeen() {
  try {
    return JSON.parse(localStorage.getItem('tooltipsSeen') || '{}');
  } catch {
    return {};
  }
}

function saveSeen(obj) {
  localStorage.setItem('tooltipsSeen', JSON.stringify(obj));
}

export function resetTooltipsSeen() {
  localStorage.removeItem('tooltipsSeen');
}

export function OnboardingTooltip() {
  const { pathname } = useRouterLocation();
  const text = TOOLTIP_TEXT[pathname];
  const [open, setOpen] = useState(false);

  const key = useMemo(() => `page:${pathname}`, [pathname]);

  useEffect(() => {
    if (!text) return;
    const seen = loadSeen();
    if (seen[key]) return;

    setOpen(true);
    const t = setTimeout(() => {
      setOpen(false);
      const next = loadSeen();
      next[key] = true;
      saveSeen(next);
    }, 8000);
    return () => clearTimeout(t);
  }, [key, text]);

  if (!text || !open) return null;

  return (
    <div className="w-full rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/15 px-5 py-4 text-blue-900 dark:text-blue-200">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold leading-relaxed">{text}</p>
        <button
          onClick={() => {
            setOpen(false);
            const next = loadSeen();
            next[key] = true;
            saveSeen(next);
          }}
          className="p-1.5 rounded-lg hover:bg-blue-100/60 dark:hover:bg-blue-900/20"
          aria-label="Dismiss tooltip"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

