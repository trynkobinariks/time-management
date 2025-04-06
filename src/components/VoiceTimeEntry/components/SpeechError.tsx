import React from 'react';

interface SpeechErrorProps {
  error: string | null;
  speechError: string | null;
}

const SpeechError = ({ error, speechError }: SpeechErrorProps) => {
  return (
    <div className="mt-2 p-3 bg-[var(--card-background)] rounded-md border border-red-300 dark:border-red-700">
      <div className="text-sm text-red-600 dark:text-red-400">
        {error || speechError}
      </div>
    </div>
  );
};

export default SpeechError;
