"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Edit2,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Users,
} from "lucide-react";

interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar: string;
  lastMessage: {
    content: string;
    sender: string;
    timestamp: string;
    status: "sent" | "delivered" | "read";
  };
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  participants?: {
    count: number;
    online: number;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
  onNewGroup,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");

  const filteredConversations = conversations
    .filter((conv) => {
      const matchesSearch = conv.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && conv.unreadCount > 0) ||
        (filter === "archived" && conv.isArchived);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort pinned conversations first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by last message timestamp
      return new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime();
    });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  const truncateMessage = (message: string, length: number = 50) => {
    if (message.length <= length) return message;
    return message.substring(0, length) + "...";
  };

  return (
    <div className="h-full flex flex-col border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-4">Messages</h2>
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onNewChat}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onNewGroup}
          >
            <Users className="h-4 w-4 mr-2" />
            New Group
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-2 gap-2 border-b">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1"
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("unread")}
          className="flex-1"
        >
          Unread
        </Button>
        <Button
          variant={filter === "archived" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("archived")}
          className="flex-1"
        >
          Archived
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                selectedId === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelect(conversation.id)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>
                    {conversation.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {conversation.type === "group" && conversation.participants && (
                  <Badge
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 text-xs"
                  >
                    {conversation.participants.online}/{conversation.participants.count}
                  </Badge>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">
                    {conversation.name}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.type === "group" && (
                      <span className="font-medium">
                        {conversation.lastMessage.sender}:{" "}
                      </span>
                    )}
                    {truncateMessage(conversation.lastMessage.content)}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pin className="h-4 w-4 mr-2" />
                    {conversation.isPinned ? "Unpin" : "Pin"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    {conversation.isArchived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
