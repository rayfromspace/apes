import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';
import { rateLimit } from '@/lib/api/middleware/rate-limit';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimit(request, {
      limit: 10,
      windowInSeconds: 3600, // 1 hour
    });

    if (rateLimitResult) return rateLimitResult;

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(`avatars/${session.user.email}/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Update user's avatar URL in database
    const user = await db.user.update({
      where: { email: session.user.email },
      data: { avatar_url: blob.url },
      select: { avatar_url: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
