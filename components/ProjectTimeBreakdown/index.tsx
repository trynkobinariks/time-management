'use client';

import React from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useProjectContext } from '@/contexts/ProjectContext';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { ProjectType } from '@/lib/types';
import ProgressBar from '@/components/ui/ProgressBar';

interface ProjectTimeBreakdownProps {
  selectedDate: Date;
  periodType: 'weekly' | 'monthly';
}

export default function ProjectTimeBreakdown({
  selectedDate,
  periodType,
}: ProjectTimeBreakdownProps) {
  const { timeEntries, projects } = useProjectContext();
  const { t } = useClientTranslation();

  // Get time entries for the selected period
  const periodEntries = React.useMemo(() => {
    let start, end;

    if (periodType === 'weekly') {
      start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
      end = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
    } else {
      start = startOfMonth(selectedDate);
      end = endOfMonth(selectedDate);
    }

    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start, end });
    });
  }, [timeEntries, selectedDate, periodType]);

  // Group hours by project
  const projectHours = React.useMemo(() => {
    const hours: { [key: string]: number } = {};

    periodEntries.forEach(entry => {
      const projectId = entry.project_id;
      if (!hours[projectId]) {
        hours[projectId] = 0;
      }
      hours[projectId] += entry.hours;
    });

    return hours;
  }, [periodEntries]);

  // Calculate total hours across all projects
  const totalHours = React.useMemo(() => {
    return Object.values(projectHours).reduce((sum, hours) => sum + hours, 0);
  }, [projectHours]);

  // Sort projects by hours (descending)
  const sortedProjects = React.useMemo(() => {
    return projects
      .filter(project => projectHours[project.id] > 0)
      .sort((a, b) => (projectHours[b.id] || 0) - (projectHours[a.id] || 0));
  }, [projects, projectHours]);

  if (sortedProjects.length === 0) {
    return (
      <div className="text-xs mt-1 sm:mt-2">
        <p className="text-xs text-[var(--text-secondary)]">
          {t('timeEntries.noTimeEntries')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 mt-1 sm:mt-2">
      {sortedProjects.map(project => {
        const percentage =
          totalHours > 0 ? (projectHours[project.id] / totalHours) * 100 : 0;

        return (
          <div key={project.id} className="text-xs">
            <div className="flex justify-between items-center mb-0.5">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-medium mr-1 max-w-[150px] truncate">
                  {project.name}
                </span>
                <span className="text-[var(--text-secondary)] text-xs hidden sm:inline">
                  (
                  {project.type === ProjectType.INTERNAL
                    ? t('projects.popup.typeInternal')
                    : t('projects.popup.typeCommercial')}
                  )
                </span>
              </div>
              <span className="font-medium text-xs">
                {projectHours[project.id].toFixed(1)}
                {t('timeEntries.hours')}
                <span className="text-[var(--text-secondary)] ml-1">
                  ({Math.round(percentage)}%)
                </span>
              </span>
            </div>
            <ProgressBar
              percentage={percentage}
              color={
                project.color ||
                (project.type === ProjectType.INTERNAL
                  ? 'rgb(59, 130, 246)'
                  : 'rgb(34, 197, 94)')
              }
              height="md"
            />
          </div>
        );
      })}
    </div>
  );
}
