'use client';

import { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import WeekSelector from '@/components/WeekSelector';
import DailyHoursChart from '@/components/DailyHoursChart';
import ProjectCard from '@/components/ProjectCard';
import TimeEntryForm from '@/components/TimeEntryForm';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

export default function Dashboard() {
  const { projects } = useProjectContext();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Week starts on Monday
  );
  const [showAddTimeEntry, setShowAddTimeEntry] = useState(false);
  
  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };
  
  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };
  
  const handleCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };
  
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Week of {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowAddTimeEntry(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
          >
            Log Time
          </button>
        </div>
      </div>
      
      <WeekSelector
        currentWeekStart={currentWeekStart}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onCurrentWeek={handleCurrentWeek}
      />
      
      <div className="mt-6">
        <DailyHoursChart weekStartDate={currentWeekStart} />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-md bg-white">
            <p className="text-gray-600 mb-4">You don&apos;t have any projects yet.</p>
            <a 
              href="/projects" 
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
            >
              Add Your First Project
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map(project => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEditClick={() => window.location.href = '/projects'}
              />
            ))}
            {projects.length > 3 && (
              <a 
                href="/projects" 
                className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                View All Projects
              </a>
            )}
          </div>
        )}
      </div>
      
      {showAddTimeEntry && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Log Time
              </h2>
              <button 
                onClick={() => setShowAddTimeEntry(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <TimeEntryForm 
              onSuccess={() => setShowAddTimeEntry(false)}
              onCancel={() => setShowAddTimeEntry(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
