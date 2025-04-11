'use client';

import React from 'react';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import {
  useWeeklyProjectHours,
  DEFAULT_WORKING_HOURS_PER_DAY,
  DEFAULT_WORKING_DAYS_PER_WEEK,
  DEFAULT_INTERNAL_HOURS_LIMIT,
  DEFAULT_COMMERCIAL_HOURS_LIMIT,
} from './useWeeklyProjectHours';
import { useUserSettings } from '@/hooks/useUserSettings';

interface WeeklyProjectHoursProps {
  selectedDate: Date;
  isCompact?: boolean;
}

export default function WeeklyProjectHours({
  selectedDate,
  isCompact = false,
}: WeeklyProjectHoursProps) {
  const { t } = useClientTranslation();
  const { settings } = useUserSettings();
  const { weeklyMetrics, animatedPercentages, highlightedBars, weekRangeText } =
    useWeeklyProjectHours(selectedDate);

  // Get limits from user settings or use defaults
  const weeklyTotalTarget =
    settings?.working_hours_per_day && settings?.working_days_per_week
      ? settings.working_hours_per_day * settings.working_days_per_week
      : DEFAULT_WORKING_HOURS_PER_DAY * DEFAULT_WORKING_DAYS_PER_WEEK;
  const internalHoursLimit =
    settings?.internal_hours_limit || DEFAULT_INTERNAL_HOURS_LIMIT;
  const commercialHoursLimit =
    settings?.commercial_hours_limit || DEFAULT_COMMERCIAL_HOURS_LIMIT;

  if (isCompact) {
    return (
      <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-3 flex flex-col space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-xl font-medium text-[var(--text-primary)]">
            {t('dashboard.weeklyHours')} ({weekRangeText})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
          {/* Total Hours */}
          <div className="space-y-1">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-xs sm:text-lg text-[var(--text-secondary)]">
                  {t('dashboard.totalHours')}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${weeklyMetrics.totalOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  {weeklyMetrics.totalOvertime ? (
                    <>
                      +{weeklyMetrics.totalOvertimeHours.toFixed(1)}h{' '}
                      {t('dashboard.overtime')}
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-xl">
                        {weeklyMetrics.totalRemaining.toFixed(1)}
                      </span>
                      /{weeklyTotalTarget}h {t('dashboard.left')}
                    </>
                  )}
                </span>
              </div>
              <div className="h-2 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.total ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.totalOvertime ? 'bg-red-500' : 'bg-violet-600'}`}
                  style={{ width: `${animatedPercentages.total}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Internal */}
          <div className="space-y-1">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-xs sm:text-lg text-[var(--text-secondary)]">
                  {t('projects.popup.typeInternal')}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${weeklyMetrics.internalOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  {weeklyMetrics.internalOvertime ? (
                    <>
                      +{weeklyMetrics.internalOvertimeHours.toFixed(1)}h{' '}
                      {t('dashboard.overtime')}
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-xl">
                        {weeklyMetrics.internalRemaining.toFixed(1)}
                      </span>
                      /{internalHoursLimit}h {t('dashboard.left')}
                    </>
                  )}
                </span>
              </div>
              <div className="h-2 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.internal ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.internalOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${animatedPercentages.internal}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Commercial */}
          <div className="space-y-1">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-xs sm:text-lg text-[var(--text-secondary)]">
                  {t('projects.popup.typeCommercial')}
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${weeklyMetrics.commercialOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  {weeklyMetrics.commercialOvertime ? (
                    <>
                      +{weeklyMetrics.commercialOvertimeHours.toFixed(1)}h{' '}
                      {t('dashboard.overtime')}
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-xl">
                        {weeklyMetrics.commercialRemaining.toFixed(1)}
                      </span>
                      /{commercialHoursLimit}h {t('dashboard.left')}
                    </>
                  )}
                </span>
              </div>
              <div className="h-2 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.commercial ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${animatedPercentages.commercial}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6 flex flex-col space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-medium text-[var(--text-primary)]">
          {t('dashboard.weeklyHours')}
        </h2>
        <span className="text-xl text-[var(--text-secondary)]">
          {weekRangeText}
        </span>
      </div>

      {/* Total Hours */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-medium text-[var(--text-primary)]">
              {t('dashboard.totalHours')}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
                {weeklyMetrics.totalRemaining.toFixed(1)}h
              </span>
              <span className="text-lg sm:text-xl text-[var(--text-secondary)]">
                / {weeklyTotalTarget}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {weeklyMetrics.totalOvertime ? (
              <span className="text-xl font-medium text-red-500">
                +{weeklyMetrics.totalOvertimeHours.toFixed(1)}h{' '}
                {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-xl font-medium text-[var(--text-secondary)]">
                {weeklyMetrics.totalHours.toFixed(1)}h / {weeklyTotalTarget}h{' '}
                {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.total ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.totalOvertime ? 'bg-red-500' : 'bg-violet-600'}`}
            style={{ width: `${animatedPercentages.total}%` }}
          ></div>
        </div>
      </div>

      {/* Internal Projects */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-medium text-[var(--text-primary)]">
              {t('projects.popup.typeInternal')}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[var(--text-primary)]">
                {weeklyMetrics.internalRemaining.toFixed(1)}h
              </span>
              <span className="text-lg text-[var(--text-secondary)]">
                / {internalHoursLimit}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {weeklyMetrics.internalOvertime ? (
              <span className="text-xl font-medium text-red-500">
                +{weeklyMetrics.internalOvertimeHours.toFixed(1)}h{' '}
                {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-xl font-medium text-[var(--text-secondary)]">
                {weeklyMetrics.internalHours.toFixed(1)}h / {internalHoursLimit}
                h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.internal ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.internalOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${animatedPercentages.internal}%` }}
          ></div>
        </div>
      </div>

      {/* Commercial Projects */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-medium text-[var(--text-primary)]">
              {t('projects.popup.typeCommercial')}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[var(--text-primary)]">
                {weeklyMetrics.commercialRemaining.toFixed(1)}h
              </span>
              <span className="text-lg text-[var(--text-secondary)]">
                / {commercialHoursLimit}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {weeklyMetrics.commercialOvertime ? (
              <span className="text-xl font-medium text-red-500">
                +{weeklyMetrics.commercialOvertimeHours.toFixed(1)}h{' '}
                {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-xl font-medium text-[var(--text-secondary)]">
                {weeklyMetrics.commercialHours.toFixed(1)}h /{' '}
                {commercialHoursLimit}h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.commercial ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${animatedPercentages.commercial}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
