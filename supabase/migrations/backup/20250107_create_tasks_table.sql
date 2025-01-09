-- Create tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  due_date date not null,
  priority text not null check (priority in ('high', 'medium', 'low')),
  status text not null check (status in ('todo', 'in_progress', 'completed')),
  project_id uuid references public.projects(id) on delete cascade,
  assignee_id uuid references auth.users(id) on delete set null,
  creator_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Create policies
create policy "Users can view tasks in their projects" on public.tasks
  for select using (
    project_id in (
      select p.id from public.projects p
      inner join public.project_members pm on pm.project_id = p.id
      where pm.user_id = auth.uid()
    )
  );

create policy "Users can create tasks in their projects" on public.tasks
  for insert with check (
    project_id in (
      select p.id from public.projects p
      inner join public.project_members pm on pm.project_id = p.id
      where pm.user_id = auth.uid()
    )
  );

create policy "Users can update tasks in their projects" on public.tasks
  for update using (
    project_id in (
      select p.id from public.projects p
      inner join public.project_members pm on pm.project_id = p.id
      where pm.user_id = auth.uid()
    )
  );

create policy "Users can delete tasks in their projects" on public.tasks
  for delete using (
    project_id in (
      select p.id from public.projects p
      inner join public.project_members pm on pm.project_id = p.id
      where pm.user_id = auth.uid()
    )
  );

-- Create updated_at trigger
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.set_current_timestamp_updated_at();
