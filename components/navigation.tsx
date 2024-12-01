"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, Home, Search, TrendingUp, GraduationCap, Settings, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SIDEBAR_BREAKPOINT = 1024;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsExpanded(window.innerWidth >= SIDEBAR_BREAKPOINT);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render navigation on landing page or auth pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const publicRoutes = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Learning", href: "/learning" },
    { name: "Community", href: "/community" },
  ];

  const protectedRoutes = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Value Stake", href: "/investments", icon: TrendingUp },
    { name: "Learning Pool", href: "/learning", icon: GraduationCap },
  ];

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300",
      isExpanded ? "w-60" : "w-[70px]"
    )}>
      <div className="flex h-16 items-center justify-center px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="relative h-8 w-8 min-w-[32px]">
            <Image
              src="/ColabApes_Logo_Transparent.png"
              alt="coLABapes Logo"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          <span className={cn(
            "font-bold transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0 w-0"
          )}>
            coLABapes
          </span>
        </button>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-2">
          {protectedRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent group relative",
                  !isExpanded && "justify-center"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0",
                  isExpanded ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  "ml-3 transition-all duration-300",
                  isExpanded ? "opacity-100 w-auto" : "w-0 opacity-0"
                )}>
                  {route.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className={cn(
          "flex items-center mb-4",
          isExpanded ? "justify-center" : "justify-center px-3"
        )}>
          <ModeToggle />
        </div>
        <div className={cn(
          "flex items-center",
          isExpanded ? "justify-between px-2" : "justify-center"
        )}>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className={cn(
                "flex-shrink-0",
                isExpanded ? "h-4 w-4" : "h-5 w-5"
              )} />
            </Link>
          </Button>
          <Button variant="ghost" className="p-0">
            <Link href="/profile">
              <div className="relative h-8 w-8">
                <Image
                  src="/profile-picture.jpg"
                  alt="Profile Picture"
                  fill
                  sizes="32px"
                  className="rounded-full object-cover"
                />
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}