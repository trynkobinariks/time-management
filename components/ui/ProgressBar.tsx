import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  percentage: number;
  color: string;
  height?: 'sm' | 'md';
}

export default function ProgressBar({
  percentage,
  color,
  height = 'sm',
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Delay animation slightly for better visual effect
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div
      className={`${height === 'sm' ? 'h-1.5' : 'h-2'} bg-[var(--card-border)] rounded-full overflow-hidden`}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${width}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
