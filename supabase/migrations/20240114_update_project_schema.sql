-- Update projects table type check
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_type_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_type_check 
    CHECK (type IN ('digital product', 'digital service'));

-- Update default visibility
ALTER TABLE public.projects ALTER COLUMN visibility SET DEFAULT 'private';

-- Update RLS policies for projects
DROP POLICY IF EXISTS "Enable read access for projects" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for projects" ON public.projects;
DROP POLICY IF EXISTS "Enable update for projects" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for projects" ON public.projects;

-- Projects Policies
CREATE POLICY "Enable read access for projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
    visibility = 'public'
    OR founder_id = auth.uid()
    OR (
        visibility = 'team'
        AND EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = projects.id
            AND user_id = auth.uid()
        )
    )
);

CREATE POLICY "Enable insert for projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
    founder_id = auth.uid()
);

CREATE POLICY "Enable update for projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
    founder_id = auth.uid()
    OR (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = projects.id
            AND user_id = auth.uid()
        )
    )
);

CREATE POLICY "Enable delete for projects"
ON public.projects
FOR DELETE
TO authenticated
USING (
    founder_id = auth.uid()
);
