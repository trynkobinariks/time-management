import React from 'react';
import {
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { TimeEntry } from '../../../../../lib/types';

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
  const goToPreviousMonth = () => {
    const prevMonth = subMonths(selectedDate, 1);
    setSelectedDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    setSelectedDate(nextMonth);
  };

  return (
    <div className="w-full">
      <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 rounded-full hover:bg-[var(--card-border)] transition-colors cursor-pointer"
              aria-label={t('common.previous_month')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--text-primary)]"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">
              {getMonthTranslation(selectedDate)} {format(selectedDate, 'yyyy')}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-full hover:bg-[var(--card-border)] transition-colors cursor-pointer"
              aria-label={t('common.next_month')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--text-primary)]"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-1 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--card-border)] rounded-md transition-colors cursor-pointer"
          >
            {t('common.today')}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-1 md:aspect-square">
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
              className="text-center text-[10px] sm:text-xs md:text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center h-6 sm:h-8 md:h-auto"
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
                      h-8 w-8 sm:h-9 sm:w-9 md:h-auto md:w-auto md:aspect-square flex items-center justify-center text-[10px] sm:text-xl relative
                      rounded-full 
                      ${
                        isSameDay(day, selectedDate)
                          ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                          : isToday(day)
                            ? 'bg-[var(--today-bg)] text-[var(--today-text)] hover:bg-[var(--today-hover)]'
                            : isCurrentMonth
                              ? hasEntries
                                ? 'bg-[var(--entry-bg)] text-[var(--entry-text)] hover:bg-[var(--entry-hover)]'
                                : 'text-[var(--text-primary)] hover:bg-[var(--day-hover)] hover:text-[var(--day-hover-text)]'
                              : hasEntries
                                ? 'bg-[var(--entry-bg-muted)] text-[var(--entry-text-muted)] hover:bg-[var(--entry-hover-muted)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--day-hover-muted)] hover:text-[var(--day-hover-text)]'
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
