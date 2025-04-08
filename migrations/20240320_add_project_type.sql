-- Add type column to projects table
ALTER TABLE projects ADD COLUMN type VARCHAR(20) DEFAULT 'INTERNAL' NOT NULL;
UPDATE projects SET type = 'INTERNAL'; 