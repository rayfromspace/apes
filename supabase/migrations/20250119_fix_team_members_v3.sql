-- First, disable RLS temporarily to avoid any policy conflicts
ALTER TABLE IF EXISTS public.team_members DISABLE ROW LEVEL SECURITY;

-- Drop any existing foreign key constraints
ALTER TABLE IF EXISTS public.team_members 
  DROP CONSTRAINT IF EXISTS team_members_project_id_fkey,
  DROP CONSTRAINT IF EXISTS team_members_profile_id_fkey,
  DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;

-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.team_members CASCADE;

-- Create the team_members table with proper constraints
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT team_members_project_id_fkey 
        FOREIGN KEY (project_id) 
        REFERENCES public.projects(id) 
        ON DELETE CASCADE,
    CONSTRAINT team_members_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE,
    CONSTRAINT team_members_unique_membership 
        UNIQUE(project_id, user_id)
);

-- Create an index to improve query performance
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_project_id ON public.team_members(project_id);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Team members can view their own memberships"
    ON public.team_members
    FOR SELECT
    USING (auth.uid() = user_id);

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

-- Add helpful comments
COMMENT ON TABLE public.team_members IS 'Stores project team members and their roles';
COMMENT ON COLUMN public.team_members.user_id IS 'References auth.users - the team member';
COMMENT ON COLUMN public.team_members.project_id IS 'References projects - the project the user is a member of';
COMMENT ON COLUMN public.team_members.role IS 'The role of the team member in the project';
