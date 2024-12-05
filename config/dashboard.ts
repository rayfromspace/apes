import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Wallet,
  GraduationCap,
  Calendar,
  MessageSquare,
  Bell,
} from "lucide-react";

export type DashboardConfig = typeof dashboardConfig;

export const dashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: FileText,
      subItems: [
        { title: "All Projects", href: "/projects" },
        { title: "My Projects", href: "/projects/my" },
        { title: "Create New", href: "/projects/create" },
      ],
    },
    {
      title: "Community",
      href: "/community",
      icon: Users,
      subItems: [
        { title: "Members", href: "/community/members" },
        { title: "Connections", href: "/community/connections" },
        { title: "Messages", href: "/community/messages" },
      ],
    },
    {
      title: "Investments",
      href: "/investments",
      icon: Wallet,
      subItems: [
        { title: "Portfolio", href: "/investments/portfolio" },
        { title: "Opportunities", href: "/investments/opportunities" },
        { title: "Transactions", href: "/investments/transactions" },
      ],
    },
    {
      title: "Learning Pool",
      href: "/learning",
      icon: GraduationCap,
    },
  ],
  sidebarNav: [
    {
      title: "Calendar",
      href: "/calendar",
      icon: Calendar,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
      badge: "new",
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
  userNav: [
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Settings",
      href: "/settings",
    },
    {
      title: "Billing",
      href: "/billing",
    },
  ],
  footerNav: [
    {
      title: "Help",
      items: [
        { title: "Documentation", href: "/docs" },
        { title: "FAQs", href: "/faqs" },
        { title: "Support", href: "/support" },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Cookie Policy", href: "/cookies" },
      ],
    },
  ],
  dashboardCards: [
    {
      title: "Total Projects",
      metric: "projectCount",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Active Investments",
      metric: "activeInvestments",
      icon: Wallet,
      color: "green",
    },
    {
      title: "Community Members",
      metric: "communityMembers",
      icon: Users,
      color: "purple",
    },
    {
      title: "Learning Progress",
      metric: "learningProgress",
      icon: GraduationCap,
      color: "orange",
    },
  ],
} as const;
