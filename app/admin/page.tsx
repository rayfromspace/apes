import { db } from '@/lib/db';
import { Card } from "@/components/ui/card";
import { Users, FolderGit2, TrendingUp, Activity } from 'lucide-react';

async function getStats() {
  const [userCount, projectCount] = await Promise.all([
    db.user.count(),
    db.project.count(),
  ]);

  return {
    userCount,
    projectCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Users</h3>
          </div>
          <p className="text-2xl font-bold">{stats.userCount}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Active Projects</h3>
          </div>
          <p className="text-2xl font-bold">{stats.projectCount}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Value Staked</h3>
          </div>
          <p className="text-2xl font-bold">$25,431</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Platform Activity</h3>
          </div>
          <p className="text-2xl font-bold">89%</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            {/* Add activity feed here */}
          </div>
        </Card>
        
        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-medium">Quick Actions</h3>
            <div className="mt-4 space-y-4">
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                Manage Users
              </button>
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                Review Projects
              </button>
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                View Analytics
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
