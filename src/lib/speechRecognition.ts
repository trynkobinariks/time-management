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
  maxAlternatives?: number;
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

export type RecognitionStatus =
  | 'inactive'
  | 'listening'
  | 'processing'
  | 'error';
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

export function useSpeechRecognition(
  initialLanguage: RecognitionLanguage = 'en-US',
): UseSpeechRecognitionReturn {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<RecognitionStatus>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] =
    useState<RecognitionLanguage>(initialLanguage);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Log language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLanguage;
    }
  }, [currentLanguage]);

  // This implementation can only be used in the browser
  const isBrowser = typeof window !== 'undefined';
  const hasSupport =
    isBrowser && (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Check if running on mobile
  const isMobile =
    isBrowser &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  // Initialize speech recognition
  useEffect(() => {
    if (!isBrowser || !hasSupport) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLanguage;

    // Additional mobile-specific settings
    if (isMobile) {
      // Increase maxAlternatives for better accuracy on mobile
      recognition.maxAlternatives = 3;
    }

    console.log(
      'Initializing speech recognition with language:',
      recognition.lang,
      'on mobile:',
      isMobile,
    );

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      setError(null);
      console.log('Started listening with language:', recognition.lang);
    };

    recognition.onresult = event => {
      // Get the last result which is the most complete
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;

      // Only update text if it's a final result
      if (lastResult.isFinal) {
        setText(transcript);
        console.log('Final transcript:', transcript);
      }
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = `Speech recognition error: ${event.error}`;

      // Add more specific error messages for common mobile issues
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try speaking again.';
      } else if (event.error === 'aborted') {
        errorMessage = 'Recording was interrupted. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage =
          'Could not access microphone. Please check your permissions.';
      } else if (event.error === 'network') {
        errorMessage = 'Network error occurred. Please check your connection.';
      }

      setError(errorMessage);
      setStatus('error');
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('inactive');
      console.log('Speech recognition ended');
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
  }, [isBrowser, hasSupport, currentLanguage, isMobile]);

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

  const startListening = useCallback(
    (language?: RecognitionLanguage) => {
      if (!isBrowser || !hasSupport) {
        setError('Speech recognition is not supported');
        return;
      }

      // Update language if provided
      if (language && language !== currentLanguage) {
        setLanguage(language);
      }

      // Request microphone permission on mobile before starting
      if (isMobile) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            // Permission granted, proceed with starting recognition
            if (recognitionRef.current) {
              try {
                // Ensure language is set before starting
                recognitionRef.current.lang = currentLanguage;
                console.log(
                  'Starting mobile recognition with language:',
                  recognitionRef.current.lang,
                );
                recognitionRef.current.start();
              } catch (err) {
                console.error('Speech recognition error:', err);
              }
            }
          })
          .catch(err => {
            console.error('Microphone permission error:', err);
            setError('Please allow microphone access to use voice recognition');
          });
      } else {
        // Desktop flow
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Speech recognition error:', err);
          }
        }
      }
    },
    [currentLanguage, isBrowser, hasSupport, setLanguage, isMobile],
  );

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
      setLanguage,
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
    setLanguage,
  };
}
