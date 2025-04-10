'use client';

import React from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import UserSettings from '@/components/page-content/Settings/UserSettings';
import { useUserSettings } from '@/hooks/useUserSettings';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SettingsPage() {
  const { t } = useClientTranslation();
  const { settings, isLoading, error, updateSettings } = useUserSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-500 mb-4">
          {t('common.error')}
        </h1>
        <p className="text-[var(--text-secondary)]">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-8">{t('settings.title')}</h1>

      <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-medium mb-6">
          {t('settings.workingHours')}
        </h2>

        <UserSettings settings={settings} onUpdate={updateSettings} />
      </div>
    </div>
  );
}
