import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export interface RateLimitConfig {
  limit?: number;
  windowInSeconds?: number;
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {}
) {
  const { limit = 10, windowInSeconds = 60 } = config;

  const ip = request.ip || 'anonymous';
  const key = `rate-limit:${ip}`;

  const window = Math.floor(Date.now() / 1000 / windowInSeconds);
  const field = `w:${window}`;

  try {
    const count = await redis.hincrby(key, field, 1);
    await redis.expire(key, windowInSeconds * 2);

    const remaining = Math.max(0, limit - count);
    
    const headers = new Headers({
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': (window * windowInSeconds + windowInSeconds).toString(),
    });

    if (count > limit) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers,
      });
    }

    return null;
  } catch (error) {
    console.error('Rate limit error:', error);
    return null; // Fail open if Redis is down
  }
}
