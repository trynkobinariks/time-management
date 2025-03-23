-- Script to add ON DELETE CASCADE to all foreign keys related to users
-- Run this in the Supabase SQL Editor

BEGIN;

-- For time_entries table
ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_user_id_fkey;
ALTER TABLE time_entries ADD CONSTRAINT time_entries_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For projects table
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For daily_limits table
ALTER TABLE daily_limits DROP CONSTRAINT IF EXISTS daily_limits_user_id_fkey;
ALTER TABLE daily_limits ADD CONSTRAINT daily_limits_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For weekly_limits table
ALTER TABLE weekly_limits DROP CONSTRAINT IF EXISTS weekly_limits_user_id_fkey;
ALTER TABLE weekly_limits ADD CONSTRAINT weekly_limits_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For user_settings table
ALTER TABLE user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For profiles table (if it exists)
-- Check your database to see if this table exists and what the constraint name is
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
-- ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Don't forget the project-time_entries relationship too
ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_project_id_fkey;
ALTER TABLE time_entries ADD CONSTRAINT time_entries_project_id_fkey
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

COMMIT; 