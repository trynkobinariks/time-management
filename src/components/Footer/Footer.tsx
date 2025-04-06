'use client';

import React, { useEffect, useState } from 'react';

interface FooterProps {
  appName?: string;
}

const Footer: React.FC<FooterProps> = ({ appName = 'Voice Tracker' }) => {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <footer
      className={`bg-[var(--background)] py-4 w-full border-t border-[var(--card-border)] ${
        isMobile ? 'fixed bottom-0 left-0' : 'mt-auto'
      }`}
      style={
        isMobile ? { boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' } : undefined
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground text-center">
          {appName} | Trynko R. | &copy; {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
