'use client';

import React from 'react';
import { UserSettings } from '@/lib/types';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useUserSettingsForm } from '@/hooks/useUserSettingsForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormField, FormLabel } from '@/components/ui/Form';

interface UserSettingsProps {
  settings: UserSettings | null;
  onUpdate: (
    settings: Partial<
      Omit<UserSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
    >,
  ) => Promise<void>;
}

export default function UserSettingsComponent({
  settings,
  onUpdate,
}: UserSettingsProps) {
  const { t } = useClientTranslation();
  const {
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
  } = useUserSettingsForm({ settings, onUpdate });

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Working Hours Per Day */}
        <FormField name="workingHoursPerDay">
          <FormLabel>{t('settings.workingHoursPerDay')}</FormLabel>
          <Input
            id="workingHoursPerDay"
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={workingHoursPerDay}
            onChange={e => setWorkingHoursPerDay(Number(e.target.value))}
            helpText={t('settings.workingHoursPerDayHelp')}
            required
          />
        </FormField>

        {/* Working Days Per Week */}
        <FormField name="workingDaysPerWeek">
          <FormLabel>{t('settings.workingDaysPerWeek')}</FormLabel>
          <Input
            id="workingDaysPerWeek"
            type="number"
            min="1"
            max="7"
            value={workingDaysPerWeek}
            onChange={e => setWorkingDaysPerWeek(Number(e.target.value))}
            helpText={t('settings.workingDaysPerWeekHelp')}
            required
          />
        </FormField>

        {/* Weekly Calculation */}
        <div className="md:col-span-2 p-4 bg-[var(--card-alt-background)] rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">
              {t('settings.totalWeeklyHours')}
            </span>
            <span className="text-lg font-semibold text-[var(--text-primary)]">
              {totalWeeklyHours} {t('common.hours')}
            </span>
          </div>
        </div>

        {/* Internal Hours Limit */}
        <FormField name="internalHoursLimit">
          <FormLabel>{t('settings.internalHoursLimit')}</FormLabel>
          <Input
            id="internalHoursLimit"
            type="number"
            min="0"
            max={totalWeeklyHours}
            value={internalHoursLimit}
            onChange={e => setInternalHoursLimit(Number(e.target.value))}
            helpText={t('settings.internalHoursLimitHelp')}
            required
          />
        </FormField>

        {/* Commercial Hours Limit */}
        <FormField name="commercialHoursLimit">
          <FormLabel>{t('settings.commercialHoursLimit')}</FormLabel>
          <Input
            id="commercialHoursLimit"
            type="number"
            min="0"
            max={totalWeeklyHours}
            value={commercialHoursLimit}
            onChange={e => setCommercialHoursLimit(Number(e.target.value))}
            helpText={t('settings.commercialHoursLimitHelp')}
            required
          />
        </FormField>
      </div>

      {/* Combined Limits Validation */}
      {validationError && (
        <div className="p-3 bg-[var(--error-bg)] border border-[var(--error-border)] rounded-md">
          <p className="text-sm text-[var(--error-text)]">{validationError}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <div>
          {saveMessage && (
            <p
              className={`text-sm ${
                saveMessage === t('settings.saveSuccess')
                  ? 'text-[var(--success-text)]'
                  : 'text-[var(--error-text)]'
              }`}
            >
              {saveMessage}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSaving || !!validationError}
          isLoading={isSaving}
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </Form>
  );
}
