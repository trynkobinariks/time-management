"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function useClientTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Map the language codes to folder names
        const languageMap: Record<string, string> = {
          'en-US': 'en',
          'uk-UA': 'uk'
        };
        
        const folderName = languageMap[language] || language;
        console.log('Loading translations for:', {
          language,
          folderName,
          fullPath: `@/i18n/locales/${folderName}/common.json`
        });

        const translationModule = await import(`@/i18n/locales/${folderName}/common.json`);
        console.log('Loaded translations:', translationModule.default);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        try {
          console.log('Attempting to load fallback English translations');
          const fallbackModule = await import('@/i18n/locales/en/common.json');
          console.log('Loaded fallback translations:', fallbackModule.default);
          setTranslations(fallbackModule.default as unknown as Record<string, string>);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
        }
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string) => {
    const translation = translations[key] || key;
    console.log('Translation lookup:', { key, translation, availableKeys: Object.keys(translations) });
    return translation;
  };

  return { t, language };
} 
