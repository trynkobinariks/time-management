'use client';

import React, { useState } from 'react';
import { ProjectWithTimeEntries } from '@/lib/types';
import TimeEntryForm from './TimeEntryForm';

interface ProjectCardProps {
  project: ProjectWithTimeEntries;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showAddTimeEntry, setShowAddTimeEntry] = useState(false);
  
  const percentComplete = Math.min(
    100,
    Math.round((project.totalHoursWorked / project.weeklyHoursAllocation) * 100)
  );
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div 
          className="h-2" 
          style={{ backgroundColor: project.color }}
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${project.color}20`, 
                color: project.color 
              }}
            >
              {project.weeklyHoursAllocation} hrs/week
            </span>
          </div>
          
          {project.description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
          )}
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Weekly Progress</span>
              <span className="text-gray-500">
                {project.totalHoursWorked} / {project.weeklyHoursAllocation} hrs
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${percentComplete}%`,
                  backgroundColor: project.color
                }}
              />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">Remaining:</span>
              <span className="ml-1 text-sm text-gray-500">{project.remainingHours} hrs</span>
            </div>
            <button 
              onClick={() => setShowAddTimeEntry(true)}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Add Time
            </button>
          </div>
        </div>
      </div>
      
      {showAddTimeEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Time for {project.name}
            </h2>
            <TimeEntryForm 
              projectId={project.id}
              onSuccess={() => setShowAddTimeEntry(false)}
              onCancel={() => setShowAddTimeEntry(false)}
            />
          </div>
        </div>
      )}
    </>
  );
} 