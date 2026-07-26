import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface text-on-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
