
-- Create staking pools table
CREATE TABLE IF NOT EXISTS public.staking_pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    token TEXT NOT NULL,
    apy DECIMAL(5,2) NOT NULL,
    total_staked DECIMAL(20,2) DEFAULT 0 NOT NULL,
    min_stake DECIMAL(20,2) NOT NULL,
    lock_period TEXT NOT NULL,
    rewards DECIMAL(20,2) DEFAULT 0 NOT NULL
);

-- Create user stakes table
CREATE TABLE IF NOT EXISTS public.user_stakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    pool_id UUID REFERENCES public.staking_pools(id) NOT NULL,
    amount DECIMAL(20,2) NOT NULL,
    rewards_earned DECIMAL(20,2) DEFAULT 0 NOT NULL,
    locked_until TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Create staking rewards history table
CREATE TABLE IF NOT EXISTS public.staking_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    pool_id UUID REFERENCES public.staking_pools(id) NOT NULL,
    amount DECIMAL(20,2) NOT NULL,
    type TEXT NOT NULL -- 'daily', 'bonus', etc.
);

-- Enable RLS
ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_rewards ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON public.staking_pools TO authenticated;
GRANT ALL ON public.user_stakes TO authenticated;
GRANT ALL ON public.staking_rewards TO authenticated;

-- Create RLS policies
CREATE POLICY "Anyone can view staking pools"
ON public.staking_pools FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can view their own stakes"
ON public.user_stakes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create stakes"
ON public.user_stakes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own rewards"
ON public.staking_rewards FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_staking_pools_updated_at
    BEFORE UPDATE ON public.staking_pools
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_stakes_updated_at
    BEFORE UPDATE ON public.user_stakes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial staking pools
INSERT INTO public.staking_pools 
(name, token, apy, total_staked, min_stake, lock_period, rewards)
VALUES
('High Yield Pool', 'USDC', 12.5, 1500000, 100, '30 days', 25000),
('Flexible Pool', 'ETH', 8.0, 2500000, 0.1, 'None', 15000);