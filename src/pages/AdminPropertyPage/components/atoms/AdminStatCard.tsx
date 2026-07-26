import React from 'react';

import { Icon } from '@/components/atoms/Icon';

interface AdminStatCardProps {
  title: string;
  value: number | string;
  subtext: string;
  iconName: string;
  iconColorClass?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtext,
  iconName,
  iconColorClass = 'text-heritage-red',
}) => {
  return (
    <div className="bg-surface border border-outline-variant/20 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between text-on-surface-variant mb-2">
        <span className="font-label-md font-semibold">{title}</span>
        <Icon name={iconName} className={`${iconColorClass} text-xl`} />
      </div>
      <p className="font-heading-md font-bold text-on-surface">{value}</p>
      <span className="text-xs text-on-surface-variant/70">{subtext}</span>
    </div>
  );
};
