-- Drop existing policies
DO $$ 
BEGIN
    -- Drop user_profiles policies
    DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Service role can do anything with user_profiles" ON public.user_profiles;

    -- Drop projects policies
    DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
    DROP POLICY IF EXISTS "Project founders can update their projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
    DROP POLICY IF EXISTS "Service role can do anything with projects" ON public.projects;

    -- Drop team_members policies
    DROP POLICY IF EXISTS "Team members can view their teams" ON public.team_members;
    DROP POLICY IF EXISTS "Project founders can manage team members" ON public.team_members;
    DROP POLICY IF EXISTS "Service role can do anything with team_members" ON public.team_members;

    -- Drop posts policies
    DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
    DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
    DROP POLICY IF EXISTS "Post authors can update their posts" ON public.posts;
    DROP POLICY IF EXISTS "Post authors can delete their posts" ON public.posts;
    DROP POLICY IF EXISTS "Service role can do anything with posts" ON public.posts;

    -- Drop comments policies
    DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
    DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
    DROP POLICY IF EXISTS "Comment authors can update their comments" ON public.comments;
    DROP POLICY IF EXISTS "Comment authors can delete their comments" ON public.comments;
    DROP POLICY IF EXISTS "Service role can do anything with comments" ON public.comments;

    -- Drop likes policies
    DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
    DROP POLICY IF EXISTS "Users can manage their likes" ON public.likes;
    DROP POLICY IF EXISTS "Service role can do anything with likes" ON public.likes;

    -- Drop bookmarks policies
    DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
    DROP POLICY IF EXISTS "Users can manage their bookmarks" ON public.bookmarks;
    DROP POLICY IF EXISTS "Service role can do anything with bookmarks" ON public.bookmarks;

    -- Drop financial_transactions policies
    DROP POLICY IF EXISTS "Users can view their transactions" ON public.financial_transactions;
    DROP POLICY IF EXISTS "Users can create transactions" ON public.financial_transactions;
    DROP POLICY IF EXISTS "Service role can do anything with financial_transactions" ON public.financial_transactions;

    -- Drop notifications policies
    DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
    DROP POLICY IF EXISTS "System can manage notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Service role can do anything with notifications" ON public.notifications;

    -- Drop connections policies
    DROP POLICY IF EXISTS "Users can view connections" ON public.connections;
    DROP POLICY IF EXISTS "Users can manage their connections" ON public.connections;
    DROP POLICY IF EXISTS "Service role can do anything with connections" ON public.connections;

    -- Drop events policies
    DROP POLICY IF EXISTS "Enable read access for project members" ON public.events;
    DROP POLICY IF EXISTS "Enable event management for project founders" ON public.events;

    -- Drop activities policies
    DROP POLICY IF EXISTS "Enable read access for activities" ON public.activities;
    DROP POLICY IF EXISTS "Enable activity creation" ON public.activities;

    -- Drop project_stats policies
    DROP POLICY IF EXISTS "Enable read access for project stats" ON public.project_stats;
    DROP POLICY IF EXISTS "Enable stats update for project founders" ON public.project_stats;

    -- Drop projects policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.projects;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.projects;
    DROP POLICY IF EXISTS "Enable update for project founders" ON public.projects;
    DROP POLICY IF EXISTS "Enable delete for project founders" ON public.projects;
EXCEPTION
    WHEN OTHERS THEN
        -- Do nothing, just continue
END $$;

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view all profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Drop existing policies
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.projects;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.projects;
    DROP POLICY IF EXISTS "Enable update for project founders" ON public.projects;
    DROP POLICY IF EXISTS "Enable delete for project founders" ON public.projects;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop and recreate project policies
DROP POLICY IF EXISTS "Enable read access for public projects" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Enable update for project founders and team members" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for project founders" ON public.projects;

-- Drop all existing project policies
DROP POLICY IF EXISTS "Enable read access for public projects" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Enable update for project founders and team members" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for project founders" ON public.projects;

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop all existing project policies
DROP POLICY IF EXISTS "Enable read access for public projects" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Enable update for project founders" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for project founders" ON public.projects;

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable insert for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable update for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable delete for projects" ON public.projects;
    DROP POLICY IF EXISTS "Enable read access for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable insert for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable update for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable delete for team members" ON public.team_members;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Enable read access for projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid()
        AND (
            projects.visibility = 'public'
            OR projects.founder_id = up.id
        )
    )
);

CREATE POLICY "Enable insert for projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid()
        AND founder_id = up.id
    )
);

