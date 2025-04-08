import React from 'react';

interface StatusInfoProps {
  isListening: boolean;
  isProcessing: boolean;
  t: (key: string) => string;
}

const StatusInfo = ({ isListening, isProcessing, t }: StatusInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      {isListening && (
        <div className="flex items-center gap-1">
          <span className="animate-pulse text-red-600 dark:text-red-400">
            ●
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t('voiceEntry.recording')}
          </span>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center gap-1">
          <span className="animate-spin text-blue-600 dark:text-blue-400">
            ◌
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t('voiceEntry.processing')}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusInfo;
