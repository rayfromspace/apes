"use client";

import { useTestAuth } from "@/providers/test-auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserSwitcher() {
  const { currentUser, switchUser } = useTestAuth();

  const users = [
    { id: "user-1", name: "Test User 1" },
    { id: "user-2", name: "Test User 2" },
    { id: "user-3", name: "Test User 3" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${currentUser}.png`} alt={currentUser} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => switchUser(user.id)}
            className="cursor-pointer"
          >
            Switch to {user.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
