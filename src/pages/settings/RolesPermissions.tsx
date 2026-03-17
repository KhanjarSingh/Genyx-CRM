import React, { useMemo } from 'react';
import { rolePermissions, type Role } from '../../config/rolePermissions';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABEL: Record<Role, string> = {
  executive: 'Executive',
  facility_manager: 'Facility Manager',
  head_coach: 'Head Coach',
  trainer: 'Trainer',
  front_desk: 'Front Desk',
};

const MODULES: { key: string; label: string; route: string }[] = [
  { key: 'corporate', label: 'Corporate', route: '/corporate' },
  { key: 'facility', label: 'Facility', route: '/' },
  { key: 'live', label: 'Live Activity', route: '/live-activity' },
  { key: 'members', label: 'Member Analytics', route: '/member-analytics' },
  { key: 'training', label: 'Training', route: '/training-quality' },
  { key: 'revenue', label: 'Revenue', route: '/revenue-sales' },
  { key: 'reports', label: 'Reports', route: '/reports' },
  { key: 'health', label: 'Health', route: '/health' },
  { key: 'settings', label: 'Settings', route: '/settings' },
];

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

export default function RolesPermissions() {
  const { currentUser, setRole, staff, setStaffRole, permissionsByRole, setPermissionsByRole } = useAuth();

  const roles = useMemo(() => Object.keys(rolePermissions) as Role[], []);

  const setAllowed = (role: Role, route: string, allowed: boolean) => {
    setPermissionsByRole((prev) => {
      const current = prev[role];
      const nextAllowed = new Set(current.allowedRoutes);
      if (allowed) nextAllowed.add(route);
      else nextAllowed.delete(route);

      return {
        ...prev,
        [role]: {
          ...current,
          allowedRoutes: Array.from(nextAllowed),
        },
      };
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Roles &amp; Permissions</h2>
          <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">
            Demo auth: switch roles instantly and see dashboards adapt
          </p>
        </div>

        <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px]">Current role</p>
            <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{ROLE_LABEL[currentUser.role]}</p>
          </div>
          <select
            value={currentUser.role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-10 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-3 text-sm font-bold text-gray-900 dark:text-dark-text"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Staff directory</h3>
          <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">
            Change a role to instantly update mock access
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-elevated/30 transition-colors">
                  <td className="px-6 py-5 font-black text-gray-900 dark:text-dark-text uppercase tracking-tight text-sm">{s.name}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-dark-text-secondary">{s.email}</td>
                  <td className="px-6 py-5">
                    <select
                      value={s.role}
                      onChange={(e) => setStaffRole(s.id, e.target.value as Role)}
                      className="h-9 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-3 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-dark-text"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${s.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40' : 'bg-gray-100 dark:bg-dark-elevated text-gray-700 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission matrix */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Permission matrix</h3>
          <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">
            Toggle module access per role (updates sidebar + route guards)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Role</th>
                {MODULES.map((m) => (
                  <th key={m.key} className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {roles.map((r) => (
                <tr key={r} className="hover:bg-gray-50/40 dark:hover:bg-dark-elevated/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-dark-text whitespace-nowrap">
                    {ROLE_LABEL[r]}
                  </td>
                  {MODULES.map((m) => {
                    const checked = permissionsByRole[r].allowedRoutes.includes(m.route);
                    return (
                      <td key={m.key} className="px-4 py-4 text-center">
                        <Toggle checked={checked} onChange={(v) => setAllowed(r, m.route, v)} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

