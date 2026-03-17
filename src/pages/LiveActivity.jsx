import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Camera, Users, ArrowRight } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { OnboardingTooltip } from '../components/UI/OnboardingTooltip';

export function LiveActivity() {
  const { dataset } = useLocation();
  const zones = dataset?.zones || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-dark-text sm:text-3xl sm:tracking-tight">
          Live Activity
        </h2>
        <p className="mt-2 text-sm leading-normal text-gray-500 dark:text-dark-text-secondary">
          Real-time zone utilization and camera feeds.
        </p>
      </div>

      <OnboardingTooltip />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map(zone => (
          <Card key={zone.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{zone.name}</CardTitle>
                <Badge variant={zone.status}>
                  {zone.status === 'destructive' ? 'Over Capacity' : zone.status === 'warning' ? 'Near Capacity' : zone.current === 0 ? 'Empty' : 'Optimal'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-dark-text-secondary">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span className="font-mono font-bold tabular-nums text-gray-900 dark:text-dark-text">{zone.current}</span>
                  <span className="mx-1">/</span>
                  <span className="font-mono font-bold tabular-nums">{zone.capacity}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 dark:text-dark-text-muted">
                  <Camera className="h-4 w-4 mr-1" />
                  {zone.cameras} Feeds
                </div>
              </div>
              <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-dark-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    zone.status === 'destructive' ? 'bg-red-500' :
                    zone.status === 'warning' ? 'bg-amber-500' :
                    'bg-[#059669]'
                  }`}
                  style={{ width: `${Math.min((zone.current / zone.capacity) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Alerts: Members Who Need Attention</CardTitle>
          <CardDescription>Real-time coaching opportunities and form corrections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 p-3 rounded-lg border border-red-100 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/15">
              <div className="mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full border-2 border-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Form Correction Needed: Deadlift</h4>
                <p className="mt-1 text-xs text-gray-600 dark:text-dark-text-secondary">Rahul on Deadlift Platform A is showing high-risk lower back curvature.</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="destructive">2 mins ago</Badge>
                  <button className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center">
                    Intervene <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/15">
              <div className="mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#059669]"></span>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-dark-text">Potential PT Lead: Squats</h4>
                <p className="mt-1 text-xs text-gray-600 dark:text-dark-text-secondary">Aditya has been struggling with Squat depth for the 3rd consecutive session.</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="success">15 mins ago</Badge>
                  <button className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
                    Offer Assistance <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
