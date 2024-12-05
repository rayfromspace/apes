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
  LogOut
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SIDEBAR_BREAKPOINT = 1024;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { user, logout } = useAuth();
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
    <aside 
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-background transition-all duration-300",
        isExpanded ? "w-64" : "w-[70px]",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "lg:hidden fixed right-4 top-4 z-40 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isOpen ? "right-[270px]" : "right-4"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
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
            !isExpanded && "opacity-0 w-0"
          )}>
            coLABapes
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href ? "bg-accent" : "transparent",
                  !isExpanded && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className={cn(
                  "transition-all duration-300",
                  !isExpanded && "hidden"
                )}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t">
        <div className="px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === item.href ? "bg-accent" : "transparent",
                !isExpanded && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className={cn(
                "transition-all duration-300",
                !isExpanded && "hidden"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="p-3 mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className={cn(
                  "transition-all duration-300",
                  !isExpanded && "hidden"
                )}>
                  {user?.name || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-3">
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}