import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  required = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <label
      className={`block font-label-md font-semibold text-on-surface mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};
