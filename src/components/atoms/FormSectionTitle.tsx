import React from 'react';

interface FormSectionTitleProps {
  children: React.ReactNode;
  className?: string;
  borderBottom?: boolean;
}

export const FormSectionTitle: React.FC<FormSectionTitleProps> = ({
  children,
  className = '',
  borderBottom = true,
}) => {
  return (
    <h4
      className={`font-title-sm text-heritage-red font-semibold uppercase tracking-wider ${
        borderBottom ? 'mb-4 border-b border-outline-variant/10 pb-2' : ''
      } ${className}`}
    >
      {children}
    </h4>
  );
};
