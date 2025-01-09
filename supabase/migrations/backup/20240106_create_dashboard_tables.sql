-- Create investments table
CREATE TABLE IF NOT EXISTS public.investments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    status text NOT NULL CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
    amount decimal(12,2) NOT NULL,
    investor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    investment_id uuid REFERENCES public.investments(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, investment_id)
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    investment_id uuid REFERENCES public.investments(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    due_date timestamptz NOT NULL,
    completed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    investment_id uuid REFERENCES public.investments(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL CHECK (type IN ('comment', 'investment', 'milestone', 'team_update')),
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    investment_id uuid REFERENCES public.investments(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    target_date timestamptz,
    status text NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investments
CREATE POLICY "Users can view investments they created or are team members of" ON public.investments
    FOR SELECT USING (
        auth.uid() = investor_id OR
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE investment_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create investments" ON public.investments
    FOR INSERT WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Users can update investments they created or are team members of" ON public.investments
    FOR UPDATE USING (
        auth.uid() = investor_id OR
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE investment_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own investments" ON public.investments
    FOR DELETE USING (auth.uid() = investor_id);

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of investments they're part of" ON public.team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE id = investment_id AND (
                investor_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.team_members
                    WHERE investment_id = id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Investment owners can manage team members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE id = investment_id AND investor_id = auth.uid()
        )
    );

-- RLS Policies for milestones
CREATE POLICY "Users can view milestones of their investments" ON public.milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE id = investment_id AND (
                investor_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.team_members
                    WHERE investment_id = id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Team members can manage milestones" ON public.milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE id = investment_id AND (
                investor_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.team_members
                    WHERE investment_id = id AND user_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for activities
CREATE POLICY "Users can view activities of their investments" ON public.activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE id = investment_id AND (
                investor_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.team_members
                    WHERE investment_id = id AND user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create activities for their investments" ON public.activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE id = investment_id AND (
                investor_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.team_members
                    WHERE investment_id = id AND user_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals" ON public.goals
    FOR ALL USING (auth.uid() = user_id);

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_user_investments(p_user_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    status text,
    amount decimal,
    created_at timestamptz
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT id, name, status, amount, created_at
    FROM public.investments
    WHERE investor_id = p_user_id
    OR id IN (
        SELECT investment_id FROM public.team_members
        WHERE user_id = p_user_id
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_team_members(p_user_id uuid)
RETURNS TABLE (
    user_id uuid,
    investment_id uuid,
    role text,
    created_at timestamptz
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT user_id, investment_id, role, created_at
    FROM public.team_members
    WHERE investment_id IN (
        SELECT id FROM public.investments
        WHERE investor_id = p_user_id
        OR id IN (
            SELECT investment_id FROM public.team_members
            WHERE user_id = p_user_id
        )
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_upcoming_milestones(p_user_id uuid, p_days integer DEFAULT 7)
RETURNS TABLE (
    id uuid,
    investment_id uuid,
    title text,
    due_date timestamptz,
    completed boolean
) LANGUAGE sql SECURITY DEFINER AS $$
    SELECT id, investment_id, title, due_date, completed
    FROM public.milestones
    WHERE investment_id IN (
        SELECT id FROM public.investments
        WHERE investor_id = p_user_id
        OR id IN (
            SELECT investment_id FROM public.team_members
            WHERE user_id = p_user_id
        )
    )
    AND due_date >= CURRENT_DATE
    AND due_date <= CURRENT_DATE + (p_days || ' days')::interval
    AND completed = false
    ORDER BY due_date ASC;
$$;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investments_handle_updated_at
    BEFORE UPDATE ON public.investments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER team_members_handle_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER milestones_handle_updated_at
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER goals_handle_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
