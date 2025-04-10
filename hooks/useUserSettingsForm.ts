'use client';

import { useState, useEffect } from 'react';
import { UserSettings } from '@/lib/types';
import { useClientTranslation } from '@/hooks/useClientTranslation';

interface UseUserSettingsFormProps {
  settings: UserSettings | null;
  onUpdate: (
    settings: Partial<
      Omit<UserSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
    >,
  ) => Promise<void>;
}

interface UseUserSettingsFormReturn {
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  internalHoursLimit: number;
  commercialHoursLimit: number;
  totalWeeklyHours: number;
  isSaving: boolean;
  saveMessage: string;
  validationError: string;
  setWorkingHoursPerDay: (value: number) => void;
  setWorkingDaysPerWeek: (value: number) => void;
  setInternalHoursLimit: (value: number) => void;
  setCommercialHoursLimit: (value: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useUserSettingsForm({
  settings,
  onUpdate,
}: UseUserSettingsFormProps): UseUserSettingsFormReturn {
  const { t } = useClientTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState(
    settings?.working_hours_per_day || 8,
  );
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(
    settings?.working_days_per_week || 5,
  );
  const [internalHoursLimit, setInternalHoursLimit] = useState(
    settings?.internal_hours_limit || 20,
  );
  const [commercialHoursLimit, setCommercialHoursLimit] = useState(
    settings?.commercial_hours_limit || 20,
  );
  const [saveMessage, setSaveMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const totalWeeklyHours = workingHoursPerDay * workingDaysPerWeek;

  // Validate limits when any related value changes
  useEffect(() => {
    const combinedLimits = internalHoursLimit + commercialHoursLimit;
    if (combinedLimits > totalWeeklyHours) {
      setValidationError(t('settings.limitExceedsTotal'));
    } else {
      setValidationError('');
    }
  }, [internalHoursLimit, commercialHoursLimit, totalWeeklyHours, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    const combinedLimits = internalHoursLimit + commercialHoursLimit;
    if (combinedLimits > totalWeeklyHours) {
      setValidationError(t('settings.limitExceedsTotal'));
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    setValidationError('');

    try {
      await onUpdate({
        working_hours_per_day: workingHoursPerDay,
        working_days_per_week: workingDaysPerWeek,
        internal_hours_limit: internalHoursLimit,
        commercial_hours_limit: commercialHoursLimit,
      });
      setSaveMessage(t('settings.saveSuccess'));
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : t('settings.saveError'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    workingHoursPerDay,
    workingDaysPerWeek,
    internalHoursLimit,
    commercialHoursLimit,
    totalWeeklyHours,
    isSaving,
    saveMessage,
    validationError,
    setWorkingHoursPerDay,
    setWorkingDaysPerWeek,
    setInternalHoursLimit,
    setCommercialHoursLimit,
    handleSubmit,
  };
}
