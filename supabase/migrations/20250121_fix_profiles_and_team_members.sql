-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.profiles (id, email, full_name)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Update team_members table
DROP TABLE IF EXISTS public.team_members CASCADE;

CREATE TABLE public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
