"use client";

import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navigation from "./navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, initialize } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) {
      initialize().catch(console.error);
    }
  }, [isInitialized, initialize]);

  const showNavigation =
    isAuthenticated &&
    isInitialized &&
    pathname !== "/" &&
    !pathname.startsWith("/auth/");

  console.log("isAuthenticated", isAuthenticated);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {showNavigation && <Navigation />}
        <main
          className={`flex-1 h-screen overflow-y-auto ${
            showNavigation ? "pl-4" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
