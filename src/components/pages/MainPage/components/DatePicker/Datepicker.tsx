import React from 'react';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { TimeEntry } from '@/lib/types';

interface DatepickerProps {
  getMonthTranslation: (date: Date) => string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  days: Date[];
  timeEntries: TimeEntry[];
  t: (key: string) => string;
}

const Datepicker = ({
  getMonthTranslation,
  selectedDate,
  setSelectedDate,
  days,
  timeEntries,
  t,
}: DatepickerProps) => {
  return (
    <div className="w-full">
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
          {[
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ].map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-[var(--text-secondary)] mb-2"
            >
              {t(`common.calendar.days.${day}`)}
            </div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const hasEntries = timeEntries.some(entry =>
              isSameDay(new Date(entry.date), day),
            );

            const isCurrentMonth = isSameMonth(day, selectedDate);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`cursor-pointer
                      h-10 w-10 rounded-full flex items-center justify-center text-sm relative
                      ${
                        isSameDay(day, selectedDate)
                          ? 'bg-violet-600 text-white hover:bg-violet-700'
                          : isToday(day)
                            ? hasEntries
                              ? 'bg-slate-600 text-white hover:bg-slate-700'
                              : 'bg-slate-400 text-black hover:bg-slate-500'
                            : isCurrentMonth
                              ? hasEntries
                                ? 'bg-gray-500 text-white hover:bg-gray-600'
                                : 'text-[var(--text-primary)] hover:bg-gray-700 hover:text-white'
                              : hasEntries
                                ? 'bg-slate-500 text-white hover:bg-slate-600'
                                : 'text-[var(--text-secondary)] hover:bg-gray-700 hover:text-white'
                      }
                      ${
                        hasEntries
                          ? `after:content-[''] after:absolute after:bottom-1 after:w-1.5 after:h-1.5 after:rounded-full ${
                              isSameDay(day, selectedDate)
                                ? 'after:bg-white'
                                : 'after:bg-slate-200'
                            }`
                          : ''
                      }
                    `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Datepicker;