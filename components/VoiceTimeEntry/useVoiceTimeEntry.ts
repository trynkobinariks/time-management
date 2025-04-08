import { useSpeechRecognition } from '../../lib/speechRecognition';

import { useLanguage } from '../../contexts/LanguageContext';
import { RecognitionLanguage } from '../../lib/speechRecognition';
import { useEffect, useState, useRef } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import { parseVoiceInput } from '../../lib/aiParser';

export const useVoiceTimeEntry = () => {
  const { language } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const prevLanguageRef = useRef<RecognitionLanguage | null>(null);
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
    setIsSupported(
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    );
  }, []);

  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      prevLanguageRef.current = language;
    }
  }, [language]);

  useEffect(() => {
    const processVoiceInput = async () => {
      if (
        !isListening &&
        text.trim() &&
        !isProcessing &&
        (status === 'inactive' || status === 'processing')
      ) {
        setIsProcessing(true);
        setError(null);

        try {
          const parsedData = await parseVoiceInput(text, projects, language);

          if (parsedData) {
            const project = projects.find(
              p => p.name === parsedData.project_name,
            );
            if (project) {
              await addTimeEntry({
                project_id: project.id,
                date: parsedData.date,
                hours: parsedData.hours,
                description: parsedData.description || '',
              });
              resetText();
            } else {
              setError(
                'Project not found. Please try again with a valid project name.',
              );
            }
          } else {
            setError(
              'Could not parse your input. Please try again with a clearer description of your time entry.',
            );
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'An unknown error occurred',
          );
        } finally {
          setIsProcessing(false);
        }
      }
    };

    processVoiceInput();
  }, [
    isListening,
    text,
    projects,
    addTimeEntry,
    resetText,
    language,
    status,
    isProcessing,
  ]);

  // Set the recording date when starting to listen
  const handleStartListening = () => {
    setError(null);
    // Clear previous text when starting a new recording
    if (!isListening) {
      resetText();
    }
    console.log(
      `[useVoiceTimeEntry] Starting listening with language: ${language}`,
    );
    // Always pass the current language from context to ensure it matches
    startListening(language as RecognitionLanguage);
  };

  // Process the text when stopping
  const handleStopListening = () => {
    stopListening();
    // Force processing by calling it directly to ensure it gets processed
    if (text.trim() && !isProcessing) {
      setIsProcessing(true);
      parseVoiceInput(text, projects, language)
        .then(parsedData => {
          if (parsedData) {
            const project = projects.find(
              p => p.name === parsedData.project_name,
            );
            if (project) {
              addTimeEntry({
                project_id: project.id,
                date: parsedData.date,
                hours: parsedData.hours,
                description: parsedData.description || '',
              });
              resetText();
            } else {
              setError(
                'Project not found. Please try again with a valid project name.',
              );
            }
          } else {
            setError(
              'Could not parse your input. Please try again with a clearer description of your time entry.',
            );
          }
        })
        .catch(err => {
          setError(
            err instanceof Error ? err.message : 'An unknown error occurred',
          );
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  return {
    isClient,
    isSupported,
    isListening,
    isProcessing,
    error,
    handleStartListening,
    handleStopListening,
    text,
    speechError,
  };
};

export default useVoiceTimeEntry;
