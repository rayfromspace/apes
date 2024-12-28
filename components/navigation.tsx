"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Menu,
  Home,
  Search,
  TrendingUp,
  GraduationCap,
  Settings,
  X,
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Briefcase,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SIDEBAR_BREAKPOINT = 1024;
const STORAGE_KEY = "sidebar-expanded";

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(router);
      console.log("Redirected to login page after logout.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Initialize the state from localStorage only after mounting
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsExpanded(JSON.parse(stored));
      } else {
        const shouldExpand = window.innerWidth >= SIDEBAR_BREAKPOINT;
        setIsExpanded(shouldExpand);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shouldExpand));
      }
      setMounted(true);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const shouldExpand = window.innerWidth >= SIDEBAR_BREAKPOINT;
        setIsExpanded(shouldExpand);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shouldExpand));
      }
    };

    if (mounted) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [mounted]);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsRotating(true);
    setIsExpanded(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    // Reset rotation after animation completes
    setTimeout(() => setIsRotating(false), 300);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Value Stake", href: "/dashboard/value-stake", icon: TrendingUp },
    { name: "Learning Pool", href: "/learning", icon: GraduationCap },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Messages", href: "/messages", icon: MessageSquare },
  ];

  const bottomNavItems = [
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-background transition-all duration-300",
        isExpanded ? "w-58" : "w-[70px]"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <button
          onClick={toggleExpanded}
          className="inline-flex items-center gap-3"
        >
          <div className="relative h-8 w-8 hover:opacity-80 transition-opacity">
            <Image
              src="/ColabApes_Logo_Transparent.png"
              alt="coLABapes Logo"
              fill
              sizes="32px"
              className={cn(
                "object-contain transition-transform duration-300",
                isRotating && "rotate-[360deg]"
              )}
              priority
            />
          </div>
          <span
            className={cn(
              "font-bold text-lg transition-all duration-300",
              !isExpanded && "opacity-0 w-0"
            )}
          >
            coLABapes
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href ? "bg-accent" : "transparent",
                  !isExpanded && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span
                  className={cn(
                    "transition-all duration-300",
                    !isExpanded && "hidden"
                  )}
                >
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t">
        <div className="px-3 py-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === item.href ? "bg-accent" : "transparent",
                !isExpanded && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span
                className={cn(
                  "transition-all duration-300",
                  !isExpanded && "hidden"
                )}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>

        <div className="px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-10 px-3 justify-start"
              >
                <UserAvatar
                  user={{
                    id: user?.id || "",
                    name: user?.name || "User",
                    avatar: user?.avatar,
                  }}
                  showHoverCard={false}
                  size="sm"
                />
                <span
                  className={cn(
                    "ml-2 transition-all duration-300",
                    !isExpanded && "hidden"
                  )}
                >
                  {user?.name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/profile`)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-3">
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}
