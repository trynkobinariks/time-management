'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, TimeEntry, ProjectType } from '../lib/types';
import { createClient } from '../lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import * as db from '../lib/supabase/db';
import { usePathname, useSearchParams } from 'next/navigation';
import { startOfWeek, endOfWeek } from 'date-fns';

interface ProjectContextType {
  projects: Project[];
  timeEntries: TimeEntry[];
  selectedDate: Date;
  addProject: (
    project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTimeEntry: (
    entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => Promise<void>;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const supabase = createClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error refreshing user data on navigation:', error);
      }
    };
    fetchUserData();
  }, [pathname, searchParams, supabase.auth]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error getting session:', error);
        setIsInitialized(true);
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (!user || !isInitialized) return;

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();

    const loadData = async () => {
      try {
        const projectsData = await db.getProjects(user.id);
        setProjects(
          projectsData.map(p => ({
            ...p,
            type: p.type as ProjectType,
          })),
        );

        const monthStart = new Date(selectedYear, selectedMonth, 1);
        const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const timeEntriesData = await db.getTimeEntries(
          user.id,
          calendarStart,
          calendarEnd,
        );
        setTimeEntries(timeEntriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user, selectedDate, isInitialized]);

  const addProject = async (
    project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    if (!user) return;

    try {
      const newProject = await db.createProject(user.id, project);
      setProjects([
        ...projects,
        { ...newProject, type: newProject.type as ProjectType },
      ]);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (project: Project) => {
    if (!user) return;

    try {
      const updatedProject = await db.updateProject(
        user.id,
        project.id,
        project,
      );
      setProjects(
        projects.map(p =>
          p.id === project.id
            ? { ...updatedProject, type: updatedProject.type as ProjectType }
            : p,
        ),
      );
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

  const addTimeEntry = async (
    entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
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
      setTimeEntries(
        timeEntries.map(t => (t.id === entry.id ? updatedEntry : t)),
      );
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
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}
