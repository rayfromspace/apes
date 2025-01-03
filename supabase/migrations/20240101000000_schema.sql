-- Drop everything and start fresh
drop schema public cascade;
create schema public;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create users table
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text not null,
    avatar_url text,
    bio text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- User policies
create policy "Public profiles are viewable by everyone"
    on users for select
    using (true);

create policy "Users can update own profile"
    on users for update
    using (auth.uid() = id);

-- Create projects table
create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    title text not null,
    description text not null,
    founder_id uuid references auth.users not null,
    type text not null check (type in ('product', 'service')),
    category text not null,
    status text default 'draft' not null check (status in ('draft', 'active', 'paused', 'completed')),
    visibility text default 'private' not null check (visibility in ('private', 'public', 'unlisted')),
    team_size integer default 1 not null,
    funding_goal bigint default 0 not null,
    current_funding bigint default 0 not null,
    image_url text
);

-- Enable RLS for projects
alter table public.projects enable row level security;

-- Project policies
create policy "Projects are viewable by everyone"
    on projects for select
    using (true);

create policy "Users can create projects"
    on projects for insert
    with check (auth.uid() = founder_id);

create policy "Founders can update own projects"
    on projects for update
    using (auth.uid() = founder_id);

create policy "Founders can delete own projects"
    on projects for delete
    using (auth.uid() = founder_id);

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', 'Anonymous User'),
        'https://api.dicebear.com/7.x/initials/svg?seed=' || coalesce(new.raw_user_meta_data->>'full_name', 'AU')
    );
    return new;
end;
$$ language plpgsql security definer;

-- Function to handle updated timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

create trigger handle_users_updated_at
    before update on public.users
    for each row execute function public.handle_updated_at();

create trigger handle_projects_updated_at
    before update on public.projects
    for each row execute function public.handle_updated_at();
