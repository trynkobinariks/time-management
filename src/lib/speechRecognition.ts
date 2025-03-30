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

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<RecognitionStatus>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<RecognitionLanguage>('en-US');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // This implementation can only be used in the browser
  const isBrowser = typeof window !== 'undefined';
  const hasSupport = isBrowser && (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Initialize speech recognition
  useEffect(() => {
    if (!isBrowser || !hasSupport) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = currentLanguage;
    
    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      setError(null);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      
      setText(prev => prev + ' ' + transcript);
    };
    
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setStatus('error');
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setStatus('inactive');
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
    };
  }, [isBrowser, hasSupport, currentLanguage]);

  const setLanguage = useCallback((language: RecognitionLanguage) => {
    // Stop any ongoing recognition before changing language
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('inactive');
      setText('');
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
