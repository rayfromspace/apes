'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
  team_members?: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      email: string;
      name?: string;
      avatar_url?: string;
    };
  }>;
}

interface RecentRequestsProps {
  project: Project;
}

export function RecentRequests({ project }: RecentRequestsProps) {
  // For now, we'll show some demo requests
  const requests = [
    {
      id: 1,
      type: "Join Request",
      user: {
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar: null,
      },
      status: "pending",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      type: "Resource Request",
      user: {
        name: "Bob Smith",
        email: "bob@example.com",
        avatar: null,
      },
      status: "approved",
      date: new Date().toLocaleDateString(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={request.user.avatar || ''} alt="Avatar" />
                <AvatarFallback>
                  {request.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {request.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.type}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge 
                  variant={request.status === 'approved' ? 'default' : 'secondary'}
                >
                  {request.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {request.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
