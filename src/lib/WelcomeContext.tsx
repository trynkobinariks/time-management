'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WelcomeContextType {
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
}

const WelcomeContext = createContext<WelcomeContextType | undefined>(undefined);

export function useWelcomeContext() {
  const context = useContext(WelcomeContext);
  if (context === undefined) {
    throw new Error('useWelcomeContext must be used within a WelcomeProvider');
  }
  return context;
}

interface WelcomeProviderProps {
  children: React.ReactNode;
}

export function WelcomeProvider({ children }: WelcomeProviderProps) {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        // Try to get the flag from session storage first
        let shouldShowPopup = sessionStorage.getItem('justLoggedIn') === 'true';
        
        // If not found in session storage, check localStorage as backup
        if (!shouldShowPopup) {
          const welcomeTimestamp = localStorage.getItem('showWelcome');
          if (welcomeTimestamp) {
            shouldShowPopup = true;
            localStorage.removeItem('showWelcome');
          }
        } else {
          // Clear the session storage flag
          sessionStorage.removeItem('justLoggedIn');
        }

        if (shouldShowPopup) {
          console.log('Showing welcome popup based on storage flags');
          setShowWelcomePopup(true);
        }
      } catch (error) {
        console.error('Error checking storage:', error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // If the popup is closed, ensure it stays closed
  useEffect(() => {
    if (!showWelcomePopup && isInitialized) {
      try {
        sessionStorage.removeItem('justLoggedIn');
        localStorage.removeItem('showWelcome');
      } catch (error) {
        console.error('Error clearing storage flags:', error);
      }
    }
  }, [showWelcomePopup, isInitialized]);

  const contextValue = {
    showWelcomePopup,
    setShowWelcomePopup,
  };

  return (
    <WelcomeContext.Provider value={contextValue}>
      {children}
    </WelcomeContext.Provider>
  );
} 