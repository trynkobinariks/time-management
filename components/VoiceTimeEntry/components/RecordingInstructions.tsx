import React, { useState, useEffect } from 'react';
import { useClientTranslation } from '../../../hooks/useClientTranslation';

interface RecordingInstructionsProps {
  isListening: boolean;
}

const RecordingInstructions: React.FC<RecordingInstructionsProps> = ({
  isListening,
}) => {
  const { t } = useClientTranslation();
  const [exampleIndex, setExampleIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [currentExample, setCurrentExample] = useState('');

  useEffect(() => {
    setCurrentExample(
      t(`voiceEntry.instructionsExample.example${exampleIndex}`),
    );
  }, [exampleIndex, t]);

  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsFading(true);

      // After fade out completes, change the text and fade in
      setTimeout(() => {
        setExampleIndex(prevIndex => {
          // Assuming we have 4 examples like in UserTips component
          return prevIndex >= 4 ? 1 : prevIndex + 1;
        });
        setIsFading(false);
      }, 300); // This should match the transition duration in CSS
    }, 4500);

    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <div
      className={`fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-[6] text-center transition-all duration-500 ease-in-out ${
        isListening
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/10 backdrop-blur-md px-4 py-4 sm:px-8 sm:py-6 rounded-xl shadow-lg text-white w-[90vw] sm:w-auto max-w-md mx-auto">
        <p className="text-xl sm:text-lg font-medium mb-3 sm:mb-2">
          {t('voiceEntry.recording')}
        </p>
        <p className="text-base sm:text-sm text-white/80">
          {t('voiceEntry.instructions')}
        </p>
        <p
          className={`text-base sm:text-sm text-white/80 transition-opacity duration-300 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentExample}
        </p>
      </div>
    </div>
  );
};

export default RecordingInstructions;
