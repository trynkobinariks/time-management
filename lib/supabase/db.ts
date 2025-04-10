import { Project, TimeEntry, UserSettings } from '../types';
import { createClient } from './client';

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getProjects(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProject(
  userId: string,
  project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(
  userId: string,
  projectId: string,
  project: Project,
) {
  const supabase = createClient();
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
  const supabase = createClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getTimeEntries(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const supabase = createClient();
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

export async function createTimeEntry(
  userId: string,
  entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('time_entries')
    .insert([{ ...entry, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTimeEntry(
  userId: string,
  entryId: string,
  entry: TimeEntry,
) {
  const supabase = createClient();
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
  const supabase = createClient();
  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getUserSettings(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows returned - it's not an error in this case
    throw error;
  }

  // If no settings exist, return default values
  if (!data) {
    return {
      user_id: userId,
      working_hours_per_day: 8,
      working_days_per_week: 5,
      internal_hours_limit: 20,
      commercial_hours_limit: 20,
    };
  }

  return data;
}

export async function createUserSettings(
  settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>,
) {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('user_settings')
    .insert({
      ...settings,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<
    Omit<UserSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
  >,
) {
  const supabase = createClient();
  const now = new Date().toISOString();

  // Check if settings exist first
  const { data: existingSettings } = await supabase
    .from('user_settings')
    .select('id')
    .eq('user_id', userId)
    .single();

  // If settings don't exist, create them
  if (!existingSettings) {
    return createUserSettings({
      user_id: userId,
      working_hours_per_day: settings.working_hours_per_day || 8,
      working_days_per_week: settings.working_days_per_week || 5,
      internal_hours_limit: settings.internal_hours_limit || 20,
      commercial_hours_limit: settings.commercial_hours_limit || 20,
    });
  }

  // Otherwise, update existing settings
  const { data, error } = await supabase
    .from('user_settings')
    .update({
      ...settings,
      updated_at: now,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
