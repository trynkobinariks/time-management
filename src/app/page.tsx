'use client';

import { useEffect } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { useWelcomeContext } from '@/lib/WelcomeContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import VoiceTimeEntry from '@/components/VoiceTimeEntry';

export default function Dashboard() {
  const { projects, timeEntries, selectedDate, setSelectedDate, deleteTimeEntry } = useProjectContext();
  const { setShowWelcomePopup } = useWelcomeContext();

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800 dark:text-white">Time Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
              >
                Today
              </button>
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
                    className={`cursor-pointer
                      h-10 w-10 rounded-full flex items-center justify-center text-sm relative
                      ${isSameDay(day, selectedDate)
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : isToday(day)
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : isCurrentMonth
                            ? 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                            : 'text-gray-400 dark:text-gray-500'
                      }
                      ${hasEntries ? `after:content-[''] after:absolute after:bottom-1 after:w-1.5 after:h-1.5 after:rounded-full ${isSameDay(day, selectedDate) ? 'bg-white dark:bg-gray-300' : 'bg-gray-700 dark:bg-gray-500'}` : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Voice Entry Section */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg text-center font-medium text-gray-900 dark:text-white mb-4">
              Quick Time Entry
            </h2>
            <VoiceTimeEntry />
          </div>
        </div>

        {/* Time Entries List */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h2>
            </div>

            {selectedDateEntries.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No time entries for this date
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {selectedDateEntries.map(entry => (
                  <div key={entry.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {getProjectName(entry.project_id)}
                        </h3>
                        {entry.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                        </span>
                        <button
                          onClick={() => deleteTimeEntry(entry.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer transition-colors"
                          aria-label="Delete entry"
                          title="Delete entry"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className="w-8"></span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Total Hours
                    </span>
                  </div>

                  <div className="flex-1 mx-8"></div>

                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedDateEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)} hours
                    </span>
                    <span className="w-16"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

