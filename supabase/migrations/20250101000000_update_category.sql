-- Remove the enum type constraint from category column
ALTER TABLE projects 
ALTER COLUMN category TYPE text;

-- Drop the enum type if it exists
DROP TYPE IF EXISTS project_category;
