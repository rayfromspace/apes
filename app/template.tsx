'use client';

import ClientLayout from '@/components/client-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClientLayout>{children}</ClientLayout>
      <Toaster />
    </ThemeProvider>
  );
}
