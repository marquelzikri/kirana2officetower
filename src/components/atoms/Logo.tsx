import React from 'react';

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-10 w-auto object-contain',
  alt = 'Intijaya Logo',
}) => {
  return (
    <img
      src="https://lh3.googleusercontent.com/aida/AP1WRLtQv0ReFgRZ0CXbGSzzorHiDjQu3NklmsI1FbS0m8QeWUxDTNGpWjlwL1UsxVUhEWrYj_sBRgZaZI0a460a8HOK4_HKwShkRkyXv_--lmRaitXXyGZc31hq2U3edUhYJjv6TgdZ98LRMPn5_F5B7EwvJ-tHYT7q_HoVnTKTXz_s7a2QKfY7LGn7ea52gqzrh4jiBBIIbftTcsm0UrpTpsj8JLu-MfvMSNFfkEPRDeN0ID7BtQRf8-gh5A"
      alt={alt}
      className={className}
    />
  );
};
