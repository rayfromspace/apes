"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
        const returnUrl = encodeURIComponent(pathname);
        router.push(`/login?from=${returnUrl}`);
      } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, router, pathname, mounted]);

  // Don't render anything until the component is mounted
  if (!mounted) {
    return null;
  }

  // If we're on an auth page or authenticated, render children
  if (pathname === '/login' || pathname === '/register' || pathname === '/' || isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise render nothing while redirecting
  return null;
}