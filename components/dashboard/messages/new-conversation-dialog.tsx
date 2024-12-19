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

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

// Demo users - replace with real data from your backend
const DEMO_USERS: User[] = [
  { id: "1", name: "Alice Johnson", avatar: "/avatars/01.png" },
  { id: "2", name: "Bob Smith", avatar: "/avatars/02.png" },
  { id: "3", name: "Charlie Brown", avatar: "/avatars/03.png" },
  { id: "4", name: "Diana Prince", avatar: "/avatars/04.png" },
];

export function NewConversationDialog({ open, onOpenChange }: NewConversationDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  const filteredUsers = DEMO_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.some((selected) => selected.id === user.id)
  );

  const handleUserSelect = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleStartConversation = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Select Users",
        description: "Please select at least one user to start a conversation.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement conversation creation logic
    console.log("Starting conversation with:", selectedUsers);
    onOpenChange(false);
    setSelectedUsers([]);
    setSearchQuery("");
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
                placeholder="Type a name..."
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
          >
            Start Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
