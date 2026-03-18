import { useMemo, useState } from 'react';
import { Plus, Trash2, Send, Link2, CheckCircle2, X } from 'lucide-react';
import { Card, CardContent } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { useAppConfig } from '../../context/AppConfigContext';
import { demoProfiles } from '../../data/demoProfiles';
import { useLocation } from '../../context/LocationContext';

const EVENTS = ['new_alert', 'form_score_update', 'member_at_risk', 'revenue_milestone', 'member_joined', 'pod_offline'];

function Toast({ open, type, message, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className={`rounded-2xl px-4 py-3 shadow-2xl border text-sm font-bold flex items-center gap-2 ${
        type === 'success'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/30'
          : 'bg-red-50 text-red-800 border-red-100 dark:bg-red-900/20 dark:text-red-200 dark:border-red-900/30'
      }`}>
        {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
        <span>{message}</span>
        <button className="ml-2 p-1 rounded-lg hover:bg-white/40 dark:hover:bg-black/10" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Developer() {
  const { getWebhooks, setWebhooks } = useAppConfig();
  const { demoProfileId, setDemoProfile } = useLocation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [events, setEventsState] = useState(['new_alert', 'pod_offline']);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });

  const webhooks = useMemo(() => {
    const savedWebhooks = getWebhooks();
    return Array.isArray(savedWebhooks) ? savedWebhooks : [];
  }, [getWebhooks, open]);

  const addWebhook = () => {
    const next = [
      ...webhooks,
      { id: `wh_${Math.random().toString(16).slice(2)}`, url, events, enabled: true, createdAt: new Date().toISOString() },
    ];
    setWebhooks(next);
    setOpen(false);
    setUrl('');
    setEventsState(['new_alert', 'pod_offline']);
  };

  const testWebhook = async (wh) => {
    const payload = {
      event: 'new_alert',
      timestamp: new Date().toISOString(),
      data: {
        severity: 'HIGH',
        title: 'Zone Congestion',
        message: 'Free Weights at 92% capacity',
        source: { type: 'zone', label: 'Free Weights' },
      },
    };

    try {
      // mock send: we simulate success if URL looks valid
      const ok = /^https?:\/\//.test(wh.url);
      await new Promise(r => setTimeout(r, 450));
      if (!ok) throw new Error('Invalid URL');
      setToast({ open: true, type: 'success', message: `Test payload sent to ${wh.url}` });
    } catch (e) {
      setToast({ open: true, type: 'error', message: `Webhook test failed: ${e.message}` });
    } finally {
      setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
    }
  };

  return (
    <div className="space-y-8">
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />

      <div className="mb-2">
        <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Developer</h2>
        <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Webhooks + demo profile switching</p>
      </div>

      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Webhook configuration</p>
              <h3 className="mt-1 text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Outgoing webhooks</h3>
            </div>
            <Button className="h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" /> Add Webhook
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 dark:border-dark-border">
            <table className="min-w-[820px] w-full text-left">
              <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">URL</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Events</th>
                  <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {webhooks.length === 0 && (
                  <tr className="bg-white dark:bg-dark-surface">
                    <td colSpan={4} className="px-4 py-6 text-sm font-bold text-gray-500 dark:text-dark-text-secondary">No webhooks configured.</td>
                  </tr>
                )}
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="bg-white dark:bg-dark-surface">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-gray-300 dark:text-dark-text-muted" />
                        <span className="text-sm font-bold text-gray-700 dark:text-dark-text-secondary">{wh.url}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(wh.events || []).map((e) => (
                          <Badge key={e} className="bg-gray-50 border border-gray-100 text-gray-700 dark:bg-dark-elevated dark:border-dark-border dark:text-dark-text-secondary text-[10px] font-black uppercase tracking-widest">{e}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        className={`w-12 h-6 rounded-full relative transition-colors ${wh.enabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-dark-elevated'}`}
                        onClick={() => {
                          const next = webhooks.map(x => x.id === wh.id ? { ...x, enabled: !x.enabled } : x);
                          setWebhooks(next);
                        }}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${wh.enabled ? 'translate-x-6' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" className="h-9 px-3 text-[10px] font-black uppercase tracking-widest gap-2" onClick={() => testWebhook(wh)}>
                          <Send className="w-4 h-4" /> Test
                        </Button>
                        <Button
                          variant="outline"
                          className="h-9 px-3 text-[10px] font-black uppercase tracking-widest gap-2"
                          onClick={() => {
                            const next = webhooks.filter(x => x.id !== wh.id);
                            setWebhooks(next);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl">
        <CardContent className="p-8">
          <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Demo profile switcher</p>
          <h3 className="mt-1 text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Dataset profiles</h3>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(demoProfiles).map((p) => (
              <button
                key={p.id}
                onClick={() => setDemoProfile(p.id)}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  demoProfileId === p.id
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-elevated'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{p.label}</span>
                  {demoProfileId === p.id && (
                    <Badge className="bg-brand/10 text-brand border border-brand/20 text-[10px] font-black uppercase tracking-widest">Active</Badge>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-gray-500 dark:text-dark-text-secondary">
                  Members: {p.members} · Facilities: {p.facilities} · Trainers: {p.trainers}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Add Webhook</p>
                  <h3 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">New endpoint</h3>
                </div>
                <button className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-400" onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">URL</label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold"
                  />
                </div>

                <div className="rounded-2xl border border-gray-100 dark:border-dark-border bg-gray-50/40 dark:bg-dark-bg/40 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Event types</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EVENTS.map((e) => (
                      <label key={e} className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-dark-text-secondary">
                        <input
                          type="checkbox"
                          checked={events.includes(e)}
                          onChange={() => {
                            setEventsState((prev) => {
                              const set = new Set(prev);
                              if (set.has(e)) set.delete(e); else set.add(e);
                              return Array.from(set);
                            });
                          }}
                        />
                        {e}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-end gap-3">
                <Button variant="outline" className="h-10 px-5 text-[10px] font-black uppercase tracking-widest" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="h-10 px-6 text-[10px] font-black uppercase tracking-widest" onClick={addWebhook} disabled={!url || events.length === 0}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
