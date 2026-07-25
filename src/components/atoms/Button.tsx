import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  asAnchor = false,
  href,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-label-md transition-all duration-300 cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-heritage-red text-white hover:bg-heritage-red/90',
    outline: 'border border-on-surface text-on-surface hover:bg-on-surface hover:text-white',
    secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-label-sm',
    md: 'px-6 py-3',
    lg: 'px-10 py-5',
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (asAnchor && href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
