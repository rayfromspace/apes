-- Drop all existing RLS policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
        
        FOR pol IN (
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = r.tablename
        ) LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, r.tablename);
        END LOOP;
    END LOOP;
END $$;

-- Re-enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Create base level functions for access control
CREATE OR REPLACE FUNCTION public.has_project_access(project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is founder
    IF EXISTS (
        SELECT 1 FROM public.projects 
        WHERE id = project_id 
        AND founder_id = auth.uid()
    ) THEN
        RETURN TRUE;
    END IF;

    -- Check if project is public
    IF EXISTS (
        SELECT 1 FROM public.projects 
        WHERE id = project_id 
        AND visibility = 'public'
    ) THEN
        RETURN TRUE;
    END IF;

    -- Check if user is team member
    IF EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE project_id = project_id 
        AND user_id = auth.uid()
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Projects Policies (Base Level)
CREATE POLICY "projects_select"
ON public.projects FOR SELECT TO authenticated
USING (
    visibility = 'public'
    OR founder_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.team_members
        WHERE project_id = id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "projects_insert"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (founder_id = auth.uid());

CREATE POLICY "projects_update"
ON public.projects FOR UPDATE TO authenticated
USING (founder_id = auth.uid())
WITH CHECK (founder_id = auth.uid());

CREATE POLICY "projects_delete"
ON public.projects FOR DELETE TO authenticated
USING (founder_id = auth.uid());

-- Team Members Policies (Level 1)
CREATE POLICY "team_members_select"
ON public.team_members FOR SELECT TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND (founder_id = auth.uid() OR visibility = 'public')
    )
);

CREATE POLICY "team_members_insert"
ON public.team_members FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "team_members_update"
ON public.team_members FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "team_members_delete"
ON public.team_members FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Tasks Policies (Level 2)
CREATE POLICY "tasks_select"
ON public.tasks FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "tasks_insert"
ON public.tasks FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND (founder_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = tasks.project_id
            AND user_id = auth.uid()
        ))
    )
);

CREATE POLICY "tasks_update"
ON public.tasks FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND (founder_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = tasks.project_id
            AND user_id = auth.uid()
        ))
    )
);

CREATE POLICY "tasks_delete"
ON public.tasks FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Events Policies (Level 2)
CREATE POLICY "events_select"
ON public.events FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "events_insert"
ON public.events FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "events_update"
ON public.events FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "events_delete"
ON public.events FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Activities Policies (Level 2)
CREATE POLICY "activities_select"
ON public.activities FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "activities_insert"
ON public.activities FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Project Stats Policies (Level 2)
CREATE POLICY "project_stats_select"
ON public.project_stats FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "project_stats_insert"
ON public.project_stats FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "project_stats_update"
ON public.project_stats FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Milestones Policies (Level 2)
CREATE POLICY "milestones_select"
ON public.milestones FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "milestones_insert"
ON public.milestones FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "milestones_update"
ON public.milestones FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "milestones_delete"
ON public.milestones FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Messages Policies (Level 2)
CREATE POLICY "messages_select"
ON public.messages FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "messages_insert"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND (founder_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = messages.project_id
            AND user_id = auth.uid()
        ))
    )
);

-- Proposals Policies (Level 2)
CREATE POLICY "proposals_select"
ON public.proposals FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "proposals_insert"
ON public.proposals FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

CREATE POLICY "proposals_update"
ON public.proposals FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Investments Policies (Level 2)
CREATE POLICY "investments_select"
ON public.investments FOR SELECT TO authenticated
USING (public.has_project_access(project_id));

CREATE POLICY "investments_insert"
ON public.investments FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);
