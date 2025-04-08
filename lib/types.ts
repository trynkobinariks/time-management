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
  description?: string;
  color?: string;
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
