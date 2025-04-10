'use client';

import React from 'react';
import { UserSettings } from '@/lib/types';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useUserSettingsForm } from '@/hooks/useUserSettingsForm';
import { NumberInput } from '@/components/ui/NumberInput';
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
    <Form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Working Hours and Days Section */}
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 bg-[var(--card-alt-background)] rounded-lg border border-[var(--card-border)]">
          <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
            {t('settings.workSchedule')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Working Hours Per Day */}
            <FormField name="workingHoursPerDay">
              <FormLabel className="text-sm">
                {t('settings.workingHoursPerDay')}
              </FormLabel>
              <NumberInput
                id="workingHoursPerDay"
                min={1}
                max={24}
                step={0.5}
                value={workingHoursPerDay}
                onChange={setWorkingHoursPerDay}
                helpText={t('settings.workingHoursPerDayHelp')}
                required
              />
            </FormField>

            {/* Working Days Per Week */}
            <FormField name="workingDaysPerWeek">
              <FormLabel className="text-sm">
                {t('settings.workingDaysPerWeek')}
              </FormLabel>
              <NumberInput
                id="workingDaysPerWeek"
                min={1}
                max={7}
                step={1}
                value={workingDaysPerWeek}
                onChange={setWorkingDaysPerWeek}
                helpText={t('settings.workingDaysPerWeekHelp')}
                required
              />
            </FormField>
          </div>

          {/* Weekly Calculation */}
          <div className="p-3 sm:p-4 bg-[var(--card-background)] rounded-md border border-[var(--card-border)] mt-1 sm:mt-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  {t('settings.totalWeeklyHours')}
                </span>
                <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {t('settings.calculatedAutomatically')}
                </span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] bg-[var(--card-alt-background)] py-1 px-2 sm:px-3 rounded-md">
                {totalWeeklyHours} {t('common.hours')}
              </span>
            </div>
          </div>
        </div>

        {/* Project Hours Limits Section */}
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 bg-[var(--card-alt-background)] rounded-lg border border-[var(--card-border)]">
          <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
            {t('settings.projectLimits')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Internal Hours Limit */}
            <FormField name="internalHoursLimit">
              <FormLabel className="text-sm">
                {t('settings.internalHoursLimit')}
              </FormLabel>
              <NumberInput
                id="internalHoursLimit"
                min={0}
                max={totalWeeklyHours}
                step={0.5}
                value={internalHoursLimit}
                onChange={setInternalHoursLimit}
                helpText={t('settings.internalHoursLimitHelp')}
                required
              />
            </FormField>

            {/* Commercial Hours Limit */}
            <FormField name="commercialHoursLimit">
              <FormLabel className="text-sm">
                {t('settings.commercialHoursLimit')}
              </FormLabel>
              <NumberInput
                id="commercialHoursLimit"
                min={0}
                max={totalWeeklyHours}
                step={0.5}
                value={commercialHoursLimit}
                onChange={setCommercialHoursLimit}
                helpText={t('settings.commercialHoursLimitHelp')}
                required
              />
            </FormField>
          </div>

          {/* Combined Limits Visualization */}
          <div className="p-3 sm:p-4 bg-[var(--card-background)] rounded-md border border-[var(--card-border)] mt-1 sm:mt-2">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                {t('settings.allocatedHours')}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                {internalHoursLimit + commercialHoursLimit} / {totalWeeklyHours}{' '}
                {t('common.hours')}
              </span>
            </div>
            <div className="h-3 sm:h-4 bg-[var(--card-border)] rounded-full overflow-hidden">
              <div className="flex h-full">
                <div
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${(internalHoursLimit / totalWeeklyHours) * 100}%`,
                  }}
                  title={`${t('projects.popup.typeInternal')}: ${internalHoursLimit} ${t('common.hours')}`}
                ></div>
                <div
                  className="bg-green-500 h-full"
                  style={{
                    width: `${(commercialHoursLimit / totalWeeklyHours) * 100}%`,
                  }}
                  title={`${t('projects.popup.typeCommercial')}: ${commercialHoursLimit} ${t('common.hours')}`}
                ></div>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] sm:text-xs text-[var(--text-secondary)]">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>{t('projects.popup.typeInternal')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1"></div>
                <span>{t('projects.popup.typeCommercial')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Limits Validation */}
      {validationError && (
        <div className="p-3 sm:p-4 bg-[var(--error-bg)] border border-[var(--error-border)] rounded-md flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--error-text)] mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs sm:text-sm text-[var(--error-text)]">
            {validationError}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[var(--card-border)]">
        <div>
          {saveMessage && (
            <div
              className={`flex items-center ${
                saveMessage === t('settings.saveSuccess')
                  ? 'text-[var(--success-text)]'
                  : 'text-[var(--error-text)]'
              }`}
            >
              {saveMessage === t('settings.saveSuccess') ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p className="text-xs sm:text-sm font-medium">{saveMessage}</p>
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSaving || !!validationError}
          isLoading={isSaving}
          className="px-4 sm:px-6 text-xs sm:text-sm py-1.5 sm:py-2"
        >
          {isSaving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </Form>
  );
}
