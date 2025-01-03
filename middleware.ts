import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession();

  // Handle auth redirects
  const { pathname } = req.nextUrl;

  // Redirect authenticated users away from auth pages
  if (session && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Require authentication for protected routes
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};