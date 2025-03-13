// Project Types
export enum ProjectType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  weekly_hours_allocation: number;
  color?: string;
  project_type: ProjectType;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  date: string;
  hours: number;
  created_at: string;
  updated_at: string;
}

export interface DailyLimit {
  id: string;
  user_id: string;
  date: string;
  max_hours: number;
  created_at: string;
  updated_at: string;
}

export interface WeeklyLimit {
  id: string;
  user_id: string;
  week_start_date: string;
  max_hours: number;
  created_at: string;
  updated_at: string;
}

// Helper type for project with time entries
export interface ProjectWithTimeEntries extends Project {
  timeEntries: TimeEntry[];
  totalHoursWorked: number;
  remainingHours: number;
}

// Helper type for daily summary
export interface DailySummary {
  date: Date;
  totalHoursWorked: number;
  maxHours: number;
  remainingHours: number;
  entries: TimeEntry[];
}

// Helper type for weekly summary
export interface WeeklySummary {
  weekStartDate: Date;
  weekEndDate: Date;
  totalHoursWorked: number;
  maxHours: number;
  remainingHours: number;
  dailySummaries: DailySummary[];
  projectSummaries: ProjectWithTimeEntries[];
}

export interface UserSettings {
  user_id: string;
  internal_hours_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
} 