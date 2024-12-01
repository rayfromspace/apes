"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, UserPlus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface ProjectContributorsProps {
  team: TeamMember[];
  onAddMember?: (role: string) => Promise<void>;
  onRemoveMember?: (id: string) => Promise<void>;
}

export function ProjectContributors({
  team,
  onAddMember,
  onRemoveMember,
}: ProjectContributorsProps) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>();
  const { toast } = useToast();

  const handleAddMember = async () => {
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a role for the new team member.",
      });
      return;
    }

    try {
      setIsAddingMember(true);
      if (onAddMember) {
        await onAddMember(selectedRole);
      }
      toast({
        title: "Team member added",
        description: "The new team member has been added successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add team member. Please try again.",
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      if (onRemoveMember) {
        await onRemoveMember(id);
      }
      toast({
        title: "Team member removed",
        description: "The team member has been removed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove team member. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Project Team</h2>
          <p className="text-sm text-muted-foreground">
            Manage project contributors and their roles
          </p>
        </div>
        {onAddMember && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to the project team
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="product_manager">
                        Product Manager
                      </SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="advisor">Advisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddMember}
                  disabled={isAddingMember || !selectedRole}
                >
                  {isAddingMember && (
                    <Plus className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {onRemoveMember && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
