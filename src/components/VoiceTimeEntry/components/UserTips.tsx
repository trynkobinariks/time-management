import { useClientTranslation } from '@/hooks/useClientTranslation';

const UserTips = () => {
  const { t } = useClientTranslation();

  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      <div className="space-y-1">
        <p>{t('voiceEntry.trySaying')}</p>
        <ul className="list-disc list-inside">
          <li>{t('voiceEntry.examples.example1')}</li>
          <li>{t('voiceEntry.examples.example2')}</li>
          <li>{t('voiceEntry.examples.example3')}</li>
          <li>{t('voiceEntry.examples.example4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default UserTips;
