import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import {
  TrendingUp, TrendingDown, DollarSign, Users, CreditCard,
  ArrowUpRight, ArrowDownRight, Target, Zap, ShieldAlert,
  AlertTriangle, CheckCircle2, ChevronRight, MessageSquare,
  BarChart3, LineChart as LucideLineChart, Briefcase, Award,
  PieChart as LucidePieChart, Filter, Plus, ArrowRight, UserPlus,
  MoreVertical, MoreHorizontal
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell
} from 'recharts';
import {
  revenueHealthKPIs, revenueTrendData, genyxImpactStats,
  pipelineLeads, revenueBreakdownData, leadFunnelData,
  trainerDetailedLeaderboard, upgradeOpportunities,
  churnRiskStats, recentConversions
} from './RevenueSalesData';

// ─── Tiny helpers ──────────────────────────────────────────────────────────────

const KPI_CONFIGS = {
  emerald: { iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', valueCls: 'text-gray-900', trendCls: 'text-emerald-600' },
  blue:    { iconBg: 'bg-blue-100',    iconColor: 'text-blue-600',    valueCls: 'text-gray-900', trendCls: 'text-blue-600'    },
  green:   { iconBg: 'bg-green-100',   iconColor: 'text-green-600',   valueCls: 'text-gray-900', trendCls: 'text-green-600'   },
  amber:   { iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   valueCls: 'text-gray-900', trendCls: 'text-amber-600'   },
};

const PriorityColor = (p) => p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#10b981';
const PriorityCls = (p) => p === 'High' ? 'bg-red-100 text-red-700' : p === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

// ─── Main Component ────────────────────────────────────────────────────────────

export function RevenueSales() {
  const [pipeline, setPipeline] = useState(pipelineLeads);
  const colRefs = useRef({});
  const columns = ['Identified', 'Contacted', 'Follow Up', 'Converted', 'Not Interested'];

  const moveLead = (leadId, newStatus) => {
    setPipeline(pp => pp.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const dashboardTiles = [
    { id: 'health', content: (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueHealthKPIs.map((kpi, i) => (
          <motion.div key={i} drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.05} className="cursor-grab active:cursor-grabbing">
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all h-full bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                   <div className={`w-8 h-8 rounded-lg ${KPI_CONFIGS[kpi.color]?.iconBg || 'bg-gray-100'} flex items-center justify-center`}>
                      <DollarSign className={`w-4 h-4 ${KPI_CONFIGS[kpi.color]?.iconColor || 'text-gray-400'}`} />
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">{kpi.title}</p>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{kpi.value}</span>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${kpi.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} flex items-center gap-1 shrink-0`}>
                    {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    )},
    { id: 'analytics', content: (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.05} className="lg:col-span-8 cursor-grab active:cursor-grabbing">
          <Card className="border-gray-100 shadow-sm h-full overflow-hidden flex flex-col bg-white">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Revenue Performance</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Monthly recurring vs. targets</p>
              </div>
              <Badge variant="outline" className="text-[10px] h-6 border-emerald-100 text-emerald-700 font-black bg-emerald-50 uppercase tracking-widest">Growth Phase</Badge>
            </div>
            <CardContent className="p-6 flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} tickFormatter={(v) => `$${v/1000}k`} />
                  <RechartsTooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', fontSize: '12px', fontWeight: 700 }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevAI)" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="10 6" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.05} className="lg:col-span-4 cursor-grab active:cursor-grabbing">
           <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl h-full overflow-hidden relative min-h-[400px] flex flex-col">
             <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-1/4 translate-y-1/4">
               <LucidePieChart className="w-72 h-72 text-emerald-400" />
             </div>
             <CardContent className="p-8 flex flex-col h-full relative z-10">
               <div className="flex items-center gap-2 mb-8">
                 <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                 <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Genyx ROI Engine</p>
               </div>
               
               <div className="mb-10">
                 <div className="flex items-baseline gap-2">
                   <span className="text-7xl font-black text-white tracking-tighter">{genyxImpactStats[0].value}</span>
                   <span className="text-emerald-400 text-2xl font-black">ROI</span>
                 </div>
                 <p className="text-xs text-slate-400 mt-4 font-bold leading-relaxed uppercase tracking-wide">{genyxImpactStats[0].desc}</p>
               </div>

               <div className="space-y-6 flex-1 border-t border-white/5 pt-8">
                 {genyxImpactStats.slice(1).map((s, i) => (
                   <div key={i} className="flex justify-between items-end border-b border-white/5 pb-5 last:border-0 last:pb-0 group/stat">
                     <div>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[2px] mb-1 group-hover/stat:text-emerald-400 transition-colors">{s.label}</p>
                       <p className="text-[10px] text-slate-600 font-bold max-w-[120px] leading-tight">{s.desc}</p>
                     </div>
                     <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{s.value}</span>
                   </div>
                 ))}
               </div>
               
               <Button className="w-full mt-10 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black h-12 gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-[11px]">
                 Genyx ROI Report <ArrowRight className="w-4 h-4" />
               </Button>
             </CardContent>
           </Card>
        </motion.div>
      </div>
    )}
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-[#059669]" />
              <span className="text-[11px] font-black tracking-[4px] uppercase text-[#059669]">GENYX Revenue Intelligence</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight">Revenue & Sales</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Movable Grid · Smart Pipeline · Coaching ROI</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-600 font-bold text-xs gap-2 h-9">
              <Plus className="w-3.5 h-3.5" /> New Lead
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 h-9 px-4 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Manual Sale
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-12">

        {/* ── SECTION 1 & 2: MOVABLE TILES ───────────────────────────────── */}
        {dashboardTiles.map((tile) => (
          <div key={tile.id}>
            {tile.content}
          </div>
        ))}

        {/* ── SECTION 4: UPSELL PIPELINE ──────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm overflow-hidden min-h-[600px]">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Upsell Pipeline</h2>
              <p className="text-sm text-gray-500 mt-1">Movement-intelligence driven sales funnel</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" size="sm" className="h-10 font-bold gap-2 px-4 border-gray-200 bg-gray-50/30">
                 <Filter className="w-4 h-4" /> Filter Views
               </Button>
               <Button size="sm" className="h-10 font-bold gap-2 bg-slate-900 text-white px-5 shadow-lg shadow-slate-200">
                 <Plus className="w-4 h-4" /> Manual Entry
               </Button>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent min-h-[500px]">
            {columns.map((status) => (
              <div 
                key={status} 
                ref={el => colRefs.current[status] = el}
                className="flex-shrink-0 w-80 flex flex-col snap-start"
              >
                <div className="flex items-center justify-between mb-4 bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                    <span className="text-[12px] font-black text-slate-700 uppercase tracking-[2px]">{status}</span>
                    <Badge variant="secondary" className="bg-white border-slate-200 text-slate-500 text-[10px] font-black px-2">{pipeline.filter(l => l.status === status).length}</Badge>
                  </div>
                  <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                </div>
                
                <div className="flex-1 space-y-5 bg-gray-50/50 rounded-3xl p-3 border border-dashed border-slate-200/50 transition-colors hover:bg-emerald-50/10">
                  <AnimatePresence mode="popLayout">
                    {pipeline.filter(l => l.status === status).map((lead) => (
                      <motion.div
                        key={lead.id}
                        layoutId={lead.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        drag
                        dragSnapToOrigin
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.08}
                        whileDrag={{ 
                          scale: 1.05, 
                          zIndex: 1000, 
                          rotate: 1,
                          boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
                        }}
                        onDragEnd={(_, info) => {
                          // REFINED BOUNDING BOX DETECTION
                          const x = info.point.x;
                          const y = info.point.y;
                          
                          let detectedStatus = lead.status;
                          for (const colStatus of columns) {
                             const el = colRefs.current[colStatus];
                             if (el) {
                               const rect = el.getBoundingClientRect();
                               if (x >= rect.left && x <= rect.right) {
                                  detectedStatus = colStatus;
                                  break;
                               }
                             }
                          }
                          
                          if (detectedStatus !== lead.status) {
                            moveLead(lead.id, detectedStatus);
                          }
                        }}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-grab active:cursor-grabbing hover:border-emerald-300 transition-all group relative"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-sm text-slate-400 shadow-inner">
                            {lead.avatar}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                             <Badge className={`${PriorityCls(lead.priority)} text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border-none`}>
                               {lead.priority}
                             </Badge>
                             <div className="w-1 h-1 rounded-full animate-ping bg-emerald-400" />
                          </div>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors truncate">{lead.name}</h4>
                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between items-center text-[10px] bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                            <span className="text-emerald-800 font-black uppercase tracking-widest">Form Logic</span>
                            <span className="font-black text-emerald-600 text-[12px]">{lead.score}%</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic line-clamp-2 px-1">"{lead.issue}"</p>
                        </div>
                        <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                           <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:translate-x-1.5 transition-transform duration-300">
                             Engage Now <ArrowRight className="w-4 h-4" />
                           </button>
                           <div className="flex -space-x-2 group-hover:-space-x-1 transition-all duration-300">
                             {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 shadow-sm" />)}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                    {pipeline.filter(l => l.status === status).length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-48 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center rounded-3xl opacity-30"
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                          <UserPlus className="w-6 h-6 text-slate-300" />
                        </div>
                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-[3px]">Drop Opportunity</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5 + 6: DEEP INTELLIGENCE ────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* AI Priority Leads (8 cols) */}
          <div className="xl:col-span-8 flex flex-col">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">AI Lead Priority System</h2>
                <p className="text-xs text-gray-400 mt-1">Movement intelligence conversion signals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
               {pipelineLeads.slice(0, 4).map((lead, i) => (
                 <Card key={i} className="border-gray-100 shadow-sm hover:border-emerald-100 hover:shadow-md transition-all group h-full">
                   <CardContent className="p-6 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-6">
                       <Badge className={`${PriorityCls(lead.priority)} text-[10px] font-black uppercase tracking-widest h-6 px-3`}>
                         {lead.priority} Focus
                       </Badge>
                       <span className="text-[12px] font-black text-gray-200">#AI-{100 + i}</span>
                     </div>
                     <div className="flex-1">
                       <h3 className="text-lg font-black text-gray-900 group-hover:text-emerald-600 transition-colors tracking-tight mb-2 uppercase">{lead.name}</h3>
                       <div className="flex items-center gap-2 mb-6">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <p className="text-xs text-gray-500 font-bold italic truncate">{lead.issue}</p>
                       </div>
                       
                       <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-start gap-4">
                          <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-amber-500">
                             <Zap className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Suggested Play</p>
                             <p className="text-xs text-gray-700 font-bold leading-relaxed pr-2">{lead.action}</p>
                          </div>
                       </div>
                     </div>

                     <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Est. Revenue</span>
                           <span className="text-lg font-black text-gray-900 tabular-nums tracking-tighter">$450–$620</span>
                        </div>
                        <Button className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] gap-2 px-6 rounded-xl uppercase tracking-widest transition-all">
                           Convert Now <ChevronRight className="w-4 h-4" />
                        </Button>
                     </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
          </div>

          {/* Funnel (4 cols) */}
          <div className="xl:col-span-4 flex flex-col">
            <div className="mb-5">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Conversion Funnel</h2>
              <p className="text-xs text-gray-400 mt-1">Lead movement efficiency</p>
            </div>
            <Card className="border-gray-100 shadow-sm flex-1 bg-white">
               <CardContent className="p-8 flex flex-col h-full">
                  <div className="space-y-10 flex-1 flex flex-col justify-center">
                    {leadFunnelData.map((stage, i) => (
                      <div key={i} className="relative group/bar">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest group-hover/bar:text-emerald-700 transition-colors">{stage.stage}</span>
                            <span className="text-lg font-black text-gray-900 group-hover/bar:scale-110 transition-transform">{stage.count}</span>
                         </div>
                         <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: stage.pct }}
                              className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                            />
                         </div>
                         {i < leadFunnelData.length - 1 && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-300 flex items-center gap-1.5 uppercase">
                              <ArrowDownRight className="w-3 h-3 text-red-300" /> {stage.pct} loss
                            </div>
                         )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-5 bg-emerald-50 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                       <TrendingUp className="w-6 h-6 text-emerald-600" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-emerald-800 uppercase tracking-tight">System Efficiency: 16%</p>
                        <p className="text-[11px] text-emerald-600/80 font-medium leading-relaxed mt-1">Outperforming previous baseline. Movement-triggered alerts have 3x higher conversion vs. cold calls.</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* ── SECTION 7 + 8: OPPORTUNITIES ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Upgrade Opportunities */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-5">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Upgrade Opportunities</h2>
              <p className="text-xs text-gray-400 mt-1">High-propensity upsell triggers</p>
            </div>
            <Card className="border-gray-100 shadow-sm flex-1 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {upgradeOpportunities.map((op, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50/50 transition-all group/op">
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-black text-gray-900 group-hover/op:text-emerald-700 transition-colors uppercase tracking-tight">{op.name}</h4>
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[2px] mb-1">PROBABILITY</span>
                           <span className="text-2xl font-black text-emerald-600 tabular-nums tracking-tighter">{op.probability}</span>
                        </div>
                     </div>
                     <div className="space-y-4 mb-6">
                        <p className="text-xs text-gray-500 font-bold leading-relaxed border-l-2 border-emerald-500 pl-4 py-1 italic">"{op.reason}"</p>
                        <div className="flex flex-wrap gap-2">
                           <Badge variant="outline" className="bg-white border-emerald-100 text-[9px] font-black text-emerald-600 uppercase">Frequent Visits</Badge>
                           <Badge variant="outline" className="bg-white border-emerald-100 text-[9px] font-black text-emerald-600 uppercase">Form Delta +15%</Badge>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <Button size="sm" className="flex-1 h-10 bg-white border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 shadow-none">Review Data</Button>
                        <Button size="sm" className="flex-1 h-10 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-none">Move to Pipe</Button>
                     </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-5">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Sales Leaderboard</h2>
              <p className="text-xs text-gray-400 mt-1">Trainer conversion impact</p>
            </div>
            <Card className="border-gray-100 shadow-sm flex-1 overflow-hidden">
               <div className="divide-y divide-gray-50">
                  {trainerDetailedLeaderboard.map((t, i) => (
                    <div key={i} className={`p-6 relative transition-all hover:bg-white shadow-[inset_0_0_0_0_rgba(16,185,129,0.1)] hover:shadow-[inset_4px_0_0_0_#10b981] ${t.isTop ? 'bg-emerald-50/20' : ''}`}>
                       {t.isTop && <Award className="absolute top-6 right-6 w-6 h-6 text-amber-500 fill-amber-100" />}
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-white border-2 flex items-center justify-center font-black text-lg shadow-sm" style={{ borderColor: t.color, color: t.color }}>{t.name.charAt(0)}</div>
                          <div>
                             <h4 className="text-base font-black text-gray-900 uppercase tracking-tight leading-none mb-1.5">{t.name}</h4>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-[2px]">{t.leads} signals handled</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                          <div>
                             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[2px] mb-1 max-w-full truncate">REVENUE</p>
                             <p className="text-lg font-black text-gray-900 tabular-nums tracking-tighter">{t.revenue}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[2px] mb-1 max-w-full truncate">CONVERSION</p>
                             <p className="text-lg font-black text-gray-900 tabular-nums tracking-tighter">{t.convRate}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[2px] mb-1 max-w-full truncate">CLOSED</p>
                             <p className="text-lg font-black text-gray-900 tabular-nums tracking-tighter">{t.sales}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[2px] mb-1 max-w-full truncate">CLIENT ∆</p>
                             <p className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">{t.improvement}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </Card>
          </div>

          {/* Churn Risk / Breakdown */}
          <div className="lg:col-span-3 flex flex-col gap-6">
             <Card className="border-gray-100 shadow-sm overflow-hidden bg-white border-t-4 border-red-500 flex-1">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-10">
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px]">Churn Risk</h3>
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                   </div>
                   <div className="space-y-2 mb-10">
                      <p className="text-5xl font-black text-red-600 tracking-tighter tabular-nums leading-none">{churnRiskStats.revenueAtRisk}</p>
                      <p className="text-[11px] font-black text-red-400 uppercase tracking-widest leading-none">Potential MRR Loss</p>
                   </div>
                   <div className="space-y-6 pt-8 border-t border-gray-50 flex-1">
                      <div className="flex justify-between items-center">
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Inactive (&gt;14d)</span>
                         <span className="text-base font-black text-gray-900">{churnRiskStats.inactiveMembers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Risk Exposure</span>
                         <span className="text-base font-black text-gray-900">{churnRiskStats.mrrAtRiskPct}</span>
                      </div>
                   </div>
                   <Button className="w-full mt-10 bg-red-600 hover:bg-red-700 text-white font-black h-12 uppercase tracking-[2px] shadow-lg shadow-red-200">Launch Outreach</Button>
                </CardContent>
             </Card>
          </div>

        </div>

        {/* ── FINAL ROW: SALES LOG ─────────────────────────────────────────── */}
        <section>
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Conversions</h2>
              <p className="text-xs text-gray-400 mt-1">Chronological record of movement-triggered sales</p>
            </div>
            <Button variant="outline" size="sm" className="h-9 font-black uppercase tracking-widest border-gray-200 text-gray-500 hover:bg-gray-50 text-[10px]">View Full Log</Button>
          </div>
          <Card className="border-gray-100 shadow-sm overflow-hidden rounded-2xl">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                         <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[3px] text-gray-400">Member</th>
                         <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[3px] text-gray-400">Pkg / Signal</th>
                         <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[3px] text-gray-400">Conversion Method</th>
                         <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[3px] text-gray-400">Value</th>
                         <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[3px] text-gray-400">Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {recentConversions.map((conv, i) => (
                        <tr key={i} className="hover:bg-emerald-50/20 transition-all group">
                           <td className="px-8 py-6 font-black text-gray-900 uppercase tracking-tight">{conv.member}</td>
                           <td className="px-8 py-6">
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-black uppercase tracking-widest px-3 h-6">{conv.pkg}</Badge>
                           </td>
                           <td className="px-8 py-6 text-xs text-gray-500 font-bold max-w-xs">{conv.method}</td>
                           <td className="px-8 py-6 text-right font-black text-gray-900 tracking-tighter text-lg">{conv.value}</td>
                           <td className="px-8 py-6 text-right text-[10px] text-gray-400 font-black uppercase tracking-widest">{conv.date}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </Card>
        </section>

      </div>
    </div>
  );
}
