import { supabase } from './supabase';
import { Project, TimeEntry } from './types';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserSettings(userId: string, settings: { internal_hours_limit: number }) {
  const { error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createProject(userId: string, project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(userId: string, projectId: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', projectId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(userId: string, projectId: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getTimeEntries(userId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTimeEntry(userId: string, entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data, error } = await supabase
    .from('time_entries')
    .insert([{ ...entry, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTimeEntry(userId: string, entryId: string, entry: Partial<TimeEntry>) {
  const { data, error } = await supabase
    .from('time_entries')
    .update(entry)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTimeEntry(userId: string, entryId: string) {
  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getWeeklyLimits(userId: string, startDate: Date) {
  const { data, error } = await supabase
    .from('weekly_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', startDate.toISOString().split('T')[0])
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
}

export async function setWeeklyLimit(userId: string, weekStartDate: Date, maxHours: number) {
  const { data, error } = await supabase
    .from('weekly_limits')
    .upsert([{
      user_id: userId,
      week_start_date: weekStartDate.toISOString().split('T')[0],
      max_hours: maxHours
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDailyLimits(userId: string, date: Date) {
  const { data, error } = await supabase
    .from('daily_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date.toISOString().split('T')[0])
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
}

export async function setDailyLimit(userId: string, date: Date, maxHours: number) {
  const { data, error } = await supabase
    .from('daily_limits')
    .upsert([{
      user_id: userId,
      date: date.toISOString().split('T')[0],
      max_hours: maxHours
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
} 