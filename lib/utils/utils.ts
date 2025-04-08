import { DailySummary, Project, TimeEntry, WeeklySummary } from '../types';

// Get the start of the week (Monday) for a given date
export function getWeekStartDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Get the end of the week (Sunday) for a given date
export function getWeekEndDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Get all dates in a week
export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

// Format a date to a readable string
export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format a date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Add days to a date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Generate a weekly summary from projects and time entries
export function generateWeeklySummary(
  projects: Project[],
  timeEntries: TimeEntry[],
  weekStartDate: Date,
): WeeklySummary {
  const weekEndDate = getWeekEndDate(weekStartDate);
  const weekDates = getWeekDates(weekStartDate);

  // Filter entries for the current week
  const weekEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStartDate && entryDate <= weekEndDate;
  });

  // Calculate daily summaries
  const dailySummaries: DailySummary[] = weekDates.map(date => {
    const dayEntries = weekEntries.filter(
      entry => formatDate(new Date(entry.date)) === formatDate(date),
    );

    const totalHoursWorked = dayEntries.reduce(
      (total, entry) => total + entry.hours,
      0,
    );

    return {
      date,
      totalHoursWorked,
      entries: dayEntries,
    };
  });

  // Calculate total hours worked for the week
  const totalHoursWorked = weekEntries.reduce(
    (total, entry) => total + entry.hours,
    0,
  );

  return {
    weekStartDate,
    weekEndDate,
    totalHoursWorked,
    dailySummaries,
  };
}

// Generate a random color for projects
export function generateRandomColor(): string {
  const colors = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#8B5CF6', // Purple
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}
