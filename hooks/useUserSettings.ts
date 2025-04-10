'use client';

import { useEffect, useState } from 'react';
import { UserSettings } from '@/lib/types';
import { getUserSettings, updateUserSettings } from '@/lib/supabase/db';
import { createClient } from '@/lib/supabase/client';

interface UseUserSettingsReturn {
  settings: UserSettings | null;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (
    newSettings: Partial<
      Omit<UserSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
    >,
  ) => Promise<void>;
}

// Define a type that could be returned from getUserSettings
interface PartialUserSettings {
  user_id: string;
  working_hours_per_day: number;
  working_days_per_week: number;
  internal_hours_limit: number;
  commercial_hours_limit: number;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export function useUserSettings(): UseUserSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const userSettings = (await getUserSettings(
          user.id,
        )) as PartialUserSettings;
        // Ensure that userSettings has all required fields for UserSettings interface
        const typedSettings: UserSettings = {
          id: userSettings.id || '',
          created_at: userSettings.created_at || '',
          updated_at: userSettings.updated_at || '',
          user_id: userSettings.user_id,
          working_hours_per_day: userSettings.working_hours_per_day,
          working_days_per_week: userSettings.working_days_per_week,
          internal_hours_limit: userSettings.internal_hours_limit,
          commercial_hours_limit: userSettings.commercial_hours_limit,
        };
        setSettings(typedSettings);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to load user settings'),
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function updateUserSettingsHandler(
    newSettings: Partial<
      Omit<UserSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
    >,
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const updatedSettings = (await updateUserSettings(
        user.id,
        newSettings,
      )) as PartialUserSettings;
      // Ensure that updatedSettings has all required fields for UserSettings interface
      const typedSettings: UserSettings = {
        id: updatedSettings.id || '',
        created_at: updatedSettings.created_at || '',
        updated_at: updatedSettings.updated_at || '',
        user_id: updatedSettings.user_id,
        working_hours_per_day: updatedSettings.working_hours_per_day,
        working_days_per_week: updatedSettings.working_days_per_week,
        internal_hours_limit: updatedSettings.internal_hours_limit,
        commercial_hours_limit: updatedSettings.commercial_hours_limit,
      };
      setSettings(typedSettings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to update user settings'),
      );
      throw err;
    }
  }

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateUserSettingsHandler,
  };
}
