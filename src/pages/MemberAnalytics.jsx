import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { Search, Filter, Mail, Tag, UserCheck, ShieldAlert, X, Phone, Calendar, Target, Activity, MapPin, Clock, AlertTriangle, ChevronRight, Contact, Dumbbell, PlaySquare } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';
import { EmptyState } from '../components/UI/EmptyState';
import { useAppConfig } from '../context/AppConfigContext';

export function MemberAnalytics() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentLocation, dataset } = useLocation();
  const { currentUser } = useAuth();
  const { memberDisplayName } = useAppConfig();
  const usersData = dataset?.members || [];
  const [sortKey, setSortKey] = useState('daysSinceLastVisit');
  const [sortDir, setSortDir] = useState('desc');

  const rows = useMemo(() => {
    const now = new Date();
    const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
    const daysBetween = (a, b) => Math.max(0, Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)));

    const computeChurnProbability = (u) => {
      const decline = clamp(u.visitDeclineRatePct ?? 0, 0, 100);
      const formDelta = Number(u.formScoreTrendDelta6m ?? 0);
      const formPenalty = formDelta < 0 ? Math.min(40, Math.abs(formDelta) * 20) : 0;
      const statusPenalty = u.status === 'Inactive' ? 25 : u.status === 'At Risk' ? 12 : 0;
      return clamp(15 + decline * 0.7 + formPenalty + statusPenalty, 0, 100);
    };

    return usersData.map((u) => {
      const lastVisitDt = u.lastVisitDate ? new Date(u.lastVisitDate) : null;
      const daysSinceLastVisit = lastVisitDt ? daysBetween(now, lastVisitDt) : null;
      const cadenceDays = Math.max(1, Number(u.avgVisitCadenceDays ?? 3));
      const predictedNextVisit = lastVisitDt ? new Date(lastVisitDt.getTime() + cadenceDays * 24 * 60 * 60 * 1000) : null;
      const churnProbability = computeChurnProbability(u);
      const churnTier = churnProbability > 70 ? 'High' : churnProbability >= 30 ? 'Medium' : 'Low';
      const showRevenueAtRisk = churnTier === 'High' || u.status === 'At Risk';

      return {
        ...u,
        name: memberDisplayName(u),
        churnProbability,
        churnTier,
        daysSinceLastVisit,
        predictedNextVisit,
        revenueAtRisk: showRevenueAtRisk ? (u.monthlyPlanValue ?? null) : null,
      };
    });
  }, [memberDisplayName, usersData]);

  const sortedRows = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const cmp = (a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (av instanceof Date && bv instanceof Date) return (av.getTime() - bv.getTime()) * dir;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    };

    const base = [...rows].sort(cmp);
    if (currentUser.role === 'trainer') {
      const allowedIds = new Set(currentUser.assignedMemberIds || []);
      return base.filter((r) => allowedIds.has(r.id));
    }
    return base;
  }, [currentUser.assignedMemberIds, currentUser.role, rows, sortDir, sortKey]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir(key === 'daysSinceLastVisit' ? 'desc' : 'asc');
  };

  const isFrontDesk = currentUser.role === 'front_desk';
  const setupProgress = (() => {
    try { return JSON.parse(localStorage.getItem('setupProgress') || '{}'); } catch { return {}; }
  })();
  const hasMembers = setupProgress.members === true && usersData.length > 0;

  const StatusBadge = ({ status }) => {
    const variants = {
      'Active': 'success',
      'At Risk': 'warning',
      'Inactive': 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-dark-text sm:text-3xl sm:tracking-tight">
            Gym Users Directory
          </h2>
          <p className="mt-2 text-sm leading-normal text-gray-500 dark:text-dark-text-secondary">
            Complete list of your facility's members and their AI-tracked metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button>Export List</Button>
        </div>
      </div>

      <OnboardingTooltip />

      {!hasMembers ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="Your member list is empty"
          description="Import your roster to start tracking performance"
          primaryAction={{
            label: 'Import CSV',
            onClick: () => {
              localStorage.setItem('openSetupWizard', 'true');
              window.location.reload();
            },
          }}
          secondaryAction={{
            label: 'Add Member Manually',
            onClick: () => {
              localStorage.setItem('openSetupWizard', 'true');
              window.location.reload();
            },
          }}
        />
      ) : (
      <Card>
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-dark-border flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4">
          <div>
            <CardTitle>All Members</CardTitle>
            <CardDescription>Click a member row to view full profile and actions</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-dark-text-muted" />
             <input type="text" placeholder="Search members..." className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input rounded-md text-sm text-gray-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#059669] dark:focus:ring-brand placeholder:text-gray-400 dark:placeholder:text-dark-text-muted" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-dark-text-secondary uppercase bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Member Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  {!isFrontDesk && <th className="px-6 py-4 font-medium whitespace-nowrap">Form Score</th>}
                  {!isFrontDesk && <th className="px-6 py-4 font-medium whitespace-nowrap">Visits (30d)</th>}
                  {!isFrontDesk && (
                    <th className="px-6 py-4 font-medium whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('churnProbability')}>
                      Churn Probability %
                    </th>
                  )}
                  <th className="px-6 py-4 font-medium whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('daysSinceLastVisit')}>
                    Days Since Last Visit
                  </th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('predictedNextVisit')}>
                    Predicted Next Visit
                  </th>
                  {!isFrontDesk && (
                    <th className="px-6 py-4 font-medium whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('revenueAtRisk')}>
                      Revenue at Risk
                    </th>
                  )}
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Last Visit</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Consistency</th>
                  {isFrontDesk && <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Check-in</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {sortedRows.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="bg-white dark:bg-dark-card hover:bg-gray-50/80 dark:hover:bg-dark-elevated/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#059669]/10 dark:bg-[#059669]/20 flex items-center justify-center text-[#059669] font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-dark-text group-hover:text-[#059669] transition-colors whitespace-nowrap">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-muted whitespace-nowrap">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                    {!isFrontDesk && <td className="px-6 py-4 font-medium text-gray-900 dark:text-dark-text">{user.formScore}</td>}
                    {!isFrontDesk && <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary">{user.visits30d}</td>}
                    {!isFrontDesk && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.churnTier === 'High' ? 'destructive' : user.churnTier === 'Medium' ? 'warning' : 'success'} className="text-[10px] font-black uppercase tracking-widest">
                          {Math.round(user.churnProbability)}%
                        </Badge>
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary tabular-nums">
                      {user.daysSinceLastVisit ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-dark-text-secondary whitespace-nowrap">
                      {user.predictedNextVisit ? user.predictedNextVisit.toLocaleDateString() : '—'}
                    </td>
                    {!isFrontDesk && (
                      <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary whitespace-nowrap">
                        {user.revenueAtRisk != null
                          ? formatCurrency(user.revenueAtRisk, 'en-IN', currentLocation.currency)
                          : '—'}
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-500 dark:text-dark-text-secondary whitespace-nowrap">{user.lastVisit}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
                        user.consistency === 'High' || user.consistency === 'Very High' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20 dark:ring-emerald-500/30' :
                        user.consistency === 'Low' || user.consistency === 'None' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-600/10 dark:ring-red-500/30' :
                        'bg-gray-50 dark:bg-dark-elevated text-gray-600 dark:text-dark-text-secondary ring-gray-500/10 dark:ring-dark-border'
                      }`}>
                        {user.consistency}
                      </span>
                    </td>
                    {isFrontDesk && (
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-[10px] font-black uppercase tracking-widest"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Check In
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Member Details Slide-out Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedUser(null)}>
          <div
            className="bg-white dark:bg-dark-surface shadow-2xl dark:shadow-black/50 w-full max-w-md h-full overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-start sticky top-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur z-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#059669]/10 dark:bg-[#059669]/20 flex items-center justify-center text-[#059669] text-xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text leading-tight">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary leading-normal">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-gray-400 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-full transition-colors"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">

               {/* Contact & Personal Info */}
               <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Contact className="w-4 h-4" /> Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary"><Phone className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" /> <span className="font-medium text-gray-900 dark:text-dark-text">{selectedUser.phone}</span></div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary"><Calendar className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" /> <span>{selectedUser.dob}</span></div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary"><Clock className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" /> <span>Joined {selectedUser.joinDate}</span></div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-text-secondary"><UserCheck className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" /> <span>Trainer: <span className="font-medium text-emerald-700 dark:text-emerald-400">{selectedUser.preferredTrainer}</span></span></div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border rounded-lg text-sm flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-dark-text block">Emergency Contact</span>
                      <span className="text-gray-600 dark:text-dark-text-secondary">{selectedUser.emergencyContact}</span>
                    </div>
                  </div>
               </div>

               {/* Performance Stats */}
               <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Form Score</p>
                      <p className="font-bold text-gray-900 dark:text-dark-text text-lg">{selectedUser.formScore}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Lifetime Visits</p>
                      <p className="font-bold text-gray-900 dark:text-dark-text text-lg">{selectedUser.lifetimeVisits}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-lg border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Goal</p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm whitespace-nowrap">{selectedUser.goal}</p>
                    </div>
                  </div>
               </div>

               {/* Biomechanics Alerts */}
               {selectedUser.biomechanics && selectedUser.biomechanics.length > 0 && (
                 <div>
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Biomechanics Flags
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.biomechanics.map((bio, idx) => (
                        <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-lg text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-bold text-red-900 dark:text-red-300">{bio.issue}</span>
                          <span className="text-red-700 dark:text-red-400 bg-white dark:bg-dark-surface px-2 py-0.5 rounded text-xs border border-red-200 dark:border-red-900/40">Severity: {bio.severity} • {bio.freq}</span>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* Recent Workouts */}
               <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" /> Recent Workouts
                  </h4>
                  <div className="space-y-3">
                    {selectedUser.recentWorkouts.map((workout, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-dark-text text-sm">{workout.type}</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-muted flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {workout.zone}
                          </p>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded inline-block">{workout.duration}</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-muted mt-0.5">{workout.date} at {workout.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                 <div className="grid grid-cols-2 gap-3">
                   <Button className="gap-2 justify-center w-full"><Mail className="h-4 w-4" /> Message</Button>
                   <Button variant="outline" className="gap-2 justify-center w-full"><UserCheck className="h-4 w-4" /> Follow-up</Button>
                   <Button variant="outline" className="gap-2 justify-center w-full"><Tag className="h-4 w-4" /> Tag</Button>
                   <Button variant="outline" className="gap-2 justify-center w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 border-red-200 dark:border-red-900/40"><ShieldAlert className="h-4 w-4" /> Flag</Button>
                 </div>
               </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
