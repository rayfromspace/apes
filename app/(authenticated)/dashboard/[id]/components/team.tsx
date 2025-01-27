'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
  team_members?: Array<{
    id: string;
    role: string;
    user_id: string;
  }>;
  team_profiles?: Array<{
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url: string;
    user_metadata?: {
      name?: string;
      avatar_url?: string;
    };
  }>;
}

interface TeamPageProps {
  project: Project;
  userRole: string | null;
}

export function TeamPage({ project, userRole }: TeamPageProps) {
  const canManageTeam = userRole === 'founder' || userRole === 'admin';
  const members = project.team_members || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Team Members</h2>
        {canManageTeam && (
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Founder Card */}
        <Card>
          <CardHeader>
            <CardTitle>Founder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">Project Founder</p>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        {members.map((member) => {
          const profile = project.team_profiles?.find(p => p.id === member.user_id);
          
          return (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || profile?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback>
                      {profile?.full_name?.[0]?.toUpperCase() || 
                       profile?.username?.[0]?.toUpperCase() ||
                       profile?.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {profile?.full_name || 
                         profile?.username || 
                         profile?.user_metadata?.name || 
                         profile?.email}
                      </p>
                      <Badge variant="secondary">
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Member Card */}
        {canManageTeam && members.length < 8 && (
          <Card className="border-dashed">
            <CardContent className="p-6">
              <Button variant="ghost" className="w-full h-full py-8">
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-8 w-8" />
                  <span>Add Team Member</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
