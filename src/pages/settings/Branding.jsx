import { useEffect, useMemo, useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { useAppConfig } from '../../context/AppConfigContext';

export default function Branding() {
  const { branding, setBranding, resetBranding } = useAppConfig();
  const [local, setLocal] = useState(branding);

  useEffect(() => setLocal(branding), [branding]);

  const onLogo = async (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLocal((p) => ({ ...p, logoDataUrl: String(reader.result) }));
      setBranding((p) => ({ ...p, logoDataUrl: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const preview = useMemo(() => {
    const name = local.appName || 'Genyx CRM';
    return { name };
  }, [local.appName]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-7 space-y-6">
        <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Branding</h2>
              <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">White-label controls</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Logo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && onLogo(e.target.files[0])}
                  className="block w-full text-sm"
                />
                <p className="text-[11px] font-bold text-gray-400 dark:text-dark-text-muted">Replaces Sidebar app text with your logo.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">App Name</label>
                <input
                  value={local.appName || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLocal((p) => ({ ...p, appName: v }));
                    setBranding((p) => ({ ...p, appName: v }));
                  }}
                  className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold text-gray-900 dark:text-dark-text"
                  placeholder="Your CRM Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={local.accentColor || '#0D9488'}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLocal((p) => ({ ...p, accentColor: v }));
                      setBranding((p) => ({ ...p, accentColor: v }));
                    }}
                    className="h-11 w-14 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input"
                  />
                  <div className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50/60 dark:bg-dark-bg/60 px-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700 dark:text-dark-text-secondary">{local.accentColor}</span>
                    <Palette className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Email Sender Name</label>
                <input
                  value={local.emailSenderName || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLocal((p) => ({ ...p, emailSenderName: v }));
                    setBranding((p) => ({ ...p, emailSenderName: v }));
                  }}
                  className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold text-gray-900 dark:text-dark-text"
                  placeholder="Company / Facility name"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-dark-border flex items-center justify-between gap-3">
              <Button
                variant="outline"
                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2"
                onClick={() => {
                  resetBranding();
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Genyx Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-5">
        <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Live Preview</p>
              <h3 className="mt-1 text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Sidebar + Header</h3>
            </div>

            <div className="p-6 bg-gray-50/60 dark:bg-dark-bg/60">
              <div className="rounded-3xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface overflow-hidden">
                <div className="h-14 px-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-elevated flex items-center justify-center overflow-hidden">
                      {local.logoDataUrl ? (
                        <img src={local.logoDataUrl} alt="logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-black text-gray-400">LOGO</span>
                      )}
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-dark-text">{preview.name}</span>
                  </div>
                  <div className="w-20 h-8 rounded-xl" style={{ backgroundColor: local.accentColor || '#0D9488', opacity: 0.15 }} />
                </div>

                <div className="grid grid-cols-12 min-h-[240px]">
                  <div className="col-span-5 border-r border-gray-100 dark:border-dark-border p-4 space-y-2">
                    {['Facility Overview', 'Member Analytics', 'Revenue & Sales', 'Integrations', 'Settings'].map((x) => (
                      <div key={x} className="h-9 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50/60 dark:bg-dark-bg/60 flex items-center px-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: local.accentColor || '#0D9488' }} />
                        <span className="ml-2 text-[11px] font-black text-gray-700 dark:text-dark-text-secondary uppercase tracking-widest">{x}</span>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-7 p-4">
                    <div className="h-10 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface flex items-center px-3">
                      <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Header</span>
                      <span className="ml-auto text-[10px] font-black" style={{ color: local.accentColor || '#0D9488' }}>Accent</span>
                    </div>
                    <div className="mt-4 h-24 rounded-2xl border border-dashed border-gray-200 dark:border-dark-border bg-gray-50/60 dark:bg-dark-bg/60" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

