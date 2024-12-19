import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    // Verify the role is valid
    if (!['investor', 'founder', 'both', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Update the user role in the database
    const updatedUser = await db.user.update({
      where: { email },
      data: { role },
    });

    // Update the user metadata in Supabase
    const { error: supabaseError } = await supabase.auth.admin.updateUserById(
      updatedUser.id,
      {
        user_metadata: { role }
      }
    );

    if (supabaseError) {
      throw new Error(`Failed to update Supabase user: ${supabaseError.message}`);
    }

    return NextResponse.json({ 
      message: 'User role updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
