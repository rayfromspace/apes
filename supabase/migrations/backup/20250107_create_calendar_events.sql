-- Create calendar events table
create table public.calendar_events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  duration integer not null,
  type text not null check (type in ('task', 'meeting', 'review', 'deadline')),
  project_id uuid references public.projects(id) on delete cascade,
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.calendar_events enable row level security;

-- Create policies
create policy "Users can view events in their projects"
  on public.calendar_events for select
  using (
    auth.uid() in (
      select user_id from project_members
      where project_id = calendar_events.project_id
    )
  );

create policy "Users can create events in their projects"
  on public.calendar_events for insert
  with check (
    auth.uid() in (
      select user_id from project_members
      where project_id = calendar_events.project_id
    )
  );

create policy "Event creators can update their events"
  on public.calendar_events for update
  using (auth.uid() = created_by);

create policy "Event creators can delete their events"
  on public.calendar_events for delete
  using (auth.uid() = created_by);

-- Create indexes
create index calendar_events_project_id_idx on public.calendar_events(project_id);
create index calendar_events_date_idx on public.calendar_events(date);
create index calendar_events_type_idx on public.calendar_events(type);
