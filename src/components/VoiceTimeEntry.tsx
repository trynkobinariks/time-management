'use client';

import React, { useState, useEffect } from 'react';
import { useSpeechRecognition, RecognitionLanguage } from '@/lib/speechRecognition';
import { parseVoiceInput } from '@/lib/aiParser';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function VoiceTimeEntry() {
  const { language } = useLanguage();
  const { t } = useClientTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { 
    text, 
    isListening, 
    status, 
    startListening, 
    stopListening, 
    resetText, 
    error: speechError,
  } = useSpeechRecognition(language as RecognitionLanguage);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects, addTimeEntry } = useProjectContext();

  // Check if we're on the client side and if speech recognition is supported
  useEffect(() => {
    setIsClient(true);
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);
  
  // Process voice input when user stops speaking
  useEffect(() => {
    const processVoiceInput = async () => {
      if (status === 'processing' && text.trim()) {
        setIsProcessing(true);
        setError(null);
        
        try {
          const parsedData = await parseVoiceInput(text, projects, language);
          
          if (parsedData) {
            const project = projects.find(p => p.name === parsedData.project_name);
            if (project) {
              await addTimeEntry({
                project_id: project.id,
                date: parsedData.date,
                hours: parsedData.hours,
                description: parsedData.description || '',
              });
              resetText();
            } else {
              setError('Project not found. Please try again with a valid project name.');
            }
          } else {
            setError('Could not parse your input. Please try again with a clearer description of your time entry.');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    processVoiceInput();
  }, [status, text, projects, addTimeEntry, resetText, language]);

  // Set the recording date when starting to listen
  const handleStartListening = () => {
    startListening(language as RecognitionLanguage);
  };

  // Clear the recording date when stopping
  const handleStopListening = () => {
    stopListening();
  };
  
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          
          {(isListening || isProcessing) && (
            <div className="flex items-center gap-2">
              {isListening && (
                <div className="flex items-center gap-1">
                  <span className="animate-pulse text-red-600 dark:text-red-400">●</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('voiceEntry.recording')}
                  </span>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center gap-1">
                  <span className="animate-spin text-blue-600 dark:text-blue-400">◌</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('voiceEntry.processing')}
                  </span>
                </div>
              )}
            </div>
          )}

          {isListening && text && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md w-full max-w-[90vw] shadow-md">
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

      {/* Mobile-only fixed button */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          {(isListening || isProcessing) && (
            <div className="mt-2 p-3 bg-[var(--card-background)] border border-[var(--card-border)] rounded-md w-full max-w-[90vw] shadow-md">
              <div className="text-sm text-[var(--text-primary)]">
                {text}
              </div>
            </div>
          )}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          
          {(isListening || isProcessing) && (
            <div className="flex items-center gap-2">
              {isListening && (
                <div className="flex items-center gap-1">
                  <span className="animate-pulse text-red-600 dark:text-red-400">●</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('voiceEntry.recording')}
                  </span>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center gap-1">
                  <span className="animate-spin text-blue-600 dark:text-blue-400">◌</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('voiceEntry.processing')}
                  </span>
                </div>
              )}
            </div>
          )}

         
        </div>
      </div>
    </>
  );
} 
