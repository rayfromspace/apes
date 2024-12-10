"use client";

import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

interface ProjectTeamProps {
  project: Project;
  canManageTeam: boolean;
}

export function ProjectTeam({ project, canManageTeam }: ProjectTeamProps) {
  const members = project.members || [];
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Team Management */}
        {canManageTeam && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        )}
        
        {/* Team List */}
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`/avatars/${member.userId}.png`} />
                <AvatarFallback>
                  {member.userId[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">User Name</p>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {member.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Member Button */}
        {canManageTeam && members.length < 8 && (
          <Button variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        )}
      </div>
    </Card>
  );
}
