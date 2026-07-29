import React from 'react';

import logoImg from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-10 w-auto object-contain',
  alt = 'Kirana Two Logo',
}) => {
  return (
    <img
      src={logoImg}
      alt={alt}
      className={className}
    />
  );
};
