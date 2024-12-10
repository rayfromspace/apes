"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Image, Paperclip } from "lucide-react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";

// Demo data - replace with real data from your backend
const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    sender_id: "2",
    chat_id: "1",
    content: "Hi team! I've just pushed the latest updates.",
    type: "text",
    read: true,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    sender_id: "1",
    chat_id: "1",
    content: "Great! I'll review it shortly.",
    type: "text",
    read: true,
    created_at: "2024-01-20T10:05:00Z",
    updated_at: "2024-01-20T10:05:00Z",
  },
];

interface ChatViewProps {
  chatId: string;
}

export function ChatView({ chatId }: ChatViewProps) {
  const [messages] = useState<Message[]>(DEMO_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = "1"; // Replace with actual user ID from auth

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Add message sending logic here
    setNewMessage("");
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatars/team.png" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Team Alpha</h3>
            <p className="text-sm text-muted-foreground">3 members</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender_id === currentUserId ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.sender_id === currentUserId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
