import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  let userQuery = supabase
    .from('users')
    .select('id, full_name, email, avatar_url, role');

  if (query) {
    userQuery = userQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data: users, error } = await userQuery;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { full_name, email, role } = await request.json();

  const { data: user, error } = await supabase
    .from('users')
    .insert([
      {
        full_name,
        email,
        role,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${full_name}`,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ user });
}
