'use client';

import { useEffect } from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useWelcomeContext } from '@/contexts/WelcomeContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import VoiceTimeEntry from '@/components/VoiceTimeEntry';
import TimeEntriesList from '@/components/TimeEntriesList';
import { useClientTranslation } from '../hooks/useClientTranslation';

export default function Dashboard() {
  const { projects, timeEntries, selectedDate, setSelectedDate, deleteTimeEntry, updateTimeEntry } = useProjectContext();
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

  // Get month name translation
  const getMonthTranslation = (date: Date) => {
    const monthKey = format(date, 'MMMM').toLowerCase();
    return t(`common.calendar.months.${monthKey}`);
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
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-[var(--text-primary)] text-center w-full lg:text-left lg:w-auto">{t('welcome.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-4">
          <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[var(--text-primary)]">
                {getMonthTranslation(selectedDate)} {format(selectedDate, 'yyyy')}
              </h2>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--card-border)] rounded-md transition-colors cursor-pointer"
              >
                {t('common.today')}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Day names row */}
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
                  {t(`common.calendar.days.${day}`)}
                </div>
              ))}
              
              {/* Calendar days */}
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
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isToday(day)
                          ? hasEntries
                            ? 'bg-[var(--text-primary)] text-[var(--background)] hover:bg-[var(--text-primary)]'
                            : 'bg-[var(--card-border)] text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                          : isCurrentMonth
                            ? hasEntries
                              ? 'bg-[var(--text-primary)] text-[var(--background)] hover:bg-[var(--text-primary)]'
                              : 'text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                            : hasEntries
                              ? 'bg-[var(--text-primary)] text-[var(--background)] hover:bg-[var(--text-primary)]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--card-border)]'
                      }
                      ${hasEntries ? `after:content-[''] after:absolute after:bottom-1 after:w-1.5 after:h-1.5 after:rounded-full ${
                        isSameDay(day, selectedDate) 
                          ? 'bg-green-700 text-white' 
                          : 'bg-[var(--background)]'
                      }` : ''}
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
          <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6">
            <h2 className="text-lg text-center font-medium text-[var(--text-primary)] mb-4">
              {t('timeEntries.quickTimeEntry')}
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
            onEditEntry={updateTimeEntry}
          />
        </div>
      </div>
    </div>
  );
}