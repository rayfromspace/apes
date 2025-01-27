-- Drop existing foreign key if it exists
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_founder_id_fkey;

-- Add the foreign key back with a named relationship
ALTER TABLE public.projects
ADD CONSTRAINT projects_founder_id_fkey 
FOREIGN KEY (founder_id) 
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add a comment to establish the relationship name
COMMENT ON CONSTRAINT projects_founder_id_fkey ON public.projects 
IS 'The founder of the project. Creates a "founder" relationship between projects and users.';
