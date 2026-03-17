import React, { useMemo } from 'react';
import { LineChart, Line } from 'recharts';

export function Sparkline({
  data,
  color,
  trend,
}: {
  data: number[];
  color: string;
  trend: 'up' | 'down' | 'flat';
}) {
  const chartData = useMemo(() => data.map((v, i) => ({ i, v })), [data]);

  const stroke = color;
  const opacity = trend === 'flat' ? 0.6 : 0.9;

  return (
    <div className="flex items-center gap-2">
      <LineChart width={120} height={32} data={chartData}>
        <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} dot={false} isAnimationActive={false} strokeOpacity={opacity} />
      </LineChart>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-dark-text-muted">
        30D
      </span>
    </div>
  );
}

