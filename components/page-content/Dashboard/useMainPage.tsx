import { useProjectContext } from '../../../contexts/ProjectContext';
import { useClientTranslation } from '../../../hooks/useClientTranslation';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

export const useMainPage = () => {
  const { t } = useClientTranslation();
  const {
    projects,
    timeEntries,
    selectedDate,
    setSelectedDate,
    deleteTimeEntry,
    updateTimeEntry,
    addTimeEntry,
  } = useProjectContext();

  // Get current month's days
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Filter time entries for selected date
  const selectedDateEntries = timeEntries.filter(entry =>
    isSameDay(new Date(entry.date), selectedDate),
  );

  // Get month name translation
  const getMonthTranslation = (date: Date) => {
    const monthKey = format(date, 'MMMM').toLowerCase();
    return t(`common.calendar.months.${monthKey}`);
  };

  return {
    projects,
    timeEntries,
    selectedDate,
    setSelectedDate,
    deleteTimeEntry,
    updateTimeEntry,
    addTimeEntry,
    days,
    selectedDateEntries,
    getMonthTranslation,
  };
};
