-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    date date NOT NULL,
    start_time time NOT NULL,
    duration integer NOT NULL, -- in minutes
    type text NOT NULL CHECK (type IN ('meeting', 'review', 'call', 'deadline', 'other')),
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    location text,
    is_virtual boolean DEFAULT false,
    meeting_link text,
    creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(event_id, user_id)
);

-- Add RLS policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view events they created or are invited to" ON public.events
    FOR SELECT USING (
        auth.uid() = creator_id OR
        EXISTS (
            SELECT 1 FROM public.event_attendees
            WHERE event_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own events" ON public.events
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own events" ON public.events
    FOR DELETE USING (auth.uid() = creator_id);

-- Event attendees policies
CREATE POLICY "Users can view event attendees for their events" ON public.event_attendees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE id = event_id AND creator_id = auth.uid()
        ) OR
        user_id = auth.uid()
    );

CREATE POLICY "Event creators can manage attendees" ON public.event_attendees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE id = event_id AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own attendance status" ON public.event_attendees
    FOR UPDATE USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
