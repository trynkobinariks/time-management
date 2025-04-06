'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useVoiceTimeEntry } from './useVoiceTimeEntry';

export default function VoiceTimeEntry() {
  const { t } = useClientTranslation();
  const {
    isClient,
    isSupported,
    isListening,
    isProcessing,
    error,
    speechError,
    handleStartListening,
    handleStopListening,
    text,
  } = useVoiceTimeEntry();

  if (!isClient) {
    return null;
  }

  if (!isSupported) {
    return (
      <div className="hidden md:block mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <div className="space-y-1">
            <p>Speech recognition is not supported in this browser</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block mt-2 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer ${
              isListening
                ? 'bg-red-700 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg shadow-red-500/30'
                : 'bg-red-600 hover:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 shadow-lg shadow-red-500/30'
            }`}
            disabled={isProcessing}
            aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
          >
            {isListening ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>

          {(isListening || isProcessing) && (
            <div className="flex items-center gap-2">
              {isListening && (
                <div className="flex items-center gap-1">
                  <span className="animate-pulse text-red-600 dark:text-red-400">
                    ●
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('voiceEntry.recording')}
                  </span>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center gap-1">
                  <span className="animate-spin text-blue-600 dark:text-blue-400">
                    ◌
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('voiceEntry.processing')}
                  </span>
                </div>
              )}
            </div>
          )}

          {isListening && text && (
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md w-full max-w-[90vw] shadow-md">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {text}
              </div>
            </div>
          )}
        </div>

        {(error || speechError) && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm text-red-600 dark:text-red-400">
              {error || speechError}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <div className="space-y-1">
            <p>{t('voiceEntry.trySaying')}</p>
            <ul className="list-disc list-inside">
              <li>{t('voiceEntry.examples.example1')}</li>
              <li>{t('voiceEntry.examples.example2')}</li>
              <li>{t('voiceEntry.examples.example3')}</li>
              <li>{t('voiceEntry.examples.example4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
