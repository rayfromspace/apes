"use client";

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register'].includes(pathname);
  const isLandingPage = pathname === '/';

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <div className="flex h-screen">
              {isAuthenticated && !isAuthPage && !isLandingPage && <Navigation />}
              <main className={`flex-1 overflow-y-auto ${
                isAuthenticated && !isAuthPage && !isLandingPage ? 'pt-4 px-4' : ''
              }`}>
                {children}
              </main>
            </div>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}