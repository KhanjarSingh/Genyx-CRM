import { useEffect, useMemo, useState } from 'react';
import { X, Plus, UploadCloud } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';

const ROLE_OPTIONS = ['executive', 'facility_manager', 'head_coach', 'trainer', 'front_desk'];
const ALERT_TYPES = ['Form Correction', 'Zone Congestion', 'System Health', 'Revenue Milestone', 'PT Lead Identified'];

const DEFAULT_ALERT_ROUTING = {
  'Form Correction': ['head_coach'],
  'Zone Congestion': ['front_desk'],
  'System Health': ['facility_manager'],
  'Revenue Milestone': ['facility_manager'],
  'PT Lead Identified': ['facility_manager'],
};

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem('setupProgress') || '{}');
  } catch {
    return {};
  }
}

function writeProgress(p) {
  localStorage.setItem('setupProgress', JSON.stringify(p));
}

function markComplete(stepKey) {
  const p = readProgress();
  p[stepKey] = true;
  writeProgress(p);
}

function firstIncompleteStepIndex() {
  const p = readProgress();
  const keys = ['facility', 'zones', 'members', 'staff', 'alerts'];
  const idx = keys.findIndex(k => !p[k]);
  return idx === -1 ? 0 : idx;
}

export function SetupWizard({ open, initialStep = 0, onClose }) {
  const [step, setStep] = useState(initialStep);
  const [csvPreview, setCsvPreview] = useState([]);

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [initialStep, open]);

  const stepKey = useMemo(() => (['facility', 'zones', 'members', 'staff', 'alerts'][step] || 'facility'), [step]);

  const [facility, setFacility] = useState({
    name: '',
    address: '',
    city: '',
    timezone: 'Asia/Kolkata',
    openTime: '06:00',
    closeTime: '23:00',
    squareFootage: 30000,
    maxCapacity: 145,
  });

  const [zones, setZones] = useState([
    { name: 'Free Weights', capacity: 45, podId: 'POD-001' },
  ]);

  const [team, setTeam] = useState([
    { name: 'Sarah Miller', email: 'sarah@genyx.ai', role: 'facility_manager' },
  ]);

  const [routing, setRouting] = useState(DEFAULT_ALERT_ROUTING);

  const progressPct = Math.round(((step + 1) / 5) * 100);

  if (!open) return null;

  const skip = () => {
    onClose?.();
  };

  const back = () => setStep(s => Math.max(0, s - 1));
  const next = () => setStep(s => Math.min(4, s + 1));

  const continueStep = () => {
    markComplete(stepKey);
    if (step < 4) next();
  };

  const completeSetup = () => {
    ['facility', 'zones', 'members', 'staff', 'alerts'].forEach(k => markComplete(k));
    localStorage.setItem('setupComplete', 'true');
    // heuristics: once zones exist, we treat pods+CV active; once member import done, payment may still be off.
    localStorage.setItem('podsConnected', 'true');
    localStorage.setItem('cvActive', 'true');
    onClose?.();
  };

  const onCsvFile = async (file) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean).slice(0, 6);
    const rows = lines.map(l => l.split(',').map(x => x.trim()));
    setCsvPreview(rows);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={skip} />

      <div className="absolute inset-0 flex flex-col">
        {/* Progress bar */}
        <div className="px-6 py-4 bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">
                Setup Wizard
              </p>
              <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">
                Step {step + 1} of 5
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-[11px] font-bold text-gray-400 hover:text-gray-700 dark:hover:text-dark-text" onClick={skip}>
                Skip for now
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-400 dark:text-dark-text-muted" onClick={onClose}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 w-full h-2 rounded-full bg-gray-100 dark:bg-dark-elevated overflow-hidden">
            <div className="h-2 bg-emerald-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {step === 0 && (
              <Card className="p-6 rounded-3xl">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Facility Profile</h2>
                <p className="text-xs font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mt-1">Basic identity & operations</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Facility Name', key: 'name', type: 'text' },
                    { label: 'Address', key: 'address', type: 'text' },
                    { label: 'City', key: 'city', type: 'text' },
                    { label: 'Timezone', key: 'timezone', type: 'select', options: ['Asia/Kolkata', 'Europe/London', 'America/New_York'] },
                    { label: 'Opening Time', key: 'openTime', type: 'time' },
                    { label: 'Closing Time', key: 'closeTime', type: 'time' },
                    { label: 'Total Sq Footage', key: 'squareFootage', type: 'number' },
                    { label: 'Max Capacity', key: 'maxCapacity', type: 'number' },
                  ].map(f => (
                    <div key={f.key} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">{f.label}</label>
                      {f.type === 'select' ? (
                        <select
                          value={facility[f.key]}
                          onChange={(e) => setFacility(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold text-gray-900 dark:text-dark-text"
                        >
                          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          value={facility[f.key]}
                          onChange={(e) => setFacility(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                          className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold text-gray-900 dark:text-dark-text"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {step === 1 && (
              <Card className="p-6 rounded-3xl">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Zone Configuration</h2>
                <p className="text-xs font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mt-1">Define zones and pods</p>

                <div className="mt-6 space-y-3">
                  {zones.map((z, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl border border-gray-100 dark:border-dark-border bg-gray-50/40 dark:bg-dark-bg/40">
                      <input className="h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold" value={z.name} onChange={(e) => setZones(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Zone Name" />
                      <input className="h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold" type="number" value={z.capacity} onChange={(e) => setZones(prev => prev.map((x, idx) => idx === i ? { ...x, capacity: Number(e.target.value) } : x))} placeholder="Max Capacity" />
                      <div className="flex gap-2">
                        <input className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold" value={z.podId} onChange={(e) => setZones(prev => prev.map((x, idx) => idx === i ? { ...x, podId: e.target.value } : x))} placeholder="Camera Pod ID" />
                        <button className="h-11 w-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-400 hover:text-red-500" onClick={() => setZones(prev => prev.filter((_, idx) => idx !== i))}>
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => setZones(prev => [...prev, { name: '', capacity: 20, podId: '' }])}>
                    <Plus className="w-4 h-4" /> Add Zone
                  </Button>
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6 rounded-3xl">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Member Import</h2>
                <p className="text-xs font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mt-1">Upload a CSV roster</p>

                <div className="mt-6 grid gap-6">
                  <div className="rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-gray-50/40 dark:bg-dark-bg/40 p-8 text-center">
                    <UploadCloud className="w-10 h-10 text-gray-300 dark:text-dark-text-muted mx-auto" />
                    <p className="mt-3 text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">CSV Upload</p>
                    <p className="mt-1 text-xs font-bold text-gray-400 dark:text-dark-text-secondary">Expected columns: Name, Email, Phone, Plan, Join Date</p>
                    <input
                      type="file"
                      accept=".csv"
                      className="mt-4 block w-full text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onCsvFile(file);
                      }}
                    />
                    <button className="mt-4 text-xs font-bold text-emerald-700 dark:text-emerald-400 underline" onClick={() => { markComplete('members'); next(); }}>
                      Add members manually later
                    </button>
                  </div>

                  {csvPreview.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-dark-border">
                      <table className="w-full text-left text-sm">
                        <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                          {csvPreview.map((r, i) => (
                            <tr key={i} className="bg-white dark:bg-dark-surface">
                              {r.slice(0, 5).map((c, j) => (
                                <td key={j} className="px-4 py-3 text-xs font-bold text-gray-700 dark:text-dark-text-secondary">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card className="p-6 rounded-3xl">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Staff & Roles</h2>
                <p className="text-xs font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mt-1">Invite your team</p>

                <div className="mt-6 space-y-3">
                  {team.map((m, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl border border-gray-100 dark:border-dark-border bg-gray-50/40 dark:bg-dark-bg/40">
                      <input className="h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold" value={m.name} onChange={(e) => setTeam(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Name" />
                      <input className="h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold" value={m.email} onChange={(e) => setTeam(prev => prev.map((x, idx) => idx === i ? { ...x, email: e.target.value } : x))} placeholder="Email" />
                      <div className="flex gap-2">
                        <select className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold" value={m.role} onChange={(e) => setTeam(prev => prev.map((x, idx) => idx === i ? { ...x, role: e.target.value } : x))}>
                          {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button className="h-11 w-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-400 hover:text-red-500" onClick={() => setTeam(prev => prev.filter((_, idx) => idx !== i))}>
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => setTeam(prev => [...prev, { name: '', email: '', role: 'trainer' }])}>
                    <Plus className="w-4 h-4" /> Add Team Member
                  </Button>
                </div>
              </Card>
            )}

            {step === 4 && (
              <Card className="p-6 rounded-3xl">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Alert Preferences</h2>
                <p className="text-xs font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mt-1">Smart routing defaults included</p>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 dark:border-dark-border">
                  <table className="min-w-[720px] w-full text-left">
                    <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Alert Type</th>
                        {ROLE_OPTIONS.map(r => (
                          <th key={r} className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                      {ALERT_TYPES.map(t => (
                        <tr key={t} className="bg-white dark:bg-dark-surface">
                          <td className="px-4 py-3 text-xs font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{t}</td>
                          {ROLE_OPTIONS.map(r => {
                            const checked = (routing[t] || []).includes(r);
                            return (
                              <td key={r} className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    setRouting(prev => {
                                      const set = new Set(prev[t] || []);
                                      if (set.has(r)) set.delete(r); else set.add(r);
                                      return { ...prev, [t]: Array.from(set) };
                                    });
                                  }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button className="h-11 px-6 text-[11px] font-black uppercase tracking-widest" onClick={completeSetup}>
                    Complete Setup
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
          <Button variant="outline" className="h-10 px-5 text-[11px] font-black uppercase tracking-widest" onClick={back} disabled={step === 0}>
            Back
          </Button>
          <Button className="h-10 px-6 text-[11px] font-black uppercase tracking-widest" onClick={step === 4 ? completeSetup : continueStep}>
            {step === 4 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function shouldShowSetupWizard() {
  return localStorage.getItem('setupComplete') !== 'true';
}

export function getResumeStep() {
  return firstIncompleteStepIndex();
}

