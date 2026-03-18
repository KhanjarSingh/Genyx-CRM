import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  ShieldAlert,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent } from '../components/UI/Card';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
  biomechanicsData,
  exerciseQualityData,
  gymHealthKPIs,
  memberProgressStats,
  memberSegmentData,
  membersAtRiskData,
  progressTrendData,
  ptVsSoloData,
  supplementalStats,
  trainerPerformanceData,
  weeklyActionPlan
} from './TrainingQualityData';

import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { EmptyState } from '../components/UI/EmptyState';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';
import { formatCurrency } from '../utils/currency';
import { useLocation } from '../context/LocationContext';
import { useNavigate } from 'react-router-dom';

// ─── Tiny helpers ──────────────────────────────────────────────────────────────

const ScoreColor = (s) => s >= 65 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

function MiniBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-dark-elevated rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: ScoreColor(score) }} />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color: ScoreColor(score) }}>{score}</span>
    </div>
  );
}

function MiniSparkline({ values, color = '#10b981' }) {
  const data = (values || []).map((v, i) => ({ i, v }));
  return (
    <LineChart width={80} height={24} data={data}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
    </LineChart>
  );
}

function BioCell({ value }) {
  if (value > 50) return <td className="px-3 py-3.5 text-center"><span className="inline-flex items-center justify-center w-10 h-6 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">{value}%</span></td>;
  if (value > 25) return <td className="px-3 py-3.5 text-center"><span className="inline-flex items-center justify-center w-10 h-6 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">{value}%</span></td>;
  if (value > 0)  return <td className="px-3 py-3.5 text-center text-xs text-gray-400 dark:text-dark-text-muted">{value}%</td>;
  return <td className="px-3 py-3.5 text-center text-gray-200 dark:text-dark-text-muted text-xs">—</td>;
}

