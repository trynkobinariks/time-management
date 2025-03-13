'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DailyLimit, Project, TimeEntry, WeeklyLimit, WeeklySummary } from './types';
import { generateWeeklySummary, getWeekStartDate } from './utils';

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'hours-tracker-projects',
  TIME_ENTRIES: 'hours-tracker-time-entries',
  DAILY_LIMITS: 'hours-tracker-daily-limits',
  WEEKLY_LIMITS: 'hours-tracker-weekly-limits',
};

// Project color palette - modern, accessible colors
const PROJECT_COLORS = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
  '#A855F7', // Purple
  '#06B6D4', // Cyan
];

// Function to get a color based on the project index
function getProjectColor(index: number): string {
  return PROJECT_COLORS[index % PROJECT_COLORS.length];
}

interface ProjectContextType {
  // Data
  projects: Project[];
  timeEntries: TimeEntry[];
  dailyLimits: DailyLimit[];
  weeklyLimits: WeeklyLimit[];
  currentWeekSummary: WeeklySummary | null;
  selectedDate: Date;
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (entryId: string) => void;
  setDailyLimit: (date: Date, maxHours: number) => void;
  setWeeklyLimit: (weekStartDate: Date, maxHours: number) => void;
  setSelectedDate: (date: Date) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}

interface ProjectProviderProps {
  children: ReactNode;
}

