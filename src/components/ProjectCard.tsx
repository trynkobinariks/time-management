'use client';

import React, { useMemo } from 'react';
import { Project, ProjectType } from '@/lib/types';
import { useProjectContext } from '@/lib/ProjectContext';
import { startOfWeek, endOfWeek } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onEditClick: () => void;
}

interface BaseProjectStats {
  totalHoursWorked: number;
  remainingHours: number;
  isOvertime: boolean;
  overtimeHours: number;
}

interface InternalProjectStats extends BaseProjectStats {
  totalPoolHours: number;
  maxPoolHours: number;
}

type ProjectStats = InternalProjectStats | BaseProjectStats;

export default function ProjectCard({ project, onEditClick }: ProjectCardProps) {
  const { timeEntries, internalHoursLimit, getInternalHoursUsed } = useProjectContext();
  
  // Calculate project stats for the current week
  const projectStats = useMemo<ProjectStats>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    // Filter time entries for this project in the current week
    const projectEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return (
        entry.projectId === project.id &&
        entryDate >= weekStart &&
        entryDate <= weekEnd
      );
    });
    
    // Calculate total hours worked
    const totalHoursWorked = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    // For internal projects, consider the shared hours pool
    if (project.projectType === ProjectType.INTERNAL) {
      const totalInternalHoursUsed = getInternalHoursUsed(weekStart);
      const remainingInternalHours = Math.max(0, internalHoursLimit - totalInternalHoursUsed);
      const isOvertime = totalInternalHoursUsed > internalHoursLimit;
      const overtimeHours = isOvertime ? totalInternalHoursUsed - internalHoursLimit : 0;
      
      return {
        totalHoursWorked,
        remainingHours: remainingInternalHours,
        isOvertime,
        overtimeHours,
        totalPoolHours: totalInternalHoursUsed,
        maxPoolHours: internalHoursLimit
      };
    } else {
      // For external projects, use project-specific allocation
      const remainingHours = project.weeklyHoursAllocation - totalHoursWorked;
      const isOvertime = remainingHours < 0;
      const overtimeHours = isOvertime ? Math.abs(remainingHours) : 0;
      
      return {
        totalHoursWorked,
        remainingHours: isOvertime ? 0 : remainingHours,
        isOvertime,
        overtimeHours
      };
    }
  }, [project, timeEntries, internalHoursLimit, getInternalHoursUsed]);
  
  const percentComplete = useMemo(() => {
    if (project.projectType === ProjectType.INTERNAL && 'totalPoolHours' in projectStats) {
      return Math.min(
        100,
        Math.round((projectStats.totalPoolHours / projectStats.maxPoolHours) * 100)
      );
    }
    return Math.min(
      100,
      Math.round((projectStats.totalHoursWorked / project.weeklyHoursAllocation) * 100)
    );
  }, [project, projectStats]);
  
  // Determine progress bar color based on overtime
  const progressBarColor = projectStats.isOvertime ? '#EF4444' : project.color || '#374151';
  
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2 flex-shrink-0" 
              style={{ backgroundColor: project.color || '#374151' }}
            />
            <div>
              <h3 className="text-base font-medium text-gray-800">{project.name}</h3>
              <span className="text-xs text-gray-500">
                {project.projectType === ProjectType.INTERNAL ? 'Internal' : 'External'} Project
              </span>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {project.projectType === ProjectType.INTERNAL 
              ? `${internalHoursLimit} hrs shared`
              : `${project.weeklyHoursAllocation} hrs/week`
            }
          </span>
        </div>
        
        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
        )}
        
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Progress</span>
            <span className={`${projectStats.isOvertime ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {project.projectType === ProjectType.INTERNAL && 'totalPoolHours' in projectStats
                ? `${projectStats.totalPoolHours.toFixed(1)} / ${projectStats.maxPoolHours} hrs (shared)`
                : `${projectStats.totalHoursWorked.toFixed(1)} / ${project.weeklyHoursAllocation} hrs`
              }
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full transition-all duration-300" 
              style={{ 
                width: `${percentComplete}%`,
                backgroundColor: progressBarColor
              }}
            />
          </div>
        </div>
        
        {projectStats.isOvertime && (
          <div className="mt-2 text-xs text-red-600 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {project.projectType === ProjectType.INTERNAL && 'totalPoolHours' in projectStats
              ? `Overtime: Internal projects exceeded by ${projectStats.overtimeHours.toFixed(1)} hours`
              : `Overtime: ${projectStats.overtimeHours.toFixed(1)} hours over allocation`
            }
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            {projectStats.isOvertime ? (
              <span className="text-xs font-medium text-red-600">
                {project.projectType === ProjectType.INTERNAL 
                  ? 'Internal hours exceeded'
                  : 'Exceeded allocation'
                }
              </span>
            ) : (
              <>
                <span className="text-xs font-medium text-gray-600">
                  {project.projectType === ProjectType.INTERNAL ? 'Shared remaining:' : 'Remaining:'}
                </span>
                <span className="ml-1 text-xs text-gray-700">{projectStats.remainingHours.toFixed(1)} hrs</span>
              </>
            )}
          </div>
          <button 
            onClick={onEditClick}
            className="text-sm text-gray-700 hover:text-gray-900 font-medium cursor-pointer transition-colors"
          >
            Edit Project
          </button>
        </div>
      </div>
    </div>
  );
} 