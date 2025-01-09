-- Add type column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS type text NOT NULL CHECK (type IN ('product', 'service'));
