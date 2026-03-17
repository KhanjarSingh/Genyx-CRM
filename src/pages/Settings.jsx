import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { Card, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import {
  Settings as SettingsIcon,
  Map,
  Cpu,
  Users,
  Bell,
  Share2,
  Lock,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  UserPlus,
  Shield,
  Zap,
  Globe,
  Camera,
  ArrowRight,
  Activity,
  Palette,
  Sun,
  Moon,
  AlignLeft,
  AlignCenter,
  AlignJustify
} from 'lucide-react';
import {
  facilityInitialInfo,
  zoneConfigurations,
  aiThresholds,
  staffAccounts,
  notificationPreferences,
  integrationList,
  securitySettings
} from './SettingsData';
import RolesPermissions from './settings/RolesPermissions';
import AlertRouting from './settings/AlertRouting';
import { demoProfiles } from '../data/demoProfiles';
import { useLocation } from '../context/LocationContext';
import Branding from './settings/Branding';
import Developer from './settings/Developer';
import DataManagement from './settings/DataManagement';

export function Settings() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('settings.activeTab') || 'facility');
  const { theme, toggleTheme, density, setDensity } = useThemeContext();
  const { demoProfileId, setDemoProfile } = useLocation();

  const navItems = [
    { id: 'facility', label: 'Facility', icon: Globe },
    { id: 'zones', label: 'Zones & Pods', icon: Map },
    { id: 'ai', label: 'AI Intelligence', icon: Zap },
    { id: 'users', label: 'Roles & Permissions', icon: Users },
    { id: 'alertRouting', label: 'Alert Routing', icon: Bell },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'developer', label: 'Developer', icon: Cpu },
  ];

  const setTab = (id) => {
    setActiveTab(id);
    localStorage.setItem('settings.activeTab', id);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-dark-bg transition-colors">

      {/* ── Sticky page header ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border px-6 py-5 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sticky top-0 z-20 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon className="w-4 h-4 text-[#059669]" />
              <span className="text-[11px] font-black tracking-[4px] uppercase text-[#059669]">GENYX Command Center</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-dark-text tracking-tighter uppercase leading-tight">System Settings</h1>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1 font-bold uppercase tracking-widest">Facility Config · AI Logic · Hardware Mapping · Security</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
             <Button className="bg-slate-900 dark:bg-brand text-white font-black text-[10px] uppercase tracking-widest gap-2 h-10 px-4 shadow-lg active:scale-95 transition-transform">
               <Save className="w-3.5 h-3.5" />
               Push Configuration
             </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">

        {/* ── Sidebar Navigation ───────────────────────────────────────── */}
        <aside className="lg:w-64 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border lg:min-h-[calc(100vh-100px)] p-4 space-y-1 transition-colors">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated'}`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-dark-text-muted group-hover:text-gray-600 dark:group-hover:text-dark-text-secondary'}`} />
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
            <Link
              to="/api-docs"
              className="block px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated"
            >
              Genyx Developer API
            </Link>
          </div>
        </aside>

        {/* ── Main Content Area ────────────────────────────────────────── */}
        <main className="flex-1 p-6 lg:p-10 max-w-5xl">

          {/* Facility Configuration */}
          {activeTab === 'facility' && (
            <section className="space-y-8">
              <div className="mb-6">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Facility Details</h2>
                <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Core physical identity and operator contacts</p>
              </div>

              <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px] block">Facility Name</label>
                       <input type="text" className="w-full bg-gray-50/50 dark:bg-dark-input border border-gray-100 dark:border-dark-border rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-dark-text focus:outline-none focus:border-emerald-200 dark:focus:border-brand focus:bg-white dark:focus:bg-dark-surface transition-all" defaultValue={facilityInitialInfo.name} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px] block">Location</label>
                       <input type="text" className="w-full bg-gray-50/50 dark:bg-dark-input border border-gray-100 dark:border-dark-border rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-dark-text focus:outline-none focus:border-emerald-200 dark:focus:border-brand focus:bg-white dark:focus:bg-dark-surface transition-all" defaultValue={facilityInitialInfo.location} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px] block">Max Capacity</label>
                       <div className="relative">
                         <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-dark-text-muted" />
                         <input type="number" className="w-full bg-gray-50/50 dark:bg-dark-input border border-gray-100 dark:border-dark-border rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-900 dark:text-dark-text focus:outline-none focus:border-emerald-200 dark:focus:border-brand focus:bg-white dark:focus:bg-dark-surface transition-all" defaultValue={facilityInitialInfo.maxCapacity} />
                       </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px] block">Admin Email</label>
                       <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-dark-text-muted" />
                         <input type="email" className="w-full bg-gray-50/50 dark:bg-dark-input border border-gray-100 dark:border-dark-border rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-900 dark:text-dark-text focus:outline-none focus:border-emerald-200 dark:focus:border-brand focus:bg-white dark:focus:bg-dark-surface transition-all" defaultValue={facilityInitialInfo.adminEmail} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px] block">Phone Number</label>
                       <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-dark-text-muted" />
                         <input type="text" className="w-full bg-gray-50/50 dark:bg-dark-input border border-gray-100 dark:border-dark-border rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-900 dark:text-dark-text focus:outline-none focus:border-emerald-200 dark:focus:border-brand focus:bg-white dark:focus:bg-dark-surface transition-all" defaultValue={facilityInitialInfo.phone} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px] block">Operating Hours</label>
                       <div className="relative">
                         <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-dark-text-muted" />
                         <input type="text" className="w-full bg-gray-50/50 dark:bg-dark-input border border-gray-100 dark:border-dark-border rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-900 dark:text-dark-text focus:outline-none focus:border-emerald-200 dark:focus:border-brand focus:bg-white dark:focus:bg-dark-surface transition-all" defaultValue={facilityInitialInfo.operatingHours} />
                       </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Zones & Pods Configuration */}
          {activeTab === 'zones' && (
            <section className="space-y-8">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Zone Mapping</h2>
                  <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Assign Genyx Pods and Cameras to gym areas</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Add New Zone
                </Button>
              </div>

              <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl overflow-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Zone Name</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Assigned Pod</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Capacity</th>
                         <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">Feeds</th>
                         <th className="px-6 py-4 text-right"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                       {zoneConfigurations.map(zone => (
                         <tr key={zone.id} className="hover:bg-gray-50/30 dark:hover:bg-dark-elevated/30 transition-colors group">
                           <td className="px-6 py-5 font-black text-gray-900 dark:text-dark-text uppercase tracking-tight text-sm">{zone.name}</td>
                           <td className="px-6 py-5">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-gray-600 dark:text-dark-text-secondary">{zone.pod}</span>
                             </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className="text-xs font-black tabular-nums text-gray-900 dark:text-dark-text">{zone.capacity}</span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <Camera className="w-3.5 h-3.5 text-gray-300 dark:text-dark-text-muted" />
                                <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase">{zone.camera}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-dark-text-muted hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-black text-[10px] uppercase tracking-widest">Edit</Button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </Card>
            </section>
          )}

          {/* AI Intelligence Thresholds */}
          {activeTab === 'ai' && (
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">AI Intelligence Thresholds</h2>
                  <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Configure algorithmic trigger points for facility-wide alerts</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
                   <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                   <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">AI Engine: V4.2 PRO</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Threshold Controls */}
                <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiThresholds.map((t) => (
                    <Card key={t.id} className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl p-6 hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                            {t.id === 'congestion' ? <Users className="w-5 h-5" /> : t.id === 'form' ? <Activity className="w-5 h-5" /> : t.id === 'lead' ? <Plus className="w-5 h-5" /> : t.id === 'injury' ? <Shield className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-[2px]">Value</p>
                            <p className="text-xl font-black text-gray-900 dark:text-dark-text uppercase tracking-tight tabular-nums">
                              {t.id === 'form' ? t.value : t.value + (t.type === 'range' ? '%' : '')}
                            </p>
                         </div>
                      </div>
                      <div className="mb-6 relative z-10">
                         <h4 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight mb-1">{t.label}</h4>
                         <p className="text-[10px] text-gray-400 dark:text-dark-text-muted font-bold italic leading-relaxed">{t.desc}</p>
                      </div>

                      <div className="relative z-10">
                        {t.type === 'range' && (
                          <input
                            type="range"
                            className="w-full accent-emerald-500 bg-gray-100 dark:bg-dark-elevated rounded-lg h-1.5 appearance-none cursor-pointer"
                            value={t.value}
                            onChange={() => {}}
                          />
                        )}
                        {t.type === 'select' && (
                          <div className="flex gap-2">
                             {t.options.map(opt => (
                               <button
                                 key={opt}
                                 className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t.value === opt ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-50 dark:bg-dark-elevated text-gray-400 dark:text-dark-text-muted hover:bg-gray-100 dark:hover:bg-dark-hover'}`}
                               >
                                  {opt}
                               </button>
                             ))}
                          </div>
                        )}
                        {t.type === 'number' && (
                           <div className="flex items-center gap-4">
                              <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center font-black text-lg text-gray-400 dark:text-dark-text-muted hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/40">-</button>
                              <span className="flex-1 text-center font-black text-lg tabular-nums text-gray-900 dark:text-dark-text">{t.value}</span>
                              <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center font-black text-lg text-gray-400 dark:text-dark-text-muted hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/40">+</button>
                           </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* AI Impact Simulation */}
                <div className="xl:col-span-5">
                   <Card className="border-emerald-100 dark:border-emerald-900/40 shadow-2xl rounded-3xl overflow-hidden sticky top-32 border-2">
                      <div className="p-8 border-b border-gray-50 dark:border-dark-border bg-emerald-50/50 dark:bg-emerald-900/15">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                           <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-[3px]">Intelligence Simulator</h3>
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest leading-relaxed">
                          Projected alert volume based on current threshold configuration
                        </p>
                      </div>

                      <CardContent className="p-8 space-y-8">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest">Alert Density</p>
                               <p className="text-3xl font-mono font-black text-gray-900 dark:text-dark-text tabular-nums">~12<span className="text-sm text-gray-400 dark:text-dark-text-muted ml-1">/hr</span></p>
                               <div className="w-full bg-gray-100 dark:bg-dark-elevated h-1.5 rounded-full overflow-hidden">
                                  <div className="w-[40%] h-full bg-emerald-500" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest">Staff Workload</p>
                               <p className="text-3xl font-mono font-black text-gray-900 dark:text-dark-text tabular-nums">Low</p>
                               <div className="w-full bg-gray-100 dark:bg-dark-elevated h-1.5 rounded-full overflow-hidden">
                                  <div className="w-[20%] h-full bg-blue-500" />
                               </div>
                            </div>
                         </div>

                         <div className="p-6 bg-emerald-50 dark:bg-emerald-900/15 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                            <h4 className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-[2px] mb-3">AI Prediction</h4>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold italic leading-relaxed">
                              "Current settings will reduce noise by 42% while identifying 94% of critical safety events. Optimal for standard facility operations."
                            </p>
                         </div>

                         <Button className="w-full h-14 bg-slate-900 dark:bg-brand hover:bg-slate-800 dark:hover:bg-brand/90 text-white font-black uppercase tracking-[2px] text-xs rounded-2xl shadow-lg group transition-all">
                            Validate Intelligence Model
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </Button>
                      </CardContent>

                      <div className="px-8 py-4 bg-gray-50 dark:bg-dark-bg text-[9px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest text-center">
                         Model updated 2 minutes ago
                      </div>
                   </Card>
                </div>
              </div>
            </section>
          )}

          {/* User & Role Management */}
          {activeTab === 'users' && (
            <section className="space-y-8">
              <RolesPermissions />
            </section>
          )}

          {activeTab === 'alertRouting' && (
            <section className="space-y-8">
              <AlertRouting />
            </section>
          )}

          {/* Notifications & Integrations Panel */}
          {(activeTab === 'notifications' || activeTab === 'integrations') && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'notifications' ? (
                   <section>
                      <div className="mb-6">
                        <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Delivery Channels</h2>
                        <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Configure how system intelligence reaches your team</p>
                      </div>
                      <Card className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl divide-y divide-gray-50 dark:divide-dark-border">
                         {notificationPreferences.map(pref => (
                           <div key={pref.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div>
                                 <h4 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight mb-1">{pref.label}</h4>
                                 <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest">Global delivery trigger</p>
                              </div>
                              <div className="flex gap-4">
                                {['email', 'push', 'sms'].map(ch => (
                                   <label key={ch} className="flex items-center gap-2 cursor-pointer group">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${pref.channels.includes(ch) ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-50 dark:bg-dark-elevated text-gray-300 dark:text-dark-text-muted hover:bg-gray-100 dark:hover:bg-dark-hover'}`}>
                                         {ch === 'email' ? <Mail className="w-4 h-4" /> : ch === 'push' ? <Bell className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                                      </div>
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${pref.channels.includes(ch) ? 'text-gray-900 dark:text-dark-text' : 'text-gray-400 dark:text-dark-text-muted group-hover:text-gray-600 dark:group-hover:text-dark-text-secondary'}`}>{ch}</span>
                                   </label>
                                ))}
                              </div>
                           </div>
                         ))}
                      </Card>
                   </section>
                ) : (
                   <section>
                      <div className="mb-6 flex justify-between items-end">
                        <div>
                          <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Connected Apps</h2>
                          <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Extend GENYX intelligence with external platforms</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest">
                          Browse Registry
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {integrationList.map(item => (
                           <Card key={item.id} className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl p-6 group">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black transition-transform group-hover:scale-110">
                                    <Plus className="w-6 h-6" />
                                 </div>
                                 <Badge className={`border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest ${item.status === 'Connected' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-dark-elevated text-gray-400 dark:text-dark-text-muted'}`}>
                                    {item.status}
                                 </Badge>
                              </div>
                              <h4 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight mb-1">{item.name}</h4>
                              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[2px] mb-3">{item.type}</p>
                              <p className="text-[11px] text-gray-400 dark:text-dark-text-secondary font-bold leading-relaxed pr-8">{item.desc}</p>
                              <Button variant="ghost" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-[#059669] hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20">
                                 {item.status === 'Connected' ? 'Manage Settings' : 'Initialize App'}
                              </Button>
                           </Card>
                         ))}
                      </div>
                   </section>
                )}
             </div>
          )}

          {/* Security & Data Privacy */}
          {activeTab === 'security' && (
            <section className="space-y-8">
              <div className="mb-6">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Security & Privacy</h2>
                <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Configure global access protection and data anonymization</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {securitySettings.map(sec => (
                   <Card key={sec.id} className="border-gray-100 dark:border-dark-border shadow-sm rounded-2xl p-6 flex items-center justify-between group hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Shield className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight mb-1">{sec.label}</h4>
                            <p className="text-[11px] text-gray-400 dark:text-dark-text-secondary font-bold pr-12">{sec.desc}</p>
                         </div>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative transition-colors ${sec.enabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-dark-elevated'}`}>
                         <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${sec.enabled ? 'translate-x-6' : ''}`} />
                      </button>
                   </Card>
                 ))}
              </div>

              <div className="pt-8 border-t border-gray-100 dark:border-dark-border flex justify-end gap-3">
                 <Button variant="outline" className="h-10 px-8 text-[10px] font-black uppercase tracking-widest">Flush Sessions</Button>
                 <Button className="h-10 px-8 bg-critical hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Revoke All Access</Button>
              </div>
            </section>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <section className="space-y-8">
              <div className="mb-6">
                <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Appearance Settings</h2>
                <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Configure global display theme and data density</p>
              </div>

              <Card title="Display Theme" subtitle="Toggle between light and dark modes">
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={theme === 'dark' ? toggleTheme : undefined}
                    className={`flex-1 p-6 rounded-xl border flex flex-col items-center gap-3 transition-colors ${theme === 'light' ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated'}`}
                  >
                    <Sun className="w-6 h-6" />
                    <span className="text-xs font-black uppercase tracking-widest">Light Mode</span>
                  </button>
                  <button
                    onClick={theme === 'light' ? toggleTheme : undefined}
                    className={`flex-1 p-6 rounded-xl border flex flex-col items-center gap-3 transition-colors ${theme === 'dark' ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated'}`}
                  >
                    <Moon className="w-6 h-6" />
                    <span className="text-xs font-black uppercase tracking-widest">Dark Mode</span>
                  </button>
                </div>
              </Card>

              <Card title="Interface Density" subtitle="Control padding and spacing across the application">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  {['compact', 'comfortable', 'spacious'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-colors ${density === d ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-500 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-elevated'}`}
                    >
                      {d === 'compact' ? <AlignLeft className="w-5 h-5"/> : d === 'comfortable' ? <AlignCenter className="w-5 h-5"/> : <AlignJustify className="w-5 h-5"/>}
                      <span className="text-[10px] font-black uppercase tracking-widest">{d}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Developer Settings */}
          {activeTab === 'developer' && (
            <Developer />
          )}

          {/* Branding */}
          {activeTab === 'branding' && (
            <Branding />
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <DataManagement />
          )}

        </main>
      </div>
    </div>
  );
}
