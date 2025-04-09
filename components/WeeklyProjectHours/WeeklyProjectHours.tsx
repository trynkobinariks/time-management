'use client';

import React from 'react';
import { useClientTranslation } from '../../hooks/useClientTranslation';
import {
  useWeeklyProjectHours,
  WEEKLY_TOTAL_TARGET,
  PROJECT_TYPE_TARGET,
} from './useWeeklyProjectHours';

interface WeeklyProjectHoursProps {
  selectedDate: Date;
  isCompact?: boolean;
}

export default function WeeklyProjectHours({
  selectedDate,
  isCompact = false,
}: WeeklyProjectHoursProps) {
  const { t } = useClientTranslation();
  const { weeklyMetrics, animatedPercentages, highlightedBars, weekRangeText } =
    useWeeklyProjectHours(selectedDate);

  if (isCompact) {
    return (
      <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-3 flex flex-col space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[var(--text-primary)]">
            {t('dashboard.weeklyHours')} ({weekRangeText})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Total Hours */}
          <div className="space-y-1">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  {t('dashboard.totalHours')}
                </span>
                <span
                  className={`text-xs font-medium ${weeklyMetrics.totalOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="text-sm">
                    {weeklyMetrics.totalRemaining.toFixed(1)}
                  </span>
                  /{WEEKLY_TOTAL_TARGET}h {t('dashboard.left')}
                </span>
              </div>
              <div className="h-1 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
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
                <span className="text-xs text-[var(--text-secondary)]">
                  {t('projects.popup.typeInternal')}
                </span>
                <span
                  className={`text-xs font-medium ${weeklyMetrics.internalOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="text-sm">
                    {weeklyMetrics.internalRemaining.toFixed(1)}
                  </span>
                  /{PROJECT_TYPE_TARGET}h {t('dashboard.left')}
                </span>
              </div>
              <div className="h-1 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
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
                <span className="text-xs text-[var(--text-secondary)]">
                  {t('projects.popup.typeCommercial')}
                </span>
                <span
                  className={`text-xs font-medium ${weeklyMetrics.commercialOvertime ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="text-sm">
                    {weeklyMetrics.commercialRemaining.toFixed(1)}
                  </span>
                  /{PROJECT_TYPE_TARGET}h {t('dashboard.left')}
                </span>
              </div>
              <div className="h-1 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
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
        <h2 className="text-lg font-medium text-[var(--text-primary)]">
          {t('dashboard.weeklyHours')}
        </h2>
        <span className="text-sm text-[var(--text-secondary)]">
          {weekRangeText}
        </span>
      </div>

      {/* Total Hours */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              {t('dashboard.totalHours')}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {weeklyMetrics.totalRemaining.toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                / {WEEKLY_TOTAL_TARGET}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {weeklyMetrics.totalOvertime ? (
              <span className="text-sm font-medium text-red-500">
                +{(weeklyMetrics.totalHours - WEEKLY_TOTAL_TARGET).toFixed(1)}h{' '}
                {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {weeklyMetrics.totalHours.toFixed(1)}h / {WEEKLY_TOTAL_TARGET}h{' '}
                {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
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
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              {t('projects.popup.typeInternal')}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {weeklyMetrics.internalRemaining.toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                / {PROJECT_TYPE_TARGET}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {weeklyMetrics.internalOvertime ? (
              <span className="text-sm font-medium text-red-500">
                +
                {(weeklyMetrics.internalHours - PROJECT_TYPE_TARGET).toFixed(1)}
                h {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {weeklyMetrics.internalHours.toFixed(1)}h /{' '}
                {PROJECT_TYPE_TARGET}h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
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
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              {t('projects.popup.typeCommercial')}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {weeklyMetrics.commercialRemaining.toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                / {PROJECT_TYPE_TARGET}h {t('dashboard.left')}
              </span>
            </div>
          </div>
          <div className="text-right">
            {weeklyMetrics.commercialOvertime ? (
              <span className="text-sm font-medium text-red-500">
                +
                {(weeklyMetrics.commercialHours - PROJECT_TYPE_TARGET).toFixed(
                  1,
                )}
                h {t('dashboard.overtime')}
              </span>
            ) : (
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {weeklyMetrics.commercialHours.toFixed(1)}h /{' '}
                {PROJECT_TYPE_TARGET}h {t('dashboard.used')}
              </span>
            )}
          </div>
        </div>
        <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${highlightedBars.commercial ? 'opacity-70' : 'opacity-100'} ${weeklyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${animatedPercentages.commercial}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
