import { useMemo, useEffect, useState, useRef } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ProjectType } from '../../lib/types';
import { startOfWeek, endOfWeek, format, isWithinInterval } from 'date-fns';
import { useUserSettings } from '@/hooks/useUserSettings';

// Default constants (will be overridden by user settings)
export const DEFAULT_WORKING_HOURS_PER_DAY = 8;
export const DEFAULT_WORKING_DAYS_PER_WEEK = 5;
export const DEFAULT_INTERNAL_HOURS_LIMIT = 20;
export const DEFAULT_COMMERCIAL_HOURS_LIMIT = 20;

// For backwards compatibility
export const WEEKLY_TOTAL_TARGET =
  DEFAULT_WORKING_HOURS_PER_DAY * DEFAULT_WORKING_DAYS_PER_WEEK;
export const PROJECT_TYPE_TARGET = DEFAULT_INTERNAL_HOURS_LIMIT;

interface WeeklyMetrics {
  weekStart: Date;
  weekEnd: Date;
  internalHours: number;
  commercialHours: number;
  totalHours: number;
  internalRemaining: number;
  commercialRemaining: number;
  totalRemaining: number;
  internalPercentage: number;
  commercialPercentage: number;
  totalPercentage: number;
  internalOvertime: boolean;
  commercialOvertime: boolean;
  totalOvertime: boolean;
}

interface AnimationState {
  total: number;
  internal: number;
  commercial: number;
}

interface HighlightState {
  total: boolean;
  internal: boolean;
  commercial: boolean;
}

interface UseWeeklyProjectHoursReturn {
  weeklyMetrics: WeeklyMetrics;
  animatedPercentages: AnimationState;
  highlightedBars: HighlightState;
  weekRangeText: string;
}

export function useWeeklyProjectHours(
  selectedDate: Date,
): UseWeeklyProjectHoursReturn {
  const { timeEntries, projects } = useProjectContext();
  const { settings } = useUserSettings();

  // Calculate weekly total based on user settings
  const weeklyTotalTarget =
    settings?.working_hours_per_day && settings?.working_days_per_week
      ? settings.working_hours_per_day * settings.working_days_per_week
      : WEEKLY_TOTAL_TARGET;
  const internalHoursLimit =
    settings?.internal_hours_limit || DEFAULT_INTERNAL_HOURS_LIMIT;
  const commercialHoursLimit =
    settings?.commercial_hours_limit || DEFAULT_COMMERCIAL_HOURS_LIMIT;

  const [animatedPercentages, setAnimatedPercentages] =
    useState<AnimationState>({
      total: 0,
      internal: 0,
      commercial: 0,
    });
  const [highlightedBars, setHighlightedBars] = useState<HighlightState>({
    total: false,
    internal: false,
    commercial: false,
  });
  const prevMetricsRef = useRef<{
    totalPercentage: number;
    internalPercentage: number;
    commercialPercentage: number;
  } | null>(null);

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
    const internalRemaining = Math.max(0, internalHoursLimit - internalHours);
    const commercialRemaining = Math.max(
      0,
      commercialHoursLimit - commercialHours,
    );
    const totalRemaining = Math.max(0, weeklyTotalTarget - totalHours);

    // Calculate percentages for progress bars
    const internalPercentage = Math.min(
      100,
      (internalHours / internalHoursLimit) * 100,
    );
    const commercialPercentage = Math.min(
      100,
      (commercialHours / commercialHoursLimit) * 100,
    );
    const totalPercentage = Math.min(
      100,
      (totalHours / weeklyTotalTarget) * 100,
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
      internalOvertime: internalHours > internalHoursLimit,
      commercialOvertime: commercialHours > commercialHoursLimit,
      totalOvertime: totalHours > weeklyTotalTarget,
    };
  }, [
    timeEntries,
    projects,
    selectedDate,
    weeklyTotalTarget,
    internalHoursLimit,
    commercialHoursLimit,
  ]);

  // Handle animations for progress bars
  useEffect(() => {
    // Reset animations on mount
    if (!prevMetricsRef.current) {
      setAnimatedPercentages({
        total: 0,
        internal: 0,
        commercial: 0,
      });

      // Animate from 0 to current values
      const timer = setTimeout(() => {
        setAnimatedPercentages({
          total: weeklyMetrics.totalPercentage,
          internal: weeklyMetrics.internalPercentage,
          commercial: weeklyMetrics.commercialPercentage,
        });
      }, 100);

      prevMetricsRef.current = weeklyMetrics;
      return () => clearTimeout(timer);
    }

    // Check which metrics have changed
    const changedBars = {
      total:
        prevMetricsRef.current.totalPercentage !==
        weeklyMetrics.totalPercentage,
      internal:
        prevMetricsRef.current.internalPercentage !==
        weeklyMetrics.internalPercentage,
      commercial:
        prevMetricsRef.current.commercialPercentage !==
        weeklyMetrics.commercialPercentage,
    };

    // Highlight changed bars
    if (changedBars.total || changedBars.internal || changedBars.commercial) {
      setHighlightedBars({
        total: changedBars.total,
        internal: changedBars.internal,
        commercial: changedBars.commercial,
      });

      // Remove highlight after 1 second
      const highlightTimer = setTimeout(() => {
        setHighlightedBars({
          total: false,
          internal: false,
          commercial: false,
        });
      }, 1000);

      // Animate to new values
      setAnimatedPercentages({
        total: weeklyMetrics.totalPercentage,
        internal: weeklyMetrics.internalPercentage,
        commercial: weeklyMetrics.commercialPercentage,
      });

      prevMetricsRef.current = weeklyMetrics;
      return () => clearTimeout(highlightTimer);
    }

    prevMetricsRef.current = weeklyMetrics;
  }, [weeklyMetrics]);

  // Format the week range for display
  const weekRangeText = `${format(weeklyMetrics.weekStart, 'MMM d')} - ${format(weeklyMetrics.weekEnd, 'MMM d, yyyy')}`;

  return {
    weeklyMetrics,
    animatedPercentages,
    highlightedBars,
    weekRangeText,
  };
}
