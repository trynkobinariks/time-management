-- Replace '9dfa008c-9cac-423d-9dc1-4a247729d100' with the actual user ID you want to delete

-- Start a transaction 
BEGIN;

-- Delete time entries
DELETE FROM time_entries WHERE user_id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Delete projects
DELETE FROM projects WHERE user_id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Delete daily limits
DELETE FROM daily_limits WHERE user_id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Delete weekly limits
DELETE FROM weekly_limits WHERE user_id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Delete user settings
DELETE FROM user_settings WHERE user_id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Delete profiles if exists
DELETE FROM profiles WHERE id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Delete user from auth.users
DELETE FROM auth.users WHERE id = '9dfa008c-9cac-423d-9dc1-4a247729d100';

-- Commit the transaction
COMMIT;
