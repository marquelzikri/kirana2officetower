import React from 'react';
import type { Stat } from '@/types';

interface StatItemProps {
  stat: Stat;
  variant?: 'hero' | 'trackRecord';
}

export const StatItem: React.FC<StatItemProps> = ({ stat, variant = 'hero' }) => {
  if (variant === 'hero') {
    return (
      <div className="border-l border-outline/20 pl-6">
        <div className="font-headline-md text-on-surface">{stat.value}</div>
        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase mt-1 tracking-widest">
          {stat.label}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-display-hero text-[64px] text-on-surface leading-none mb-4">
        {stat.value}
        {stat.suffix && <span className="text-heritage-red">{stat.suffix}</span>}
      </div>
      <p className="font-label-caps text-label-sm text-on-surface-variant tracking-widest">
        {stat.label}
      </p>
    </div>
  );
};
