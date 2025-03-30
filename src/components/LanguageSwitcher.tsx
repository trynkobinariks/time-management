import React from 'react';
import { RecognitionLanguage } from '@/lib/speechRecognition';

interface LanguageSwitcherProps {
  currentLanguage: RecognitionLanguage;
  setLanguage: (lang: RecognitionLanguage) => void;
  disabled?: boolean;
}

export default function LanguageSwitcher({ currentLanguage, setLanguage, disabled = false }: LanguageSwitcherProps) {
  return (
    <div className="relative inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-100 dark:bg-gray-800">
      <div 
        className={`absolute h-[calc(100%-8px)] w-[calc(50%-2px)] bg-white dark:bg-gray-700 rounded-md shadow-sm transition-all duration-300 ease-in-out ${
          currentLanguage === 'uk-UA' ? 'translate-x-[94%]' : ''
        }`}
      />
      <button
        type="button"
        onClick={() => setLanguage('en-US')}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          currentLanguage === 'en-US'
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        disabled={disabled}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('uk-UA')}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          currentLanguage === 'uk-UA'
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        disabled={disabled}
      >
        UA
      </button>
    </div>
  );
} 