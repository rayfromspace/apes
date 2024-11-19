"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Search,
  DollarSign,
  Users,
  MessageSquare,
  UserPlus,
  Settings,
  HelpCircle,
  Bell,
  BookOpen,
  BarChart,
  Rocket
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: any
  description?: string
}

interface NavSectionProps {
  items: NavItem[]
  title?: string
  collapsed?: boolean
}

export function DashboardNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()

  const mainItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Dashboard overview and key metrics",
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
      description: "Manage your projects",
    },
    {
      title: "Explore",
      href: "/dashboard/explore",
      icon: Search,
      description: "Discover new projects",
    },
    {
      title: "Investments",
      href: "/dashboard/investments",
      icon: DollarSign,
      description: "Track your investments",
    },
  ]

  const communicationItems = [
    {
      title: "Team",
      href: "/dashboard/team",
      icon: Users,
      description: "Manage team members",
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      description: "Chat with collaborators",
    },
    {
      title: "Recruitment",
      href: "/dashboard/content/recruitment",
      icon: UserPlus,
      description: "Post jobs and find co-founders",
    },
  ]

  const otherItems = [
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
      description: "View detailed analytics",
    },
    {
      title: "Learning",
      href: "/dashboard/learning",
      icon: BookOpen,
      description: "Access learning resources",
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "View notifications",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Manage your account",
    },
    {
      title: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
      description: "Get help and support",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="p-4">
        <Link href="/" className={cn(
          "flex items-center mb-8",
          collapsed ? "justify-center" : "space-x-2"
        )}>
          <Rocket className="h-6 w-6" />
          {!collapsed && <span className="font-bold">Colab Apes</span>}
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          <NavSection items={mainItems} collapsed={collapsed} />
          <NavSection title="Communication" items={communicationItems} collapsed={collapsed} />
          <NavSection title="Other" items={otherItems} collapsed={collapsed} />
        </div>
      </div>
    </div>
  )
}

function NavSection({ items, title, collapsed }: NavSectionProps) {
  const pathname = usePathname()

  return (
    <div className="pb-4">
      {title && !collapsed && (
        <h4 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
          {title}
        </h4>
      )}
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                collapsed && "justify-center w-10 px-0"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0",
                !collapsed && "mr-2"
              )} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}