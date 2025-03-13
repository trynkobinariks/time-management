'use client';

import React, { useMemo } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { ProjectType } from '@/lib/types';
import { startOfWeek } from 'date-fns';

export default function HeaderStats() {
  const { projects, timeEntries, internalHoursLimit, weeklyLimits } = useProjectContext();
  
  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    
    // Filter entries for current week
    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate >= weekStart;
    });
    
    // Calculate internal projects stats
    const internalProjects = projects.filter(p => p.projectType === ProjectType.INTERNAL);
    const internalEntries = weekEntries.filter(entry => 
      internalProjects.some(p => p.id === entry.projectId)
    );
    const internalHoursUsed = internalEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const internalHoursLeft = Math.max(0, internalHoursLimit - internalHoursUsed);
    
    // Calculate external projects stats
    const externalProjects = projects.filter(p => p.projectType === ProjectType.EXTERNAL);
    const externalEntries = weekEntries.filter(entry => 
      externalProjects.some(p => p.id === entry.projectId)
    );
    const weeklyLimit = weeklyLimits[0]?.maxHours || 40;
    const externalHoursUsed = externalEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const externalHoursLeft = Math.max(0, weeklyLimit - externalHoursUsed);
    
    // Calculate per-project stats
    const projectStats = projects.map(project => {
      const projectEntries = weekEntries.filter(entry => entry.projectId === project.id);
      const hoursUsed = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const hoursLimit = project.projectType === ProjectType.INTERNAL 
        ? internalHoursLimit 
        : project.weeklyHoursAllocation;
      const hoursLeft = Math.max(0, hoursLimit - hoursUsed);
      
      return {
        id: project.id,
        name: project.name,
        type: project.projectType,
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
      projects: projectStats
    };
  }, [projects, timeEntries, internalHoursLimit, weeklyLimits]);
  
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <span className="text-xs text-gray-500">of {stats.internal.totalLimit}h</span>
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
            <span className="text-xs text-gray-500">of {stats.external.totalLimit}h</span>
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