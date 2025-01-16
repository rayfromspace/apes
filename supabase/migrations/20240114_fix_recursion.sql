-- Drop all existing policies to start fresh
DO $$ 
BEGIN
    -- Drop project policies
    DROP POLICY IF EXISTS "Enable read access for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable insert for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable update for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable delete for projects" ON public.projects;
    
    -- Drop team member policies
    DROP POLICY IF EXISTS "Enable read access for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable team management for project founders" ON public.team_members;
    DROP POLICY IF EXISTS "Enable insert for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable update for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable delete for team members" ON public.team_members;
    
    -- Drop activity policies
    DROP POLICY IF EXISTS "Enable read access for activities" ON public.activities;
    DROP POLICY IF EXISTS "Enable activity creation" ON public.activities;
    
    -- Drop event policies
    DROP POLICY IF EXISTS "Enable read access for project members" ON public.events;
    DROP POLICY IF EXISTS "Enable event management for project founders" ON public.events;
    
    -- Drop project stats policies
    DROP POLICY IF EXISTS "Enable read access for project stats" ON public.project_stats;
    DROP POLICY IF EXISTS "Enable stats update for project founders" ON public.project_stats;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Re-enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;

-- Project Policies (Base layer - no dependencies)
CREATE POLICY "projects_read_policy"
ON public.projects FOR SELECT
TO authenticated
USING (
    visibility = 'public'
    OR founder_id = auth.uid()
);

CREATE POLICY "projects_insert_policy"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
    founder_id = auth.uid()
);

CREATE POLICY "projects_update_policy"
ON public.projects FOR UPDATE
TO authenticated
USING (
    founder_id = auth.uid()
);

CREATE POLICY "projects_delete_policy"
ON public.projects FOR DELETE
TO authenticated
USING (
    founder_id = auth.uid()
);

-- Team Members Policies (Depends on projects)
CREATE POLICY "team_members_read_policy"
ON public.team_members FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
);

CREATE POLICY "team_members_write_policy"
ON public.team_members FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
);

-- Activities Policies (Depends on projects)
CREATE POLICY "activities_read_policy"
ON public.activities FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
);

CREATE POLICY "activities_insert_policy"
ON public.activities FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

-- Events Policies (Depends on projects)
CREATE POLICY "events_read_policy"
ON public.events FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND (
            p.founder_id = auth.uid()
            OR p.visibility = 'public'
        )
    )
);

CREATE POLICY "events_write_policy"
ON public.events FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
);

-- Project Stats Policies (Depends on projects)
CREATE POLICY "project_stats_read_policy"
ON public.project_stats FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND (
            p.founder_id = auth.uid()
            OR p.visibility = 'public'
        )
    )
);

CREATE POLICY "project_stats_write_policy"
ON public.project_stats FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND p.founder_id = auth.uid()
    )
);
