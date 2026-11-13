import React from 'react';
import { AQICategory } from '../../types';
import { CPCB_CATEGORIES } from '../../data/mockData';

interface AQIBadgeProps {
  category: AQICategory;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const AQIBadge: React.FC<AQIBadgeProps> = ({ 
  category, 
  size = 'md',
  showDot = true 
}) => {
  const std = CPCB_CATEGORIES[category] || CPCB_CATEGORIES['Moderate'];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${std.bgColor} ${std.textColor} ${std.borderColor} ${sizeClasses} transition-colors`}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: std.color }}
        />
      )}
      {category}
    </span>
  );
};

