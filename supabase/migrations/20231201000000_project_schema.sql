-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Project table with public and private information
create table projects (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Public Information
    title text not null,
    description text not null,
    slug text unique not null,
    status text not null check (status in ('draft', 'active', 'paused', 'completed')),
    cover_image text,
    
    -- Public Highlights
    team_size integer not null default 0,
    stage text not null,
    industry text not null,
    funding_goal bigint,
    current_funding bigint,
    
    -- Public Stats
    completed_milestones integer not null default 0,
    total_milestones integer not null default 0,
    team_growth numeric,
    project_health numeric,
    
    -- Public Opportunities
    has_investment_opportunities boolean not null default false,
    has_open_roles boolean not null default false,
    minimum_investment bigint,
    
    -- Public Tags and Social
    tags text[] not null default '{}',
    social_links jsonb,
    
    -- Private Information
    monthly_burn_rate bigint,
    runway integer,
    bank_details jsonb,
    vision text,
    mission text,
    
    -- Settings
    visibility text not null default 'private' check (visibility in ('public', 'private', 'invitation')),
    allow_investor_requests boolean not null default false,
    allow_team_applications boolean not null default false,
    require_nda boolean not null default true,
    notification_preferences jsonb not null default '{
        "financial": true,
        "team": true,
        "milestones": true,
        "investments": true
    }'::jsonb,
    
    -- Ownership
    owner_id uuid not null references auth.users(id) on delete cascade
);

-- RLS Policies
alter table projects enable row level security;

-- Public access policy (only public information)
create policy "Public projects are viewable by everyone"
    on projects for select
    using (visibility = 'public');

-- Owner access policy
create policy "Project owners have full access"
    on projects for all
    using (owner_id = auth.uid());

-- Project members table
create table project_members (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references projects(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null check (role in ('founder', 'cofounder', 'board_member', 'investor', 'team_member')),
    permissions text[] not null default '{}',
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    equity numeric,
    department text,
    title text,
    
    unique(project_id, user_id)
);

-- RLS Policies for project members
alter table project_members enable row level security;

create policy "Project members can view their own membership"
    on project_members for select
    using (user_id = auth.uid());

create policy "Project owners can manage members"
    on project_members for all
    using (
        exists (
            select 1 from projects
            where id = project_members.project_id
            and owner_id = auth.uid()
        )
    );

-- Project milestones table
create table project_milestones (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references projects(id) on delete cascade,
    title text not null,
    description text,
    due_date timestamp with time zone not null,
    completed_date timestamp with time zone,
    status text not null check (status in ('pending', 'in_progress', 'completed', 'delayed')),
    assigned_to uuid[] not null default '{}',
    is_public boolean not null default false
);

-- RLS Policies for milestones
alter table project_milestones enable row level security;

create policy "Public milestones are viewable by everyone"
    on project_milestones for select
    using (
        is_public = true and
        exists (
            select 1 from projects
            where id = project_milestones.project_id
            and visibility = 'public'
        )
    );

create policy "Project members can view all milestones"
    on project_milestones for select
    using (
        exists (
            select 1 from project_members
            where project_id = project_milestones.project_id
            and user_id = auth.uid()
        )
    );

-- Triggers for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
    before update on projects
    for each row
    execute function update_updated_at_column();

-- Functions for access control
create or replace function check_project_access(project_id uuid, required_role text)
returns boolean as $$
begin
    return exists (
        select 1 from project_members
        where project_id = $1
        and user_id = auth.uid()
        and (
            role = $2
            or role = 'founder'
            or (role = 'cofounder' and $2 not in ('founder'))
            or (role = 'board_member' and $2 not in ('founder', 'cofounder'))
        )
    );
end;
$$ language plpgsql security definer;
