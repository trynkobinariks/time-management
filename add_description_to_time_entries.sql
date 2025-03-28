-- Migration to add description column to time_entries table
ALTER TABLE time_entries ADD COLUMN description TEXT;

-- Update existing rows to have an empty description (if any)
UPDATE time_entries SET description = '' WHERE description IS NULL; 