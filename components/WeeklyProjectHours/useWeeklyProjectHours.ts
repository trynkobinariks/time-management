import { useMemo, useEffect, useState, useRef } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ProjectType } from '../../lib/types';
import { startOfWeek, endOfWeek, format, isWithinInterval } from 'date-fns';

// Constants for weekly metrics
export const WEEKLY_TOTAL_TARGET = 40; // 8 hours per day, 5 days
export const PROJECT_TYPE_TARGET = 20; // Max 20 hours per project type per week

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