// Helper function to safely parse JSON from localStorage
function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return defaultValue;
    
    const parsedData = JSON.parse(storedData);
    
    // Convert date strings back to Date objects
    if (Array.isArray(parsedData)) {
      return parsedData.map((item) => {
        if (item.date) {
          item.date = new Date(item.date);
        }
        if (item.weekStartDate) {
          item.weekStartDate = new Date(item.weekStartDate);
        }
        if (item.createdAt) {
          item.createdAt = new Date(item.createdAt);
        }
        if (item.updatedAt) {
          item.updatedAt = new Date(item.updatedAt);
        }
        return item;
      }) as T;
    }
    
    return parsedData;
  } catch (error) {
    console.error(`Error loading data from localStorage (${key}):`, error);
    return defaultValue;
  }
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  // State with localStorage persistence
  const [projects, setProjects] = useState<Project[]>(() => 
    getStoredData<Project[]>(STORAGE_KEYS.PROJECTS, [])
  );
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => 
    getStoredData<TimeEntry[]>(STORAGE_KEYS.TIME_ENTRIES, [])
  );
  
  const [dailyLimits, setDailyLimits] = useState<DailyLimit[]>(() => 
    getStoredData<DailyLimit[]>(STORAGE_KEYS.DAILY_LIMITS, [])
  );
  
  const [weeklyLimits, setWeeklyLimits] = useState<WeeklyLimit[]>(() => 
    getStoredData<WeeklyLimit[]>(STORAGE_KEYS.WEEKLY_LIMITS, [])
  );
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekSummary, setCurrentWeekSummary] = useState<WeeklySummary | null>(null);

  // Initialize default limits if none exist
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const weekStart = getWeekStartDate(new Date());
    const now = new Date();
    
    // Set default weekly limit of 40 hours if none exists
    if (weeklyLimits.length === 0) {
      const defaultWeeklyLimit: WeeklyLimit = {
        id: uuidv4(),
        weekStartDate: weekStart,
        maxHours: 40,
        createdAt: now,
        updatedAt: now,
      };
      
      setWeeklyLimits([defaultWeeklyLimit]);
    }
    
    // Set default daily limit of 8 hours for today if none exists
    if (dailyLimits.length === 0) {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      
      const defaultDailyLimit: DailyLimit = {
        id: uuidv4(),
        date: today,
        maxHours: 8,
        createdAt: now,
        updatedAt: now,
      };
      
      setDailyLimits([defaultDailyLimit]);
    }
  }, [dailyLimits.length, weeklyLimits.length]);

  // Persist data to localStorage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  }, [timeEntries]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DAILY_LIMITS, JSON.stringify(dailyLimits));
  }, [dailyLimits]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WEEKLY_LIMITS, JSON.stringify(weeklyLimits));
  }, [weeklyLimits]);

  // Update weekly summary when data changes
  useEffect(() => {
    if (projects.length > 0 || timeEntries.length > 0) {
      const weekStartDate = getWeekStartDate(selectedDate);
      const weeklyLimit = weeklyLimits.find(
        limit => limit.weekStartDate.toDateString() === weekStartDate.toDateString()
      );
      
      const summary = generateWeeklySummary(
        projects,
        timeEntries,
        weekStartDate,
        weeklyLimit?.maxHours || 40
      );
      
      setCurrentWeekSummary(summary);
    } else if (projects.length === 0 && timeEntries.length === 0) {
      // Create an empty summary when no data exists
      const weekStartDate = getWeekStartDate(selectedDate);
      const weeklyLimit = weeklyLimits.find(
        limit => limit.weekStartDate.toDateString() === weekStartDate.toDateString()
      );
      
      const summary = generateWeeklySummary(
        [],
        [],
        weekStartDate,
        weeklyLimit?.maxHours || 40
      );
      
      setCurrentWeekSummary(summary);
    }
  }, [projects, timeEntries, dailyLimits, weeklyLimits, selectedDate]);

  // Project actions
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newProject: Project = {
      ...projectData,
      id: uuidv4(),
      color: getProjectColor(projects.length),
      createdAt: now,
      updatedAt: now,
    };
    
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id 
          ? { ...updatedProject, updatedAt: new Date() } 
          : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    // Also delete associated time entries
    setTimeEntries(prev => prev.filter(entry => entry.projectId !== projectId));
  };

  // Time entry actions
  const addTimeEntry = (entryData: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newEntry: TimeEntry = {
      ...entryData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
  };

  const updateTimeEntry = (updatedEntry: TimeEntry) => {
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === updatedEntry.id 
          ? { ...updatedEntry, updatedAt: new Date() } 
          : entry
      )
    );
  };

  const deleteTimeEntry = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  // Limit actions
  const setDailyLimit = (date: Date, maxHours: number) => {
    const existingLimitIndex = dailyLimits.findIndex(
      limit => limit.date.toDateString() === date.toDateString()
    );
    
    if (existingLimitIndex >= 0) {
      // Update existing limit
      const updatedLimits = [...dailyLimits];
      updatedLimits[existingLimitIndex] = {
        ...updatedLimits[existingLimitIndex],
        maxHours,
        updatedAt: new Date(),
      };
      setDailyLimits(updatedLimits);
    } else {
      // Create new limit
      const now = new Date();
      const newLimit: DailyLimit = {
        id: uuidv4(),
        date,
        maxHours,
        createdAt: now,
        updatedAt: now,
      };
      setDailyLimits(prev => [...prev, newLimit]);
    }
  };

  const setWeeklyLimit = (weekStartDate: Date, maxHours: number) => {
    const existingLimitIndex = weeklyLimits.findIndex(
      limit => limit.weekStartDate.toDateString() === weekStartDate.toDateString()
    );
    
    if (existingLimitIndex >= 0) {
      // Update existing limit
      const updatedLimits = [...weeklyLimits];
      updatedLimits[existingLimitIndex] = {
        ...updatedLimits[existingLimitIndex],
        maxHours,
        updatedAt: new Date(),
      };
      setWeeklyLimits(updatedLimits);
    } else {
      // Create new limit
      const now = new Date();
      const newLimit: WeeklyLimit = {
        id: uuidv4(),
        weekStartDate,
        maxHours,
        createdAt: now,
        updatedAt: now,
      };
      setWeeklyLimits(prev => [...prev, newLimit]);
    }
  };

  const value = {
    // Data
    projects,
    timeEntries,
    dailyLimits,
    weeklyLimits,
    currentWeekSummary,
    selectedDate,
    
    // Actions
    addProject,
    updateProject,
    deleteProject,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    setDailyLimit,
    setWeeklyLimit,
    setSelectedDate,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
} 