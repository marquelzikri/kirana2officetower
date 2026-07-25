import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex-1 bg-surface border border-outline-variant/40 text-on-surface focus:border-heritage-red focus:ring-0 px-6 py-4 outline-none transition-colors ${className}`}
      {...props}
    />
  );
};
