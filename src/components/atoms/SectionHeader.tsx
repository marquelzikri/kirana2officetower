import React from 'react';

interface SectionHeaderProps {
  caption: string;
  lineWidth?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  caption,
  lineWidth = 'w-10',
  className = 'mb-6',
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className={`${lineWidth} h-[1px] bg-heritage-red`}></div>
      <span className="font-label-caps text-label-sm text-heritage-red tracking-[0.2em]">
        {caption}
      </span>
    </div>
  );
};
