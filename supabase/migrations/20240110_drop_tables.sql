DO $$ 
BEGIN
    -- Drop tables if they exist
    DROP TABLE IF EXISTS public.connections CASCADE;
    DROP TABLE IF EXISTS public.notifications CASCADE;
    DROP TABLE IF EXISTS public.financial_transactions CASCADE;
    DROP TABLE IF EXISTS public.bookmarks CASCADE;
    DROP TABLE IF EXISTS public.likes CASCADE;
    DROP TABLE IF EXISTS public.comments CASCADE;
    DROP TABLE IF EXISTS public.posts CASCADE;
    DROP TABLE IF EXISTS public.team_members CASCADE;
    DROP TABLE IF EXISTS public.projects CASCADE;
    DROP TABLE IF EXISTS public.user_profiles CASCADE;

    -- Drop triggers if they exist
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
    DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
    DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
    DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
    DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
    DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;

    -- Drop functions if they exist
    DROP FUNCTION IF EXISTS public.update_updated_at_column();
EXCEPTION
    WHEN OTHERS THEN
        -- Do nothing, just continue
END $$;
