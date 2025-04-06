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
      {/* The letters V and T - wide, not tall */}
      <g
        stroke="#4B6A97"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* V - wide version */}
        <path
          d="M20 50L45 70L70 50"
          stroke="#4B6A97"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* T - wide version */}
        <path
          d="M75 50H105"
          stroke="#4B6A97"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M90 50V70"
          stroke="#4B6A97"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
