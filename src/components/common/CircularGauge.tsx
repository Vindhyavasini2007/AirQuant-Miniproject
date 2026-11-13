import React from 'react';
import { getCategoryForAQI } from '../../data/mockData';

interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({ 
  value, 
  max = 500, 
  size = 200 
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // 240 degree gauge (from 150 deg to 390 deg)
  const startAngle = 150;
  const endAngle = 390;
  const angleRange = endAngle - startAngle;
  
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const currentAngle = startAngle + percentage * angleRange;
  
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const startCoord = polarToCartesian(x, y, r, end);
    const endCoord = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return [
      'M', startCoord.x, startCoord.y,
      'A', r, r, 0, largeArcFlag, 0, endCoord.x, endCoord.y,
    ].join(' ');
  };

  const bgPath = describeArc(center, center, radius, startAngle, endAngle);
  const valuePath = describeArc(center, center, radius, startAngle, currentAngle);
  
  const category = getCategoryForAQI(value);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size * 0.9} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="aqiGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={category.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={category.color} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <path
          d={bgPath}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Value Track */}
        {value > 0 && (
          <path
            d={valuePath}
            fill="none"
            stroke="url(#aqiGlow)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>

      {/* Center Label */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pt-2 text-center pointer-events-none"
        style={{ top: '-10px' }}
      >
        <span className="text-xs uppercase font-semibold tracking-wider text-charcoal-400">
          Air Quality Index
        </span>
        <span 
          className="text-5xl font-extrabold tracking-tight"
          style={{ color: category.color }}
        >
          {value}
        </span>
        <span className="text-xs font-medium text-charcoal-500 mt-1">
          Scale 0 - {max}
        </span>
      </div>

      {/* Min/Max Labels */}
      <div className="w-full flex justify-between px-6 -mt-3 text-[11px] font-medium text-charcoal-400">
        <span>0 Good</span>
        <span>500 Severe</span>
      </div>
    </div>
  );
};

