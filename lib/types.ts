// Project Types
export enum ProjectType {
  INTERNAL = 'internal',
  COMMERCIAL = 'commercial',
}

export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends BaseModel {
  id: string; // UUID, references auth.users(id)
  email: string;
}

export interface Project extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  name: string;
  description?: string;
  color?: string;
  type: ProjectType;
}

export interface TimeEntry extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  project_id: string; // UUID, references projects(id)
  date: string; // DATE in YYYY-MM-DD format
  hours: number; // NUMERIC(5,2)
  description?: string; // Description of the task/work done
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
  entries: TimeEntry[];
}

// Helper type for weekly summary
export interface WeeklySummary {
  weekStartDate: Date;
  weekEndDate: Date;
  totalHoursWorked: number;
  dailySummaries: DailySummary[];
}

export interface UserSettings extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  working_hours_per_day: number; // Default: 8
  working_days_per_week: number; // Default: 5
  internal_hours_limit: number; // Default: 20
  commercial_hours_limit: number; // Default: 20
}
