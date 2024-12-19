"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Settings,
  UserPlus,
  UserMinus,
  LogOut,
  MoreVertical,
  Bell,
  BellOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "./chat-interface";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  status: "online" | "offline";
  lastSeen?: string;
}

interface GroupChat {
  id: string;
  name: string;
  avatar: string;
  description: string;
  members: GroupMember[];
  createdAt: string;
}

const group: GroupChat = {
  id: "1",
  name: "Web3 Developers",
  avatar: "/groups/web3-devs.jpg",
  description: "A community of blockchain and Web3 developers",
  members: [
    {
      id: "1",
      name: "John Doe",
      avatar: "/avatars/john.jpg",
      role: "admin",
      status: "online",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "/avatars/jane.jpg",
      role: "moderator",
      status: "offline",
      lastSeen: "2023-12-18T20:30:00Z",
    },
    // Add more members as needed
  ],
  createdAt: "2023-01-01T00:00:00Z",
};

export default function GroupChat() {
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [muted, setMuted] = useState(false);

  const handleAddMember = () => {
    // Add member logic here
  };

  const handleRemoveMember = (memberId: string) => {
    // Remove member logic here
  };

  const handleLeaveGroup = () => {
    // Leave group logic here
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  const formatLastSeen = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={group.avatar} />
              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{group.name}</h2>
                <Badge variant="secondary">
                  {group.members.length} members
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMembers(true)}
                >
                  <Users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Members</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Group Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMuteToggle}>
                  {muted ? (
                    <>
                      <BellOff className="h-4 w-4 mr-2" />
                      Unmute Group
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Mute Group
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLeaveGroup}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ChatInterface
          recipientId={group.id}
          recipientName={group.name}
          recipientAvatar={group.avatar}
          onSendMessage={(content) => {
            // Handle group message sending
          }}
        />
      </div>

      {/* Members Sidebar */}
      <Dialog open={showMembers} onOpenChange={setShowMembers}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>
              {group.members.length} members in this group
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Search members..."
              className="mb-4"
            />
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                            member.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                        {member.status === "offline" && member.lastSeen && (
                          <p className="text-xs text-muted-foreground">
                            Last seen: {formatLastSeen(member.lastSeen)}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        {member.role !== "admin" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive"
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove from Group
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4">
              <Button onClick={handleAddMember} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
            <DialogDescription>
              Manage group preferences and settings
            </DialogDescription>
          </DialogHeader>
          {/* Add group settings form here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
