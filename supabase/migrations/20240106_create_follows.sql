-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policies for follows table
CREATE POLICY "Users can view their own follows" ON public.follows
    FOR SELECT USING (
        auth.uid() = follower_id OR
        auth.uid() = following_id
    );

CREATE POLICY "Users can create their own follows" ON public.follows
    FOR INSERT WITH CHECK (
        auth.uid() = follower_id
    );

CREATE POLICY "Users can delete their own follows" ON public.follows
    FOR DELETE USING (
        auth.uid() = follower_id
    );

-- Create function to get follower count
CREATE OR REPLACE FUNCTION public.get_follower_count(user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::integer
    FROM public.follows
    WHERE following_id = user_id;
$$;

-- Create function to get following count
CREATE OR REPLACE FUNCTION public.get_following_count(user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::integer
    FROM public.follows
    WHERE follower_id = user_id;
$$;

-- Create function to check if user is following another user
CREATE OR REPLACE FUNCTION public.is_following(follower uuid, following uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.follows
        WHERE follower_id = follower
        AND following_id = following
    );
$$;
