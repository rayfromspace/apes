import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  bio: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  linkedin_url: z.string().url().optional(),
  twitter_url: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
        bio: true,
        company: true,
        position: true,
        location: true,
        skills: true,
        interests: true,
        linkedin_url: true,
        twitter_url: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: validatedData,
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
        bio: true,
        company: true,
        position: true,
        location: true,
        skills: true,
        interests: true,
        linkedin_url: true,
        twitter_url: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await db.user.delete({
      where: { email: session.user.email },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
