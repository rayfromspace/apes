"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ProjectApi, type Project } from '@/lib/api/project-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { formatDistanceToNow } from 'date-fns';

interface ProjectListProps {
  status?: string;
  category?: string;
  visibility?: string;
}

export function ProjectList({ status, category, visibility }: ProjectListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects', { status, category, visibility }],
    queryFn: () => ProjectApi.listProjects({ status, category, visibility }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Failed to load projects</p>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No projects found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link
              href={`/projects/${project.id}`}
              className="text-xl font-semibold hover:underline"
            >
              {project.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
              {project.category && (
                <Badge variant="outline">{project.category}</Badge>
              )}
              <span>•</span>
              <span>
                Created {formatDistanceToNow(new Date(project.created_at))} ago
              </span>
            </div>
          </div>
          <ProjectVisibilityBadge visibility={project.visibility} />
        </div>
      </CardHeader>
      {project.description && (
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="gap-4">
        {project.funding_goal && (
          <div className="flex items-center gap-2 text-sm">
            <Icons.dollarSign className="h-4 w-4" />
            <span>
              ${project.raised_amount.toLocaleString()} / $
              {project.funding_goal.toLocaleString()}
            </span>
          </div>
        )}
        {project.tags.length > 0 && (
          <div className="flex items-center gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function ProjectVisibilityBadge({ visibility }: { visibility: Project['visibility'] }) {
  const icon = {
    private: <Icons.lock className="h-4 w-4" />,
    public: <Icons.globe className="h-4 w-4" />,
    unlisted: <Icons.link className="h-4 w-4" />,
  }[visibility];

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {icon}
      <span className="capitalize">{visibility}</span>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
      </CardContent>
      <CardFooter className="gap-4">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}
