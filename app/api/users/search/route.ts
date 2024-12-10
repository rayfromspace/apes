import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().optional(),
  role: z.enum(['investor', 'founder', 'both']).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const role = searchParams.get('role');
    const skills = searchParams.getAll('skills');
    const location = searchParams.get('location');

    const validatedParams = searchQuerySchema.parse({
      q: query,
      role: role || undefined,
      skills: skills.length > 0 ? skills : undefined,
      location: location || undefined,
    });

    // Build the where clause for the query
    const where: any = {
      OR: [
        { full_name: { contains: validatedParams.q, mode: 'insensitive' } },
        { bio: { contains: validatedParams.q, mode: 'insensitive' } },
        { company: { contains: validatedParams.q, mode: 'insensitive' } },
      ],
    };

    if (validatedParams.role) {
      where.role = validatedParams.role;
    }

    if (validatedParams.location) {
      where.location = {
        contains: validatedParams.location,
        mode: 'insensitive',
      };
    }

    if (validatedParams.skills?.length) {
      where.skills = {
        hasSome: validatedParams.skills,
      };
    }

    const users = await db.user.findMany({
      where,
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
      take: 50, // Limit results
    });

    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
