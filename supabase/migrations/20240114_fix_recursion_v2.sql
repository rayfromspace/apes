-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_project_stats CASCADE;
DROP FUNCTION IF EXISTS public.get_user_projects CASCADE;

-- Create a function to get project stats without recursion
CREATE OR REPLACE FUNCTION public.get_project_stats(p_project_id UUID)
RETURNS TABLE (
  team_count BIGINT,
  update_count BIGINT,
  document_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.team_members WHERE project_id = p_project_id) as team_count,
    (SELECT COUNT(*) FROM public.activities WHERE project_id = p_project_id) as update_count,
    (SELECT COUNT(*) FROM public.events WHERE project_id = p_project_id) as document_count;
END;
$$;

-- Create a function to get user's projects without recursion
CREATE OR REPLACE FUNCTION public.get_user_projects(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  type TEXT,
  category TEXT,
  visibility TEXT,
  status TEXT,
  founder_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  is_founder BOOLEAN,
  is_member BOOLEAN
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.type,
    p.category,
    p.visibility,
    p.status,
    p.founder_id,
    p.created_at,
    p.updated_at,
    p.image_url,
    p.github_url,
    p.live_url,
    p.founder_id = p_user_id as is_founder,
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.project_id = p.id AND tm.user_id = p_user_id
    ) as is_member
  FROM public.projects p
  WHERE 
    p.founder_id = p_user_id 
    OR EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.project_id = p.id AND tm.user_id = p_user_id
    )
    OR p.visibility = 'public';
END;
$$;

-- Update the project policies to use the new functions
DROP POLICY IF EXISTS "projects_read_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON public.projects;

CREATE POLICY "projects_read_policy" ON public.projects 
FOR SELECT TO authenticated
USING (
  visibility = 'public' 
  OR founder_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.team_members tm 
    WHERE tm.project_id = id 
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "projects_insert_policy" ON public.projects 
FOR INSERT TO authenticated 
WITH CHECK (founder_id = auth.uid());

CREATE POLICY "projects_update_policy" ON public.projects 
FOR UPDATE TO authenticated 
USING (founder_id = auth.uid());

CREATE POLICY "projects_delete_policy" ON public.projects 
FOR DELETE TO authenticated 
USING (founder_id = auth.uid());

-- Update team_members policies to avoid recursion
DROP POLICY IF EXISTS "team_members_read_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_write_policy" ON public.team_members;

CREATE POLICY "team_members_read_policy" ON public.team_members 
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id
    AND (
      p.founder_id = auth.uid()
      OR p.visibility = 'public'
    )
  )
);

CREATE POLICY "team_members_write_policy" ON public.team_members 
FOR ALL TO authenticated
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
