'use client';

import React, { useMemo } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { ProjectType } from '@/lib/types';
import { startOfWeek, endOfWeek } from 'date-fns';

interface HeaderStatsProps {
  selectedWeekStart: Date;
}

export default function HeaderStats({ selectedWeekStart }: HeaderStatsProps) {
  const { projects, timeEntries, internalHoursLimit } = useProjectContext();
  
  const stats = useMemo(() => {
    const weekStart = startOfWeek(selectedWeekStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    // Filter entries for selected week
    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    // Calculate internal projects stats
    const internalProjects = projects.filter(p => p.project_type === ProjectType.INTERNAL);
    const internalEntries = weekEntries.filter(entry => 
      internalProjects.some(p => p.id === entry.project_id)
    );
    const internalHoursUsed = internalEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const internalHoursLeft = Math.max(0, internalHoursLimit - internalHoursUsed);
    
    // Calculate external projects stats
    const externalProjects = projects.filter(p => p.project_type === ProjectType.EXTERNAL);
    const externalEntries = weekEntries.filter(entry => 
      externalProjects.some(p => p.id === entry.project_id)
    );
    const weeklyLimit = 40;
    const externalHoursUsed = externalEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const externalHoursLeft = Math.max(0, weeklyLimit - externalHoursUsed);
    
    // Calculate total hours
    const totalHoursUsed = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalHoursLeft = Math.max(0, 40 - totalHoursUsed);
    const isOverTotal = totalHoursUsed > 40;
    
    // Calculate per-project stats
    const projectStats = projects.map(project => {
      const projectEntries = weekEntries.filter(entry => entry.project_id === project.id);
      const hoursUsed = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const hoursLimit = project.project_type === ProjectType.INTERNAL 
        ? internalHoursLimit 
        : project.weekly_hours_allocation;
      const hoursLeft = Math.max(0, hoursLimit - hoursUsed);
      
      return {
        id: project.id,
        name: project.name,
        type: project.project_type,
        color: project.color,
        hoursUsed,
        hoursLeft,
        hoursLimit
      };
    });
    
    return {
      internal: {
        hoursUsed: internalHoursUsed,
        hoursLeft: internalHoursLeft,
        totalLimit: internalHoursLimit
      },
      external: {
        hoursUsed: externalHoursUsed,
        hoursLeft: externalHoursLeft,
        totalLimit: weeklyLimit
      },
      total: {
        hoursUsed: totalHoursUsed,
        hoursLeft: totalHoursLeft,
        isOverTotal
      },
      projects: projectStats
    };
  }, [projects, timeEntries, internalHoursLimit, selectedWeekStart]);
  
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Internal Projects</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              <span className="text-sm text-gray-600">Used: {stats.internal.hoursUsed.toFixed(1)}h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Left: {stats.internal.hoursLeft.toFixed(1)}h</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-gray-800 transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (stats.internal.hoursUsed / stats.internal.totalLimit) * 100)}%`
              }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">External Projects</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              <span className="text-sm text-gray-600">Used: {stats.external.hoursUsed.toFixed(1)}h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Left: {stats.external.hoursLeft.toFixed(1)}h</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-gray-800 transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (stats.external.hoursUsed / stats.external.totalLimit) * 100)}%`
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Total Hours (Max 40)</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              <span className={`text-sm ${stats.total.isOverTotal ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                Used: {stats.total.hoursUsed.toFixed(1)}h
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Left: {stats.total.hoursLeft.toFixed(1)}h</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stats.total.isOverTotal ? 'bg-red-500' : 'bg-gray-800'
              }`}
              style={{ 
                width: `${Math.min(100, (stats.total.hoursUsed / 40) * 100)}%`
              }}
            />
          </div>
          {stats.total.isOverTotal && (
            <p className="text-xs text-red-600 font-medium mt-1">
              Exceeded maximum weekly hours by {(stats.total.hoursUsed - 40).toFixed(1)}h
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Project Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stats.projects.map(project => (
            <div key={project.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: project.color || '#374151' }}
                />
                <span className="text-sm text-gray-600">{project.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{project.hoursUsed.toFixed(1)}h</span>
                <span className="text-xs text-gray-500">
                  {project.type === ProjectType.INTERNAL ? '(shared)' : `/ ${project.hoursLimit}h`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 