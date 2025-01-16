"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Users } from "lucide-react";

interface Connection {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

// Mock data - replace with real data fetching
const mockConnections: Connection[] = [
  {
    id: "1",
    full_name: "Alice Johnson",
    email: "alice@example.com",
    avatar_url: "https://avatar.vercel.sh/alice",
    role: "Full Stack Developer"
  },
  {
    id: "2",
    full_name: "Bob Smith",
    email: "bob@example.com",
    avatar_url: "https://avatar.vercel.sh/bob",
    role: "Blockchain Engineer"
  },
  // Add more mock connections
];

export function ConnectionList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Connections
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Connections</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <UserAvatar
                  user={connection}
                  size="sm"
                  showHoverCard={false}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {connection.full_name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {connection.role}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
