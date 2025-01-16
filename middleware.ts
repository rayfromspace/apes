import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/',
  '/about',
  '/contact',
];

// Add paths that are only for authenticated users
const protectedPaths = [
  '/dashboard',
  '/dashboard/projects',
  '/settings',
  '/profile',
  '/messages',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession();

  // Get the pathname of the request
  const { pathname } = req.nextUrl;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = pathname.startsWith('/auth/');
  const isPublicPath = publicPaths.some(path => pathname === path);

  // Special case for email confirmation callback
  if (pathname === '/auth/callback') {
    return res;
  }

  // Special case for profile completion page
  if (pathname === '/profile/complete') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return res;
  }

  if (session) {
    // If user is signed in and the current path is an auth page,
    // redirect them to the dashboard page
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Check for profile completion on protected paths except profile/complete
    if (isProtectedPath && pathname !== '/profile/complete') {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // If there's no profile or there was an error fetching it,
      // redirect to profile completion
      if (!profile || profileError) {
        return NextResponse.redirect(new URL('/profile/complete', req.url));
      }

      // Check if profile is complete or if skip period is still valid
      const isComplete = profile.full_name && profile.location;
      const isSkipped = profile.skipped_at;
      const skipDelay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const skipExpired = isSkipped && (Date.now() - new Date(profile.skipped_at).getTime() > skipDelay);

      if (!isComplete && (!isSkipped || skipExpired)) {
        return NextResponse.redirect(new URL('/profile/complete', req.url));
      }
    }
  } else {
    // If user is not signed in and the current path requires authentication,
    // redirect them to the login page with a redirect back
    if (isProtectedPath) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If path is not matched above, just proceed normally
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};