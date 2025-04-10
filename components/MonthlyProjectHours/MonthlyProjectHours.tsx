'use client';

import React from 'react';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import {
  useMonthlyProjectHours,
  DEFAULT_WORKING_HOURS_PER_DAY,
  DEFAULT_WORKING_DAYS_PER_WEEK,
  DEFAULT_INTERNAL_HOURS_LIMIT_WEEKLY,
  DEFAULT_COMMERCIAL_HOURS_LIMIT_WEEKLY,
} from './useMonthlyProjectHours';
import { useUserSettings } from '@/hooks/useUserSettings';

interface MonthlyProjectHoursProps {
  selectedDate: Date;
  isCompact?: boolean;
}

export default function MonthlyProjectHours({
  selectedDate,
  isCompact = false,
}: MonthlyProjectHoursProps) {
  const { t } = useClientTranslation();
  const { settings } = useUserSettings();
  const {
    monthlyMetrics,
    animatedPercentages,
    highlightedBars,
    monthRangeText,
    workingDaysCount,
  } = useMonthlyProjectHours(selectedDate);

  // Get limits from user settings or use defaults
  const monthToWeekScalingFactor =
    workingDaysCount / DEFAULT_WORKING_DAYS_PER_WEEK;

  const monthlyTotalTarget = settings?.working_hours_per_day
    ? settings.working_hours_per_day * workingDaysCount
    : DEFAULT_WORKING_HOURS_PER_DAY * workingDaysCount;

  const internalHoursLimit = settings?.internal_hours_limit
    ? settings.internal_hours_limit * monthToWeekScalingFactor
    : DEFAULT_INTERNAL_HOURS_LIMIT_WEEKLY * monthToWeekScalingFactor;

  const commercialHoursLimit = settings?.commercial_hours_limit
    ? settings.commercial_hours_limit * monthToWeekScalingFactor
    : DEFAULT_COMMERCIAL_HOURS_LIMIT_WEEKLY * monthToWeekScalingFactor;

  if (isCompact) {
    return (
      <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-3 flex flex-col space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-xl font-medium text-[var(--text-primary)]">
            {t('dashboard.monthlyHours')} ({monthRangeText})
          </span>
          <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {workingDaysCount} {t('dashboard.workingDays')}
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
                  className={`text-xs sm:text-sm font-medium ${monthlyMetrics.totalOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="text-sm sm:text-xl">
                    {monthlyMetrics.totalRemaining.toFixed(1)}
                  </span>
                  /{monthlyTotalTarget.toFixed(1)}h {t('dashboard.left')}
                </span>
              </div>
              <div className="h-2 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.total ? 'opacity-70' : 'opacity-100'} ${monthlyMetrics.totalOvertime ? 'bg-red-500' : 'bg-violet-600'}`}
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
                  className={`text-xs sm:text-sm font-medium ${monthlyMetrics.internalOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="text-sm sm:text-xl">
                    {monthlyMetrics.internalRemaining.toFixed(1)}
                  </span>
                  /{internalHoursLimit.toFixed(1)}h {t('dashboard.left')}
                </span>
              </div>
              <div className="h-2 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.internal ? 'opacity-70' : 'opacity-100'} ${monthlyMetrics.internalOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
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
                  className={`text-xs sm:text-sm font-medium ${monthlyMetrics.commercialOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="text-sm sm:text-xl">
                    {monthlyMetrics.commercialRemaining.toFixed(1)}
                  </span>
                  /{commercialHoursLimit.toFixed(1)}h {t('dashboard.left')}
                </span>
              </div>
              <div className="h-2 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.commercial ? 'opacity-70' : 'opacity-100'} ${monthlyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
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
          {t('dashboard.monthlyHours')}
        </h2>
        <div>
          <span className="text-xl text-[var(--text-secondary)]">
            {monthRangeText}
          </span>
          <span className="text-sm ml-2 text-[var(--text-secondary)]">
            {workingDaysCount} {t('dashboard.workingDays')}
          </span>
        </div>
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
                {monthlyMetrics.totalRemaining.toFixed(1)}h
              </span>
              <span className="text-lg sm:text-xl text-[var(--text-secondary)]">
                / {monthlyTotalTarget.toFixed(1)}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {monthlyMetrics.totalOvertime ? (
              <span className="text-xl font-medium text-red-500">
                +{(monthlyMetrics.totalHours - monthlyTotalTarget).toFixed(1)}h{' '}
                {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-xl font-medium text-[var(--text-secondary)]">
                {monthlyMetrics.totalHours.toFixed(1)}h /{' '}
                {monthlyTotalTarget.toFixed(1)}h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.total ? 'opacity-70' : 'opacity-100'} ${monthlyMetrics.totalOvertime ? 'bg-red-500' : 'bg-violet-600'}`}
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
                {monthlyMetrics.internalRemaining.toFixed(1)}h
              </span>
              <span className="text-lg text-[var(--text-secondary)]">
                / {internalHoursLimit.toFixed(1)}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {monthlyMetrics.internalOvertime ? (
              <span className="text-xl font-medium text-red-500">
                +
                {(monthlyMetrics.internalHours - internalHoursLimit).toFixed(1)}
                h {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-xl font-medium text-[var(--text-secondary)]">
                {monthlyMetrics.internalHours.toFixed(1)}h /{' '}
                {internalHoursLimit.toFixed(1)}h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.internal ? 'opacity-70' : 'opacity-100'} ${monthlyMetrics.internalOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
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
                {monthlyMetrics.commercialRemaining.toFixed(1)}h
              </span>
              <span className="text-lg text-[var(--text-secondary)]">
                / {commercialHoursLimit.toFixed(1)}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {monthlyMetrics.commercialOvertime ? (
              <span className="text-xl font-medium text-red-500">
                +
                {(
                  monthlyMetrics.commercialHours - commercialHoursLimit
                ).toFixed(1)}
                h {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-xl font-medium text-[var(--text-secondary)]">
                {monthlyMetrics.commercialHours.toFixed(1)}h /{' '}
                {commercialHoursLimit.toFixed(1)}h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.commercial ? 'opacity-70' : 'opacity-100'} ${monthlyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${animatedPercentages.commercial}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
