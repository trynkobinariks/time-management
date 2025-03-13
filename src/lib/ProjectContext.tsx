'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DailyLimit, Project, TimeEntry, WeeklyLimit, WeeklySummary } from './types';
import { generateWeeklySummary, getWeekStartDate, generateRandomColor } from './utils';

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

export function ProjectProvider({ children }: ProjectProviderProps) {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [dailyLimits, setDailyLimits] = useState<DailyLimit[]>([]);
  const [weeklyLimits, setWeeklyLimits] = useState<WeeklyLimit[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekSummary, setCurrentWeekSummary] = useState<WeeklySummary | null>(null);

  // Remove mock data loading
  // Instead, initialize with default weekly limit
  useEffect(() => {
    const weekStart = getWeekStartDate(new Date());
    const now = new Date();
    
    // Set default weekly limit of 40 hours
    setWeeklyLimits([{
      id: uuidv4(),
      weekStartDate: weekStart,
      maxHours: 40,
      createdAt: now,
      updatedAt: now,
    }]);
    
    // Set default daily limit of 8 hours for today
    setDailyLimits([{
      id: uuidv4(),
      date: new Date(now.setHours(0, 0, 0, 0)),
      maxHours: 8,
      createdAt: now,
      updatedAt: now,
    }]);
  }, []);

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
      color: projectData.color || generateRandomColor(),
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