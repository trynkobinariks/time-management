'use client';

import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/lib/speechRecognition';
import { parseVoiceInput } from '@/lib/aiParser';
import { useProjectContext } from '@/lib/ProjectContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function VoiceTimeEntry() {
  const { currentLanguage } = useLanguage();
  const { 
    text, 
    isListening, 
    status, 
    startListening, 
    stopListening, 
    resetText, 
    error: speechError,
  } = useSpeechRecognition(currentLanguage);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects, addTimeEntry } = useProjectContext();
  
  // Process voice input when user stops speaking
  useEffect(() => {
    const processVoiceInput = async () => {
      if (status === 'processing' && text.trim()) {
        setIsProcessing(true);
        setError(null);
        
        try {
          const parsedData = await parseVoiceInput(text, projects, currentLanguage);
          
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
  }, [status, text, projects, addTimeEntry, resetText, currentLanguage]);
  
  return (
    <div className="mt-2 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={isListening ? stopListening : () => startListening(currentLanguage)}
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
                  {currentLanguage === 'uk-UA' ? 'Запис...' : 'Recording...'}
                </span>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center gap-1">
                <span className="animate-spin text-blue-600 dark:text-blue-400">◌</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {currentLanguage === 'uk-UA' ? 'Обробка...' : 'Processing...'}
                </span>
              </div>
            )}
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
        {currentLanguage === 'uk-UA' ? (
          <div className="space-y-1">
            <p>Спробуйте сказати щось на зразок:</p>
            <ul className="list-disc list-inside">
              <li>&ldquo;Я провів 2 години на Проекті Х вчора, працюючи над документацією&rdquo;</li>
              <li>&ldquo;Сьогодні я працював 3.5 години над Проектом Y, розробляючи новий функціонал&rdquo;</li>
              <li>&ldquo;На Проекті Z я провів 4 години 15.03.2024, тестуючи систему&rdquo;</li>
              <li>&ldquo;20 березня я працював 5 годин над Проектом W&rdquo;</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-1">
            <p>Try saying something like:</p>
            <ul className="list-disc list-inside">
              <li>&ldquo;I spent 2 hours on Project X yesterday working on documentation&rdquo;</li>
              <li>&ldquo;Today I worked 3.5 hours on Project Y developing new features&rdquo;</li>
              <li>&ldquo;I spent 4 hours on Project Z on 03/15/2024 testing the system&rdquo;</li>
              <li>&ldquo;On 20th March I worked 5 hours on Project W&rdquo;</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 
