-- Create investments table
create table if not exists public.investments (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    project text not null,
    type text not null,
    invested decimal not null,
    current_value decimal not null,
    roi decimal not null,
    progress integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.investments enable row level security;

-- Create policies
create policy "Users can view their own investments"
    on public.investments for select
    using (auth.uid() = user_id);

create policy "Users can insert their own investments"
    on public.investments for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own investments"
    on public.investments for update
    using (auth.uid() = user_id);

create policy "Users can delete their own investments"
    on public.investments for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

create trigger handle_investments_updated_at
    before update on public.investments
    for each row
    execute function public.handle_updated_at();
