'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useVoiceTimeEntry } from './useVoiceTimeEntry';
import RecordButton from './components/RecordButton';
import UserTips from './components/UserTips';
import SpeechError from './components/SpeechError';
import TranscribedText from './components/TranscribedText';
import StatusInfo from './components/StatusInfo';
import NotSupportedMessage from './components/NotSupportedMessage';

interface VoiceTimeEntryProps {
  showRecordButton?: boolean;
}

export default function VoiceTimeEntry({
  showRecordButton = true,
}: VoiceTimeEntryProps) {
  const { t } = useClientTranslation();

  const {
    isClient,
    isSupported,
    isListening,
    isProcessing,
    error,
    speechError,
    handleStartListening,
    handleStopListening,
    text,
  } = useVoiceTimeEntry();

  if (!isClient) return null;

  if (!isSupported) return <NotSupportedMessage t={t} />;

  return (
    <div className="w-full">
      <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6">
        <h2 className="text-lg text-center font-medium text-[var(--text-primary)] mb-4">
          {t('timeEntries.quickTimeEntry')}
        </h2>
        <div className="md:block mt-2 space-y-8">
          <div className="flex flex-col items-center gap-4">
            {showRecordButton && (
              <RecordButton
                isListening={isListening}
                isProcessing={isProcessing}
                handleStopListening={handleStopListening}
                handleStartListening={handleStartListening}
              />
            )}

            {(isListening || isProcessing) && (
              <StatusInfo
                isListening={isListening}
                isProcessing={isProcessing}
                t={t}
              />
            )}

            {isListening && text && <TranscribedText text={text} />}
          </div>

          {(error || speechError) && (
            <SpeechError error={error} speechError={speechError} />
          )}

          <UserTips />
        </div>
      </div>
    </div>
  );
}