const PLAN_STYLES = {
  critical: { accent: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/15',     border: 'border-red-200/60 dark:border-red-900/40',    label: 'Critical',     labelCls: 'bg-red-500 text-white',      icon: ShieldAlert },
  warning:  { accent: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/15',   border: 'border-amber-200/60 dark:border-amber-900/40',  label: 'High Priority', labelCls: 'bg-amber-500 text-white',    icon: AlertTriangle },
  positive: { accent: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/15', border: 'border-emerald-200/60 dark:border-emerald-900/40',label: 'Maintain',     labelCls: 'bg-emerald-500 text-white',   icon: CheckCircle2 },
};

const KPI_CONFIGS = {
  emerald: { iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', valueCls: 'text-gray-900 dark:text-dark-text', trendCls: 'text-emerald-600 dark:text-emerald-400' },
  blue:    { iconBg: 'bg-blue-100 dark:bg-blue-900/30',    iconColor: 'text-blue-600 dark:text-blue-400',    valueCls: 'text-gray-900 dark:text-dark-text', trendCls: 'text-emerald-600 dark:text-emerald-400' },
  green:   { iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', valueCls: 'text-gray-900 dark:text-dark-text', trendCls: 'text-emerald-600 dark:text-emerald-400' },
  amber:   { iconBg: 'bg-amber-100 dark:bg-amber-900/30',   iconColor: 'text-amber-600 dark:text-amber-400',   valueCls: 'text-gray-900 dark:text-dark-text', trendCls: 'text-amber-600 dark:text-amber-400'   },
  orange:  { iconBg: 'bg-orange-100 dark:bg-orange-900/30',  iconColor: 'text-orange-600 dark:text-orange-400',  valueCls: 'text-gray-900 dark:text-dark-text', trendCls: 'text-orange-600 dark:text-orange-400'  },
  red:     { iconBg: 'bg-red-100 dark:bg-red-900/30',     iconColor: 'text-red-500 dark:text-red-400',     valueCls: 'text-red-600 dark:text-red-400',  trendCls: 'text-red-500 dark:text-red-400'     },
};

const KPI_ICONS = {
  emerald: Target, blue: Activity, green: TrendingUp, amber: Users, orange: Zap, red: ShieldAlert,
};

const KPI_HELP_TEXT = {
  'Facility Form Score': 'Overall movement quality score across members based on AI analysis.',
  'Coaching Impact Delta': 'Difference in performance between coached vs solo workouts.',
  'Injury Risk Level': 'Estimated injury risk based on movement patterns and fatigue signals.',
  'Participation Rate': 'Percentage of active members engaging regularly in workouts.',
  'Form Degradation (Fatigue)': 'Drop in movement quality during sets, indicating fatigue buildup.',
  'Urgent Interventions': 'Number of members flagged for immediate coaching attention.',
  'Performance Speed': 'Average rate at which members improve movement quality and training performance over time.',
};

// ─── Main Component ────────────────────────────────────────────────────────────

export function TrainingIntelligence() {
  const { currentLocation } = useLocation();
  const liabilityMultiplier = currentLocation.currency === 'INR' ? 35000 : 450;
  const navigate = useNavigate();
  const setupProgress = (() => {
    try { return JSON.parse(localStorage.getItem('setupProgress') || '{}'); } catch { return {}; }
  })();
  const cvActive = localStorage.getItem('cvActive') === 'true' || setupProgress.zones === true;
  const [openKpiHelp, setOpenKpiHelp] = useState(null);
  const helpRefs = useRef({});

  useEffect(() => {
    if (!openKpiHelp) return undefined;

    const handlePointerDown = (event) => {
      const activeRef = helpRefs.current[openKpiHelp];
      if (activeRef && !activeRef.contains(event.target)) {
        setOpenKpiHelp(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [openKpiHelp]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-dark-bg transition-colors">

      {/* ── Sticky page header ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border px-6 py-5 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-[#059669]" />
              <span className="text-[11px] font-bold tracking-[4px] uppercase text-[#059669]">GENYX Training Insights</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-dark-text sm:text-3xl sm:tracking-tight">
              Coaching Command Center
            </h1>
            <p className="mt-2 text-sm leading-normal text-gray-500 dark:text-dark-text-secondary">
              Movement quality, coaching ROI, and injury risk.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 px-4 py-2 rounded-full uppercase tracking-widest">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
              Live Architecture
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-12">
        <OnboardingTooltip />

        {/* ── SECTION 1: FACILITY INTELLIGENCE ────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Facility Insights</h2>
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">High-level coaching & safety KPIs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {gymHealthKPIs.map((kpi, i) => {
              const cfg = KPI_CONFIGS[kpi.color] || KPI_CONFIGS.emerald;
              const Icon = KPI_ICONS[kpi.color] || KPI_ICONS.emerald;
              return (
                <Card key={i} className="border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${cfg.iconBg} shadow-sm`}>
                        <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                      </div>
                      <div
                        ref={(el) => { helpRefs.current[kpi.title] = el; }}
                        className="relative shrink-0"
                        onMouseEnter={() => setOpenKpiHelp(kpi.title)}
                        onMouseLeave={() => setOpenKpiHelp((current) => (current === kpi.title ? null : current))}
                      >
                        <button
                          type="button"
                          aria-label={`Explain ${kpi.title}`}
                          onClick={() => setOpenKpiHelp((current) => current === kpi.title ? null : kpi.title)}
                          className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 dark:border-dark-border bg-white/90 dark:bg-dark-elevated text-[11px] font-black text-gray-400 dark:text-dark-text-muted shadow-sm transition-colors hover:text-gray-700 dark:hover:text-dark-text"
                        >
                          ?
                        </button>

                        {openKpiHelp === kpi.title && (
                          <div className="absolute right-0 top-7 z-20 w-56 rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] dark:shadow-black/30 animate-in fade-in zoom-in-95 duration-150">
                            <p className="text-[11px] font-bold leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                              {KPI_HELP_TEXT[kpi.title]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary leading-tight mb-2 uppercase tracking-widest">{kpi.title}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className={`text-3xl font-black tracking-tighter tabular-nums ${cfg.valueCls}`}>{kpi.value}</span>
                      <span className="text-[10px] font-black text-gray-300 dark:text-dark-text-muted uppercase">{kpi.unit}</span>
                    </div>
                    <p className={`text-[10px] font-black ${cfg.trendCls} flex items-center gap-1 uppercase tracking-widest`}>
                      {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.trend}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 2: TRAINER PERFORMANCE ─────────────────────────────── */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Trainer Performance Index</h2>
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Average form score improvement per coach</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainerPerformanceData.map((t, i) => {
              const pct = Math.round((t.improvement / 30) * 100);
              const color = t.improvement >= 20 ? '#10b981' : t.improvement >= 12 ? '#f59e0b' : '#ef4444';
              return (
                <Card key={i} className="border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm" style={{ backgroundColor: color }}>
                        {t.name.split(' ')[1]?.charAt(0) || t.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight truncate">{t.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest">{t.members} members</p>
                      </div>
                      <div className="ml-auto text-right">
                        <span className="text-2xl font-black tracking-tighter" style={{ color }}>+{t.improvement}</span>
                        <p className="text-[10px] text-gray-300 dark:text-dark-text-muted font-bold uppercase">pts avg</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-50 dark:bg-dark-elevated rounded-full h-1.5 mb-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest">Specialty: {t.specialty}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-gray-100 dark:border-dark-border shadow-sm mt-4 rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <h3 className="text-[11px] font-black text-gray-900 dark:text-dark-text uppercase tracking-widest mb-5">PT vs. Solo Training 4 Week Progress</h3>
              <div className="space-y-6">
                {ptVsSoloData.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between text-[11px] mb-2 font-black uppercase tracking-widest">
                      <span className="text-gray-400 dark:text-dark-text-secondary">{d.label}</span>
                      <span className="font-black" style={{ color: d.fill }}>+{d.improvement} pts</span>
                    </div>
                    <div className="w-full bg-gray-50 dark:bg-dark-elevated rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.improvement / 25) * 100}%`, backgroundColor: d.fill }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── SECTION 3: MEMBER PROGRESS ──────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Member Progress Insights</h2>
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Movement improvement Speed & engagement</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Chart */}
            <Card className="xl:col-span-2 border-gray-100 dark:border-dark-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Performance Tier Trend</h3>
                    <p className="text-[10px] text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Facility performance shift over 6 months</p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-dark-text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />High</span>
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-dark-text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />Growing</span>
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-dark-text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.3)]" />Stalled</span>
                  </div>
                </div>
                <div className="h-[250px] mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressTrendData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gAmber" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gRed"   x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f87171" stopOpacity={0.15}/><stop offset="95%" stopColor="#f87171" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} unit="%" />
                      <RechartsTooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--tw-bg-opacity, #fff)' }} />
                      <Area type="monotone" dataKey="great"     name="High Performer" stroke="#10b981" strokeWidth={3} fill="url(#gGreen)" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                      <Area type="monotone" dataKey="improving" name="Progressing"    stroke="#f59e0b" strokeWidth={3} fill="url(#gAmber)" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                      <Area type="monotone" dataKey="needsHelp" name="Stalled"      stroke="#f87171" strokeWidth={3} fill="url(#gRed)"   dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stats sidebar */}
            <div className="flex flex-col gap-6">
              <Card className="border-gray-100 dark:border-dark-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest">Performance Speed</p>
                    <div
                      ref={(el) => { helpRefs.current['Performance Speed'] = el; }}
                      className="relative shrink-0"
                      onMouseEnter={() => setOpenKpiHelp('Performance Speed')}
                      onMouseLeave={() => setOpenKpiHelp((current) => (current === 'Performance Speed' ? null : current))}
                    >
                      <button
                        type="button"
                        aria-label="Explain Performance Speed"
                        onClick={() => setOpenKpiHelp((current) => current === 'Performance Speed' ? null : 'Performance Speed')}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 dark:border-dark-border bg-white/90 dark:bg-dark-elevated text-[11px] font-black text-gray-400 dark:text-dark-text-muted shadow-sm transition-colors hover:text-gray-700 dark:hover:text-dark-text"
                      >
                        ?
                      </button>

                      {openKpiHelp === 'Performance Speed' && (
                        <div className="absolute right-0 top-7 z-20 w-56 rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] dark:shadow-black/30 animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-[11px] font-bold leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                            {KPI_HELP_TEXT['Performance Speed']}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-5xl font-black text-gray-900 dark:text-dark-text tracking-tighter tabular-nums mb-1">{memberProgressStats.avgVelocity}</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">{memberProgressStats.velocityDesc}</p>

                  <div className="mt-8 pt-6 border-t border-gray-50 dark:border-dark-border flex items-center justify-between">
                     <span className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest">Coaching ROI Progress</span>
                     <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{memberProgressStats.coachedImpact}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-100 dark:border-dark-border shadow-sm">
                <CardContent className="p-6">
                  <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Coaching Flags</p>
                  <div className="space-y-4">
                    {[
                      { label: 'Form scores slipping', val: memberProgressStats.membersSlipping, cls: 'text-amber-600 dark:text-amber-400 font-black' },
                      { label: 'High injury risk', val: memberProgressStats.highCancelRisk, cls: 'text-red-500 dark:text-red-400 font-black' },
                      { label: 'Session Consistency', val: memberProgressStats.trainingConsistency, cls: 'text-emerald-600 dark:text-emerald-400 font-black' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                        <span className="text-gray-500 dark:text-dark-text-secondary">{r.label}</span>
                        <span className={r.cls}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: EXERCISE INTELLIGENCE ────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Exercise Quality Index</h2>
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">Facility-wide movement profile ranked by quality</p>
          </div>
          {!cvActive ? (
            <EmptyState
              icon={<Activity className="w-6 h-6" />}
              title="Waiting for movement data"
              description="Camera pods need to be active to generate insights"
              primaryAction={{ label: 'Check Pod Status', onClick: () => navigate('/health') }}
            />
          ) : (
            <Card className="border-gray-100 dark:border-dark-border shadow-sm overflow-hidden rounded-2xl">
              <div className="overflow-x-auto text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-dark-bg/80 border-b border-gray-100 dark:border-dark-border">
                      <th className="px-6 py-4 text-left font-black tracking-[2px]">Rank</th>
                      <th className="px-6 py-4 text-left font-black tracking-[2px]">Movement</th>
                      <th className="px-6 py-4 text-left font-black tracking-[2px] w-48">Quality Score</th>
                      <th className="px-6 py-4 text-left font-black tracking-[2px]">6-mo Trend</th>
                      <th className="px-6 py-4 text-left font-black tracking-[2px]">Cohort</th>
                      <th className="px-6 py-4 text-left font-black tracking-[2px] hidden md:table-cell">Primary IQ Gap</th>
                      <th className="px-6 py-4 text-left font-black tracking-[2px] hidden lg:table-cell">Insights Lead</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-border text-xs font-bold text-gray-900 dark:text-dark-text normal-case tracking-normal">
                    {exerciseQualityData.map((ex) => {
                      const liability = (ex.riskScore || 0) * liabilityMultiplier;
                      const sparkColor = ex.status === 'bad' ? '#ef4444' : ex.status === 'ok' ? '#f59e0b' : '#10b981';
                      return (
                        <Fragment key={ex.rank}>
                          <tr className="hover:bg-emerald-50/20 dark:hover:bg-emerald-900/10 transition-all group">
                            <td className="px-6 py-5 w-16">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-black shrink-0 ${ex.status === 'bad' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ex.status === 'ok' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>{ex.rank}</span>
                            </td>
                            <td className="px-6 py-5 min-w-[140px] font-black text-sm uppercase tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">{ex.name}</td>
                            <td className="px-6 py-5 min-w-[180px]">
                              <MiniBar score={ex.score} />
                            </td>
                            <td className="px-6 py-5">
                              <MiniSparkline values={ex.trend6m} color={sparkColor} />
                            </td>
                            <td className="px-6 py-5 min-w-[100px] text-gray-500 dark:text-dark-text-secondary font-black uppercase tracking-widest text-[10px] truncate">{ex.members} members</td>
                            <td className="px-6 py-5 hidden md:table-cell min-w-[150px]">
                              <span className="text-xs text-gray-400 dark:text-dark-text-muted font-bold leading-relaxed line-clamp-1 italic">"{ex.keyIssue}"</span>
                            </td>
                            <td className="px-6 py-5 hidden lg:table-cell min-w-[150px]">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded truncate block text-center ${ex.status === 'bad' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-50 dark:bg-dark-elevated text-gray-400 dark:text-dark-text-muted'}`}>{ex.suggestion}</span>
                            </td>
                          </tr>
                          <tr className="bg-white dark:bg-dark-surface">
                            <td colSpan={7} className="px-6 pb-5 -mt-2">
                              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary">
                                Est. liability exposure:{' '}
                                <span className="text-gray-900 dark:text-dark-text tabular-nums">
                                  {formatCurrency(Math.round(liability), currentLocation.currency === 'INR' ? 'en-IN' : 'en-US', currentLocation.currency)}/month
                                </span>
                              </div>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </section>

        {/* ── SECTIONS 4 + 5 GRID ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* Section 4: Biomechanics */}
          <section className="xl:col-span-3">
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Injury Prevention Dashboard</h2>
              <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">% of reps with detected joint deviation</p>
            </div>
            <Card className="border-gray-100 dark:border-dark-border shadow-sm overflow-hidden rounded-2xl">
              <div className="overflow-x-auto text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-dark-text-secondary">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-dark-bg/80 border-b border-gray-100 dark:border-dark-border">
                      <th className="px-6 py-4 text-left font-black tracking-[2px]">Movement</th>
                      <th className="px-3 py-4 text-center font-black tracking-[2px]" colSpan={2}>Knee</th>
                      <th className="px-3 py-4 text-center font-black tracking-[2px] border-l border-gray-100 dark:border-dark-border" colSpan={2}>Hip</th>
                      <th className="px-3 py-4 text-center font-black tracking-[2px] border-l border-gray-100 dark:border-dark-border" colSpan={2}>Shoulder</th>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/20 dark:bg-dark-bg/20">
                      <th className="px-6 py-2"></th>
                      <th className="px-3 py-2 text-center text-gray-300 dark:text-dark-text-muted font-bold">L</th>
                      <th className="px-3 py-2 text-center text-gray-300 dark:text-dark-text-muted font-bold">R</th>
                      <th className="px-3 py-2 text-center text-gray-300 dark:text-dark-text-muted font-bold border-l border-gray-100 dark:border-dark-border">L</th>
                      <th className="px-3 py-2 text-center text-gray-300 dark:text-dark-text-muted font-bold">R</th>
                      <th className="px-3 py-2 text-center text-gray-300 dark:text-dark-text-muted font-bold border-l border-gray-100 dark:border-dark-border">L</th>
                      <th className="px-3 py-2 text-center text-gray-300 dark:text-dark-text-muted font-bold">R</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-border text-xs font-bold text-gray-900 dark:text-dark-text">
                    {biomechanicsData.map((row, i) => (
                      <tr key={i} className="hover:bg-emerald-50/20 dark:hover:bg-emerald-900/10 transition-all group">
                        <td className="px-6 py-4 font-black uppercase tracking-tight text-gray-900 dark:text-dark-text">{row.exercise}</td>
                        <BioCell value={row.lKnee} /><BioCell value={row.rKnee} />
                        <BioCell value={row.lHip} /><BioCell value={row.rHip} />
                        <BioCell value={row.lShoulder} /><BioCell value={row.rShoulder} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border bg-gray-50/30 dark:bg-dark-bg/30 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-muted">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900/40" /> &gt;50% Urgent Intervention</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-900/40" /> 26–50% Performance Monitor</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-100 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border" /> &lt;25% Optimal Standard</span>
              </div>
            </Card>

          </section>

          {/* Section 5: Members who need attention */}
          <section className="xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">Intelligence Alerts</h2>
              <p className="text-xs text-gray-400 dark:text-dark-text-secondary font-bold uppercase tracking-widest mt-1">High-priority coaching intervention leads</p>
            </div>
            <Card className="border-gray-100 dark:border-dark-border shadow-sm h-full rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-50 dark:divide-dark-border">
                  {membersAtRiskData.map((m, i) => (
                    <div key={i} className="flex items-start gap-4 px-6 py-5 hover:bg-emerald-50/20 dark:hover:bg-emerald-900/10 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-elevated flex items-center justify-center text-gray-400 dark:text-dark-text-muted font-black text-sm shrink-0 border border-gray-200 dark:border-dark-border group-hover:bg-white dark:group-hover:bg-dark-surface transition-colors">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{m.name}</p>
                          <Badge className={`${m.risk === 'High' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'} text-[9px] font-black px-2 py-0.5 border-none uppercase tracking-widest`}>
                            {m.risk} RISK
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary font-bold italic leading-relaxed mb-3">"{m.issue}"</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded uppercase tracking-widest">{m.exercise}</span>
                          <span className="text-[11px] font-black tabular-nums" style={{ color: ScoreColor(m.score) }}>IQ: {m.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-5 border-t border-gray-100 dark:border-dark-border bg-gray-50/20 dark:bg-dark-bg/20">
                  <Button size="sm" variant="outline" className="w-full text-[10px] font-black h-10 uppercase tracking-widest text-[#059669] border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 shadow-none">
                    View Full Alert Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>


        {/* ── SECTION 7: WEEKLY ACTION PLAN ───────────────────────────────── */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-dark-text">Weekly Coaching Action Plan</h2>
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary mt-0.5">Auto-generated priorities · Week of Mar 10–16, 2026</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {weeklyActionPlan.map((item) => {
              const s = PLAN_STYLES[item.level];
              const Icon = s.icon;
              return (
                <Card key={item.priority} className={`border shadow-sm ${s.border} ${s.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
                  <CardContent className="p-5 flex flex-col h-full gap-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${s.labelCls}`}>{s.label}</span>
                      <Icon className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text leading-snug">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-dark-text-secondary mt-1 leading-relaxed">{item.reason}</p>
                    </div>
                    <ul className="flex-1 space-y-1.5 mt-1">
                      {item.actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-dark-text-secondary leading-snug">
                          <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-gray-300 dark:text-dark-text-muted" />{a}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-gray-200/70 dark:border-dark-border flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-dark-text-secondary">
                        <Target className="w-3 h-3" /><span className="font-medium">{item.impact}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-dark-text-muted">
                        <Users className="w-3 h-3" /><span>{item.owner}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── SUPPLEMENTAL INSIGHTS ───────────────────────────────────────── */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-dark-text">Additional Insights</h2>
            <p className="text-xs text-gray-400 dark:text-dark-text-secondary mt-0.5">Supplemental data to support class programming</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Injury Risk Index */}
            <Card className="bg-slate-900 text-white border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-[0.07]"><ShieldAlert className="w-28 h-28" /></div>
              <CardContent className="p-6 relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Facility Safety Index</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold tracking-tighter">{supplementalStats.injuryRiskScore}</span>
                  <span className="text-lg text-slate-500 pb-1">/ 100</span>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">{supplementalStats.injuryRiskLevel} Risk Profile</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${supplementalStats.injuryRiskScore}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* Exercise Popularity */}
            <Card className="border-gray-100 dark:border-dark-border shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-text mb-4">Exercise Popularity</h3>
                <div className="space-y-3">
                  {supplementalStats.exercisePopularity.map((ex, i) => {
                    const max = supplementalStats.exercisePopularity[0].sessions;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-700 dark:text-dark-text-secondary">{ex.exercise}</span>
                          <span className="text-gray-400 dark:text-dark-text-muted">{ex.sessions.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-dark-elevated rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#059669]" style={{ width: `${(ex.sessions / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Skill Distribution */}
            <Card className="border-gray-100 dark:border-dark-border shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-dark-text mb-4">Member Skill Distribution</h3>
                <div className="space-y-4">
                  {supplementalStats.skillDistribution.map((s, i) => {
                    const colors = ['bg-emerald-400', 'bg-blue-400', 'bg-purple-400'];
                    const tColors = ['text-emerald-600 dark:text-emerald-400', 'text-blue-600 dark:text-blue-400', 'text-purple-600 dark:text-purple-400'];
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-gray-700 dark:text-dark-text-secondary">{s.label}</span>
                          <span className={`font-bold ${tColors[i]}`}>{s.pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-dark-elevated rounded-full h-2">
                          <div className={`h-2 rounded-full ${colors[i]}`} style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-gray-400 dark:text-dark-text-secondary bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 px-3 py-2 rounded-lg leading-snug text-blue-700 dark:text-blue-300">
                  42% beginner base warrants a foundational movement course. Consider weekly beginner intro sessions.
                </p>
              </CardContent>
            </Card>

          </div>
        </section>

      </div>
    </div>
  );
}
