import { Card, CardContent } from '../components/UI/Card';
import { CheckCircle2, Clock, KeyRound, PlugZap, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';
import { useAppConfig } from '../context/AppConfigContext';

const INTEGRATIONS = [
  { id: 'mindbody', name: 'Mindbody', description: 'Sync members & class bookings', status: 'coming_soon' },
  { id: 'stripe', name: 'Stripe', description: 'Payment data for revenue analytics', status: 'available' },
  { id: 'razorpay', name: 'Razorpay', description: 'Indian payment gateway', status: 'available' },
  { id: 'whatsapp', name: 'WhatsApp Business', description: 'Staff alert delivery', status: 'available' },
  { id: 'slack', name: 'Slack', description: 'Team notifications', status: 'available' },
  { id: 'google_calendar', name: 'Google Calendar', description: 'Coaching schedule sync', status: 'available' },
  { id: 'zapier', name: 'Zapier', description: 'Custom automation workflows', status: 'coming_soon' },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Member email campaigns', status: 'coming_soon' },
  { id: 'xero', name: 'Xero', description: 'Accounting & revenue reconciliation', status: 'coming_soon' },
  { id: 'abc_glofox', name: 'ABC Glofox', description: 'Member management sync', status: 'coming_soon' },
];

function StatusBadge({ status }) {
  if (status === 'connected') return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30">Connected</Badge>;
  if (status === 'available') return <Badge className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30">Available</Badge>;
  return <Badge className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-dark-elevated dark:text-dark-text-secondary dark:border-dark-border">Coming Soon</Badge>;
}

export function Integrations() {
  const { getIntegrations, setIntegration } = useAppConfig();
  const saved = useMemo(() => getIntegrations(), [getIntegrations]);
  const [modal, setModal] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const computed = useMemo(() => {
    return INTEGRATIONS.map((i) => {
      const savedCfg = saved[i.id];
      const isConnected = !!savedCfg?.connected;
      return { ...i, status: isConnected ? 'connected' : i.status };
    });
  }, [saved]);

  const openConnect = (integration) => {
    setModal(integration);
    setApiKey(saved[integration.id]?.apiKey || '');
  };

  const save = () => {
    if (!modal) return;
    setIntegration(modal.id, {
      connected: true,
      apiKey: apiKey || '',
      savedAt: new Date().toISOString(),
    });

    if (modal.id === 'stripe' || modal.id === 'razorpay') {
      localStorage.setItem('paymentConnected', 'true');
    }
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0F172A] transition-colors">
      <div className="bg-white dark:bg-[#1A1B2E] border-b border-gray-100 dark:border-[#2D3748] px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PlugZap className="w-4 h-4 text-brand" />
              <span className="text-[11px] font-black tracking-[4px] uppercase text-brand">GENYX Integrations</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter uppercase leading-tight">Integrations</h1>
            <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Connect your stack payments, alerts, scheduling</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <OnboardingTooltip />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {computed.map((i) => (
            <Card key={i.id} className="border-gray-100 dark:border-[#2D3748] shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-[#2D3748] flex items-center justify-center text-brand">
                      {i.status === 'connected' ? <CheckCircle2 className="w-6 h-6" /> : i.status === 'available' ? <KeyRound className="w-6 h-6" /> : <Clock className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">{i.name}</h3>
                      <p className="mt-1 text-sm font-bold text-gray-500 dark:text-[#94A3B8]">{i.description}</p>
                    </div>
                  </div>
                  <StatusBadge status={i.status} />
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <Button
                    variant={i.status === 'connected' ? 'outline' : 'default'}
                    disabled={i.status === 'coming_soon'}
                    onClick={() => i.status !== 'coming_soon' && openConnect(i)}
                    className="h-10 px-5 text-[10px] font-black uppercase tracking-widest"
                  >
                    {i.status === 'connected' ? 'Manage' : i.status === 'available' ? 'Connect' : 'Coming Soon'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Connect</p>
                  <h3 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{modal.name}</h3>
                </div>
                <button className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-400" onClick={() => setModal(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm font-bold text-gray-600 dark:text-dark-text-secondary">{modal.description}</p>

                <div className="rounded-2xl border border-gray-100 dark:border-dark-border bg-gray-50/40 dark:bg-dark-bg/40 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary">Required permissions</p>
                  <ul className="mt-2 text-sm font-bold text-gray-600 dark:text-dark-text-secondary list-disc pl-5 space-y-1">
                    <li>Read members & billing metadata</li>
                    <li>Read revenue aggregates for analytics</li>
                    <li>Send alerts to staff channels (if applicable)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">API Key / OAuth Token</label>
                  <input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste key or token"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold text-gray-900 dark:text-dark-text"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-end gap-3">
                <Button variant="outline" className="h-10 px-5 text-[10px] font-black uppercase tracking-widest" onClick={() => setModal(null)}>
                  Cancel
                </Button>
                <Button className="h-10 px-6 text-[10px] font-black uppercase tracking-widest" onClick={save}>
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

