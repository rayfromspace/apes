"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  ArrowLeft,
  Calendar,
  MessageSquare,
  GitBranch,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
  projectTitle: string;
}

export function DashboardLayout({ children, userRole, projectTitle }: DashboardLayoutProps) {
  const router = useRouter();

  const navigation = [
    {
      name: 'Overview',
      href: '#overview',
      icon: BarChart3,
      roles: ['founder', 'cofounder', 'boardmember', 'teammember'],
    },
    {
      name: 'Team',
      href: '#team',
      icon: Users,
      roles: ['founder', 'cofounder', 'boardmember', 'teammember'],
    },
    {
      name: 'Documents',
      href: '#documents',
      icon: FileText,
      roles: ['founder', 'cofounder', 'boardmember'],
    },
    {
      name: 'Schedule',
      href: '#schedule',
      icon: Calendar,
      roles: ['founder', 'cofounder', 'boardmember', 'teammember'],
    },
    {
      name: 'Messages',
      href: '#messages',
      icon: MessageSquare,
      roles: ['founder', 'cofounder', 'boardmember', 'teammember'],
    },
    {
      name: 'Repository',
      href: '#repository',
      icon: GitBranch,
      roles: ['founder', 'cofounder', 'teammember'],
    },
    {
      name: 'Financials',
      href: '#financials',
      icon: DollarSign,
      roles: ['founder', 'cofounder', 'boardmember'],
    },
    {
      name: 'Settings',
      href: '#settings',
      icon: Settings,
      roles: ['founder'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card min-h-screen p-6">
          <div className="space-y-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg">{projectTitle}</h1>
              <p className="text-sm text-muted-foreground">Project Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation
              .filter(item => item.roles.includes(userRole))
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    "hover:bg-accent",
                    item.href === '#overview' && "bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))
            }
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card className="p-6">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}