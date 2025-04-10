import { useMemo, useEffect, useState, useRef } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ProjectType } from '../../lib/types';
import {
  startOfMonth,
  endOfMonth,
  format,
  isWithinInterval,
  eachDayOfInterval,
  isWeekend,
} from 'date-fns';
import { useUserSettings } from '@/hooks/useUserSettings';

// Default constants (will be overridden by user settings)
export const DEFAULT_WORKING_HOURS_PER_DAY = 8;
export const DEFAULT_WORKING_DAYS_PER_WEEK = 5;
export const DEFAULT_INTERNAL_HOURS_LIMIT_WEEKLY = 20; // Weekly limit
export const DEFAULT_COMMERCIAL_HOURS_LIMIT_WEEKLY = 20; // Weekly limit

interface MonthlyMetrics {
  monthStart: Date;
  monthEnd: Date;
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

interface UseMonthlyProjectHoursReturn {
  monthlyMetrics: MonthlyMetrics;
  animatedPercentages: AnimationState;
  highlightedBars: HighlightState;
  monthRangeText: string;
  workingDaysCount: number;
}

export function useMonthlyProjectHours(
  selectedDate: Date,
): UseMonthlyProjectHoursReturn {
  const { timeEntries, projects } = useProjectContext();
  const { settings } = useUserSettings();

  // Calculate working days in the month (Monday-Friday)
  const workingDaysCount = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return daysInMonth.filter(day => !isWeekend(day)).length;
  }, [selectedDate]);

  // Calculate scaling factor based on working days
  // This represents how many weeks worth of working days are in this month
  const monthToWeekScalingFactor =
    workingDaysCount / DEFAULT_WORKING_DAYS_PER_WEEK;

  // Calculate monthly total based on user settings and working days count
  const monthlyTotalTarget = settings?.working_hours_per_day
    ? settings.working_hours_per_day * workingDaysCount // Exact hours based on working days
    : DEFAULT_WORKING_HOURS_PER_DAY * workingDaysCount;

  // Calculate monthly limits by scaling weekly limits according to working days count
  const internalHoursLimit = settings?.internal_hours_limit
    ? settings.internal_hours_limit * monthToWeekScalingFactor // Scale weekly limit to month
    : DEFAULT_INTERNAL_HOURS_LIMIT_WEEKLY * monthToWeekScalingFactor;

  const commercialHoursLimit = settings?.commercial_hours_limit
    ? settings.commercial_hours_limit * monthToWeekScalingFactor
    : DEFAULT_COMMERCIAL_HOURS_LIMIT_WEEKLY * monthToWeekScalingFactor;

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

  // Calculate monthly metrics based on selected date
  const monthlyMetrics = useMemo(() => {
    // Calculate month boundaries for the selected date
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    // Filter time entries for the current month
    const monthlyEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
    });

    // Group by project types and calculate hours
    let internalHours = 0;
    let commercialHours = 0;
    let totalHours = 0;

    monthlyEntries.forEach(entry => {
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
    const totalRemaining = Math.max(0, monthlyTotalTarget - totalHours);

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
      (totalHours / monthlyTotalTarget) * 100,
    );

    return {
      monthStart,
      monthEnd,
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
      totalOvertime: totalHours > monthlyTotalTarget,
    };
  }, [
    timeEntries,
    projects,
    selectedDate,
    monthlyTotalTarget,
    internalHoursLimit,
    commercialHoursLimit,
  ]);

  // Handle animations for progress bars
  useEffect(() => {
    // Reset animations on mount
    setAnimatedPercentages({
      total: 0,
      internal: 0,
      commercial: 0,
    });

    // Reset highlighted bars
    setHighlightedBars({
      total: false,
      internal: false,
      commercial: false,
    });

    // Animate from 0 to current values after a short delay
    const timer = setTimeout(() => {
      setAnimatedPercentages({
        total: monthlyMetrics.totalPercentage,
        internal: monthlyMetrics.internalPercentage,
        commercial: monthlyMetrics.commercialPercentage,
      });
    }, 50);

    prevMetricsRef.current = monthlyMetrics;
    return () => clearTimeout(timer);
  }, [selectedDate]); // Re-run when selectedDate changes

  // Handle animations for metrics changes
  useEffect(() => {
    if (!prevMetricsRef.current) {
      return;
    }

    // Check which metrics have changed
    const changedBars = {
      total:
        prevMetricsRef.current.totalPercentage !==
        monthlyMetrics.totalPercentage,
      internal:
        prevMetricsRef.current.internalPercentage !==
        monthlyMetrics.internalPercentage,
      commercial:
        prevMetricsRef.current.commercialPercentage !==
        monthlyMetrics.commercialPercentage,
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
        total: monthlyMetrics.totalPercentage,
        internal: monthlyMetrics.internalPercentage,
        commercial: monthlyMetrics.commercialPercentage,
      });

      prevMetricsRef.current = monthlyMetrics;
      return () => clearTimeout(highlightTimer);
    }

    prevMetricsRef.current = monthlyMetrics;
  }, [monthlyMetrics]);

  // Format the month range for display
  const monthRangeText = format(monthlyMetrics.monthStart, 'MMMM yyyy');

  return {
    monthlyMetrics,
    animatedPercentages,
    highlightedBars,
    monthRangeText,
    workingDaysCount,
  };
}
