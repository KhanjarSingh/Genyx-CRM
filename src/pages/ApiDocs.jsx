import { Card, CardContent } from '../components/UI/Card';
import { Code2, Lock, Mail } from 'lucide-react';

import { Button } from '../components/UI/Button';
import { useState } from 'react';

export function ApiDocs() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0F172A] transition-colors">
      <div className="bg-white dark:bg-[#1A1B2E] border-b border-gray-100 dark:border-[#2D3748] px-6 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-4 h-4 text-brand" />
            <span className="text-[11px] font-black tracking-[4px] uppercase text-brand">Genyx Developer API</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter uppercase leading-tight">Genyx Developer API</h1>
          <p className="mt-2 text-sm font-bold text-gray-500 dark:text-[#94A3B8]">
            Programmatic access to your facility intelligence coming soon
          </p>
        </div>
      </div>

      <div className="px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { method: 'GET', path: '/api/v1/members', desc: 'List all members with metrics' },
              { method: 'GET', path: '/api/v1/alerts', desc: 'Query alert history' },
              { method: 'POST', path: '/api/v1/webhooks', desc: 'Register webhook endpoints' },
            ].map((e) => (
              <Card key={e.path} className="opacity-70 border-gray-100 dark:border-[#2D3748] rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">{e.method}</span>
                    <Lock className="w-4 h-4 text-gray-300 dark:text-dark-text-muted" />
                  </div>
                  <p className="mt-3 font-mono text-sm font-black text-gray-900 dark:text-dark-text">{e.path}</p>
                  <p className="mt-2 text-sm font-bold text-gray-500 dark:text-dark-text-secondary">{e.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-gray-100 dark:border-[#2D3748] rounded-3xl">
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 dark:text-dark-text-secondary">Early access</p>
              <h3 className="mt-2 text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Get notified on launch</h3>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="w-4 h-4 text-gray-300 dark:text-dark-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input pl-11 pr-4 text-sm font-bold text-gray-900 dark:text-dark-text"
                  />
                </div>
                <Button
                  className="h-11 px-6 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => {
                    localStorage.setItem('apiNotifyEmail', email);
                    setEmail('');
                  }}
                >
                  Notify me when the API launches
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

