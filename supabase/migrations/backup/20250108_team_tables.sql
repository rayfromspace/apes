begin;
  -- First, drop any existing objects that might conflict
  drop table if exists team_members cascade;
  drop table if exists team_invites cascade;
  drop type if exists team_permission cascade;

  -- Create the enum type
  create type team_permission as enum ('Project Admin', 'Editor', 'Viewer');

  -- Create team members table
  create table team_members (
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
  create table team_invites (
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
  drop trigger if exists update_team_members_updated_at on team_members;
  create trigger update_team_members_updated_at
    before update on team_members
    for each row
    execute function update_updated_at_column();

  drop trigger if exists update_team_invites_updated_at on team_invites;
  create trigger update_team_invites_updated_at
    before update on team_invites
    for each row
    execute function update_updated_at_column();

  -- Enable RLS
  alter table team_members enable row level security;
  alter table team_invites enable row level security;

  -- Drop any existing policies
  drop policy if exists "Team members select" on team_members;
  drop policy if exists "Team members insert" on team_members;
  drop policy if exists "Team members update" on team_members;
  drop policy if exists "Team members delete" on team_members;
  drop policy if exists "Team invites select" on team_invites;
  drop policy if exists "Team invites insert" on team_invites;
  drop policy if exists "Team invites update" on team_invites;
  drop policy if exists "Team invites delete" on team_invites;

  -- Create helper function to check project access
  create or replace function auth.has_project_access(project_id uuid, required_permission team_permission)
  returns boolean as $$
  declare
    user_permission team_permission;
  begin
    -- Get user's permission level for the project
    select team_permission into user_permission
    from team_members
    where project_id = $1
    and user_id = auth.uid();

    -- Project owner always has access
    if exists (
      select 1 from projects
      where id = $1
      and owner_id = auth.uid()
    ) then
      return true;
    end if;

    -- Check permission level
    return case
      when user_permission = 'Project Admin' then true
      when user_permission = 'Editor' and required_permission in ('Editor', 'Viewer') then true
      when user_permission = 'Viewer' and required_permission = 'Viewer' then true
      else false
    end;
  end;
  $$ language plpgsql security definer;

  -- Team members policies
  create policy "Team members select"
    on team_members for select
    using (
      auth.has_project_access(project_id, 'Viewer') or
      user_id = auth.uid()
    );

  create policy "Team members insert"
    on team_members for insert
    with check (
      auth.has_project_access(project_id, 'Project Admin')
    );

  create policy "Team members update"
    on team_members for update
    using (
      auth.has_project_access(project_id, 'Project Admin')
    );

  create policy "Team members delete"
    on team_members for delete
    using (
      auth.has_project_access(project_id, 'Project Admin')
    );

  -- Team invites policies
  create policy "Team invites select"
    on team_invites for select
    using (
      auth.has_project_access(project_id, 'Viewer') or
      email = auth.jwt() ->> 'email'
    );

  create policy "Team invites insert"
    on team_invites for insert
    with check (
      auth.has_project_access(project_id, 'Project Admin')
    );

  create policy "Team invites update"
    on team_invites for update
    using (
      auth.has_project_access(project_id, 'Project Admin') or
      (status = 'pending' and email = auth.jwt() ->> 'email')
    );

  create policy "Team invites delete"
    on team_invites for delete
    using (
      auth.has_project_access(project_id, 'Project Admin')
    );

  -- Create indexes
  create index team_members_project_id_idx on team_members(project_id);
  create index team_members_user_id_idx on team_members(user_id);
  create index team_invites_project_id_idx on team_invites(project_id);
  create index team_invites_email_idx on team_invites(email);

commit;
