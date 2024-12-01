import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user?.id,
          email,
          full_name: name,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        },
      ]);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: authData.user,
      session: authData.session,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
