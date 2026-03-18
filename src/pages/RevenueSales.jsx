import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Contact,
  CreditCard,
  DollarSign,
  Filter,
  LineChart as LucideLineChart,
  Mail,
  PieChart as LucidePieChart,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Plus,
  ShieldAlert,
  Tag,
  Target,
  Activity,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent } from '../components/UI/Card';
import {
  churnRiskStats,
  genyxImpactStats,
  leadFunnelData,
  pipelineLeads,
  recentConversions,
  revenueBreakdownData,
  revenueHealthKPIs,
  revenueTrendData,
  trainerDetailedLeaderboard,
  upgradeOpportunities
} from './RevenueSalesData';
import { useMemo, useRef, useState } from 'react';

import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { EmptyState } from '../components/UI/EmptyState';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';
import { formatCurrency } from '../utils/currency';
import { useLocation } from '../context/LocationContext';
import { useNavigate } from 'react-router-dom';

// ─── Tiny helpers ──────────────────────────────────────────────────────────────

const KPI_CONFIGS = {
  emerald: { iconBg: 'bg-success/10', iconColor: 'text-success', valueCls: 'text-gray-900', trendCls: 'text-success' },
  blue: { iconBg: 'bg-info/10', iconColor: 'text-info', valueCls: 'text-gray-900', trendCls: 'text-info' },
  green: { iconBg: 'bg-brand/10', iconColor: 'text-brand', valueCls: 'text-gray-900', trendCls: 'text-brand' },
  amber: { iconBg: 'bg-warning/10', iconColor: 'text-warning', valueCls: 'text-gray-900', trendCls: 'text-warning' },
};

const PriorityColor = (p) => p === 'High' ? '#DC2626' : p === 'Medium' ? '#D97706' : '#16A34A';
const PriorityCls = (p) => p === 'High' ? 'bg-critical/10 text-critical' : p === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success';

const KPI_ICON_MAP = {
  'Monthly Recurring Revenue': DollarSign,
  'CAC (Customer Acquisition Cost)': CreditCard,
  'Personal Training Revenue': Users,
  'ARPM (Avg Revenue Per Member)': BarChart3,
  'MRR Growth Rate (MoM)': TrendingUp,
  'Predicted Next Month': Target,
};

function formatRevenueKpiValue(title, rawValue, currencyCode) {
  const isPercentageMetric = title.includes('Growth Rate') || String(rawValue).includes('%');
  if (isPercentageMetric) return rawValue;

  const numericValue = Number.parseFloat(String(rawValue).replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numericValue)) return rawValue;

  return formatCurrency(numericValue, 'en-IN', currencyCode);
}

function formatRevenueDisplayValue(rawValue, currencyCode) {
  const rawString = String(rawValue);
  if (!/[$₹]/.test(rawString)) return rawValue;

  const numericValue = Number.parseFloat(rawString.replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numericValue)) return rawValue;

  return formatCurrency(numericValue, 'en-IN', currencyCode);
}

