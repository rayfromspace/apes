-- Create events table
create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    title text not null,
    description text,
    start_time time not null,
    end_time time,
    date date not null,
    type text not null check (type in ('meeting', 'review', 'call', 'deadline', 'other')),
    project_id uuid references public.projects(id) on delete cascade,
    location text,
    is_virtual boolean default false,
    meeting_link text,
    created_by uuid references auth.users(id) on delete set null
);

-- Create event attendees junction table
create table if not exists public.event_attendees (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now(),
    event_id uuid references public.events(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    unique(event_id, user_id)
);

-- Add RLS policies
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;

-- Events policies
create policy "Users can view events for projects they are members of"
    on public.events for select
    using (
        project_id in (
            select project_id 
            from public.project_members 
            where user_id = auth.uid()
        )
    );

create policy "Users can create events for projects they are members of"
    on public.events for insert
    with check (
        project_id in (
            select project_id 
            from public.project_members 
            where user_id = auth.uid()
        )
    );

create policy "Users can update events they created or for projects they manage"
    on public.events for update
    using (
        created_by = auth.uid() or
        project_id in (
            select project_id 
            from public.project_members 
            where user_id = auth.uid() 
            and role in ('owner', 'admin')
        )
    );

create policy "Users can delete events they created or for projects they manage"
    on public.events for delete
    using (
        created_by = auth.uid() or
        project_id in (
            select project_id 
            from public.project_members 
            where user_id = auth.uid() 
            and role in ('owner', 'admin')
        )
    );

-- Event attendees policies
create policy "Users can view event attendees for events they can see"
    on public.event_attendees for select
    using (
        event_id in (
            select id 
            from public.events 
            where project_id in (
                select project_id 
                from public.project_members 
                where user_id = auth.uid()
            )
        )
    );

create policy "Users can manage attendees for events they created or manage"
    on public.event_attendees for all
    using (
        event_id in (
            select id 
            from public.events 
            where created_by = auth.uid() or
            project_id in (
                select project_id 
                from public.project_members 
                where user_id = auth.uid() 
                and role in ('owner', 'admin')
            )
        )
    );

-- Create indexes for better performance
create index if not exists events_project_id_idx on public.events(project_id);
create index if not exists events_created_by_idx on public.events(created_by);
create index if not exists events_date_idx on public.events(date);
create index if not exists event_attendees_event_id_idx on public.event_attendees(event_id);
create index if not exists event_attendees_user_id_idx on public.event_attendees(user_id);
