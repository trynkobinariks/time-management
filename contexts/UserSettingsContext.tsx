'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { UserSettings } from '@/lib/types';
import { useUserSettings } from '@/hooks/useUserSettings';

interface UserSettingsContextProps {
  settings: UserSettings | null;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (
    settings: Partial<
      Omit<UserSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
    >,
  ) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextProps | undefined>(
  undefined,
);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const { settings, isLoading, error, updateSettings } = useUserSettings();

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useUserSettingsContext must be used within a UserSettingsProvider',
    );
  }
  return context;
}
