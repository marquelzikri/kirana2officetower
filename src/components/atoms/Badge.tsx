import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'red' | 'white';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'red' }) => {
  const styles = variant === 'red' 
    ? 'bg-heritage-red text-white' 
    : 'bg-white text-black shadow-sm';

  return (
    <span className={`${styles} text-[10px] font-bold px-3 py-1 uppercase tracking-widest`}>
      {label}
    </span>
  );
};
