'use client';

import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/lib/speechRecognition';
import { parseVoiceInput, ParsedTimeEntry } from '@/lib/aiParser';
import { useProjectContext } from '@/lib/ProjectContext';

interface VoiceTimeEntryProps {
  onDataCapture: (data: ParsedTimeEntry) => void;
}

export default function VoiceTimeEntry({ onDataCapture }: VoiceTimeEntryProps) {
  const { text, isListening, status, startListening, stopListening, resetText, error: speechError } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { projects } = useProjectContext();
  
  // Process voice input when user stops speaking
  useEffect(() => {
    const processVoiceInput = async () => {
      if (status === 'processing' && text.trim()) {
        setIsProcessing(true);
        setError(null);
        
        try {
          const parsedData = await parseVoiceInput(text, projects);
          
          if (parsedData) {
            onDataCapture(parsedData);
            resetText();
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
  }, [status, text, projects, onDataCapture, resetText]);
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={isProcessing}
        >
          {isListening ? 'Stop Recording' : 'Record Time Entry'}
        </button>
        
        {isListening && (
          <div className="flex items-center gap-1">
            <span className="animate-pulse text-red-600">●</span>
            <span className="text-sm text-gray-600">Recording...</span>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex items-center gap-1">
            <span className="animate-spin text-blue-600">◌</span>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        )}
      </div>
      
      {(text || error || speechError) && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          {text && (
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-700">Transcribed Text:</div>
              <p className="text-gray-900">{text}</p>
            </div>
          )}
          
          {(error || speechError) && (
            <div className="text-sm text-red-600">
              {error || speechError}
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1">
        <p>Try saying something like: &ldquo;I spent 2 hours on Project X yesterday working on documentation&rdquo;</p>
      </div>
    </div>
  );
} 