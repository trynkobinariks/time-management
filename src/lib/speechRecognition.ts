'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Type definition for the Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  error: string;
}

interface SpeechRecognitionResult {
  0: {
    transcript: string;
  };
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export type RecognitionStatus = 'inactive' | 'listening' | 'processing' | 'error';
export type RecognitionLanguage = 'en-US' | 'uk-UA';

export interface UseSpeechRecognitionReturn {
  text: string;
  isListening: boolean;
  status: RecognitionStatus;
  startListening: (language?: RecognitionLanguage) => void;
  stopListening: () => void;
  resetText: () => void;
  error: string | null;
  currentLanguage: RecognitionLanguage;
  setLanguage: (language: RecognitionLanguage) => void;
}

export function useSpeechRecognition(initialLanguage: RecognitionLanguage = 'en-US'): UseSpeechRecognitionReturn {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<RecognitionStatus>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<RecognitionLanguage>(initialLanguage);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Log language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLanguage;
    }
  }, [currentLanguage]);

  // This implementation can only be used in the browser
  const isBrowser = typeof window !== 'undefined';
  const hasSupport = isBrowser && (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Function to handle silence timeout
  const handleSilenceTimeout = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setStatus('processing');
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isBrowser || !hasSupport) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLanguage;
    
    console.log('Initializing speech recognition with language:', recognition.lang);
    
    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      setError(null);
      console.log('Started listening with language:', recognition.lang);
    };
    
    recognition.onresult = (event) => {
      // Get the last result which is the most complete
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;
      
      // Only update text if it's a final result
      if (lastResult.isFinal) {
        setText(transcript);
      }
      
      // Reset silence detection timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      // Start or reset the silence timer
      silenceTimerRef.current = setTimeout(handleSilenceTimeout, 2000);
    };
    
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setStatus('error');
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setStatus('inactive');
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
    
    recognitionRef.current = recognition;
    
    // Reset states when language changes
    setIsListening(false);
    setStatus('inactive');
    setText('');
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isBrowser, hasSupport, currentLanguage, handleSilenceTimeout]);

  const setLanguage = useCallback((language: RecognitionLanguage) => {
    // Stop any ongoing recognition before changing language
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('inactive');
      setText('');
      // Update the recognition instance's language
      recognitionRef.current.lang = language;
    }
    setCurrentLanguage(language);
  }, []);

  const startListening = useCallback((language?: RecognitionLanguage) => {
    if (!isBrowser || !hasSupport) {
      setError('Speech recognition is not supported');
      return;
    }

    // If language is provided and different, update it first
    if (language && language !== currentLanguage) {
      setLanguage(language);
      // Wait for the next tick to ensure language is updated
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Speech recognition error:', err);
          }
        }
      }, 0);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('Speech recognition error:', err);
        }
      }
    }
  }, [isBrowser, hasSupport, currentLanguage, setLanguage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setStatus('processing');
    }
  }, []);

  const resetText = useCallback(() => {
    setText('');
  }, []);

  // If not supported, return dummy implementation
  if (!isBrowser || !hasSupport) {
    return {
      text,
      isListening,
      status: 'error',
      startListening,
      stopListening,
      resetText,
      error: 'Speech recognition is not supported in this browser',
      currentLanguage,
      setLanguage
    };
  }

  return {
    text,
    isListening,
    status,
    startListening,
    stopListening,
    resetText,
    error,
    currentLanguage,
    setLanguage
  };
} 
