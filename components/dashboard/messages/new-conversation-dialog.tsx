"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@/types/user";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function NewConversationDialog({ open, onOpenChange, projectId }: NewConversationDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const { createChat } = useMessagesStore();

  // Fetch project members
  React.useEffect(() => {
    const fetchProjectMembers = async () => {
      const supabase = createClientComponentClient();
      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          user:user_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error fetching project members:', error);
        return;
      }

      const projectUsers = members
        .map(member => member.user)
        .filter((user): user is User => !!user)
        .map(user => ({
          id: user.id,
          email: user.email || '',
          name: user.raw_user_meta_data?.full_name || user.email || 'Unknown User',
          avatar: user.raw_user_meta_data?.avatar_url
        }));

      setUsers(projectUsers);
    };

    if (open) {
      fetchProjectMembers();
    }
  }, [projectId, open]);

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedUsers.some((selected) => selected.id === user.id)
  );

  const handleUserSelect = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleStartConversation = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Select Users",
        description: "Please select at least one user to start a conversation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const chatName = selectedUsers.length === 1 
        ? undefined // For direct messages, we don't need a name
        : `${selectedUsers.map(u => u.name.split(' ')[0]).join(', ')}`;

      await createChat(
        projectId,
        chatName,
        selectedUsers.length === 1 ? 'direct' : 'group',
        selectedUsers.map(u => u.id)
      );

      toast({
        title: "Success",
        description: "Conversation created successfully.",
      });

      onOpenChange(false);
      setSelectedUsers([]);
      setSearchQuery("");
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full"
                >
                  <UserAvatar
                    user={user}
                    size="sm"
                    showHoverCard={false}
                  />
                  <span className="text-sm">{user.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleUserRemove(user.id)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div>
            <Label>Search Users</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type a name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[200px] border rounded-md">
            <div className="p-4 space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <UserAvatar
                    user={user}
                    size="sm"
                    showHoverCard={false}
                  />
                  <span className="text-sm">{user.name}</span>
                  {user.email && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {user.email}
                    </span>
                  )}
                </button>
              ))}
              {filteredUsers.length === 0 && searchQuery && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users found
                </p>
              )}
            </div>
          </ScrollArea>

          <Button
            className="w-full"
            onClick={handleStartConversation}
            disabled={loading}
          >
            {loading ? "Creating..." : "Start Conversation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
