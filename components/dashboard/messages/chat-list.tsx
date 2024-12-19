"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquarePlus } from "lucide-react";
import { Chat } from "@/types/message";
import { cn } from "@/lib/utils";
import { NewConversationDialog } from "./new-conversation-dialog";

// Demo data - replace with real data from your backend
const DEMO_CHATS: Chat[] = [
  {
    id: "1",
    name: "Team Alpha",
    type: "group",
    participants: ["1", "2", "3"],
    unread_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message: {
      id: "1",
      sender_id: "2",
      chat_id: "1",
      content: "Let's review the project timeline",
      type: "text",
      read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "2",
    type: "direct",
    participants: ["1", "4"],
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message: {
      id: "2",
      sender_id: "4",
      chat_id: "2",
      content: "Thanks for the update!",
      type: "text",
      read: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

interface ChatListProps {
  selectedChat?: string;
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ selectedChat, onChatSelect }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats] = useState<Chat[]>(DEMO_CHATS);
  const [showNewConversation, setShowNewConversation] = useState(false);

  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => setShowNewConversation(true)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="sr-only">New Conversation</span>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent",
                selectedChat === chat.id && "bg-accent"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <Avatar>
                <AvatarImage src={`/avatars/${chat.id}.png`} />
                <AvatarFallback>
                  {chat.name?.[0] || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">
                    {chat.name || "Direct Message"}
                  </p>
                  {chat.unread_count > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
                {chat.last_message && (
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.last_message.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
      />
    </Card>
  );
}
