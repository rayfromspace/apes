"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TestAuthProvider } from "@/providers/test-auth-provider";

export function RootLayoutClient({
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
      <TestAuthProvider>
        {children}
        <Toaster />
      </TestAuthProvider>
    </ThemeProvider>
  );
}
