'use client';

import React, { useEffect } from 'react';
import AuthBackground from '@/components/AuthBackground';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure ViewportHeight is set correctly for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set the initial value
    setVH();

    // Reset on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[calc(100vh-4rem)] min-h-[calc((var(--vh, 1vh) * 100) - 4rem)]">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
