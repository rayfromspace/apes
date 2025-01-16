"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/lib/auth/store";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
