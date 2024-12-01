import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths and static files
  if (PUBLIC_PATHS.includes(pathname) || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get the auth cookie
  const authCookie = request.cookies.get('auth-storage');
  let isAuthed = false;

  try {
    if (authCookie?.value) {
      const authState = JSON.parse(authCookie.value);
      isAuthed = authState?.state?.isAuthenticated ?? false;
    }
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthed && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected pages, redirect to login
  if (!isAuthed) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};