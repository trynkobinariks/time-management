"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

// Pre-import translations to ensure they're available
import enTranslations from '@/i18n/locales/en/common.json';
import ukTranslations from '@/i18n/locales/uk/common.json';

const translationsMap: Record<string, Translations> = {
  'en-US': enTranslations,
  'uk-UA': ukTranslations
};

export function useClientTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>(translationsMap[language] || enTranslations);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const newTranslations = translationsMap[language] || enTranslations;
      setTranslations(newTranslations);
    } catch (error) {
      console.error('Failed to load translations:', error);
      setTranslations(enTranslations);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const t = (key: string) => {
    if (isLoading) {
      return key;
    }

    const keys = key.split('.');
    let translation: TranslationValue = translations;
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        return key;
      }
    }
    
    return typeof translation === 'string' ? translation : key;
  };

  return { t, language, isLoading };
} 
