'use client';

import { useState, useEffect } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { useWelcomeContext } from '@/lib/WelcomeContext';
import TimeEntryForm from '@/components/TimeEntryForm';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';

export default function Dashboard() {
  const { projects, timeEntries, selectedDate, setSelectedDate } = useProjectContext();
  const { setShowWelcomePopup } = useWelcomeContext();
  const [showAddTimeEntry, setShowAddTimeEntry] = useState(false);
  
  // Get current month's days
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Filter time entries for selected date
  const selectedDateEntries = timeEntries.filter(entry => 
    isSameDay(new Date(entry.date), selectedDate)
  );
  
  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };
  
  // Check for login flag when dashboard loads
  useEffect(() => {
    try {
      const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
      const welcomeTimestamp = localStorage.getItem('showWelcome');
      
      if (justLoggedIn || welcomeTimestamp) {
        sessionStorage.removeItem('justLoggedIn');
        if (welcomeTimestamp) localStorage.removeItem('showWelcome');
        setShowWelcomePopup(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [setShowWelcomePopup]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Today
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const hasEntries = timeEntries.some(entry => 
                  isSameDay(new Date(entry.date), day)
                );
                
                const isCurrentMonth = isSameMonth(day, selectedDate);
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-sm
                      ${isSameDay(day, selectedDate) 
                        ? 'bg-gray-900 text-white' 
                        : isToday(day)
                          ? 'bg-gray-100 text-gray-900'
                          : isCurrentMonth
                            ? 'text-gray-900 hover:bg-gray-100'
                            : 'text-gray-400'
                      }
                      ${hasEntries ? 'ring-2 ring-gray-900 ring-offset-2' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Log Time Button */}
          <button
            onClick={() => setShowAddTimeEntry(true)}
            className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Log time"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Time Entries List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          
          {selectedDateEntries.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No time entries for this day
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {selectedDateEntries.map((entry, index) => (
                <div key={entry.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500 w-8">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {getProjectName(entry.project_id)}
                      </h3>
                      {entry.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Time Entry Modal */}
      {showAddTimeEntry && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Log Time
              </h2>
              <button 
                onClick={() => setShowAddTimeEntry(false)}
                className="text-gray-400 hover:text-gray-500"
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
