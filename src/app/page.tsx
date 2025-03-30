'use client';

import { useEffect } from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useWelcomeContext } from '@/contexts/WelcomeContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import VoiceTimeEntry from '@/components/VoiceTimeEntry';
import TimeEntriesList from '@/components/TimeEntriesList';
import { useClientTranslation } from '../../hooks/useClientTranslation';
export default function Dashboard() {
  const { projects, timeEntries, selectedDate, setSelectedDate, deleteTimeEntry } = useProjectContext();
  const { setShowWelcomePopup } = useWelcomeContext();
  const { t } = useClientTranslation();
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
              {t('quickTimeEntry')}
            </h2>
            <VoiceTimeEntry />
          </div>
        </div>

        {/* Time Entries List */}
        <div className="lg:col-span-5">
          <TimeEntriesList
            selectedDate={selectedDate}
            timeEntries={selectedDateEntries}
            projects={projects}
            onDeleteEntry={deleteTimeEntry}
          />
        </div>
      </div>
    </div>
  );
}

