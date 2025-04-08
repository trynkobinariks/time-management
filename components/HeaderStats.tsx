'use client';

import React, { useMemo } from 'react';
import { useProjectContext } from '../contexts/ProjectContext';
import { startOfWeek, endOfWeek } from 'date-fns';

interface HeaderStatsProps {
  selectedWeekStart: Date;
}

export default function HeaderStats({ selectedWeekStart }: HeaderStatsProps) {
  const { projects, timeEntries } = useProjectContext();

  const stats = useMemo(() => {
    const weekStart = startOfWeek(selectedWeekStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    // Filter entries for selected week
    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    // Calculate total hours
    const totalHoursUsed = weekEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0,
    );

    // Calculate per-project stats
    const projectStats = projects.map(project => {
      const projectEntries = weekEntries.filter(
        entry => entry.project_id === project.id,
      );
      const hoursUsed = projectEntries.reduce(
        (sum, entry) => sum + entry.hours,
        0,
      );

      return {
        id: project.id,
        name: project.name,
        color: project.color,
        hoursUsed,
      };
    });

    return {
      total: {
        hoursUsed: totalHoursUsed,
      },
      projects: projectStats,
    };
  }, [projects, timeEntries, selectedWeekStart]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
      <div className="mb-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.total.hoursUsed.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Project Breakdown</h3>
        <div className="space-y-2">
          {stats.projects.map(project => (
            <div key={project.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color || '#6B7280' }}
                />
                <span className="text-sm text-gray-900">{project.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {project.hoursUsed.toFixed(1)} hrs
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
