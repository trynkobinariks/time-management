import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  };

  const { width, height } = dimensions[size];

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The letters P, H, and T */}
      <g stroke="#4B6A97" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* P */}
        <path d="M35 40V80" stroke="#4B6A97" strokeWidth="4" />
        <path d="M35 40H48C53 40 58 45 53 50C48 55 35 55 35 55" stroke="#4B6A97" strokeWidth="4" />
        
        {/* H */}
        <path d="M60 40V80" stroke="#4B6A97" strokeWidth="4" />
        <path d="M60 60H80" stroke="#4B6A97" strokeWidth="4" />
        <path d="M80 40V80" stroke="#4B6A97" strokeWidth="4" />
        
        {/* T */}
        <path d="M85 40H110" stroke="#4B6A97" strokeWidth="4" />
        <path d="M97.5 40V80" stroke="#4B6A97" strokeWidth="4" />
      </g>
    </svg>
  );
} 
