import React, { useState } from 'react';
import { Card, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { 
  Server, 
  Activity, 
  Thermometer, 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  RefreshCw, 
  Video, 
  FileText,
  Search,
  Settings,
  Terminal,
  Play
} from 'lucide-react';
import {
  systemHealthKPIs,
  aiProcessingStats,
  genyxPods,
  zoneCoverage,
  systemAlerts,
  diagnosticTests
} from './SystemHealthData';

export function SystemHealth() {
  const [activeTab, setActiveTab] = useState('pods');

  const StatusIcon = (status) => {
    switch (status) {
      case 'Online': return <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />;
      case 'Warning': return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'Offline': return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-300" />;
    }
  };

  const StatusColor = (status) => {
    switch (status) {
      case 'Online': return 'text-emerald-600 bg-emerald-50';
      case 'Warning': return 'text-amber-600 bg-amber-50';
      case 'Offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ── Sticky page header ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-[#059669]" />
              <span className="text-[11px] font-black tracking-[4px] uppercase text-[#059669]">GENYX Infrastructure Monitor</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight">System Intel</h1>
            <p className="text-sm text-gray-500 mt-1 font-bold uppercase tracking-widest">Local Pod Fleet · AI Interference · Edge Compute Diagnostics</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <Button variant="outline" className="bg-white border-gray-200 text-gray-600 font-black text-[10px] uppercase tracking-widest gap-2 h-10 px-4">
               <Terminal className="w-3.5 h-3.5" />
               Raw Logs
             </Button>
             <Button className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2 h-10 px-4 shadow-lg active:scale-95 transition-transform">
               <RefreshCw className="w-3.5 h-3.5" />
               Global Reboot
             </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10">

        {/* ── SECTION 1: SYSTEM HEALTH KPIs ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemHealthKPIs.map((kpi, i) => (
            <Card key={i} className="border-gray-100 shadow-sm bg-white rounded-2xl p-6 group hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${kpi.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {kpi.status}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{kpi.value}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase italic mb-1">{kpi.trend}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── SECTION 2: AI PROCESSING HEALTH ────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">AI Processing Health</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time inference performance and vision ingestion</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {aiProcessingStats.map((stat, i) => (
               <Card key={i} className="border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden relative group hover:border-emerald-200 transition-all">
                 <div className="p-6 relative z-10">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                   <div className="flex items-baseline gap-2 mb-2">
                     <h4 className="text-3xl font-black text-gray-900 tabular-nums tracking-tighter">{stat.value}</h4>
                     <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest">Live</Badge>
                   </div>
                   <p className="text-[10px] text-gray-500 font-bold italic leading-relaxed">{stat.desc}</p>
                 </div>
                 <div className="absolute right-[-10%] bottom-[-20%] opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Activity className="w-32 h-32 text-emerald-500" />
                 </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '70%' }} />
                 </div>
               </Card>
             ))}
          </div>
        </section>

        {/* ── SECTION 3: POD INFRASTRUCTURE + ALERTS GRID ────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Pod Table */}
          <div className="xl:col-span-8 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Genyx Pod Fleet</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Status of individual AI processing nodes</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="SEARCH PODS..." 
                        className="bg-white border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-wider focus:outline-none focus:border-emerald-200 shadow-sm w-48"
                      />
                   </div>
                </div>
             </div>

             <Card className="border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Pod Details</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 text-center">Resources</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400">Last Pulse</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {genyxPods.map(pod => (
                             <tr key={pod.id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="px-6 py-5 min-w-[200px]">
                               <div className="flex items-start gap-3">
                                 <div className="mt-1.5 shrink-0">
                                    {StatusIcon(pod.status)}
                                 </div>
                                 <div className="min-w-0">
                                   <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{pod.name}</p>
                                      <Badge className={`${StatusColor(pod.status)} border-none text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest shrink-0`}>
                                        {pod.status}
                                      </Badge>
                                   </div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{pod.zone} · {pod.id}</p>
                                 </div>
                               </div>
                             </td>
                             <td className="px-6 py-5 min-w-[150px]">
                                <div className="flex items-center justify-center gap-6">
                                   <div className="text-center w-10">
                                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">CPU</p>
                                      <p className={`text-xs font-black tabular-nums ${parseInt(pod.cpu) > 80 ? 'text-red-600' : 'text-gray-900'}`}>{pod.cpu}</p>
                                   </div>
                                   <div className="text-center w-12">
                                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">TEMP</p>
                                      <p className={`text-xs font-black tabular-nums ${parseInt(pod.temp) > 75 ? 'text-red-600' : 'text-gray-900'}`}>{pod.temp}</p>
                                   </div>
                                   <div className="text-center w-10 hidden sm:block">
                                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">MEM</p>
                                      <p className="text-xs font-black text-gray-900 tabular-nums">{pod.memory.split(' ')[0]}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-5 min-w-[120px]">
                                <div className="space-y-1">
                                   <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{pod.lastHeartbeat}</p>
                                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Uptime: {pod.uptime}</p>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-right min-w-[100px]">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600 bg-gray-50/50 hover:bg-emerald-50"><RefreshCw className="w-3.5 h-3.5" /></Button>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500 bg-gray-50/50 hover:bg-blue-50"><Settings className="w-3.5 h-3.5" /></Button>
                                </div>
                             </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </Card>

              {/* ── SECTION 4: ZONE COVERAGE MATRIX (MOVED HERE TO BALANCE HEIGHT) ── */}
              <section className="pt-4">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Zone Coverage Matrix</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Spatial distribution of AI processing units</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {zoneCoverage.map((zone, i) => (
                      <Card key={i} className="border-gray-100 shadow-sm bg-white rounded-2xl p-5 group hover:bg-emerald-50/10 transition-colors">
                         <div className="flex justify-between items-start mb-4">
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight group-hover:text-emerald-700">{zone.zone}</h4>
                            <Badge className={`border-none text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest ${zone.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                               {zone.status}
                            </Badge>
                         </div>
                         <div className="flex items-end justify-between">
                            <div className="flex -space-x-1.5">
                               {[...Array(zone.pods)].map((_, j) => (
                                 <div key={j} className="w-6 h-6 rounded bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center">
                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                 </div>
                               ))}
                               {zone.pods === 0 && <div className="text-[9px] font-black text-gray-300 uppercase italic">No Hardware</div>}
                            </div>
                            <p className="text-[10px] font-black text-gray-900">{zone.pods} <span className="text-gray-400 font-bold uppercase tracking-widest">Units</span></p>
                         </div>
                      </Card>
                   ))}
                </div>
              </section>
           </div>

          {/* System Alerts */}
          <div className="xl:col-span-4 space-y-8">
             <section>
                <div className="mb-6">
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">System Alerts</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Live critical hardware notifications</p>
                </div>
                <Card className="border-gray-100 shadow-sm bg-white rounded-2xl divide-y divide-gray-50">
                   {systemAlerts.map(alert => (
                     <div key={alert.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors group">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${alert.type === 'critical' ? 'bg-red-500 animate-pulse' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div className="min-w-0">
                           <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-relaxed">{alert.msg}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{alert.time}</p>
                        </div>
                     </div>
                   ))}
                   <div className="p-4 bg-gray-50/30">
                      <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-[#059669] hover:bg-white border-dashed border border-gray-200 group">
                         Mute All Session Alerts
                      </Button>
                   </div>
                </Card>
             </section>

             <section>
                <div className="mb-6">
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Diagnostics Control</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Execute system-wide validation tests</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   {diagnosticTests.map(test => (
                     <Card key={test.id} className="border-gray-100 shadow-sm bg-white rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                 {test.id === 'conn' ? <Wifi className="w-5 h-5" /> : test.id === 'inf' ? <Zap className="w-5 h-5" /> : test.id === 'cal' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>
                              <div>
                                 <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{test.label}</p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{test.desc}</p>
                              </div>
                           </div>
                           <Play className="w-4 h-4 text-gray-200 group-hover:text-emerald-500 transition-colors" />
                        </div>
                     </Card>
                   ))}
                </div>
             </section>
          </div>
        </div>


      </div>
    </div>
  );
}
