"use client";

import { FounderDashboard } from '@/components/projects/dashboard/founder-dashboard';

interface ProjectDashboardProps {
  params: {
    id: string;
  };
}

export default function ProjectDashboardPage({ params }: ProjectDashboardProps) {
  return (
    <div className="container mx-auto p-6">
      <FounderDashboard />
    </div>
  );
}
