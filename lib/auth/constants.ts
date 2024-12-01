export const AUTH_COOKIE_NAME = 'auth-storage';

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/',
} as const;

export const PUBLIC_ROUTES = [
  AUTH_ROUTES.HOME,
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  '/about',
  '/contact',
] as const;

export const PROTECTED_ROUTES = [
  AUTH_ROUTES.DASHBOARD,
  '/projects',
  '/learning',
  '/community',
  '/settings',
  '/calendar',
  '/value-stake',
] as const;