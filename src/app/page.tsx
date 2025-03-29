'use client';

import { useState, useEffect } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { useWelcomeContext } from '@/lib/WelcomeContext';
import TimeEntryForm from '@/components/TimeEntryForm';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { TimeEntry } from '@/lib/types';

export default function Dashboard() {
  const { projects, timeEntries, selectedDate, setSelectedDate, deleteTimeEntry } = useProjectContext();
  const { setShowWelcomePopup } = useWelcomeContext();
  const [showAddTimeEntry, setShowAddTimeEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setShowAddTimeEntry(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        await deleteTimeEntry(entryId);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          {/* Calendar Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Today
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
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

          {/* Log Time Button */}
          <button
            onClick={() => setShowAddTimeEntry(true)}
            className="w-16 h-16 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            aria-label="Log time"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Time Entries List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>

          {selectedDateEntries.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No time entries for this day
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Table Header */}
              <div className="px-6 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                    #
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Project
                  </span>
                </div>

                <div className="flex-1 mx-8">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Hours
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 text-center">
                    Actions
                  </span>
                </div>
              </div>

              {/* Table Body */}
              {selectedDateEntries.map((entry, index) => (
                <div key={entry.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getProjectName(entry.project_id)}
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 mx-8">
                    {entry.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {entry.hours} {entry.hours === 1 ? 'hour' : 'hours'}
                    </span>
                    <div className="flex space-x-2 w-16 justify-center">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                        aria-label="Edit entry"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                        aria-label="Delete entry"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total Hours */}
              <div className="px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-4">
                  <span className="w-8"></span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Total Hours
                  </span>
                </div>

                <div className="flex-1 mx-8"></div>

                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedDateEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)} hours
                  </span>
                  <span className="w-16"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddTimeEntry && (
        <TimeEntryForm
          onSuccess={() => {
            setShowAddTimeEntry(false);
            setEditingEntry(null);
          }}
          onCancel={() => {
            setShowAddTimeEntry(false);
            setEditingEntry(null);
          }}
          editingEntry={editingEntry}
        />
      )}
    </div>
  );
}

