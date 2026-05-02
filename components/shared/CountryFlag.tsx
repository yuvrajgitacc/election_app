'use client';

import React from 'react';

interface CountryFlagProps {
  flag: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountryFlag({ flag, size = 'md' }: CountryFlagProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <span className={`${sizeClasses[size]} leading-none`} role="img" aria-label="country flag">
      {flag}
    </span>
  );
}
