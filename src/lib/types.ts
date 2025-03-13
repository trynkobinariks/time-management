// Project Types
export enum ProjectType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
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
  description: string | null;
  weekly_hours_allocation: number; // NUMERIC(5,2)
  color: string | null;
  project_type: ProjectType;
}

export interface TimeEntry extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  project_id: string; // UUID, references projects(id)
  date: string; // DATE in YYYY-MM-DD format
  hours: number; // NUMERIC(5,2)
}

export interface DailyLimit extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  date: string; // DATE in YYYY-MM-DD format
  max_hours: number; // NUMERIC(5,2)
}

export interface WeeklyLimit extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  week_start_date: string; // DATE in YYYY-MM-DD format
  max_hours: number; // NUMERIC(5,2)
}

export interface UserSettings extends BaseModel {
  user_id: string; // UUID, references auth.users(id)
  internal_hours_limit: number; // NUMERIC(5,2)
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