'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RecognitionLanguage } from '../lib/speechRecognition';

interface LanguageContextType {
  language: RecognitionLanguage;
  setLanguage: (lang: RecognitionLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with a consistent server default
  const [language, setLanguage] = useState<RecognitionLanguage>('en-US');
  // Handle client-side hydration separately
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLanguage = localStorage.getItem(
      'language',
    ) as RecognitionLanguage;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('language', language);
    }
  }, [language, isClient]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
