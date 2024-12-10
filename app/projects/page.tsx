import { Suspense } from 'react';
import { ProjectList } from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Discover and collaborate on innovative projects
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  );
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 rounded-lg border bg-card animate-pulse"
        >
          <div className="space-y-3">
            <div className="h-4 w-1/4 bg-muted rounded" />
            <div className="h-3 w-3/4 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
