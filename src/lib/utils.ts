import { DailySummary, Project, ProjectWithTimeEntries, TimeEntry, WeeklySummary } from './types';

// Get the start of the week (Monday) for a given date
export function getWeekStartDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Get the end of the week (Sunday) for a given date
export function getWeekEndDate(date: Date): Date {
  const weekStart = getWeekStartDate(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date as readable string (e.g., "Mon, Jan 1")
export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Get an array of dates for the week containing the given date
export function getWeekDates(date: Date): Date[] {
  const weekStart = getWeekStartDate(date);
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(d);
  }
  
  return dates;
}

// Calculate total hours worked for a project in a given time period
export function calculateProjectHours(
  project: Project,
  timeEntries: TimeEntry[],
  startDate?: Date,
  endDate?: Date
): number {
  const filteredEntries = timeEntries.filter(entry => {
    if (entry.project_id !== project.id) return false;
    const entryDate = new Date(entry.date);
    if (startDate && entryDate < startDate) return false;
    if (endDate && entryDate > endDate) return false;
    return true;
  });
  
  return filteredEntries.reduce((total, entry) => total + entry.hours, 0);
}

// Calculate remaining hours for a project based on its allocation
export function calculateRemainingHours(
  project: Project,
  hoursWorked: number
): number {
  return Math.max(0, project.weekly_hours_allocation - hoursWorked);
}

// Generate a weekly summary from projects and time entries
export function generateWeeklySummary(
  projects: Project[],
  timeEntries: TimeEntry[],
  weekStartDate: Date,
  weeklyMaxHours: number = 40
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
    const dayEntries = weekEntries.filter(entry => 
      formatDate(new Date(entry.date)) === formatDate(date)
    );
    
    const totalHoursWorked = dayEntries.reduce((total, entry) => total + entry.hours, 0);
    const maxHours = 8; // Default daily limit
    
    return {
      date,
      totalHoursWorked,
      maxHours,
      remainingHours: Math.max(0, maxHours - totalHoursWorked),
      entries: dayEntries
    };
  });
  
  // Calculate project summaries
  const projectSummaries: ProjectWithTimeEntries[] = projects.map(project => {
    const projectEntries = weekEntries.filter(entry => entry.project_id === project.id);
    const totalHoursWorked = projectEntries.reduce((total, entry) => total + entry.hours, 0);
    
    return {
      ...project,
      timeEntries: projectEntries,
      totalHoursWorked,
      remainingHours: calculateRemainingHours(project, totalHoursWorked)
    };
  });
  
  // Calculate total hours worked for the week
  const totalHoursWorked = weekEntries.reduce((total, entry) => total + entry.hours, 0);
  
  return {
    weekStartDate,
    weekEndDate,
    totalHoursWorked,
    maxHours: weeklyMaxHours,
    remainingHours: Math.max(0, weeklyMaxHours - totalHoursWorked),
    dailySummaries,
    projectSummaries
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