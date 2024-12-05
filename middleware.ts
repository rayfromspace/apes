import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/auth/login', '/auth/register'];
const AUTH_PATHS = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Create a response object that we can modify
  const res = NextResponse.next();

  try {
    // Initialize the Supabase client
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Check active session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware auth error:', error);
    }

    const isAuthed = !!session;

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthed && AUTH_PATHS.includes(pathname)) {
      console.log('Authenticated user trying to access auth page, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and trying to access protected pages, redirect to login
    if (!isAuthed && !PUBLIC_PATHS.includes(pathname)) {
      console.log('Unauthenticated user trying to access protected page, redirecting to login');
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};