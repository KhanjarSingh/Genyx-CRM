import React, { useState } from 'react';
import { Card, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight, 
  Mail, 
  MessageSquare, 
  Bell, 
  Share2, 
  Trash2,
  Filter,
  ArrowRight,
  Zap,
  RefreshCw,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  reportCategories,
  deliveryChannels,
  recentReports,
  scheduledReports,
  reportPreviewStats
} from './ReportsData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AlertAnalytics from './reports/AlertAnalytics';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';

export function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('revenue');
  const [autoDeliver, setAutoDeliver] = useState(true);
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0F172A] transition-colors">
      
      {/* ── Sticky page header ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1A1B2E] border-b border-gray-100 dark:border-[#2D3748] px-4 py-5 sm:px-6 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-brand" />
              <span className="text-[11px] font-black tracking-[4px] uppercase text-brand">GENYX Reports & Intelligence</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter uppercase leading-tight">Intelligence Generator</h1>
            <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-1 font-bold uppercase tracking-widest">Dynamic Generation · Automated Delivery · Cross-Facility Insights</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <div className="hidden sm:flex items-center gap-2 mr-2">
               {[
                 { id: 'generator', label: 'Reports' },
                 { id: 'alertAnalytics', label: 'Alert Analytics' },
               ].map(t => (
                 <button
                   key={t.id}
                   onClick={() => setActiveTab(t.id)}
                   className={`h-10 rounded-full px-4 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                     activeTab === t.id
                       ? 'bg-brand text-white border-brand'
                       : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-[#94A3B8] border-gray-200 dark:border-[#2D3748] hover:bg-gray-50 dark:hover:bg-slate-800'
                   }`}
                 >
                   {t.label}
                 </button>
               ))}
             </div>
             <Button variant="outline" size="sm" className="bg-white dark:bg-[#0F172A] border-gray-200 dark:border-[#2D3748] text-gray-600 dark:text-[#94A3B8] font-black text-[10px] uppercase tracking-widest gap-2 h-10 px-4">
               <RefreshCw className="w-3.5 h-3.5" />
               Refresh Data
             </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 space-y-12">
        <OnboardingTooltip />
        {activeTab === 'alertAnalytics' && (
          <AlertAnalytics />
        )}

        {activeTab === 'generator' && (
          <>
        {/* ── SECTION 1: DYNAMIC GENERATOR ───────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Generator Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="mb-6">
                <h2 className="text-lg font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Report Generator</h2>
                <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Configure your custom data export</p>
              </div>
              
              <Card className="bg-white dark:bg-[#1A1B2E] border-gray-100 dark:border-[#2D3748] shadow-sm rounded-2xl p-6 transition-colors">
                <div className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 dark:text-[#94A3B8] uppercase tracking-[2px] mb-3 block">Reporting Category</label>
                    <div className="space-y-2">
                       {reportCategories.map((cat) => (
                         <button
                           key={cat.id}
                           onClick={() => setSelectedCategory(cat.id)}
                           className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${selectedCategory === cat.id ? 'border-brand bg-brand/10' : 'border-gray-50 dark:border-[#2D3748] hover:border-gray-200 dark:hover:border-slate-600 bg-white dark:bg-[#0F172A]'}`}
                         >
                           <div>
                             <p className={`text-xs font-black uppercase tracking-tight ${selectedCategory === cat.id ? 'text-brand' : 'text-gray-700 dark:text-[#F1F5F9]'}`}>{cat.label}</p>
                             <p className={`text-[10px] font-bold ${selectedCategory === cat.id ? 'text-brand/70' : 'text-gray-400 dark:text-[#94A3B8]'}`}>{cat.desc}</p>
                           </div>
                           <ChevronRight className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-brand translate-x-1' : 'text-gray-300 dark:text-slate-600'} transition-transform`} />
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 dark:text-[#94A3B8] uppercase tracking-[2px] mb-3 block">Time Period</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-10 text-[10px] font-black uppercase bg-white dark:bg-[#0F172A] border-gray-100 dark:border-[#2D3748] text-gray-700 dark:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-slate-800">Last 30 Days</Button>
                      <Button variant="outline" className="h-10 text-[10px] font-black uppercase bg-white dark:bg-[#0F172A] border-gray-100 dark:border-[#2D3748] text-gray-700 dark:text-[#F1F5F9] hover:bg-gray-50 dark:hover:bg-slate-800">Last Quarter</Button>
                    </div>
                  </div>

                  {/* Delivery Channels */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                       <label className="text-[10px] font-black text-gray-400 dark:text-[#94A3B8] uppercase tracking-[2px]">Automated Delivery</label>
                       <button onClick={() => setAutoDeliver(!autoDeliver)} className={`w-10 h-5 rounded-full transition-colors relative ${autoDeliver ? 'bg-brand' : 'bg-gray-200 dark:bg-slate-700'}`}>
                         <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${autoDeliver ? 'translate-x-5' : ''}`} />
                       </button>
                    </div>
                    
                    <div className={`grid grid-cols-3 gap-2 transition-opacity ${autoDeliver ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                      {deliveryChannels.map(ch => (
                        <button key={ch.id} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-50 dark:border-[#2D3748] hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-[#0F172A] dark:active:bg-slate-800 transition-all">
                           {(ch.id === 'email') ? <Mail className="w-4 h-4 text-brand" /> : (ch.id === 'whatsapp') ? <MessageSquare className="w-4 h-4 text-brand" /> : <Bell className="w-4 h-4 text-brand" /> }
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-[#94A3B8]">{ch.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-slate-900 dark:bg-brand hover:bg-slate-800 dark:hover:bg-brand/90 text-white font-black uppercase tracking-[2px] text-[11px] mt-4 flex items-center justify-center gap-2 rounded-xl shadow-lg">
                    Generate Intelligence Report
                    <Zap className="w-4 h-4 fill-white text-white" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Live Insights Preview */}
            <div className="lg:col-span-8 flex min-w-0 flex-col">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Quick Insights Preview</h2>
                  <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Live data feed for current configuration</p>
                </div>
                <Badge className="w-fit bg-brand/10 text-brand border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">Real-time Feed</Badge>
              </div>

              <Card className="flex-1 border-gray-100 dark:border-[#2D3748] shadow-sm bg-white dark:bg-[#1A1B2E] rounded-2xl overflow-hidden flex flex-col transition-colors">
                <div className="p-8 border-b border-gray-50 dark:border-[#2D3748] bg-slate-900 text-white transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                     <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Genyx Preview Engine</p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                     <div className="min-w-0">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected ROI</p>
                       <p className="break-words text-2xl font-mono font-black text-brand tabular-nums tracking-tighter sm:text-3xl">$12,400</p>
                     </div>
                     <div className="min-w-0">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Form Quality</p>
                       <p className="break-words text-2xl font-mono font-black text-white tabular-nums tracking-tighter sm:text-3xl">67<span className="text-sm font-bold text-slate-500">/100</span></p>
                     </div>
                     <div className="min-w-0">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Index</p>
                       <p className="break-words text-2xl font-mono font-black text-white tabular-nums tracking-tighter sm:text-3xl">+18.2%</p>
                     </div>
                  </div>
                </div>
                
                <div className="flex-1 p-8">
                   <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={reportPreviewStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 700, fontFamily: 'JetBrains Mono' }} itemStyle={{ fontFamily: 'JetBrains Mono' }} />
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#16A34A" strokeWidth={4} fill="url(#prevGrad)" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} animationDuration={800} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="px-8 py-5 border-t border-gray-50 dark:border-[#2D3748] bg-gray-50/50 dark:bg-[#0F172A]/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[11px] font-bold transition-colors">
                   <p className="text-gray-400 dark:text-[#94A3B8] uppercase tracking-widest">Confidence Score: <span className="text-brand">98.4%</span></p>
                   <button className="text-slate-400 hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors uppercase tracking-widest">Explain Model Data</button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ── SECTIONS 2 + 3 GRID ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-2 sm:mt-3">
          
          {/* Recent Exports */}
          <div className="xl:col-span-8">
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Recent Archives</h2>
              <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Previously generated system intelligence</p>
            </div>
            
            <Card className="border-gray-100 dark:border-[#2D3748] shadow-sm bg-white dark:bg-[#1A1B2E] rounded-2xl overflow-hidden transition-colors">
               <div className="overflow-x-auto">
                 <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#0F172A] border-b border-gray-100 dark:border-[#2D3748] transition-colors">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Report Name</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Created</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-[#2D3748] transition-colors">
                       {recentReports.map(rep => (
                         <tr key={rep.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0F172A]/50 transition-colors group">
                           <td className="px-6 py-5">
                             <div className="flex items-center gap-3">
                               <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#1A1B2E] group-hover:shadow-sm transition-all border border-transparent group-hover:border-brand/30">
                                 <FileText className="w-4 h-4" />
                               </div>
                               <div className="min-w-0">
                                 <p className="text-sm font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">{rep.name}</p>
                                 <p className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8] uppercase tracking-widest">{rep.category} · {rep.size} · {rep.type}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-5">
                             <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${rep.status === 'Sent' ? 'bg-success/10 text-success' : rep.status === 'Ready' ? 'bg-info/10 text-info' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500'}`}>
                               {rep.status === 'Sent' && <CheckCircle2 className="w-3 h-3" />}
                               {rep.status === 'Ready' && <Download className="w-3 h-3" />}
                               {rep.status}
                             </div>
                           </td>
                           <td className="px-6 py-5">
                             <p className="text-[11px] font-mono font-black text-gray-900 dark:text-[#F1F5F9] tabular-nums tracking-tighter">{rep.date}</p>
                           </td>
                           <td className="px-6 py-5 text-right">
                             <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-10 sm:group-hover:opacity-100 transition-opacity">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-[#94A3B8] hover:text-brand dark:hover:text-brand"><Download className="w-4 h-4" /></Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-[#94A3B8] hover:text-info dark:hover:text-info"><Share2 className="w-4 h-4" /></Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-[#94A3B8] hover:text-critical dark:hover:text-critical"><Trash2 className="w-4 h-4" /></Button>
                             </div>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </Card>
          </div>

          {/* Scheduled Deliveries */}
          <div className="xl:col-span-4">
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Automated Messengers</h2>
              <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Smart recurring report queue</p>
            </div>
            
            <Card className="border-gray-100 dark:border-[#2D3748] shadow-sm bg-white dark:bg-[#1A1B2E] rounded-2xl p-6 transition-colors">
               <div className="space-y-6">
                  {scheduledReports.map(sch => (
                    <div key={sch.id} className="relative group">
                       <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                             <h4 className="text-sm font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight mb-1">{sch.name}</h4>
                             <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-gray-400 dark:text-[#94A3B8] uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sch.frequency}</span>
                                <span className="text-brand">{sch.time}</span>
                             </div>
                          </div>
                          <button onClick={() => {}} className={`w-9 h-5 rounded-full relative transition-colors ${sch.active ? 'bg-brand' : 'bg-gray-100 dark:bg-slate-700'}`}>
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${sch.active ? 'translate-x-4' : ''}`} />
                          </button>
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <div className="flex -space-x-1.5">
                            {sch.channels.map(ch => (
                              <div key={ch} className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-[#0F172A] text-white flex items-center justify-center border-2 border-white dark:border-[#1A1B2E] shadow-sm">
                                {ch === 'email' ? <Mail className="w-3 h-3" /> : ch === 'whatsapp' ? <MessageSquare className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                              </div>
                            ))}
                         </div>
                         <p className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8]">Delivering to <span className="text-slate-900 dark:text-[#F1F5F9] underline">2 owners</span> & <span className="text-slate-900 dark:text-[#F1F5F9] underline">staff</span></p>
                       </div>
                       
                       <Button size="sm" variant="outline" className="w-full mt-4 h-9 text-[10px] font-black uppercase tracking-widest border-gray-100 dark:border-[#2D3748] text-gray-400 dark:text-[#94A3B8] group-hover:text-brand group-hover:border-brand/30 group-hover:bg-brand/5 transition-all">
                         Update Schedule <ArrowRight className="ml-2 w-3 h-3" />
                       </Button>
                       
                       <div className="h-px bg-gray-50 dark:bg-[#2D3748] mt-6" />
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full border-dashed border-gray-200 dark:border-[#2D3748] text-gray-400 dark:text-[#94A3B8] font-black text-[10px] uppercase tracking-widest h-12 rounded-xl hover:border-brand/50 hover:text-brand hover:bg-brand/5 transition-all">
                    + Add New Automated Task
                  </Button>
               </div>
            </Card>
          </div>

        </div>

          </>
        )}
      </div>
    </div>
  );
}
