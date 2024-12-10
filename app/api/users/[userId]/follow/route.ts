import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/api/middleware/rate-limit';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const rateLimitResult = await rateLimit(request, {
      limit: 100,
      windowInSeconds: 3600,
    });

    if (rateLimitResult) return rateLimitResult;

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (currentUser.id === params.userId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await db.user.findUnique({
      where: { id: params.userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Create follow relationship
    await db.follows.create({
      data: {
        followerId: currentUser.id,
        followingId: params.userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      );
    }

    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const rateLimitResult = await rateLimit(request, {
      limit: 100,
      windowInSeconds: 3600,
    });

    if (rateLimitResult) return rateLimitResult;

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete follow relationship
    await db.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: params.userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Not following this user' },
        { status: 400 }
      );
    }

    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
