'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, TimeEntry } from './types';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import * as db from './db';

interface ProjectContextType {
  projects: Project[];
  timeEntries: TimeEntry[];
  selectedDate: Date;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateTimeEntry: (entry: TimeEntry) => Promise<void>;
  deleteTimeEntry: (entryId: string) => Promise<void>;
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
  children: React.ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Get and subscribe to auth state
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Load initial data
  useEffect(() => {
    if (!user) return;

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();

    const loadData = async () => {
      try {
        // Load projects
        const projectsData = await db.getProjects(user.id);
        setProjects(projectsData);

        // Load time entries for the entire month
        const monthStart = new Date(selectedYear, selectedMonth, 1);
        const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

        const timeEntriesData = await db.getTimeEntries(user.id, monthStart, monthEnd);
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

  const value = {
    projects,
    timeEntries,
    selectedDate,
    addProject,
    updateProject,
    deleteProject,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    setSelectedDate,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
} 
