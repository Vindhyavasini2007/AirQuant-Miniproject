import React from 'react';
import { MetricSparkline } from './MetricSparkline';

interface PollutantCardProps {
  name: string;
  fullName: string;
  value: number;
  unit: string;
  safeLimit: string;
  status: 'Safe' | 'Moderate' | 'High' | 'Hazardous';
  statusColor: string;
  sparklineData: number[];
  icon: React.ReactNode;
}

export const PollutantCard: React.FC<PollutantCardProps> = ({
  name,
  fullName,
  value,
  unit,
  safeLimit,
  status,
  statusColor,
  sparklineData,
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-200/80 shadow-subtle hover:shadow-premium transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 group-hover:bg-forest-100 transition-colors">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-charcoal-900 text-base">{name}</span>
              <span className="text-[11px] text-charcoal-400 font-medium">({safeLimit})</span>
            </div>
            <p className="text-xs text-charcoal-500 line-clamp-1">{fullName}</p>
          </div>
        </div>

        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors"
          style={{
            borderColor: `${statusColor}40`,
            backgroundColor: `${statusColor}15`,
            color: statusColor,
          }}
        >
          {status}
        </span>
      </div>

      <div className="flex items-end justify-between mt-2 pt-2 border-t border-charcoal-100">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {value}
            </span>
            <span className="text-xs font-medium text-charcoal-500">{unit}</span>
          </div>
          <span className="text-[10px] text-charcoal-400 font-medium">CPCB 24h Standard</span>
        </div>

        <div className="flex flex-col items-end">
          <MetricSparkline data={sparklineData} color={statusColor} />
          <span className="text-[10px] text-charcoal-400 mt-1">24h Variance</span>
        </div>
      </div>
    </div>
  );
};

