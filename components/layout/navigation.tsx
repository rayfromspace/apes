"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/store";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { NavModeToggle } from "@/components/theme/nav-mode-toggle";
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
  Sun,
  Moon,
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
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue !== null) {
      setIsExpanded(JSON.parse(storedValue));
    }
  }, []);

  const toggleSidebar = () => {
    setIsRotating(true);
    setIsExpanded(!isExpanded);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(!isExpanded));
  };

  if (!mounted) return null;

  const handleNavigation = (href: string) => {
    if (href === "/value-stake") {
      console.log("Navigating to value-stake");
    }
    router.push(href);
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Value Stake", href: "/value-stake", icon: TrendingUp },
    { name: "Learning Pool", href: "/learning", icon: GraduationCap },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Messages", href: "/messages", icon: MessageSquare },
  ];

  const bottomNavItems = [
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around items-center h-16 px-4">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-lg",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center w-12 h-12 rounded-lg text-muted-foreground hover:text-primary">
                <Menu className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navigationItems.slice(4).map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-center gap-2 p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => document.documentElement.classList.remove('dark')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => document.documentElement.classList.add('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "h-screen sticky top-0 flex flex-col border-r bg-background transition-all duration-300 hidden md:flex",
          isExpanded ? "w-48" : "w-[70px]"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center gap-2"
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
                "font-bold text-base transition-all duration-300",
                !isExpanded && "opacity-0 w-0 overflow-hidden pointer-events-none"
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
                      !isExpanded && "hidden w-0 overflow-hidden pointer-events-none"
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
          <div className="px-3 py-2 space-y-2">
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
                    !isExpanded && "hidden w-0 overflow-hidden pointer-events-none"
                  )}
                >
                  {item.name}
                </span>
              </button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    !isExpanded && "justify-center"
                  )}
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
                      "transition-all duration-300",
                      !isExpanded && "hidden w-0 overflow-hidden pointer-events-none"
                    )}
                  >
                    {user?.name || "User"}
                  </span>
                </button>
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

            <div
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                !isExpanded && "justify-center"
              )}
            >
              <NavModeToggle isExpanded={isExpanded} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
