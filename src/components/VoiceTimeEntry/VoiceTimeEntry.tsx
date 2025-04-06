'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useVoiceTimeEntry } from './useVoiceTimeEntry';
import { useLanguage } from '@/contexts/LanguageContext';
import { MicrophoneIcon, StopRecordingIcon } from '@/components/icons';

export default function VoiceTimeEntry() {
  const { t } = useClientTranslation();
  const { language } = useLanguage();
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
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Current language: {language}
          </div>
          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer ${
              isListening
                ? 'bg-violet-700 hover:bg-violet-900 dark:bg-violet-600 dark:hover:bg-violet-700 shadow-lg shadow-violet-500/30'
                : 'bg-violet-600 hover:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-lg shadow-violet-500/30'
            }`}
            disabled={isProcessing}
            aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
          >
            {isListening ? <StopRecordingIcon /> : <MicrophoneIcon />}
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
