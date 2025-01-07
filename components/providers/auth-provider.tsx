"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/store";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
