'use client';

import React, { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { useProjectContext } from '@/lib/ProjectContext';
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

export default function DailyHoursChart({ weekStartDate }: DailyHoursChartProps) {
  const { timeEntries, projects } = useProjectContext();
  
  // Generate daily summaries for the week with project breakdown
  const dailySummaries = useMemo(() => {
    const result: (DailySummary & { projectBreakdown: ProjectHours[] })[] = [];
    
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
      const maxHours = 8; // Default daily limit
      
      // Group entries by project
      const projectHours: Record<string, number> = {};
      dayEntries.forEach(entry => {
        if (!projectHours[entry.project_id]) {
          projectHours[entry.project_id] = 0;
        }
        projectHours[entry.project_id] += entry.hours;
      });
      
      // Create project breakdown with positioning information
      const projectBreakdown: ProjectHours[] = [];
      let currentPercent = 0;
      
      Object.entries(projectHours).forEach(([projectId, hours]) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        const percentOfDay = (hours / maxHours) * 100;
        const startPercent = currentPercent;
        const endPercent = currentPercent + percentOfDay;
        
        projectBreakdown.push({
          projectId,
          projectName: project.name,
          color: project.color || '#374151',
          hours,
          startPercent,
          endPercent
        });
        
        currentPercent = endPercent;
      });
      
      result.push({
        date,
        totalHoursWorked,
        maxHours,
        remainingHours: Math.max(0, maxHours - totalHoursWorked),
        entries: dayEntries,
        projectBreakdown
      });
    }
    
    return result;
  }, [weekStartDate, timeEntries, projects]);
  
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3 className="text-base font-medium text-gray-800 mb-4">Daily Hours</h3>
      
      <div className="grid grid-cols-7 gap-2">
        {dailySummaries.map((day) => (
          <div 
            key={day.date.toISOString()} 
            className={`flex flex-col items-center p-2 rounded ${
              day.date.toDateString() === new Date().toDateString() ? 'bg-gray-100' : ''
            }`}
          >
            <span className="text-xs font-medium text-gray-600 mb-1">
              {format(day.date, 'EEE')}
            </span>
            
            <div className="w-full h-20 bg-gray-50 border border-gray-200 rounded relative mb-1">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={`divider-${i}`} 
                    className="border-b border-gray-200 flex-1"
                  />
                ))}
              </div>
              
              {day.totalHoursWorked > 0 ? (
                <>
                  {/* Project bars */}
                  <div className="absolute inset-0">
                    {day.projectBreakdown.map((project) => {
                      // Only show up to 100% of the chart height
                      const normalizedStartPercent = Math.min(project.startPercent, 100);
                      const normalizedEndPercent = Math.min(project.endPercent, 100);
                      const height = normalizedEndPercent - normalizedStartPercent;
                      
                      return (
                        <div 
                          key={`${day.date.toISOString()}-${project.projectId}`}
                          className="absolute left-0 right-0 transition-all duration-300"
                          style={{ 
                            bottom: `${normalizedStartPercent}%`, 
                            height: `${height}%`,
                            backgroundColor: project.color,
                          }}
                          title={`${project.projectName}: ${project.hours} hours`}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Overtime indicator - red overlay for anything over 100% */}
                  {day.totalHoursWorked > day.maxHours && (
                    <div 
                      className="absolute left-0 right-0 bottom-0 bg-red-500 opacity-30"
                      style={{ height: '100%' }}
                    />
                  )}
                </>
              ) : null}
              
              {/* Daily limit indicator */}
              <div className="absolute w-full border-t border-dashed border-gray-400" style={{ top: '0%' }} />
              
              {/* Add red border when overtime */}
              {day.totalHoursWorked > day.maxHours && (
                <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none" />
              )}
            </div>
            
            <span className={`text-xs font-medium ${day.totalHoursWorked > day.maxHours ? 'text-red-600' : 'text-gray-700'}`}>
              {day.totalHoursWorked}/{day.maxHours}h
            </span>
          </div>
        ))}
      </div>
      
      {/* Project color legend */}
      {projects.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Projects</h4>
          <div className="flex flex-wrap gap-2">
            {projects.map(project => (
              <div key={project.id} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-1"
                  style={{ backgroundColor: project.color || '#374151' }}
                />
                <span className="text-xs text-gray-600">{project.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 