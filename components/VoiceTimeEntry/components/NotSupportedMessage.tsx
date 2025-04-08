import React from 'react';

interface NotSupportedMessageProps {
  t: (key: string) => string;
}

const NotSupportedMessage = ({ t }: NotSupportedMessageProps) => (
  <div className="md:block mt-2">
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      <div className="space-y-1">
        <p>{t('voiceEntry.notSupported')}</p>
      </div>
    </div>
  </div>
);

export default NotSupportedMessage;
