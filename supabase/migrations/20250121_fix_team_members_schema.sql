-- Drop existing team_members table if it exists
DROP TABLE IF EXISTS public.team_members;

-- Create team_members table
CREATE TABLE public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('founder', 'admin', 'member')),
    permissions JSONB DEFAULT '{}'::jsonb,
    salary INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Team members are viewable by team members"
    ON public.team_members
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM public.team_members 
            WHERE project_id = project_id
        )
        OR 
        EXISTS (
            SELECT 1 
            FROM public.projects 
            WHERE id = project_id 
            AND founder_id = auth.uid()
        )
    );

CREATE POLICY "Team members can be managed by admins and founders"
    ON public.team_members
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM public.team_members 
            WHERE project_id = project_id 
            AND role IN ('admin', 'founder')
        )
        OR 
        EXISTS (
            SELECT 1 
            FROM public.projects 
            WHERE id = project_id 
            AND founder_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_timestamp ON public.team_members;
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
