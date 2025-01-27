-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.learning_pools CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.value_stakes CASCADE;
DROP TABLE IF EXISTS public.nft_contracts CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.proposals CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    location TEXT,
    avatar_url TEXT,
    website TEXT,
    skills TEXT[],
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    skipped_at TIMESTAMPTZ,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    founder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning_pools table
CREATE TABLE public.learning_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts table
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create value_stakes table
CREATE TABLE public.value_stakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create nft_contracts table
CREATE TABLE public.nft_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_address TEXT NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.value_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Public projects are viewable by everyone" 
ON public.projects FOR SELECT 
USING (true);

CREATE POLICY "Project creators can update their projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = founder_id);

CREATE POLICY "Authenticated users can create projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = founder_id);

-- Learning pools policies
CREATE POLICY "Public learning pools are viewable by everyone" 
ON public.learning_pools FOR SELECT 
USING (true);

CREATE POLICY "Creators can update their learning pools" 
ON public.learning_pools FOR UPDATE 
USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create learning pools" 
ON public.learning_pools FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

-- Posts policies
CREATE POLICY "Public posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (true);

CREATE POLICY "Authors can update their posts" 
ON public.posts FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts" 
ON public.posts FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Public comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Authors can update their comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- Value stakes policies
CREATE POLICY "Public value stakes are viewable by everyone" 
ON public.value_stakes FOR SELECT 
USING (true);

CREATE POLICY "Users can update their value stakes" 
ON public.value_stakes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create value stakes" 
ON public.value_stakes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- NFT contracts policies
CREATE POLICY "Public NFT contracts are viewable by everyone" 
ON public.nft_contracts FOR SELECT 
USING (true);

CREATE POLICY "Project founders can update NFT contracts" 
ON public.nft_contracts FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = nft_contracts.project_id 
    AND founder_id = auth.uid()
));

CREATE POLICY "Project founders can create NFT contracts" 
ON public.nft_contracts FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id 
    AND founder_id = auth.uid()
));

-- Payments policies
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their payments" 
ON public.payments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create payments" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Proposals policies
CREATE POLICY "Public proposals are viewable by everyone" 
ON public.proposals FOR SELECT 
USING (true);

CREATE POLICY "Users can update their proposals" 
ON public.proposals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create proposals" 
ON public.proposals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_pools_updated_at
    BEFORE UPDATE ON public.learning_pools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_stakes_updated_at
    BEFORE UPDATE ON public.value_stakes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nft_contracts_updated_at
    BEFORE UPDATE ON public.nft_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
    BEFORE UPDATE ON public.proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
