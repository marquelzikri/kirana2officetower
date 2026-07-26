import React from 'react';

interface PropertySpecItemProps {
  label: string;
  value: string;
}

export const PropertySpecItem: React.FC<PropertySpecItemProps> = ({ label, value }) => {
  return (
    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
      <span className="block text-[11px] font-metadata uppercase text-on-surface-variant mb-1">
        {label}
      </span>
      <span className="font-headline-md text-on-surface text-lg font-bold truncate block">
        {value}
      </span>
    </div>
  );
};
