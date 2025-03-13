'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, TimeEntry } from './types';
import { useAuth } from './AuthContext';
import * as db from './db';

interface ProjectContextType {
  projects: Project[];
  timeEntries: TimeEntry[];
  selectedDate: Date;
  internalHoursLimit: number;
  dailyLimits: { date: Date; maxHours: number }[];
  weeklyLimits: { weekStartDate: Date; maxHours: number }[];
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateTimeEntry: (entry: TimeEntry) => Promise<void>;
  deleteTimeEntry: (entryId: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  setInternalHoursLimit: (limit: number) => Promise<void>;
  getInternalHoursUsed: (weekStartDate: Date) => number;
  setDailyLimit: (date: Date, maxHours: number) => Promise<void>;
  setWeeklyLimit: (weekStartDate: Date, maxHours: number) => Promise<void>;
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
  children: React.ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [internalHoursLimit, setInternalHoursLimit] = useState(20);
  const [dailyLimits, setDailyLimits] = useState<{ date: Date; maxHours: number }[]>([]);
  const [weeklyLimits, setWeeklyLimits] = useState<{ weekStartDate: Date; maxHours: number }[]>([]);
  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Load user settings
        const settings = await db.getUserSettings(user.id);
        if (settings) {
          setInternalHoursLimit(settings.internal_hours_limit);
        }

        // Load projects
        const projectsData = await db.getProjects(user.id);
        setProjects(projectsData);

        // Load time entries for the current week
        const startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of week

        const timeEntriesData = await db.getTimeEntries(user.id, startDate, endDate);
        setTimeEntries(timeEntriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user, selectedDate]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const newProject = await db.createProject(user.id, project);
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (project: Project) => {
    if (!user) return;

    try {
      const updatedProject = await db.updateProject(user.id, project.id, project);
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) return;

    try {
      await db.deleteProject(user.id, projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setTimeEntries(timeEntries.filter(t => t.project_id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const addTimeEntry = async (entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const newEntry = await db.createTimeEntry(user.id, entry);
      setTimeEntries([...timeEntries, newEntry]);
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  };

  const updateTimeEntry = async (entry: TimeEntry) => {
    if (!user) return;

    try {
      const updatedEntry = await db.updateTimeEntry(user.id, entry.id, entry);
      setTimeEntries(timeEntries.map(t => t.id === entry.id ? updatedEntry : t));
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  };

  const deleteTimeEntry = async (entryId: string) => {
    if (!user) return;

    try {
      await db.deleteTimeEntry(user.id, entryId);
      setTimeEntries(timeEntries.filter(t => t.id !== entryId));
    } catch (error) {
      console.error('Error deleting time entry:', error);
      throw error;
    }
  };

  const updateInternalHoursLimit = async (limit: number) => {
    if (!user) return;

    try {
      await db.updateUserSettings(user.id, { internal_hours_limit: limit });
      setInternalHoursLimit(limit);
    } catch (error) {
      console.error('Error updating internal hours limit:', error);
      throw error;
    }
  };

  const value = {
    projects,
    timeEntries,
    selectedDate,
    internalHoursLimit,
    dailyLimits,
    weeklyLimits,
    addProject,
    updateProject,
    deleteProject,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    setSelectedDate,
    setInternalHoursLimit: updateInternalHoursLimit,
    getInternalHoursUsed: (weekStartDate: Date) => {
      const weekEnd = new Date(weekStartDate);
      weekEnd.setDate(weekStartDate.getDate() + 6);
      return timeEntries
        .filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= weekStartDate && entryDate <= weekEnd;
        })
        .reduce((sum, entry) => sum + entry.hours, 0);
    },
    setDailyLimit: async (date: Date, maxHours: number) => {
      if (!user) return;
      await db.setDailyLimit(user.id, date, maxHours);
      const newLimit = { date, maxHours };
      setDailyLimits(prev => [...prev.filter(l => l.date.toDateString() !== date.toDateString()), newLimit]);
    },
    setWeeklyLimit: async (weekStartDate: Date, maxHours: number) => {
      if (!user) return;
      await db.setWeeklyLimit(user.id, weekStartDate, maxHours);
      const newLimit = { weekStartDate, maxHours };
      setWeeklyLimits(prev => [...prev.filter(l => l.weekStartDate.toDateString() !== weekStartDate.toDateString()), newLimit]);
    },
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
} 