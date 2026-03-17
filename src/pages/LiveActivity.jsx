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
                  <span className="font-medium text-gray-900 dark:text-dark-text">{zone.current}</span>
                  <span className="mx-1">/</span>
                  <span>{zone.capacity}</span>
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

      {/* Simulated Camera Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Camera Grid</CardTitle>
          <CardDescription>Live feeds with intelligence overlays</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden group">
                {/* Simulated feed placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-600 mb-2" />
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                   <Badge variant="outline" className="bg-black/50 text-white border-0 backdrop-blur-sm">Cam {i}</Badge>
                   <Badge variant="success" className="bg-emerald-500/80 text-white border-0 backdrop-blur-sm">LIVE</Badge>
                </div>
                {i === 2 && (
                  <div className="absolute border-2 border-[#059669] rounded bg-[#059669]/20 w-24 h-48 top-4 left-1/4 animate-pulse">
                    <span className="absolute -top-6 left-0 bg-[#059669] text-emerald-950 text-[10px] font-bold px-1 py-0.5 rounded">Form Correction</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">Free Weights Zone A</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
