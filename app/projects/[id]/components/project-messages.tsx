"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquarePlus } from "lucide-react";
import { Chat } from "@/types/message";
import { cn } from "@/lib/utils";
import { ChatView } from "@/components/dashboard/messages/chat-view";
import { NewConversationDialog } from "@/components/dashboard/messages/new-conversation-dialog";
import { useMessagesStore } from "@/lib/stores/messages-store";

interface ProjectMessagesProps {
  projectId: string;
}

export function ProjectMessages({ projectId }: ProjectMessagesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string>();
  const [showNewConversation, setShowNewConversation] = useState(false);
  
  const { chats, loading, error, fetchChats, markAsRead, subscribeToProjectChats } = useMessagesStore();

  useEffect(() => {
    // Fetch initial chats
    fetchChats(projectId);

    // Subscribe to chat updates
    const unsubscribe = subscribeToProjectChats(projectId);
    return () => {
      unsubscribe();
    };
  }, [projectId, fetchChats, subscribeToProjectChats]);

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    markAsRead(chatId);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    console.error('Error loading chats:', error);
  }

  return (
    <div className="grid gap-6 h-full md:grid-cols-[350px_1fr]">
      {/* Chat List */}
      <Card className="h-full flex flex-col">
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading chats...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No chats found</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent",
                    selectedChat === chat.id && "bg-accent"
                  )}
                  onClick={() => handleChatSelect(chat.id)}
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
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat View */}
      {selectedChat ? (
        <ChatView chatId={selectedChat} />
      ) : (
        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        projectId={projectId}
      />
    </div>
  );
}
