-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL CHECK (type IN ('product', 'service')),
    category text NOT NULL,
    founder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
    visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invitation')),
    image_url text,
    funding_goal decimal(12,2) DEFAULT 0,
    current_funding decimal(12,2) DEFAULT 0,
    required_skills text[] DEFAULT '{}',
    progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('founder', 'admin', 'member', 'investor')),
    permissions jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- Create project_updates table
CREATE TABLE IF NOT EXISTS public.project_updates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    type text NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'milestone', 'funding', 'team')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create project_documents table
CREATE TABLE IF NOT EXISTS public.project_documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    file_url text NOT NULL,
    file_type text NOT NULL,
    file_size integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Public projects are viewable by everyone" ON public.projects
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view projects they are team members of" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Project founders can update their projects" ON public.projects
    FOR UPDATE USING (auth.uid() = founder_id);

CREATE POLICY "Project founders can delete their projects" ON public.projects
    FOR DELETE USING (auth.uid() = founder_id);

-- RLS Policies for team_members
CREATE POLICY "Team members are viewable by project members" ON public.team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.project_id = project_id AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project founders can manage team members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND founder_id = auth.uid()
        )
    );

-- RLS Policies for project_updates
CREATE POLICY "Updates are viewable by project members" ON public.project_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = project_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create updates" ON public.project_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = project_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Update creators can edit their updates" ON public.project_updates
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Update creators can delete their updates" ON public.project_updates
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for project_documents
CREATE POLICY "Documents are viewable by project members" ON public.project_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = project_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can upload documents" ON public.project_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE project_id = project_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Document creators can delete their documents" ON public.project_documents
    FOR DELETE USING (user_id = auth.uid());

-- Create function to get project stats
CREATE OR REPLACE FUNCTION public.get_project_stats(p_project_id uuid)
RETURNS TABLE (
    team_count integer,
    update_count integer,
    document_count integer
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT
        (SELECT COUNT(*) FROM public.team_members WHERE project_id = p_project_id)::integer as team_count,
        (SELECT COUNT(*) FROM public.project_updates WHERE project_id = p_project_id)::integer as update_count,
        (SELECT COUNT(*) FROM public.project_documents WHERE project_id = p_project_id)::integer as document_count;
$$;

-- Create function to get user's projects
CREATE OR REPLACE FUNCTION public.get_user_projects(p_user_id uuid)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    type text,
    category text,
    status text,
    visibility text,
    image_url text,
    progress integer,
    team_count integer,
    created_at timestamptz
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT 
        p.id,
        p.title,
        p.description,
        p.type,
        p.category,
        p.status,
        p.visibility,
        p.image_url,
        p.progress,
        COUNT(tm.id)::integer as team_count,
        p.created_at
    FROM public.projects p
    LEFT JOIN public.team_members tm ON tm.project_id = p.id
    WHERE p.founder_id = p_user_id
    OR EXISTS (
        SELECT 1 FROM public.team_members
        WHERE project_id = p.id AND user_id = p_user_id
    )
    GROUP BY p.id
    ORDER BY p.created_at DESC;
$$;

-- Triggers for updated_at
CREATE TRIGGER projects_handle_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER team_members_handle_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER project_updates_handle_updated_at
    BEFORE UPDATE ON public.project_updates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
