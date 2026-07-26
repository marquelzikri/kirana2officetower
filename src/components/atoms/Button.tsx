import React from 'react';

type BaseProps = {
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    asAnchor?: false;
    href?: undefined;
  };

type ButtonAsAnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    asAnchor: true;
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    children,
    asAnchor = false,
    className = '',
    ...restProps
  } = props;

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

  if (asAnchor) {
    const { href, ...anchorProps } = restProps as ButtonAsAnchorProps;
    return (
      <a href={href} className={combinedClasses} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};
