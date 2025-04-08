import { getSupabase } from './client';
import { Project, TimeEntry } from '../types';

export async function getProfile(userId: string) {
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getProjects(userId: string) {
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { data, error } = await supabaseClient
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
  const supabaseClient = getSupabase();
  const { error } = await supabaseClient
    .from('time_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw error;
}
