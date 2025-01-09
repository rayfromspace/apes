-- Create events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  duration integer not null default 60, -- Duration in minutes
  type text not null check (type in ('meeting', 'deadline', 'other')),
  project_id uuid references public.projects(id) on delete cascade,
  project_name text,
  location text,
  is_virtual boolean default true,
  meeting_link text,
  creator_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create event attendees junction table
create table public.event_attendees (
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (event_id, user_id)
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;

-- Create RLS policies for events
create policy "Users can view events in their projects"
  on public.events for select
  using (
    auth.uid() in (
      select user_id
      from project_members
      where project_id = events.project_id
    )
  );

create policy "Users can create events in their projects"
  on public.events for insert
  with check (
    auth.uid() in (
      select user_id
      from project_members
      where project_id = project_id
    )
  );

create policy "Event creators can update their events"
  on public.events for update
  using (auth.uid() = creator_id);

create policy "Event creators can delete their events"
  on public.events for delete
  using (auth.uid() = creator_id);

-- Create RLS policies for event attendees
create policy "Users can view event attendees for their events"
  on public.event_attendees for select
  using (
    exists (
      select 1
      from events e
      inner join project_members pm on e.project_id = pm.project_id
      where e.id = event_attendees.event_id
      and pm.user_id = auth.uid()
    )
  );

create policy "Users can manage attendees for their events"
  on public.event_attendees for insert
  with check (
    exists (
      select 1
      from events
      where id = event_id
      and creator_id = auth.uid()
    )
  );

create policy "Users can remove themselves from events"
  on public.event_attendees for delete
  using (
    auth.uid() = user_id
    or
    exists (
      select 1
      from events
      where id = event_id
      and creator_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updating updated_at
create trigger handle_events_updated_at
  before update on public.events
  for each row
  execute function public.handle_updated_at();

-- Add indexes for better performance
create index events_project_id_idx on public.events(project_id);
create index events_creator_id_idx on public.events(creator_id);
create index events_date_idx on public.events(date);
create index event_attendees_event_id_idx on public.event_attendees(event_id);
create index event_attendees_user_id_idx on public.event_attendees(user_id);
