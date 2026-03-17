import { Users, Activity, AlertCircle, Dumbbell, ArrowRight, DollarSign, TrendingUp } from 'lucide-react';
import { StatItem } from '../components/UI/StatItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import {
  AreaChart,
  Area,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useLocation } from '../context/LocationContext';
import { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';
import { EmptyState } from '../components/UI/EmptyState';
import { useNavigate } from 'react-router-dom';

const alerts = [
  { id: 1, title: 'Squat Rack 2 Congestion', time: '10 mins ago', type: 'warning', description: 'Avg wait time > 15 mins.' },
  { id: 2, title: 'Form Correction Needed', time: '25 mins ago', type: 'destructive', description: 'Member on Deadlift Platform A showing high-risk form.' },
  { id: 3, title: 'Potential PT Client', time: '1 hr ago', type: 'success', description: 'Member has been struggling with pull-ups. Good intro opportunity.' },
];

export function FacilityOverview() {
  const { currentLocation, allLocations, dataset } = useLocation();
  const [compareMode, setCompareMode] = useState(false);
  const navigate = useNavigate();
  const setupProgress = (() => {
    try { return JSON.parse(localStorage.getItem('setupProgress') || '{}'); } catch { return {}; }
  })();
  const podsConnected = localStorage.getItem('podsConnected') === 'true' || setupProgress.zones === true;

  const totalMRR = currentLocation.mrr || 0;
  const facilitySquareFootage = currentLocation.squareFootage || 1;
  const totalActiveMembers = currentLocation.activeMembers ?? currentLocation.memberCount ?? 0;
  const totalStaff = currentLocation.staffCount || 0;
  const avgMembershipDurationMonths = currentLocation.avgMembershipDurationMonths || 12;

  const revenuePerSqft = totalMRR / facilitySquareFootage;
  const avgMonthlyRevenue = totalActiveMembers > 0 ? totalMRR / totalActiveMembers : 0;
  const memberLTV = avgMonthlyRevenue * avgMembershipDurationMonths;

  const membersPerStaff = totalStaff > 0 ? Math.round(totalActiveMembers / totalStaff) : null;
  const staffToMemberRatioLabel = membersPerStaff ? `1:${membersPerStaff}` : '—';

  const actionItemsBreakdown = [
    { level: 'Critical', count: 2, cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900/40' },
    { level: 'High', count: 3, cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/40' },
    { level: 'Medium', count: 5, cls: 'bg-gray-50 dark:bg-dark-elevated text-gray-700 dark:text-dark-text-secondary border-gray-100 dark:border-dark-border' },
  ];
  const actionItemsTotal = actionItemsBreakdown.reduce((sum, x) => sum + x.count, 0);

  // Occupancy time series comes from dataset (date-pattern based)
  const baseSeries = dataset?.occupancySeries || [];

  // Generate compare series based on base series + variation
  const chartData = baseSeries.map(d => ({
    ...d,
    // Add 3 mock compare facilities 
    comp1: Math.max(10, d.members + (Math.random() * 40 - 20)),
    comp2: Math.max(10, d.members + (Math.random() * 60 - 30)),
    comp3: Math.max(10, d.members + (Math.random() * 20 - 10)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-[#F1F5F9] sm:text-3xl sm:tracking-tight">
            Facility Overview
          </h2>
          <p className="mt-2 text-sm leading-normal text-gray-500 dark:text-[#94A3B8]">
            Real-time insights and intelligence for your location.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:border-[#2D3748] dark:text-[#F1F5F9]">Download Report</Button>
          <Button className="bg-slate-900 text-white dark:bg-brand">Export Data</Button>
        </div>
      </div>

      <OnboardingTooltip />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem
          title="Current Occupancy"
          value={String(currentLocation.currentOccupancy ?? 0)}
          icon={Users}
          change="8%"
          changeType="positive"
          portfolioAvg="105"
          rank="#4 of 12"
        />
        <StatItem
          title="Avg Workout Duration"
          value="62 min"
          icon={Activity}
          change="2 min"
          changeType="negative"
          portfolioAvg="65 min"
          rank="#7 of 12"
        />
        <StatItem
          title="Equipment Utilization"
          value="78%"
          icon={Dumbbell}
          change="12%"
          changeType="positive"
          portfolioAvg="71%"
          rank="#2 of 12"
        />
        <StatItem
          title="Action Items"
          value="3"
          icon={AlertCircle}
          change="1"
          changeType="negative"
          portfolioAvg="4.2"
          rank="#5 of 12"
        />

        <StatItem
          title="Revenue per sq ft"
          value={`${formatCurrency(Math.round(revenuePerSqft), 'en-IN', currentLocation.currency)}/sq ft`}
          icon={DollarSign}
          change="3.1%"
          changeType="positive"
          portfolioAvg={`${formatCurrency(Math.round(revenuePerSqft * 0.92), 'en-IN', currentLocation.currency)}/sq ft`}
          rank="#3 of 12"
        />
        <StatItem
          title="Member LTV"
          value={formatCurrency(Math.round(memberLTV), 'en-IN', currentLocation.currency)}
          icon={TrendingUp}
          change="2.4%"
          changeType="positive"
          portfolioAvg={formatCurrency(Math.round(memberLTV * 0.95), 'en-IN', currentLocation.currency)}
          rank="#6 of 12"
        />
        <StatItem
          title="Staff-to-Member Ratio"
          value={staffToMemberRatioLabel}
          icon={Users}
          change={membersPerStaff ? `${membersPerStaff - 1}` : undefined}
          changeType="positive"
          portfolioAvg="1:44"
          rank="#4 of 12"
        />

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
            <CardTitle className="text-sm font-light leading-snug text-gray-500 dark:text-dark-text-secondary whitespace-normal">
              Action Items
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400 dark:text-dark-text-muted shrink-0 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-dark-text leading-tight tabular-nums">
              {actionItemsTotal}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {actionItemsBreakdown.map((x) => (
                <span
                  key={x.level}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${x.cls}`}
                >
                  <span className="tabular-nums">{x.count}</span> {x.level}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
               <CardTitle>Occupancy Trend today</CardTitle>
               <CardDescription>Live tracking vs historical average</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-medium text-gray-500 dark:text-[#94A3B8]">Compare Facilities</span>
               <button 
                 onClick={() => setCompareMode(!compareMode)}
                 className={`w-10 h-5 rounded-full relative transition-colors ${compareMode ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-700'}`}
               >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${compareMode ? 'translate-x-5' : ''}`} />
               </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {!podsConnected ? (
                <EmptyState
                  icon={<Users className="w-6 h-6" />}
                  title="No live data yet"
                  description="Connect your first Genyx Pod to see real-time occupancy"
                  primaryAction={{ label: 'Setup Pod', onClick: () => navigate('/health') }}
                  background={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, rgba(5,150,105,0.35), transparent 45%), radial-gradient(circle at 80% 40%, rgba(5,150,105,0.25), transparent 40%), linear-gradient(to right, rgba(5,150,105,0.12) 1px, transparent 1px), linear-gradient(to top, rgba(5,150,105,0.12) 1px, transparent 1px)',
                    backgroundSize: 'auto, auto, 28px 28px, 28px 28px',
                  }}
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'JetBrains Mono' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'JetBrains Mono' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'JetBrains Mono' }}
                      itemStyle={{ fontFamily: 'JetBrains Mono' }}
                    />
                    {compareMode && <Legend wrapperStyle={{ fontSize: '10px' }} />}
                    <Area
                      type="monotone"
                      dataKey="members"
                      name={currentLocation.name}
                      stroke="#0D9488"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMembers)"
                      animationDuration={800}
                    />
                    {compareMode && (
                      <>
                        <Line type="monotone" dataKey="comp1" name={allLocations[1]?.name || 'Facility B'} stroke="#2563EB" strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={800} />
                        <Line type="monotone" dataKey="comp2" name={allLocations[2]?.name || 'Facility C'} stroke="#D97706" strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={800} />
                        <Line type="monotone" dataKey="comp3" name={allLocations[3]?.name || 'Facility D'} stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 5" animationDuration={800} />
                      </>
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Intelligence Feed</CardTitle>
            <CardDescription>Actionable insights from your cameras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex gap-4 p-3 rounded-lg border border-gray-100 dark:border-[#2D3748] bg-gray-50/50 dark:bg-[#0F172A]/50 transition-colors hover:bg-gray-50 dark:hover:bg-[#1A1B2E]">
                  <div className="mt-1">
                    <span className="relative flex h-3 w-3">
                      {alert.type === 'destructive' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full border-2 border-critical opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        alert.type === 'destructive' ? 'bg-critical' :
                        alert.type === 'warning' ? 'bg-warning' : 'bg-success'
                      }`}></span>
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">{alert.title}</h4>
                    <p className="mt-1 text-xs font-light text-gray-500 dark:text-[#94A3B8]">{alert.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={alert.type}>{alert.time}</Badge>
                      <button className="text-xs font-medium text-brand hover:opacity-80 flex items-center">
                        Take Action <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
