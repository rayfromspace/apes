-- Create enum for team member permissions
create type team_permission as enum ('Project Admin', 'Editor', 'Viewer');

-- Create team members table
create table if not exists team_members (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role text not null default 'Member',
    team_permission team_permission not null default 'Editor',
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    unique (project_id, user_id)
);

-- Create team invites table
create table if not exists team_invites (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade not null,
    email text not null,
    team_permission team_permission not null default 'Editor',
    invited_by uuid references auth.users(id) on delete cascade not null,
    status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_team_members_updated_at
    before update on team_members
    for each row
    execute function update_updated_at_column();

create trigger update_team_invites_updated_at
    before update on team_invites
    for each row
    execute function update_updated_at_column();

-- Enable RLS
alter table team_members enable row level security;
alter table team_invites enable row level security;

-- RLS policies for team_members
create policy "Team members visible to project members"
    on team_members for select
    using (project_id in (
        select project_id from team_members where user_id = auth.uid()
    ));

create policy "Project admins can manage team members"
    on team_members for all
    using (
        exists (
            select 1 from team_members
            where project_id = team_members.project_id
            and user_id = auth.uid()
            and team_permission = 'Project Admin'
        )
    );

-- RLS policies for team_invites
create policy "Project admins can manage invites"
    on team_invites for all
    using (
        exists (
            select 1 from team_members
            where project_id = team_invites.project_id
            and user_id = auth.uid()
            and team_permission = 'Project Admin'
        )
    );

create policy "Users can view their own invites"
    on team_invites for select
    using (email = auth.jwt() ->> 'email');

-- Create indexes for better performance
create index team_members_project_id_idx on team_members(project_id);
create index team_members_user_id_idx on team_members(user_id);
create index team_invites_project_id_idx on team_invites(project_id);
create index team_invites_email_idx on team_invites(email);
