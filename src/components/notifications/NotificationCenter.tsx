import React, { useMemo, useState } from 'react';
import { X, Check, Trash2, ArrowUpRight, BellRing, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { SeverityConfig, minutesAgo, type Notification } from '../../types/notifications';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../UI/EmptyState';

type Tab = 'all' | 'unread' | 'critical' | 'assigned';

function SeverityPill({ severity }: { severity: Notification['severity'] }) {
  const cfg = SeverityConfig[severity];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${cfg.pillClass}`}>
      {cfg.label}
    </span>
  );
}

export function NotificationCenter({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifications, markAllRead, acknowledge, dismiss, escalate } = useNotifications();
  const { currentUser } = useAuth();
  const [tab, setTab] = useState<Tab>('all');

  const filtered = useMemo(() => {
    const base = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (tab === 'unread') return base.filter((n) => !n.isRead);
    if (tab === 'critical') return base.filter((n) => n.severity === 'CRITICAL');
    if (tab === 'assigned') return base.filter((n) => n.assignedTo === currentUser.role);
    return base;
  }, [currentUser.role, notifications, tab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-dark-surface border-l border-gray-100 dark:border-dark-border shadow-2xl dark:shadow-black/40 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-dark-text">
              Notification Center
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="h-8 rounded-xl border border-gray-200 dark:border-dark-border px-3 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-400 dark:text-dark-text-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 dark:border-dark-border flex items-center gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'critical', label: 'Critical' },
            { id: 'assigned', label: 'Assigned to Me' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`h-8 rounded-full px-3 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                tab === t.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-elevated'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-dark-border">
          {filtered.length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={<CheckCircle2 className="w-6 h-6" />}
                title="All clear"
                description="No alerts your facility is running smoothly"
              />
            </div>
          )}

          {filtered.map((n) => (
            <div key={n.id} className={`p-4 ${n.isRead ? '' : 'bg-emerald-50/20 dark:bg-emerald-900/10'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <SeverityPill severity={n.severity} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-dark-text-muted">
                      {minutesAgo(n.timestamp)} min ago
                    </span>
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">
                    {n.title}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-gray-500 dark:text-dark-text-secondary leading-relaxed">
                    {n.message}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-muted">
                    Source: {n.source.label}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => acknowledge(n.id, currentUser.role)}
                  className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Acknowledge
                </button>
                <button
                  type="button"
                  onClick={() => dismiss(n.id)}
                  className="h-9 w-20 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => escalate(n.id)}
                  className="h-9 w-24 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-900/15 text-[10px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-300 hover:bg-orange-100/70 dark:hover:bg-orange-900/25 flex items-center justify-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" /> Escalate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

