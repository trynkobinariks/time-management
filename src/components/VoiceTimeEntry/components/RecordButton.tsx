import MicrophoneIcon from '@/components/icons/MicrophoneIcon';
import { StopRecordingIcon } from '@/components/icons/StopRecordingIcon';
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
    <button
      type="button"
      onClick={isListening ? handleStopListening : handleStartListening}
      className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer ${
        isListening
          ? 'bg-violet-700 hover:bg-violet-900 dark:bg-violet-600 dark:hover:bg-violet-700 shadow-lg shadow-violet-500/50'
          : 'bg-violet-600 hover:bg-violet-800 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-lg shadow-violet-500/50'
      } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isProcessing}
      aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
    >
      {isListening ? <StopRecordingIcon /> : <MicrophoneIcon />}
    </button>
  );
};

export default RecordButton;
