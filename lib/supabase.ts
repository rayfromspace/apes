import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jwqsksrolpafaerewipt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cXNrc3JvbHBhZmFlcmV3aXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5ODM4MTMsImV4cCI6MjA0NzU1OTgxM30.z7mag2B1egKQj3vgJNCncLQm1Z3u9hfNeKQ2luPdUF0'

// Initialize Supabase client with session handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})

// Create RLS policies in Supabase:
/*
-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );
*/

export type Profile = {
  id: string
  email: string
  username: string
  role: 'creator' | 'investor' | 'both'
  created_at: string
}