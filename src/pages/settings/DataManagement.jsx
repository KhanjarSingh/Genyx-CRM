import { useMemo } from 'react';
import { Download, Shield, FileJson, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { DataTable } from '../../components/UI/DataTable';
import { useAppConfig } from '../../context/AppConfigContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const lines = [headers.join(',')];
  rows.forEach(r => lines.push(headers.map(h => esc(r[h])).join(',')));
  return lines.join('\n');
}

function makeAuditLog() {
  const roles = ['Executive', 'Facility Manager', 'Head Coach', 'Trainer', 'Front Desk'];
  const modules = ['Member Analytics', 'Training Quality', 'Revenue & Sales', 'Reports', 'System Health', 'Settings'];
  const actions = [
    'Viewed member profile',
    'Exported report',
    'Acknowledged alert',
    'Changed role permissions',
    'Updated alert routing',
    'Downloaded audit log',
    'Viewed revenue pipeline',
    'Switched demo profile',
  ];
  const users = ['Arjun Mehta', 'Sarah Miller', 'Neha Kapoor', 'Daniel Wong', 'Priya Singh'];
  const base = new Date('2026-03-15T09:42:00');

  return Array.from({ length: 20 }).map((_, i) => {
    const ts = new Date(base.getTime() - i * 1000 * 60 * 47);
    const role = roles[i % roles.length];
    const module = modules[i % modules.length];
    const action = actions[i % actions.length];
    const user = users[i % users.length];
    const ip = `192.168.1.${42 + i}`;
    return {
      timestamp: ts.toISOString().replace('T', ' ').slice(0, 16),
      user,
      role,
      action,
      module,
      ip,
    };
  });
}

export default function DataManagement() {
  const { compliance, setCompliance } = useAppConfig();
  const { currentUser } = useAuth();
  const { dataset } = useLocation();

  const auditRows = useMemo(() => makeAuditLog(), []);

  const retentionOptions = [
    { id: '30_days', label: '30 days' },
    { id: '90_days', label: '90 days' },
    { id: '1_year', label: '1 year' },
    { id: 'indefinite', label: 'Indefinite' },
  ];

  const auditColumns = useMemo(() => ([
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'user', header: 'User' },
    { key: 'role', header: 'Role' },
    { key: 'action', header: 'Action' },
    { key: 'module', header: 'Module' },
    { key: 'ip', header: 'IP Address' },
  ]), []);

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
      dataset,
    };
    downloadFile('genyx-export.json', JSON.stringify(payload, null, 2), 'application/json');
  };

  const exportCsv = () => {
    const members = (dataset?.members || []).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      plan: m.plan,
      joinDate: m.joinDate,
      status: m.status,
      churnProbability: m.churnProbability,
      formScore: m.formScore,
    }));
    downloadFile('genyx-members.csv', toCsv(members), 'text/csv');
  };

  const exportAudit = () => {
    downloadFile('genyx-audit-log.csv', toCsv(auditRows), 'text/csv');
  };

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Data Management</h2>
        <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Exports, retention, compliance</p>
      </div>

      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Export</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button className="h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={exportCsv}>
              <FileSpreadsheet className="w-4 h-4" /> Export All Data as CSV
            </Button>
            <Button variant="outline" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={exportJson}>
              <FileJson className="w-4 h-4" /> Export All Data as JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Data retention policy</p>
          <div className="mt-3 max-w-md">
            <select
              value={compliance.retention}
              onChange={(e) => setCompliance((p) => ({ ...p, retention: e.target.value }))}
              className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold"
            >
              {retentionOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Compliance</p>
              <h3 className="mt-1 text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Anonymization modes</h3>
            </div>
            <Shield className="w-5 h-5 text-gray-300 dark:text-dark-text-muted" />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'gdpr',
                label: 'GDPR Mode (EU compliance)',
                desc: 'When ON: member names show as Member #XXXX',
                value: compliance.gdprMode,
                onToggle: () => setCompliance((p) => ({ ...p, gdprMode: !p.gdprMode })),
              },
              {
                id: 'dpdpa',
                label: 'DPDPA Mode (India Data Protection Act)',
                desc: 'When ON: anonymization + consent timestamps included in records',
                value: compliance.dpdpaMode,
                onToggle: () => setCompliance((p) => ({ ...p, dpdpaMode: !p.dpdpaMode })),
              },
            ].map((x) => (
              <div key={x.id} className="rounded-2xl border border-gray-100 dark:border-dark-border bg-gray-50/40 dark:bg-dark-bg/40 p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{x.label}</p>
                  <p className="mt-1 text-xs font-bold text-gray-500 dark:text-dark-text-secondary">{x.desc}</p>
                </div>
                <button className={`w-12 h-6 rounded-full relative transition-colors ${x.value ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-dark-elevated'}`} onClick={x.onToggle}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${x.value ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            ))}
          </div>

          {(compliance.gdprMode || compliance.dpdpaMode) && (
            <div className="mt-4">
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">
                Anonymization enabled
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Audit log</p>
              <h3 className="mt-1 text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Activity trail</h3>
            </div>
            <Button variant="outline" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={exportAudit}>
              <Download className="w-4 h-4" /> Export Audit Log
            </Button>
          </div>

          <div className="mt-5">
            <DataTable
              tableId="audit-log"
              columns={auditColumns}
              rows={auditRows}
              bulkActions={[]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

