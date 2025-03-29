'use client';

import React, { useMemo } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { addDays } from '@/lib/utils';
import { DailySummary } from '@/lib/types';

interface DailyHoursChartProps {
  weekStartDate: Date;
}

interface ProjectHours {
  projectId: string;
  projectName: string;
  color: string;
  hours: number;
  startPercent: number;
  endPercent: number;
}

interface DailySummaryWithBreakdown extends DailySummary {
  projectBreakdown: ProjectHours[];
}

export default function DailyHoursChart({ weekStartDate }: DailyHoursChartProps) {
  const { timeEntries, projects } = useProjectContext();
  
  // Generate daily summaries for the week with project breakdown
  const dailySummaries = useMemo(() => {
    const result: DailySummaryWithBreakdown[] = [];
    
    // Create a summary for each day of the week
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(weekStartDate), i);
      date.setHours(0, 0, 0, 0);
      
      // Find time entries for this day
      const dayEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });
      
      // Calculate total hours worked
      const totalHoursWorked = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
      
      // Group entries by project
      const projectHours: Record<string, number> = {};
      dayEntries.forEach(entry => {
        if (!projectHours[entry.project_id]) {
          projectHours[entry.project_id] = 0;
        }
        projectHours[entry.project_id] += entry.hours;
      });
      
      // Convert to array and calculate percentages
      const projectBreakdown: ProjectHours[] = Object.entries(projectHours)
        .map(([projectId, hours]) => {
          const project = projects.find(p => p.id === projectId);
          if (!project) return null;
          
          return {
            projectId,
            projectName: project.name,
            color: project.color || '#6B7280',
            hours,
            startPercent: 0, // Will be calculated below
            endPercent: 0 // Will be calculated below
          };
        })
        .filter((p): p is ProjectHours => p !== null);
      
      // Calculate percentages
      let currentPercent = 0;
      projectBreakdown.forEach((project: ProjectHours) => {
        project.startPercent = currentPercent;
        currentPercent += (project.hours / totalHoursWorked) * 100;
        project.endPercent = currentPercent;
      });
      
      result.push({
        date,
        totalHoursWorked,
        entries: dayEntries,
        projectBreakdown
      });
    }
    
    return result;
  }, [timeEntries, projects, weekStartDate]);
  
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Daily Hours Breakdown</h3>
      <div className="space-y-4">
        {dailySummaries.map(day => (
          <div key={day.date.toISOString()} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {day.totalHoursWorked.toFixed(1)} hrs
              </span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              {day.projectBreakdown.map((project: ProjectHours) => (
                <div
                  key={project.projectId}
                  className="h-full inline-block"
                  style={{
                    width: `${project.endPercent - project.startPercent}%`,
                    backgroundColor: project.color,
                    marginLeft: project.startPercent === 0 ? '0' : '-100%'
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {day.projectBreakdown.map((project: ProjectHours) => (
                <div key={project.projectId} className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-xs text-gray-600">
                    {project.projectName}: {project.hours.toFixed(1)}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 