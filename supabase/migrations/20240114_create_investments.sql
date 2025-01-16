-- Create investments table
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('equity', 'token', 'revenue_share')),
    invested DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    roi DECIMAL(5,2),
    progress INTEGER CHECK (progress >= 0 AND progress <= 100),
    status TEXT CHECK (status IN ('active', 'completed', 'pending')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create investment_activities table for tracking activities
CREATE TABLE IF NOT EXISTS public.investment_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    amount DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_activities ENABLE ROW LEVEL SECURITY;

-- Investments policies
CREATE POLICY "Users can view their own investments"
ON public.investments FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own investments"
ON public.investments FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own investments"
ON public.investments FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own investments"
ON public.investments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Investment activities policies
CREATE POLICY "Users can view their own investment activities"
ON public.investment_activities FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own investment activities"
ON public.investment_activities FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create updated_at trigger for investments
CREATE TRIGGER update_investments_updated_at
    BEFORE UPDATE ON public.investments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
