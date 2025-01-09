"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Image, Paperclip } from "lucide-react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";

interface ChatViewProps {
  chatId: string;
}

export function ChatView({ chatId }: ChatViewProps) {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>();
  const { messages, currentChat, participants, loading, error, fetchMessages, fetchParticipants, sendMessage, subscribeToChat } = useMessagesStore();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch messages and participants
  useEffect(() => {
    fetchMessages(chatId);
    fetchParticipants(chatId);

    // Subscribe to new messages
    const unsubscribe = subscribeToChat(chatId);
    return () => {
      unsubscribe();
    };
  }, [chatId, fetchMessages, fetchParticipants, subscribeToChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage(chatId, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    console.error('Error in chat view:', error);
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentChat?.type === 'group' ? '/avatars/team.png' : participants?.[0]?.user?.raw_user_meta_data?.avatar_url} />
            <AvatarFallback>
              {currentChat?.name?.[0] || 'C'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {currentChat?.name || (participants?.[0]?.user?.raw_user_meta_data?.full_name || 'Chat')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {participants?.length} {participants?.length === 1 ? 'member' : 'members'}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender_id === currentUserId ? "justify-end" : "justify-start"
                )}
              >
                {message.sender_id !== currentUserId && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={message.sender?.raw_user_meta_data?.avatar_url} />
                    <AvatarFallback>
                      {message.sender?.raw_user_meta_data?.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message.sender_id === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.sender_id !== currentUserId && (
                    <p className="text-xs font-medium mb-1">
                      {message.sender?.raw_user_meta_data?.full_name || message.sender?.email || 'Unknown User'}
                    </p>
                  )}
                  <p>{message.content}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled>
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
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
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
