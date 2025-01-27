-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS public.team_members
DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;

-- Add foreign key constraint to users table
ALTER TABLE public.team_members
ADD CONSTRAINT team_members_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Create RLS policies for team_members table
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.team_members
FOR INSERT
WITH CHECK (auth.uid() IN (
    SELECT founder_id FROM public.projects WHERE id = project_id
));

CREATE POLICY "Enable update for project founders and team admins"
ON public.team_members
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT founder_id FROM public.projects WHERE id = project_id
        UNION
        SELECT user_id FROM public.team_members 
        WHERE project_id = project_id AND role = 'admin'
    )
);

CREATE POLICY "Enable delete for project founders only"
ON public.team_members
FOR DELETE
USING (
    auth.uid() IN (
        SELECT founder_id FROM public.projects WHERE id = project_id
    )
);
