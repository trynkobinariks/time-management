'use client';

import React, { useMemo } from 'react';
import { useProjectContext } from '../contexts/ProjectContext';
import { ProjectType } from '../lib/types';
import { startOfWeek, endOfWeek, format, isWithinInterval } from 'date-fns';
import { useClientTranslation } from '../hooks/useClientTranslation';

interface WeeklyProjectHoursProps {
  selectedDate: Date;
  isCompact?: boolean;
}

export default function WeeklyProjectHours({
  selectedDate,
  isCompact = false,
}: WeeklyProjectHoursProps) {
  const { timeEntries, projects } = useProjectContext();
  const { t } = useClientTranslation();

  // Constants for weekly metrics
  const WEEKLY_TOTAL_TARGET = 40; // 8 hours per day, 5 days
  const PROJECT_TYPE_TARGET = 20; // Max 20 hours per project type per week

  // Calculate weekly metrics based on selected date
  const weeklyMetrics = useMemo(() => {
    // Calculate week boundaries for the selected date
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday

    // Filter time entries for the current week
    const weeklyEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });

    // Group by project types and calculate hours
    let internalHours = 0;
    let commercialHours = 0;
    let totalHours = 0;

    weeklyEntries.forEach(entry => {
      const project = projects.find(p => p.id === entry.project_id);

      if (project) {
        if (project.type === ProjectType.INTERNAL) {
          internalHours += entry.hours;
        } else {
          commercialHours += entry.hours;
        }
        totalHours += entry.hours;
      }
    });

    // Calculate remaining hours
    const internalRemaining = Math.max(0, PROJECT_TYPE_TARGET - internalHours);
    const commercialRemaining = Math.max(
      0,
      PROJECT_TYPE_TARGET - commercialHours,
    );
    const totalRemaining = Math.max(0, WEEKLY_TOTAL_TARGET - totalHours);

    // Calculate percentages for progress bars
    const internalPercentage = Math.min(
      100,
      (internalHours / PROJECT_TYPE_TARGET) * 100,
    );
    const commercialPercentage = Math.min(
      100,
      (commercialHours / PROJECT_TYPE_TARGET) * 100,
    );
    const totalPercentage = Math.min(
      100,
      (totalHours / WEEKLY_TOTAL_TARGET) * 100,
    );

    return {
      weekStart,
      weekEnd,
      internalHours,
      commercialHours,
      totalHours,
      internalRemaining,
      commercialRemaining,
      totalRemaining,
      internalPercentage,
      commercialPercentage,
      totalPercentage,
      internalOvertime: internalHours > PROJECT_TYPE_TARGET,
      commercialOvertime: commercialHours > PROJECT_TYPE_TARGET,
      totalOvertime: totalHours > WEEKLY_TOTAL_TARGET,
    };
  }, [timeEntries, projects, selectedDate]);

  // Format the week range for display
  const weekRangeText = `${format(weeklyMetrics.weekStart, 'MMM d')} - ${format(weeklyMetrics.weekEnd, 'MMM d, yyyy')}`;

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
                  {weeklyMetrics.totalHours.toFixed(1)}/{WEEKLY_TOTAL_TARGET}h
                </span>
              </div>
              <div className="h-1 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${weeklyMetrics.totalOvertime ? 'bg-red-500' : 'bg-violet-600'}`}
                  style={{ width: `${weeklyMetrics.totalPercentage}%` }}
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
                  {weeklyMetrics.internalHours.toFixed(1)}/{PROJECT_TYPE_TARGET}
                  h
                </span>
              </div>
              <div className="h-1 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${weeklyMetrics.internalOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${weeklyMetrics.internalPercentage}%` }}
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
                  {weeklyMetrics.commercialHours.toFixed(1)}/
                  {PROJECT_TYPE_TARGET}h
                </span>
              </div>
              <div className="h-1 mt-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${weeklyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${weeklyMetrics.commercialPercentage}%` }}
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
                {weeklyMetrics.totalHours.toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                / {WEEKLY_TOTAL_TARGET}h
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
                {weeklyMetrics.totalRemaining.toFixed(1)}h{' '}
                {t('dashboard.remaining')}
              </span>
            )}
          </div>
        </div>
        <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${weeklyMetrics.totalOvertime ? 'bg-red-500' : 'bg-violet-600'}`}
            style={{ width: `${weeklyMetrics.totalPercentage}%` }}
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
                {weeklyMetrics.internalHours.toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                / {PROJECT_TYPE_TARGET}h
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
                {weeklyMetrics.internalRemaining.toFixed(1)}h{' '}
                {t('dashboard.remaining')}
              </span>
            )}
          </div>
        </div>
        <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${weeklyMetrics.internalOvertime ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${weeklyMetrics.internalPercentage}%` }}
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
                {weeklyMetrics.commercialHours.toFixed(1)}h
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                / {PROJECT_TYPE_TARGET}h
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
                {weeklyMetrics.commercialRemaining.toFixed(1)}h{' '}
                {t('dashboard.remaining')}
              </span>
            )}
          </div>
        </div>
        <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${weeklyMetrics.commercialOvertime ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${weeklyMetrics.commercialPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
