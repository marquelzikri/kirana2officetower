import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface text-on-surface focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-colors ${className}`}
      {...props}
    />
  );
};
