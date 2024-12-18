"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";

const SUGGESTED_USERS = [
  {
    id: "1",
    name: "Elena Martinez",
    role: "Full Stack Developer",
    avatar: "https://avatar.vercel.sh/elena",
  },
  {
    id: "2",
    name: "James Wilson",
    role: "Product Designer",
    avatar: "https://avatar.vercel.sh/james",
  },
  {
    id: "3",
    name: "Sophia Lee",
    role: "AI Researcher",
    avatar: "https://avatar.vercel.sh/sophia",
  },
];

export function ExploreSidebar() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search projects and creators..." className="pl-9" />
      </div>

      <div>
        <h2 className="font-semibold mb-4">Recommended Creators</h2>
        <div className="space-y-3">
          {SUGGESTED_USERS.map((user) => (
            <Card key={user.name} className="p-4">
              <div className="flex items-center gap-3">
                <UserAvatar 
                  user={{
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role
                  }}
                  showHoverCard={true}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.role}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <Button variant="link" className="w-full mt-2">
          Show more
        </Button>
      </div>
    </div>
  );
}