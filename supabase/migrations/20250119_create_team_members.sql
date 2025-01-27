-- Drop existing team_members table if it exists
DROP TABLE IF EXISTS public.team_members CASCADE;

-- Create team_members table with proper relationships
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Add RLS policies
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Allow project founders to manage team members
CREATE POLICY "Project founders can manage team members"
ON public.team_members
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_id
        AND founder_id = auth.uid()
    )
);

-- Allow team members to view their own memberships
CREATE POLICY "Team members can view their memberships"
ON public.team_members
FOR SELECT
USING (user_id = auth.uid());

-- Add comment for the relationship
COMMENT ON TABLE public.team_members IS 'Project team members and their roles';
COMMENT ON COLUMN public.team_members.user_id IS 'References the auth.users table';
COMMENT ON COLUMN public.team_members.project_id IS 'References the projects table';
