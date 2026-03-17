import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { Card, CardContent } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { formatCurrency } from '../utils/currency';
import { useCountUp } from '../hooks/useCountUp';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export function CorporateOverview() {
  const { allLocations, setLocation } = useLocation();
  const [sortField, setSortField] = useState('healthScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Aggregates
  const totalMembers = allLocations.reduce((sum, loc) => sum + loc.memberCount, 0);
  const totalMRR = allLocations.reduce((sum, loc) => sum + loc.mrr, 0);
  
  const animatedMembers = useCountUp(totalMembers);
  const animatedMRR = useCountUp(formatCurrency(totalMRR, 'en-IN', 'INR'));
  
  const avgHealthScore = Math.round(allLocations.reduce((sum, loc) => sum + loc.healthScore, 0) / allLocations.length);
  const animatedHealthScore = useCountUp(avgHealthScore);

  const getHealthColor = (score) => {
    if (score >= 75) return 'text-success bg-success/10 dark:bg-success/20';
    if (score >= 50) return 'text-warning bg-warning/10 dark:bg-warning/20';
    return 'text-critical bg-critical/10 dark:bg-critical/20';
  };

  const getHealthDot = (score) => {
    if (score >= 75) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-critical';
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLocations = [...allLocations]
    .filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.region.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0F172A] transition-colors">
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1A1B2E] border-b border-gray-100 dark:border-[#2D3748] px-6 py-5 mb-0 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-brand" />
              <span className="text-[11px] font-black tracking-[4px] uppercase text-brand">Executive Command</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-[#F1F5F9] sm:text-3xl sm:tracking-tight">
              Corporate Overview
            </h1>
            <p className="mt-2 text-sm leading-normal text-gray-500 dark:text-[#94A3B8]">
              Global portfolio performance · {allLocations.length} facilities
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 max-w-[1600px] mx-auto">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:border-brand/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-gray-400 dark:text-[#94A3B8]">
                  <Users className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Total Network Members</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-mono font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter tabular-nums">{animatedMembers}</h3>
                <div className="flex flex-col items-end">
                  <span className="flex items-center text-success text-[10px] font-bold tracking-wider">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 8.4%
                  </span>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">vs last quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:border-brand/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-gray-400 dark:text-[#94A3B8]">
                  <TrendingUp className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Aggregate MRR</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-mono font-black text-gray-900 dark:text-[#F1F5F9] tracking-tighter tabular-nums">{animatedMRR}</h3>
                <div className="flex flex-col items-end">
                  <span className="flex items-center text-success text-[10px] font-bold tracking-wider">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.1%
                  </span>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">vs last quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border border-transparent shadow-sm p-6 relative overflow-hidden ${avgHealthScore >= 75 ? 'bg-success border-success' : avgHealthScore >= 50 ? 'bg-warning border-warning' : 'bg-critical border-critical'}`}>
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-white/90">
                 <ShieldCheck className="w-4 h-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Network Health Score</p>
              </div>
            </div>
            <div className="relative z-10 flex items-end justify-between">
              <h3 className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums">{animatedHealthScore}<span className="text-2xl text-white/50 ml-1">/100</span></h3>
              <div className="flex flex-col items-end">
                 <span className="flex items-center text-white text-[10px] font-bold tracking-wider opacity-90">
                   <ArrowUpRight className="w-3 h-3 mr-0.5" /> 2 pts
                 </span>
                 <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-1">vs last month</p>
              </div>
            </div>
            <Activity className="absolute -right-8 -bottom-8 w-40 h-40 text-black/10 z-0" />
          </Card>
        </div>

        {/* Facility Roster */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">Facility Roster</h2>
              <p className="text-xs text-gray-400 dark:text-[#94A3B8] font-light uppercase tracking-widest mt-1">Performance breakdown by location</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search facilities..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2D3748] bg-white dark:bg-[#1A1B2E] text-gray-900 dark:text-[#F1F5F9] rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand w-64 shadow-sm transition-colors"
              />
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#0F172A]/50 border-b border-gray-100 dark:border-[#2D3748]">
                    <th className="px-6 py-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#2D3748] transition-colors" onClick={() => handleSort('name')}>
                       <div className="flex items-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] group-hover:text-gray-600 dark:group-hover:text-white">
                          Facility Info
                          {sortField === 'name' && (sortDirection === 'asc' ? <ArrowDownRight className="w-3 h-3 ml-1" /> : <ArrowUpRight className="w-3 h-3 ml-1" />)}
                       </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#2D3748] transition-colors" onClick={() => handleSort('region')}>
                       <div className="flex items-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] group-hover:text-gray-600 dark:group-hover:text-white">
                          Region
                          {sortField === 'region' && (sortDirection === 'asc' ? <ArrowDownRight className="w-3 h-3 ml-1" /> : <ArrowUpRight className="w-3 h-3 ml-1" />)}
                       </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#2D3748] transition-colors text-right" onClick={() => handleSort('memberCount')}>
                       <div className="flex items-center justify-end text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] group-hover:text-gray-600 dark:group-hover:text-white">
                          Active Members
                          {sortField === 'memberCount' && (sortDirection === 'asc' ? <ArrowDownRight className="w-3 h-3 ml-1" /> : <ArrowUpRight className="w-3 h-3 ml-1" />)}
                       </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#2D3748] transition-colors text-right" onClick={() => handleSort('mrr')}>
                       <div className="flex items-center justify-end text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] group-hover:text-gray-600 dark:group-hover:text-white">
                          MRR
                          {sortField === 'mrr' && (sortDirection === 'asc' ? <ArrowDownRight className="w-3 h-3 ml-1" /> : <ArrowUpRight className="w-3 h-3 ml-1" />)}
                       </div>
                    </th>
                    <th className="px-6 py-4 cursor-pointer group hover:bg-gray-100 dark:hover:bg-[#2D3748] transition-colors text-right" onClick={() => handleSort('healthScore')}>
                       <div className="flex items-center justify-end text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8] group-hover:text-gray-600 dark:group-hover:text-white">
                          Health Score
                          {sortField === 'healthScore' && (sortDirection === 'asc' ? <ArrowDownRight className="w-3 h-3 ml-1" /> : <ArrowUpRight className="w-3 h-3 ml-1" />)}
                       </div>
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-[#94A3B8]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#2D3748]">
                   {sortedLocations.length > 0 ? sortedLocations.map(loc => (
                     <tr key={loc.id} className="hover:bg-gray-50/50 dark:hover:bg-[#2D3748]/50 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${getHealthDot(loc.healthScore)}`} />
                           <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-[#F1F5F9] uppercase tracking-tight">{loc.name}</p>
                             <p className="text-[10px] text-gray-400 dark:text-[#94A3B8] font-light uppercase tracking-widest">{loc.id}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest dark:border-[#2D3748] text-gray-600 dark:text-[#94A3B8] bg-transparent">
                            {loc.region}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <span className="text-sm font-mono font-semibold tabular-nums text-gray-900 dark:text-[#F1F5F9]">{loc.memberCount.toLocaleString()}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <span className="text-sm font-mono font-semibold tabular-nums text-gray-900 dark:text-[#F1F5F9]">{formatCurrency(loc.mrr, 'en-IN', loc.currency)}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-mono font-bold tabular-nums ${getHealthColor(loc.healthScore)}`}>
                             {loc.healthScore}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button 
                             onClick={() => {
                                setLocation(loc.id);
                                window.location.href = '/';
                             }}
                             className="text-[10px] font-black uppercase tracking-widest text-brand hover:opacity-80 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             View Dashboard
                          </button>
                       </td>
                     </tr>
                   )) : (
                     <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-[#94A3B8] font-light">
                           No facilities found matching your search.
                        </td>
                     </tr>
                   )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}
