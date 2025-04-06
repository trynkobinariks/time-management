-- Script to manually delete a user and all their related data
-- Replace 'USER_ID_TO_DELETE' with the actual user ID you want to delete

-- Start a transaction 
BEGIN;

-- Delete time entries
DELETE FROM time_entries WHERE user_id = 'USER_ID_TO_DELETE';

-- Delete projects
DELETE FROM projects WHERE user_id = 'USER_ID_TO_DELETE';

-- Delete daily limits
DELETE FROM daily_limits WHERE user_id = 'USER_ID_TO_DELETE';

-- Delete weekly limits
DELETE FROM weekly_limits WHERE user_id = 'USER_ID_TO_DELETE';

-- Delete user settings
DELETE FROM user_settings WHERE user_id = 'USER_ID_TO_DELETE';

-- Delete profiles if exists
DELETE FROM profiles WHERE id = 'USER_ID_TO_DELETE';

-- Delete user from auth.users
DELETE FROM auth.users WHERE id = 'USER_ID_TO_DELETE';

-- Commit the transaction
COMMIT;
