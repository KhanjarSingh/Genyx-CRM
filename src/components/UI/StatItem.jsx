import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '../../lib/utils';
import { ArrowDownIcon, ArrowUpIcon, Globe } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

export function StatItem({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  className,
  portfolioAvg,
  rank
}) {
  const animatedValue = useCountUp(value);
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  const isNeutral = changeType === 'neutral';

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardHeader className="flex flex-row items-start lg:items-center justify-between pb-2 gap-2">
        <CardTitle className="text-sm font-light leading-snug text-gray-500 dark:text-dark-text-secondary whitespace-normal">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-gray-400 dark:text-dark-text-muted shrink-0 mt-1 lg:mt-0" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono text-gray-900 dark:text-dark-text leading-tight">{animatedValue}</div>

        {/* Primary Change Indicator */}
        {change && (
          <p className="text-xs mt-1 flex items-center mb-3">
            {isPositive && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            )}
            {isNegative && (
              <span className="text-red-600 dark:text-red-400 flex items-center font-medium">
                <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            )}
            {isNeutral && (
              <span className="text-gray-500 dark:text-dark-text-secondary font-medium">
                {change}
              </span>
            )}
            <span className="text-gray-400 dark:text-dark-text-muted ml-1.5">vs last month</span>
          </p>
        )}

        {/* Portfolio Metrics */}
        {(portfolioAvg || rank) && (
          <div className="pt-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
            {portfolioAvg && (
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Globe className="w-3 h-3 text-gray-400 dark:text-dark-text-muted" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-dark-text-secondary">
                  Avg: <span className="text-gray-900 dark:text-dark-text">{portfolioAvg}</span>
                </span>
              </div>
            )}
            {rank && (
              <div className="px-2 py-0.5 rounded bg-gray-50 dark:bg-dark-elevated text-[9px] font-black text-gray-500 dark:text-dark-text-secondary uppercase tracking-widest ml-auto">
                {rank}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
