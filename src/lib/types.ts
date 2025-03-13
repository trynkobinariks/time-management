export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  weeklyHoursAllocation: number; // FTE allocation in hours per week
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  date: Date;
  hours: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyLimit {
  id: string;
  date: Date;
  maxHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyLimit {
  id: string;
  weekStartDate: Date;
  maxHours: number;
  createdAt: Date;
  updatedAt: Date;
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