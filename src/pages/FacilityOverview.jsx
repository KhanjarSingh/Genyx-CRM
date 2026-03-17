import { Users, Activity, AlertCircle, Dumbbell, ArrowRight } from 'lucide-react';
import { StatItem } from '../components/UI/StatItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const occupancyData = [
  { time: '6 AM', members: 45 },
  { time: '7 AM', members: 55 },
  { time: '8 AM', members: 70 },
  { time: '9 AM', members: 85 },
  { time: '10 AM', members: 95 },
  { time: '11 AM', members: 80 },
  { time: '12 PM', members: 60 },
  { time: '1 PM', members: 50 },
  { time: '2 PM', members: 45 },
  { time: '3 PM', members: 40 },
  { time: '4 PM', members: 60 },
  { time: '5 PM', members: 90 },
  { time: '6 PM', members: 120 },
  { time: '7 PM', members: 110 },
  { time: '8 PM', members: 85 },
  { time: '9 PM', members: 55 },
  { time: '10 PM', members: 30 },
];

const alerts = [
  { id: 1, title: 'Squat Rack 2 Congestion', time: '10 mins ago', type: 'warning', description: 'Avg wait time > 15 mins.' },
  { id: 2, title: 'Form Correction Needed', time: '25 mins ago', type: 'destructive', description: 'Member on Deadlift Platform A showing high-risk form.' },
  { id: 3, title: 'Potential PT Client', time: '1 hr ago', type: 'success', description: 'Member has been struggling with pull-ups. Good intro opportunity.' },
];

export function FacilityOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl sm:tracking-tight">
            Facility Overview
          </h2>
          <p className="mt-2 text-sm leading-normal text-gray-500">
            Real-time insights and intelligence for your location.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Download Report</Button>
          <Button>Export Data</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem
          title="Current Occupancy"
          value="124"
          icon={Users}
          change="8%"
          changeType="positive"
        />
        <StatItem
          title="Avg Workout Duration"
          value="62 min"
          icon={Activity}
          change="2 min"
          changeType="negative"
        />
        <StatItem
          title="Equipment Utilization"
          value="78%"
          icon={Dumbbell}
          change="12%"
          changeType="positive"
        />
        <StatItem
          title="Active Alerts"
          value="3"
          icon={AlertCircle}
          change="1"
          changeType="negative"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Occupancy Trend today</CardTitle>
            <CardDescription>Live tracking vs historical average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMembers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Operator Intelligence</CardTitle>
            <CardDescription>Actionable insights from your cameras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50 transition-colors hover:bg-gray-50">
                  <div className="mt-1">
                    <span className="relative flex h-3 w-3">
                      {alert.type === 'destructive' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full border-2 border-red-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        alert.type === 'destructive' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-amber-500' : 'bg-[#059669] border border-emerald-500'
                      }`}></span>
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                    <p className="mt-1 text-xs text-gray-500">{alert.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={alert.type}>{alert.time}</Badge>
                      <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
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
