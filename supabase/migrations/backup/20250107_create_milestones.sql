create type milestone_status as enum ('completed', 'current', 'upcoming');

create table milestones (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  status milestone_status not null default 'upcoming',
  project_id uuid not null references projects(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table milestones enable row level security;

-- Create policies
create policy "Users can view milestones for projects they have access to"
  on milestones for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = milestones.project_id
      and project_members.user_id = auth.uid()
    )
  );

create policy "Project owners can create milestones"
  on milestones for insert
  with check (
    exists (
      select 1 from project_members
      where project_members.project_id = milestones.project_id
      and project_members.user_id = auth.uid()
      and project_members.role = 'owner'
    )
  );

create policy "Project owners can update milestones"
  on milestones for update
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = milestones.project_id
      and project_members.user_id = auth.uid()
      and project_members.role = 'owner'
    )
  );

create policy "Project owners can delete milestones"
  on milestones for delete
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = milestones.project_id
      and project_members.user_id = auth.uid()
      and project_members.role = 'owner'
    )
  );

-- Create triggers
create trigger set_milestones_updated_at
  before update on milestones
  for each row
  execute function set_updated_at();
