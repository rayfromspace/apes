import { PUBLIC_ROUTES, AUTH_ROUTES } from './constants';

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname as any) || pathname.startsWith('/_next');
}

export function isAuthRoute(pathname: string): boolean {
  return [AUTH_ROUTES.LOGIN, AUTH_ROUTES.REGISTER].includes(pathname as any);
}

export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isAuthRoute(pathname);
}

export function getAvatarUrl(email: string): string {
  return `https://avatar.vercel.sh/${email}`;
}