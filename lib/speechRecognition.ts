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

  // Sync the current language with the initial language when it changes
  useEffect(() => {
    // When initialLanguage changes from parent component, update our internal state
    if (initialLanguage !== currentLanguage) {
      console.log(
        `Language changed from ${currentLanguage} to ${initialLanguage}`,
      );
      setCurrentLanguage(initialLanguage);

      // If we have an active recognition instance, update its language
      if (recognitionRef.current) {
        recognitionRef.current.lang = initialLanguage;
        console.log(
          `Updated recognition instance language to: ${initialLanguage}`,
        );
      }
    }
  }, [initialLanguage, currentLanguage]);

  // Initialize speech recognition
  useEffect(() => {
    if (!isBrowser || !hasSupport) return;

    // Clean up any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = () => {};
        recognitionRef.current.onstart = () => {};
        recognitionRef.current.onerror = () => {};
        recognitionRef.current.onresult = () => {};
        recognitionRef.current.abort();
      } catch (e) {
        console.error('Error cleaning up previous recognition instance:', e);
      }
    }

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

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      setError(null);
    };

    recognition.onresult = event => {
      // Get the last result which is the most complete
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;

      // Only update text if it's a final result
      if (lastResult.isFinal) {
        setText(transcript);
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
    };

    recognitionRef.current = recognition;

    // Reset states when language changes
    setIsListening(false);
    setStatus('inactive');
    setText('');

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Error aborting recognition on cleanup:', e);
        }
      }
    };
  }, [isBrowser, hasSupport, currentLanguage, isMobile]);

  const setLanguage = useCallback(
    (language: RecognitionLanguage) => {
      console.log(`Setting language to: ${language}`);

      // Stop any ongoing recognition before changing language
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(
            'Error stopping recognition during language change:',
            e,
          );
        }
      }

      setIsListening(false);
      setStatus('inactive');
      setText('');
      setCurrentLanguage(language);

      // Directly update recognition instance if it exists
      if (recognitionRef.current) {
        recognitionRef.current.lang = language;
        console.log(`Updated recognition language to: ${language}`);
      }
    },
    [isListening],
  );

  const startListening = useCallback(
    (language?: RecognitionLanguage) => {
      if (!isBrowser || !hasSupport) {
        setError('Speech recognition is not supported');
        return;
      }

      // Update language if provided
      if (language && language !== currentLanguage) {
        console.log(
          `Language param different, changing from ${currentLanguage} to ${language}`,
        );
        setLanguage(language);

        // Add a small delay before starting to ensure language has been updated
        setTimeout(() => {
          if (recognitionRef.current) {
            console.log(
              `Starting listening after language change to: ${language}`,
            );
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error(
                'Error starting speech recognition after language change:',
                err,
              );
            }
          }
        }, 100);
        return;
      }

      // Ensure language is correctly set before starting
      if (recognitionRef.current) {
        // Force update the language to ensure it's correct
        recognitionRef.current.lang = currentLanguage;
      }

      // Request microphone permission on mobile before starting
      if (isMobile) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            // Permission granted, proceed with starting recognition
            if (recognitionRef.current) {
              try {
                // Double check language is set before starting
                if (recognitionRef.current.lang !== currentLanguage) {
                  recognitionRef.current.lang = currentLanguage;
                }

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
            // Double check language
            if (recognitionRef.current.lang !== currentLanguage) {
              recognitionRef.current.lang = currentLanguage;
            }

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
      try {
        recognitionRef.current.stop();
        setStatus('processing');
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
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
