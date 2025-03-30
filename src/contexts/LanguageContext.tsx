"use client";

import React, { createContext, useContext, useState } from 'react';
import { RecognitionLanguage } from '@/lib/speechRecognition';

interface LanguageContextType {
  language: RecognitionLanguage;
  setLanguage: (lang: RecognitionLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<RecognitionLanguage>('en-US');

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