function formatRevenueDeltaValue(rawValue, currencyCode) {
  const rawString = String(rawValue).trim();
  if (!/[$₹]/.test(rawString)) return rawValue;

  const sign = rawString.startsWith('-') ? '-' : rawString.startsWith('+') ? '+' : '';
  const numericValue = Number.parseFloat(rawString.replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numericValue)) return rawValue;

  return `${sign}${formatCurrency(Math.abs(numericValue), 'en-IN', currencyCode)}`;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function RevenueSales() {
  const { currentLocation, dataset } = useLocation();
  const columns = ['Identified', 'Contacted', 'Follow Up', 'Converted', 'Not Interested'];
  const demoPipelineLeads = useMemo(() => {
    const demoNames = [
      'Ananya Mehta', 'Dev Patel', 'Ishita Rao', 'Arjun Nair', 'Mehul Shah',
      'Priyanshi Verma', 'Raghav Bedi', 'Tanvi Kulkarni', 'Yash Sood', 'Kiran Iyer',
      'Simran Gill', 'Aarav Joshi', 'Niharika Sen', 'Rohan Malhotra', 'Diya Kapoor'
    ];
    const demoIssues = [
      'Squat depth breaking under load',
      'Knee valgus detected on split squats',
      'Fatigue spike during HIIT finishers',
      'Shoulder instability on overhead press',
      'Lumbar flexion during heavy rows',
      'Early deadlift fatigue reducing output',
      'Inconsistent landing mechanics on jumps',
      'Limited hip drive during sled pushes',
      'Form drop-off in final working sets',
      'Recovery trend down after conditioning blocks'
    ];
    const demoActions = [
      'Offer a movement assessment session',
      'Recommend PT intro package',
      'Suggest recovery coaching plan',
      'Schedule coach outreach this week',
      'Share corrective exercise plan',
      'Present small-group clinic option',
      'Book a form review with trainer',
      'Send a low-friction follow-up message',
      'Recommend premium coaching cadence',
      'Re-engage with progress-focused check-in'
    ];
    const demoPriorities = ['High', 'Medium', 'Low'];

    return columns.flatMap((status, statusIndex) =>
      Array.from({ length: 10 }, (_, index) => {
        const name = demoNames[(statusIndex * 3 + index) % demoNames.length];
        const issue = demoIssues[(statusIndex + index) % demoIssues.length];
        const action = demoActions[(statusIndex * 2 + index) % demoActions.length];
        const priority = demoPriorities[(statusIndex + index) % demoPriorities.length];
        const score = Math.min(88, 28 + statusIndex * 8 + (index * 5) % 42);
        const avatar = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

        return {
          id: `demo-${statusIndex}-${index}`,
          name,
          status,
          priority,
          score,
          avatar,
          issue,
          action
        };
      })
    );
  }, [columns]);
  const initialPipeline = pipelineLeads.length >= columns.length * 2 ? pipelineLeads : [...pipelineLeads, ...demoPipelineLeads];
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedView, setSelectedView] = useState('All Stages');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const colRefs = useRef({});
  const navigate = useNavigate();
  const setupProgress = (() => {
    try { return JSON.parse(localStorage.getItem('setupProgress') || '{}'); } catch { return {}; }
  })();
  const paymentConnected = localStorage.getItem('paymentConnected') === 'true';
  const hasMembers = setupProgress.members === true;
  const pipelineData = pipeline.length > 0 ? pipeline : demoPipelineLeads;
  const shouldRenderPipeline = pipelineData.length > 0;
  const shouldShowPipelineEmptyState = !shouldRenderPipeline && !hasMembers;
  const filteredPipelineData = useMemo(() => (
    pipelineData.filter((lead) => {
      const matchesStage = selectedView === 'All Stages' || lead.status === selectedView;
      const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
      const matchesScore = scoreFilter === 'All'
        || (scoreFilter === '0-30' && lead.score < 30)
        || (scoreFilter === '30-60' && lead.score >= 30 && lead.score < 60)
        || (scoreFilter === '60+' && lead.score >= 60);
      const matchesSearch = searchQuery.trim().length === 0
        || lead.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

      return matchesStage && matchesPriority && matchesScore && matchesSearch;
    })
  ), [pipelineData, selectedView, priorityFilter, scoreFilter, searchQuery]);
  const visibleStages = selectedView === 'All Stages' ? columns : [selectedView];
  const pipelineByStatus = useMemo(
    () => Object.fromEntries(columns.map((status) => [status, filteredPipelineData.filter((lead) => lead.status === status)])),
    [columns, filteredPipelineData]
  );
  const selectedPipelineLead = pipelineData.find((lead) => lead.id === selectedLeadId) || null;

  console.log('Upsell Pipeline data', pipelineData);

  const seasonalRevenueTrend = dataset?.revenueTrend || revenueTrendData;

  const moveLead = (leadId, newStatus) => {
    setPipeline(pp => pp.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const roiEngineSection = (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-5 h-full">
        <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl h-full overflow-hidden relative min-h-[420px] flex flex-col p-8">
          <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-1/4 translate-y-1/4">
            <LucidePieChart className="w-72 h-72 text-brand" />
          </div>
          <div className="flex flex-col h-full relative z-10 w-full">
            <div className="flex items-center gap-2 mb-8">
              <Zap className="w-4 h-4 text-brand fill-brand" />
              <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Genyx ROI Engine</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-mono font-black text-white tracking-tighter tabular-nums">{genyxImpactStats[0].value}</span>
                <span className="text-brand text-2xl font-black">ROI</span>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-bold leading-relaxed uppercase tracking-wide">{genyxImpactStats[0].desc}</p>
            </div>

            <div className="space-y-6 flex-1 border-t border-white/5 pt-8">
              {genyxImpactStats.slice(1).map((s, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-5 last:border-0 last:pb-0 group/stat">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[2px] mb-1 group-hover/stat:text-brand transition-colors">{s.label}</p>
                    <p className="text-[10px] text-slate-600 font-bold max-w-[120px] leading-tight">{s.desc}</p>
                  </div>
                  <span className="text-2xl font-mono font-black text-white tabular-nums tracking-tighter">{formatRevenueDisplayValue(s.value, currentLocation.currency)}</span>
                </div>
              ))}
            </div>

            <Button className="w-full mt-10 bg-brand hover:bg-brand/90 text-white font-black h-12 gap-2 shadow-lg shadow-brand/20 uppercase tracking-widest text-[11px]">
              Genyx ROI Report <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-7 h-full">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr h-full">
          {revenueHealthKPIs.map((kpi, i) => (
            <Card key={i} className="group min-h-[220px] border-gray-200/80 bg-white/95 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg">
              <div className="flex h-full flex-col">
                <div className="flex min-h-[88px] items-start gap-4">
                  <div className={`flex h-14 w-14 shrink-0 rounded-[1.4rem] ${KPI_CONFIGS[kpi.color]?.iconBg || 'bg-gray-100 dark:bg-gray-800'} items-center justify-center shadow-inner`}>
                    {(() => {
                      const Icon = KPI_ICON_MAP[kpi.title] || DollarSign;
                      return <Icon className={`h-6 w-6 ${KPI_CONFIGS[kpi.color]?.iconColor || 'text-gray-400 dark:text-gray-500'}`} />;
                    })()}
                  </div>
                  <p className="flex-1 text-[11px] font-black leading-[1.5] text-gray-400 dark:text-[#94A3B8] uppercase tracking-[2px]">
                    {kpi.title}
                  </p>
                </div>

                <div className="mt-6">
                  <span className="block w-full text-3xl lg:text-4xl leading-tight font-mono font-black text-gray-900 dark:text-[#F1F5F9] tracking-[-0.03em] tabular-nums break-all">
                    {formatRevenueKpiValue(kpi.title, kpi.value, currentLocation.currency)}
                  </span>
                </div>

                <div className="mt-auto pt-6">
                  <div className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black ${kpi.positive ? 'bg-success/10 text-success dark:bg-success/20' : 'bg-critical/10 text-critical dark:bg-critical/20'}`}>
                    {kpi.positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    <span className="truncate max-w-[160px]">{formatRevenueDeltaValue(kpi.trend, currentLocation.currency)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );

  const dashboardTiles = [
    {
      id: 'analytics', content: (
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Card className="h-full overflow-hidden flex flex-col p-0">
              <div className="px-6 py-5 border-b border-gray-50 dark:border-[#2D3748] flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Revenue Performance</h3>
                  <p className="text-[11px] text-gray-400 dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Monthly recurring vs. targets</p>
                </div>
                <Badge variant="outline" className="text-[10px] h-6 border-success text-success font-black bg-success/10 uppercase tracking-widest">Growth Phase</Badge>
              </div>
              <CardContent className="p-6 flex-1 min-h-[350px]">
                {!paymentConnected ? (
                  <EmptyState
                    icon={<CreditCard className="w-6 h-6" />}
                    title="Connect your payment gateway"
                    description="Link Stripe or Razorpay to see revenue data"
                    primaryAction={{
                      label: 'Connect Payment Gateway',
                      onClick: () => {
                        localStorage.setItem('settings.activeTab', 'integrations');
                        navigate('/settings');
                      },
                    }}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={seasonalRevenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevAI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => formatCurrency(v, 'en-IN', currentLocation.currency).replace('.00', '')} />
                      <RechartsTooltip formatter={(v) => formatCurrency(v, 'en-IN', currentLocation.currency)} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', fontSize: '12px', fontWeight: 700, fontFamily: 'JetBrains Mono' }} itemStyle={{ fontFamily: 'JetBrains Mono' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#16A34A" strokeWidth={4} fillOpacity={1} fill="url(#colorRevAI)" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} animationDuration={800} />
                      <Line type="monotone" dataKey="target" name="Target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="10 6" dot={false} animationDuration={800} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0F172A] transition-colors">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1A1B2E] border-b border-gray-100 dark:border-[#2D3748] px-6 py-5 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-brand" />
              <span className="text-[11px] font-bold tracking-[4px] uppercase text-brand">GENYX Revenue Insights</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-[#F1F5F9] sm:text-3xl sm:tracking-tight">
              Revenue & Sales
            </h1>
            <p className="mt-2 text-sm leading-normal text-gray-500 dark:text-[#94A3B8]">
              Flexible pipeline, smart tracking, and coaching revenue insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white dark:bg-[#0F172A] border-gray-200 dark:border-[#2D3748] text-gray-600 dark:text-[#94A3B8] font-bold text-xs gap-2 h-9">
              <Plus className="w-3.5 h-3.5" /> New Lead
            </Button>
            <Button size="sm" className="bg-brand hover:bg-brand/90 text-white font-bold text-xs gap-2 h-9 px-4 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Manual Sale
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-12">
        <OnboardingTooltip />

        {/* ── ROI ENGINE (TOP) ───────────────────────────────────────────── */}
        {roiEngineSection}

        {/* ── SECTION: DASHBOARD TILES ───────────────────────────────────── */}
        {dashboardTiles.map((tile) => (
          <div key={tile.id}>
            {tile.content}
          </div>
        ))}

        {/* ── SECTION 4: UPSELL PIPELINE ──────────────────────────────────── */}
        <section className="bg-white dark:bg-[#1A1B2E] rounded-3xl border border-gray-100 dark:border-[#2D3748] p-8 shadow-sm overflow-hidden min-h-[600px] transition-colors">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter uppercase">Upsell Pipeline</h2>
              <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-1">Movement-intelligence driven sales funnel</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-10 font-bold gap-2 px-4 border-gray-200 dark:border-[#2D3748] bg-gray-50/30 dark:bg-[#0F172A]/30 text-gray-700 dark:text-[#F1F5F9]">
                <Filter className="w-4 h-4" /> Filter Views
              </Button>
              <Button size="sm" className="h-10 font-bold gap-2 bg-slate-900 dark:bg-brand text-white px-5 shadow-lg shadow-slate-200 dark:shadow-none">
                <Plus className="w-4 h-4" /> Manual Entry
              </Button>
            </div>
          </div>

          {shouldShowPipelineEmptyState ? (
            <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
              <div>
                <EmptyState
                  icon={<Zap className="w-6 h-6" />}
                  title="No leads generated yet"
                  description="AI leads appear once members are active in the facility"
                />
              </div>
              <div className="space-y-4">
                {columns.map((status) => (
                  <div key={status} className="rounded-3xl border border-gray-100 dark:border-[#2D3748] bg-gray-50/50 dark:bg-[#0F172A]/40 p-4 opacity-70 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_12px_rgba(22,163,74,0.2)]" />
                        <span className="text-[12px] font-black text-slate-700 dark:text-[#F1F5F9] uppercase tracking-[2px]">{status}</span>
                      </div>
                      <Badge variant="secondary" className="bg-white dark:bg-[#1A1B2E] border-slate-200 dark:border-[#2D3748] text-slate-500 dark:text-[#94A3B8] text-[10px] font-black px-2">0</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="h-44 rounded-2xl border border-dashed border-slate-200/70 dark:border-[#2D3748]/70 bg-white/60 dark:bg-[#1A1B2E]/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 min-h-[500px]">
              <div className="rounded-3xl border border-gray-100 dark:border-[#2D3748] bg-gray-50/60 dark:bg-[#0F172A]/45 p-4 md:p-5">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 dark:text-[#94A3B8] block mb-1.5">
                        View
                      </label>
                      <select
                        value={selectedView}
                        onChange={(e) => setSelectedView(e.target.value)}
                        className="h-10 min-w-[180px] rounded-xl border border-slate-200 dark:border-[#2D3748] bg-white dark:bg-[#1A1B2E] px-3 text-[11px] font-bold text-slate-700 dark:text-[#F1F5F9] outline-none transition-colors focus:border-brand"
                      >
                        <option value="All Stages">All Stages</option>
                        {columns.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 dark:text-[#94A3B8] block mb-1.5">
                        Priority
                      </label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="h-10 min-w-[140px] rounded-xl border border-slate-200 dark:border-[#2D3748] bg-white dark:bg-[#1A1B2E] px-3 text-[11px] font-bold text-slate-700 dark:text-[#F1F5F9] outline-none transition-colors focus:border-brand"
                      >
                        <option value="All">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 dark:text-[#94A3B8] block mb-1.5">
                        Score
                      </label>
                      <select
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                        className="h-10 min-w-[140px] rounded-xl border border-slate-200 dark:border-[#2D3748] bg-white dark:bg-[#1A1B2E] px-3 text-[11px] font-bold text-slate-700 dark:text-[#F1F5F9] outline-none transition-colors focus:border-brand"
                      >
                        <option value="All">All Scores</option>
                        <option value="0-30">0-30%</option>
                        <option value="30-60">30-60%</option>
                        <option value="60+">60%+</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="min-w-[220px]">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 dark:text-[#94A3B8] block mb-1.5">
                        Search
                      </label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search member"
                        className="h-10 w-full rounded-xl border border-slate-200 dark:border-[#2D3748] bg-white dark:bg-[#1A1B2E] px-3 text-[11px] font-bold text-slate-700 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] outline-none transition-colors focus:border-brand"
                      />
                    </div>
                    <div className="pt-0 sm:pt-6">
                      <div className="inline-flex items-center rounded-xl bg-white dark:bg-[#1A1B2E] border border-slate-200 dark:border-[#2D3748] px-3 h-10 text-[11px] font-black uppercase tracking-[1.8px] text-slate-500 dark:text-[#94A3B8]">
                        {filteredPipelineData.length} visible
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {filteredPipelineData.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 dark:border-[#2D3748] bg-gray-50/40 dark:bg-[#0F172A]/35 p-10 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#1A1B2E] shadow-sm flex items-center justify-center mb-4">
                    <Filter className="w-5 h-5 text-slate-300" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-[#F1F5F9] uppercase tracking-tight">No Leads Match These Filters</h3>
                  <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-2">Adjust the selected stage, priority, score, or search to broaden the pipeline view.</p>
                </div>
              ) : visibleStages.map((status) => {
                const leads = pipelineByStatus[status] || [];

                return (
                  <div
                    key={status}
                    ref={el => colRefs.current[status] = el}
                    className="rounded-3xl border border-gray-100 dark:border-[#2D3748] bg-gray-50/60 dark:bg-[#0F172A]/45 p-4 md:p-5 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_12px_rgba(22,163,74,0.25)]" />
                        <h3 className="text-[12px] font-black text-slate-700 dark:text-[#F1F5F9] uppercase tracking-[2px]">
                          {status}
                        </h3>
                        <Badge variant="secondary" className="bg-white dark:bg-[#1A1B2E] border-slate-200 dark:border-[#2D3748] text-slate-500 dark:text-[#94A3B8] text-[10px] font-black px-2">
                          {leads.length}
                        </Badge>
                      </div>
                      <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-[#F1F5F9] cursor-pointer transition-colors" />
                    </div>

                    {leads.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                        {leads.map((lead) => (
                          <div
                            key={lead.id}
                            title={`${lead.issue} | ${lead.action}`}
                            onClick={() => setSelectedLeadId(lead.id)}
                            className="group rounded-2xl border border-slate-200 dark:border-[#2D3748] bg-white dark:bg-[#1A1B2E] p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand/20 cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-[#2D3748] flex items-center justify-center font-black text-[11px] text-slate-500 dark:text-slate-200 shadow-inner shrink-0">
                                  {lead.avatar}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <h4 className="text-[12px] font-black text-slate-900 dark:text-[#F1F5F9] tracking-tight truncate">
                                      {lead.name}
                                    </h4>
                                    <Badge className={`${PriorityCls(lead.priority)} text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none shrink-0`}>
                                      {lead.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] font-black uppercase tracking-[1.8px] truncate">
                                      {status}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-success/10 text-success px-2 py-0.5 text-[10px] font-mono font-black tabular-nums shrink-0">
                                      {lead.score}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2.5">
                              <div className="h-1 rounded-full bg-slate-100 dark:bg-[#0F172A] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-success transition-[width]"
                                  style={{ width: `${lead.score}%` }}
                                />
                              </div>
                            </div>

                            <div className="mt-2.5 space-y-1 min-w-0">
                              <p className="text-[10px] text-slate-700 dark:text-[#F1F5F9] font-bold leading-4 truncate">
                                {lead.issue}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-[#94A3B8] leading-4 truncate">
                                {lead.action}
                              </p>
                            </div>

                            <div
                              className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-[#2D3748] flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex-1">
                                <select
                                  value={lead.status}
                                  onChange={(e) => moveLead(lead.id, e.target.value)}
                                  className="w-full h-8 rounded-lg border border-slate-200 dark:border-[#2D3748] bg-white dark:bg-[#0F172A] px-2.5 text-[10px] font-bold text-slate-700 dark:text-[#F1F5F9] outline-none transition-colors focus:border-brand"
                                >
                                  {columns.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <Button
                                onClick={() => setSelectedLeadId(lead.id)}
                                className="h-8 bg-brand hover:bg-brand/90 text-white font-black text-[10px] gap-1.5 px-3 rounded-lg uppercase tracking-widest shrink-0"
                              >
                                Engage <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-44 border border-dashed border-slate-200 dark:border-[#2D3748] flex flex-col items-center justify-center rounded-2xl opacity-50 bg-white/60 dark:bg-[#1A1B2E]/40">
                        <div className="w-12 h-12 bg-white dark:bg-[#1A1B2E] rounded-full flex items-center justify-center shadow-sm mb-3">
                          <UserPlus className="w-6 h-6 text-slate-300" />
                        </div>
                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-[3px]">No Leads Here</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <AnimatePresence>
            {selectedPipelineLead && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex justify-end bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedLeadId(null)}
              >
                <motion.div
                  initial={{ x: 32 }}
                  animate={{ x: 0 }}
                  exit={{ x: 32 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-dark-surface shadow-2xl dark:shadow-black/50 w-full max-w-md h-full overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-start sticky top-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-[#059669]/10 dark:bg-[#059669]/20 flex items-center justify-center text-[#059669] text-xl font-bold">
                        {selectedPipelineLead.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text leading-tight">{selectedPipelineLead.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary leading-normal">{selectedPipelineLead.status} lead</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLeadId(null)}
                      className="p-2 text-gray-400 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-full transition-colors"
                      aria-label="Close panel"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Contact className="w-4 h-4" /> Lead Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
                          <Users className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
                          <span className="font-medium text-gray-900 dark:text-dark-text">{selectedPipelineLead.avatar}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
                          <Target className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
                          <span>{selectedPipelineLead.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
                          <ShieldAlert className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
                          <span>Priority: <span className="font-medium text-gray-900 dark:text-dark-text">{selectedPipelineLead.priority}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary">
                          <BarChart3 className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
                          <span>Form Logic: <span className="font-medium text-emerald-700 dark:text-emerald-400">{selectedPipelineLead.score}%</span></span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border rounded-lg text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-dark-text block">Full Issue</span>
                          <span className="text-gray-600 dark:text-dark-text-secondary">{selectedPipelineLead.issue}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Performance Metrics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center">
                          <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Form Score</p>
                          <p className="font-bold text-gray-900 dark:text-dark-text text-lg">{selectedPipelineLead.score}%</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center">
                          <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Priority</p>
                          <p className="font-bold text-gray-900 dark:text-dark-text text-lg">{selectedPipelineLead.priority}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                          <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Stage</p>
                          <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm whitespace-nowrap">{selectedPipelineLead.status}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Recommended Actions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none gap-3">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-dark-text text-sm">{selectedPipelineLead.action}</p>
                            <p className="text-xs text-gray-500 dark:text-dark-text-muted flex items-center gap-1 mt-0.5">
                              <MessageSquare className="w-3 h-3" /> AI-guided upsell recommendation
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded inline-block">Priority {selectedPipelineLead.priority}</p>
                            <p className="text-xs text-gray-500 dark:text-dark-text-muted mt-0.5">Optimized for {selectedPipelineLead.status.toLowerCase()}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Form Logic Progress</p>
                            <p className="font-bold text-gray-900 dark:text-dark-text text-sm">{selectedPipelineLead.score}%</p>
                          </div>
                          <div className="h-2 rounded-full bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border overflow-hidden">
                            <div className="h-full rounded-full bg-success" style={{ width: `${selectedPipelineLead.score}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                      <div className="mb-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-dark-text-secondary mb-2 block">
                          Status
                        </label>
                        <select
                          value={selectedPipelineLead.status}
                          onChange={(e) => moveLead(selectedPipelineLead.id, e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-elevated px-3 text-[11px] font-bold text-slate-700 dark:text-dark-text outline-none transition-colors focus:border-brand"
                        >
                          {columns.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button className="gap-2 justify-center w-full"><Mail className="h-4 w-4" /> Message</Button>
                        <Button variant="outline" className="gap-2 justify-center w-full"><UserCheck className="h-4 w-4" /> Follow-up</Button>
                        <Button variant="outline" className="gap-2 justify-center w-full"><Tag className="h-4 w-4" /> Tag</Button>
                        <Button variant="outline" className="gap-2 justify-center w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 border-red-200 dark:border-red-900/40"><ShieldAlert className="h-4 w-4" /> Flag</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── FINAL ROW: SALES LOG ─────────────────────────────────────────── */}
        <section>
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-[#F1F5F9] tracking-tight">Recent Conversions</h2>
              <p className="text-xs text-gray-400 dark:text-[#94A3B8] mt-1">Chronological record of movement-triggered sales</p>
            </div>
            <Button variant="outline" size="sm" className="h-9 font-black uppercase tracking-widest border-gray-200 dark:border-[#2D3748] text-gray-500 dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#0F172A] text-[10px] bg-transparent">View Full Log</Button>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-[#0F172A]/80 border-b border-gray-100 dark:border-[#2D3748] transition-colors">
                    <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-[#94A3B8]">Member</th>
                    <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-[#94A3B8]">Pkg / Signal</th>
                    <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-[#94A3B8]">Conversion Method</th>
                    <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-[#94A3B8]">Value</th>
                    <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[3px] text-gray-400 dark:text-[#94A3B8]">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#2D3748] transition-colors">
                  {recentConversions.map((conv, i) => (
                    <tr key={i} className="hover:bg-brand/5 dark:hover:bg-brand/10 transition-all group">
                      <td className="px-8 py-6 font-bold text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">{conv.member}</td>
                      <td className="px-8 py-6">
                        <Badge className="bg-brand/10 text-brand border-brand/20 text-[10px] font-black uppercase tracking-widest px-3 h-6">{conv.pkg}</Badge>
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-500 dark:text-[#94A3B8] font-bold max-w-xs">{conv.method}</td>
                      <td className="px-8 py-6 text-right font-mono font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter text-lg">{formatRevenueDisplayValue(conv.value, currentLocation.currency)}</td>
                      <td className="px-8 py-6 text-right text-[10px] text-gray-400 dark:text-[#94A3B8] font-black uppercase tracking-widest">{conv.date}</td>
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
