'use client';

import { useWelcomeContext } from '@/lib/WelcomeContext';
import WelcomePopup from './WelcomePopup';

export default function WelcomeManager() {
  const { showWelcomePopup, setShowWelcomePopup } = useWelcomeContext();

  const handleCloseWelcome = () => {
    setShowWelcomePopup(false);
  };

  return (
    <>
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcome} />}
    </>
  );
} 