import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '../../lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export function StatItem({ title, value, change, changeType, icon: Icon, className }) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  const isNeutral = changeType === 'neutral';

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start lg:items-center justify-between pb-2 gap-2">
        <CardTitle className="text-sm font-medium leading-snug text-gray-500 whitespace-normal">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-gray-400 shrink-0 mt-1 lg:mt-0" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
        {change && (
          <p className="text-xs mt-1 flex items-center">
            {isPositive && (
              <span className="text-emerald-600 flex items-center font-medium">
                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            )}
            {isNegative && (
              <span className="text-red-600 flex items-center font-medium">
                <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            )}
            {isNeutral && (
              <span className="text-gray-500 font-medium">
                {change}
              </span>
            )}
            <span className="text-gray-400 ml-1.5">vs last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
