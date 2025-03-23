'use client';

import { useEffect } from 'react';
import { useWelcomeContext } from '@/lib/WelcomeContext';
import WelcomePopup from './WelcomePopup';

export default function WelcomeManager() {
  const { showWelcomePopup, setShowWelcomePopup } = useWelcomeContext();

  const handleCloseWelcome = () => {
    setShowWelcomePopup(false);
  };

  // Ensure a click outside the welcome popup closes it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showWelcomePopup) {
        const popup = document.querySelector('.welcome-popup-content');
        if (popup && !popup.contains(e.target as Node)) {
          setShowWelcomePopup(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWelcomePopup, setShowWelcomePopup]);

  return (
    <>
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcome} />}
    </>
  );
} 