CREATE POLICY "Enable update for projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid()
        AND founder_id = up.id
    )
);

CREATE POLICY "Enable delete for projects"
ON public.projects
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid()
        AND founder_id = up.id
    )
);

-- Team Members Policies
CREATE POLICY "Enable read access for team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid()
        AND (
            team_members.user_id = up.id
            OR EXISTS (
                SELECT 1 FROM public.projects p
                WHERE p.id = team_members.project_id
                AND p.founder_id = up.id
            )
        )
    )
);

CREATE POLICY "Enable insert for team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        JOIN public.projects p ON p.founder_id = up.id
        WHERE up.id = auth.uid()
        AND p.id = project_id
    )
);

CREATE POLICY "Enable update for team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        JOIN public.projects p ON p.founder_id = up.id
        WHERE up.id = auth.uid()
        AND p.id = project_id
    )
);

CREATE POLICY "Enable delete for team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        JOIN public.projects p ON p.founder_id = up.id
        WHERE up.id = auth.uid()
        AND p.id = project_id
    )
);

-- Grant necessary permissions
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.team_members TO authenticated;

-- Team members policies
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;
    DROP POLICY IF EXISTS "team_members_insert_policy" ON public.team_members;
    DROP POLICY IF EXISTS "team_members_update_policy" ON public.team_members;
    DROP POLICY IF EXISTS "team_members_delete_policy" ON public.team_members;
    DROP POLICY IF EXISTS "team_members_manage_policy" ON public.team_members;
    DROP POLICY IF EXISTS "Enable read access for team members" ON public.team_members;
    DROP POLICY IF EXISTS "Enable team management for project founders" ON public.team_members;
    DROP POLICY IF EXISTS "Enable team member creation" ON public.team_members;
    DROP POLICY IF EXISTS "Enable team member deletion" ON public.team_members;
EXCEPTION
    WHEN OTHERS THEN
        -- Do nothing, just continue
END $$;

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create new team_members policies
CREATE POLICY "Enable read access for team members"
ON public.team_members FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id
        AND (p.founder_id = auth.uid() OR p.visibility = 'public')
    )
);

CREATE POLICY "Enable team management for project founders"
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

-- Event policies
CREATE POLICY "Enable read access for project members"
ON public.events
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = events.project_id
        AND (
            p.founder_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.project_id = p.id
                AND tm.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Enable event management for project founders"
ON public.events
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = events.project_id
        AND founder_id = auth.uid()
    )
);

-- Activity policies
CREATE POLICY "Enable read access for activities"
ON public.activities
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = activities.project_id
        AND (
            p.founder_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.project_id = p.id
                AND tm.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Enable activity creation"
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Project stats policies
CREATE POLICY "Enable read access for project stats"
ON public.project_stats
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_stats.project_id
        AND (
            p.visibility = 'public'
            OR p.founder_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.project_id = p.id
                AND tm.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Enable stats update for project founders"
ON public.project_stats
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = project_stats.project_id
        AND founder_id = auth.uid()
    )
);

-- Create policies for posts
CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Post authors can update their posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Post authors can delete their posts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Create policies for comments
CREATE POLICY "Anyone can view comments"
ON public.comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Comment authors can update their comments"
ON public.comments FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Comment authors can delete their comments"
ON public.comments FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Create policies for likes
CREATE POLICY "Anyone can view likes"
ON public.likes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their likes"
ON public.likes FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bookmarks"
ON public.bookmarks FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for financial_transactions
CREATE POLICY "Users can view their transactions"
ON public.financial_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
ON public.financial_transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policies for notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can manage notifications"
ON public.notifications FOR ALL
TO service_role
USING (true);

-- Create policies for connections
CREATE POLICY "Users can view connections"
ON public.connections FOR SELECT
TO authenticated
USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can manage their connections"
ON public.connections FOR ALL
TO authenticated
USING (auth.uid() = follower_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.activities TO authenticated;
GRANT ALL ON public.project_stats TO authenticated;

-- Grant necessary permissions to anon users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant necessary permissions to service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Create bypass policies for service_role
CREATE POLICY "Service role can do anything with user_profiles"
ON public.user_profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with projects"
ON public.projects FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with team_members"
ON public.team_members FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with posts"
ON public.posts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with comments"
ON public.comments FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with likes"
ON public.likes FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with bookmarks"
ON public.bookmarks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with financial_transactions"
ON public.financial_transactions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with notifications"
ON public.notifications FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with connections"
ON public.connections FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with events"
ON public.events FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with activities"
ON public.activities FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything with project_stats"
ON public.project_stats FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');
