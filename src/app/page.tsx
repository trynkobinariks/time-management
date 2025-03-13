'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import WeekSelector from '@/components/WeekSelector';
import ProjectCard from '@/components/ProjectCard';
import DailyHoursChart from '@/components/DailyHoursChart';
import TimeEntryForm from '@/components/TimeEntryForm';
import Link from 'next/link';

export default function Dashboard() {
  const { currentWeekSummary, projects } = useProjectContext();
  const [showAddTimeEntry, setShowAddTimeEntry] = useState(false);
  
  if (!currentWeekSummary) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  
  // Check if there are no projects
  const noProjects = projects.length === 0;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track and manage your project hours
        </p>
      </div>
      
      <WeekSelector />
      
      {noProjects ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Project Hours Tracker!</h3>
          <p className="text-gray-600 mb-6">
            To get started, you need to create your first project.
          </p>
          <Link 
            href="/projects" 
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Weekly Summary</h2>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="ml-1 text-gray-900">{currentWeekSummary.totalHoursWorked} / {currentWeekSummary.maxHours} hrs</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="font-medium text-gray-700">Remaining:</span>
                  <span className="ml-1 text-gray-900">{currentWeekSummary.remainingHours} hrs</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="h-2.5 rounded-full bg-primary-500" 
                  style={{ 
                    width: `${Math.min(100, (currentWeekSummary.totalHoursWorked / currentWeekSummary.maxHours) * 100)}%` 
                  }}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddTimeEntry(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Add Time Entry
                </button>
              </div>
            </div>
            
            <DailyHoursChart dailySummaries={currentWeekSummary.dailySummaries} />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
            {currentWeekSummary.projectSummaries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-gray-600 mb-2">No projects yet</p>
                <Link 
                  href="/projects" 
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                >
                  Add a project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {currentWeekSummary.projectSummaries.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {showAddTimeEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Time Entry</h2>
            {noProjects ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">You need to create a project before you can add time entries.</p>
                <Link 
                  href="/projects" 
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setShowAddTimeEntry(false)}
                >
                  Create a Project
                </Link>
              </div>
            ) : (
              <TimeEntryForm 
                onSuccess={() => setShowAddTimeEntry(false)}
                onCancel={() => setShowAddTimeEntry(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
