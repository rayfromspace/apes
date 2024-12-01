"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

const SUGGESTED_USERS = [
  {
    name: "Elena Martinez",
    role: "Full Stack Developer",
    avatar: "https://avatar.vercel.sh/elena",
  },
  {
    name: "James Wilson",
    role: "Product Designer",
    avatar: "https://avatar.vercel.sh/james",
  },
  {
    name: "Sophia Lee",
    role: "AI Researcher",
    avatar: "https://avatar.vercel.sh/sophia",
  },
];

export function CommunitySidebar() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search community..." className="pl-9" />
      </div>

      <div>
        <h2 className="font-semibold mb-4">Who to follow</h2>
        <div className="space-y-3">
          {SUGGESTED_USERS.map((user) => (
            <Card key={user.name} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
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