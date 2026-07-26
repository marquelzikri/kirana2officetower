import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        className={`w-5 h-5 accent-heritage-red rounded cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="font-label-md text-on-surface cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
};
