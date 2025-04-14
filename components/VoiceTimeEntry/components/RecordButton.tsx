import MicrophoneIcon from '../../icons/MicrophoneIcon';
import { StopRecordingIcon } from '../../icons/StopRecordingIcon';
import React from 'react';

interface RecordButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  handleStopListening: () => void;
  handleStartListening: () => void;
}

const RecordButton = ({
  isListening,
  isProcessing,
  handleStopListening,
  handleStartListening,
}: RecordButtonProps) => {
  return (
    <div className="relative">
      {isListening && (
        <>
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full animate-ping bg-red-400/50"></div>
        </>
      )}

      <button
        type="button"
        onClick={isListening ? handleStopListening : handleStartListening}
        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer ${
          isListening
            ? 'bg-red-700 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg shadow-red-500/50 ring-4 ring-red-400 ring-opacity-50'
            : 'bg-violet-600 hover:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-lg shadow-violet-500/50'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
        aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
      >
        <div
          className={`transition-all duration-300 ${isListening ? 'scale-110' : 'scale-100'}`}
        >
          {isListening ? <StopRecordingIcon /> : <MicrophoneIcon />}
          {isProcessing && (
            <div className="absolute inset-0 rounded-full animate-ping bg-violet-400/50"></div>
          )}
        </div>
      </button>
    </div>
  );
};

export default RecordButton;
