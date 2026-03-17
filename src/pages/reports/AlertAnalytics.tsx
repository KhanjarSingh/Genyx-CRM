import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNotifications } from '../../context/NotificationContext';
import type { Notification, Severity } from '../../types/notifications';

const SEV_COLORS: Record<Severity, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#3b82f6',
};

function toCsv(rows: Record<string, string | number | boolean | null | undefined>[]) {
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const escape = (v: any) => {
    const s = v == null ? '' : String(v);
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ];
  return lines.join('\n');
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AlertAnalytics() {
  const { notifications } = useNotifications();
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Notification>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const now = new Date();
  const todayKey = now.toDateString();

  const alertsToday = useMemo(() => {
    return notifications.filter((n) => new Date(n.timestamp).toDateString() === todayKey).length;
  }, [notifications, todayKey]);

  const avgResponseTime = useMemo(() => {
    const acked = notifications.filter((n) => n.isAcknowledged && typeof n.responseTimeMinutes === 'number');
    if (acked.length === 0) return null;
    const avg = acked.reduce((s, n) => s + (n.responseTimeMinutes || 0), 0) / acked.length;
    return Math.round(avg);
  }, [notifications]);

  const mostCommonType = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of notifications) counts.set(n.type, (counts.get(n.type) || 0) + 1);
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || '—';
  }, [notifications]);

  const alertToActionRate = useMemo(() => {
    if (notifications.length === 0) return null;
    const ack = notifications.filter((n) => n.isAcknowledged).length;
    return Math.round((ack / notifications.length) * 100);
  }, [notifications]);

  const chartData = useMemo(() => {
    const days: { day: string; CRITICAL: number; HIGH: number; MEDIUM: number; LOW: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(5, 10); // MM-DD
      days.push({ day: key, CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 });
    }
    const index = new Map<string, number>();
    days.forEach((d, idx) => index.set(d.day, idx));

    for (const n of notifications) {
      const d = new Date(n.timestamp);
      const key = d.toISOString().slice(5, 10);
      const idx = index.get(key);
      if (idx != null) {
        days[idx][n.severity] += 1;
      }
    }
    return days;
  }, [notifications]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = notifications.filter((n) => {
      if (severityFilter !== 'ALL' && n.severity !== severityFilter) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        n.source.label.toLowerCase().includes(q)
      );
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    return [...base].sort((a, b) => {
      const av: any = a[sortKey];
      const bv: any = b[sortKey];
      if (sortKey === 'timestamp') return (new Date(av).getTime() - new Date(bv).getTime()) * dir;
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
    });
  }, [notifications, search, severityFilter, sortDir, sortKey]);

  const exportCsv = () => {
    const rows = filteredRows.map((n) => ({
      Timestamp: new Date(n.timestamp).toLocaleString(),
      Severity: n.severity,
      Type: n.type,
      Source: n.source.label,
      'Acknowledged By': n.acknowledgedBy || '—',
      'Response Time (min)': n.responseTimeMinutes ?? '—',
    }));
    downloadCsv(`alert-analytics-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  };

  const toggleSort = (k: keyof Notification) => {
    if (sortKey === k) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(k);
    setSortDir('desc');
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Alert Analytics</h2>
          <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">
            Operational alert volume, severity mix, and response performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2" onClick={exportCsv}>
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts Today', value: alertsToday },
          { label: 'Avg Response Time', value: avgResponseTime != null ? `${avgResponseTime} min` : '—' },
          { label: 'Most Common Type', value: mostCommonType },
          { label: 'Alert-to-Action Rate', value: alertToActionRate != null ? `${alertToActionRate}%` : '—' },
        ].map((k) => (
          <Card key={k.label} className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-[#94A3B8]">{k.label}</p>
            <p className="mt-3 text-3xl font-mono font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter tabular-nums">
              {k.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-[#F1F5F9]">Alerts per day (30D)</p>
            <p className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8] uppercase tracking-widest mt-1">Stacked by severity</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-300 dark:text-[#94A3B8]" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="h-9 rounded-xl border border-gray-200 dark:border-[#2D3748] bg-white dark:bg-[#0F172A] px-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-[#F1F5F9]"
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="CRITICAL" stackId="a" fill={SEV_COLORS.CRITICAL} />
              <Bar dataKey="HIGH" stackId="a" fill={SEV_COLORS.HIGH} />
              <Bar dataKey="MEDIUM" stackId="a" fill={SEV_COLORS.MEDIUM} />
              <Bar dataKey="LOW" stackId="a" fill={SEV_COLORS.LOW} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-[#2D3748] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-[#F1F5F9]">Alert history</p>
            <p className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8] uppercase tracking-widest mt-1">Sortable, filterable, exportable</p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search type/source/message..."
            className="h-10 w-full md:w-80 rounded-xl border border-gray-200 dark:border-[#2D3748] bg-white dark:bg-[#0F172A] px-4 text-sm font-bold text-gray-900 dark:text-[#F1F5F9] placeholder:text-gray-400 dark:placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#0F172A] border-b border-gray-100 dark:border-[#2D3748]">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] cursor-pointer" onClick={() => toggleSort('timestamp')}>Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] cursor-pointer" onClick={() => toggleSort('severity')}>Severity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] cursor-pointer" onClick={() => toggleSort('type')}>Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Source</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Acknowledged By</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#2D3748]">
              {filteredRows.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0F172A]/50 transition-colors">
                  <td className="px-6 py-5 text-[11px] font-mono font-black text-gray-900 dark:text-[#F1F5F9] tabular-nums tracking-tighter">
                    {new Date(n.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: SEV_COLORS[n.severity] }}>
                      {n.severity}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">{n.type}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-[#94A3B8]">{n.source.label}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-[#94A3B8]">{n.acknowledgedBy || '—'}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-[#94A3B8] tabular-nums">{n.responseTimeMinutes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

