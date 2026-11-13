import React from 'react';

interface MetricSparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const MetricSparkline: React.FC<MetricSparklineProps> = ({
  data = [45, 52, 58, 65, 60, 72, 68, 80],
  color = '#10B981',
  width = 90,
  height = 28,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End point dot */}
      {data.length > 0 && (
        <circle
          cx={width - 2}
          cy={height - 4 - ((data[data.length - 1] - min) / range) * (height - 8)}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
};

