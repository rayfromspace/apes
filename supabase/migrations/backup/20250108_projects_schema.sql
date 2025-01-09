-- Create projects table with all necessary columns
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    category text not null default 'Other',
    visibility text not null default 'private',
    status text not null default 'active',
    founder_id uuid not null references auth.users(id) on delete cascade,
    current_funding bigint default 0,
    funding_goal bigint default 0,
    required_skills text[] default array[]::text[],
    image_url text,
    progress integer default 0
);

-- Create team_members table
create table if not exists public.team_members (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    project_id uuid not null references public.projects(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'member',
    unique(project_id, user_id)
);

-- Drop existing policies
drop policy if exists "Users can view public projects" on public.projects;
drop policy if exists "Team members can view their projects" on public.projects;
drop policy if exists "Founders can update their projects" on public.projects;
drop policy if exists "Users can create projects" on public.projects;
drop policy if exists "Founders can delete their projects" on public.projects;
drop policy if exists "Team members can view team info" on public.team_members;
drop policy if exists "Founders can manage team members" on public.team_members;

-- Enable RLS
alter table public.projects enable row level security;
alter table public.team_members enable row level security;

-- Create project policies
create policy "Users can view public projects"
    on public.projects for select
    using (visibility = 'public');

create policy "Team members can view their projects"
    on public.projects for select
    using (
        exists (
            select 1 from public.team_members
            where team_members.project_id = projects.id
            and team_members.user_id = auth.uid()
        )
        or founder_id = auth.uid()
    );

create policy "Founders can update their projects"
    on public.projects for update
    using (founder_id = auth.uid());

create policy "Users can create projects"
    on public.projects for insert
    with check (founder_id = auth.uid());

create policy "Founders can delete their projects"
    on public.projects for delete
    using (founder_id = auth.uid());

-- Create team member policies
create policy "Team members can view team info"
    on public.team_members for select
    using (
        exists (
            select 1 from public.projects
            where projects.id = team_members.project_id
            and (
                projects.visibility = 'public'
                or projects.founder_id = auth.uid()
                or exists (
                    select 1 from public.team_members as tm
                    where tm.project_id = team_members.project_id
                    and tm.user_id = auth.uid()
                )
            )
        )
    );

create policy "Founders can manage team members"
    on public.team_members for all
    using (
        exists (
            select 1 from public.projects
            where projects.id = team_members.project_id
            and projects.founder_id = auth.uid()
        )
    );

-- Drop and recreate trigger
drop trigger if exists handle_projects_updated_at on public.projects;
drop function if exists public.handle_updated_at();

create function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute procedure public.handle_updated_at();
