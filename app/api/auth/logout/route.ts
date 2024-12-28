import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });

  // Sign out the user via Supabase
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Explicitly clear the `next-auth.session-token` cookie
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  response.headers.append(
    'Set-Cookie',
    'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict;'
  );

  return response;
}
