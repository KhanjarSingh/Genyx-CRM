import React, { useMemo, useState } from 'react';
import type { Role } from '../../config/rolePermissions';

type AlertType = 'Form Correction' | 'Zone Congestion' | 'System Health' | 'Revenue Milestone' | 'PT Lead Identified';

const ROLES: { id: Role; label: string }[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'facility_manager', label: 'Facility Manager' },
  { id: 'head_coach', label: 'Head Coach' },
  { id: 'trainer', label: 'Trainer' },
  { id: 'front_desk', label: 'Front Desk' },
];

const DEFAULTS: Record<AlertType, Role> = {
  'Form Correction': 'head_coach',
  'Zone Congestion': 'front_desk',
  'System Health': 'facility_manager',
  'Revenue Milestone': 'facility_manager',
  'PT Lead Identified': 'facility_manager',
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-dark-elevated'}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function AlertRouting() {
  const alertTypes = useMemo(() => Object.keys(DEFAULTS) as AlertType[], []);

  const [matrix, setMatrix] = useState<Record<AlertType, Record<Role, boolean>>>(() => {
    const init: any = {};
    for (const t of alertTypes) {
      init[t] = {};
      for (const r of ROLES) init[t][r.id] = DEFAULTS[t] === r.id;
    }
    return init;
  });

  const toggle = (type: AlertType, role: Role, v: boolean) => {
    setMatrix((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [role]: v,
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Alert Routing</h2>
        <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">
          Route alerts to the right roles (demo matrix)
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">
                  Alert Type
                </th>
                {ROLES.map((r) => (
                  <th key={r.id} className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {alertTypes.map((t) => (
                <tr key={t} className="hover:bg-gray-50/40 dark:hover:bg-dark-elevated/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-dark-text whitespace-nowrap">
                    {t}
                  </td>
                  {ROLES.map((r) => (
                    <td key={r.id} className="px-4 py-4 text-center">
                      <Toggle checked={matrix[t][r.id]} onChange={(v) => toggle(t, r.id, v)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

