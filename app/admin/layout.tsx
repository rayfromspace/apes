import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { LayoutDashboard, Users, FolderGit2, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

async function getUser(email: string) {
  return await db.user.findUnique({
    where: { email },
    select: { role: true }
  });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is admin
  const user = await getUser('blackwoodroen@gmail.com');
  
  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const navigationItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="font-bold">Admin Dashboard</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
