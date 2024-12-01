"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/projects/dashboard/layout';
import { FounderDashboard } from '@/components/projects/dashboard/founder-dashboard';
import { CofounderDashboard } from '@/components/projects/dashboard/cofounder-dashboard';
import { BoardMemberDashboard } from '@/components/projects/dashboard/board-member-dashboard';
import { TeamMemberDashboard } from '@/components/projects/dashboard/team-member-dashboard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

// Demo projects data - in a real app, this would come from your API/database
const DEMO_PROJECTS = [
  { id: "1", title: "DeFi Trading Platform" },
  { id: "2", title: "AI Content Creator" },
];

interface ProjectDashboardProps {
  params: {
    id: string;
  };
}

export default function ProjectDashboard({ params }: ProjectDashboardProps) {
  const [userRole, setUserRole] = useState<'founder' | 'cofounder' | 'boardmember' | 'teammember'>('founder');
  const router = useRouter();
  const project = DEMO_PROJECTS.find(p => p.id === params.id);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <Select value={userRole} onValueChange={(value: any) => setUserRole(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="founder">Founder View</SelectItem>
            <SelectItem value="cofounder">Co-founder View</SelectItem>
            <SelectItem value="boardmember">Board Member View</SelectItem>
            <SelectItem value="teammember">Team Member View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-6">
        <DashboardLayout>
          {userRole === 'founder' && <FounderDashboard />}
          {userRole === 'cofounder' && <CofounderDashboard />}
          {userRole === 'boardmember' && <BoardMemberDashboard />}
          {userRole === 'teammember' && <TeamMemberDashboard />}
        </DashboardLayout>
      </div>
    </div>
  );
}