import React from 'react';
import { RecognitionLanguage } from '@/lib/speechRecognition';

interface LanguageSwitcherProps {
  language: RecognitionLanguage;
  setLanguage: (lang: RecognitionLanguage) => void;
  disabled?: boolean;
}

export default function LanguageSwitcher({
  language,
  setLanguage,
  disabled = false,
}: LanguageSwitcherProps) {
  return (
    <div className="relative inline-flex rounded-2xl border border-[var(--card-border)] p-1 bg-[var(--card-border)] shadow-inner">
      <div
        className={`absolute h-[calc(100%-8px)] w-[calc(50%-3px)] bg-[var(--card-background)] rounded-xl shadow-sm transition-all duration-300 ease-in-out ${
          language === 'uk-UA' ? 'translate-x-[94%]' : ''
        }`}
      />
      <button
        type="button"
        onClick={() => setLanguage('en-US')}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          language === 'en-US'
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        disabled={disabled}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('uk-UA')}
        className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          language === 'uk-UA'
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        disabled={disabled}
      >
        UA
      </button>
    </div>
  );
}
